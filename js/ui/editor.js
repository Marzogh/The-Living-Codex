

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

function normaliseTrackers(c) {
  if (!c.trackers) c.trackers = [];
  if (!Array.isArray(c.trackers)) c.trackers = [];
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

  // Normalise fields + ensure min level
  c.core.classes = c.core.classes
    .filter(x => x && (x.id ?? "").toString().trim())
    .map(x => ({
      id: (x.id ?? "").toString().trim(),
      level: clampInt(x.level ?? 1, 1) ?? 1,
      isPrimary: Boolean(x.isPrimary)
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
    normaliseClasses(c);

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

      <section class="card">
        <h2>Classes &amp; Levels</h2>

        <table class="table">
          <thead>
            <tr>
              <th>Class</th>
              <th style="width: 110px;">Level</th>
              <th style="width: 90px;">Primary</th>
              <th style="width: 110px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${c.core.classes.length === 0
              ? `<tr><td colspan="4" class="hint">No classes set yet.</td></tr>`
              : c.core.classes.map((cl, idx) => `
                <tr data-class-row="1" data-class-idx="${idx}">
                  <td title="${escapeHtml(cl.id)}">${escapeHtml(prettyId(cl.id))}</td>
                  <td>
                    <input type="number" min="1" inputmode="numeric"
                      data-class-level="1" data-class-idx="${idx}"
                      value="${cl.level ?? 1}" />
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