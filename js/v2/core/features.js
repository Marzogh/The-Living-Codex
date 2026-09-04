function text(value) { return (value ?? "").toString(); }
function norm(value) { return text(value).trim().toLowerCase(); }
function int(value, fallback = 0) { const n = Number.parseInt(value, 10); return Number.isFinite(n) ? n : fallback; }
function list(value) { return Array.isArray(value) ? value.map((row) => text(row).trim()).filter(Boolean) : []; }

export function characterClassLevel(character, classId) {
  const wanted = norm(classId);
  return (Array.isArray(character?.core?.classes) ? character.core.classes : [])
    .filter((row) => norm(row?.id) === wanted)
    .reduce((sum, row) => sum + Math.max(0, int(row?.level, 0)), 0);
}

export function normalizeCharacterFeature(row = {}, index = 0) {
  const requirements = row?.requirements && typeof row.requirements === "object" ? row.requirements : {};
  const usage = row?.usage && typeof row.usage === "object" ? row.usage : {};
  const resource = row?.resource && typeof row.resource === "object" ? row.resource : null;
  return {
    id: text(row.id || crypto.randomUUID()),
    template_id: text(row.template_id || ""),
    name: text(row.name || `Feature ${index + 1}`),
    source: text(row.source || "Custom"),
    class_id: norm(row.class_id),
    min_level: Math.max(0, int(row.min_level, 0)),
    enabled: row.enabled !== false,
    dm_override: Boolean(row.dm_override),
    auto_grant: Boolean(row.auto_grant),
    auto_attack_tag: norm(row.auto_attack_tag),
    scope: norm(row.scope || "all_attacks") || "all_attacks",
    application_mode: ["auto", "suggested", "manual"].includes(norm(row.application_mode)) ? norm(row.application_mode) : "manual",
    requirements: {
      ability: norm(requirements.ability),
      kinds: list(requirements.kinds),
      properties_any: list(requirements.properties_any),
      tags_any: list(requirements.tags_any),
      any: Array.isArray(requirements.any) ? requirements.any.map((entry) => ({ kind: norm(entry?.kind), property: norm(entry?.property), tag: norm(entry?.tag) })) : []
    },
    attack_roll_bonus: int(row.attack_roll_bonus, 0),
    attack_roll_dice: text(row.attack_roll_dice),
    advantage_state: ["advantage", "disadvantage", "none"].includes(norm(row.advantage_state)) ? norm(row.advantage_state) : "none",
    damage_bonus: int(row.damage_bonus, 0),
    damage_dice: text(row.damage_dice),
    damage_type_add: text(row.damage_type_add),
    damage_type_replace: text(row.damage_type_replace),
    crit_extra_dice: text(row.crit_extra_dice),
    scaling: Array.isArray(row.scaling) ? row.scaling.map((entry) => ({
      min_level: Math.max(0, int(entry?.min_level, 0)),
      attack_roll_bonus: entry?.attack_roll_bonus == null ? null : int(entry.attack_roll_bonus, 0),
      damage_bonus: entry?.damage_bonus == null ? null : int(entry.damage_bonus, 0),
      attack_roll_dice: entry?.attack_roll_dice == null ? null : text(entry.attack_roll_dice),
      damage_dice: entry?.damage_dice == null ? null : text(entry.damage_dice),
      crit_extra_dice: entry?.crit_extra_dice == null ? null : text(entry.crit_extra_dice)
    })).sort((a, b) => a.min_level - b.min_level) : [],
    usage: { frequency: norm(usage.frequency), used: Boolean(usage.used) },
    resource: resource ? { type: norm(resource.type), label: text(resource.label), cost: Math.max(0, int(resource.cost, 0)) } : null,
    notes: text(row.notes)
  };
}

export function createFeatureFromTemplate(template = {}) {
  return normalizeCharacterFeature({ ...structuredClone(template), id: crypto.randomUUID(), template_id: template.id || "", auto_grant: false });
}

export function normalizeCharacterFeatures(value) {
  return (Array.isArray(value) ? value : []).filter((row) => row && typeof row === "object").map(normalizeCharacterFeature);
}

function matchesScope(feature, attack) {
  if (feature.scope === "all_attacks") return true;
  if (feature.scope === "weapon_attacks") return ["melee_weapon", "ranged_weapon", "natural_weapon"].includes(norm(attack.kind));
  if (feature.scope === "spell_attacks") return norm(attack.kind) === "spell_attack";
  return feature.scope === norm(attack.kind);
}

function matchesRequirements(feature, attack) {
  if (feature.dm_override) return true;
  const req = feature.requirements || {};
  const properties = list(attack.properties).map(norm);
  const tags = list(attack.tags).map(norm);
  if (req.ability && req.ability !== norm(attack.abilityKey || attack.attack_ability)) return false;
  if (req.kinds?.length && !req.kinds.map(norm).includes(norm(attack.kind))) return false;
  if (req.properties_any?.length && !req.properties_any.map(norm).some((value) => properties.includes(value))) return false;
  if (req.tags_any?.length && !req.tags_any.map(norm).some((value) => tags.includes(value))) return false;
  if (req.any?.length && !req.any.some((entry) => (!entry.kind || entry.kind === norm(attack.kind)) && (!entry.property || properties.includes(entry.property)) && (!entry.tag || tags.includes(entry.tag)))) return false;
  return true;
}

function applyScaling(feature, character) {
  const level = feature.class_id ? characterClassLevel(character, feature.class_id) : 0;
  const eligible = feature.scaling.filter((entry) => level >= entry.min_level);
  const row = eligible[eligible.length - 1];
  if (!row) return feature;
  const merged = { ...feature };
  for (const key of ["attack_roll_bonus", "damage_bonus", "attack_roll_dice", "damage_dice", "crit_extra_dice"]) {
    if (row[key] != null) merged[key] = row[key];
  }
  return merged;
}

export function resolveCharacterFeatures(character, templates = [], attack = null, { includeDisabled = false } = {}) {
  const stored = normalizeCharacterFeatures(character?.features);
  const byTemplate = new Map(stored.filter((row) => row.template_id).map((row) => [row.template_id, row]));
  const templateById = new Map((Array.isArray(templates) ? templates : []).map((row) => [text(row?.id), row]));
  const resolved = [];
  for (const rawTemplate of Array.isArray(templates) ? templates : []) {
    const template = normalizeCharacterFeature({ ...rawTemplate, id: `rules:${rawTemplate.id}`, template_id: rawTemplate.id });
    const level = template.class_id ? characterClassLevel(character, template.class_id) : 0;
    const tagged = Boolean(attack && template.auto_attack_tag && list(attack.tags).map(norm).includes(template.auto_attack_tag));
    if (!(tagged || (template.auto_grant && level >= template.min_level))) continue;
    const override = byTemplate.get(template.template_id);
    const merged = override ? { ...template, ...override, requirements: override.requirements, scaling: override.scaling.length ? override.scaling : template.scaling } : template;
    resolved.push(override?.dm_override ? merged : applyScaling(merged, character));
  }
  for (const row of stored) {
    if (row.template_id && resolved.some((entry) => entry.template_id === row.template_id)) continue;
    const sourceTemplate = row.template_id ? templateById.get(row.template_id) : null;
    if (sourceTemplate?.auto_grant && !row.dm_override && characterClassLevel(character, sourceTemplate.class_id) < int(sourceTemplate.min_level, 0)) continue;
    resolved.push(applyScaling(row, character));
  }
  return resolved.filter((feature) => (includeDisabled || feature.enabled) && (!attack || (matchesScope(feature, attack) && matchesRequirements(feature, attack))));
}

export function featureToAttackModifier(feature) {
  return {
    id: `feature:${feature.id}`,
    label: feature.damage_dice && !feature.name.includes(feature.damage_dice) ? `${feature.name} (${feature.damage_dice})` : feature.name,
    source_type: "character_feature",
    source_id: feature.template_id || feature.id,
    scope: feature.scope,
    timing: feature.usage?.frequency || "persistent",
    application_mode: feature.application_mode,
    attack_roll_bonus: feature.attack_roll_bonus,
    attack_roll_dice: feature.attack_roll_dice,
    advantage_state: feature.advantage_state,
    damage_bonus: feature.damage_bonus,
    damage_dice: feature.damage_dice,
    damage_type_add: feature.damage_type_add,
    damage_type_replace: feature.damage_type_replace,
    crit_extra_dice: feature.crit_extra_dice,
    resource_cost: feature.resource,
    notes: feature.notes
  };
}
