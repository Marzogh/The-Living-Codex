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

function norm(v) {
  return (v ?? "").toString().trim().toLowerCase();
}

function optionList(items, selected, placeholder) {
  const selectedNorm = norm(selected);
  const options = [`<option value="">${esc(placeholder)}</option>`];
  for (const item of items || []) {
    const id = (item?.id || "").toString();
    if (!id) continue;
    const sel = norm(id) === selectedNorm ? "selected" : "";
    options.push(`<option value="${esc(id)}" ${sel}>${esc(item?.name || id)}</option>`);
  }
  if (selected && !options.join("").includes(`value=\"${esc(selected)}\"`)) {
    options.push(`<option value="${esc(selected)}" selected>${esc(selected)} (custom)</option>`);
  }
  return options.join("");
}

function subclassOptions(items, classId) {
  const selectedClass = norm(classId);
  return (items || [])
    .filter((row) => norm(row?.class_id) === selectedClass)
    .map((row) => `<option value="${esc(row?.id || "")}">${esc(row?.name || row?.id || "")} (${esc(row?.source || "UNKNOWN")})</option>`)
    .join("");
}

function isTypingTarget(el) {
  if (!el) return false;
  const tag = (el.tagName || "").toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
}

function makeSpellId(spell) {
  return (spell?.id || spell?.spell_id || spell?.name || crypto.randomUUID()).toString();
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function classCasterProgression(classId, subclassId) {
  const c = norm(classId);
  if (["bard", "cleric", "druid", "sorcerer", "wizard"].includes(c)) return "full";
  if (["paladin", "ranger", "artificer"].includes(c)) return "half";
  if (c === "warlock") return "pact";
  if (c === "fighter" && norm(subclassId) === "eldritch_knight") return "third";
  if (c === "rogue" && norm(subclassId) === "arcane_trickster") return "third";
  return "none";
}

function standardSlotsByCasterLevel(casterLevel) {
  const table = {
    0: [0,0,0,0,0,0,0,0,0],
    1: [2,0,0,0,0,0,0,0,0],
    2: [3,0,0,0,0,0,0,0,0],
    3: [4,2,0,0,0,0,0,0,0],
    4: [4,3,0,0,0,0,0,0,0],
    5: [4,3,2,0,0,0,0,0,0],
    6: [4,3,3,0,0,0,0,0,0],
    7: [4,3,3,1,0,0,0,0,0],
    8: [4,3,3,2,0,0,0,0,0],
    9: [4,3,3,3,1,0,0,0,0],
    10:[4,3,3,3,2,0,0,0,0],
    11:[4,3,3,3,2,1,0,0,0],
    12:[4,3,3,3,2,1,0,0,0],
    13:[4,3,3,3,2,1,1,0,0],
    14:[4,3,3,3,2,1,1,0,0],
    15:[4,3,3,3,2,1,1,1,0],
    16:[4,3,3,3,2,1,1,1,0],
    17:[4,3,3,3,2,1,1,1,1],
    18:[4,3,3,3,3,1,1,1,1],
    19:[4,3,3,3,3,2,1,1,1],
    20:[4,3,3,3,3,2,2,1,1]
  };
  return table[clamp(casterLevel, 0, 20)] || table[0];
}

function warlockPactByLevel(level) {
  const l = clamp(level, 0, 20);
  if (l <= 0) return { max: 0, level: 1 };
  if (l <= 1) return { max: 1, level: 1 };
  if (l <= 10) return { max: 2, level: clamp(Math.ceil(l / 2), 1, 5) };
  if (l <= 16) return { max: 3, level: 5 };
  return { max: 4, level: 5 };
}

function computeEffectiveSlots(character) {
  const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  const existing = character?.spell_slots?.levels || {};
  const pactExisting = character?.spell_slots?.pact || { max: 0, used: 0, level: 1 };
  let casterLevel = 0;
  let warlockLevel = 0;

  for (const row of classes) {
    const lvl = clamp(asInt(row?.level, 0), 0, 20);
    const prog = classCasterProgression(row?.id, row?.subclassId);
    if (prog === "full") casterLevel += lvl;
    if (prog === "half") casterLevel += row?.id === "artificer" ? Math.ceil(lvl / 2) : Math.floor(lvl / 2);
    if (prog === "third") casterLevel += Math.floor((lvl + 2) / 3);
    if (prog === "pact") warlockLevel += lvl;
  }
  casterLevel = clamp(casterLevel, 0, 20);

  const std = standardSlotsByCasterLevel(casterLevel);
  const levels = {};
  for (let i = 1; i <= 9; i++) {
    const key = String(i);
    const max = std[i - 1] || 0;
    const used = clamp(asInt(existing?.[key]?.used, 0), 0, max);
    levels[key] = { max, used };
  }
  const pactAuto = warlockPactByLevel(warlockLevel);
  const pact = {
    max: pactAuto.max,
    level: pactAuto.level,
    used: clamp(asInt(pactExisting?.used, 0), 0, pactAuto.max)
  };
  return { levels, pact };
}

function renderReport(report) {
  if (!report) return `<p class="hint">No import diagnostics yet.</p>`;
  const rows = [
    ...(report.blocked || []),
    ...(report.errors || []).map((message) => ({ code: "error", message })),
    ...(report.warnings || []),
    ...(report.fixes_applied || []),
    ...(report.fixes_available || [])
  ].slice(0, 12);

  return `<div class="diag-grid">
    <span><strong>ok</strong> ${esc(report.ok)}</span>
    <span><strong>errors</strong> ${esc(report.errors?.length || 0)}</span>
    <span><strong>warnings</strong> ${esc(report.warnings?.length || 0)}</span>
    <span><strong>fixes</strong> ${esc(report.fixes_applied?.length || 0)}</span>
    <span><strong>guided</strong> ${esc(report.fixes_available?.length || 0)}</span>
    <span><strong>blocked</strong> ${esc(report.blocked?.length || 0)}</span>
  </div>
  <ul class="diag-list">
    ${rows.map((row) => `<li><code>${esc(row.code || "note")}</code> ${esc(row.message || "")}</li>`).join("")}
  </ul>`;
}

function renderLookup(state) {
  if (!state.open) return "";
  const subtitle = state.type === "spell" ? "Search and insert spell records" : state.type === "class" ? "Choose a class" : "Choose a species";
  return `<div class="lookup-overlay" id="lookupOverlay">
    <section class="card lookup-panel" id="lookupPanel" role="dialog" aria-modal="true">
      <h2>Lookup: ${esc(state.type)}</h2>
      <div class="card-body">
      <p class="hint">${esc(subtitle)}</p>
      <div class="lookup-controls">
        <input id="lookupQuery" placeholder="Type to search" value="${esc(state.query)}" />
        ${state.type === "spell" ? `<select id="lookupSpellLevel">
          <option value="">Any level</option>
          ${Array.from({ length: 10 }, (_, i) => `<option value="${i}" ${state.level === String(i) ? "selected" : ""}>Level ${i}</option>`).join("")}
        </select>
        <label class="check lookup-dm-override"><input type="checkbox" id="lookupDmSpellOverride" ${state.allowOffClassSpells ? "checked" : ""} />Allow other-class spells (DM approved)</label>` : ""}
        <button type="button" id="lookupCancel">Cancel</button>
        <button type="button" class="btn-primary" id="lookupSave">Save</button>
      </div>
      <div class="lookup-list">
        ${state.results.length === 0 ? `<p class="hint">No results</p>` : state.results.map((row, idx) => `<button type="button" class="lookup-row ${state.selected === idx ? "is-selected" : ""}" data-lookup-pick="${idx}">
          <span>${esc(row.title)}</span>
          <small>${esc(row.subtitle || "")}</small>
        </button>`).join("")}
      </div>
      ${state.feedback ? `<p class="inline-note">${esc(state.feedback)}</p>` : ""}
      </div>
    </section>
  </div>`;
}

function renderPalette(state, commands) {
  if (!state.open) return "";
  return `<div class="palette-overlay" id="paletteOverlay">
    <section class="palette" role="dialog" aria-modal="true">
      <input id="paletteQuery" placeholder="Type a command..." value="${esc(state.query)}" />
      <div class="palette-list">
        ${commands.length === 0 ? `<p class="hint">No commands</p>` : commands.map((cmd, idx) => `<button type="button" class="palette-row ${state.selected === idx ? "is-selected" : ""}" data-command-id="${esc(cmd.id)}">
            <span>${esc(cmd.label)}</span>
            <small>${esc(cmd.hint || "")}</small>
          </button>`).join("")}
      </div>
    </section>
  </div>`;
}

function renderPlayMode(character) {
  const hp = character?.combat?.hp || { max: 0, current: 0, temp: 0 };
  const trackers = Array.isArray(character?.trackers) ? character.trackers : [];
  const log = Array.isArray(character?.log) ? character.log : [];
  const known = Array.isArray(character?.spells_known) ? character.spells_known : [];
  const prepared = Array.isArray(character?.spells_prepared) ? character.spells_prepared : [];
  const slots = computeEffectiveSlots(character).levels;
  const visibleSlotLevels = Array.from({ length: 9 }, (_, i) => i + 1)
    .filter((lvl) => {
      const row = slots[String(lvl)] || { max: 0, used: 0 };
      return row.max > 0 || row.used > 0;
    });
  const slotSummary = visibleSlotLevels
    .map((lvl) => {
      const row = slots[String(lvl)] || { max: 0, used: 0 };
      return { lvl, max: row.max, used: row.used, avail: Math.max(0, row.max - row.used) };
    });
  const spellSource = prepared.length ? prepared : known;
  const activeConditions = Array.isArray(character?.combat?.conditions) ? character.combat.conditions : [];
  const recentActions = Array.isArray(character?.play_state?.recent_actions) ? character.play_state.recent_actions.slice(0, 5) : [];
  const castFeedback = character?.play_state?.cast_feedback || "";
  const attacks = Array.isArray(character?.attacks) ? character.attacks : [];
  const byLevel = new Map();
  for (const s of spellSource) {
    const lvl = clamp(asInt(s?.level, 0), 0, 9);
    if (!byLevel.has(lvl)) byLevel.set(lvl, []);
    byLevel.get(lvl).push(s);
  }
  const levelsWithSpells = [...byLevel.keys()].sort((a, b) => a - b);

  return `<section class="workspace play-grid play-board">
    <article class="card play-vitals"><h2>Vitals</h2><div class="card-body quick-grid">
      <div><strong>AC</strong><p>${esc(character?.combat?.ac ?? 10)}</p></div>
      <div><strong>Initiative</strong><p>${esc(character?.combat?.initiative_bonus ?? 0)}</p></div>
      <div><strong>Passive Perception</strong><p>${esc(character?.combat?.passive_perception ?? 10)}</p></div>
      <div><strong>Inspiration</strong><p>${esc(character?.combat?.inspiration ?? 0)}</p></div>
      <div><strong>HP</strong><p>${esc(hp.current)}/${esc(hp.max)} (+${esc(hp.temp)} temp)</p></div>
      <div class="inline-actions">
        <button type="button" data-play-hp="-1">-1 HP</button>
        <button type="button" data-play-hp="1">+1 HP</button>
      </div>
      <div class="play-conditions">
        <strong>Conditions</strong>
        <ul class="condition-strip">
          ${activeConditions.length ? activeConditions.map((c) => `<li>${esc(c)}</li>`).join("") : `<li class="is-empty">No active conditions</li>`}
        </ul>
      </div>
    </div></article>

    <article class="card"><h2>Attacks</h2><div class="card-body">
      ${attacks.length === 0 ? `<p class="hint">No attacks added yet.</p>` : `<div class="attack-list">${attacks.slice(0, 8).map((a) => `<div class="attack-row"><strong>${esc(a.name || "Attack")}</strong><span>+${esc(a.atk_bonus ?? 0)}</span><span>${esc(a.damage_type || "")}</span></div>`).join("")}</div>`}
    </div></article>

    <article class="card"><h2>Trackers</h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="playTrackerAdd">Add Tracker</button><button type="button" id="playLogAdd">Add Log Entry</button></div>
      ${trackers.length === 0 ? `<p class="hint">No trackers</p>` : trackers.map((t, idx) => `<div class="tracker-row">
        <input data-play-tracker-label="${idx}" value="${esc(t.label || "")}" placeholder="Tracker label" />
        <input data-play-tracker-current="${idx}" type="number" min="0" value="${esc(t.current ?? 0)}" />
        <input data-play-tracker-max="${idx}" type="number" min="0" value="${esc(t.max ?? 0)}" />
        <button type="button" data-play-tracker="${idx}:down">-1</button><button type="button" data-play-tracker="${idx}:up">+1</button><button type="button" data-play-tracker="${idx}:reset">Reset</button><button type="button" data-play-tracker-del="${idx}">Delete</button>
      </div>`).join("")}
      <div class="log-list">
        ${log.length === 0 ? `<p class="hint">No log entries</p>` : log.slice(-6).map((entry, idx, arr) => {
          const realIdx = log.length - arr.length + idx;
          return `<div class="play-log-row">
          <input data-play-log-tag="${realIdx}" value="${esc(entry.tag || "")}" placeholder="tag" />
          <input data-play-log-message="${realIdx}" value="${esc(entry.message || "")}" placeholder="Log entry" />
          <button type="button" data-play-log-del="${realIdx}">Delete</button>
        </div>`; }).join("")}
      </div>
    </div></article>

    <article class="card play-actions"><h2>Spell Console</h2><div class="card-body">
      <div class="inline-actions">
        <button type="button" id="undoLastCast">Undo Last Cast</button>
        <button type="button" id="shortRestSlots">Short Rest</button>
        <button type="button" id="longRestSlots">Long Rest</button>
      </div>
      <p class="hint">${prepared.length ? "Prepared list active. Click a spell to cast and consume a slot automatically." : "Known list active. Click a spell to cast and consume a slot automatically."}</p>
      ${castFeedback ? `<p class="play-feedback">${esc(castFeedback)}</p>` : ""}
      ${levelsWithSpells.length === 0 ? `<p class="hint">No spells on this character yet.</p>` : `<div class="spell-level-groups">
        ${levelsWithSpells.map((lvl) => {
          const row = slots[String(lvl)] || { max: 0, used: 0 };
          const available = lvl === 0 ? "At-will" : `${Math.max(0, (row.max || 0) - (row.used || 0))}/${row.max || 0} slots`;
          const pips = lvl === 0 ? `<span class="slot-pips cantrip">Cantrip</span>` : `<span class="slot-pips">${Array.from({ length: row.max || 0 }, (_, i) => `<i class="${i < Math.max(0, (row.max || 0) - (row.used || 0)) ? "is-full" : "is-empty"}"></i>`).join("")}</span>`;
          return `<section class="spell-level-group">
            <header><strong>Level ${lvl}</strong><small>${esc(available)}</small>${pips}</header>
            <ul class="pill-list">${(byLevel.get(lvl) || []).slice(0, 16).map((s) => {
              const canCast = lvl === 0 || Math.max(0, (row.max || 0) - (row.used || 0)) > 0;
              return `<li><button type="button" class="spell-cast-pill" data-cast-spell="${esc(s.id || s.name || "spell")}" data-cast-name="${esc(s.name || s.id || "Spell")}" data-cast-base-level="${lvl}" ${canCast ? "" : "disabled"}>${esc(s.name || s.id || "Spell")}</button></li>`;
            }).join("")}</ul>
          </section>`;
        }).join("")}
      </div>`}
    </div></article>

    <article class="card play-recent"><h2>Recent Actions</h2><div class="card-body">
      ${recentActions.length ? `<ul class="recent-actions-list">${recentActions.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ul>` : `<p class="hint">No recent actions yet.</p>`}
    </div></article>
  </section>`;
}

function cardTitle(label, isEdited) {
  return `${esc(label)}${isEdited ? ` <span class="card-change-badge">Changes not saved</span>` : ""}`;
}

function renderEditMode(character, catalog, lookupState, edited = {}) {
  const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  const inventory = Array.isArray(character?.inventory) ? character.inventory : [];
  const spells = Array.isArray(character?.spells_known) ? character.spells_known : [];
  const trackers = Array.isArray(character?.trackers) ? character.trackers : [];
  const log = Array.isArray(character?.log) ? character.log : [];
  const profile = character?.profile || {};
  const resources = character?.resources || {};
  const skills = character?.skills || {};
  const savingThrows = character?.saving_throws || {};
  const attacks = Array.isArray(character?.attacks) ? character.attacks : [];
  const skillDefs = [
    ["acrobatics", "Dex"], ["animal_handling", "Wis"], ["arcana", "Int"], ["athletics", "Str"], ["deception", "Cha"], ["history", "Int"],
    ["insight", "Wis"], ["intimidation", "Cha"], ["investigation", "Int"], ["medicine", "Wis"], ["nature", "Int"], ["perception", "Wis"],
    ["performance", "Cha"], ["persuasion", "Cha"], ["religion", "Int"], ["sleight_of_hand", "Dex"], ["stealth", "Dex"], ["survival", "Wis"]
  ];

  return `<section class="workspace edit-stack">
    <article class="card" id="sec-core"><h2>${cardTitle("Core", edited.core)}</h2><div class="card-body grid2">
      <label>Name<input id="charName" value="${esc(character?.meta?.name || "")}" /></label>
      <label>Ruleset<input id="charRuleset" value="${esc(character?.meta?.ruleset_id || "")}" /></label>
      <label>Species<select id="charSpecies">${optionList(catalog.species || [], character?.core?.speciesId || "", "Select species")}</select></label>
      <div class="inline-actions"><button type="button" data-open-lookup="species">Lookup Species</button></div>
      <div class="six-grid">
        ${["str", "dex", "con", "int", "wis", "cha"].map((k) => `<label>${k.toUpperCase()}<input type="number" min="1" max="30" data-ability="${k}" value="${esc(character?.abilities?.[k] ?? 10)}" /></label>`).join("")}
      </div>
    </div></article>

    <article class="card" id="sec-classes"><h2>${cardTitle("Classes", edited.classes)}</h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="classAdd">Add Class</button><button type="button" data-open-lookup="class">Lookup Class</button><button type="button" data-open-lookup="subclass">Lookup Subclass</button></div>
      ${classes.length === 0 ? `<p class="hint">No classes</p>` : classes.map((row, idx) => `<div class="class-row">
        <select data-class-id="${idx}">${optionList(catalog.classes || [], row.id || "", "Select class")}</select>
        <input type="number" min="1" max="20" data-class-level="${idx}" value="${esc(row.level ?? 1)}" />
        <input data-class-subclass="${idx}" list="subclass-list-${idx}" value="${esc(row.subclassId || "")}" placeholder="subclass id" />
        <datalist id="subclass-list-${idx}">${subclassOptions(catalog.subclasses || [], row.id || "")}</datalist>
        <button type="button" data-class-del="${idx}">Delete</button>
      </div>`).join("")}
    </div></article>

    <article class="card" id="sec-combat"><h2>${cardTitle("Combat", edited.combat)}</h2><div class="card-body grid2">
      <label>AC<input id="combatAc" type="number" min="0" value="${esc(character?.combat?.ac ?? 10)}" /></label>
      <label>Initiative<input id="combatInit" type="number" value="${esc(character?.combat?.initiative_bonus ?? 0)}" /></label>
      <label>HP Max<input id="hpMax" type="number" min="0" value="${esc(character?.combat?.hp?.max ?? 1)}" /></label>
      <label>HP Current<input id="hpCurrent" type="number" min="0" value="${esc(character?.combat?.hp?.current ?? 1)}" /></label>
      <label>HP Temp<input id="hpTemp" type="number" min="0" value="${esc(character?.combat?.hp?.temp ?? 0)}" /></label>
      <label>Speed<input id="combatSpeed" type="number" min="0" value="${esc(character?.combat?.speed ?? 30)}" /></label>
      <label>Inspiration<input id="combatInspiration" type="number" min="0" max="1" value="${esc(character?.combat?.inspiration ?? 0)}" /></label>
      <label>Proficiency Bonus<input id="combatProfBonus" type="number" value="${esc(character?.combat?.proficiency_bonus ?? 2)}" /></label>
      <label>Passive Perception<input id="combatPassivePerception" type="number" min="0" value="${esc(character?.combat?.passive_perception ?? 10)}" /></label>
      <label>Hit Dice Total<input id="combatHitDiceTotal" type="number" min="0" value="${esc(character?.combat?.hit_dice_total ?? 0)}" /></label>
      <label>Hit Dice Used<input id="combatHitDiceUsed" type="number" min="0" value="${esc(character?.combat?.hit_dice_used ?? 0)}" /></label>
      <label>Death Saves Success<input id="combatDeathSaveSuccess" type="number" min="0" max="3" value="${esc(character?.combat?.death_saves?.success ?? 0)}" /></label>
      <label>Death Saves Fail<input id="combatDeathSaveFail" type="number" min="0" max="3" value="${esc(character?.combat?.death_saves?.fail ?? 0)}" /></label>
    </div></article>

    <article class="card" id="sec-profile"><h2>${cardTitle("Sheet Details", edited.core)}</h2><div class="card-body grid2">
      <label>Background<input id="profileBackground" value="${esc(profile.background || "")}" /></label>
      <label>Alignment<input id="profileAlignment" value="${esc(profile.alignment || "")}" /></label>
      <label>Player Name<input id="profilePlayerName" value="${esc(profile.player_name || "")}" /></label>
      <label>XP<input id="profileXp" type="number" min="0" value="${esc(profile.experience_points ?? 0)}" /></label>
      <label>Age<input id="profileAge" value="${esc(profile.age || "")}" /></label>
      <label>Height<input id="profileHeight" value="${esc(profile.height || "")}" /></label>
      <label>Weight<input id="profileWeight" value="${esc(profile.weight || "")}" /></label>
      <label>Eyes<input id="profileEyes" value="${esc(profile.eyes || "")}" /></label>
      <label>Skin<input id="profileSkin" value="${esc(profile.skin || "")}" /></label>
      <label>Hair<input id="profileHair" value="${esc(profile.hair || "")}" /></label>
      <label>Personality Traits<textarea id="profileTraits">${esc(profile.personality_traits || "")}</textarea></label>
      <label>Ideals<textarea id="profileIdeals">${esc(profile.ideals || "")}</textarea></label>
      <label>Bonds<textarea id="profileBonds">${esc(profile.bonds || "")}</textarea></label>
      <label>Flaws<textarea id="profileFlaws">${esc(profile.flaws || "")}</textarea></label>
      <label>Other Proficiencies & Languages<textarea id="profileProficiencies">${esc(profile.other_proficiencies_languages || "")}</textarea></label>
      <label>Features & Traits<textarea id="profileFeatures">${esc(profile.features_traits || "")}</textarea></label>
      <label>Backstory<textarea id="profileBackstory">${esc(profile.backstory || "")}</textarea></label>
      <label>Allies & Organizations<textarea id="profileAllies">${esc(profile.allies_organizations || "")}</textarea></label>
      <label>Additional Features<textarea id="profileAdditionalFeatures">${esc(profile.additional_features || "")}</textarea></label>
      <label>Treasure<textarea id="profileTreasure">${esc(profile.treasure || "")}</textarea></label>
      <label>CP<input id="resCp" type="number" min="0" value="${esc(resources.cp ?? 0)}" /></label>
      <label>SP<input id="resSp" type="number" min="0" value="${esc(resources.sp ?? 0)}" /></label>
      <label>EP<input id="resEp" type="number" min="0" value="${esc(resources.ep ?? 0)}" /></label>
      <label>GP<input id="resGp" type="number" min="0" value="${esc(resources.gp ?? 0)}" /></label>
      <label>PP<input id="resPp" type="number" min="0" value="${esc(resources.pp ?? 0)}" /></label>
    </div></article>

    <article class="card" id="sec-mechanics"><h2>${cardTitle("Saving Throws, Skills, Attacks", edited.combat)}</h2><div class="card-body stack">
      <h3>Saving Throws</h3>
      <div class="grid2">
        ${["str", "dex", "con", "int", "wis", "cha"].map((k) => `<div class="tracker-row">
          <strong>${k.toUpperCase()}</strong>
          <label class="check"><input type="checkbox" data-save-prof="${k}" ${savingThrows?.[k]?.proficient ? "checked" : ""}/>Proficient</label>
          <input type="number" data-save-bonus="${k}" value="${esc(savingThrows?.[k]?.bonus ?? 0)}" />
        </div>`).join("")}
      </div>
      <h3>Skills</h3>
      <div class="stack">
        ${skillDefs.map(([id, ability]) => {
          const row = skills?.[id] || {};
          return `<div class="tracker-row">
            <strong>${esc(id.replaceAll("_", " "))} (${esc(ability)})</strong>
            <label class="check"><input type="checkbox" data-skill-prof="${esc(id)}" ${row.proficient ? "checked" : ""}/>Prof</label>
            <label class="check"><input type="checkbox" data-skill-exp="${esc(id)}" ${row.expertise ? "checked" : ""}/>Expertise</label>
            <input type="number" data-skill-bonus="${esc(id)}" value="${esc(row.bonus ?? 0)}" />
          </div>`;
        }).join("")}
      </div>
      <h3>Attacks & Spellcasting</h3>
      <div class="inline-actions"><button type="button" id="attackAdd">Add Attack</button></div>
      <div class="stack">
        ${attacks.length === 0 ? `<p class="hint">No attacks</p>` : attacks.map((a, idx) => `<div class="attack-edit-row">
          <input data-attack-name="${idx}" value="${esc(a.name || "")}" placeholder="Name" />
          <input data-attack-bonus="${idx}" type="number" value="${esc(a.atk_bonus ?? 0)}" placeholder="Atk bonus" />
          <input data-attack-damage="${idx}" value="${esc(a.damage_type || "")}" placeholder="Damage/Type" />
          <input data-attack-notes="${idx}" value="${esc(a.notes || "")}" placeholder="Notes" />
          <button type="button" data-attack-del="${idx}">Delete</button>
        </div>`).join("")}
      </div>
    </div></article>

    <article class="card" id="sec-spells"><h2>${cardTitle("Spells", edited.spells)}</h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="spellAdd">Add Spell</button><button type="button" data-open-lookup="spell">Lookup Spells</button></div>
      ${spells.length === 0 ? `<p class="hint">No known spells</p>` : spells.map((s, idx) => `<div class="spell-row">
        <input data-spell-name="${idx}" value="${esc(s.name || "")}" placeholder="Name" />
        <input data-spell-level="${idx}" type="number" min="0" max="9" value="${esc(s.level ?? 0)}" />
        <input data-spell-school="${idx}" value="${esc(s.school || "")}" placeholder="School" />
        <label class="check"><input type="checkbox" data-spell-prep="${idx}" ${Array.isArray(character?.spells_prepared) && character.spells_prepared.some((p) => p.id === s.id) ? "checked" : ""}/>Prepared</label>
        <button type="button" data-spell-del="${idx}">Delete</button>
      </div>`).join("")}
    </div></article>

    <article class="card" id="sec-inventory"><h2>${cardTitle("Inventory", edited.inventory)}</h2><div class="card-body stack">
      <button type="button" id="invAdd">Add Item</button>
      ${inventory.length === 0 ? `<p class="hint">No inventory items</p>` : inventory.map((r, idx) => `<div class="inv-row">
        <input data-inv-name="${idx}" value="${esc(r.name || "")}" placeholder="Item" />
        <input data-inv-qty="${idx}" type="number" min="0" value="${esc(r.qty ?? 1)}" />
        <input data-inv-notes="${idx}" value="${esc(r.notes || "")}" placeholder="Notes" />
        <button type="button" data-inv-del="${idx}">Delete</button>
      </div>`).join("")}
    </div></article>

    <article class="card" id="sec-trackers"><h2>${cardTitle("Trackers & Log", edited.trackers)}</h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="trackerAdd">Add Tracker</button><button type="button" id="logAdd">Add Log Entry</button></div>
      ${trackers.length === 0 ? `<p class="hint">No trackers</p>` : trackers.map((t, idx) => `<div class="tracker-row">
        <input data-tracker-label="${idx}" value="${esc(t.label || "")}" placeholder="Label" />
        <select data-tracker-reset="${idx}">${["none", "short_rest", "long_rest", "daily", "manual"].map((x) => `<option value="${x}" ${(t.reset || "none") === x ? "selected" : ""}>${x}</option>`).join("")}</select>
        <input data-tracker-max="${idx}" type="number" min="0" value="${esc(t.max ?? 0)}" />
        <input data-tracker-current="${idx}" type="number" min="0" value="${esc(t.current ?? 0)}" />
        <button type="button" data-tracker-del="${idx}">Delete</button>
      </div>`).join("")}
      <div class="log-list">
        ${log.slice(-8).reverse().map((entry) => `<p><strong>${esc(entry.tag || "note")}</strong> ${esc(entry.message || "")}</p>`).join("") || `<p class="hint">No log entries</p>`}
      </div>
    </div></article>

    ${renderLookup(lookupState)}
  </section>`;
}

export function mountV2UI({ root, getState, actions }) {
  if (!root) throw new Error("mountV2UI requires root");

  const MODE_KEY = "living-codex-v2.ui.mode";
  const POLICY_KEY = "living-codex-v2.ui.policy";
  const draft = {
    name: "New Character",
    rulesetId: "dnd5e_2014",
    classId: "",
    speciesId: "",
    str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10
  };

  const uiState = {
    mode: localStorage.getItem(MODE_KEY) === "play" ? "play" : "edit",
    policyMode: localStorage.getItem(POLICY_KEY) === "core_only" ? "core_only" : "all_official",
    showCreate: false,
    diagnosticsOpen: false,
    edited: { core: false, classes: false, combat: false, spells: false, inventory: false, trackers: false },
    lastCastLevel: 0,
    lastAction: "",
    castMenu: { open: false, spellName: "", spellKey: "", baseLevel: 0, options: [] },
    palette: { open: false, query: "", selected: 0, recents: [] },
    lookup: { open: false, type: "spell", query: "", level: "", allowOffClassSpells: false, selected: 0, results: [], feedback: "", originSectionId: "", originScrollY: 0 }
  };

  const sectionIds = ["sec-core", "sec-classes", "sec-combat", "sec-profile", "sec-mechanics", "sec-spells", "sec-inventory", "sec-trackers"];

  function policyAllows(row) {
    if (uiState.policyMode !== "core_only") return true;
    return (row?.availability?.default || "allowed") !== "requires_dm_approval";
  }

  function policyCatalog(catalog) {
    const classes = (catalog.classes || []).filter(policyAllows);
    const species = (catalog.species || []).filter(policyAllows);
    const subclasses = (catalog.subclasses || []).filter(policyAllows);
    return { ...catalog, classes, species, subclasses };
  }

  function classIdsFromCharacter(character) {
    const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    return rows.map((x) => norm(x.id)).filter(Boolean);
  }

  function primaryClassId(character) {
    const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    const primary = rows.find((x) => x?.isPrimary) || rows[0];
    return norm(primary?.id);
  }

  function refreshLookup() {
    if (!uiState.lookup.open || typeof actions.lookupProvider !== "function") return;
    const state = getState();
    uiState.lookup.results = actions.lookupProvider({
      type: uiState.lookup.type,
      query: uiState.lookup.query,
      filters: {
        level: uiState.lookup.level,
        classIds: classIdsFromCharacter(state.character),
        subclassIds: (Array.isArray(state.character?.core?.classes) ? state.character.core.classes : []).map((x) => norm(x?.subclassId)).filter(Boolean),
        classId: primaryClassId(state.character),
        allowOffClassSpells: Boolean(uiState.lookup.allowOffClassSpells),
        policyMode: uiState.policyMode
      }
    }) || [];
    if (uiState.lookup.selected >= uiState.lookup.results.length) uiState.lookup.selected = Math.max(0, uiState.lookup.results.length - 1);
  }

  function setMode(mode) {
    uiState.mode = mode === "play" ? "play" : "edit";
    localStorage.setItem(MODE_KEY, uiState.mode);
  }

  function setPolicyMode(mode) {
    uiState.policyMode = mode === "core_only" ? "core_only" : "all_official";
    localStorage.setItem(POLICY_KEY, uiState.policyMode);
  }

  function markEdited(sectionKey) {
    if (!sectionKey || !Object.prototype.hasOwnProperty.call(uiState.edited, sectionKey)) return;
    uiState.edited[sectionKey] = true;
  }

  function clearEdited() {
    for (const k of Object.keys(uiState.edited)) uiState.edited[k] = false;
  }

  function commandRegistry() {
    const state = getState();
    const hasCharacter = Boolean(state.character);
    return [
      { id: "save", label: "Save Character", hint: "Cmd/Ctrl+S", keywords: ["save", "persist"], enabled: () => hasCharacter, run: () => actions.saveNow() },
      { id: "import", label: "Import ZIP", hint: "Pack import", keywords: ["import", "zip"], enabled: () => true, run: () => actions.importZip() },
      { id: "export", label: "Export ZIP", hint: "Pack export", keywords: ["export", "zip"], enabled: () => hasCharacter, run: () => actions.exportZip() },
      { id: "toggle-mode", label: uiState.mode === "edit" ? "Switch to Play Mode" : "Switch to Edit Mode", hint: "View mode", keywords: ["mode", "play", "edit"], enabled: () => hasCharacter, run: () => setMode(uiState.mode === "edit" ? "play" : "edit") },
      { id: "policy-core", label: "Policy: Core Only", hint: "Hide DM approval options", keywords: ["policy", "core", "dm"], enabled: () => true, run: () => setPolicyMode("core_only") },
      { id: "policy-all", label: "Policy: All Official", hint: "Include DM approval options", keywords: ["policy", "all", "official"], enabled: () => true, run: () => setPolicyMode("all_official") },
      { id: "open-diag", label: "Toggle Diagnostics", hint: "Status panel", keywords: ["diagnostics", "report"], enabled: () => true, run: () => { uiState.diagnosticsOpen = !uiState.diagnosticsOpen; } },
      { id: "new", label: "Open Create Character", hint: "New draft", keywords: ["new", "create"], enabled: () => true, run: () => { uiState.showCreate = true; } },
      { id: "jump-core", label: "Jump: Core", hint: "Ctrl/Cmd+1", keywords: ["jump", "core"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(0) },
      { id: "jump-classes", label: "Jump: Classes", hint: "Ctrl/Cmd+2", keywords: ["jump", "classes"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(1) },
      { id: "jump-combat", label: "Jump: Combat", hint: "Ctrl/Cmd+3", keywords: ["jump", "combat"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(2) },
      { id: "jump-spells", label: "Jump: Spells", hint: "Ctrl/Cmd+4", keywords: ["jump", "spells"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(5) },
      { id: "jump-inventory", label: "Jump: Inventory", hint: "Ctrl/Cmd+5", keywords: ["jump", "inventory"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(6) },
      { id: "jump-trackers", label: "Jump: Trackers & Log", hint: "Ctrl/Cmd+6", keywords: ["jump", "trackers", "log"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(7) },
      { id: "lookup-spell", label: "Open Spell Lookup", hint: "Rules data", keywords: ["lookup", "spell"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("spell") },
      { id: "lookup-class", label: "Open Class Lookup", hint: "Rules data", keywords: ["lookup", "class"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("class") },
      { id: "lookup-subclass", label: "Open Subclass Lookup", hint: "Rules data", keywords: ["lookup", "subclass"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("subclass") },
      { id: "lookup-species", label: "Open Species Lookup", hint: "Rules data", keywords: ["lookup", "species"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("species") },
      { id: "play.shortRest", label: "Play: Short Rest", hint: "Restore pact slots", keywords: ["play", "short", "rest", "slots"], enabled: () => hasCharacter && uiState.mode === "play", run: () => performShortRest() },
      { id: "play.longRest", label: "Play: Long Rest", hint: "Restore all slots", keywords: ["play", "long", "rest", "slots"], enabled: () => hasCharacter && uiState.mode === "play", run: () => performLongRest() },
      { id: "play.undoLastCast", label: "Play: Undo Last Cast", hint: "Reverse recent cast", keywords: ["play", "undo", "cast"], enabled: () => hasCharacter && uiState.mode === "play", run: () => performUndoLastCast() },
      { id: "play.castSpell", label: "Play: Cast Spell", hint: "Consume selected slot", keywords: ["play", "cast", "spell"], enabled: () => false, run: () => {} }
    ];
  }

  function recordPlayAction(label) {
    uiState.lastAction = label;
    actions.updateCharacter((c) => {
      c.play_state = c.play_state || {};
      const existing = Array.isArray(c.play_state.recent_actions) ? c.play_state.recent_actions : [];
      c.play_state.recent_actions = [label, ...existing].slice(0, 5);
    });
  }

  function setCastFeedback(message) {
    actions.updateCharacter((c) => {
      c.play_state = c.play_state || {};
      c.play_state.cast_feedback = message;
    });
  }

  function performUndoLastCast() {
    const lvl = clamp(asInt(uiState.lastCastLevel, 0), 0, 9);
    if (lvl <= 0) {
      setCastFeedback("No prior leveled spell cast to undo.");
      return;
    }
    actions.updateCharacter((c) => {
      c.spell_slots = c.spell_slots || { levels: {} };
      c.spell_slots.levels = c.spell_slots.levels || {};
      const key = String(lvl);
      const row = c.spell_slots.levels[key] || { max: 0, used: 0 };
      row.used = Math.max(0, (row.used || 0) - 1);
      c.spell_slots.levels[key] = row;
    });
    recordPlayAction(`Undo cast: level ${lvl} slot refunded`);
    setCastFeedback(`Undo complete: restored one level ${lvl} slot.`);
  }

  function performShortRest() {
    actions.updateCharacter((c) => {
      const effective = computeEffectiveSlots(c);
      c.spell_slots = c.spell_slots || { levels: {}, pact: { max: 0, used: 0, level: 1 } };
      c.spell_slots.pact = {
        max: effective.pact?.max || 0,
        level: effective.pact?.level || 1,
        used: 0
      };
    });
    recordPlayAction("Short rest: pact slots restored");
    setCastFeedback("Short rest applied: pact slots restored.");
  }

  function performLongRest() {
    actions.updateCharacter((c) => {
      const effective = computeEffectiveSlots(c);
      c.spell_slots = c.spell_slots || { levels: {}, pact: { max: 0, used: 0, level: 1 } };
      c.spell_slots.levels = c.spell_slots.levels || {};
      for (let i = 1; i <= 9; i++) {
        const key = String(i);
        const autoMax = effective.levels?.[key]?.max || 0;
        c.spell_slots.levels[key] = { max: autoMax, used: 0 };
      }
      c.spell_slots.pact = {
        max: effective.pact?.max || 0,
        level: effective.pact?.level || 1,
        used: 0
      };
    });
    recordPlayAction("Long rest: all spell slots restored");
    setCastFeedback("Long rest applied: all spell slots restored.");
  }

  function openCastMenu(spellName, spellKey, baseLevel) {
    const state = getState();
    const effective = computeEffectiveSlots(state.character).levels;
    const options = [];
    for (let lvl = baseLevel; lvl <= 9; lvl++) {
      const row = effective[String(lvl)] || { max: 0, used: 0 };
      const avail = Math.max(0, (row.max || 0) - (row.used || 0));
      if (avail > 0) options.push({ level: lvl, available: avail, max: row.max || 0 });
    }
    uiState.castMenu = { open: true, spellName, spellKey, baseLevel, options };
    render();
  }

  function closeCastMenu() {
    uiState.castMenu = { open: false, spellName: "", spellKey: "", baseLevel: 0, options: [] };
    render();
  }

  function performCastAtLevel(lvl, spellName = "Spell") {
    const level = clamp(asInt(lvl, 0), 0, 9);
    if (level === 0) {
      setCastFeedback("Cantrip cast: no slot consumed.");
      recordPlayAction(`Cast cantrip: ${spellName}`);
      return;
    }
    let consumed = false;
    actions.updateCharacter((c) => {
      const effective = computeEffectiveSlots(c);
      const key = String(level);
      c.spell_slots = c.spell_slots || { levels: {} };
      c.spell_slots.levels = c.spell_slots.levels || {};
      const autoMax = effective.levels?.[key]?.max || 0;
      if (autoMax <= 0) return;
      const row = c.spell_slots.levels[key] || { max: autoMax, used: 0 };
      if ((row.used || 0) >= autoMax) return;
      row.max = autoMax;
      row.used = Math.min(autoMax, (row.used || 0) + 1);
      c.spell_slots.levels[key] = row;
      consumed = true;
    });
    if (consumed) {
      uiState.lastCastLevel = level;
      setCastFeedback(`Cast applied: ${spellName} at level ${level}.`);
      recordPlayAction(`Cast ${spellName} at L${level}`);
      return;
    }
    setCastFeedback(`No level ${level} slots available.`);
  }

  function visibleCommands() {
    const q = norm(uiState.palette.query);
    return commandRegistry()
      .filter((cmd) => cmd.enabled())
      .filter((cmd) => {
        if (!q) return true;
        const hay = `${cmd.label} ${(cmd.keywords || []).join(" ")} ${cmd.id}`.toLowerCase();
        return hay.includes(q);
      });
  }

  function runCommand(id) {
    const cmd = commandRegistry().find((c) => c.id === id && c.enabled());
    if (!cmd) return;
    cmd.run();
    uiState.palette.recents = [id, ...uiState.palette.recents.filter((x) => x !== id)].slice(0, 8);
    uiState.palette.open = false;
    uiState.palette.query = "";
    uiState.palette.selected = 0;
    render();
  }

  function applyLookupSelection(index = uiState.lookup.selected) {
    const state = getState();
    const character = state.character;
    const row = uiState.lookup.results[index];
    if (!row || !character) return false;

    if (uiState.lookup.type === "species") {
      markEdited("core");
      actions.updateCharacter((c) => {
        c.core = c.core || { classes: [] };
        c.core.speciesId = row.id;
      });
      uiState.lookup.feedback = `Set species to ${row.title}.`;
      return true;
    }

    if (uiState.lookup.type === "class") {
      const existing = Array.isArray(character?.core?.classes)
        ? character.core.classes.some((x) => norm(x?.id) === norm(row.id))
        : false;
      if (existing) {
        uiState.lookup.feedback = `Class already present: ${row.title}.`;
        return false;
      }
      markEdited("classes");
      actions.updateCharacter((c) => {
        c.core = c.core || { classes: [] };
        c.core.classes = Array.isArray(c.core.classes) ? c.core.classes : [];
        c.core.classes.push({ id: row.id, level: 1, isPrimary: c.core.classes.length === 0, subclassId: "" });
      });
      uiState.lookup.feedback = `Added class ${row.title}.`;
      return true;
    }

    if (uiState.lookup.type === "spell") {
      const spellId = makeSpellId(row.raw);
      const exists = (character.spells_known || []).some((x) => (x.id || x.spell_id || x.name) === spellId);
      if (exists) {
        uiState.lookup.feedback = `Spell already exists: ${row.title}.`;
        return false;
      }
      markEdited("spells");
      actions.updateCharacter((c) => {
        c.spells_known = Array.isArray(c.spells_known) ? c.spells_known : [];
        c.spells_known.push({
          id: spellId,
          name: row.raw?.name || row.title,
          level: asInt(row.raw?.level, 0),
          school: row.raw?.school || "",
          source: row.raw?.source || "",
          ritual: Boolean(row.raw?.ritual),
          concentration: Boolean(row.raw?.concentration),
          casting_time: row.raw?.casting_time || "",
          range: row.raw?.range || "",
          components: row.raw?.components || "",
          duration: row.raw?.duration || "",
          spell_id: row.raw?.id || "",
          page: row.raw?.page || "",
          notes: ""
        });
      });
      uiState.lookup.feedback = `Added spell ${row.title}.`;
      return true;
    }

    if (uiState.lookup.type === "subclass") {
      const classRows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
      const targetIdx = classRows.findIndex((x) => norm(x?.id) === norm(row.raw?.class_id));
      if (targetIdx < 0) {
        uiState.lookup.feedback = `No matching class found for ${row.title}. Add ${row.raw?.class_id || "that class"} first.`;
        return false;
      }
      markEdited("classes");
      actions.updateCharacter((c) => {
        c.core = c.core || { classes: [] };
        c.core.classes = Array.isArray(c.core.classes) ? c.core.classes : [];
        if (!c.core.classes[targetIdx]) return;
        c.core.classes[targetIdx].subclassId = row.id;
      });
      uiState.lookup.feedback = `Set subclass to ${row.title}.`;
      return true;
    }

    return false;
  }

  function jumpToSection(idx) {
    const id = sectionIds[idx];
    if (!id) return;
    const el = root.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openLookup(type) {
    const active = document.activeElement;
    const section = active?.closest?.(".card[id]") || null;
    uiState.lookup.open = true;
    uiState.lookup.type = type;
    uiState.lookup.query = "";
    uiState.lookup.level = "";
    uiState.lookup.allowOffClassSpells = false;
    uiState.lookup.selected = 0;
    uiState.lookup.feedback = "";
    uiState.lookup.originSectionId = section?.id || "";
    uiState.lookup.originScrollY = window.scrollY || 0;
    refreshLookup();
    render();
  }

  function closeLookup({ restore = true } = {}) {
    const sectionId = uiState.lookup.originSectionId;
    const scrollY = uiState.lookup.originScrollY;
    uiState.lookup.open = false;
    uiState.lookup.originSectionId = "";
    uiState.lookup.originScrollY = 0;
    render();
    if (!restore) return;
    requestAnimationFrame(() => {
      const target = sectionId ? root.querySelector(`#${sectionId}`) : null;
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      window.scrollTo({ top: scrollY, behavior: "smooth" });
    });
  }

  function cycleSections(step) {
    if (uiState.mode !== "edit") return;
    const tops = sectionIds
      .map((id, idx) => ({ idx, el: root.querySelector(`#${id}`) }))
      .filter((x) => x.el)
      .map((x) => ({ idx: x.idx, top: x.el.getBoundingClientRect().top }));
    if (!tops.length) return;
    const current = tops.find((x) => x.top > 0) || tops[tops.length - 1];
    const next = (current.idx + step + sectionIds.length) % sectionIds.length;
    jumpToSection(next);
  }

  function render() {
    const state = getState();
    const character = state.character;
    const rawCatalog = actions.getCatalog ? actions.getCatalog() : { classes: [], species: [], spells: [], error: "" };
    const catalog = policyCatalog(rawCatalog);
    const runtime = actions.getRuntimeStatus ? actions.getRuntimeStatus() : { message: "", tone: "info", at: "" };
    if (!state.app.dirty) clearEdited();
    refreshLookup();
    const commands = visibleCommands();

    root.innerHTML = `
      <header class="shell-topbar">
        <div>
          <h1>The Living Codex v2</h1>
          <p class="hint">${character ? esc(character?.meta?.name || "Unnamed") : "No active character"}</p>
        </div>
        <div class="top-actions">
          <div class="top-row-state">
            <span class="status-chip ${state.app.dirty ? "dirty" : "saved"}">${state.app.dirty ? "Unsaved" : "Saved"}</span>
            <label class="dual-toggle-chip" for="policyModeToggle" title="Choose which player options appear in lookups and selectors">
              <span class="${uiState.policyMode === "all_official" ? "is-active" : ""}">All Official Player Options</span>
              <input id="policyModeToggle" type="checkbox" ${uiState.policyMode === "core_only" ? "checked" : ""} />
              <span class="policy-switch" aria-hidden="true"></span>
              <span class="${uiState.policyMode === "core_only" ? "is-active" : ""}">Core Options Only (PHB)</span>
            </label>
            <label class="dual-toggle-chip ${character ? "" : "is-disabled"}" for="modeToggle">
              <span class="${uiState.mode === "edit" ? "is-active" : ""}">Edit</span>
              <input id="modeToggle" type="checkbox" ${uiState.mode === "play" ? "checked" : ""} ${character ? "" : "disabled"} />
              <span class="policy-switch" aria-hidden="true"></span>
              <span class="${uiState.mode === "play" ? "is-active" : ""}">Play</span>
            </label>
          </div>
          <div class="top-row-actions">
            <button type="button" id="openPalette">Command Palette</button>
            <button type="button" class="btn-primary" id="saveBtn" ${character ? "" : "disabled"}>Save</button>
            <button type="button" id="importBtn">Import</button>
            <button type="button" id="exportBtn" ${character ? "" : "disabled"}>Export</button>
            <button type="button" id="newCharBtn">New Character</button>
          </div>
        </div>
      </header>

      <section class="card">
        <h2>Status</h2>
        <div class="card-body compact-status">
          ${runtime.message ? `<span class="tone tone-${esc(runtime.tone || "info")}">${esc(runtime.message)}</span>` : `<span class="hint">No recent action</span>`}
          <button type="button" id="diagToggle">${uiState.diagnosticsOpen ? "Hide" : "Show"} diagnostics</button>
        </div>
      </section>

      ${uiState.diagnosticsOpen ? `<section class="card"><h2>Diagnostics</h2><div class="card-body">
          ${rawCatalog.error ? `<p class="error">Rules data error: ${esc(rawCatalog.error)}</p>` : ""}
          ${state.app.lastError ? `<p class="error">App error: ${esc(state.app.lastError)}</p>` : ""}
          ${renderReport(state.importReport)}
      </div></section>` : ""}

      ${(!character || uiState.showCreate) ? `<section class="card"><h2>Create Character</h2><div class="card-body create-grid">
        <label>Name<input id="newName" value="${esc(draft.name)}" /></label>
        <label>Ruleset<select id="newRuleset"><option value="dnd5e_2014" ${draft.rulesetId === "dnd5e_2014" ? "selected" : ""}>D&D 5e (2014)</option><option value="dnd5e_2024" ${draft.rulesetId === "dnd5e_2024" ? "selected" : ""}>D&D 5e (2024)</option></select></label>
        <label>Class<select id="newClass">${optionList(catalog.classes || [], draft.classId, "Optional class")}</select></label>
        <label>Species<select id="newSpecies">${optionList(catalog.species || [], draft.speciesId, "Optional species")}</select></label>
        <div class="six-grid">${["str", "dex", "con", "int", "wis", "cha"].map((k) => `<label>${k.toUpperCase()}<input id="new${k.toUpperCase()}" type="number" min="1" max="30" value="${esc(draft[k])}" /></label>`).join("")}</div>
        <div class="inline-actions"><button type="button" class="btn-primary" id="createBtn">Create Character</button>${character ? `<button type="button" id="cancelCreateBtn">Cancel</button>` : ""}</div>
      </div></section>` : `${uiState.mode === "play" ? renderPlayMode(character) : renderEditMode(character, catalog, uiState.lookup, uiState.edited)}`}

      ${renderPalette(uiState.palette, commands)}
      ${uiState.castMenu.open ? `<div class="palette-overlay" id="castOverlay">
        <section class="palette cast-menu" role="dialog" aria-modal="true">
          <h3>Cast ${esc(uiState.castMenu.spellName)}</h3>
          <p class="hint">Choose spell slot level</p>
          <div class="cast-options">
            ${uiState.castMenu.options.length ? uiState.castMenu.options.map((x) => `<button type="button" data-cast-at="${x.level}">Level ${x.level} (${x.available}/${x.max})</button>`).join("") : `<p class="hint">No available slots for this spell.</p>`}
          </div>
          <div class="inline-actions"><button type="button" id="castMenuCancel">Cancel</button></div>
        </section>
      </div>` : ""}
    `;

    bindEvents();

    if (uiState.palette.open) {
      const query = root.querySelector("#paletteQuery");
      if (query) query.focus();
    }
    if (uiState.lookup.open) {
      const lookup = root.querySelector("#lookupQuery");
      if (lookup) lookup.focus();
    }
  }

  function bindEvents() {
    const state = getState();
    const character = state.character;

    root.querySelector("#openPalette")?.addEventListener("click", () => {
      uiState.palette.open = true;
      uiState.palette.query = "";
      uiState.palette.selected = 0;
      render();
    });
    root.querySelector("#saveBtn")?.addEventListener("click", () => actions.saveNow());
    root.querySelector("#newCharBtn")?.addEventListener("click", () => {
      uiState.showCreate = true;
      render();
    });
    root.querySelector("#policyModeToggle")?.addEventListener("change", (e) => {
      setPolicyMode(e.target.checked ? "core_only" : "all_official");
      render();
    });
    root.querySelector("#importBtn")?.addEventListener("click", () => actions.importZip());
    root.querySelector("#exportBtn")?.addEventListener("click", () => actions.exportZip());
    root.querySelector("#modeToggle")?.addEventListener("change", (e) => {
      setMode(e.target.checked ? "play" : "edit");
      render();
    });
    root.querySelector("#diagToggle")?.addEventListener("click", () => { uiState.diagnosticsOpen = !uiState.diagnosticsOpen; render(); });

    root.querySelector("#createBtn")?.addEventListener("click", () => {
      draft.name = root.querySelector("#newName")?.value || draft.name;
      draft.rulesetId = root.querySelector("#newRuleset")?.value || draft.rulesetId;
      draft.classId = root.querySelector("#newClass")?.value || "";
      draft.speciesId = root.querySelector("#newSpecies")?.value || "";
      for (const k of ["str", "dex", "con", "int", "wis", "cha"]) draft[k] = asInt(root.querySelector(`#new${k.toUpperCase()}`)?.value, 10);
      actions.newCharacter(draft);
      uiState.showCreate = false;
    });
    root.querySelector("#cancelCreateBtn")?.addEventListener("click", () => {
      uiState.showCreate = false;
      render();
    });

    root.querySelector("#paletteOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "paletteOverlay") {
        uiState.palette.open = false;
        render();
      }
    });
    root.querySelector("#castOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "castOverlay") closeCastMenu();
    });
    root.querySelector("#castMenuCancel")?.addEventListener("click", () => closeCastMenu());
    root.querySelectorAll("[data-cast-at]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const lvl = asInt(e.currentTarget.getAttribute("data-cast-at"), 0);
        const spellName = uiState.castMenu.spellName || "Spell";
        closeCastMenu();
        performCastAtLevel(lvl, spellName);
      });
    });

    root.querySelector("#paletteQuery")?.addEventListener("input", (e) => {
      uiState.palette.query = e.target.value;
      uiState.palette.selected = 0;
      render();
    });

    root.querySelectorAll("[data-command-id]").forEach((el) => {
      el.addEventListener("click", (e) => runCommand(e.currentTarget.getAttribute("data-command-id")));
    });

    root.querySelector("#lookupOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "lookupOverlay") closeLookup({ restore: true });
    });
    root.querySelector("#lookupCancel")?.addEventListener("click", () => closeLookup({ restore: true }));
    root.querySelector("#lookupSave")?.addEventListener("click", () => {
      const ok = applyLookupSelection(uiState.lookup.selected);
      if (ok) closeLookup({ restore: true });
      else render();
    });
    root.querySelector("#lookupQuery")?.addEventListener("input", (e) => {
      uiState.lookup.query = e.target.value;
      refreshLookup();
      render();
    });
    root.querySelector("#lookupSpellLevel")?.addEventListener("change", (e) => {
      uiState.lookup.level = e.target.value;
      refreshLookup();
      render();
    });
    root.querySelector("#lookupDmSpellOverride")?.addEventListener("change", (e) => {
      uiState.lookup.allowOffClassSpells = Boolean(e.target.checked);
      refreshLookup();
      render();
    });
    root.querySelectorAll("[data-lookup-pick]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const idx = asInt(e.currentTarget.getAttribute("data-lookup-pick"), 0);
        uiState.lookup.selected = Math.max(0, Math.min(uiState.lookup.results.length - 1, idx));
        render();
      });
    });

    root.querySelectorAll("[data-open-lookup]").forEach((el) => {
      el.addEventListener("click", (e) => openLookup(e.currentTarget.getAttribute("data-open-lookup")));
    });

    if (!character) return;

    if (uiState.mode === "play") {
      root.querySelector("#undoLastCast")?.addEventListener("click", () => performUndoLastCast());
      root.querySelector("#shortRestSlots")?.addEventListener("click", () => performShortRest());
      root.querySelector("#longRestSlots")?.addEventListener("click", () => performLongRest());
      root.querySelectorAll("[data-play-hp]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const delta = asInt(e.currentTarget.getAttribute("data-play-hp"), 0);
          actions.updateCharacter((c) => {
            c.combat = c.combat || { hp: { max: 1, current: 1, temp: 0 } };
            c.combat.hp = c.combat.hp || { max: 1, current: 1, temp: 0 };
            c.combat.hp.current = Math.max(0, Math.min(c.combat.hp.max || 0, (c.combat.hp.current || 0) + delta));
          });
          recordPlayAction(delta > 0 ? `HP +${delta}` : `HP ${delta}`);
        });
      });
      root.querySelectorAll("[data-cast-spell]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const baseLevel = clamp(asInt(e.currentTarget.getAttribute("data-cast-base-level"), 0), 0, 9);
          const spellName = e.currentTarget.getAttribute("data-cast-name") || "Spell";
          const spellKey = e.currentTarget.getAttribute("data-cast-spell") || spellName;
          if (baseLevel === 0) {
            performCastAtLevel(0, spellName);
            return;
          }
          openCastMenu(spellName, spellKey, baseLevel);
        });
      });
      root.querySelectorAll("[data-play-tracker]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const [idxStr, op] = (e.currentTarget.getAttribute("data-play-tracker") || "").split(":");
          const idx = asInt(idxStr, -1);
          actions.updateCharacter((c) => {
            c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
            if (!c.trackers[idx]) return;
            if (op === "up") c.trackers[idx].current = Math.min(c.trackers[idx].max || 0, (c.trackers[idx].current || 0) + 1);
            if (op === "down") c.trackers[idx].current = Math.max(0, (c.trackers[idx].current || 0) - 1);
            if (op === "reset") c.trackers[idx].current = c.trackers[idx].max || 0;
          });
          recordPlayAction(`Tracker ${op}`);
        });
      });
      root.querySelector("#playTrackerAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
        c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
        c.trackers.push({ id: crypto.randomUUID(), label: "", type: "counter", reset: "none", max: 0, current: 0 });
      }));
      root.querySelector("#playLogAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
        c.log = Array.isArray(c.log) ? c.log : [];
        c.log.push({ id: crypto.randomUUID(), utc: new Date().toISOString(), tag: "note", message: "" });
      }));
      root.querySelectorAll("[data-play-tracker-label]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-play-tracker-label"), -1);
        actions.updateCharacter((c) => { if (c.trackers?.[i]) c.trackers[i].label = e.target.value; });
      }));
      root.querySelectorAll("[data-play-tracker-current]").forEach((el) => el.addEventListener("input", (e) => {
        const i = asInt(e.target.getAttribute("data-play-tracker-current"), -1);
        actions.updateCharacter((c) => { if (c.trackers?.[i]) c.trackers[i].current = Math.max(0, Math.min(c.trackers[i].max || 0, asInt(e.target.value, 0))); });
      }));
      root.querySelectorAll("[data-play-tracker-max]").forEach((el) => el.addEventListener("input", (e) => {
        const i = asInt(e.target.getAttribute("data-play-tracker-max"), -1);
        actions.updateCharacter((c) => { if (c.trackers?.[i]) c.trackers[i].max = Math.max(0, asInt(e.target.value, 0)); });
      }));
      root.querySelectorAll("[data-play-tracker-del]").forEach((el) => el.addEventListener("click", (e) => {
        const i = asInt(e.currentTarget.getAttribute("data-play-tracker-del"), -1);
        actions.updateCharacter((c) => { if (Array.isArray(c.trackers)) c.trackers.splice(i, 1); });
      }));
      root.querySelectorAll("[data-play-log-tag]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-play-log-tag"), -1);
        actions.updateCharacter((c) => { if (c.log?.[i]) c.log[i].tag = e.target.value; });
      }));
      root.querySelectorAll("[data-play-log-message]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-play-log-message"), -1);
        actions.updateCharacter((c) => { if (c.log?.[i]) c.log[i].message = e.target.value; });
      }));
      root.querySelectorAll("[data-play-log-del]").forEach((el) => el.addEventListener("click", (e) => {
        const i = asInt(e.currentTarget.getAttribute("data-play-log-del"), -1);
        actions.updateCharacter((c) => { if (Array.isArray(c.log)) c.log.splice(i, 1); });
      }));
      return;
    }

    root.querySelector("#charName")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.meta.name = e.target.value; }));
    root.querySelector("#charRuleset")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.meta.ruleset_id = e.target.value.trim() || "dnd5e_2014";
        c.core = c.core || { classes: [] };
        c.core.rulesetId = c.meta.ruleset_id;
      });
      actions.ensureCatalog(e.target.value.trim() || "dnd5e_2014");
    });
    root.querySelector("#charSpecies")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.core.speciesId = e.target.value; }));

    root.querySelectorAll("[data-ability]").forEach((el) => {
      el.addEventListener("input", (e) => {
        const key = e.target.getAttribute("data-ability");
        actions.updateCharacter((c) => {
          c.abilities[key] = Math.max(1, Math.min(30, asInt(e.target.value, 10)));
        });
      });
    });

    root.querySelector("#classAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
      c.core.classes = Array.isArray(c.core.classes) ? c.core.classes : [];
      c.core.classes.push({ id: "", level: 1, isPrimary: c.core.classes.length === 0, subclassId: "" });
    }));
    root.querySelectorAll("[data-class-id]").forEach((el) => el.addEventListener("change", (e) => {
      const idx = asInt(e.target.getAttribute("data-class-id"), -1);
      actions.updateCharacter((c) => { if (c.core.classes[idx]) c.core.classes[idx].id = e.target.value; });
    }));
    root.querySelectorAll("[data-class-level]").forEach((el) => el.addEventListener("input", (e) => {
      const idx = asInt(e.target.getAttribute("data-class-level"), -1);
      actions.updateCharacter((c) => { if (c.core.classes[idx]) c.core.classes[idx].level = Math.max(1, Math.min(20, asInt(e.target.value, 1))); });
    }));
    root.querySelectorAll("[data-class-subclass]").forEach((el) => el.addEventListener("change", (e) => {
      const idx = asInt(e.target.getAttribute("data-class-subclass"), -1);
      actions.updateCharacter((c) => { if (c.core.classes[idx]) c.core.classes[idx].subclassId = e.target.value.trim().toLowerCase(); });
    }));
    root.querySelectorAll("[data-class-del]").forEach((el) => el.addEventListener("click", (e) => {
      const idx = asInt(e.currentTarget.getAttribute("data-class-del"), -1);
      actions.updateCharacter((c) => { c.core.classes.splice(idx, 1); if (c.core.classes[0]) c.core.classes[0].isPrimary = true; });
    }));

    root.querySelector("#combatAc")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.ac = Math.max(0, asInt(e.target.value, 10)); }));
    root.querySelector("#combatInit")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.initiative_bonus = asInt(e.target.value, 0); }));
    root.querySelector("#hpMax")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.hp.max = Math.max(0, asInt(e.target.value, 1)); if (c.combat.hp.current > c.combat.hp.max) c.combat.hp.current = c.combat.hp.max; }));
    root.querySelector("#hpCurrent")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.hp.current = Math.max(0, asInt(e.target.value, 1)); if (c.combat.hp.current > c.combat.hp.max) c.combat.hp.current = c.combat.hp.max; }));
    root.querySelector("#hpTemp")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.hp.temp = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#combatSpeed")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.speed = Math.max(0, asInt(e.target.value, 30)); }));
    root.querySelector("#combatInspiration")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.inspiration = Math.max(0, Math.min(1, asInt(e.target.value, 0))); }));
    root.querySelector("#combatProfBonus")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.proficiency_bonus = asInt(e.target.value, 2); }));
    root.querySelector("#combatPassivePerception")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.passive_perception = Math.max(0, asInt(e.target.value, 10)); }));
    root.querySelector("#combatHitDiceTotal")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.hit_dice_total = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#combatHitDiceUsed")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.hit_dice_used = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#combatDeathSaveSuccess")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.death_saves = c.combat.death_saves || { success: 0, fail: 0 }; c.combat.death_saves.success = Math.max(0, Math.min(3, asInt(e.target.value, 0))); }));
    root.querySelector("#combatDeathSaveFail")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.combat.death_saves = c.combat.death_saves || { success: 0, fail: 0 }; c.combat.death_saves.fail = Math.max(0, Math.min(3, asInt(e.target.value, 0))); }));

    root.querySelector("#profileBackground")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.background = e.target.value; }));
    root.querySelector("#profileAlignment")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.alignment = e.target.value; }));
    root.querySelector("#profilePlayerName")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.player_name = e.target.value; }));
    root.querySelector("#profileXp")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.experience_points = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#profileAge")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.age = e.target.value; }));
    root.querySelector("#profileHeight")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.height = e.target.value; }));
    root.querySelector("#profileWeight")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.weight = e.target.value; }));
    root.querySelector("#profileEyes")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.eyes = e.target.value; }));
    root.querySelector("#profileSkin")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.skin = e.target.value; }));
    root.querySelector("#profileHair")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.hair = e.target.value; }));
    root.querySelector("#profileTraits")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.personality_traits = e.target.value; }));
    root.querySelector("#profileIdeals")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.ideals = e.target.value; }));
    root.querySelector("#profileBonds")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.bonds = e.target.value; }));
    root.querySelector("#profileFlaws")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.flaws = e.target.value; }));
    root.querySelector("#profileProficiencies")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.other_proficiencies_languages = e.target.value; }));
    root.querySelector("#profileFeatures")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.features_traits = e.target.value; }));
    root.querySelector("#profileBackstory")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.backstory = e.target.value; }));
    root.querySelector("#profileAllies")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.allies_organizations = e.target.value; }));
    root.querySelector("#profileAdditionalFeatures")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.additional_features = e.target.value; }));
    root.querySelector("#profileTreasure")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.treasure = e.target.value; }));
    root.querySelector("#resCp")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.resources = c.resources || {}; c.resources.cp = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#resSp")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.resources = c.resources || {}; c.resources.sp = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#resEp")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.resources = c.resources || {}; c.resources.ep = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#resGp")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.resources = c.resources || {}; c.resources.gp = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#resPp")?.addEventListener("input", (e) => actions.updateCharacter((c) => { c.resources = c.resources || {}; c.resources.pp = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelectorAll("[data-save-prof]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-save-prof");
      actions.updateCharacter((c) => {
        c.saving_throws = c.saving_throws || {};
        c.saving_throws[key] = c.saving_throws[key] || { proficient: false, bonus: 0 };
        c.saving_throws[key].proficient = Boolean(e.target.checked);
      });
    }));
    root.querySelectorAll("[data-save-bonus]").forEach((el) => el.addEventListener("input", (e) => {
      const key = e.target.getAttribute("data-save-bonus");
      actions.updateCharacter((c) => {
        c.saving_throws = c.saving_throws || {};
        c.saving_throws[key] = c.saving_throws[key] || { proficient: false, bonus: 0 };
        c.saving_throws[key].bonus = asInt(e.target.value, 0);
      });
    }));
    root.querySelectorAll("[data-skill-prof]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-skill-prof");
      actions.updateCharacter((c) => {
        c.skills = c.skills || {};
        c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0 };
        c.skills[key].proficient = Boolean(e.target.checked);
      });
    }));
    root.querySelectorAll("[data-skill-exp]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-skill-exp");
      actions.updateCharacter((c) => {
        c.skills = c.skills || {};
        c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0 };
        c.skills[key].expertise = Boolean(e.target.checked);
      });
    }));
    root.querySelectorAll("[data-skill-bonus]").forEach((el) => el.addEventListener("input", (e) => {
      const key = e.target.getAttribute("data-skill-bonus");
      actions.updateCharacter((c) => {
        c.skills = c.skills || {};
        c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0 };
        c.skills[key].bonus = asInt(e.target.value, 0);
      });
    }));
    root.querySelector("#attackAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
      c.attacks = Array.isArray(c.attacks) ? c.attacks : [];
      c.attacks.push({ id: crypto.randomUUID(), name: "", atk_bonus: 0, damage_type: "", notes: "" });
    }));
    root.querySelectorAll("[data-attack-name]").forEach((el) => el.addEventListener("change", (e) => {
      const i = asInt(e.target.getAttribute("data-attack-name"), -1);
      actions.updateCharacter((c) => { if (c.attacks?.[i]) c.attacks[i].name = e.target.value; });
    }));
    root.querySelectorAll("[data-attack-bonus]").forEach((el) => el.addEventListener("input", (e) => {
      const i = asInt(e.target.getAttribute("data-attack-bonus"), -1);
      actions.updateCharacter((c) => { if (c.attacks?.[i]) c.attacks[i].atk_bonus = asInt(e.target.value, 0); });
    }));
    root.querySelectorAll("[data-attack-damage]").forEach((el) => el.addEventListener("change", (e) => {
      const i = asInt(e.target.getAttribute("data-attack-damage"), -1);
      actions.updateCharacter((c) => { if (c.attacks?.[i]) c.attacks[i].damage_type = e.target.value; });
    }));
    root.querySelectorAll("[data-attack-notes]").forEach((el) => el.addEventListener("change", (e) => {
      const i = asInt(e.target.getAttribute("data-attack-notes"), -1);
      actions.updateCharacter((c) => { if (c.attacks?.[i]) c.attacks[i].notes = e.target.value; });
    }));
    root.querySelectorAll("[data-attack-del]").forEach((el) => el.addEventListener("click", (e) => {
      const i = asInt(e.currentTarget.getAttribute("data-attack-del"), -1);
      actions.updateCharacter((c) => { if (Array.isArray(c.attacks)) c.attacks.splice(i, 1); });
    }));

    root.querySelector("#spellAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
      c.spells_known = Array.isArray(c.spells_known) ? c.spells_known : [];
      c.spells_known.push({ id: crypto.randomUUID(), name: "", level: 0, school: "", source: "", ritual: false, concentration: false, casting_time: "", range: "", components: "", duration: "", spell_id: "", page: "", notes: "" });
    }));
    root.querySelectorAll("[data-spell-name]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-spell-name"), -1); actions.updateCharacter((c) => { if (c.spells_known[i]) c.spells_known[i].name = e.target.value; }); }));
    root.querySelectorAll("[data-spell-level]").forEach((el) => el.addEventListener("input", (e) => { const i = asInt(e.target.getAttribute("data-spell-level"), -1); actions.updateCharacter((c) => { if (c.spells_known[i]) c.spells_known[i].level = Math.max(0, Math.min(9, asInt(e.target.value, 0))); }); }));
    root.querySelectorAll("[data-spell-school]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-spell-school"), -1); actions.updateCharacter((c) => { if (c.spells_known[i]) c.spells_known[i].school = e.target.value; }); }));
    root.querySelectorAll("[data-spell-prep]").forEach((el) => el.addEventListener("change", (e) => {
      const i = asInt(e.target.getAttribute("data-spell-prep"), -1);
      actions.updateCharacter((c) => {
        c.spells_prepared = Array.isArray(c.spells_prepared) ? c.spells_prepared : [];
        const spell = c.spells_known[i];
        if (!spell) return;
        const at = c.spells_prepared.findIndex((x) => x.id === spell.id);
        if (e.target.checked && at < 0) c.spells_prepared.push(structuredClone(spell));
        if (!e.target.checked && at >= 0) c.spells_prepared.splice(at, 1);
      });
    }));
    root.querySelectorAll("[data-spell-del]").forEach((el) => el.addEventListener("click", (e) => {
      const i = asInt(e.currentTarget.getAttribute("data-spell-del"), -1);
      actions.updateCharacter((c) => {
        const removed = c.spells_known[i]?.id;
        c.spells_known.splice(i, 1);
        c.spells_prepared = (c.spells_prepared || []).filter((x) => x.id !== removed);
      });
    }));

    root.querySelector("#invAdd")?.addEventListener("click", () => actions.updateCharacter((c) => { c.inventory = Array.isArray(c.inventory) ? c.inventory : []; c.inventory.push({ id: crypto.randomUUID(), name: "", qty: 1, notes: "" }); }));
    root.querySelectorAll("[data-inv-name]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-inv-name"), -1); actions.updateCharacter((c) => { if (c.inventory[i]) c.inventory[i].name = e.target.value; }); }));
    root.querySelectorAll("[data-inv-qty]").forEach((el) => el.addEventListener("input", (e) => { const i = asInt(e.target.getAttribute("data-inv-qty"), -1); actions.updateCharacter((c) => { if (c.inventory[i]) c.inventory[i].qty = Math.max(0, asInt(e.target.value, 1)); }); }));
    root.querySelectorAll("[data-inv-notes]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-inv-notes"), -1); actions.updateCharacter((c) => { if (c.inventory[i]) c.inventory[i].notes = e.target.value; }); }));
    root.querySelectorAll("[data-inv-del]").forEach((el) => el.addEventListener("click", (e) => { const i = asInt(e.currentTarget.getAttribute("data-inv-del"), -1); actions.updateCharacter((c) => { c.inventory.splice(i, 1); }); }));

    root.querySelector("#trackerAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
      c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
      c.trackers.push({ id: crypto.randomUUID(), label: "", type: "counter", reset: "none", max: 0, current: 0 });
    }));
    root.querySelectorAll("[data-tracker-label]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-tracker-label"), -1); actions.updateCharacter((c) => { if (c.trackers[i]) c.trackers[i].label = e.target.value; }); }));
    root.querySelectorAll("[data-tracker-reset]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-tracker-reset"), -1); actions.updateCharacter((c) => { if (c.trackers[i]) c.trackers[i].reset = e.target.value; }); }));
    root.querySelectorAll("[data-tracker-max]").forEach((el) => el.addEventListener("input", (e) => { const i = asInt(e.target.getAttribute("data-tracker-max"), -1); actions.updateCharacter((c) => { if (c.trackers[i]) { c.trackers[i].max = Math.max(0, asInt(e.target.value, 0)); if (c.trackers[i].current > c.trackers[i].max) c.trackers[i].current = c.trackers[i].max; } }); }));
    root.querySelectorAll("[data-tracker-current]").forEach((el) => el.addEventListener("input", (e) => { const i = asInt(e.target.getAttribute("data-tracker-current"), -1); actions.updateCharacter((c) => { if (c.trackers[i]) c.trackers[i].current = Math.max(0, Math.min(c.trackers[i].max || 0, asInt(e.target.value, 0))); }); }));
    root.querySelectorAll("[data-tracker-del]").forEach((el) => el.addEventListener("click", (e) => { const i = asInt(e.currentTarget.getAttribute("data-tracker-del"), -1); actions.updateCharacter((c) => { c.trackers.splice(i, 1); }); }));

    root.querySelector("#logAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
      c.log = Array.isArray(c.log) ? c.log : [];
      c.log.push({ id: crypto.randomUUID(), utc: new Date().toISOString(), tag: "note", message: "" });
    }));
  }

  function handleGlobalHotkeys(e) {
    const cmd = e.metaKey || e.ctrlKey;
    const targetTyping = isTypingTarget(e.target);

    if (cmd && e.key.toLowerCase() === "k") {
      e.preventDefault();
      uiState.palette.open = true;
      uiState.palette.query = "";
      uiState.palette.selected = 0;
      render();
      return;
    }

    if (cmd && e.key.toLowerCase() === "s") {
      e.preventDefault();
      actions.saveNow();
      return;
    }

    if (uiState.palette.open) {
      const list = visibleCommands();
      if (e.key === "Escape") {
        uiState.palette.open = false;
        render();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        uiState.palette.selected = Math.min(list.length - 1, uiState.palette.selected + 1);
        render();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        uiState.palette.selected = Math.max(0, uiState.palette.selected - 1);
        render();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const cmdRow = list[uiState.palette.selected];
        if (cmdRow) runCommand(cmdRow.id);
        return;
      }
    }

    if (uiState.lookup.open) {
      if (e.key === "Escape") {
        closeLookup({ restore: true });
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        uiState.lookup.selected = Math.min(uiState.lookup.results.length - 1, uiState.lookup.selected + 1);
        render();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        uiState.lookup.selected = Math.max(0, uiState.lookup.selected - 1);
        render();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const ok = applyLookupSelection(uiState.lookup.selected);
        if (ok) closeLookup({ restore: true });
        else render();
        return;
      }
    }

    if (targetTyping) return;

    if (cmd && /[1-6]/.test(e.key)) {
      e.preventDefault();
      jumpToSection(asInt(e.key, 1) - 1);
      return;
    }

    if (e.key === "[") {
      e.preventDefault();
      cycleSections(-1);
      return;
    }
    if (e.key === "]") {
      e.preventDefault();
      cycleSections(1);
    }
  }

  window.addEventListener("keydown", handleGlobalHotkeys);

  return {
    render,
    openPalette: () => {
      uiState.palette.open = true;
      uiState.palette.query = "";
      uiState.palette.selected = 0;
      render();
    },
    getActionRegistry: () => commandRegistry().map((cmd) => ({
      id: cmd.id,
      label: cmd.label,
      enabled: cmd.enabled(),
      keywords: cmd.keywords || []
    }))
  };
}
