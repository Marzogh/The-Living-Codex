import test from "node:test";
import assert from "node:assert/strict";

import { createDefaultCharacterV2 } from "../js/v2/core/default-character.js";
import { activeCompanionEffects, archiveCompanion, createCompanion, createCompanionFromTemplate, normalizeCompanion, replaceCompanion, restoreCompanion } from "../js/v2/core/companions.js";
import { validateAndFixImportPayload } from "../js/v2/io/validate.js";

test("new and legacy characters have an empty companions collection", () => {
  assert.deepEqual(createDefaultCharacterV2().companions, []);
  const legacy = createDefaultCharacterV2();
  delete legacy.companions;
  const result = validateAndFixImportPayload(legacy);
  assert.equal(result.ok, true);
  assert.deepEqual(result.character.companions, []);
});

test("normalization produces a complete bounded stat block", () => {
  const row = normalizeCompanion({
    name: "Test Creature",
    hp: { max: 12, current: 99, temp: -4 },
    movement: { walk: -10, fly: 40 },
    abilities: { str: 7 },
    saves: { dex: "+3" },
    skills: [{ name: "Awareness", bonus: "4" }],
    attacks: [{ name: "Strike", atk_bonus: "+5", damage: "1d6+2" }],
    effects: [{ label: "Undecided", status: "pending", damage_bonus: 4 }]
  });
  assert.equal(row.hp.current, 12);
  assert.equal(row.hp.temp, 0);
  assert.equal(row.movement.walk, 0);
  assert.equal(row.movement.fly, 40);
  assert.equal(row.abilities.str, 7);
  assert.equal(row.abilities.dex, 10);
  assert.equal(row.saves.dex, 3);
  assert.equal(row.attacks[0].atk_bonus_override, 5);
  assert.equal(row.effects[0].pending, true);
  assert.equal(row.effects[0].active, false);
});

test("archive, restore, and replacement preserve unrelated records", () => {
  const first = createCompanion({ name: "Test A", role: "familiar" });
  const second = createCompanion({ name: "Test B" });
  const archived = archiveCompanion([first, second], first.id);
  assert.equal(archived.find((row) => row.id === first.id).status, "archived");
  assert.equal(archived.find((row) => row.id === second.id).status, "active");
  const restored = restoreCompanion(archived, first.id);
  assert.equal(restored.find((row) => row.id === first.id).status, "inactive");

  const result = replaceCompanion(restored, first.id, { cost: "A fee", notes: "Approved change" });
  assert.equal(result.companions.length, 3);
  assert.equal(result.companions.find((row) => row.id === first.id).status, "archived");
  assert.equal(result.replacement.replaces_id, first.id);
  assert.equal(result.replacement.role, "familiar");
  assert.equal(result.replacement.replacement.cost, "A fee");
  assert.equal(result.replacement.replacement.notes, "Approved change");
  assert.equal(result.companions.find((row) => row.id === second.id).name, "Test B");
});

test("multiple active companions survive JSON and import normalization", () => {
  const character = createDefaultCharacterV2();
  character.companions = [createCompanion({ name: "Test A" }), createCompanion({ name: "Test B", lifecycle: "temporary" })];
  const result = validateAndFixImportPayload(JSON.parse(JSON.stringify(character)));
  assert.equal(result.ok, true);
  assert.equal(result.character.companions.filter((row) => row.status === "active").length, 2);
});

test("only enabled, decided companion effects are eligible for its attacks", () => {
  const companion = createCompanion({ effects: [
    { label: "Enabled", active: true, damage_bonus: 2 },
    { label: "Disabled", active: false, damage_bonus: 3 },
    { label: "Pending", pending: true, damage_bonus: 4 }
  ] });
  assert.deepEqual(activeCompanionEffects(companion).map((row) => row.label), ["Enabled"]);
});

test("rules templates populate and scale without preventing a DM override", () => {
  const template = {
    id: "test-scaled-template",
    source: "Test Rules",
    source_ref: "Test Rules: Companion",
    template_kind: "primal_companion",
    scaling: {
      type: "ranger", ac_base: 13, hp_base: 5, hp_per_level: 5,
      damage_die: "1d8", damage_flat: 2, damage_adds_proficiency: true,
      attack_uses_spell_modifier: true
    },
    stat_block: {
      name: "Rules Creature",
      hp: { max: 1, current: 1 },
      attacks: [{ name: "Strike", damage: "1d8+4" }]
    }
  };
  const locked = createCompanionFromTemplate(template, {
    rangerLevel: 7, proficiencyBonus: 3, spellAttackBonus: 6
  });
  assert.equal(locked.template_id, template.id);
  assert.equal(locked.dm_override, false);
  assert.equal(locked.ac, 16);
  assert.deepEqual(locked.hp, { max: 40, current: 40, temp: 0 });
  assert.equal(locked.attacks[0].atk_bonus_override, 6);
  assert.equal(locked.attacks[0].damage, "1d8+5");

  const editable = createCompanionFromTemplate(template, {}, { dm_override: true });
  assert.equal(editable.dm_override, true);
});
