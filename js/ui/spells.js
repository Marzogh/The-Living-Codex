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
    const c = getCharacter();
    if (!c) {
      root.innerHTML = "";
      return;
    }

    normaliseSpells(c);
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
                <tr data-rule-spell-id="${escapeHtml(sp.id)}">
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

        resEl.querySelectorAll("tr[data-rule-spell-id]").forEach(tr => {
          const ruleId = tr.getAttribute("data-rule-spell-id");
          const addBtn = tr.querySelector("button[data-add-rule-spell]");
          if (!addBtn) return;

          addBtn.addEventListener("click", () => {
            const rec = dbNow.spells.get(ruleId);
            if (!rec) return;

            applyUpdate((next) => {
              normaliseSpells(next);

              // Prevent duplicates by spell_id if present
              const already = next.spells_known.some(s => (s.spell_id && s.spell_id === rec.id) || (s.name || "").toLowerCase() === (rec.name || "").toLowerCase());
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

            // Re-render to show the new spell
            render();
          });
        });
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
  }

  let activeTab = "known";

  return { render };
}