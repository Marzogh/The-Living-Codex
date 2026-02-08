

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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normaliseTrackers(c) {
  if (!c.trackers) c.trackers = [];
  if (!Array.isArray(c.trackers)) c.trackers = [];
}

function renderEmpty() {
  return `
    <section class="card">
      <h2>Character</h2>
      <p>No character loaded. Use <b>New Character</b> or <b>Import ZIP</b>.</p>
    </section>
  `;
}

function abilityRow(label, key, val) {
  const safeVal = (val ?? "").toString();
  return `
    <tr>
      <td><label for="ab_${key}">${label}</label></td>
      <td><input id="ab_${key}" data-ab="${key}" type="number" inputmode="numeric" value="${safeVal}" /></td>
    </tr>
  `;
}

export function mountEditor({ root, getCharacter, onChange }) {
  if (!root) throw new Error("mountEditor: root is required");
  if (typeof getCharacter !== "function") throw new Error("mountEditor: getCharacter must be a function");
  if (typeof onChange !== "function") throw new Error("mountEditor: onChange must be a function");

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

    root.innerHTML = `
      <section class="card">
        <h2>Character</h2>

        <div class="grid">
          <div class="field">
            <label for="char_name">Name</label>
            <input id="char_name" type="text" value="${escapeHtml(c.meta?.name ?? "")}" />
          </div>

          <div class="field">
            <label>Ruleset (locked)</label>
            <div class="readonly" id="ruleset_id">${c.meta?.ruleset_id ?? ""}</div>
          </div>
        </div>
      </section>

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
        <h2>Abilities</h2>
        <table class="table">
          <thead>
            <tr><th>Ability</th><th>Score</th></tr>
          </thead>
          <tbody>
            ${abilityRow("STR", "str", c.abilities?.str)}
            ${abilityRow("DEX", "dex", c.abilities?.dex)}
            ${abilityRow("CON", "con", c.abilities?.con)}
            ${abilityRow("INT", "int", c.abilities?.int)}
            ${abilityRow("WIS", "wis", c.abilities?.wis)}
            ${abilityRow("CHA", "cha", c.abilities?.cha)}
          </tbody>
        </table>
        <p class="hint">Tip: Derived modifiers are not automated in v1. Enter raw scores.</p>
      </section>

      <section class="card">
        <h2>Currency</h2>
        <div class="grid">
          <div class="field">
            <label for="cur_cp">CP</label>
            <input id="cur_cp" type="number" inputmode="numeric" value="${c.currency?.cp ?? 0}" />
          </div>
          <div class="field">
            <label for="cur_sp">SP</label>
            <input id="cur_sp" type="number" inputmode="numeric" value="${c.currency?.sp ?? 0}" />
          </div>
          <div class="field">
            <label for="cur_gp">GP</label>
            <input id="cur_gp" type="number" inputmode="numeric" value="${c.currency?.gp ?? 0}" />
          </div>
          <div class="field">
            <label for="cur_pp">PP</label>
            <input id="cur_pp" type="number" inputmode="numeric" value="${c.currency?.pp ?? 0}" />
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Trackers</h2>

        <div class="grid">
          <div class="field">
            <label for="trk_label">New tracker label</label>
            <input id="trk_label" type="text" placeholder="e.g., Spell Slots (Lvl 1)" />
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
              ? `<p class="hint">No trackers yet. Add counters for spell slots, ki, rages, etc.</p>`
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

    // Name
    const nameEl = root.querySelector("#char_name");
    nameEl.addEventListener("input", () => {
      applyUpdate((next) => {
        next.meta.name = nameEl.value;
      });
    });

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

    // Abilities
    root.querySelectorAll("input[data-ab]").forEach((el) => {
      el.addEventListener("input", () => {
        const key = el.getAttribute("data-ab");
        const v = clampInt(el.value);
        if (v === null) return;
        applyUpdate((next) => {
          next.abilities[key] = v;
        });
      });
    });

    // Currency
    const curMap = [
      ["#cur_cp", "cp"],
      ["#cur_sp", "sp"],
      ["#cur_gp", "gp"],
      ["#cur_pp", "pp"]
    ];

    curMap.forEach(([sel, key]) => {
      const el = root.querySelector(sel);
      el.addEventListener("input", () => {
        const v = clampInt(el.value, 0);
        if (v === null) return;
        applyUpdate((next) => {
          next.currency[key] = v;
        });
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