import "../../vendor/jszip.min.js";
import "../../vendor/papaparse.min.js";
import { createAppController, createDefaultCharacterV2 } from "./core/index.js";
import { V2ZipIO, validateAndFixImportPayload } from "./io/index.js";
import { mountV2UI } from "./ui/app-ui.js";
import { STANDALONE_CATALOG } from "./catalog-standalone.js";

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
  subclasses: [],
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
    return { ok: true, queued: true, attempted: false, saved: false };
  }

  saveInFlight = true;
  try {
    const state = store.getState();
    if (!state.character) {
      return { ok: false, attempted: false, saved: false, reason: "no-character" };
    }
    if (!state.app.dirty) {
      return { ok: true, attempted: false, saved: false, reason: "not-dirty" };
    }
    const result = await controller.saveActiveCharacter({ makeActive });
    if (result.ok) {
      writeLocalBackup(store.getState().character);
      return { ok: true, attempted: true, saved: true, result };
    }
    return {
      ok: false,
      attempted: true,
      saved: false,
      errors: result?.errors || ["Save failed."]
    };
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
  const selected = STANDALONE_CATALOG[id] || STANDALONE_CATALOG.dnd5e_2014;
  catalog = {
    rulesetId: selected.rulesetId,
    classes: selected.classes,
    subclasses: selected.subclasses || [],
    species: selected.species,
    spells: selected.spells,
    error: ""
  };
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

function normText(v) {
  return (v ?? "").toString().trim().toLowerCase();
}

function policyBadge(row) {
  const mode = row?.availability?.default;
  if (mode === "requires_dm_approval") return "DM Approval";
  return "Core";
}

function formatSubtitle(kind, row) {
  const src = (row?.source || "UNKNOWN").toString();
  if (kind === "spell") {
    const cls = Array.isArray(row?.classes) ? row.classes.join(", ") : "";
    return `Level ${row?.level ?? 0} · ${row?.school || "Unknown school"}${cls ? ` · ${cls}` : ""}`;
  }
  return `${kind} · ${src} · ${policyBadge(row)}`;
}

function isAllowedByPolicy(row, policyMode) {
  if (policyMode !== "core_only") return true;
  return (row?.availability?.default || "allowed") !== "requires_dm_approval";
}

ui = mountV2UI({
  root,
  getState: () => store.getState(),
  actions: {
    getCatalog: () => catalog,
    getRuntimeStatus: () => ({ ...runtimeStatus }),
    lookupProvider: ({ type, query = "", filters = {} } = {}) => {
      const q = normText(query);
      const policyMode = filters.policyMode || "all_official";
      if (type === "class") {
        return (catalog.classes || [])
          .filter((row) => isAllowedByPolicy(row, policyMode))
          .filter((row) => !q || normText(row?.name || row?.id).includes(q))
          .slice(0, 40)
          .map((row) => ({
            id: (row?.id || "").toString(),
            title: (row?.name || row?.id || "").toString(),
            subtitle: formatSubtitle("Class", row),
            raw: row
          }));
      }
      if (type === "species") {
        return (catalog.species || [])
          .filter((row) => isAllowedByPolicy(row, policyMode))
          .filter((row) => !q || normText(row?.name || row?.id).includes(q))
          .slice(0, 40)
          .map((row) => ({
            id: (row?.id || "").toString(),
            title: (row?.name || row?.id || "").toString(),
            subtitle: formatSubtitle("Species", row),
            raw: row
          }));
      }
      if (type === "subclass") {
        const classFilters = Array.isArray(filters.classIds)
          ? filters.classIds.map(normText).filter(Boolean)
          : [];
        const primaryClassFilter = normText(filters.classId || "");
        return (catalog.subclasses || [])
          .filter((row) => isAllowedByPolicy(row, policyMode))
          .filter((row) => {
            const rowClassId = normText(row?.class_id);
            const classMatch = classFilters.length
              ? classFilters.includes(rowClassId)
              : (!primaryClassFilter || rowClassId === primaryClassFilter);
            return classMatch && (!q || normText(row?.name || row?.id).includes(q));
          })
          .slice(0, 60)
          .map((row) => ({
            id: (row?.id || "").toString(),
            title: (row?.name || row?.id || "").toString(),
            subtitle: `${formatSubtitle("Subclass", row)} · ${row?.class_id || "class"}`,
            raw: row
          }));
      }
      if (type === "spell") {
        const classFilter = Array.isArray(filters.classIds) ? filters.classIds.map(normText).filter(Boolean) : [];
        const subclassFilter = Array.isArray(filters.subclassIds) ? filters.subclassIds.map(normText).filter(Boolean) : [];
        const allowOffClassSpells = Boolean(filters.allowOffClassSpells);
        const levelFilter = filters.level === "" || filters.level == null ? "" : Number.parseInt(`${filters.level}`, 10);
        const subclassRows = (catalog.subclasses || []).filter((row) => subclassFilter.includes(normText(row?.id)));
        return (catalog.spells || [])
          .filter((row) => {
            if (q && !normText(row?.name || row?.id).includes(q)) return false;
            const rowLevel = Number.parseInt(`${row?.level ?? 0}`, 10);
            if (Number.isFinite(levelFilter) && rowLevel !== levelFilter) return false;
            if (!allowOffClassSpells && classFilter.length > 0) {
              const classes = Array.isArray(row?.classes) ? row.classes.map(normText) : [];
              const school = normText(row?.school || "");
              const baseClassMatch = classes.some((id2) => classFilter.includes(id2));
              const subclassExpandedMatch = subclassRows.some((sub) => {
                const access = sub?.spell_access || {};
                const extraClasses = Array.isArray(access.class_ids) ? access.class_ids.map(normText).filter(Boolean) : [];
                if (!extraClasses.length || !classes.some((id2) => extraClasses.includes(id2))) return false;
                const schoolAllow = Array.isArray(access.schools) ? access.schools.map(normText).filter(Boolean) : [];
                if (!schoolAllow.length) return true;
                return schoolAllow.includes(school);
              });
              if (!baseClassMatch && !subclassExpandedMatch) return false;
            }
            return true;
          })
          .slice(0, 60)
          .map((row) => ({
            id: (row?.id || row?.name || "").toString(),
            title: (row?.name || row?.id || "").toString(),
            subtitle: formatSubtitle("spell", row),
            raw: row
          }));
      }
      return [];
    },
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
      if (!store.getState().character) {
        setRuntimeStatus("Export failed: no character loaded.", "warn");
        return;
      }

      try {
        const save = await flushSave({ makeActive: true });
        if (!save.ok) {
          setRuntimeStatus(`Export blocked: ${(save.errors || []).join(" ") || "save failed."}`, "error");
          return;
        }
        const latest = store.getState();
        await V2ZipIO.exportZipToDownload(latest.character);
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
      try {
        const save = await flushSave({ makeActive: true });
        if (!save.ok) {
          setRuntimeStatus(`Export PDF blocked: ${(save.errors || []).join(" ") || "save failed."}`, "error");
          return;
        }
        const latest = store.getState();
        if (globalThis?.LivingCodexPdfHtml?.openPrintableHtml) {
          await globalThis.LivingCodexPdfHtml.openPrintableHtml(latest.character, catalog);
        } else {
          throw new Error("PDF HTML renderer not loaded");
        }
        setRuntimeStatus("Exported PDF.", "success");
      } catch (err) {
        setRuntimeStatus(`Export PDF failed: ${err?.message || String(err)}`, "error");
      }
    },

    saveNow: async () => {
      const save = await flushSave({ makeActive: true });
      if (!save.ok) {
        setRuntimeStatus(`Save failed: ${(save.errors || []).join(" ") || "unknown error"}`, "error");
        return;
      }
      if (!save.attempted) {
        if (save.reason === "no-character") setRuntimeStatus("Save skipped: no character loaded.", "warn");
        else setRuntimeStatus("No changes to save.", "info");
        return;
      }
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

  let state = store.getState();
  if (!state.character) {
    const backup = readLocalBackup();
    if (backup) {
      const parsed = validateAndFixImportPayload(backup);
      controller.applyImportedCharacter(parsed);
      if (parsed.ok) await flushSave({ makeActive: true });
      if (parsed.ok) setRuntimeStatus("Recovered character from local backup.", "success");
    }
    state = store.getState();
    if (!state.character) {
      const listed = await V2Storage.listCharacters();
      if (Array.isArray(listed) && listed.length > 0) {
        const mostRecent = listed[0];
        const loaded = await controller.loadCharacterById(mostRecent.id);
        if (loaded?.ok) setRuntimeStatus(`Recovered most recent character: ${mostRecent.name || mostRecent.id}.`, "success");
      }
    }
  } else {
    setRuntimeStatus("Loaded active character from storage.", "success");
  }

  const activeRuleset = store.getState().character?.meta?.ruleset_id || "dnd5e_2014";
  await ensureCatalog(activeRuleset);
  ui.render();
})();
