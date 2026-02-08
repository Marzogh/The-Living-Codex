import { createDefaultCharacter } from "./state.js";
import { Autosave } from "./autosave.js";
import { ZipIO } from "./zipio.js";
import { Validator } from "./validate.js";
import { mountEditor } from "./ui/editor.js";
import { mountInventory } from "./ui/inventory.js";
import { mountSpells } from "./ui/spells.js";

import { mountLog } from "./ui/log.js";
import { mountDerived } from "./ui/derived.js";



const $ = (id) => document.getElementById(id);

// New Character dialog elements
const dlgNewChar = $("dlgNewChar");
const formNewChar = $("formNewChar");
const ncName = $("ncName");
const ncRuleset = $("ncRuleset");
const ncClass = $("ncClass");
const ncSpecies = $("ncSpecies");
const ncRulesStatus = $("ncRulesStatus");
const ncCancel = $("ncCancel");

// RulesDB instance used only for the dialog population (does not affect current character until created)
let newCharRulesDb = null;
let newCharRulesetLoaded = null;

function setNewCharStatus(text) {
  if (ncRulesStatus) ncRulesStatus.textContent = text;
}

function fillSelect(selectEl, items, { placeholder = "(Select)", valueKey = "id", labelKey = "name" } = {}) {
  if (!selectEl) return;
  const prev = selectEl.value;
  selectEl.innerHTML = "";

  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = placeholder;
  selectEl.appendChild(opt0);

  for (const it of items || []) {
    const v = (it?.[valueKey] ?? "").toString();
    const label = (it?.[labelKey] ?? v).toString();
    if (!v) continue;
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = label;
    selectEl.appendChild(opt);
  }

  // Try to preserve selection if still present
  if (prev && [...selectEl.options].some(o => o.value === prev)) {
    selectEl.value = prev;
  }
}

async function ensureNewCharRulesDbLoaded(rulesetId) {
  const rs = rulesetId || null;
  if (!rs) {
    newCharRulesDb = null;
    newCharRulesetLoaded = null;
    setNewCharStatus("Rules data not loaded yet.");
    fillSelect(ncClass, [], { placeholder: "Select a class" });
    fillSelect(ncSpecies, [], { placeholder: "Select a species" });
    return;
  }

  if (newCharRulesDb && newCharRulesetLoaded === rs) return;

  try {
    setNewCharStatus("Loading rules data…");
    ncClass.innerHTML = '<option value="">Loading…</option>';
    ncSpecies.innerHTML = '<option value="">Loading…</option>';

    const mod = await import(new URL("../rules/rulesdb.js", import.meta.url).href);
    if (!mod?.RulesDB?.load) throw new Error("RulesDB.load() not found");

    newCharRulesDb = await mod.RulesDB.load(rs);
    newCharRulesetLoaded = rs;

    const classList = Array.isArray(newCharRulesDb?.classes?.list?.()) ? newCharRulesDb.classes.list() : [];
    const speciesList = Array.isArray(newCharRulesDb?.species?.list?.()) ? newCharRulesDb.species.list() : [];

    fillSelect(ncClass, classList, { placeholder: "Select a class" });
    fillSelect(ncSpecies, speciesList, { placeholder: "Select a species" });

    const counts = newCharRulesDb?.counts;
    const spellCount = counts?.spells ?? (Array.isArray(newCharRulesDb?.spells?.list?.()) ? newCharRulesDb.spells.list().length : "?");
    setNewCharStatus(`Rules loaded: ${spellCount} spells`);
  } catch (err) {
    console.error("New Character RulesDB load failed:", err);
    newCharRulesDb = null;
    newCharRulesetLoaded = null;
    const msg = err?.message ? err.message : String(err);
    setNewCharStatus(`Rules data not available (manual entry mode): ${msg}`);
    fillSelect(ncClass, [], { placeholder: "(Manual entry)" });
    fillSelect(ncSpecies, [], { placeholder: "(Manual entry)" });
  }
}

function openNewCharacterDialog() {
  if (!dlgNewChar) {
    alert("New Character dialog not found. Check index.html.");
    return;
  }

  // Defaults
  if (ncRuleset && !ncRuleset.value) ncRuleset.value = "dnd5e_2014";
  if (ncName) ncName.value = "";

  // Populate selectors based on current ruleset selection
  ensureNewCharRulesDbLoaded(ncRuleset?.value || "dnd5e_2014");

  dlgNewChar.showModal();
  setTimeout(() => {
    try { ncName?.focus(); } catch {}
  }, 0);
}

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
  character: null,
  rulesDb: null,
  rulesetLoaded: null
};
// Debug: expose module-scoped state for DevTools Console (safe to remove later)
window.__codex = window.__codex || {};
window.__codex.appState = appState;

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
  },
  getRulesDb: () => appState.rulesDb
});

const logUI = mountLog({
  root: document.getElementById("logRoot"),
  getCharacter: () => appState.character,
  onChange: (nextCharacter) => {
    setCharacter(nextCharacter);
    // No auto-render here: prevents focus loss while typing.
  }
});

const derived = mountDerived({
  root: document.getElementById("derivedRoot"),
  getCharacter: () => appState.character
});

function setCharacter(character) {
  appState.character = character;
  Autosave.save(character);
  setStatus("● Autosaved");
}

function setStatus(text) {
  $("saveStatus").textContent = text;
}

// Loads the rules database for the given character's rulesetId, if available.
async function ensureRulesDbLoaded(character) {
  const rulesetId =
    character?.rulesetId ||
    character?.core?.rulesetId ||
    character?.meta?.ruleset_id ||
    character?.meta?.rulesetId ||
    character?.meta?.ruleset ||
    null;
  if (!rulesetId) {
    appState.rulesDb = null;
    appState.rulesetLoaded = null;
    setStatus("Rules data not available (manual entry mode): character has no rulesetId");
    return;
  }

  if (appState.rulesDb && appState.rulesetLoaded === rulesetId) {
    return;
  }

  // Lazy-load the RulesDB module when it exists.
  // This keeps the app working today, and lets us drop in selector datasets later.
  try {
    setStatus("Loading rules data…");
    const mod = await import(new URL("../rules/rulesdb.js", import.meta.url).href);
    if (!mod?.RulesDB?.load) {
      throw new Error("RulesDB.load() not found");
    }

    appState.rulesDb = await mod.RulesDB.load(rulesetId);

    // Sanity check: if this fails, the module loaded but did not return the expected API shape.
    if (!appState.rulesDb?.spells?.search) {
      throw new Error("RulesDB loaded but spells API is missing");
    }

    // Helpful diagnostic: show how many spells were loaded.
    const spellCount = Array.isArray(appState.rulesDb?.spells?.list?.())
      ? appState.rulesDb.spells.list().length
      : null;
    console.info("RulesDB loaded:", { rulesetId, spellCount });

    appState.rulesetLoaded = rulesetId;
    setStatus(`Rules data loaded (${rulesetId})`);
  } catch (err) {
    console.error("RulesDB not loaded (module missing or failed):", err);
    appState.rulesDb = null;
    appState.rulesetLoaded = null;

    const msg = err?.message ? err.message : String(err);
    // Keep the app usable even if rules data isn't available yet.
    setStatus(`Rules data not available (manual entry mode): ${msg}`);
  }
}
// Debug: expose key helpers for DevTools Console (safe to remove later)
window.__codex.ensureRulesDbLoaded = ensureRulesDbLoaded;

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


function fmtSigned(n) {
  if (n == null || !Number.isFinite(n)) return "—";
  return n >= 0 ? `+${n}` : `${n}`;
}

function modFromScore(score) {
  const s = Number(score);
  if (!Number.isFinite(s)) return null;
  return Math.floor((s - 10) / 2);
}

function profBonusFromLevel(level) {
  const l = Number(level);
  if (!Number.isFinite(l)) return null;
  if (l <= 4) return 2;
  if (l <= 8) return 3;
  if (l <= 12) return 4;
  if (l <= 16) return 5;
  return 6;
}

function escapeHtml(text) {
  return (text ?? "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function abilityScore(c, key) {
  const k = key.toLowerCase();
  return (
    c?.abilities?.[k] ??
    c?.abilities?.[k.toUpperCase()] ??
    c?.ability_scores?.[k] ??
    c?.ability_scores?.[k.toUpperCase()] ??
    c?.abilityScores?.[k] ??
    c?.abilityScores?.[k.toUpperCase()] ??
    c?.core?.abilities?.[k] ??
    c?.core?.abilities?.[k.toUpperCase()] ??
    null
  );
}

function inferLevelForPrint(c) {
  const direct = Number(c?.level ?? c?.core?.level);
  if (Number.isFinite(direct) && direct > 0) return direct;
  if (Array.isArray(c?.classes)) {
    const sum = c.classes.map(x => Number(x?.level) || 0).reduce((a,b) => a+b, 0);
    return sum || null;
  }
  return null;
}

function openPrintWindow(html, title = "Character Sheet") {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) {
    alert("Popup blocked. Allow popups to export PDF.");
    return null;
  }
  w.document.open();
  w.document.write(`<!doctype html><html><head><meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page { margin: 12mm; }
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size: 11pt; color: #111; }
      h1 { font-size: 18pt; margin: 0 0 6mm 0; }
      h2 { font-size: 13pt; margin: 6mm 0 2mm 0; border-bottom: 1px solid #ddd; padding-bottom: 1mm; }
      h3 { font-size: 11.5pt; margin: 4mm 0 2mm 0; }
      .meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4mm; margin-bottom: 4mm; }
      .box { border: 1px solid #ddd; border-radius: 6px; padding: 3mm; }
      .kv { display: grid; grid-template-columns: 38mm 1fr; gap: 2mm 3mm; }
      .kv div:nth-child(odd) { color: #555; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #e2e2e2; padding: 2mm; vertical-align: top; }
      th { background: #f6f6f6; text-align: left; }
      .small { font-size: 10pt; color: #444; }
      .muted { color: #666; }
      .two { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
      .three { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6mm; }
      .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      .nowrap { white-space: nowrap; }
      .pagebreak { break-before: page; }
      ul { margin: 0; padding-left: 5mm; }
      li { margin: 0 0 1mm 0; }
      @media print {
        a { color: inherit; text-decoration: none; }
      }
    </style>
  </head><body>${html}</body></html>`);
  w.document.close();
  return w;
}

function buildPrintableHtml(c) {
  const name = c?.name || c?.core?.name || "Unnamed";
  const ruleset = c?.rulesetId || c?.core?.rulesetId || "";

  const level = inferLevelForPrint(c);
  const prof = profBonusFromLevel(level);

  const scores = {
    STR: Number(abilityScore(c, "str")),
    DEX: Number(abilityScore(c, "dex")),
    CON: Number(abilityScore(c, "con")),
    INT: Number(abilityScore(c, "int")),
    WIS: Number(abilityScore(c, "wis")),
    CHA: Number(abilityScore(c, "cha"))
  };
  const mods = {
    STR: modFromScore(scores.STR),
    DEX: modFromScore(scores.DEX),
    CON: modFromScore(scores.CON),
    INT: modFromScore(scores.INT),
    WIS: modFromScore(scores.WIS),
    CHA: modFromScore(scores.CHA)
  };

  const initiative = mods.DEX;
  const passivePerception = mods.WIS == null ? null : (10 + mods.WIS);

  const inv = Array.isArray(c?.inventory) ? c.inventory : [];
  const spellsKnown = Array.isArray(c?.spells_known) ? c.spells_known : [];
  const spellsPrepared = Array.isArray(c?.spells_prepared) ? c.spells_prepared : [];
  const log = Array.isArray(c?.log) ? [...c.log] : [];

  const trackers = Array.isArray(c?.trackers) ? c.trackers : (Array.isArray(c?.resources) ? c.resources : []);

  // Sorts
  const invSorted = [...inv].sort((a,b) => (a.category||"").localeCompare(b.category||"") || (a.name||"").localeCompare(b.name||""));
  const spellsKSorted = [...spellsKnown].sort((a,b) => (Number(a.level)||0)-(Number(b.level)||0) || (a.name||"").localeCompare(b.name||""));
  const spellsPSorted = [...spellsPrepared].sort((a,b) => (Number(a.level)||0)-(Number(b.level)||0) || (a.name||"").localeCompare(b.name||""));
  const logSorted = [...log].sort((a,b) => (b.utc||"").localeCompare(a.utc||""));

  const abilitiesRows = Object.keys(scores).map((k) => {
    const s = Number.isFinite(scores[k]) ? scores[k] : null;
    const m = mods[k];
    return `<tr><td class="nowrap"><strong>${k}</strong></td><td>${s ?? "—"}</td><td>${fmtSigned(m)}</td></tr>`;
  }).join("");

  const trackersRows = (trackers.length ? trackers : []).map((t) => {
    const label = t?.label || t?.name || "";
    const cur = (t?.current ?? t?.value ?? "");
    const max = (t?.max ?? t?.maximum ?? "");
    const notes = t?.notes || "";
    return `<tr><td>${escapeHtml(label)}</td><td class="nowrap">${escapeHtml(cur)} / ${escapeHtml(max)}</td><td>${escapeHtml(notes)}</td></tr>`;
  }).join("");

  const invRows = invSorted.map((it) => {
    return `<tr>
      <td>${escapeHtml(it.name || "")}</td>
      <td>${escapeHtml(it.category || "")}</td>
      <td class="nowrap">${escapeHtml(it.qty ?? "")}</td>
      <td>${escapeHtml(it.container || "")}</td>
      <td class="nowrap">${it.equipped ? "Yes" : ""}</td>
      <td>${escapeHtml(it.notes || "")}</td>
    </tr>`;
  }).join("");

  const spellRows = (rows) => rows.map((sp) => {
    return `<tr>
      <td>${escapeHtml(sp.name || "")}</td>
      <td class="nowrap">${escapeHtml(sp.level ?? "")}</td>
      <td>${escapeHtml(sp.school || "")}</td>
      <td class="nowrap">${sp.ritual ? "Yes" : ""}</td>
      <td class="nowrap">${sp.concentration ? "Yes" : ""}</td>
      <td>${escapeHtml(sp.notes || "")}</td>
    </tr>`;
  }).join("");

  const logRows = logSorted.map((e) => {
    return `<tr>
      <td class="mono nowrap">${escapeHtml(e.utc || "")}</td>
      <td>${escapeHtml(e.tag || "")}</td>
      <td>${escapeHtml(e.message || "")}</td>
    </tr>`;
  }).join("");

  return `
    <h1>${escapeHtml(name)} <span class="muted small">${ruleset ? `(${escapeHtml(ruleset)})` : ""}</span></h1>

    <div class="meta">
      <div class="box">
        <div class="kv">
          <div>Level</div><div>${level ?? "—"}</div>
          <div>Proficiency</div><div>${fmtSigned(prof)}</div>
          <div>Initiative</div><div>${fmtSigned(initiative)}</div>
          <div>Passive Perception</div><div>${passivePerception ?? "—"}</div>
        </div>
      </div>

      <div class="box">
        <h3 style="margin-top:0;">Ability Scores</h3>
        <table>
          <thead><tr><th>Ability</th><th>Score</th><th>Mod</th></tr></thead>
          <tbody>${abilitiesRows}</tbody>
        </table>
      </div>

      <div class="box">
        <h3 style="margin-top:0;">Trackers</h3>
        ${trackers.length ? `
          <table>
            <thead><tr><th>Tracker</th><th>Current/Max</th><th>Notes</th></tr></thead>
            <tbody>${trackersRows}</tbody>
          </table>
        ` : `<p class="small muted">No trackers.</p>`}
      </div>
    </div>

    <h2>Inventory</h2>
    ${invSorted.length ? `
      <table>
        <thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Container</th><th>Eq.</th><th>Notes</th></tr></thead>
        <tbody>${invRows}</tbody>
      </table>
    ` : `<p class="small muted">No items.</p>`}

    <h2>Spells</h2>
    <div class="two">
      <div class="box">
        <h3 style="margin-top:0;">Known</h3>
        ${spellsKSorted.length ? `
          <table>
            <thead><tr><th>Name</th><th>Lvl</th><th>School</th><th>Ritual</th><th>Conc.</th><th>Notes</th></tr></thead>
            <tbody>${spellRows(spellsKSorted)}</tbody>
          </table>
        ` : `<p class="small muted">No known spells.</p>`}
      </div>
      <div class="box">
        <h3 style="margin-top:0;">Prepared</h3>
        ${spellsPSorted.length ? `
          <table>
            <thead><tr><th>Name</th><th>Lvl</th><th>School</th><th>Ritual</th><th>Conc.</th><th>Notes</th></tr></thead>
            <tbody>${spellRows(spellsPSorted)}</tbody>
          </table>
        ` : `<p class="small muted">No prepared spells.</p>`}
      </div>
    </div>

    <h2 class="pagebreak">Log</h2>
    ${logSorted.length ? `
      <table>
        <thead><tr><th>UTC</th><th>Tag</th><th>Message</th></tr></thead>
        <tbody>${logRows}</tbody>
      </table>
    ` : `<p class="small muted">No log entries.</p>`}

    <p class="small muted" style="margin-top:6mm;">Generated by The Living Codex (v0.x). Print to PDF via your browser dialog.</p>
  `;
}

function ensurePrintRoot() {
  let el = document.getElementById("printRoot");
  if (!el) {
    el = document.createElement("div");
    el.id = "printRoot";
    el.className = "print-root";
    document.body.appendChild(el);
  }
  return el;
}

function enterPrintMode({ title, html }) {
  const root = ensurePrintRoot();

  // Title used by some browsers as the default PDF filename.
  document.title = title || document.title;

  root.innerHTML = `
    <div class="print-sheet">
      ${html}
    </div>
  `;

  document.body.classList.add("print-mode");
}

function exitPrintMode() {
  document.body.classList.remove("print-mode");
  const root = document.getElementById("printRoot");
  if (root) root.innerHTML = "";
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

$("btnNew").addEventListener("click", async () => {
  await runSafelyAsync("New character", async () => {
    openNewCharacterDialog();
  });
});

// New Character dialog wiring
if (ncCancel && dlgNewChar) {
  ncCancel.addEventListener("click", () => dlgNewChar.close("cancel"));
}

if (ncRuleset) {
  ncRuleset.addEventListener("change", async () => {
    await ensureNewCharRulesDbLoaded(ncRuleset.value);
  });
}

if (formNewChar && dlgNewChar) {
  formNewChar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const rulesetId = (ncRuleset?.value || "").trim();
    const name = (ncName?.value || "").trim() || "New Character";
    const classId = (ncClass?.value || "").trim();
    const speciesId = (ncSpecies?.value || "").trim();

    if (!rulesetId) {
      alert("Please select a ruleset.");
      return;
    }

    // If rules data loaded, require a class/species selection for selector mode.
    // If rules data isn't loaded (manual entry mode), allow blanks.
    const selectorMode = Boolean(newCharRulesDb && newCharRulesetLoaded === rulesetId);
    if (selectorMode) {
      if (!classId) {
        alert("Please select a class.");
        return;
      }
      if (!speciesId) {
        alert("Please select a species.");
        return;
      }
    }

    const character = createDefaultCharacter({ name, rulesetId });

    // Persist selections into core (canonical location for v0)
    character.core = character.core || {};
    character.core.rulesetId = rulesetId;
    character.core.classId = classId || character.core.classId || "";
    character.core.speciesId = speciesId || character.core.speciesId || "";

    setCharacter(character);
    await ensureRulesDbLoaded(character);

    editor.render();
    inventory.render();
    spells.render();
    logUI.render();
    derived.render();

    dlgNewChar.close("create");
  });
}

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
      await ensureRulesDbLoaded(character);
      setStatus("Imported ZIP (autosaved)");
      editor.render();
      inventory.render();
      spells.render();
      logUI.render();
      derived.render();
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

$("btnExportPdf").addEventListener("click", async () => {
  await runSafelyAsync("Export PDF", async () => {
    if (!appState.character) {
      alert("No character to export.");
      return;
    }

    const title = appState.character?.name || "Character Sheet";
    const html = buildPrintableHtml(appState.character);

    // Enter print mode in-page (no popups)
    enterPrintMode({ title, html });

    // Ensure we always leave print mode.
    const cleanup = () => {
      window.removeEventListener("afterprint", cleanup);
      exitPrintMode();
      setStatus("PDF export complete");
    };
    window.addEventListener("afterprint", cleanup);

    // Some browsers don't reliably fire afterprint; also do a fallback cleanup.
    setTimeout(() => {
      try {
        window.print();
      } finally {
        // Fallback: if afterprint doesn't fire, exit after a short delay.
        setTimeout(() => {
          if (document.body.classList.contains("print-mode")) cleanup();
        }, 1200);
      }
    }, 50);

    setStatus("Opening print dialog (Save as PDF)");
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
        await ensureRulesDbLoaded(recovered);
        // ensureRulesDbLoaded() already sets a meaningful status (rules loaded vs manual mode).
        // Don't overwrite it here.
        editor.render();
        inventory.render();
        spells.render();
        logUI.render();
        derived.render();
      } else {
        setStatus("Ready");
        editor.render();
        inventory.render();
        spells.render();
        logUI.render();
        derived.render();
      }
    } catch (err) {
      console.error(err);
      setStatus("Ready");
      editor.render();
      inventory.render();
      spells.render();
      logUI.render();
      derived.render();
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
derived.render();