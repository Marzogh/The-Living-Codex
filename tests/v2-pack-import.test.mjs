import test from "node:test";
import assert from "node:assert/strict";

import JSZip from "../vendor/jszip.min.js";
import Papa from "../vendor/papaparse.min.js";
import { createDefaultCharacterV2 } from "../js/v2/core/default-character.js";
import { V2ZipIO } from "../js/v2/io/zipio.js";
import { renderEditMode } from "../js/v2/ui/app-ui.js";

globalThis.JSZip = JSZip;
globalThis.Papa = Papa;

test("a generated ZIP pack imports and renders in edit mode", async () => {
  const character = createDefaultCharacterV2({ name: "Generic Import Test", classId: "rogue" });
  character.inventory = [{ id: "test-ammo", name: "Test Ammunition", qty: 12 }];

  const zip = new JSZip();
  zip.file("character.json", JSON.stringify(character));
  zip.file("inventory.csv", "id,name,category,qty,weight_each,weight_unit,value,value_currency,attunement,container,equipped,notes\ntest-ammo,Test Ammunition,,12,,,,,,,false,\n");
  const bytes = await zip.generateAsync({ type: "uint8array" });
  const file = new Blob([bytes], { type: "application/zip" });

  const result = await V2ZipIO.importZipFromFile(file);
  assert.equal(result.ok, true);
  assert.equal(result.character.meta.name, "Generic Import Test");
  assert.equal(result.character.inventory[0].qty, 12);

  const html = renderEditMode(result.character, { features: [], companions: [] }, {}, {}, { activeEditTab: "core" });
  assert.match(html, /Character Features/);
});
