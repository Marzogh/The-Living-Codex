import { CsvIO } from "./csvio.js";

/**
 * ZIP I/O for D&D Character Pack
 * - v1: provides export + import (character.json + CSVs)
 * - relies on vendor/jszip.min.js exposing global JSZip
 */

function assertHasJSZip() {
  if (typeof JSZip === "undefined") {
    throw new Error("JSZip is not loaded. Ensure vendor/jszip.min.js is included before app modules.");
  }
}

async function readFileAsArrayBuffer(file) {
  return await file.arrayBuffer();
}

function safeFileName(name) {
  return (name || "character")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\- _]/g, "")
    .replace(/\s+/g, "-")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "") || "character";
}

function toJsonPretty(obj) {
  return JSON.stringify(obj, null, 2) + "\n";
}

function csvTemplate(headersLine) {
  // Always end with newline so editors behave nicely
  return headersLine.trim() + "\n";
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a moment before revoking
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Import a character pack ZIP from a File object.
 *
 * v1 behaviour:
 * - Requires character.json at the root of the ZIP
 * - Parses and returns the character object
 * - Does not yet parse CSV/notes/assets (later steps)
 *
 * @param {File} file
 * @returns {Promise<{ character: any }>}
 */
async function importZipFromFile(file) {
  assertHasJSZip();
  if (!file) throw new Error("importZipFromFile: file is required");

  const buf = await readFileAsArrayBuffer(file);
  const zip = await JSZip.loadAsync(buf);

  const characterEntry = zip.file("character.json");
  if (!characterEntry) {
    throw new Error("Invalid pack: character.json not found at ZIP root");
  }

  const characterText = await characterEntry.async("string");
  let character;
  try {
    character = JSON.parse(characterText);
  } catch {
    throw new Error("Invalid pack: character.json is not valid JSON");
  }

  // Optional CSV overrides (v1)
  const invEntry = zip.file("inventory.csv");
  if (invEntry) {
    const text = await invEntry.async("string");
    const rows = CsvIO.parseCsv(text);
    character.inventory = CsvIO.fromInventoryCsvRows(rows);
  }

  const knownEntry = zip.file("spells_known.csv");
  if (knownEntry) {
    const text = await knownEntry.async("string");
    const rows = CsvIO.parseCsv(text);
    character.spells_known = CsvIO.fromSpellCsvRows(rows);
  }

  const prepEntry = zip.file("spells_prepared.csv");
  if (prepEntry) {
    const text = await prepEntry.async("string");
    const rows = CsvIO.parseCsv(text);
    character.spells_prepared = CsvIO.fromSpellCsvRows(rows);
  }

  const logEntry = zip.file("log.csv");
  if (logEntry) {
    const text = await logEntry.async("string");
    const rows = CsvIO.parseCsv(text);
    character.log = CsvIO.fromLogCsvRows(rows);
  }

  return { character };
}

/**
 * Export a character pack ZIP.
 *
 * v1 behaviour:
 * - Always includes character.json
 * - Includes empty CSV templates (inventory, spells_known, spells_prepared, log) for friendliness
 * - Includes notes.md (empty) for friendliness
 * - Includes portrait only if character.assets.portrait === true AND portraitPngBytes provided
 *
 * @param {object} opts
 * @param {object} opts.character Required character object
 * @param {Uint8Array|ArrayBuffer|null} [opts.portraitPngBytes] Optional 300x300 PNG bytes for assets/portrait.png
 * @returns {Promise<Blob>} ZIP file blob
 */
async function exportZipBlob({ character, portraitPngBytes = null }) {
  assertHasJSZip();
  if (!character || !character.meta || !character.meta.name) {
    throw new Error("exportZipBlob: character with meta.name is required");
  }

  const zip = new JSZip();

  // Required
  zip.file("character.json", toJsonPretty(character));

  // Optional-friendly templates (v1)
  zip.file(
    "inventory.csv",
    CsvIO.generateCsv(
      CsvIO.toInventoryRowsForCsv(character),
      CsvIO.CSV_HEADERS.inventory
    )
  );

  zip.file(
    "spells_known.csv",
    CsvIO.generateCsv(
      CsvIO.toSpellRowsForCsv(character, "known"),
      CsvIO.CSV_HEADERS.spells
    )
  );

  zip.file(
    "spells_prepared.csv",
    CsvIO.generateCsv(
      CsvIO.toSpellRowsForCsv(character, "prepared"),
      CsvIO.CSV_HEADERS.spells
    )
  );

  zip.file(
    "log.csv",
    CsvIO.generateCsv(
      CsvIO.toLogRowsForCsv(character),
      CsvIO.CSV_HEADERS.log
    )
  );

  zip.file("notes.md", "");

  // Portrait (optional)
  if (character.assets && character.assets.portrait === true) {
    if (!portraitPngBytes) {
      // Keep pack deterministic: if portrait flag true but bytes missing, do NOT write a broken file.
      // Caller should either supply portrait bytes or set assets.portrait=false.
    } else {
      zip.folder("assets").file("portrait.png", portraitPngBytes);
    }
  }

  return await zip.generateAsync({ type: "blob" });
}

/**
 * Export and download a character pack ZIP.
 *
 * @param {object} opts
 * @param {object} opts.character Required character object
 * @param {Uint8Array|ArrayBuffer|null} [opts.portraitPngBytes] Optional 300x300 PNG bytes
 * @returns {Promise<void>}
 */
async function exportZipToDownload({ character, portraitPngBytes = null }) {
  const blob = await exportZipBlob({ character, portraitPngBytes });
  const fname = `${safeFileName(character.meta.name)}-pack.zip`;
  triggerDownload(blob, fname);
}

export const ZipIO = {
  importZipFromFile,
  exportZipBlob,
  exportZipToDownload
};