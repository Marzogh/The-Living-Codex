import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { createDefaultCharacterV2 } from "../js/v2/core/default-character.js";
import { featureToAttackModifier, normalizeCharacterFeature, resolveCharacterFeatures } from "../js/v2/core/features.js";
import { validateAndFixImportPayload } from "../js/v2/io/validate.js";

const templates = JSON.parse(readFileSync(new URL("../data/dnd5e_2014/features.min.json", import.meta.url), "utf8"));

function characterWithClass(classId, level) {
  const character = createDefaultCharacterV2({ name: "Feature Test", classId });
  character.core.classes[0].level = level;
  return character;
}

test("rogue Sneak Attack is book-scaled and limited to eligible attacks by default", () => {
  const character = characterWithClass("rogue", 5);
  const finesse = { kind: "melee_weapon", abilityKey: "dex", properties: ["finesse"], tags: [] };
  const heavy = { kind: "melee_weapon", abilityKey: "str", properties: ["heavy"], tags: [] };
  const sneak = resolveCharacterFeatures(character, templates, finesse).find((row) => row.template_id === "sneak_attack");
  assert.equal(sneak.damage_dice, "3d6");
  assert.equal(resolveCharacterFeatures(character, templates, heavy).some((row) => row.template_id === "sneak_attack"), false);
});

test("DM Override can apply an edited feature outside template requirements", () => {
  const character = characterWithClass("rogue", 5);
  character.features = [normalizeCharacterFeature({ template_id: "sneak_attack", name: "Sneak Attack", enabled: true, dm_override: true, scope: "weapon_attacks", application_mode: "manual", damage_dice: "3d6" })];
  const heavy = { kind: "melee_weapon", abilityKey: "str", properties: ["heavy"], tags: [] };
  assert.equal(resolveCharacterFeatures(character, templates, heavy)[0].damage_dice, "3d6");
});

test("barbarian Rage Damage scales and Reckless Attack becomes available at level 2", () => {
  const character = characterWithClass("barbarian", 9);
  const attack = { kind: "melee_weapon", abilityKey: "str", properties: [], tags: [] };
  const rows = resolveCharacterFeatures(character, templates, attack);
  assert.equal(rows.find((row) => row.template_id === "rage_damage").damage_bonus, 3);
  assert.equal(rows.find((row) => row.template_id === "reckless_attack").advantage_state, "advantage");
});

test("automatic and optional features map into the shared attack modifier format", () => {
  const character = characterWithClass("paladin", 11);
  const attack = { kind: "melee_weapon", abilityKey: "str", properties: [], tags: [] };
  const rows = resolveCharacterFeatures(character, templates, attack).map(featureToAttackModifier);
  assert.equal(rows.find((row) => row.source_id === "divine_smite").application_mode, "manual");
  assert.equal(rows.find((row) => row.source_id === "improved_divine_smite").damage_dice, "1d8");
});

test("feature arrays remain backward compatible through import normalization", () => {
  const legacy = createDefaultCharacterV2({ name: "Legacy" });
  delete legacy.features;
  const result = validateAndFixImportPayload(legacy);
  assert.equal(result.ok, true);
  assert.deepEqual(result.character.features, []);
});
