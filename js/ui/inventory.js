/**
 * Inventory Editor UI (v1)
 *
 * - Simple editable table
 * - CSV-schema aligned rows
 * - No encumbrance, no automation
 * - State updates delegated via onChange()
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

function normaliseInventory(c) {
  if (!c.inventory) c.inventory = [];
  if (!Array.isArray(c.inventory)) c.inventory = [];
}

function emptyRow() {
  return {
    id: crypto.randomUUID(),
    name: "",
    category: "",
    qty: 1,
    weight_each: "",
    weight_unit: "",
    value: "",
    value_currency: "",
    attunement: "",
    container: "",
    equipped: "",
    notes: ""
  };
}

export function mountInventory({ root, getCharacter, onChange }) {
  if (!root) throw new Error("mountInventory: root is required");
  if (typeof getCharacter !== "function") throw new Error("mountInventory: getCharacter must be a function");
  if (typeof onChange !== "function") throw new Error("mountInventory: onChange must be a function");

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
      root.innerHTML = "";
      return;
    }

    normaliseInventory(c);

    root.innerHTML = `
      <section class="card">
        <h2>Inventory</h2>

        <div style="margin-bottom: 8px;">
          <button id="inv_add" type="button">Add item</button>
        </div>

        ${
          c.inventory.length === 0
            ? `<p class="hint">No items yet.</p>`
            : `
              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Equipped</th>
                    <th>Container</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.inventory.map(row => `
                    <tr data-inv-id="${escapeHtml(row.id)}">
                      <td><input data-inv-field="name" type="text" value="${escapeHtml(row.name)}" /></td>
                      <td><input data-inv-field="qty" type="number" inputmode="numeric" value="${row.qty}" /></td>
                      <td><input data-inv-field="equipped" type="checkbox" ${row.equipped ? "checked" : ""} /></td>
                      <td><input data-inv-field="container" type="text" value="${escapeHtml(row.container)}" /></td>
                      <td><input data-inv-field="notes" type="text" value="${escapeHtml(row.notes)}" /></td>
                      <td>
                        <button type="button" data-inv-action="del">Delete</button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            `
        }
      </section>
    `;

    const addBtn = root.querySelector("#inv_add");
    addBtn.addEventListener("click", () => {
      applyUpdate((next) => {
        normaliseInventory(next);
        next.inventory.push(emptyRow());
      });
      render();
    });

    root.querySelectorAll("tr[data-inv-id]").forEach((tr) => {
      const id = tr.getAttribute("data-inv-id");

      tr.querySelectorAll("input[data-inv-field]").forEach((input) => {
        const field = input.getAttribute("data-inv-field");

        input.addEventListener("input", () => {
          applyUpdate((next) => {
            normaliseInventory(next);
            const row = next.inventory.find(r => r.id === id);
            if (!row) return;

            if (input.type === "checkbox") {
              row[field] = input.checked;
            } else if (input.type === "number") {
              row[field] = Number(input.value);
            } else {
              row[field] = input.value;
            }
          });
        });
      });

      const delBtn = tr.querySelector("button[data-inv-action='del']");
      delBtn.addEventListener("click", () => {
        applyUpdate((next) => {
          normaliseInventory(next);
          next.inventory = next.inventory.filter(r => r.id !== id);
        });
        render();
      });
    });
  }

  return { render };
}