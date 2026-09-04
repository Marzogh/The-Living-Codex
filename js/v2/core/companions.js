const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"];
const MOVEMENT = ["walk", "fly", "swim", "climb", "burrow"];

const text = (value) => (value ?? "").toString();
const integer = (value, fallback = 0) => {
  const parsed = Number.parseInt(text(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const nonNegative = (value, fallback = 0) => Math.max(0, integer(value, fallback));
const object = (value) => value && typeof value === "object" && !Array.isArray(value) ? value : {};
const array = (value) => Array.isArray(value) ? value : [];
const id = (value) => text(value).trim() || crypto.randomUUID();

function normalizeNamedRows(rows, fallbackLabel) {
  return array(rows).map((raw, index) => {
    const row = object(raw);
    return {
      id: id(row.id),
      name: text(row.name || `${fallbackLabel} ${index + 1}`),
      description: text(row.description || row.notes || "")
    };
  });
}

function normalizeAttacks(rows) {
  return array(rows).map((raw, index) => {
    const row = object(raw);
    return {
      id: id(row.id),
      name: text(row.name || `Attack ${index + 1}`),
      kind: text(row.kind || "natural_weapon"),
      atk_bonus_mode: "manual",
      atk_bonus_override: integer(row.atk_bonus_override ?? row.atk_bonus, 0),
      damage_mode: "manual",
      damage: text(row.damage || ""),
      damage_type: text(row.damage_type || ""),
      range: text(row.range || ""),
      reach: nonNegative(row.reach, 5),
      properties: array(row.properties).map(text).filter(Boolean),
      tags: array(row.tags).map(text).filter(Boolean),
      notes: text(row.notes || "")
    };
  });
}

function normalizeEffects(rows) {
  return array(rows).map((raw, index) => {
    const row = object(raw);
    const pending = row.pending === true || text(row.status).toLowerCase() === "pending";
    return {
      id: id(row.id),
      label: text(row.label || `Effect ${index + 1}`),
      source: text(row.source || ""),
      source_type: text(row.source_type || "custom_effect"),
      source_id: text(row.source_id || ""),
      active: pending ? false : row.active !== false,
      pending,
      scope: text(row.scope || "all_attacks"),
      application_mode: ["auto", "suggested", "manual"].includes(text(row.application_mode).toLowerCase())
        ? text(row.application_mode).toLowerCase()
        : "manual",
      attack_roll_bonus: integer(row.attack_roll_bonus, 0),
      attack_roll_dice: text(row.attack_roll_dice || ""),
      advantage_state: ["advantage", "disadvantage", "none"].includes(text(row.advantage_state).toLowerCase())
        ? text(row.advantage_state).toLowerCase()
        : "none",
      damage_bonus: integer(row.damage_bonus, 0),
      damage_dice: text(row.damage_dice || ""),
      damage_type_add: text(row.damage_type_add || ""),
      notes: text(row.notes || "")
    };
  });
}

export function createCompanion(overrides = {}) {
  return normalizeCompanion({
    id: crypto.randomUUID(),
    name: "New Companion",
    role: "companion",
    lifecycle: "persistent",
    status: "active",
    dm_override: true,
    ...overrides
  });
}

export function createCompanionFromTemplate(template, context = {}, overrides = {}) {
  const source = object(template);
  const block = structuredClone(object(source.stat_block));
  const scaling = object(source.scaling);
  const proficiencyBonus = Math.max(0, integer(context.proficiencyBonus, block.proficiency_bonus || 2));
  const rangerLevel = Math.max(1, integer(context.rangerLevel, integer(context.characterLevel, 1)));
  const spellLevel = Math.max(integer(scaling.level_min, 1), integer(context.spellLevel, scaling.level_min || 1));
  const spellAttackBonus = integer(context.spellAttackBonus, block.attacks?.[0]?.atk_bonus_override || 0);

  if (scaling.type === "ranger") {
    block.ac = integer(scaling.ac_base, 13) + proficiencyBonus;
    block.proficiency_bonus = proficiencyBonus;
    const hp = integer(scaling.hp_base, 0) + integer(scaling.hp_per_level, 0) * rangerLevel;
    block.hp = { max: hp, current: hp, temp: 0 };
  }
  if (scaling.type === "spell_slot") {
    block.ac = integer(scaling.ac_base, 11) + spellLevel;
    block.proficiency_bonus = proficiencyBonus;
    const hp = integer(scaling.hp_base, 1) + integer(scaling.hp_per_level_above_min, 0)
      * (spellLevel - integer(scaling.level_min, spellLevel));
    block.hp = { max: hp, current: hp, temp: 0 };
  }
  if (block.attacks?.[0] && scaling.attack_uses_spell_modifier) {
    block.attacks[0].atk_bonus_override = spellAttackBonus;
    const add = integer(scaling.damage_flat, 0)
      + (scaling.damage_adds_proficiency ? proficiencyBonus : 0)
      + (scaling.damage_adds_spell_level ? spellLevel : 0);
    block.attacks[0].damage = `${text(scaling.damage_die || "").trim()}${add >= 0 ? "+" : ""}${add}`;
  }

  return createCompanion({
    ...block,
    ...overrides,
    template_id: text(source.id),
    template_source: text(source.source_ref || source.source),
    template_kind: text(source.template_kind),
    template_level: scaling.type === "spell_slot" ? spellLevel : null,
    dm_override: overrides.dm_override === true
  });
}

export function normalizeCompanion(raw = {}) {
  const row = object(raw);
  const hp = object(row.hp);
  const maxHp = nonNegative(hp.max, 1);
  const abilities = object(row.abilities);
  const movement = object(row.movement);
  const saves = object(row.saves || row.saving_throws);
  const defenses = object(row.defenses);
  const replacement = object(row.replacement);
  const now = new Date().toISOString();
  const lifecycle = text(row.lifecycle).toLowerCase() === "temporary" ? "temporary" : "persistent";
  const statusValue = text(row.status).toLowerCase();
  const status = ["active", "inactive", "archived"].includes(statusValue) ? statusValue : "active";
  const abilityRows = {};
  const saveRows = {};
  ABILITIES.forEach((key) => {
    abilityRows[key] = Math.max(1, integer(abilities[key], 10));
    const value = saves[key];
    saveRows[key] = value === null || value === undefined || value === "" ? null : integer(value, 0);
  });
  const movementRows = {};
  MOVEMENT.forEach((key) => { movementRows[key] = nonNegative(movement[key], key === "walk" ? 30 : 0); });
  movementRows.notes = text(movement.notes || "");

  return {
    id: id(row.id),
    name: text(row.name || "New Companion"),
    template_id: text(row.template_id || ""),
    template_source: text(row.template_source || ""),
    template_kind: text(row.template_kind || ""),
    template_level: row.template_level === null || row.template_level === undefined || row.template_level === ""
      ? null
      : nonNegative(row.template_level, 0),
    dm_override: row.dm_override === true || !text(row.template_id).trim(),
    role: text(row.role || "companion"),
    source: text(row.source || ""),
    creature_type: text(row.creature_type || ""),
    size: text(row.size || ""),
    alignment: text(row.alignment || ""),
    lifecycle,
    status,
    duration: text(row.duration || ""),
    rounds_remaining: row.rounds_remaining === null || row.rounds_remaining === undefined || row.rounds_remaining === ""
      ? null
      : nonNegative(row.rounds_remaining, 0),
    created_utc: text(row.created_utc || now),
    modified_utc: text(row.modified_utc || now),
    replaces_id: text(row.replaces_id || ""),
    replacement: {
      occurred_utc: text(replacement.occurred_utc || ""),
      cost: text(replacement.cost || ""),
      notes: text(replacement.notes || "")
    },
    ac: nonNegative(row.ac, 10),
    initiative_bonus: integer(row.initiative_bonus, 0),
    proficiency_bonus: integer(row.proficiency_bonus, 0),
    challenge_rating: text(row.challenge_rating || ""),
    hit_dice: text(row.hit_dice || ""),
    hp: {
      max: maxHp,
      current: Math.min(maxHp, nonNegative(hp.current, maxHp)),
      temp: nonNegative(hp.temp, 0)
    },
    abilities: abilityRows,
    movement: movementRows,
    saves: saveRows,
    skills: array(row.skills).map((rawSkill, index) => {
      const skill = object(rawSkill);
      return { id: id(skill.id), name: text(skill.name || `Skill ${index + 1}`), bonus: integer(skill.bonus, 0) };
    }),
    senses: text(row.senses || ""),
    languages: text(row.languages || ""),
    defenses: {
      vulnerabilities: array(defenses.vulnerabilities).map(text).filter(Boolean),
      resistances: array(defenses.resistances).map(text).filter(Boolean),
      immunities: array(defenses.immunities).map(text).filter(Boolean),
      condition_immunities: array(defenses.condition_immunities).map(text).filter(Boolean)
    },
    attacks: normalizeAttacks(row.attacks),
    actions: normalizeNamedRows(row.actions, "Action"),
    bonus_actions: normalizeNamedRows(row.bonus_actions, "Bonus Action"),
    reactions: normalizeNamedRows(row.reactions, "Reaction"),
    traits: normalizeNamedRows(row.traits, "Trait"),
    equipment: array(row.equipment).map((rawItem, index) => {
      const item = object(rawItem);
      return {
        id: id(item.id),
        name: text(item.name || `Item ${index + 1}`),
        quantity: nonNegative(item.quantity, 1),
        equipped: item.equipped !== false,
        notes: text(item.notes || "")
      };
    }),
    effects: normalizeEffects(row.effects),
    notes: text(row.notes || "")
  };
}

export function normalizeCompanions(value) {
  return array(value).map(normalizeCompanion);
}

export function activeCompanionEffects(companion) {
  return array(companion?.effects).filter((row) => row && row.active !== false && row.pending !== true);
}

export function archiveCompanion(companions, companionId) {
  return normalizeCompanions(companions).map((row) => row.id === companionId
    ? { ...row, status: "archived", modified_utc: new Date().toISOString() }
    : row);
}

export function restoreCompanion(companions, companionId) {
  return normalizeCompanions(companions).map((row) => row.id === companionId
    ? { ...row, status: "inactive", modified_utc: new Date().toISOString() }
    : row);
}

export function replaceCompanion(companions, companionId, replacement = {}) {
  const rows = normalizeCompanions(companions);
  const previous = rows.find((row) => row.id === companionId);
  if (!previous) return { companions: rows, replacement: null };
  const occurredUtc = new Date().toISOString();
  const next = createCompanion({
    role: previous.role,
    lifecycle: previous.lifecycle,
    replaces_id: previous.id,
    replacement: {
      occurred_utc: occurredUtc,
      cost: text(replacement.cost || ""),
      notes: text(replacement.notes || "")
    }
  });
  return {
    companions: rows.map((row) => row.id === companionId
      ? { ...row, status: "archived", modified_utc: occurredUtc }
      : row).concat(next),
    replacement: next
  };
}
