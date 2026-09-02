function nowIso() {
  return new Date().toISOString();
}

function asString(v) {
  return (v ?? "").toString();
}

function isObj(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

function toBool(v) {
  if (typeof v === "boolean") return v;
  const s = asString(v).trim().toLowerCase();
  if (["true", "t", "yes", "y", "1"].includes(s)) return true;
  if (["false", "f", "no", "n", "0", ""].includes(s)) return false;
  return false;
}

function toInt(v, fallback = 0) {
  const n = Number.parseInt(asString(v), 10);
  return Number.isFinite(n) ? n : fallback;
}

function ensureArray(obj, key, report, path) {
  if (!Array.isArray(obj[key])) {
    const before = obj[key];
    obj[key] = [];
    report.fixes_applied.push({
      code: "init-array",
      mode: "auto",
      path,
      message: "Initialized missing array.",
      before,
      after: []
    });
  }
}

function ensureObject(obj, key, report, path) {
  if (!isObj(obj[key])) {
    const before = obj[key];
    obj[key] = {};
    report.fixes_applied.push({
      code: "init-object",
      mode: "auto",
      path,
      message: "Initialized missing object.",
      before,
      after: {}
    });
  }
}

function addBlocked(report, code, path, message, extra = {}) {
  report.blocked.push({ code, path, message, mode: "blocked", ...extra });
}

function addGuided(report, code, path, message, extra = {}) {
  report.fixes_available.push({ code, path, message, mode: "guided", ...extra });
}

function addWarning(report, code, path, message, extra = {}) {
  report.warnings.push({ code, path, message, ...extra });
}

function normalizeAliasFields(character, report) {
  if (!isObj(character.proficiencies)) return;
  const p = character.proficiencies;

  if (Array.isArray(p.armour) && !Array.isArray(p.armor)) {
    p.armor = p.armour;
    report.fixes_applied.push({
      code: "alias-armour-to-armor",
      mode: "auto",
      path: "proficiencies.armor",
      message: "Mapped legacy 'armour' to 'armor'."
    });
  }

  if (Array.isArray(p.saving_throws) && !Array.isArray(p.saves)) {
    p.saves = p.saving_throws;
    report.fixes_applied.push({
      code: "alias-saving-throws-to-saves",
      mode: "auto",
      path: "proficiencies.saves",
      message: "Mapped legacy 'saving_throws' to 'saves'."
    });
  }
}

function clampAbilityScores(character, report) {
  if (!isObj(character.abilities)) return;
  const keys = ["str", "dex", "con", "int", "wis", "cha"];
  for (const key of keys) {
    const raw = character.abilities[key];
    const n = toInt(raw, 10);
    const clamped = Math.max(1, Math.min(30, n));
    if (raw !== clamped) {
      report.fixes_applied.push({
        code: "clamp-ability-score",
        mode: "auto",
        path: `abilities.${key}`,
        message: "Clamped ability score to 1..30.",
        before: raw,
        after: clamped
      });
    }
    character.abilities[key] = clamped;
  }
}

function normalizeTrackers(character, report) {
  ensureArray(character, "trackers", report, "trackers");
  character.trackers = character.trackers.map((t, idx) => {
    const out = isObj(t) ? t : {};
    if (!asString(out.id)) out.id = crypto.randomUUID();
    if (!asString(out.label)) out.label = `Tracker ${idx + 1}`;
    const rawType = asString(out.type).trim().toLowerCase();
    if (!rawType) out.type = "counter";
    else if (rawType !== "counter") {
      out.type = "counter";
      report.fixes_applied.push({
        code: "normalize-tracker-type",
        mode: "auto",
        path: `trackers[${idx}].type`,
        message: "Normalized tracker type to 'counter' for v2 schema compatibility.",
        before: rawType,
        after: "counter"
      });
    } else {
      out.type = "counter";
    }
    if (!["none", "short_rest", "long_rest", "daily", "manual"].includes(asString(out.reset))) {
      addGuided(
        report,
        "invalid-tracker-reset",
        `trackers[${idx}].reset`,
        "Tracker reset value is invalid.",
        { before: out.reset, suggested: "none" }
      );
      out.reset = "none";
    }
    out.max = Math.max(0, toInt(out.max, 0));
    out.current = Math.max(0, toInt(out.current, 0));
    if (out.current > out.max) {
      report.fixes_applied.push({
        code: "clamp-tracker-current",
        mode: "auto",
        path: `trackers[${idx}].current`,
        message: "Clamped tracker current to max.",
        before: out.current,
        after: out.max
      });
      out.current = out.max;
    }
    return out;
  });
}

function normalizeSpells(character, report) {
  ensureArray(character, "spells_known", report, "spells_known");
  ensureArray(character, "spells_prepared", report, "spells_prepared");

  for (const [key, list] of [["spells_known", character.spells_known], ["spells_prepared", character.spells_prepared]]) {
    for (let i = 0; i < list.length; i++) {
      const row = isObj(list[i]) ? list[i] : {};
      if (!asString(row.id)) row.id = crypto.randomUUID();

      const beforeLevel = row.level;
      const level = Math.max(0, Math.min(9, toInt(row.level, 0)));
      if (beforeLevel !== level) {
        report.fixes_applied.push({
          code: "clamp-spell-level",
          mode: "auto",
          path: `${key}[${i}].level`,
          message: "Clamped spell level to 0..9.",
          before: beforeLevel,
          after: level
        });
      }
      row.level = level;
      row.ritual = toBool(row.ritual);
      row.concentration = toBool(row.concentration);
      list[i] = row;
    }
  }

  const knownIds = new Set(character.spells_known.map((s) => asString(s.id)));
  const notKnown = character.spells_prepared.filter((s) => !knownIds.has(asString(s.id)));
  if (notKnown.length > 0) {
    addGuided(
      report,
      "prepared-not-known",
      "spells_prepared",
      "Some prepared spells are not in known spells.",
      { count: notKnown.length }
    );
  }
}

function normalizeCore(character, report) {
  ensureObject(character, "core", report, "core");
  const core = character.core;
  ensureArray(core, "classes", report, "core.classes");
  if (!asString(core.rulesetId) && asString(character?.meta?.ruleset_id)) {
    core.rulesetId = asString(character.meta.ruleset_id);
    report.fixes_applied.push({
      code: "fill-core-ruleset",
      mode: "auto",
      path: "core.rulesetId",
      message: "Filled core.rulesetId from meta.ruleset_id.",
      after: core.rulesetId
    });
  }

  if (!asString(core.speciesId)) {
    const speciesFallback =
      asString(core.species_id) ||
      asString(core.raceId) ||
      asString(core.race_id) ||
      asString(character?.speciesId) ||
      asString(character?.raceId);
    if (speciesFallback) {
      core.speciesId = speciesFallback.toLowerCase();
      report.fixes_applied.push({
        code: "fill-core-species",
        mode: "auto",
        path: "core.speciesId",
        message: "Filled core.speciesId from legacy species/race fields.",
        after: core.speciesId
      });
    }
  }

  if (core.classes.length === 0) {
    const fallbackClass =
      asString(core.classId) ||
      asString(core.class_id) ||
      asString(character.class_id) ||
      asString(character.class);
    const fallbackFromIdentity = Array.isArray(character?.identity?.classes)
      ? asString(character.identity.classes[0]?.name)
      : "";
    const resolvedFallback = fallbackClass || fallbackFromIdentity;
    if (resolvedFallback) {
      addGuided(
        report,
        "legacy-single-class",
        "core.classes",
        "Legacy single-class fields found; can migrate to core.classes.",
        { suggested: [{ id: canonicalClassId(resolvedFallback), level: 1, isPrimary: true }] }
      );
      core.classes = [{ id: canonicalClassId(resolvedFallback), level: 1, isPrimary: true }];
    }
  }

  core.classes = core.classes
    .map((row, idx) => {
      const r = isObj(row) ? row : {};
      const originalId = asString(r.id || r.class_id || r.name);
      const id = canonicalClassId(originalId);
      const level = Math.max(1, Math.min(20, toInt(r.level, 1)));
      const subclassId = asString(r.subclassId || r.subclass_id).trim().toLowerCase();
      const isPrimary = Boolean(r.isPrimary);

      if (originalId && originalId !== id) {
        report.fixes_applied.push({
          code: "normalize-class-id",
          mode: "auto",
          path: `core.classes[${idx}].id`,
          message: "Normalized class id to canonical form.",
          before: originalId,
          after: id
        });
      }

      return { id, level, subclassId, isPrimary };
    })
    .filter((r) => asString(r.id));

  if (core.classes.length > 0 && !core.classes.some((r) => r.isPrimary)) {
    core.classes[0].isPrimary = true;
    report.fixes_applied.push({
      code: "set-primary-class",
      mode: "auto",
      path: "core.classes[0].isPrimary",
      message: "Assigned first class as primary.",
      after: true
    });
  }
}

function canonicalClassId(input) {
  const raw = asString(input).trim().toLowerCase();
  if (!raw) return "";
  const key = raw.replace(/[_\-\s]+/g, " ");

  // Match canonical class names inside legacy/freeform values
  // (e.g. "Fighter (Champion)", "class: wizard", "Rogue 3").
  const known = [
    "artificer",
    "barbarian",
    "bard",
    "cleric",
    "druid",
    "fighter",
    "monk",
    "paladin",
    "ranger",
    "rogue",
    "sorcerer",
    "warlock",
    "wizard"
  ];
  for (const id of known) {
    const boundary = new RegExp(`(^|[^a-z])${id}([^a-z]|$)`);
    if (boundary.test(key)) return id;
  }

  const map = {
    artificer: "artificer",
    barbarian: "barbarian",
    bard: "bard",
    cleric: "cleric",
    druid: "druid",
    fighter: "fighter",
    monk: "monk",
    paladin: "paladin",
    ranger: "ranger",
    rogue: "rogue",
    sorcerer: "sorcerer",
    warlock: "warlock",
    wizard: "wizard"
  };

  if (map[key]) return map[key];
  return key
    .replace(/[^a-z0-9 ]+/g, " ")
    .trim()
    .replace(/\s+/g, "_");
}

function normalizeMeta(character, report) {
  ensureObject(character, "meta", report, "meta");
  const meta = character.meta;
  const schema = asString(meta.schema);
  if (!schema) addBlocked(report, "missing-schema", "meta.schema", "Missing meta.schema.");
  else if (!["dnd-character-pack", "living-codex-character"].includes(schema)) {
    const normalized = schema.includes("living-codex") ? "living-codex-character" : "dnd-character-pack";
    report.fixes_applied.push({
      code: "normalize-schema",
      mode: "auto",
      path: "meta.schema",
      message: "Normalized unsupported schema to a compatible identifier.",
      before: schema,
      after: normalized
    });
    meta.schema = normalized;
  }

  if (!asString(meta.id)) {
    meta.id = crypto.randomUUID();
    report.fixes_applied.push({
      code: "fill-meta-id",
      mode: "auto",
      path: "meta.id",
      message: "Filled missing meta.id.",
      after: meta.id
    });
  }
  if (!asString(meta.name)) {
    meta.name = "Imported Character";
    report.fixes_applied.push({
      code: "fill-meta-name",
      mode: "auto",
      path: "meta.name",
      message: "Filled missing meta.name.",
      after: meta.name
    });
  }
  if (!asString(meta.schema_version)) {
    meta.schema_version = "2.0.0";
    report.fixes_applied.push({
      code: "fill-schema-version",
      mode: "auto",
      path: "meta.schema_version",
      message: "Filled missing meta.schema_version.",
      after: meta.schema_version
    });
  } else if (asString(meta.schema_version) !== "2.0.0") {
    const before = asString(meta.schema_version);
    meta.schema_version = "2.0.0";
    report.fixes_applied.push({
      code: "normalize-schema-version",
      mode: "auto",
      path: "meta.schema_version",
      message: "Normalized schema version to v2 canonical value.",
      before,
      after: meta.schema_version
    });
  }

  if (!asString(meta.ruleset_id)) {
    const inferred = asString(character?.core?.rulesetId) || "dnd5e_2014";
    meta.ruleset_id = inferred;
    report.fixes_applied.push({
      code: "fill-ruleset",
      mode: "auto",
      path: "meta.ruleset_id",
      message: "Filled missing meta.ruleset_id.",
      after: inferred
    });
  } else if (!["dnd5e_2014", "dnd5e_2024"].includes(asString(meta.ruleset_id))) {
    addGuided(
      report,
      "unknown-ruleset",
      "meta.ruleset_id",
      "Unknown ruleset id.",
      { before: meta.ruleset_id, suggested: "dnd5e_2014" }
    );
  }

  if (!asString(meta.modified_utc)) {
    meta.modified_utc = nowIso();
    report.fixes_applied.push({
      code: "fill-modified-utc",
      mode: "auto",
      path: "meta.modified_utc",
      message: "Filled missing modified_utc.",
      after: meta.modified_utc
    });
  }

  if (!asString(meta.created_utc)) {
    meta.created_utc = meta.modified_utc || nowIso();
    report.fixes_applied.push({
      code: "fill-created-utc",
      mode: "auto",
      path: "meta.created_utc",
      message: "Filled missing created_utc.",
      after: meta.created_utc
    });
  }
}

function normalizeRequiredObjects(character, report) {
  ensureObject(character, "abilities", report, "abilities");
  ensureObject(character, "combat", report, "combat");
  ensureObject(character, "identity", report, "identity");
  ensureObject(character, "defenses", report, "defenses");
  ensureObject(character, "currency", report, "currency");
  ensureObject(character, "proficiencies", report, "proficiencies");
  ensureObject(character, "expertise", report, "expertise");
  ensureObject(character, "spell_slots", report, "spell_slots");
  ensureObject(character, "ui", report, "ui");
}

function normalizeListObject(obj, key, report, path) {
  ensureArray(obj, key, report, path);
  obj[key] = obj[key].map((x) => asString(x).trim()).filter(Boolean);
}

function normalizeProficiencies(character, report) {
  const p = character.proficiencies;
  normalizeListObject(p, "skills", report, "proficiencies.skills");
  if (!Array.isArray(p.saves) && Array.isArray(p.saving_throws)) p.saves = p.saving_throws;
  normalizeListObject(p, "saves", report, "proficiencies.saves");
  normalizeListObject(p, "tools", report, "proficiencies.tools");
  normalizeListObject(p, "languages", report, "proficiencies.languages");
  if (!Array.isArray(p.armor) && Array.isArray(p.armour)) p.armor = p.armour;
  normalizeListObject(p, "armor", report, "proficiencies.armor");
  normalizeListObject(p, "weapons", report, "proficiencies.weapons");

  ensureArray(character.expertise, "skills", report, "expertise.skills");
  character.expertise.skills = character.expertise.skills.map((x) => asString(x).trim()).filter(Boolean);
}

function normalizeDefenses(character, report) {
  const d = character.defenses;
  normalizeListObject(d, "immunities", report, "defenses.immunities");
  normalizeListObject(d, "resistances", report, "defenses.resistances");
  normalizeListObject(d, "vulnerabilities", report, "defenses.vulnerabilities");
  normalizeListObject(d, "save_advantages", report, "defenses.save_advantages");
}

function normalizeSpellSlots(character, report) {
  const ss = character.spell_slots;
  ss.auto = typeof ss.auto === "boolean" ? ss.auto : toBool(ss.auto);

  ensureObject(ss, "pact", report, "spell_slots.pact");
  ss.pact.max = Math.max(0, toInt(ss.pact.max, 0));
  ss.pact.used = Math.max(0, toInt(ss.pact.used, 0));
  if (ss.pact.used > ss.pact.max) ss.pact.used = ss.pact.max;
  ss.pact.level = Math.max(1, Math.min(9, toInt(ss.pact.level, 1)));

  ensureObject(ss, "levels", report, "spell_slots.levels");
  for (let i = 1; i <= 9; i++) {
    const key = String(i);
    if (!isObj(ss.levels[key])) ss.levels[key] = { max: 0, used: 0 };
    ss.levels[key].max = Math.max(0, toInt(ss.levels[key].max, 0));
    ss.levels[key].used = Math.max(0, toInt(ss.levels[key].used, 0));
    if (ss.levels[key].used > ss.levels[key].max) ss.levels[key].used = ss.levels[key].max;
  }
}

function normalizeCurrency(character, report) {
  const cur = character.currency;
  for (const key of ["cp", "sp", "ep", "gp", "pp"]) {
    const before = cur[key];
    cur[key] = toInt(cur[key], 0);
    if (before !== cur[key]) {
      report.fixes_applied.push({
        code: "coerce-currency-int",
        mode: "auto",
        path: `currency.${key}`,
        message: "Coerced currency field to integer.",
        before,
        after: cur[key]
      });
    }
  }
}

function normalizeSheetExtensions(character, report) {
  ensureObject(character, "profile", report, "profile");
  ensureObject(character, "resources", report, "resources");
  ensureObject(character, "saving_throws", report, "saving_throws");
  ensureObject(character, "skills", report, "skills");
  ensureObject(character, "spellcasting", report, "spellcasting");
  ensureObject(character, "play_state", report, "play_state");
  ensureArray(character, "attacks", report, "attacks");

  const c = character.combat;
  c.speed = Math.max(0, toInt(c.speed, 30));
  c.inspiration = Math.max(0, Math.min(1, toInt(c.inspiration, 0)));
  c.proficiency_bonus = toInt(c.proficiency_bonus, 2);
  c.passive_perception = Math.max(0, toInt(c.passive_perception, 10));
  c.hit_dice_total = Math.max(0, toInt(c.hit_dice_total, 0));
  c.hit_dice_used = Math.max(0, toInt(c.hit_dice_used, 0));
  ensureObject(c, "death_saves", report, "combat.death_saves");
  ensureObject(c, "concentration", report, "combat.concentration");
  ensureArray(c, "conditions", report, "combat.conditions");
  c.concentration.active = toBool(c.concentration.active);
  c.concentration.source = asString(c.concentration.source || "");
  c.concentration.notes = asString(c.concentration.notes || "");
  const concentrationRounds = toInt(c.concentration.rounds_remaining, NaN);
  c.concentration.rounds_remaining = Number.isFinite(concentrationRounds) && concentrationRounds > 0
    ? concentrationRounds
    : null;
  c.conditions = c.conditions.map((row) => {
    if (typeof row === "string") {
      return { name: row, source: "", duration: "", rounds_remaining: null, notes: "", active: true };
    }
    const x = isObj(row) ? row : {};
    const rounds = toInt(x.rounds_remaining, NaN);
    return {
      name: asString(x.name || "").trim(),
      source: asString(x.source || ""),
      duration: asString(x.duration || ""),
      rounds_remaining: Number.isFinite(rounds) && rounds > 0 ? rounds : null,
      notes: asString(x.notes || ""),
      active: x.active === undefined ? true : toBool(x.active)
    };
  }).filter((x) => x.name);
  c.death_saves.success = Math.max(0, Math.min(3, toInt(c.death_saves.success, 0)));
  c.death_saves.fail = Math.max(0, Math.min(3, toInt(c.death_saves.fail, 0)));

  for (const key of ["cp", "sp", "ep", "gp", "pp"]) {
    character.resources[key] = Math.max(0, toInt(character.resources[key], 0));
  }

  const saveKeys = ["str", "dex", "con", "int", "wis", "cha"];
  for (const key of saveKeys) {
    const row = isObj(character.saving_throws[key]) ? character.saving_throws[key] : {};
    row.proficient = toBool(row.proficient);
    row.bonus = toInt(row.bonus, 0);
    row.manual_total = toInt(row.manual_total, 0);
    row.bonus_mode = asString(row.bonus_mode) === "manual" ? "manual" : "auto";
    character.saving_throws[key] = row;
  }

  for (const [key, rowRaw] of Object.entries(character.skills)) {
    const row = isObj(rowRaw) ? rowRaw : {};
    row.proficient = toBool(row.proficient);
    row.expertise = toBool(row.expertise);
    row.bonus = toInt(row.bonus, 0);
    row.manual_total = toInt(row.manual_total, 0);
    row.bonus_mode = asString(row.bonus_mode) === "manual" ? "manual" : "auto";
    character.skills[key] = row;
  }

  const sc = character.spellcasting;
  sc.class_id = asString(sc.class_id).trim().toLowerCase();
  sc.ability = asString(sc.ability).trim().toLowerCase();
  if (!["str", "dex", "con", "int", "wis", "cha", ""].includes(sc.ability)) sc.ability = "";
  sc.save_dc_mode = asString(sc.save_dc_mode) === "manual" ? "manual" : "auto";
  sc.attack_bonus_mode = asString(sc.attack_bonus_mode) === "manual" ? "manual" : "auto";
  sc.save_dc_override = toInt(sc.save_dc_override, 0);
  sc.attack_bonus_override = toInt(sc.attack_bonus_override, 0);

  ensureArray(character.play_state, "active_effects", report, "play_state.active_effects");
  ensureArray(character.play_state, "recent_actions", report, "play_state.recent_actions");
  character.play_state.session_notes = asString(character.play_state.session_notes || "");
  character.play_state.active_effects = character.play_state.active_effects.map((row, idx) => {
    const r = isObj(row) ? row : {};
    const rounds = toInt(r.rounds_remaining, NaN);
    const applicationMode = asString(r.application_mode).toLowerCase();
    const advantageState = asString(r.advantage_state).toLowerCase();
    return {
      id: asString(r.id || crypto.randomUUID()),
      label: asString(r.label || `Effect ${idx + 1}`),
      source: asString(r.source || ""),
      source_type: asString(r.source_type || "custom_effect"),
      source_id: asString(r.source_id || ""),
      effect_type: asString(r.effect_type || r.category || "custom"),
      category: asString(r.category || r.effect_type || "custom"),
      active: r.active === undefined ? true : toBool(r.active),
      scope: asString(r.scope || "all_attacks"),
      timing: asString(r.timing) === "per_attack" ? "per_attack" : "persistent",
      application_mode: ["auto", "suggested", "manual"].includes(applicationMode) ? applicationMode : "manual",
      rounds_remaining: Number.isFinite(rounds) && rounds > 0 ? rounds : null,
      attack_roll_bonus: toInt(r.attack_roll_bonus, 0),
      attack_roll_dice: asString(r.attack_roll_dice || ""),
      advantage_state: ["advantage", "disadvantage", "none"].includes(advantageState) ? advantageState : "none",
      damage_bonus: toInt(r.damage_bonus, 0),
      damage_dice: asString(r.damage_dice || ""),
      damage_type_add: asString(r.damage_type_add || ""),
      damage_type_replace: asString(r.damage_type_replace || ""),
      crit_extra_dice: asString(r.crit_extra_dice || ""),
      resource_cost: isObj(r.resource_cost) ? structuredClone(r.resource_cost) : null,
      notes: asString(r.notes || "")
    };
  });

  character.attacks = character.attacks.map((row, idx) => {
    const r = isObj(row) ? row : {};
    const legacyAtkBonus = r.atk_bonus ?? r.attack_bonus ?? 0;
    const kind = asString(r.kind || (r.range_short || r.range_long ? "ranged_weapon" : "melee_weapon")).toLowerCase() || "custom";
    const attackAbility = asString(r.attack_ability || "auto").toLowerCase();
    const atkMode = asString(r.atk_bonus_mode || (r.attack_bonus_mode || "auto")).toLowerCase();
    const damageMode = asString(r.damage_mode || "manual").toLowerCase();
    const rangeShort = Math.max(0, toInt(r.range_short, 0));
    const rangeLong = Math.max(0, toInt(r.range_long, 0));
    const reach = Math.max(0, toInt(r.reach, 0));
    const rangeText = asString(r.range || "");
    const properties = Array.isArray(r.properties)
      ? r.properties.map((x) => asString(x).trim()).filter(Boolean)
      : asString(r.properties || "").split(",").map((x) => x.trim()).filter(Boolean);
    const tags = Array.isArray(r.tags)
      ? r.tags.map((x) => asString(x).trim()).filter(Boolean)
      : asString(r.tags || "").split(",").map((x) => x.trim()).filter(Boolean);
    return {
      id: asString(r.id || crypto.randomUUID()),
      catalog_id: asString(r.catalog_id || r.weapon_id || ""),
      name: asString(r.name || `Attack ${idx + 1}`),
      kind: kind || "custom",
      attack_ability: ["auto", "str", "dex", "spell", "custom"].includes(attackAbility) ? attackAbility : "auto",
      proficient: r.proficient === undefined ? true : toBool(r.proficient),
      magic_bonus: toInt(r.magic_bonus, 0),
      atk_bonus_mode: atkMode === "manual" ? "manual" : "auto",
      atk_bonus_override: toInt(r.atk_bonus_override ?? legacyAtkBonus, 0),
      atk_bonus: toInt(legacyAtkBonus, 0),
      damage_mode: damageMode === "auto" ? "auto" : "manual",
      damage: asString(r.damage || r.damage_base || ""),
      damage_type: asString(r.damage_type || ""),
      versatile_damage: asString(r.versatile_damage || ""),
      range: rangeText,
      range_short: rangeShort,
      range_long: rangeLong,
      reach,
      properties,
      notes: asString(r.notes || ""),
      tags
    };
  });
}

/**
 * Validate and normalize imported character payload.
 * Returns normalized payload + fix report.
 */
export function validateAndFixImportPayload(character) {
  const report = {
    ok: false,
    errors: [],
    warnings: [],
    fixes_applied: [],
    fixes_available: [],
    blocked: []
  };

  if (!isObj(character)) {
    addBlocked(report, "root-not-object", "$", "Import payload root must be an object.");
    return { ok: false, character: null, report };
  }

  const out = structuredClone(character);
  normalizeMeta(out, report);
  normalizeRequiredObjects(out, report);
  normalizeAliasFields(out, report);
  normalizeCore(out, report);
  normalizeProficiencies(out, report);
  normalizeDefenses(out, report);
  normalizeSpellSlots(out, report);
  clampAbilityScores(out, report);
  normalizeCurrency(out, report);
  normalizeSheetExtensions(out, report);
  normalizeTrackers(out, report);
  normalizeSpells(out, report);
  ensureArray(out, "inventory", report, "inventory");
  ensureArray(out, "log", report, "log");

  if (report.blocked.length > 0) {
    report.ok = false;
    report.errors = report.blocked.map((b) => b.message);
    return { ok: false, character: out, report };
  }

  if (report.fixes_available.length > 0) {
    addWarning(
      report,
      "guided-fixes-available",
      "$",
      "Guided fixes are available for some fields."
    );
  }

  report.ok = true;
  return { ok: true, character: out, report };
}
