import {
  fromInventoryRows,
  fromLogRows,
  fromSpellRows,
  generateCsv,
  parseCsv,
  toInventoryRows,
  toLogRows,
  toSpellRows
} from "./csv.js";
import { CSV_HEADERS } from "./headers.js";
import { validateAndFixImportPayload } from "./validate.js";

function assertJSZip() {
  if (typeof JSZip === "undefined") {
    throw new Error("JSZip is required for ZIP import/export.");
  }
}

function asString(v) {
  return (v ?? "").toString();
}

function safeName(name) {
  return asString(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\- _]/g, "")
    .replace(/\s+/g, "-")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "") || "character";
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function toPrettyJson(obj) {
  return `${JSON.stringify(obj, null, 2)}\n`;
}

async function parseCharacterJson(zip) {
  const entry = zip.file("character.json");
  if (!entry) throw new Error("Invalid pack: character.json not found.");
  const raw = await entry.async("string");
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid pack: character.json is not valid JSON.");
  }
}

async function applyOptionalCsvOverrides(zip, character) {
  const out = structuredClone(character);

  const inv = zip.file("inventory.csv");
  if (inv) {
    out.inventory = fromInventoryRows(parseCsv(await inv.async("string")));
  }

  const known = zip.file("spells_known.csv");
  if (known) {
    out.spells_known = fromSpellRows(parseCsv(await known.async("string")));
  }

  const prepared = zip.file("spells_prepared.csv");
  if (prepared) {
    out.spells_prepared = fromSpellRows(parseCsv(await prepared.async("string")));
  }

  const log = zip.file("log.csv");
  if (log) {
    out.log = fromLogRows(parseCsv(await log.async("string")));
  }

  return out;
}

async function importZipFromFile(file) {
  assertJSZip();
  if (!file) throw new Error("File is required.");

  const buf = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);
  const baseCharacter = await parseCharacterJson(zip);
  const merged = await applyOptionalCsvOverrides(zip, baseCharacter);

  const result = validateAndFixImportPayload(merged);
  return {
    ok: result.ok,
    character: result.character,
    report: result.report
  };
}

async function buildExportZipBlob(character, { includeReport = false, report = null } = {}) {
  assertJSZip();
  if (!character || typeof character !== "object") throw new Error("Character object is required.");

  const zip = new JSZip();
  zip.file("character.json", toPrettyJson(character));
  zip.file("inventory.csv", generateCsv(toInventoryRows(character), CSV_HEADERS.inventory));
  zip.file("spells_known.csv", generateCsv(toSpellRows(character, "known"), CSV_HEADERS.spells));
  zip.file("spells_prepared.csv", generateCsv(toSpellRows(character, "prepared"), CSV_HEADERS.spells));
  zip.file("log.csv", generateCsv(toLogRows(character), CSV_HEADERS.log));

  if (includeReport && report) {
    zip.folder("report").file("import-report.json", toPrettyJson(report));
  }

  return zip.generateAsync({ type: "blob" });
}

async function exportZipToDownload(character, opts = {}) {
  const blob = await buildExportZipBlob(character, opts);
  const filename = `${safeName(character?.meta?.name)}-v2-pack.zip`;
  triggerDownload(blob, filename);
}

export const V2ZipIO = {
  importZipFromFile,
  buildExportZipBlob,
  exportZipToDownload
};
