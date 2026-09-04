import test from "node:test";
import assert from "node:assert/strict";

import {
  attackUsesAmmunition,
  compatibleAmmunitionItems,
  consumeLinkedAmmunition,
  inferInventoryAmmunitionType,
  inferWeaponAmmunitionType,
  normalizeAmmunitionLinks
} from "../js/v2/core/ammunition.js";
import { createDefaultCharacterV2 } from "../js/v2/core/default-character.js";
import { validateAndFixImportPayload } from "../js/v2/io/validate.js";

test("recognizes common weapon and inventory ammunition types", () => {
  assert.equal(inferWeaponAmmunitionType({ name: "Longbow" }), "arrow");
  assert.equal(inferWeaponAmmunitionType({ name: "Heavy Crossbow" }), "bolt");
  assert.equal(inferWeaponAmmunitionType({ name: "Field Cannon" }), "cannonball");
  assert.equal(inferInventoryAmmunitionType({ name: "Silvered Arrows" }), "arrow");
  assert.equal(inferInventoryAmmunitionType({ name: "Steel Bolts" }), "bolt");
  assert.equal(inferInventoryAmmunitionType({ name: "Cannonballs" }), "cannonball");
});

test("filters inventory choices while permitting explicit custom ammunition", () => {
  const inventory = [
    { id: "arrows", name: "Arrows", qty: 20, item_type: "ammunition" },
    { id: "bolts", name: "Bolts", qty: 10 },
    { id: "odd", name: "Moon shards", qty: 3, item_type: "ammunition", ammunition_type: "custom" },
    { id: "rope", name: "Rope", qty: 1 },
    { id: "display", name: "Display Arrow", qty: 1, item_type: "item" }
  ];
  const bow = { name: "Shortbow", properties: ["ammunition"] };
  assert.equal(attackUsesAmmunition(bow), true);
  assert.deepEqual(compatibleAmmunitionItems(bow, inventory).map((row) => row.id), ["arrows", "odd"]);
});

test("an arbitrary named item can be explicitly classified as crossbow ammunition", () => {
  const crossbow = { name: "Light Crossbow", properties: ["ammunition"] };
  const silvered = { id: "silvered", name: "Silvered Bolts", qty: 6, item_type: "ammunition", ammunition_type: "bolt" };
  assert.deepEqual(compatibleAmmunitionItems(crossbow, [silvered]).map((row) => row.id), ["silvered"]);
});

test("normalizes repeatable links and consumes only the selected stack", () => {
  assert.deepEqual(normalizeAmmunitionLinks(["a", "a", "", null, "b"]), ["a", "b"]);
  const attack = { ammunition_links: ["a", "b"], selected_ammunition_id: "b" };
  const result = consumeLinkedAmmunition([{ id: "a", name: "Arrows", qty: 4 }, { id: "b", name: "Special Arrows", qty: 2 }], attack);
  assert.equal(result.ok, true);
  assert.equal(result.consumed, true);
  assert.equal(result.inventory[0].qty, 4);
  assert.equal(result.inventory[1].qty, 1);
});

test("tracks unlimited status independently for each linked ammunition stack", () => {
  const inventory = [
    { id: "ordinary", name: "Bolts", qty: 0, unlimited_ammunition: true },
    { id: "special", name: "Silvered Bolts", qty: 2, unlimited_ammunition: false }
  ];
  const attack = { ammunition_links: ["ordinary", "special"] };
  const unlimited = consumeLinkedAmmunition(inventory, attack, "ordinary");
  assert.equal(unlimited.ok, true);
  assert.equal(unlimited.consumed, false);
  assert.equal(unlimited.inventory[0].qty, 0);
  const finite = consumeLinkedAmmunition(inventory, attack, "special");
  assert.equal(finite.consumed, true);
  assert.equal(finite.inventory[1].qty, 1);
  assert.equal(consumeLinkedAmmunition([{ ...inventory[1], qty: 0 }], { ammunition_links: ["special"] }, "special").ok, false);
});

test("legacy imports receive backward-compatible ammunition defaults", () => {
  const character = createDefaultCharacterV2({ name: "Generic Archer" });
  character.inventory = [{ id: "ammo", name: "Arrows", qty: "12" }];
  character.attacks = [{ id: "bow", name: "Longbow", properties: ["ammunition"] }];
  const result = validateAndFixImportPayload(character);
  assert.equal(result.ok, true);
  assert.equal(result.character.inventory[0].qty, 12);
  assert.equal(result.character.inventory[0].item_type, "ammunition");
  assert.deepEqual(result.character.attacks[0].ammunition_links, []);
  assert.equal(result.character.attacks[0].unlimited_ammunition, false);
});
