/**
 * Spells Editor UI (v1)
 *
 * - Known is editable; Prepared is a read-only view derived from Known toggles
 * - CSV-schema aligned rows
 * - No spell text, no automation
 */

function nowIso() {
  return new Date().toISOString();
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

function normaliseSpells(c) {
  if (!c.spells_known || !Array.isArray(c.spells_known)) c.spells_known = [];
  if (!c.spells_prepared || !Array.isArray(c.spells_prepared)) c.spells_prepared = [];

  // Backfill fields for older rows
  for (const row of c.spells_known) {
    if (row.ritual === "") row.ritual = false;
    if (row.concentration === "") row.concentration = false;
    if (row.ritual == null) row.ritual = false;
    if (row.concentration == null) row.concentration = false;
    if (row.spell_id == null) row.spell_id = "";
    if (row.page == null) row.page = "";
    if (row.source == null) row.source = row.source ?? "";
  }
  for (const row of c.spells_prepared) {
    if (row.ritual === "") row.ritual = false;
    if (row.concentration === "") row.concentration = false;
    if (row.ritual == null) row.ritual = false;
    if (row.concentration == null) row.concentration = false;
    if (row.spell_id == null) row.spell_id = "";
    if (row.page == null) row.page = "";
    if (row.source == null) row.source = row.source ?? "";
  }
}

function normaliseSpellSlots(c) {
  if (!c.spell_slots || typeof c.spell_slots !== "object") {
    c.spell_slots = { pact: { max: 0, used: 0, level: 1 }, levels: {} };
  }
  if (!c.spell_slots.pact || typeof c.spell_slots.pact !== "object") {
    c.spell_slots.pact = { max: 0, used: 0, level: 1 };
  }
  if (!c.spell_slots.levels || typeof c.spell_slots.levels !== "object") {
    c.spell_slots.levels = {};
  }

  // Ensure levels 1..9 exist
  for (let i = 1; i <= 9; i++) {
    const k = String(i);
    if (!c.spell_slots.levels[k] || typeof c.spell_slots.levels[k] !== "object") {
      c.spell_slots.levels[k] = { max: 0, used: 0 };
    }
    const row = c.spell_slots.levels[k];
    row.max = Number.isFinite(Number(row.max)) ? Math.max(0, Number(row.max)) : 0;
    row.used = Number.isFinite(Number(row.used)) ? Math.max(0, Number(row.used)) : 0;
    if (row.used > row.max) row.used = row.max;
  }

  // Pact
  c.spell_slots.pact.max = Number.isFinite(Number(c.spell_slots.pact.max)) ? Math.max(0, Number(c.spell_slots.pact.max)) : 0;
  c.spell_slots.pact.used = Number.isFinite(Number(c.spell_slots.pact.used)) ? Math.max(0, Number(c.spell_slots.pact.used)) : 0;
  c.spell_slots.pact.level = Number.isFinite(Number(c.spell_slots.pact.level)) ? Math.min(9, Math.max(1, Number(c.spell_slots.pact.level))) : 1;
  if (c.spell_slots.pact.used > c.spell_slots.pact.max) c.spell_slots.pact.used = c.spell_slots.pact.max;
}

function clamp(n, lo, hi) {
  const x = Number(n);
  if (!Number.isFinite(x)) return lo;
  return Math.max(lo, Math.min(hi, x));
}

function hasWarlockClass(c) {
  try {
    const ids = inferCharacterClassIds(c);
    return ids.includes("warlock");
  } catch {
    return false;
  }
}

function renderSpellSlotsCard(c) {
  // v0: manual entry; class-aware display only (Pact shown if Warlock present or pact.max>0)
  const showPact = hasWarlockClass(c) || (c.spell_slots?.pact?.max ?? 0) > 0;

  const pact = c.spell_slots?.pact || { max: 0, used: 0, level: 1 };

  const rows = [];
  for (let lvl = 1; lvl <= 9; lvl++) {
    const k = String(lvl);
    const r = c.spell_slots?.levels?.[k] || { max: 0, used: 0 };
    rows.push({ lvl, max: r.max ?? 0, used: r.used ?? 0 });
  }

  return `
    <section class="card" style="margin-top: 10px;">
      <h2>Spell Slots</h2>

      <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom: 10px;">
        <button type="button" data-slot-reset="short">Short rest: reset Pact</button>
        <button type="button" data-slot-reset="long">Long rest: reset all</button>
        <span class="hint">v0: you set max slots manually. Used slots can’t exceed max.</span>
      </div>

      ${showPact ? `
        <div class="card" style="padding: 10px; margin-bottom: 10px;">
          <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
            <div style="min-width:160px;"><strong>Pact Magic (Warlock)</strong></div>

            <div>
              <label class="hint" style="display:block;">Slot level</label>
              <input type="number" min="1" max="9" inputmode="numeric" data-pact-level="1" value="${escapeHtml(pact.level)}" style="width: 90px;" />
            </div>

            <div>
              <label class="hint" style="display:block;">Max</label>
              <input type="number" min="0" inputmode="numeric" data-pact-max="1" value="${escapeHtml(pact.max)}" style="width: 90px;" />
            </div>

            <div>
              <label class="hint" style="display:block;">Used</label>
              <div style="display:flex; gap:6px; align-items:center;">
                <button type="button" data-pact-used-delta="-1">−</button>
                <span data-pact-used="1" style="min-width: 2ch; text-align:center;">${escapeHtml(pact.used)}</span>
                <button type="button" data-pact-used-delta="+1">+</button>
              </div>
            </div>
          </div>
        </div>
      ` : ""}

      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Level</th>
              <th style="width: 120px;">Max</th>
              <th style="width: 180px;">Used</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr data-slot-lvl="${r.lvl}">
                <td><strong>${r.lvl}</strong></td>
                <td>
                  <input type="number" min="0" inputmode="numeric" data-slot-max="1" data-slot-lvl="${r.lvl}" value="${escapeHtml(r.max)}" style="width: 100px;" />
                </td>
                <td>
                  <div style="display:flex; gap:6px; align-items:center;">
                    <button type="button" data-slot-used-delta="-1" data-slot-lvl="${r.lvl}">−</button>
                    <span data-slot-used="1" data-slot-lvl="${r.lvl}" style="min-width: 2ch; text-align:center;">${escapeHtml(r.used)}</span>
                    <button type="button" data-slot-used-delta="+1" data-slot-lvl="${r.lvl}">+</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function copySpellFields(src, dst) {
  // Keep id stable; copy the common editable fields
  dst.name = src.name;
  dst.level = src.level;
  dst.school = src.school;
  dst.ritual = src.ritual;
  dst.concentration = src.concentration;
  dst.source = src.source;
  dst.page = src.page;
  dst.spell_id = src.spell_id;
  dst.notes = src.notes;
}

function hasPrepared(c, id) {
  return Array.isArray(c.spells_prepared) && c.spells_prepared.some(s => s.id === id);
}

function emptySpell() {
  return {
    id: crypto.randomUUID(),
    // Optional RulesDB reference
    spell_id: "",
    name: "",
    level: 0,
    school: "",
    ritual: false,
    concentration: false,
    source: "",
    page: "",
    notes: ""
  };
}

export function mountSpells({ root, getCharacter, onChange, getRulesDb }) {
  if (!root) throw new Error("mountSpells: root is required");
  if (typeof getCharacter !== "function") throw new Error("mountSpells: getCharacter must be a function");
  if (typeof onChange !== "function") throw new Error("mountSpells: onChange must be a function");
  const rulesDbGetter = typeof getRulesDb === "function" ? getRulesDb : () => null;

  // Optimistic local cache for updates (prevents UI from lagging behind external state updates)
  let lastCharacter = null;

  function inferCharacterClassIds(c) {
    // Prefer explicit fields if present
    const direct = [];

    // Canonical v0 field (New Character dialog)
    if (c?.core?.classId) direct.push(c.core.classId);

    // Common patterns
    if (c?.class_primary) direct.push(c.class_primary);
    if (c?.primary_class) direct.push(c.primary_class);
    if (c?.core?.class_primary) direct.push(c.core.class_primary);
    if (c?.core?.primary_class) direct.push(c.core.primary_class);

    // If there is a classes array, collect IDs/names
    if (Array.isArray(c?.classes)) {
      for (const cl of c.classes) {
        if (!cl) continue;
        if (cl.id) direct.push(cl.id);
        else if (cl.class_id) direct.push(cl.class_id);
        else if (cl.name) direct.push(cl.name);
      }
    }

    // Future-proof: if classes are stored under core (multiclass-ready)
    if (Array.isArray(c?.core?.classes)) {
      for (const cl of c.core.classes) {
        if (!cl) continue;
        if (cl.id) direct.push(cl.id);
        else if (cl.class_id) direct.push(cl.class_id);
        else if (cl.name) direct.push(cl.name);
      }
    }

    // If there is a single class field
    if (c?.class) direct.push(c.class);
    if (c?.core?.class) direct.push(c.core.class);
    if (c?.class_id) direct.push(c.class_id);
    if (c?.core?.class_id) direct.push(c.core.class_id);

    const cleaned = direct
      .map(x => (x ?? "").toString().trim().toLowerCase())
      .filter(Boolean);

    // Normalize a few common variants
    const map = {
      "fighter": "fighter",
      "wizard": "wizard",
      "cleric": "cleric",
      "druid": "druid",
      "rogue": "rogue",
      "ranger": "ranger",
      "paladin": "paladin",
      "bard": "bard",
      "sorcerer": "sorcerer",
      "warlock": "warlock",
      "monk": "monk",
      "barbarian": "barbarian",
      "artificer": "artificer"
    };

    return [...new Set(cleaned.map(v => map[v] || v))];
  }

  function renderSpellSelector(c) {
    const db = rulesDbGetter();
    if (!db?.spells?.search) {
      return `
        <div class="hint" style="margin: 8px 0;">
          Rules dataset not loaded. You can still add spells manually.
        </div>
      `;
    }

    // Minimal controls. We store state in DOM (data-attrs) so we don't add new module-level state.
    const classIds = inferCharacterClassIds(c);
    const classHint = classIds.length
      ? `Filtering by class: <strong>${escapeHtml(classIds.join(", "))}</strong> (toggle override to show all).`
      : `No class found on this character yet. Search will show all spells.`;

    return `
      <div class="card" style="margin: 8px 0; padding: 10px;">
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:end;">
          <div style="min-width: 220px; flex: 1;">
            <label class="hint" for="spell_sel_q" style="display:block; margin-bottom:4px;">Find a spell</label>
            <input id="spell_sel_q" type="text" placeholder="Search spells…" />
          </div>

          <div style="width: 120px;">
            <label class="hint" for="spell_sel_level" style="display:block; margin-bottom:4px;">Level</label>
            <select id="spell_sel_level">
              <option value="">Any</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <label style="display:flex; align-items:center; gap:6px; user-select:none;">
              <input id="spell_sel_all" type="checkbox" />
              <span>Show all spells (override)</span>
            </label>
          </div>
        </div>

        <div class="hint" style="margin-top:6px;">${classHint}</div>

        <div id="spell_sel_results" style="margin-top:8px;"></div>
      </div>
    `;
  }

  function applyUpdate(mutator) {
    const current = getCharacter();
    if (!current) return;

    const next = structuredClone(current);
    mutator(next);
    if (next.meta) next.meta.modified_utc = nowIso();
    lastCharacter = next;
    onChange(next);
  }

  function renderTable(c, list, key) {
    if (list.length === 0) {
      return `<p class="hint">No spells in this list.</p>`;
    }

    return `
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Lvl</th>
            <th>School</th>
            <th>Ritual</th>
            <th>Conc.</th>
            ${key === "spells_known" ? "<th>Prepared</th>" : ""}
            <th>Source</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(sp => `
            <tr data-spell-id="${escapeHtml(sp.id)}">
              <td><input data-spell-field="name" type="text" value="${escapeHtml(sp.name)}" ${key === "spells_prepared" ? "disabled" : ""} /></td>
              <td><input data-spell-field="level" type="number" inputmode="numeric" value="${sp.level}" ${key === "spells_prepared" ? "disabled" : ""} /></td>
              <td><input data-spell-field="school" type="text" value="${escapeHtml(sp.school)}" ${key === "spells_prepared" ? "disabled" : ""} /></td>
              <td><input data-spell-field="ritual" type="checkbox" ${sp.ritual ? "checked" : ""} ${key === "spells_prepared" ? "disabled" : ""} /></td>
              <td><input data-spell-field="concentration" type="checkbox" ${sp.concentration ? "checked" : ""} ${key === "spells_prepared" ? "disabled" : ""} /></td>
              ${key === "spells_known" ? `
                <td>
                  <input
                    type="checkbox"
                    data-prep-toggle="1"
                    data-prep-id="${escapeHtml(sp.id)}"
                    ${hasPrepared(c, sp.id) ? "checked" : ""}
                  />
                </td>
              ` : ""}
              <td>
                <input data-spell-field="source" type="text" value="${escapeHtml(sp.source)}" ${key === "spells_prepared" ? "disabled" : ""} style="width: 120px;" />
                <input data-spell-field="page" type="text" value="${escapeHtml(sp.page)}" ${key === "spells_prepared" ? "disabled" : ""} style="width: 70px; margin-left: 6px;" placeholder="p." />
              </td>
              <td><input data-spell-field="notes" type="text" value="${escapeHtml(sp.notes)}" ${key === "spells_prepared" ? "disabled" : ""} /></td>
              <td>
                ${key === "spells_known" ? "<button type=\"button\" data-spell-action=\"del\">Delete</button>" : ""}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function render() {
    const c = lastCharacter || getCharacter();
    if (!c) {
      root.innerHTML = "";
      return;
    }

    normaliseSpells(c);
    normaliseSpellSlots(c);
    const db = rulesDbGetter();

    const list = activeTab === "known" ? c.spells_known : c.spells_prepared;
    const listKey = activeTab === "known" ? "spells_known" : "spells_prepared";
    const isReadOnly = listKey === "spells_prepared";

    root.innerHTML = `
      <section class="card">
        <h2>Spells</h2>

        <div style="margin-bottom: 8px;">
          <button type="button" data-tab="known" ${activeTab === "known" ? "disabled" : ""}>Known</button>
          <button type="button" data-tab="prepared" ${activeTab === "prepared" ? "disabled" : ""}>Prepared</button>
        </div>

        <div style="margin-bottom: 8px;">
          <button id="spell_add" type="button" ${isReadOnly ? "disabled" : ""}>Add custom spell</button>
        </div>

        ${!isReadOnly ? renderSpellSelector(c) : ""}

        ${!isReadOnly ? renderSpellSlotsCard(c) : ""}

        ${renderTable(c, list, listKey)}
      </section>
    `;

    root.querySelectorAll("button[data-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        activeTab = btn.getAttribute("data-tab");
        render();
      });
    });

    if (!isReadOnly) {
      root.querySelector("#spell_add").addEventListener("click", () => {
        applyUpdate((next) => {
          normaliseSpells(next);
          next[listKey].push(emptySpell());
        });
        render();
      });
    }

    // Selector-based add (RulesDB) - Known tab only
    if (!isReadOnly) {
      const dbNow = rulesDbGetter();
      const qEl = root.querySelector("#spell_sel_q");
      const lvlEl = root.querySelector("#spell_sel_level");
      const allEl = root.querySelector("#spell_sel_all");
      const resEl = root.querySelector("#spell_sel_results");

      const classIds = inferCharacterClassIds(c);

      // Cache the current rendered search results so Add can work even if RulesDB has no .get(id)
      const resultsCache = new Map();

      function renderResults() {
        if (!resEl) return;
        if (!dbNow?.spells?.search) {
          resEl.innerHTML = "";
          return;
        }

        const query = qEl ? qEl.value : "";
        const levelVal = lvlEl ? lvlEl.value : "";
        const showAll = allEl ? allEl.checked : false;

        const filters = {};
        if (levelVal !== "") filters.level = Number(levelVal);
        if (!showAll && classIds.length) filters.classes = classIds;

        const results = dbNow.spells.search(query, filters).slice(0, 20);

        // Refresh cache
        resultsCache.clear();
        for (const sp of results) {
          if (sp?.id) resultsCache.set(String(sp.id), sp);
        }

        if (!query && levelVal === "" && !showAll) {
          resEl.innerHTML = `<p class="hint">Type a search term to find spells, or turn on “Show all spells”.</p>`;
          return;
        }

        if (results.length === 0) {
          resEl.innerHTML = `<p class="hint">No matches.</p>`;
          return;
        }

        resEl.innerHTML = `
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Lvl</th>
                <th>School</th>
                <th>Ritual</th>
                <th>Conc.</th>
                <th>Source</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${results.map(sp => `
                <tr data-rule-spell-id="${encodeURIComponent(sp.id)}">
                  <td>${escapeHtml(sp.name)}</td>
                  <td>${escapeHtml(sp.level)}</td>
                  <td>${escapeHtml(sp.school)}</td>
                  <td>${sp.ritual ? "Yes" : ""}</td>
                  <td>${sp.concentration ? "Yes" : ""}</td>
                  <td>${escapeHtml(sp.source)} ${sp.page ? `(p.${escapeHtml(sp.page)})` : ""}</td>
                  <td><button type="button" data-add-rule-spell="1">Add</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `;

        // Use event delegation so bindings survive re-renders of the results table
        if (!resEl.__addRuleSpellBound) {
          resEl.addEventListener("click", (e) => {
            const btn = e.target?.closest?.("button[data-add-rule-spell]");
            if (!btn) return;

            const tr = btn.closest("tr[data-rule-spell-id]");
            if (!tr) return;

            const ruleId = decodeURIComponent(tr.getAttribute("data-rule-spell-id") || "");
            if (!ruleId) return;

            const rec = resultsCache.get(String(ruleId)) || null;
            if (!rec) {
              console.warn("Add spell failed: record not found in current results cache for id", ruleId);
              return;
            }

            applyUpdate((next) => {
              normaliseSpells(next);

              // Prevent duplicates by RulesDB id only (names are not stable and can be blank)
              const already = next.spells_known.some((s) => s.spell_id && s.spell_id === rec.id);
              if (already) return;

              const row = emptySpell();
              row.spell_id = rec.id;
              row.name = rec.name;
              row.level = Number(rec.level) || 0;
              row.school = rec.school || "";
              row.ritual = Boolean(rec.ritual);
              row.concentration = Boolean(rec.concentration);
              row.source = rec.source || "";
              row.page = rec.page || "";

              next.spells_known.push(row);
            });

            render();
          });
          resEl.__addRuleSpellBound = true;
        }
      }

      if (qEl) qEl.addEventListener("input", renderResults);
      if (lvlEl) lvlEl.addEventListener("change", renderResults);
      if (allEl) allEl.addEventListener("change", renderResults);

      // Initial state
      renderResults();
    }

    root.querySelectorAll("tr[data-spell-id]").forEach(tr => {
      const id = tr.getAttribute("data-spell-id");

      if (!isReadOnly) {
        tr.querySelectorAll("input[data-spell-field]").forEach(input => {
          const field = input.getAttribute("data-spell-field");

          input.addEventListener("input", () => {
            applyUpdate((next) => {
              normaliseSpells(next);
              const row = next[listKey].find(s => s.id === id);
              if (!row) return;

              if (input.type === "checkbox") {
                row[field] = input.checked;
              } else if (input.type === "number") {
                row[field] = Number(input.value);
              } else {
                row[field] = input.value;
              }

              // Keep known/prepared copies in sync when they share the same id
              if (listKey === "spells_known") {
                const other = next.spells_prepared.find(s => s.id === id);
                if (other) copySpellFields(row, other);
              } else {
                const other = next.spells_known.find(s => s.id === id);
                if (other) copySpellFields(row, other);
              }
            });
          });
        });
      }

      // Prepared toggle (Known tab only)
      const prepToggle = tr.querySelector("input[data-prep-toggle]");
      if (prepToggle) {
        prepToggle.addEventListener("change", () => {
          const prepId = prepToggle.getAttribute("data-prep-id");
          const shouldBePrepared = prepToggle.checked;

          applyUpdate((next) => {
            normaliseSpells(next);

            const known = next.spells_known.find(s => s.id === prepId);
            if (!known) return;

            if (shouldBePrepared) {
              if (!next.spells_prepared.some(s => s.id === prepId)) {
                const copy = structuredClone(known);
                next.spells_prepared.push(copy);
              }
            } else {
              next.spells_prepared = next.spells_prepared.filter(s => s.id !== prepId);
            }
          });

          // Structural change for the prepared list; re-render so UI stays consistent.
          render();
        });
      }

      const delBtn = tr.querySelector("button[data-spell-action='del']");
      if (delBtn) {
        delBtn.addEventListener("click", () => {
          applyUpdate((next) => {
            normaliseSpells(next);
            next[listKey] = next[listKey].filter(s => s.id !== id);
            if (listKey === "spells_known") {
              next.spells_prepared = next.spells_prepared.filter(s => s.id !== id);
            }
          });
          render();
        });
      }
    });

    // Spell slot tracker wiring (Known tab only)
    if (!isReadOnly) {
      // Max fields for levels 1..9
      root.querySelectorAll("input[data-slot-max]").forEach((inp) => {
        inp.addEventListener("input", () => {
          const lvl = inp.getAttribute("data-slot-lvl");
          applyUpdate((next) => {
            normaliseSpellSlots(next);
            const k = String(lvl);
            const row = next.spell_slots.levels[k];
            row.max = Math.max(0, Number(inp.value) || 0);
            if (row.used > row.max) row.used = row.max;
          });
          render();
        });
      });

      // Used +/- for levels 1..9
      root.querySelectorAll("button[data-slot-used-delta]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const lvl = btn.getAttribute("data-slot-lvl");
          const delta = Number(btn.getAttribute("data-slot-used-delta")) || 0;
          applyUpdate((next) => {
            normaliseSpellSlots(next);
            const k = String(lvl);
            const row = next.spell_slots.levels[k];
            row.used = clamp((row.used || 0) + delta, 0, row.max || 0);
          });
          render();
        });
      });

      // Pact fields
      const pactMax = root.querySelector("input[data-pact-max]");
      const pactLevel = root.querySelector("input[data-pact-level]");

      if (pactMax) {
        pactMax.addEventListener("input", () => {
          applyUpdate((next) => {
            normaliseSpellSlots(next);
            next.spell_slots.pact.max = Math.max(0, Number(pactMax.value) || 0);
            if (next.spell_slots.pact.used > next.spell_slots.pact.max) next.spell_slots.pact.used = next.spell_slots.pact.max;
          });
          render();
        });
      }

      if (pactLevel) {
        pactLevel.addEventListener("input", () => {
          applyUpdate((next) => {
            normaliseSpellSlots(next);
            next.spell_slots.pact.level = clamp(Number(pactLevel.value) || 1, 1, 9);
          });
          render();
        });
      }

      root.querySelectorAll("button[data-pact-used-delta]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const delta = Number(btn.getAttribute("data-pact-used-delta")) || 0;
          applyUpdate((next) => {
            normaliseSpellSlots(next);
            const p = next.spell_slots.pact;
            p.used = clamp((p.used || 0) + delta, 0, p.max || 0);
          });
          render();
        });
      });

    // Rest resets
    root.querySelectorAll("button[data-slot-reset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const kind = btn.getAttribute("data-slot-reset");
        applyUpdate((next) => {
          normaliseSpellSlots(next);
          if (kind === "short") {
            // Pact resets on short rest
            next.spell_slots.pact.used = 0;
          } else {
            // Long rest resets everything
            for (let i = 1; i <= 9; i++) {
              next.spell_slots.levels[String(i)].used = 0;
            }
            next.spell_slots.pact.used = 0;
          }
        });
        render();
      });
    });

    lastCharacter = null;
  }
  }

  let activeTab = "known";

  return { render };
}