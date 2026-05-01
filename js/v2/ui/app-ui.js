function esc(v) {
  return (v ?? "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function asInt(v, fallback = 0) {
  const n = Number.parseInt((v ?? "").toString(), 10);
  return Number.isFinite(n) ? n : fallback;
}

function splitCsvList(v) {
  return (v || "")
    .toString()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function joinCsvList(v) {
  return Array.isArray(v) ? v.join(", ") : "";
}

function uniqueById(list = []) {
  const out = [];
  const seen = new Set();
  for (const item of list) {
    const id = (item?.id || "").toString();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(item);
  }
  return out;
}

function normId(v) {
  return (v || "").toString().trim().toLowerCase();
}

function optionList(items, selected, placeholder) {
  const list = uniqueById(items);
  const selectedId = (selected || "").toString().trim();
  const selectedNorm = normId(selectedId);
  const hasSelected = selectedNorm && list.some((x) => normId(x.id) === selectedNorm);

  const options = [`<option value="">${esc(placeholder)}</option>`];
  if (selectedId && !hasSelected) options.push(`<option value="${esc(selectedId)}" selected>${esc(selectedId)} (custom)</option>`);

  for (const item of list) {
    const sel = normId(item.id) === selectedNorm ? "selected" : "";
    options.push(`<option value="${esc(item.id)}" ${sel}>${esc(item.name || item.id)}</option>`);
  }

  return options.join("");
}

function renderClassRows(character, catalog) {
  const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  if (!classes.length) return `<tr><td colspan="4" class="hint">No classes yet.</td></tr>`;
  return classes
    .map(
      (c, i) => `<tr data-class-row="${i}">
  <td><select data-class-id="${i}">${optionList(catalog?.classes || [], c.id || "", "Select class")}</select></td>
  <td><input type="number" min="1" max="20" data-class-level="${i}" value="${esc(c.level ?? 1)}" /></td>
  <td><input data-class-subclass="${i}" value="${esc(c.subclassId || "")}" placeholder="subclass id" /></td>
  <td><button type="button" data-class-del="${i}">Delete</button></td>
</tr>`
    )
    .join("");
}

function renderInventoryRows(character) {
  const rows = Array.isArray(character?.inventory) ? character.inventory : [];
  if (!rows.length) return `<tr><td colspan="4" class="hint">No inventory rows.</td></tr>`;
  return rows
    .map(
      (r, i) => `<tr data-inv-row="${i}">
  <td><input data-inv-name="${i}" value="${esc(r.name || "")}" /></td>
  <td><input type="number" min="0" data-inv-qty="${i}" value="${esc(r.qty ?? 1)}" /></td>
  <td><input data-inv-notes="${i}" value="${esc(r.notes || "")}" /></td>
  <td><button type="button" data-inv-del="${i}">Delete</button></td>
</tr>`
    )
    .join("");
}

function renderSpellRows(character) {
  const rows = Array.isArray(character?.spells_known) ? character.spells_known : [];
  if (!rows.length) return `<tr><td colspan="5" class="hint">No known spells.</td></tr>`;
  const preparedIds = new Set((character?.spells_prepared || []).map((s) => s?.id).filter(Boolean));
  return rows
    .map(
      (s, i) => `<tr data-spell-row="${i}">
  <td><input data-spell-name="${i}" value="${esc(s.name || "")}" /></td>
  <td><input type="number" min="0" max="9" data-spell-level="${i}" value="${esc(s.level ?? 0)}" /></td>
  <td><input data-spell-school="${i}" value="${esc(s.school || "")}" /></td>
  <td><input type="checkbox" data-spell-prep="${i}" ${preparedIds.has(s.id) ? "checked" : ""} /></td>
  <td><button type="button" data-spell-del="${i}">Delete</button></td>
</tr>`
    )
    .join("");
}

function classIdsForSpellFilter(character) {
  const out = [];
  const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  for (const row of rows) {
    const id = normId(row?.id);
    if (id) out.push(id);
  }
  return Array.from(new Set(out));
}

function renderRuleSpellResults(catalog, character, query = "", level = "", showAll = false) {
  const spells = Array.isArray(catalog?.spells) ? catalog.spells : [];
  const q = normId(query);
  const classIds = classIdsForSpellFilter(character);

  let list = spells.filter((s) => {
    const name = normId(s?.name);
    if (q && !name.includes(q)) return false;
    if (level !== "" && Number(s?.level) !== asInt(level, 0)) return false;
    if (!showAll && classIds.length) {
      const recClasses = Array.isArray(s?.classes) ? s.classes.map((x) => normId(x)) : [];
      if (!recClasses.some((cid) => classIds.includes(cid))) return false;
    }
    return true;
  });

  list = list
    .sort((a, b) => (Number(a?.level) || 0) - (Number(b?.level) || 0) || (a?.name || "").localeCompare(b?.name || ""))
    .slice(0, 40);

  if (!list.length) return `<p class="hint">No matching rules spells.</p>`;

  return `<div class="table-wrap"><table class="table">
    <thead><tr><th>Name</th><th>Level</th><th>School</th><th>Classes</th><th></th></tr></thead>
    <tbody>
      ${list
        .map(
          (s) => `<tr data-rule-spell-id="${esc(s?.id || "")}">
            <td>${esc(s?.name || "")}</td>
            <td>${esc(s?.level ?? 0)}</td>
            <td>${esc(s?.school || "")}</td>
            <td class="hint">${esc(Array.isArray(s?.classes) ? s.classes.join(", ") : "")}</td>
            <td><button type="button" data-add-rule-spell="${esc(s?.id || "")}">Add</button></td>
          </tr>`
        )
        .join("")}
    </tbody>
  </table></div>`;
}

function renderLogRows(character) {
  const rows = Array.isArray(character?.log) ? character.log : [];
  if (!rows.length) return `<tr><td colspan="4" class="hint">No log entries.</td></tr>`;
  return rows
    .map(
      (e, i) => `<tr data-log-row="${i}">
  <td><input data-log-utc="${i}" value="${esc(e.utc || "")}" /></td>
  <td><input data-log-tag="${i}" value="${esc(e.tag || "")}" /></td>
  <td><input data-log-message="${i}" value="${esc(e.message || "")}" /></td>
  <td><button type="button" data-log-del="${i}">Delete</button></td>
</tr>`
    )
    .join("");
}

function renderTrackerRows(character) {
  const rows = Array.isArray(character?.trackers) ? character.trackers : [];
  if (!rows.length) return `<tr><td colspan="7" class="hint">No trackers yet.</td></tr>`;
  const resetOptions = ["none", "short_rest", "long_rest", "daily", "manual"];
  const typeOptions = ["counter", "toggle", "text"];
  return rows
    .map(
      (t, i) => `<tr data-tracker-row="${i}">
  <td><input data-tracker-label="${i}" value="${esc(t.label || "")}" placeholder="Ki, Rage, Inspiration" /></td>
  <td><select data-tracker-type="${i}">
    ${!typeOptions.includes((t.type || "counter").toString()) ? `<option value="${esc(t.type || "counter")}" selected>${esc(t.type || "counter")} (custom)</option>` : ""}
    ${typeOptions
      .map((opt) => `<option value="${opt}" ${(t.type || "counter") === opt ? "selected" : ""}>${opt}</option>`)
      .join("")}
  </select></td>
  <td><select data-tracker-reset="${i}">${resetOptions
    .map((opt) => `<option value="${opt}" ${(t.reset || "none") === opt ? "selected" : ""}>${opt}</option>`)
    .join("")}</select></td>
  <td><input type="number" min="0" data-tracker-max="${i}" value="${esc(t.max ?? 0)}" /></td>
  <td><input type="number" min="0" data-tracker-current="${i}" value="${esc(t.current ?? 0)}" /></td>
  <td><button type="button" data-tracker-rest="${i}">Reset</button></td>
  <td><button type="button" data-tracker-del="${i}">Delete</button></td>
</tr>`
    )
    .join("");
}

function spellSlotRow(character, level) {
  const row = character?.spell_slots?.levels?.[String(level)] || { max: 0, used: 0 };
  return `<tr data-slot-row="${level}">
  <td>${level}</td>
  <td><input type="number" min="0" data-slot-max="${level}" value="${esc(row.max ?? 0)}" /></td>
  <td><input type="number" min="0" data-slot-used="${level}" value="${esc(row.used ?? 0)}" /></td>
</tr>`;
}

function renderReport(report) {
  if (!report) return `<div class="hint">No import report yet.</div>`;
  const blocked = Array.isArray(report.blocked) ? report.blocked : [];
  const warnings = Array.isArray(report.warnings) ? report.warnings : [];
  const fixesApplied = Array.isArray(report.fixes_applied) ? report.fixes_applied : [];
  const fixesAvailable = Array.isArray(report.fixes_available) ? report.fixes_available : [];

  const top = [...blocked, ...warnings, ...fixesApplied, ...fixesAvailable].slice(0, 10);
  const rows = top.length
    ? `<ul class="report-list">${top
        .map(
          (row) => `<li>
            <span class="report-code">${esc(row.code || "note")}</span>
            <span class="report-msg">${esc(row.message || "")}</span>
            ${row.path ? `<code class="report-path">${esc(row.path)}</code>` : ""}
          </li>`
        )
        .join("")}</ul>`
    : `<div class="hint">No detailed report rows.</div>`;

  return `<div class="report-grid">
  <div><strong>ok:</strong> ${esc(report.ok)}</div>
  <div><strong>errors:</strong> ${esc(report.errors?.length || 0)}</div>
  <div><strong>warnings:</strong> ${esc(report.warnings?.length || 0)}</div>
  <div><strong>fixes:</strong> ${esc(report.fixes_applied?.length || 0)}</div>
  <div><strong>guided:</strong> ${esc(report.fixes_available?.length || 0)}</div>
  <div><strong>blocked:</strong> ${esc(report.blocked?.length || 0)}</div>
</div>
<details class="report-details" open>
  <summary>Import diagnostics (top 10)</summary>
  ${rows}
</details>`;
}

export function mountV2UI({ root, getState, actions }) {
  if (!root) throw new Error("mountV2UI requires root");

  const draft = {
    name: "New Character",
    rulesetId: "dnd5e_2014",
    classId: "",
    speciesId: "",
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10
  };
  let showCreateWhenLoaded = false;

  function render() {
    const state = getState();
    const c = state.character;
    const catalog = actions.getCatalog();
    const runtime = actions.getRuntimeStatus ? actions.getRuntimeStatus() : { message: "", at: "", tone: "info" };
    const tone = (runtime.tone || "info").toString();

    root.innerHTML = `
      <header class="v2-topbar">
        <h1>The Living Codex v2 (WIP)</h1>
        <div class="v2-actions">
          <button type="button" class="btn-primary" id="v2Import">Import ZIP</button>
          <button type="button" id="v2Export" ${c ? "" : "disabled"}>Export ZIP</button>
          <button type="button" id="v2ExportPdf" ${c ? "" : "disabled"}>Export PDF</button>
          <button type="button" class="btn-primary" id="v2Save" ${c ? "" : "disabled"}>Save</button>
          <button type="button" id="v2Undo" ${actions.canUndo() ? "" : "disabled"}>Undo</button>
          <button type="button" id="v2Redo" ${actions.canRedo() ? "" : "disabled"}>Redo</button>
        </div>
      </header>

      <section class="card">
        <h2>Create Character</h2>
        <div class="card-body ${c && !showCreateWhenLoaded ? "" : "grid"}">
          ${
            c && !showCreateWhenLoaded
              ? `<button type="button" class="btn-primary" id="v2OpenCreate">Create/Replace Character</button>`
              : `
          <label>Name<input id="newName" value="${esc(draft.name)}" /></label>
          <label>Ruleset
            <select id="newRuleset">
              <option value="dnd5e_2014" ${draft.rulesetId === "dnd5e_2014" ? "selected" : ""}>D&D 5e (2014)</option>
              <option value="dnd5e_2024" ${draft.rulesetId === "dnd5e_2024" ? "selected" : ""}>D&D 5e (2024)</option>
            </select>
          </label>
          <label>Class
            <select id="newClass">${optionList(catalog?.classes || [], draft.classId, "Optional class")}</select>
          </label>
          <label>Species
            <select id="newSpecies">${optionList(catalog?.species || [], draft.speciesId, "Optional species")}</select>
          </label>
          <label>STR<input type="number" id="newStr" min="1" max="30" value="${esc(draft.str)}" /></label>
          <label>DEX<input type="number" id="newDex" min="1" max="30" value="${esc(draft.dex)}" /></label>
          <label>CON<input type="number" id="newCon" min="1" max="30" value="${esc(draft.con)}" /></label>
          <label>INT<input type="number" id="newInt" min="1" max="30" value="${esc(draft.int)}" /></label>
          <label>WIS<input type="number" id="newWis" min="1" max="30" value="${esc(draft.wis)}" /></label>
          <label>CHA<input type="number" id="newCha" min="1" max="30" value="${esc(draft.cha)}" /></label>
          <div class="form-actions">
            <label>&nbsp;</label>
            ${c ? `<div class="inline-note warn">This will replace the currently loaded character in the editor.</div>` : ""}
            <button type="button" class="btn-primary" id="v2Create">Create Character</button>
            ${c ? `<button type="button" id="v2CancelCreate">Cancel</button>` : ""}
          </div>
          `
          }
        </div>
      </section>

      <section class="v2-status card">
        <h2>Status</h2>
        <div class="card-body">
          ${runtime.message ? `<div class="status-banner ${esc(`tone-${tone}`)}"><strong>${esc(tone.toUpperCase())}:</strong> ${esc(runtime.message)}</div>` : ""}
          <div><strong>Ready:</strong> ${esc(state.app.ready)}</div>
          <div><strong>Dirty:</strong> ${esc(state.app.dirty)}</div>
          <div><strong>Active ID:</strong> ${esc(state.app.activeCharacterId || "(none)")}</div>
          <div><strong>Last Saved:</strong> ${esc(state.app.lastSavedUtc || "(none)")}</div>
          <div><strong>Last Action:</strong> ${esc(runtime.message || "(none)")}</div>
          <div><strong>Action Time:</strong> ${esc(runtime.at || "(none)")}</div>
          ${catalog?.error ? `<div class="error"><strong>Rules Data:</strong> ${esc(catalog.error)}</div>` : ""}
          ${state.app.lastError ? `<div class="error"><strong>Error:</strong> ${esc(state.app.lastError)}</div>` : ""}
        </div>
      </section>

      ${!c ? `<section class="card"><h2>Character</h2><div class="card-body"><p>No active character. Use the create form or import ZIP.</p></div></section>` : `
      <section class="card">
        <h2>Character Core</h2>
        <div class="card-body grid">
          <label>Name<input id="charName" value="${esc(c.meta?.name || "")}" placeholder="Character name" /></label>
          <label>Ruleset<input id="charRuleset" value="${esc(c.meta?.ruleset_id || "")}" placeholder="dnd5e_2014" /></label>
          <label>Species
            <select id="charSpecies">${optionList(catalog?.species || [], c.core?.speciesId || "", "Select species")}</select>
          </label>
        </div>
      </section>

      <section class="card">
        <h2>Identity</h2>
        <div class="card-body grid">
          <label>Player Name<input id="idPlayer" value="${esc(c.identity?.player_name || "")}" /></label>
          <label>Campaign<input id="idCampaign" value="${esc(c.identity?.campaign || "")}" /></label>
          <label>Background<input id="idBackground" value="${esc(c.identity?.background || "")}" /></label>
          <label>Alignment<input id="idAlignment" value="${esc(c.identity?.alignment || "")}" /></label>
          <label>Ancestry<input id="idAncestry" value="${esc(c.identity?.ancestry || "")}" /></label>
        </div>
      </section>

      <section class="card">
        <h2>Proficiencies & Defenses</h2>
        <div class="card-body grid">
          <label>Saving Throws (csv)<input id="profSaves" value="${esc(joinCsvList(c.proficiencies?.saves || c.proficiencies?.saving_throws || []))}" /></label>
          <label>Skills (csv)<input id="profSkills" value="${esc(joinCsvList(c.proficiencies?.skills || []))}" /></label>
          <label>Expertise Skills (csv)<input id="expSkills" value="${esc(joinCsvList(c.expertise?.skills || []))}" /></label>
          <label>Tools (csv)<input id="profTools" value="${esc(joinCsvList(c.proficiencies?.tools || []))}" /></label>
          <label>Languages (csv)<input id="profLangs" value="${esc(joinCsvList(c.proficiencies?.languages || []))}" /></label>
          <label>Armor (csv)<input id="profArmor" value="${esc(joinCsvList(c.proficiencies?.armor || c.proficiencies?.armour || []))}" /></label>
          <label>Weapons (csv)<input id="profWeapons" value="${esc(joinCsvList(c.proficiencies?.weapons || []))}" /></label>
          <label>Immunities (csv)<input id="defImm" value="${esc(joinCsvList(c.defenses?.immunities || []))}" /></label>
          <label>Resistances (csv)<input id="defRes" value="${esc(joinCsvList(c.defenses?.resistances || []))}" /></label>
          <label>Vulnerabilities (csv)<input id="defVuln" value="${esc(joinCsvList(c.defenses?.vulnerabilities || []))}" /></label>
        </div>
      </section>

      <section class="card">
        <h2>Classes</h2>
        <div class="card-body">
          <button type="button" class="btn-primary" id="classAdd">Add class</button>
          <div class="table-wrap"><table class="table"><thead><tr><th>Class</th><th>Level</th><th>Subclass</th><th></th></tr></thead><tbody>${renderClassRows(c, catalog)}</tbody></table></div>
        </div>
      </section>

      <section class="card">
        <h2>Abilities & Combat</h2>
        <div class="card-body grid">
          ${["str", "dex", "con", "int", "wis", "cha"].map((k) => `<label>${k.toUpperCase()}<input type="number" min="1" max="30" data-abil="${k}" value="${esc(c.abilities?.[k] ?? 10)}" /></label>`).join("")}
          <label>AC<input type="number" min="0" id="combatAc" value="${esc(c.combat?.ac ?? 10)}" /></label>
          <label>Initiative<input type="number" id="combatInit" value="${esc(c.combat?.initiative_bonus ?? 0)}" /></label>
          <label>HP Max<input type="number" min="0" id="hpMax" value="${esc(c.combat?.hp?.max ?? 1)}" /></label>
          <label>HP Current<input type="number" min="0" id="hpCurrent" value="${esc(c.combat?.hp?.current ?? 1)}" /></label>
          <label>Temp HP<input type="number" min="0" id="hpTemp" value="${esc(c.combat?.hp?.temp ?? 0)}" /></label>
        </div>
      </section>

      <section class="card">
        <h2>Inventory</h2>
        <div class="card-body">
          <button type="button" class="btn-primary" id="invAdd">Add item</button>
          <div class="table-wrap"><table class="table"><thead><tr><th>Name</th><th>Qty</th><th>Notes</th><th></th></tr></thead><tbody>${renderInventoryRows(c)}</tbody></table></div>
        </div>
      </section>

      <section class="card">
        <h2>Spells</h2>
        <div class="card-body">
          <button type="button" class="btn-primary" id="spellAdd">Add spell</button>
          <div class="card" style="margin:8px 0;">
            <div class="card-body grid">
              <label>Find Rules Spell<input id="spellRuleQuery" placeholder="Search spells..." /></label>
              <label>Level
                <select id="spellRuleLevel">
                  <option value="">Any level</option>
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
              </label>
              <label>Scope
                <select id="spellRuleScope">
                  <option value="class">Current class only</option>
                  <option value="all">All spells</option>
                </select>
              </label>
            </div>
            <div class="card-body" id="spellRuleResults">${renderRuleSpellResults(catalog, c, "", "", false)}</div>
          </div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Name</th><th>Level</th><th>School</th><th>Prepared</th><th></th></tr></thead><tbody>${renderSpellRows(c)}</tbody></table></div>
        </div>
      </section>

      <section class="card">
        <h2>Spell Slots</h2>
        <div class="card-body">
          <div class="grid">
            <label>Auto-calc
              <select id="slotsAuto">
                <option value="true" ${c.spell_slots?.auto ? "selected" : ""}>Enabled</option>
                <option value="false" ${!c.spell_slots?.auto ? "selected" : ""}>Manual</option>
              </select>
            </label>
            <label>Pact Max<input type="number" min="0" id="slotsPactMax" value="${esc(c.spell_slots?.pact?.max ?? 0)}" /></label>
            <label>Pact Used<input type="number" min="0" id="slotsPactUsed" value="${esc(c.spell_slots?.pact?.used ?? 0)}" /></label>
            <label>Pact Level<input type="number" min="1" max="9" id="slotsPactLevel" value="${esc(c.spell_slots?.pact?.level ?? 1)}" /></label>
            <div class="form-actions"><button type="button" id="slotsResetUsed">Reset used slots</button></div>
          </div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Slot</th><th>Max</th><th>Used</th></tr></thead><tbody>${[1,2,3,4,5,6,7,8,9].map((n) => spellSlotRow(c, n)).join("")}</tbody></table></div>
        </div>
      </section>

      <section class="card">
        <h2>Trackers</h2>
        <div class="card-body">
          <button type="button" class="btn-primary" id="trackerAdd">Add tracker</button>
          <div class="table-wrap"><table class="table"><thead><tr><th>Label</th><th>Type</th><th>Reset</th><th>Max</th><th>Current</th><th></th><th></th></tr></thead><tbody>${renderTrackerRows(c)}</tbody></table></div>
        </div>
      </section>

      <section class="card">
        <h2>Log</h2>
        <div class="card-body">
          <button type="button" class="btn-primary" id="logAdd">Add log entry</button>
          <div class="table-wrap"><table class="table"><thead><tr><th>UTC</th><th>Tag</th><th>Message</th><th></th></tr></thead><tbody>${renderLogRows(c)}</tbody></table></div>
        </div>
      </section>`}

      <section class="card">
        <h2>Import Report</h2>
        <div class="card-body">${renderReport(state.importReport)}</div>
      </section>
    `;

    bindGlobalActions();
    bindCreateActions();
    if (c) bindCharacterActions(catalog);
  }

  function bindGlobalActions() {
    root.querySelector("#v2Import")?.addEventListener("click", actions.importZip);
    root.querySelector("#v2Export")?.addEventListener("click", actions.exportZip);
    root.querySelector("#v2ExportPdf")?.addEventListener("click", actions.exportPdf);
    root.querySelector("#v2Save")?.addEventListener("click", actions.saveNow);
    root.querySelector("#v2Undo")?.addEventListener("click", actions.undo);
    root.querySelector("#v2Redo")?.addEventListener("click", actions.redo);
  }

  function bindCreateActions() {
    root.querySelector("#v2OpenCreate")?.addEventListener("click", async () => {
      const current = getState();
      const activeRuleset = current?.character?.meta?.ruleset_id || "";
      if (activeRuleset) draft.rulesetId = activeRuleset;
      // Ensure dropdown data is loaded before revealing the form.
      await actions.ensureCatalog(draft.rulesetId);
      showCreateWhenLoaded = true;
      render();
    });
    root.querySelector("#v2CancelCreate")?.addEventListener("click", () => {
      showCreateWhenLoaded = false;
      render();
    });

    root.querySelector("#newName")?.addEventListener("input", (e) => {
      draft.name = e.target.value;
    });
    root.querySelector("#newRuleset")?.addEventListener("change", async (e) => {
      draft.rulesetId = e.target.value;
      draft.classId = "";
      draft.speciesId = "";
      await actions.ensureCatalog(draft.rulesetId);
      render();
    });
    root.querySelector("#newClass")?.addEventListener("change", (e) => {
      draft.classId = e.target.value;
    });
    root.querySelector("#newSpecies")?.addEventListener("change", (e) => {
      draft.speciesId = e.target.value;
    });
    root.querySelector("#newStr")?.addEventListener("input", (e) => {
      draft.str = asInt(e.target.value, 10);
    });
    root.querySelector("#newDex")?.addEventListener("input", (e) => {
      draft.dex = asInt(e.target.value, 10);
    });
    root.querySelector("#newCon")?.addEventListener("input", (e) => {
      draft.con = asInt(e.target.value, 10);
    });
    root.querySelector("#newInt")?.addEventListener("input", (e) => {
      draft.int = asInt(e.target.value, 10);
    });
    root.querySelector("#newWis")?.addEventListener("input", (e) => {
      draft.wis = asInt(e.target.value, 10);
    });
    root.querySelector("#newCha")?.addEventListener("input", (e) => {
      draft.cha = asInt(e.target.value, 10);
    });
    root.querySelector("#v2Create")?.addEventListener("click", () => {
      showCreateWhenLoaded = false;
      actions.newCharacter({ ...draft });
    });
  }

  function bindCharacterActions(catalog) {
    root.querySelector("#idPlayer")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.identity = c.identity || {};
        c.identity.player_name = e.target.value;
      });
    });
    root.querySelector("#idCampaign")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.identity = c.identity || {};
        c.identity.campaign = e.target.value;
      });
    });
    root.querySelector("#idBackground")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.identity = c.identity || {};
        c.identity.background = e.target.value;
      });
    });
    root.querySelector("#idAlignment")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.identity = c.identity || {};
        c.identity.alignment = e.target.value;
      });
    });
    root.querySelector("#idAncestry")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.identity = c.identity || {};
        c.identity.ancestry = e.target.value;
      });
    });

    root.querySelector("#profSaves")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.proficiencies = c.proficiencies || {};
        c.proficiencies.saves = splitCsvList(e.target.value).map((s) => s.toLowerCase());
      });
    });
    root.querySelector("#profSkills")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.proficiencies = c.proficiencies || {};
        c.proficiencies.skills = splitCsvList(e.target.value).map((s) => s.toLowerCase());
      });
    });
    root.querySelector("#expSkills")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.expertise = c.expertise || {};
        c.expertise.skills = splitCsvList(e.target.value).map((s) => s.toLowerCase());
      });
    });
    root.querySelector("#profTools")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.proficiencies = c.proficiencies || {};
        c.proficiencies.tools = splitCsvList(e.target.value);
      });
    });
    root.querySelector("#profLangs")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.proficiencies = c.proficiencies || {};
        c.proficiencies.languages = splitCsvList(e.target.value);
      });
    });
    root.querySelector("#profArmor")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.proficiencies = c.proficiencies || {};
        c.proficiencies.armor = splitCsvList(e.target.value);
      });
    });
    root.querySelector("#profWeapons")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.proficiencies = c.proficiencies || {};
        c.proficiencies.weapons = splitCsvList(e.target.value);
      });
    });
    root.querySelector("#defImm")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.defenses = c.defenses || {};
        c.defenses.immunities = splitCsvList(e.target.value);
      });
    });
    root.querySelector("#defRes")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.defenses = c.defenses || {};
        c.defenses.resistances = splitCsvList(e.target.value);
      });
    });
    root.querySelector("#defVuln")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.defenses = c.defenses || {};
        c.defenses.vulnerabilities = splitCsvList(e.target.value);
      });
    });

    root.querySelector("#charName")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.meta.name = e.target.value;
      });
    });

    root.querySelector("#charRuleset")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.meta.ruleset_id = e.target.value;
        c.core.rulesetId = e.target.value;
      });
    });

    root.querySelector("#charSpecies")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.core.speciesId = e.target.value;
      });
    });

    root.querySelectorAll("[data-abil]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const key = e.target.getAttribute("data-abil");
        actions.updateCharacter((c) => {
          c.abilities[key] = asInt(e.target.value, 10);
        });
      });
    });

    root.querySelector("#combatAc")?.addEventListener("input", (e) => {
      actions.updateCharacter((c) => (c.combat.ac = Math.max(0, asInt(e.target.value, 10))));
    });
    root.querySelector("#combatInit")?.addEventListener("input", (e) => {
      actions.updateCharacter((c) => (c.combat.initiative_bonus = asInt(e.target.value, 0)));
    });
    root.querySelector("#hpMax")?.addEventListener("input", (e) => {
      actions.updateCharacter((c) => {
        c.combat.hp.max = Math.max(0, asInt(e.target.value, 1));
        if (c.combat.hp.current > c.combat.hp.max) c.combat.hp.current = c.combat.hp.max;
      });
    });
    root.querySelector("#hpCurrent")?.addEventListener("input", (e) => {
      actions.updateCharacter((c) => {
        c.combat.hp.current = Math.max(0, asInt(e.target.value, 1));
      });
    });
    root.querySelector("#hpTemp")?.addEventListener("input", (e) => {
      actions.updateCharacter((c) => {
        c.combat.hp.temp = Math.max(0, asInt(e.target.value, 0));
      });
    });

    root.querySelector("#classAdd")?.addEventListener("click", () => {
      const first = catalog?.classes?.[0]?.id || "";
      actions.updateCharacter((c) => {
        c.core.classes.push({ id: first, level: 1, isPrimary: c.core.classes.length === 0, subclassId: "" });
      });
    });
    root.querySelectorAll("[data-class-id]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-class-id"), -1);
        actions.updateCharacter((c) => {
          if (!c.core.classes[idx]) return;
          c.core.classes[idx].id = e.target.value.trim().toLowerCase();
        });
      });
    });
    root.querySelectorAll("[data-class-level]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const idx = asInt(e.target.getAttribute("data-class-level"), -1);
        actions.updateCharacter((c) => {
          if (!c.core.classes[idx]) return;
          c.core.classes[idx].level = Math.max(1, Math.min(20, asInt(e.target.value, 1)));
        });
      });
    });
    root.querySelectorAll("[data-class-subclass]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const idx = asInt(e.target.getAttribute("data-class-subclass"), -1);
        actions.updateCharacter((c) => {
          if (!c.core.classes[idx]) return;
          c.core.classes[idx].subclassId = e.target.value.trim().toLowerCase();
        });
      });
    });
    root.querySelectorAll("[data-class-del]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const idx = asInt(e.target.getAttribute("data-class-del"), -1);
        actions.updateCharacter((c) => {
          c.core.classes.splice(idx, 1);
        });
      });
    });

    root.querySelector("#invAdd")?.addEventListener("click", () => {
      actions.updateCharacter((c) => {
        c.inventory.push({ id: crypto.randomUUID(), name: "", qty: 1, notes: "" });
      });
    });
    root.querySelectorAll("[data-inv-name]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-inv-name"), -1);
        actions.updateCharacter((c) => {
          if (!c.inventory[idx]) return;
          c.inventory[idx].name = e.target.value;
        });
      });
    });
    root.querySelectorAll("[data-inv-qty]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const idx = asInt(e.target.getAttribute("data-inv-qty"), -1);
        actions.updateCharacter((c) => {
          if (!c.inventory[idx]) return;
          c.inventory[idx].qty = Math.max(0, asInt(e.target.value, 1));
        });
      });
    });
    root.querySelectorAll("[data-inv-notes]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-inv-notes"), -1);
        actions.updateCharacter((c) => {
          if (!c.inventory[idx]) return;
          c.inventory[idx].notes = e.target.value;
        });
      });
    });
    root.querySelectorAll("[data-inv-del]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const idx = asInt(e.target.getAttribute("data-inv-del"), -1);
        actions.updateCharacter((c) => c.inventory.splice(idx, 1));
      });
    });

    root.querySelector("#spellAdd")?.addEventListener("click", () => {
      actions.updateCharacter((c) => {
        c.spells_known.push({
          id: crypto.randomUUID(),
          name: "",
          level: 0,
          school: "",
          notes: ""
        });
      });
    });
    root.querySelectorAll("[data-spell-name]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-spell-name"), -1);
        actions.updateCharacter((c) => {
          if (!c.spells_known[idx]) return;
          c.spells_known[idx].name = e.target.value;
        });
      });
    });
    root.querySelectorAll("[data-spell-level]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const idx = asInt(e.target.getAttribute("data-spell-level"), -1);
        actions.updateCharacter((c) => {
          if (!c.spells_known[idx]) return;
          c.spells_known[idx].level = Math.max(0, Math.min(9, asInt(e.target.value, 0)));
        });
      });
    });
    root.querySelectorAll("[data-spell-school]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-spell-school"), -1);
        actions.updateCharacter((c) => {
          if (!c.spells_known[idx]) return;
          c.spells_known[idx].school = e.target.value;
        });
      });
    });
    root.querySelectorAll("[data-spell-prep]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-spell-prep"), -1);
        actions.updateCharacter((c) => {
          const row = c.spells_known[idx];
          if (!row) return;
          const exists = c.spells_prepared.find((x) => x.id === row.id);
          if (e.target.checked) {
            if (!exists) c.spells_prepared.push(structuredClone(row));
          } else {
            c.spells_prepared = c.spells_prepared.filter((x) => x.id !== row.id);
          }
        });
      });
    });
    root.querySelectorAll("[data-spell-del]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const idx = asInt(e.target.getAttribute("data-spell-del"), -1);
        actions.updateCharacter((c) => {
          const row = c.spells_known[idx];
          c.spells_known.splice(idx, 1);
          if (row?.id) c.spells_prepared = c.spells_prepared.filter((x) => x.id !== row.id);
        });
      });
    });

    const spellQuery = root.querySelector("#spellRuleQuery");
    const spellLevel = root.querySelector("#spellRuleLevel");
    const spellScope = root.querySelector("#spellRuleScope");
    const spellResults = root.querySelector("#spellRuleResults");
    const refreshSpellResults = () => {
      if (!spellResults) return;
      const q = spellQuery?.value || "";
      const lvl = spellLevel?.value || "";
      const scope = spellScope?.value || "class";
      spellResults.innerHTML = renderRuleSpellResults(catalog, getState().character, q, lvl, scope === "all");
      spellResults.querySelectorAll("[data-add-rule-spell]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-add-rule-spell");
          const rec = (catalog?.spells || []).find((x) => (x?.id || "") === id);
          if (!rec) return;
          actions.updateCharacter((c) => {
            c.spells_known = Array.isArray(c.spells_known) ? c.spells_known : [];
            const exists = c.spells_known.some((s) => (s?.spell_id || s?.id) === rec.id);
            if (exists) return;
            c.spells_known.push({
              id: crypto.randomUUID(),
              spell_id: rec.id,
              name: rec.name || "",
              level: asInt(rec.level, 0),
              school: rec.school || "",
              source: rec.source || "",
              ritual: Boolean(rec.ritual),
              concentration: Boolean(rec.concentration),
              notes: ""
            });
          });
        });
      });
    };
    spellQuery?.addEventListener("input", refreshSpellResults);
    spellLevel?.addEventListener("change", refreshSpellResults);
    spellScope?.addEventListener("change", refreshSpellResults);
    refreshSpellResults();

    root.querySelector("#slotsAuto")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.spell_slots = c.spell_slots || { auto: true, pact: { max: 0, used: 0, level: 1 }, levels: {} };
        c.spell_slots.auto = e.target.value === "true";
      });
    });
    root.querySelector("#slotsPactMax")?.addEventListener("input", (e) => {
      actions.updateCharacter((c) => {
        c.spell_slots = c.spell_slots || { auto: true, pact: { max: 0, used: 0, level: 1 }, levels: {} };
        c.spell_slots.pact = c.spell_slots.pact || { max: 0, used: 0, level: 1 };
        c.spell_slots.pact.max = Math.max(0, asInt(e.target.value, 0));
        if (c.spell_slots.pact.used > c.spell_slots.pact.max) c.spell_slots.pact.used = c.spell_slots.pact.max;
      });
    });
    root.querySelector("#slotsPactUsed")?.addEventListener("input", (e) => {
      actions.updateCharacter((c) => {
        c.spell_slots = c.spell_slots || { auto: true, pact: { max: 0, used: 0, level: 1 }, levels: {} };
        c.spell_slots.pact = c.spell_slots.pact || { max: 0, used: 0, level: 1 };
        c.spell_slots.pact.used = Math.max(0, asInt(e.target.value, 0));
        if (c.spell_slots.pact.used > c.spell_slots.pact.max) c.spell_slots.pact.used = c.spell_slots.pact.max;
      });
    });
    root.querySelector("#slotsPactLevel")?.addEventListener("input", (e) => {
      actions.updateCharacter((c) => {
        c.spell_slots = c.spell_slots || { auto: true, pact: { max: 0, used: 0, level: 1 }, levels: {} };
        c.spell_slots.pact = c.spell_slots.pact || { max: 0, used: 0, level: 1 };
        c.spell_slots.pact.level = Math.max(1, Math.min(9, asInt(e.target.value, 1)));
      });
    });
    root.querySelector("#slotsResetUsed")?.addEventListener("click", () => {
      actions.updateCharacter((c) => {
        c.spell_slots = c.spell_slots || { auto: true, pact: { max: 0, used: 0, level: 1 }, levels: {} };
        c.spell_slots.pact = c.spell_slots.pact || { max: 0, used: 0, level: 1 };
        c.spell_slots.pact.used = 0;
        c.spell_slots.levels = c.spell_slots.levels || {};
        for (let i = 1; i <= 9; i++) {
          const key = String(i);
          c.spell_slots.levels[key] = c.spell_slots.levels[key] || { max: 0, used: 0 };
          c.spell_slots.levels[key].used = 0;
        }
      });
    });
    root.querySelectorAll("[data-slot-max]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const level = Math.max(1, Math.min(9, asInt(e.target.getAttribute("data-slot-max"), 1)));
        actions.updateCharacter((c) => {
          c.spell_slots = c.spell_slots || { auto: true, pact: { max: 0, used: 0, level: 1 }, levels: {} };
          c.spell_slots.levels = c.spell_slots.levels || {};
          const key = String(level);
          c.spell_slots.levels[key] = c.spell_slots.levels[key] || { max: 0, used: 0 };
          c.spell_slots.levels[key].max = Math.max(0, asInt(e.target.value, 0));
          if (c.spell_slots.levels[key].used > c.spell_slots.levels[key].max) {
            c.spell_slots.levels[key].used = c.spell_slots.levels[key].max;
          }
        });
      });
    });
    root.querySelectorAll("[data-slot-used]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const level = Math.max(1, Math.min(9, asInt(e.target.getAttribute("data-slot-used"), 1)));
        actions.updateCharacter((c) => {
          c.spell_slots = c.spell_slots || { auto: true, pact: { max: 0, used: 0, level: 1 }, levels: {} };
          c.spell_slots.levels = c.spell_slots.levels || {};
          const key = String(level);
          c.spell_slots.levels[key] = c.spell_slots.levels[key] || { max: 0, used: 0 };
          c.spell_slots.levels[key].used = Math.max(0, asInt(e.target.value, 0));
          if (c.spell_slots.levels[key].used > c.spell_slots.levels[key].max) {
            c.spell_slots.levels[key].used = c.spell_slots.levels[key].max;
          }
        });
      });
    });

    root.querySelector("#trackerAdd")?.addEventListener("click", () => {
      actions.updateCharacter((c) => {
        c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
        c.trackers.push({
          id: crypto.randomUUID(),
          label: "",
          type: "counter",
          reset: "none",
          max: 0,
          current: 0
        });
      });
    });
    root.querySelectorAll("[data-tracker-label]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-tracker-label"), -1);
        actions.updateCharacter((c) => {
          c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
          if (!c.trackers[idx]) return;
          c.trackers[idx].label = e.target.value;
        });
      });
    });
    root.querySelectorAll("[data-tracker-type]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-tracker-type"), -1);
        actions.updateCharacter((c) => {
          c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
          if (!c.trackers[idx]) return;
          c.trackers[idx].type = e.target.value.trim();
        });
      });
    });
    root.querySelectorAll("[data-tracker-reset]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-tracker-reset"), -1);
        actions.updateCharacter((c) => {
          c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
          if (!c.trackers[idx]) return;
          c.trackers[idx].reset = e.target.value.trim().toLowerCase();
        });
      });
    });
    root.querySelectorAll("[data-tracker-max]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const idx = asInt(e.target.getAttribute("data-tracker-max"), -1);
        actions.updateCharacter((c) => {
          c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
          if (!c.trackers[idx]) return;
          c.trackers[idx].max = Math.max(0, asInt(e.target.value, 0));
          if ((c.trackers[idx].current ?? 0) > c.trackers[idx].max) c.trackers[idx].current = c.trackers[idx].max;
        });
      });
    });
    root.querySelectorAll("[data-tracker-current]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const idx = asInt(e.target.getAttribute("data-tracker-current"), -1);
        actions.updateCharacter((c) => {
          c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
          if (!c.trackers[idx]) return;
          c.trackers[idx].current = Math.max(0, asInt(e.target.value, 0));
          if (c.trackers[idx].current > (c.trackers[idx].max ?? 0)) c.trackers[idx].current = c.trackers[idx].max ?? 0;
        });
      });
    });
    root.querySelectorAll("[data-tracker-rest]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const idx = asInt(e.target.getAttribute("data-tracker-rest"), -1);
        actions.updateCharacter((c) => {
          c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
          if (!c.trackers[idx]) return;
          c.trackers[idx].current = c.trackers[idx].max ?? 0;
        });
      });
    });
    root.querySelectorAll("[data-tracker-del]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const idx = asInt(e.target.getAttribute("data-tracker-del"), -1);
        actions.updateCharacter((c) => {
          c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
          if (idx < 0 || idx >= c.trackers.length) return;
          c.trackers.splice(idx, 1);
        });
      });
    });

    root.querySelector("#logAdd")?.addEventListener("click", () => {
      actions.updateCharacter((c) => {
        c.log.push({ id: crypto.randomUUID(), utc: new Date().toISOString(), tag: "", message: "" });
      });
    });
    root.querySelectorAll("[data-log-utc]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-log-utc"), -1);
        actions.updateCharacter((c) => {
          if (!c.log[idx]) return;
          c.log[idx].utc = e.target.value;
        });
      });
    });
    root.querySelectorAll("[data-log-tag]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-log-tag"), -1);
        actions.updateCharacter((c) => {
          if (!c.log[idx]) return;
          c.log[idx].tag = e.target.value;
        });
      });
    });
    root.querySelectorAll("[data-log-message]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-log-message"), -1);
        actions.updateCharacter((c) => {
          if (!c.log[idx]) return;
          c.log[idx].message = e.target.value;
        });
      });
    });
    root.querySelectorAll("[data-log-del]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const idx = asInt(e.target.getAttribute("data-log-del"), -1);
        actions.updateCharacter((c) => c.log.splice(idx, 1));
      });
    });
  }

  return { render };
}
