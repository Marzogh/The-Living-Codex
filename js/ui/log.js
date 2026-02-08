

/**
 * Session Log UI (v1)
 *
 * Purpose:
 * - A lightweight running log players can update during play
 * - Later: round-trip to log.csv + richer event types
 *
 * Data model (v1 UI): character.log[] entries with:
 * - id: string
 * - utc: ISO string
 * - tag: string (optional)
 * - message: string
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

function normaliseLog(c) {
  if (!c.log) c.log = [];
  if (!Array.isArray(c.log)) c.log = [];
}

function emptyEntry() {
  return {
    id: crypto.randomUUID(),
    utc: nowIso(),
    tag: "",
    message: ""
  };
}

export function mountLog({ root, getCharacter, onChange }) {
  if (!root) throw new Error("mountLog: root is required");
  if (typeof getCharacter !== "function") throw new Error("mountLog: getCharacter must be a function");
  if (typeof onChange !== "function") throw new Error("mountLog: onChange must be a function");

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

    normaliseLog(c);

    // newest first for play
    const entries = [...c.log].sort((a, b) => (b.utc || "").localeCompare(a.utc || ""));

    root.innerHTML = `
      <section class="card">
        <h2>Log</h2>

        <div class="grid" style="margin-bottom: 8px;">
          <div class="field">
            <label>&nbsp;</label>
            <button id="log_add" type="button">Add entry</button>
          </div>
          <div class="field">
            <label>&nbsp;</label>
            <button id="log_clear" type="button">Clear log</button>
          </div>
        </div>

        ${entries.length === 0 ? `<p class="hint">No log entries yet.</p>` : `
          <table class="table">
            <thead>
              <tr>
                <th style="width: 12em;">UTC</th>
                <th style="width: 10em;">Tag</th>
                <th>Message</th>
                <th style="width: 7em;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map(e => `
                <tr data-log-id="${escapeHtml(e.id)}">
                  <td>
                    <input data-log-field="utc" type="text" value="${escapeHtml(e.utc)}" />
                  </td>
                  <td>
                    <input data-log-field="tag" type="text" value="${escapeHtml(e.tag)}" placeholder="e.g., loot" />
                  </td>
                  <td>
                    <input data-log-field="message" type="text" value="${escapeHtml(e.message)}" placeholder="What happened?" />
                  </td>
                  <td>
                    <button type="button" data-log-action="del">Delete</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `}

        <p class="hint">
          Tip: Keep it short during play. Later we can add quick-add templates (short rest, long rest, spent gold, etc.).
        </p>
      </section>
    `;

    // Structural actions
    root.querySelector("#log_add").addEventListener("click", () => {
      applyUpdate((next) => {
        normaliseLog(next);
        next.log.push(emptyEntry());
      });
      render();
    });

    root.querySelector("#log_clear").addEventListener("click", () => {
      const ok = confirm("Clear all log entries? This cannot be undone.");
      if (!ok) return;
      applyUpdate((next) => {
        next.log = [];
      });
      render();
    });

    // Field edits (NO render to preserve focus)
    root.querySelectorAll("tr[data-log-id]").forEach((tr) => {
      const id = tr.getAttribute("data-log-id");

      tr.querySelectorAll("input[data-log-field]").forEach((input) => {
        const field = input.getAttribute("data-log-field");
        input.addEventListener("input", () => {
          applyUpdate((next) => {
            normaliseLog(next);
            const row = next.log.find((x) => x.id === id);
            if (!row) return;
            row[field] = input.value;
          });
        });
      });

      const delBtn = tr.querySelector("button[data-log-action='del']");
      delBtn.addEventListener("click", () => {
        applyUpdate((next) => {
          normaliseLog(next);
          next.log = next.log.filter((x) => x.id !== id);
        });
        render();
      });
    });
  }

  return { render };
}