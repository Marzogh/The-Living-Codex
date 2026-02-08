import { createDefaultCharacter } from "./state.js";
import { Autosave } from "./autosave.js";
import { ZipIO } from "./zipio.js";
import { Validator } from "./validate.js";
import { mountEditor } from "./ui/editor.js";
import { mountInventory } from "./ui/inventory.js";
import { mountSpells } from "./ui/spells.js";
import { mountLog } from "./ui/log.js";


const $ = (id) => document.getElementById(id);

function pickZipFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";
    input.style.display = "none";

    let settled = false;

    function cleanup() {
      window.removeEventListener("focus", onWindowFocus, true);
      input.removeEventListener("change", onChange);
      input.remove();
    }

    function settle(fileOrNull) {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(fileOrNull);
    }

    function onChange() {
      const file = input.files && input.files[0] ? input.files[0] : null;
      settle(file);
    }

    function onWindowFocus() {
      // In several browsers the focus event can fire BEFORE the file input's change event
      // has populated `input.files`. So we check twice with a short delay before treating
      // it as a cancel.
      setTimeout(() => {
        if (settled) return;

        const firstCheck = input.files && input.files[0] ? input.files[0] : null;
        if (firstCheck) {
          settle(firstCheck);
          return;
        }

        // Second check: give the browser a bit more time to populate `files`
        setTimeout(() => {
          if (settled) return;
          const secondCheck = input.files && input.files[0] ? input.files[0] : null;
          settle(secondCheck); // null here genuinely means cancel/no selection
        }, 250);
      }, 50);
    }

    input.addEventListener("change", onChange);
    window.addEventListener("focus", onWindowFocus, true);

    document.body.appendChild(input);
    input.click();
  });
}

let appState = {
  character: null
};

const editor = mountEditor({
  root: document.getElementById("appRoot"),
  getCharacter: () => appState.character,
  onChange: (nextCharacter) => {
    setCharacter(nextCharacter);
    // No auto-render here: prevents focus loss while typing.
  }
});

const inventory = mountInventory({
  root: document.getElementById("inventoryRoot"),
  getCharacter: () => appState.character,
  onChange: (nextCharacter) => {
    setCharacter(nextCharacter);
    // No auto-render here: prevents focus loss while typing.
  }
});

const spells = mountSpells({
  root: document.getElementById("spellsRoot"),
  getCharacter: () => appState.character,
  onChange: (nextCharacter) => {
    setCharacter(nextCharacter);
    // No auto-render here: prevents focus loss while typing.
  }
});

const logUI = mountLog({
  root: document.getElementById("logRoot"),
  getCharacter: () => appState.character,
  onChange: (nextCharacter) => {
    setCharacter(nextCharacter);
    // No auto-render here: prevents focus loss while typing.
  }
});

function setCharacter(character) {
  appState.character = character;
  Autosave.save(character);
  setStatus("● Autosaved");
}

function setStatus(text) {
  $("saveStatus").textContent = text;
}

function runSafely(label, fn) {
  try {
    return fn();
  } catch (err) {
    console.error(label, err);
    const msg = err?.message || String(err);
    setStatus(`${label} failed: ${msg}`);
    alert(`${label} failed:\n${msg}`);
  }
}

async function runSafelyAsync(label, fn) {
  try {
    return await fn();
  } catch (err) {
    console.error(label, err);
    const msg = err?.message || String(err);
    setStatus(`${label} failed: ${msg}`);
    alert(`${label} failed:\n${msg}`);
  }
}

function assertVendorsPresent() {
  const missing = [];
  if (!window.JSZip) missing.push("JSZip");
  if (!window.Papa) missing.push("PapaParse");

  if (missing.length) {
    const msg = `Missing vendor library: ${missing.join(", ")}. Check index.html script tags and vendor/ files.`;
    console.error(msg);
    setStatus(msg);
    alert(msg);
    return false;
  }
  return true;
}

$("btnNew").addEventListener("click", () => runSafely("New character", () => {
  const rulesetId = prompt(
    "Choose ruleset:\n- dnd5e_2014\n- dnd5e_2024",
    "dnd5e_2024"
  );

  if (!rulesetId || !["dnd5e_2014", "dnd5e_2024"].includes(rulesetId)) {
    alert("Invalid ruleset. Character not created.");
    return;
  }

  const name = prompt("Character name?", "New Character") || "New Character";
  const character = createDefaultCharacter({ name, rulesetId });

  setCharacter(character);
  editor.render();
  inventory.render();
  spells.render();
  logUI.render();
}));

$("btnImportZip").addEventListener("click", async () => {
  await runSafelyAsync("Import ZIP", async () => {
    const file = await pickZipFile();
    if (!file) {
      setStatus("Import cancelled");
      return;
    }

    try {
      setStatus("Importing ZIP…");
      const { character } = await ZipIO.importZipFromFile(file);
      Validator.assertValidCharacter(character);
      setCharacter(character);
      setStatus("Imported ZIP (autosaved)");
      editor.render();
      inventory.render();
      spells.render();
      logUI.render();
    } catch (err) {
      console.error(err);
      alert("Failed to import ZIP. See console for details.");
      setStatus("Import failed");
    }
  });
});

$("btnExportZip").addEventListener("click", async () => {
  await runSafelyAsync("Export ZIP", async () => {
    if (!appState.character) {
      alert("No character to export.");
      return;
    }

    try {
      await ZipIO.exportZipToDownload({
        character: appState.character
      });
      setStatus("ZIP exported");
    } catch (err) {
      console.error(err);
      alert("Failed to export ZIP. See console for details.");
    }
  });
});

// Attempt autosave recovery on load (async)
(async () => {
  await runSafelyAsync("Startup", async () => {
    if (!assertVendorsPresent()) return;

    try {
      const recovered = await Autosave.load();
      if (recovered) {
        appState.character = recovered;
        setStatus("Recovered from autosave");
        editor.render();
        inventory.render();
        spells.render();
        logUI.render();
      } else {
        setStatus("Ready");
        editor.render();
        inventory.render();
        spells.render();
        logUI.render();
      }
    } catch (err) {
      console.error(err);
      setStatus("Ready");
      editor.render();
      inventory.render();
      spells.render();
      logUI.render();
    }
  });
})();

// Early vendor check (helps catch broken index.html script tags)
if (!assertVendorsPresent()) {
  // Keep the page up, but do not attempt ZIP/CSV operations.
}

editor.render();
inventory.render();
spells.render();
logUI.render();