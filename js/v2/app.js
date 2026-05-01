import { createAppController, createDefaultCharacterV2 } from "./core/index.js";
import { V2ZipIO, validateAndFixImportPayload } from "./io/index.js";
import { mountV2UI } from "./ui/app-ui.js";

const root = document.getElementById("v2AppRoot");
if (!root) throw new Error("Missing #v2AppRoot mount element");

const controller = createAppController();
const store = controller.store;
let ui = null;

const LOCAL_BACKUP_KEY = "living-codex-v2.backup";

let autosaveTimer = null;
const AUTOSAVE_MS = 220;
let saveInFlight = false;
let saveQueued = false;

let catalog = {
  rulesetId: "dnd5e_2014",
  classes: [],
  species: [],
  spells: [],
  error: ""
};

const runtimeStatus = {
  message: "",
  at: "",
  tone: "info"
};

function setRuntimeStatus(message, tone = "info") {
  runtimeStatus.message = message || "";
  runtimeStatus.at = new Date().toISOString();
  runtimeStatus.tone = tone;
  if (ui) ui.render();
}

function clampAbilityScore(v) {
  const n = Number.parseInt((v ?? "").toString(), 10);
  if (!Number.isFinite(n)) return 10;
  return Math.max(1, Math.min(30, n));
}

function readLocalBackup() {
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeLocalBackup(character) {
  try {
    if (!character) return;
    localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(character));
  } catch {
    // Ignore backup write errors.
  }
}

async function flushSave({ makeActive = true } = {}) {
  if (saveInFlight) {
    saveQueued = true;
    return;
  }

  saveInFlight = true;
  try {
    const state = store.getState();
    if (!state.app.dirty || !state.character) return;
    const result = await controller.saveActiveCharacter({ makeActive });
    if (result.ok) writeLocalBackup(store.getState().character);
  } finally {
    saveInFlight = false;
    if (saveQueued) {
      saveQueued = false;
      await flushSave({ makeActive: true });
    }
  }
}

function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    flushSave({ makeActive: true });
  }, AUTOSAVE_MS);
}

async function ensureCatalog(rulesetId = "dnd5e_2014") {
  const id = (rulesetId || "").toString().trim() || "dnd5e_2014";

  try {
    const mod = await import(new URL("../../rules/rulesdb.js", import.meta.url).href);
    const db = await mod.RulesDB.load(id);
    catalog = {
      rulesetId: id,
      classes: db?.classes?.list?.() || [],
      species: db?.species?.list?.() || [],
      spells: db?.spells?.list?.() || [],
      error: ""
    };
  } catch (err) {
    catalog = {
      rulesetId: id,
      classes: [],
      species: [],
      spells: [],
      error: err?.message || String(err)
    };
  }

  ui.render();
}

async function pickZipFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";
    input.style.display = "none";

    input.addEventListener("change", () => {
      const file = input.files && input.files[0] ? input.files[0] : null;
      input.remove();
      resolve(file);
    });

    document.body.appendChild(input);
    input.click();
  });
}

ui = mountV2UI({
  root,
  getState: () => store.getState(),
  actions: {
    getCatalog: () => catalog,
    getRuntimeStatus: () => ({ ...runtimeStatus }),
    ensureCatalog,

    newCharacter: async (draft) => {
      const name = (draft?.name || "New Character").toString().trim() || "New Character";
      const rulesetId = (draft?.rulesetId || "dnd5e_2014").toString().trim() || "dnd5e_2014";
      const classId = (draft?.classId || "").toString().trim().toLowerCase();
      const speciesId = (draft?.speciesId || "").toString().trim().toLowerCase();

      const character = createDefaultCharacterV2({ name, rulesetId, classId, speciesId });
      if (draft && typeof draft === "object") {
        character.abilities.str = clampAbilityScore(draft.str);
        character.abilities.dex = clampAbilityScore(draft.dex);
        character.abilities.con = clampAbilityScore(draft.con);
        character.abilities.int = clampAbilityScore(draft.int);
        character.abilities.wis = clampAbilityScore(draft.wis);
        character.abilities.cha = clampAbilityScore(draft.cha);
      }
      await controller.createNewCharacter(character);
      await flushSave({ makeActive: true });
      await ensureCatalog(rulesetId);
      setRuntimeStatus(`Created character '${name}'.`, "success");
    },

    importZip: async () => {
      try {
        const file = await pickZipFile();
        if (!file) return;

        setRuntimeStatus(`Importing '${file.name}'...`, "info");
        const result = await V2ZipIO.importZipFromFile(file);
        const applied = controller.applyImportedCharacter(result);

        if (result.ok && applied.ok) {
          await flushSave({ makeActive: true });
          const ruleset = store.getState().character?.meta?.ruleset_id || "dnd5e_2014";
          await ensureCatalog(ruleset);
          setRuntimeStatus(`Import succeeded (${result.report?.fixes_applied?.length || 0} auto-fixes).`, "success");
        } else {
          setRuntimeStatus(`Import blocked (${result.report?.blocked?.length || 0} issues).`, "warn");
        }
      } catch (err) {
        const message = err?.message || String(err);
        setRuntimeStatus(`Import failed: ${message}`, "error");
      }
    },

    exportZip: async () => {
      const state = store.getState();
      if (!state.character) {
        setRuntimeStatus("Export failed: no character loaded.", "warn");
        return;
      }

      try {
        await V2ZipIO.exportZipToDownload(state.character);
        scheduleAutosave();
        setRuntimeStatus("Exported ZIP.", "success");
      } catch (err) {
        setRuntimeStatus(`Export failed: ${err?.message || String(err)}`, "error");
      }
    },

    exportPdf: async () => {
      const state = store.getState();
      if (!state.character) {
        setRuntimeStatus("Export PDF failed: no character loaded.", "warn");
        return;
      }
      setRuntimeStatus("Opening print dialog (Save as PDF)...", "info");
      setTimeout(() => window.print(), 30);
    },

    saveNow: async () => {
      await flushSave({ makeActive: true });
      setRuntimeStatus("Saved character.", "success");
    },

    undo: () => {
      store.undo();
      scheduleAutosave();
      setRuntimeStatus("Undo.", "info");
    },

    redo: () => {
      store.redo();
      scheduleAutosave();
      setRuntimeStatus("Redo.", "info");
    },

    canUndo: () => store.canUndo(),
    canRedo: () => store.canRedo(),

    updateCharacter: (mutator) => {
      store.updateCharacter(mutator);
      writeLocalBackup(store.getState().character);
      scheduleAutosave();
      setRuntimeStatus("Edited character.", "info");
    }
  }
});

controller.events.on("state:changed", () => {
  ui.render();
});

window.addEventListener("beforeunload", () => {
  const state = store.getState();
  if (state.character) writeLocalBackup(state.character);
});

(async () => {
  await controller.bootstrap();

  const state = store.getState();
  if (!state.character) {
    const backup = readLocalBackup();
    if (backup) {
      const parsed = validateAndFixImportPayload(backup);
      controller.applyImportedCharacter(parsed);
      if (parsed.ok) await flushSave({ makeActive: true });
      if (parsed.ok) setRuntimeStatus("Recovered character from local backup.", "success");
    }
  } else {
    setRuntimeStatus("Loaded active character from storage.", "success");
  }

  const activeRuleset = store.getState().character?.meta?.ruleset_id || "dnd5e_2014";
  await ensureCatalog(activeRuleset);
  ui.render();
})();
