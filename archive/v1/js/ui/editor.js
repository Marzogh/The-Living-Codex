

/**
 * Minimal Character Editor UI (v1)
 *
 * - No frameworks
 * - Pure renderer: reads character via getCharacter()
 * - Emits updates via onChange(nextCharacter)
 * - Does not autosave or touch storage (app.js owns that)
 */

function nowIso() {
  return new Date().toISOString();
}


function clampInt(value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return null;
  return Math.min(max, Math.max(min, n));
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

function prettyId(id) {
  const s = (id ?? "").toString().trim();
  if (!s) return "";
  return s
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// --- UI State + Proficiencies UI helpers ---
function getUiState() {
  try {
    window.__codex = window.__codex || {};
    window.__codex.uiState = window.__codex.uiState || {};
    return window.__codex.uiState;
  } catch {
    return {};
  }
}

function renderChipList(label, values, max = 6) {
  const arr = Array.isArray(values) ? values.filter(Boolean) : [];
  const shown = arr.slice(0, max);
  const extra = arr.length - shown.length;
  const chips = shown.map(v => `<span class="chip">${escapeHtml(prettyId(v))}</span>`).join(" ");
  const more = extra > 0 ? `<span class="chip chip-muted">+${extra} more</span>` : "";
  const empty = arr.length === 0 ? `<span class="chip chip-muted">(none)</span>` : "";
  return `
    <div class="prof-line">
      <div class="prof-line-label">${escapeHtml(label)}</div>
      <div class="prof-line-chips">${chips}${more}${empty}</div>
    </div>
  `;
}

function renderSaveToggles(selected) {
  const set = new Set((Array.isArray(selected) ? selected : []).map(s => (s || "").toString().toLowerCase()));
  const saves = [
    ["str", "STR"],
    ["dex", "DEX"],
    ["con", "CON"],
    ["int", "INT"],
    ["wis", "WIS"],
    ["cha", "CHA"],
  ];
  return `
    <div class="prof-saves-row">
      ${saves.map(([k, lab]) => `
        <label class="prof-save" title="${lab}">
          <input type="checkbox" data-prof-save="${k}" ${set.has(k) ? "checked" : ""} />
          <span class="prof-save-lab">${lab}</span>
        </label>
      `).join("")}
    </div>
  `;
}

function normaliseTrackers(c) {
  if (!c.trackers) c.trackers = [];
  if (!Array.isArray(c.trackers)) c.trackers = [];
}

// --- Proficiency Normalisation Helpers ---
function normList(arr) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  const seen = new Set();
  for (const x of arr) {
    const s = (x ?? "").toString().trim();
    if (!s) continue;
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

function parseCsvList(text) {
  const raw = (text ?? "").toString();
  if (!raw.trim()) return [];
  // split on comma or newline
  return normList(raw.split(/[\n,]/g).map(s => s.trim()));
}

function toLowerKeys(arr) {
  return normList(arr).map(s => s.toLowerCase());
}

function normaliseProficiencies(c) {
  if (!c.proficiencies || typeof c.proficiencies !== "object") c.proficiencies = {};
  if (!c.expertise || typeof c.expertise !== "object") c.expertise = {};

  const p = c.proficiencies;
  const e = c.expertise;

  // Canonical arrays
  p.skills = normList(p.skills);
  p.saves = normList(p.saves);
  p.tools = normList(p.tools);
  p.languages = normList(p.languages);
  p.armor = normList(p.armor);
  p.weapons = normList(p.weapons);

  e.skills = normList(e.skills);

  // Merge legacy fields if present
  if (Array.isArray(c.skillProficiencies) && c.skillProficiencies.length) {
    p.skills = normList([...p.skills, ...c.skillProficiencies]);
  }
  if (Array.isArray(c.skillExpertise) && c.skillExpertise.length) {
    e.skills = normList([...e.skills, ...c.skillExpertise]);
  }
  if (Array.isArray(c.saveProficiencies) && c.saveProficiencies.length) {
    p.saves = normList([...p.saves, ...c.saveProficiencies]);
  }
  if (Array.isArray(c.savingThrowProficiencies) && c.savingThrowProficiencies.length) {
    p.saves = normList([...p.saves, ...c.savingThrowProficiencies]);
  }
  if (Array.isArray(c.toolProficiencies) && c.toolProficiencies.length) {
    p.tools = normList([...p.tools, ...c.toolProficiencies]);
  }
  if (Array.isArray(c.armorProficiencies) && c.armorProficiencies.length) {
    p.armor = normList([...p.armor, ...c.armorProficiencies]);
  }
  if (Array.isArray(c.weaponProficiencies) && c.weaponProficiencies.length) {
    p.weapons = normList([...p.weapons, ...c.weaponProficiencies]);
  }
  if (Array.isArray(c.languages) && c.languages.length) {
    p.languages = normList([...p.languages, ...c.languages]);
  }

  // Ensure saves are stored as ability keys where possible
  const map = { STR: "str", DEX: "dex", CON: "con", INT: "int", WIS: "wis", CHA: "cha" };
  p.saves = normList(p.saves).map(s => map[s.toUpperCase()] || s.toLowerCase());

  // Expertise should be a subset of skills (but don't remove; just keep consistent ordering)
  // We won't enforce subset strictly to avoid surprise deletions.
}
// Debug: confirm this module version is loaded in the browser
try {
  window.__codex = window.__codex || {};
  window.__codex.__editor_loaded_at = new Date().toISOString();
  window.__codex.__has_normaliseProficiencies = (typeof normaliseProficiencies === "function");
} catch {
  // ignore
}

function normaliseClasses(c) {
  if (!c.core) c.core = {};

  // Ensure array exists
  if (!Array.isArray(c.core.classes)) {
    if (c.core.classId) {
      c.core.classes = [{ id: c.core.classId, level: 1, isPrimary: true }];
    } else {
      c.core.classes = [];
    }
  }

  // If classId exists but isn't represented, add it.
  if (c.core.classId && !c.core.classes.some(x => (x?.id || "") === c.core.classId)) {
    c.core.classes.push({ id: c.core.classId, level: 1, isPrimary: c.core.classes.length === 0 });
  }

  // Canonicalise stored single-class field too
  if (c.core.classId) c.core.classId = c.core.classId.toString().trim().toLowerCase();

  // Normalise fields + ensure min level
  c.core.classes = c.core.classes
    .filter(x => x && (x.id ?? "").toString().trim())
    .map(x => ({
      id: (x.id ?? "").toString().trim().toLowerCase(),
      level: clampInt(x.level ?? 1, 1) ?? 1,
      isPrimary: Boolean(x.isPrimary),
      subclassId: (x.subclassId ?? x.subclass_id ?? "").toString().trim() || ""
    }));

  // Ensure exactly one primary if any classes exist
  if (c.core.classes.length > 0) {
    if (!c.core.classes.some(x => x.isPrimary)) {
      c.core.classes[0].isPrimary = true;
    }

    // If multiple primaries, keep the first
    let seen = false;
    for (const cl of c.core.classes) {
      if (cl.isPrimary) {
        if (!seen) seen = true;
        else cl.isPrimary = false;
      }
    }

    const primary = c.core.classes.find(x => x.isPrimary) || c.core.classes[0];
    c.core.classId = primary.id;
  } else {
    // No classes selected
    c.core.classId = c.core.classId || "";
  }
}

function getRulesDbFromWindow() {
  try {
    const w = window;
    return w?.__codex?.appState?.rulesDb || w?.__codex?.rulesDb || null;
  } catch {
    return null;
  }
}

function getSubclassesForClassId(classId) {
  const id = (classId || "").toString().trim().toLowerCase();
  if (!id) return [];
  const db = getRulesDbFromWindow();
  const sc = db?.subclasses || db?.subclass || null;
  if (!sc) return [];

  let arr = [];
  // Generic API (our RulesDB): { list(), get(id), search(q) }
  if (typeof sc.list === "function") {
    try { arr = sc.list(); } catch { arr = []; }
  } else if (typeof sc.values === "function") {
    // Map-like
    try { arr = Array.from(sc.values()); } catch { arr = []; }
  } else if (Array.isArray(sc)) {
    arr = sc;
  } else if (sc && typeof sc === "object") {
    arr = Object.values(sc);
  }

  return arr
    .filter(r => {
      const cid = (r?.class_id || r?.classId || r?.class || "").toString().trim().toLowerCase();
      return cid === id;
    })
    .map(r => ({
      id: (r?.id || r?.subclass_id || r?.subclassId || "").toString().trim(),
      name: (r?.name || r?.label || r?.title || "").toString().trim(),
      min_level: clampInt(r?.min_level ?? r?.minLevel ?? 0, 0) ?? 0
    }))
    .filter(x => x.id)
    .sort((a,b) => (a.name || a.id).localeCompare(b.name || b.id));
}

function renderEmpty() {
  return `
    <section class="card">
      <h2>Character</h2>
      <p>No character loaded. Use <b>New Character</b> or <b>Import ZIP</b>.</p>
    </section>
  `;
}

// --- Spell Edit Modal (reuses the same <dialog>-style UX as other overlays) ---
function ensureSpellEditDialog() {
  const existing = document.querySelector("#dlgSpellEdit");
  if (existing) return existing;

  const dlg = document.createElement("dialog");
  dlg.id = "dlgSpellEdit";
  dlg.className = "dlg";

  // NOTE: We keep markup structure similar to other dialogs (header/body/footer)
  // so app.css can style it consistently.
  dlg.innerHTML = `
    <form method="dialog" class="dlg-form" id="formSpellEdit">
      <div class="dlg-card">
        <div class="dlg-header">
          <div class="dlg-title" id="spellEditTitle">Edit Spell</div>
          <button type="button" class="dlg-x" id="spellEditX" aria-label="Close">×</button>
        </div>

        <div class="dlg-body" id="spellEditBody"></div>

        <div class="dlg-footer">
          <button type="button" class="btn" id="spellEditCancel">Cancel</button>
          <button type="button" class="btn btn-primary" id="spellEditSave">Save</button>
        </div>
      </div>
    </form>
  `;

  document.body.appendChild(dlg);
  return dlg;
}

function openSpellEditDialog({
  spell,
  title,
  onSave,
  onCancel,
  allowLevelEdit = true
} = {}) {
  const dlg = ensureSpellEditDialog();
  const body = dlg.querySelector("#spellEditBody");
  const titleEl = dlg.querySelector("#spellEditTitle");
  const btnX = dlg.querySelector("#spellEditX");
  const btnCancel = dlg.querySelector("#spellEditCancel");
  const btnSave = dlg.querySelector("#spellEditSave");

  const s = spell || {};
  const safeName = (s.name ?? "").toString();

  if (titleEl) titleEl.textContent = title || (safeName ? `Edit: ${safeName}` : "Edit Spell");

  // Render form fields (we only edit reference metadata; toggles remain inline in spells UI)
  // We keep ids stable so spells.js can call this without caring about DOM structure.
  body.innerHTML = `
    <div class="grid grid-2">
      <div class="field">
        <label for="se_name">Name</label>
        <input id="se_name" type="text" value="${escapeHtml(safeName)}" />
      </div>

      <div class="field">
        <label for="se_level">Level</label>
        <input id="se_level" type="number" min="0" max="9" inputmode="numeric" value="${escapeHtml(s.level ?? 0)}" ${allowLevelEdit ? "" : "disabled"} />
      </div>

      <div class="field">
        <label for="se_school">School</label>
        <input id="se_school" type="text" placeholder="e.g., Evocation" value="${escapeHtml(s.school ?? "")}" />
      </div>

      <div class="field">
        <label for="se_cast">Casting Time</label>
        <input id="se_cast" type="text" placeholder="e.g., 1 action" value="${escapeHtml(s.casting_time ?? s.cast ?? "")}" />
      </div>

      <div class="field">
        <label for="se_range">Range</label>
        <input id="se_range" type="text" placeholder="e.g., 60 feet" value="${escapeHtml(s.range ?? "")}" />
      </div>

      <div class="field">
        <label for="se_duration">Duration</label>
        <input id="se_duration" type="text" placeholder="e.g., Instantaneous" value="${escapeHtml(s.duration ?? "")}" />
      </div>

      <div class="field">
        <label for="se_components">Components</label>
        <input id="se_components" type="text" placeholder="e.g., V, S, M" value="${escapeHtml(s.components ?? "")}" />
      </div>

      <div class="field">
        <label for="se_source">Source</label>
        <input id="se_source" type="text" placeholder="e.g., PHB" value="${escapeHtml(s.source ?? "")}" />
      </div>

      <div class="field">
        <label for="se_page">Page</label>
        <input id="se_page" type="text" placeholder="e.g., 242" value="${escapeHtml(s.page ?? "")}" />
      </div>

      <div class="field" style="grid-column: 1 / -1;">
        <label for="se_notes">Notes</label>
        <textarea id="se_notes" rows="4" placeholder="Optional notes (keep brief during play)">${escapeHtml(s.notes ?? "")}</textarea>
      </div>

      <div class="hint" style="grid-column: 1 / -1; margin-top: 6px;">
        Tip: Prepared / Ritual / Concentration toggles stay on the spell list for fast gameplay edits.
      </div>
    </div>
  `;

  function collect() {
    const name = (dlg.querySelector("#se_name")?.value ?? "").toString().trim();
    const level = clampInt(dlg.querySelector("#se_level")?.value, 0, 9) ?? 0;
    const school = (dlg.querySelector("#se_school")?.value ?? "").toString().trim();
    const casting_time = (dlg.querySelector("#se_cast")?.value ?? "").toString().trim();
    const range = (dlg.querySelector("#se_range")?.value ?? "").toString().trim();
    const duration = (dlg.querySelector("#se_duration")?.value ?? "").toString().trim();
    const components = (dlg.querySelector("#se_components")?.value ?? "").toString().trim();
    const source = (dlg.querySelector("#se_source")?.value ?? "").toString().trim();
    const page = (dlg.querySelector("#se_page")?.value ?? "").toString().trim();
    const notes = (dlg.querySelector("#se_notes")?.value ?? "").toString().trim();

    // Preserve unknown fields; only override editable ones.
    return {
      ...s,
      name,
      level: allowLevelEdit ? level : (s.level ?? 0),
      school,
      casting_time,
      range,
      duration,
      components,
      source,
      page,
      notes,
    };
  }

  // Clean up any previous handlers by overwriting them.
  const closeAsCancel = () => {
    try { dlg.close("cancel"); } catch { /* ignore */ }
  };

  btnX.onclick = (e) => { e.preventDefault(); closeAsCancel(); };
  btnCancel.onclick = (e) => { e.preventDefault(); closeAsCancel(); };

  btnSave.onclick = (e) => {
    e.preventDefault();
    const next = collect();
    try {
      if (typeof onSave === "function") onSave(next);
    } finally {
      try { dlg.close("save"); } catch { /* ignore */ }
    }
  };

  // When dialog closes, call onCancel only if we didn't save.
  dlg.addEventListener("close", () => {
    const rv = (dlg.returnValue || "").toString();
    if (rv !== "save") {
      if (typeof onCancel === "function") onCancel();
    }
  }, { once: true });

  dlg.showModal();
}

// Expose modal API for other modules (spells.js) without introducing circular imports
try {
  window.__codex = window.__codex || {};
  window.__codex.ui = window.__codex.ui || {};
  window.__codex.ui.openSpellEditDialog = openSpellEditDialog;
  window.__codex.__has_spell_edit_dialog = true;
} catch {
  // ignore
}


export function mountEditor({ root, getCharacter, onChange }) {
  if (!root) throw new Error("mountEditor: root is required");
  if (typeof getCharacter !== "function") throw new Error("mountEditor: getCharacter must be a function");
  if (typeof onChange !== "function") throw new Error("mountEditor: onChange must be a function");

  // Guard to prevent subclass autofix recursion
  let subclassAutoFixInProgress = false;

  function applyUpdate(mutator) {
    const current = getCharacter();
    if (!current) return;

    const next = structuredClone(current);
    mutator(next);

    if (next.meta) next.meta.modified_utc = nowIso();
    onChange(next);
  }

  function render() {
    const c = getCharacter();
    if (!c) {
      root.innerHTML = renderEmpty();
      return;
    }

    normaliseTrackers(c);
    normaliseClasses(c);
    // Subclass level gating (rules-data driven):
    // If a subclass is selected but the class level is below the subclass min_level, clear it.
    // We apply this via onChange to keep state consistent and persisted.
    if (!subclassAutoFixInProgress) {
      const fixes = [];
      for (let i = 0; i < (c.core?.classes?.length || 0); i++) {
        const cl = c.core.classes[i];
        const sid = (cl?.subclassId || "").toString().trim();
        if (!sid) continue;
        const subs = getSubclassesForClassId(cl.id);
        if (!subs || subs.length === 0) continue; // no rules data -> can't gate
        const rec = subs.find(s => (s.id || "").toString().trim() === sid);
        if (!rec) continue;
        const minLvl = Number(rec.min_level || 0);
        const curLvl = Number(cl.level || 1);
        if (minLvl > 0 && curLvl < minLvl) {
          fixes.push({ idx: i, reason: `below min level ${minLvl}` });
        }
      }

      if (fixes.length > 0) {
        subclassAutoFixInProgress = true;
        applyUpdate((next) => {
          normaliseClasses(next);
          for (const f of fixes) {
            if (next.core?.classes?.[f.idx]) next.core.classes[f.idx].subclassId = "";
          }
          normaliseClasses(next);
        });
        subclassAutoFixInProgress = false;
        // Re-render with corrected state
        return render();
      }
    }
    if (typeof normaliseProficiencies !== "function") {
      throw new Error("normaliseProficiencies is not defined (editor.js module mismatch/cache)");
    }
    normaliseProficiencies(c);

    const rulesetId = c.core?.rulesetId ?? c.meta?.ruleset_id ?? "";
    const classId = c.core?.classId ?? c.core?.class_id ?? "";
    const speciesId = c.core?.speciesId ?? c.core?.species_id ?? c.core?.raceId ?? c.core?.race_id ?? "";

    const classLabel = classId ? prettyId(classId) : "(not set)";
    const speciesLabel = speciesId ? prettyId(speciesId) : "(not set)";

    root.innerHTML = `
      <section class="card">
        <h2>Character</h2>

        <div class="grid">
          <div class="field">
            <label for="char_name">Name</label>
            <input id="char_name" type="text" value="${escapeHtml(c.meta?.name ?? c.core?.name ?? "")}" />
          </div>

          <div class="field">
            <label>Ruleset (locked)</label>
            <div class="readonly" id="ruleset_id">${escapeHtml(rulesetId)}</div>
          </div>

          <div class="field">
            <label>Class</label>
            <div class="readonly" id="class_id" title="${escapeHtml(classId)}">${escapeHtml(classLabel)}</div>
          </div>

          <div class="field">
            <label>Species</label>
            <div class="readonly" id="species_id" title="${escapeHtml(speciesId)}">${escapeHtml(speciesLabel)}</div>
          </div>
        </div>
      </section>

      <div class="cards-2col">
      <section class="card" id="card_proficiencies">
        <h2 class="card-title-row">Proficiencies <button type="button" id="prof_open" class="prof-edit-btn">Edit</button></h2>
        <div class="card-body">

          <div class="prof-card">
            <div class="prof-view">
              ${renderChipList("Saving throws", c.proficiencies.saves.map(s => (s || "").toString().toUpperCase()))}
              ${renderChipList("Skills", c.proficiencies.skills)}
              ${renderChipList("Expertise", c.expertise.skills)}
              ${renderChipList("Tools", c.proficiencies.tools)}
              ${renderChipList("Languages", c.proficiencies.languages)}
              ${renderChipList("Armor", c.proficiencies.armor)}
              ${renderChipList("Weapons", c.proficiencies.weapons)}
              <div class="hint" style="margin-top:10px;">v0: editable. Rules data may suggest defaults later; nothing here is locked.</div>
            </div>
          </div>

        </div>
      </section>

      <section class="card">
        <h2>Classes &amp; Levels</h2>

        <table class="table">
          <thead>
            <tr>
              <th>Class</th>
              <th style="width: 110px;">Level</th>
              <th>Subclass</th>
              <th style="width: 90px;">Primary</th>
              <th style="width: 110px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${c.core.classes.length === 0
              ? `<tr><td colspan="5" class="hint">No classes set yet.</td></tr>`
              : c.core.classes.map((cl, idx) => `
                <tr data-class-row="1" data-class-idx="${idx}">
                  <td title="${escapeHtml(cl.id)}">${escapeHtml(prettyId(cl.id))}</td>
                  <td>
                    <input type="number" min="1" inputmode="numeric"
                      data-class-level="1" data-class-idx="${idx}"
                      value="${cl.level ?? 1}" />
                  </td>
                  <td>
                    ${(() => {
                      const subs = getSubclassesForClassId(cl.id);
                      const current = (cl.subclassId || "").toString();
                      if (subs.length > 0) {
                        return (() => {
                          const curLvl = Number(cl.level ?? 1);
                          const mins = subs.map(s => Number(s.min_level || 0)).filter(n => n > 0);
                          const minAny = mins.length ? Math.min(...mins) : 0;

                          // If subclasses are level-gated and we're below the first unlock level,
                          // keep the UI clean: show only a hint (no dropdown yet).
                          if (minAny > 0 && curLvl < minAny) {
                            return `<div class=\"hint\">Subclass unlocks at level ${minAny}+.</div>`;
                          }

                          // Eligible: show dropdown.
                          // We also hide higher-level subclasses until eligible (cleaner UX than showing disabled options).
                          const current = (cl.subclassId || "").toString();
                          const eligibleSubs = subs.filter(s => {
                            const req = Number(s.min_level || 0);
                            return !req || curLvl >= req;
                          });

                          return `
                            <select data-class-subclass="1" data-class-idx="${idx}">
                              <option value="">(none)</option>
                              ${eligibleSubs.map(s => {
                                const sel = current === s.id ? "selected" : "";
                                return `<option value="${escapeHtml(s.id)}" ${sel}>${escapeHtml(s.name || prettyId(s.id))}</option>`;
                              }).join("")}
                            </select>
                          `;
                        })();
                      }
                      // No rules data: allow manual entry
                      return `
                        <input type="text" data-class-subclass-text="1" data-class-idx="${idx}"
                          placeholder="subclass id (e.g. arcane_trickster)" value="${escapeHtml(current)}" />
                      `;
                    })()}
                  </td>
                  <td style="text-align:center;">
                    <input type="radio" name="primary_class"
                      data-class-primary="1" data-class-idx="${idx}"
                      ${cl.isPrimary ? "checked" : ""} />
                  </td>
                  <td>
                    <button type="button" data-class-del="1" data-class-idx="${idx}">Remove</button>
                  </td>
                </tr>
              `).join("")
            }
          </tbody>
        </table>

        <button type="button" id="class_add">Add class (manual)</button>
        <p class="hint">v0: class selection is manual here. Later we can make this a selector and enforce multiclassing rules.</p>
      </section>
      </div>

      <section class="card">
        <h2>Core Combat</h2>

        <div class="grid">
          <div class="field">
            <label for="combat_ac">AC</label>
            <input id="combat_ac" type="number" inputmode="numeric" value="${c.combat?.ac ?? 0}" />
          </div>

          <div class="field">
            <label for="combat_init">Initiative Bonus</label>
            <input id="combat_init" type="number" inputmode="numeric" value="${c.combat?.initiative_bonus ?? 0}" />
          </div>
        </div>

        <div class="grid">
          <div class="field">
            <label for="hp_max">HP Max</label>
            <input id="hp_max" type="number" inputmode="numeric" value="${c.combat?.hp?.max ?? 0}" />
          </div>
          <div class="field">
            <label for="hp_current">HP Current</label>
            <input id="hp_current" type="number" inputmode="numeric" value="${c.combat?.hp?.current ?? 0}" />
          </div>
          <div class="field">
            <label for="hp_temp">Temp HP</label>
            <input id="hp_temp" type="number" inputmode="numeric" value="${c.combat?.hp?.temp ?? 0}" />
          </div>
        </div>
      </section>



      <section class="card">
        <h2>Trackers</h2>

        <div class="grid">
          <div class="field">
            <label for="trk_label">New tracker label</label>
            <input id="trk_label" type="text" placeholder="e.g., Ki Points / Rage uses / Sorcery Points" />
          </div>

          <div class="field">
            <label for="trk_max">Max</label>
            <input id="trk_max" type="number" inputmode="numeric" value="0" />
          </div>

          <div class="field">
            <label for="trk_reset">Resets on</label>
            <select id="trk_reset">
              <option value="none">None</option>
              <option value="short_rest">Short Rest</option>
              <option value="long_rest">Long Rest</option>
              <option value="daily">Daily</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div class="field">
            <label>&nbsp;</label>
            <button id="trk_add" type="button">Add tracker</button>
          </div>
        </div>

        <div class="grid" style="margin-top: 10px;">
          <div class="field">
            <label>&nbsp;</label>
            <button id="trk_reset_short" type="button">Apply Short Rest resets</button>
          </div>
          <div class="field">
            <label>&nbsp;</label>
            <button id="trk_reset_long" type="button">Apply Long Rest resets</button>
          </div>
        </div>

        <div style="margin-top: 12px;">
          ${
            (c.trackers.length === 0)
              ? `<p class="hint">No trackers yet. Add counters for ki, rages, inspiration, charges, etc.</p>`
              : `
                <table class="table">
                  <thead>
                    <tr>
                      <th>Tracker</th>
                      <th>Current</th>
                      <th>Max</th>
                      <th>Reset</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${c.trackers.map(t => `
                      <tr data-trk-row="1" data-trk-id="${escapeHtml(t.id)}">
                        <td>${escapeHtml(t.label ?? "")}</td>
                        <td>
                          <input
                            type="number"
                            inputmode="numeric"
                            class="trk-current"
                            data-trk-current="1"
                            data-trk-id="${escapeHtml(t.id)}"
                            value="${(t.current ?? 0)}"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            inputmode="numeric"
                            class="trk-max"
                            data-trk-max="1"
                            data-trk-id="${escapeHtml(t.id)}"
                            value="${(t.max ?? 0)}"
                          />
                        </td>
                        <td>${escapeHtml(t.reset ?? "none")}</td>
                        <td>
                          <button type="button" data-trk-action="dec" data-trk-id="${escapeHtml(t.id)}">−</button>
                          <button type="button" data-trk-action="inc" data-trk-id="${escapeHtml(t.id)}">+</button>
                          <button type="button" data-trk-action="fill" data-trk-id="${escapeHtml(t.id)}">Reset to Max</button>
                          <button type="button" data-trk-action="del" data-trk-id="${escapeHtml(t.id)}">Delete</button>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              `
          }
        </div>

        <p class="hint">
          Trackers are generic counters. In v1, you manage them manually. Later we can map spell slots and class features to trackers automatically.
        </p>
      </section>
    `;
    // Multiclass handlers
    root.querySelectorAll("input[data-class-level]").forEach((el) => {
      el.addEventListener("input", () => {
        const idx = Number(el.getAttribute("data-class-idx"));
        const v = clampInt(el.value, 1);
        if (Number.isNaN(idx) || v === null) return;
        applyUpdate((next) => {
          normaliseClasses(next);
          if (!next.core.classes[idx]) return;
          next.core.classes[idx].level = v;
        });
      });
    });

    root.querySelectorAll("input[data-class-primary]").forEach((el) => {
      el.addEventListener("change", () => {
        const idx = Number(el.getAttribute("data-class-idx"));
        if (Number.isNaN(idx)) return;
        applyUpdate((next) => {
          normaliseClasses(next);
          next.core.classes.forEach((c2, i) => {
            c2.isPrimary = (i === idx);
          });
          normaliseClasses(next); // re-sync core.classId
        });
        render();
      });
    });

    root.querySelectorAll("button[data-class-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-class-idx"));
        if (Number.isNaN(idx)) return;
        applyUpdate((next) => {
          normaliseClasses(next);
          next.core.classes.splice(idx, 1);
          normaliseClasses(next);
        });
        render();
      });
    });

    // Subclass selection (dropdown from rulesdb or manual text)
    root.querySelectorAll("select[data-class-subclass]").forEach((el) => {
      el.addEventListener("change", () => {
        const idx = Number(el.getAttribute("data-class-idx"));
        if (Number.isNaN(idx)) return;
        const v = (el.value || "").toString().trim();
        applyUpdate((next) => {
          normaliseClasses(next);
          if (!next.core.classes[idx]) return;
          next.core.classes[idx].subclassId = v;
        });
        render();
      });
    });

    root.querySelectorAll("input[data-class-subclass-text]").forEach((el) => {
      el.addEventListener("input", () => {
        const idx = Number(el.getAttribute("data-class-idx"));
        if (Number.isNaN(idx)) return;
        const v = (el.value || "").toString().trim().toLowerCase();
        applyUpdate((next) => {
          normaliseClasses(next);
          if (!next.core.classes[idx]) return;
          next.core.classes[idx].subclassId = v;
        });
      });
    });

    const addClassBtn = root.querySelector("#class_add");
    if (addClassBtn) {
      addClassBtn.addEventListener("click", () => {
        const id = prompt("Enter class id (e.g. fighter, wizard, artificer)");
        if (!id) return;
        const clean = id.toString().trim().toLowerCase();
        if (!clean) return;
        applyUpdate((next) => {
          normaliseClasses(next);
          if (next.core.classes.some(x => x.id === clean)) return;
          next.core.classes.push({ id: clean, level: 1, isPrimary: next.core.classes.length === 0 });
          normaliseClasses(next);
        });
        render();
      });
    }

    // Name
    const nameEl = root.querySelector("#char_name");
    nameEl.addEventListener("input", () => {
      applyUpdate((next) => {
        next.meta.name = nameEl.value;
      });
    });


    // Proficiencies editor: open overlay dialog
    const profOpenBtn = root.querySelector("#prof_open");
    if (profOpenBtn) {
      profOpenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const dlg = document.querySelector("#dlgProficiencies");
        if (!dlg) {
          alert("Proficiencies dialog not found (dlgProficiencies). Check index.html.");
          return;
        }

        const body = dlg.querySelector("#profModalBody");
        const btnClose = dlg.querySelector("#profCancel");
        const form = dlg.querySelector("#formProficiencies");
        if (!body || !btnClose || !form) {
          alert("Proficiencies dialog is missing required elements.");
          return;
        }

        // Render modal body (edit UI)
        body.innerHTML = `
          <div class="prof-edit">
            <div class="prof-edit-grid">
              <div class="prof-block">
                <div class="prof-block-title">Saving throws</div>
                ${renderSaveToggles(c.proficiencies.saves)}
              </div>

              <div class="prof-block">
                <div class="prof-block-title">Skills</div>
                <input id="prof_skills" type="text" placeholder="e.g., perception, stealth, arcana" value="${escapeHtml(c.proficiencies.skills.join(", "))}" />
              </div>

              <div class="prof-block">
                <div class="prof-block-title">Expertise (skills)</div>
                <input id="prof_expertise" type="text" placeholder="e.g., stealth, perception" value="${escapeHtml(c.expertise.skills.join(", "))}" />
              </div>

              <div class="prof-block">
                <div class="prof-block-title">Tools</div>
                <input id="prof_tools" type="text" placeholder="e.g., thieves' tools, herbalism kit" value="${escapeHtml(c.proficiencies.tools.join(", "))}" />
              </div>

              <div class="prof-block">
                <div class="prof-block-title">Languages</div>
                <input id="prof_lang" type="text" placeholder="e.g., Common, Elvish, Draconic" value="${escapeHtml(c.proficiencies.languages.join(", "))}" />
                <div class="hint" style="margin-top:6px;">Add any languages your character knows (species/background/training/DM).</div>
              </div>

              <div class="prof-block">
                <div class="prof-block-title">Armor</div>
                <input id="prof_armor" type="text" placeholder="e.g., light armor, medium armor" value="${escapeHtml(c.proficiencies.armor.join(", "))}" />
              </div>

              <div class="prof-block">
                <div class="prof-block-title">Weapons</div>
                <input id="prof_weapons" type="text" placeholder="e.g., simple weapons, longsword" value="${escapeHtml(c.proficiencies.weapons.join(", "))}" />
              </div>

            <div class="hint" style="margin-top:10px;">Tip: keep entries short during play. We can switch these to selectors later.</div>
          </div>
        `;

        function commitProfs(mut) {
          applyUpdate((next) => {
            normaliseProficiencies(next);
            mut(next);
            normaliseProficiencies(next);
          });
        }

        // Wire modal controls
        const skillsEl = dlg.querySelector("#prof_skills");
        const expEl = dlg.querySelector("#prof_expertise");
        const toolsEl = dlg.querySelector("#prof_tools");
        const langEl = dlg.querySelector("#prof_lang");
        const armorEl = dlg.querySelector("#prof_armor");
        const weapEl = dlg.querySelector("#prof_weapons");

        if (skillsEl) {
          skillsEl.addEventListener("input", () => {
            commitProfs((next) => {
              next.proficiencies.skills = parseCsvList(skillsEl.value).map(s => s.toLowerCase());
            });
          });
        }

        if (expEl) {
          expEl.addEventListener("input", () => {
            commitProfs((next) => {
              next.expertise.skills = parseCsvList(expEl.value).map(s => s.toLowerCase());
            });
          });
        }

        if (toolsEl) {
          toolsEl.addEventListener("input", () => {
            commitProfs((next) => {
              next.proficiencies.tools = parseCsvList(toolsEl.value);
            });
          });
        }

        if (langEl) {
          langEl.addEventListener("input", () => {
            commitProfs((next) => {
              next.proficiencies.languages = parseCsvList(langEl.value);
            });
          });
        }

        if (armorEl) {
          armorEl.addEventListener("input", () => {
            commitProfs((next) => {
              next.proficiencies.armor = parseCsvList(armorEl.value);
            });
          });
        }

        if (weapEl) {
          weapEl.addEventListener("input", () => {
            commitProfs((next) => {
              next.proficiencies.weapons = parseCsvList(weapEl.value);
            });
          });
        }

        dlg.querySelectorAll("input[data-prof-save]").forEach((el) => {
          el.addEventListener("change", () => {
            const key = (el.getAttribute("data-prof-save") || "").toLowerCase();
            if (!key) return;
            commitProfs((next) => {
              const arr = new Set(toLowerKeys(next.proficiencies.saves));
              if (el.checked) arr.add(key);
              else arr.delete(key);
              next.proficiencies.saves = Array.from(arr);
            });
          });
        });

        // Close handlers
        btnClose.onclick = () => dlg.close("cancel");
        dlg.addEventListener("close", () => {
          // re-render view-mode chips after closing
          render();
        }, { once: true });

        // Show the dialog
        dlg.showModal();
      });
    }

    // Combat
    const acEl = root.querySelector("#combat_ac");
    acEl.addEventListener("input", () => {
      const v = clampInt(acEl.value, 0);
      if (v === null) return;
      applyUpdate((next) => {
        next.combat.ac = v;
      });
    });

    const initEl = root.querySelector("#combat_init");
    initEl.addEventListener("input", () => {
      const v = clampInt(initEl.value);
      if (v === null) return;
      applyUpdate((next) => {
        next.combat.initiative_bonus = v;
      });
    });

    const hpMaxEl = root.querySelector("#hp_max");
    hpMaxEl.addEventListener("input", () => {
      const v = clampInt(hpMaxEl.value, 0);
      if (v === null) return;
      applyUpdate((next) => {
        next.combat.hp.max = v;
        // Keep current within bounds if user lowers max
        if (next.combat.hp.current > v) next.combat.hp.current = v;
      });
    });

    const hpCurEl = root.querySelector("#hp_current");
    hpCurEl.addEventListener("input", () => {
      const v = clampInt(hpCurEl.value, 0);
      if (v === null) return;
      applyUpdate((next) => {
        next.combat.hp.current = v;
      });
    });

    const hpTempEl = root.querySelector("#hp_temp");
    hpTempEl.addEventListener("input", () => {
      const v = clampInt(hpTempEl.value, 0);
      if (v === null) return;
      applyUpdate((next) => {
        next.combat.hp.temp = v;
      });
    });



    // Trackers
    const addBtn = root.querySelector("#trk_add");
    const labelEl = root.querySelector("#trk_label");
    const maxEl = root.querySelector("#trk_max");
    const resetEl = root.querySelector("#trk_reset");

    addBtn.addEventListener("click", () => {
      const label = (labelEl.value || "").trim();
      const max = clampInt(maxEl.value, 0);
      const reset = resetEl.value || "none";

      if (!label) return;
      if (max === null) return;

      applyUpdate((next) => {
        normaliseTrackers(next);
        next.trackers.push({
          id: crypto.randomUUID(),
          label,
          type: "counter",
          current: max, // default to full
          max,
          reset
        });
      });
      render();
      // clear inputs for next add
      labelEl.value = "";
      maxEl.value = "0";
      resetEl.value = "none";
    });

    function updateTracker(id, mut) {
      applyUpdate((next) => {
        normaliseTrackers(next);
        const t = next.trackers.find(x => x.id === id);
        if (!t) return;
        mut(t);
        // normalize numeric fields
        t.max = clampInt(t.max, 0) ?? 0;
        t.current = clampInt(t.current, 0) ?? 0;
        t.current = clamp(t.current, 0, t.max);
      });
    }

    root.querySelectorAll("button[data-trk-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-trk-id");
        const action = btn.getAttribute("data-trk-action");
        if (!id) return;

        if (action === "inc") {
          updateTracker(id, (t) => { t.current = (t.current ?? 0) + 1; });
          render();
        } else if (action === "dec") {
          updateTracker(id, (t) => { t.current = (t.current ?? 0) - 1; });
          render();
        } else if (action === "fill") {
          updateTracker(id, (t) => { t.current = t.max ?? 0; });
          render();
        } else if (action === "del") {
          applyUpdate((next) => {
            normaliseTrackers(next);
            next.trackers = next.trackers.filter(x => x.id !== id);
          });
          render();
        }
      });
    });

    root.querySelectorAll("input[data-trk-current]").forEach((el) => {
      el.addEventListener("input", () => {
        const id = el.getAttribute("data-trk-id");
        const v = clampInt(el.value, 0);
        if (!id || v === null) return;
        updateTracker(id, (t) => { t.current = v; });
      });
    });

    root.querySelectorAll("input[data-trk-max]").forEach((el) => {
      el.addEventListener("input", () => {
        const id = el.getAttribute("data-trk-id");
        const v = clampInt(el.value, 0);
        if (!id || v === null) return;
        updateTracker(id, (t) => { t.max = v; });
      });
    });

    const shortBtn = root.querySelector("#trk_reset_short");
    const longBtn = root.querySelector("#trk_reset_long");

    shortBtn.addEventListener("click", () => {
      applyUpdate((next) => {
        normaliseTrackers(next);
        next.trackers.forEach((t) => {
          if (t.reset === "short_rest") {
            t.current = t.max ?? 0;
          }
        });
      });
      render();
    });

    longBtn.addEventListener("click", () => {
      applyUpdate((next) => {
        normaliseTrackers(next);
        next.trackers.forEach((t) => {
          if (t.reset === "long_rest" || t.reset === "daily") {
            t.current = t.max ?? 0;
          }
        });
      });
      render();
    });
  }

  return { render };
}