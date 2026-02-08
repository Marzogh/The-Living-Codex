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
}

function copySpellFields(src, dst) {
  // Keep id stable; copy the common editable fields
  dst.name = src.name;
  dst.level = src.level;
  dst.school = src.school;
  dst.ritual = src.ritual;
  dst.concentration = src.concentration;
  dst.source = src.source;
  dst.notes = src.notes;
}

function hasPrepared(c, id) {
  return Array.isArray(c.spells_prepared) && c.spells_prepared.some(s => s.id === id);
}

function emptySpell() {
  return {
    id: crypto.randomUUID(),
    name: "",
    level: 0,
    school: "",
    ritual: "",
    concentration: "",
    source: "",
    notes: ""
  };
}

export function mountSpells({ root, getCharacter, onChange }) {
  if (!root) throw new Error("mountSpells: root is required");
  if (typeof getCharacter !== "function") throw new Error("mountSpells: getCharacter must be a function");
  if (typeof onChange !== "function") throw new Error("mountSpells: onChange must be a function");

  let activeTab = "known";

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
          <button id="spell_add" type="button" ${isReadOnly ? "disabled" : ""}>Add spell</button>
        </div>

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

  return { render };
}