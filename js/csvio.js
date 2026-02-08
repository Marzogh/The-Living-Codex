/**
 * CSV I/O helpers for D&D Character Pack
 * v1: parse and generate CSVs with fixed headers
 * Relies on vendor/papaparse.min.js exposing global `Papa`
 */

function assertHasPapa() {
  if (typeof Papa === "undefined") {
    throw new Error("PapaParse is not loaded. Ensure vendor/papaparse.min.js is included before app modules.");
  }
}

// --- Type coercion and shared helpers ---
function toBool(v) {
  if (typeof v === "boolean") return v;
  const s = (v ?? "").toString().trim().toLowerCase();
  if (s === "true" || s === "t" || s === "yes" || s === "y" || s === "1") return true;
  if (s === "false" || s === "f" || s === "no" || s === "n" || s === "0" || s === "") return false;
  return false;
}

function toInt(v, fallback = 0) {
  const n = Number.parseInt((v ?? "").toString(), 10);
  return Number.isFinite(n) ? n : fallback;
}

function normaliseRowsForHeaders(rows, headers) {
  return (rows || []).map((row) => {
    const out = {};
    headers.forEach((h) => {
      out[h] = row && row[h] !== undefined && row[h] !== null ? row[h] : "";
    });
    return out;
  });
}

function stringifyBool(v) {
  return v ? "true" : "false";
}

/**
 * Parse CSV text into rows (objects keyed by header).
 * Missing values are normalised to empty strings.
 *
 * @param {string} csvText
 * @returns {Array<object>}
 */
function parseCsv(csvText) {
  assertHasPapa();
  if (!csvText || !csvText.trim()) return [];

  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  if (result.errors && result.errors.length) {
    // Fail soft: log errors, return best-effort data
    console.warn("CSV parse warnings:", result.errors);
  }

  return (result.data || []).map(row => {
    const normalised = {};
    for (const key in row) {
      normalised[key] = row[key] ?? "";
    }
    return normalised;
  });
}

function fromInventoryCsvRows(rows) {
  const norm = normaliseRowsForHeaders(rows, CSV_HEADERS.inventory);
  return norm.map((r) => ({
    id: r.id || crypto.randomUUID(),
    name: r.name ?? "",
    category: r.category ?? "",
    qty: toInt(r.qty, 1),
    weight_each: r.weight_each ?? "",
    weight_unit: r.weight_unit ?? "",
    value: r.value ?? "",
    value_currency: r.value_currency ?? "",
    attunement: r.attunement ?? "",
    container: r.container ?? "",
    equipped: toBool(r.equipped),
    notes: r.notes ?? ""
  }));
}

function fromSpellCsvRows(rows) {
  const norm = normaliseRowsForHeaders(rows, CSV_HEADERS.spells);
  return norm.map((r) => ({
    id: r.id || crypto.randomUUID(),
    name: r.name ?? "",
    level: toInt(r.level, 0),
    school: r.school ?? "",
    source: r.source ?? "",
    ritual: toBool(r.ritual),
    concentration: toBool(r.concentration),
    casting_time: r.casting_time ?? "",
    range: r.range ?? "",
    components: r.components ?? "",
    notes: r.notes ?? ""
  }));
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function fromLogCsvRows(rows) {
  const norm = normaliseRowsForHeaders(rows, CSV_HEADERS.log);

  return norm.map((r) => {
    const payload = safeJsonParse(r.data_json);
    const id = (payload && payload.id) ? payload.id : (r.id || crypto.randomUUID());
    const message = (payload && payload.message !== undefined) ? payload.message : (r.message ?? "");
    const utc = r.timestamp_utc || r.utc || new Date().toISOString();
    const tag = r.label || r.tag || "";

    return {
      id,
      utc,
      tag,
      message
    };
  });
}

function generateCsv(rows, headers) {
  assertHasPapa();

  if (!Array.isArray(rows) || rows.length === 0) {
    // Return header-only CSV
    return headers.join(",") + "\n";
  }

  const data = rows.map(row => {
    const out = {};
    headers.forEach(h => {
      out[h] = row[h] ?? "";
    });
    return out;
  });

  return Papa.unparse(data, { columns: headers }) + "\n";
}

function toInventoryRowsForCsv(character) {
  const rows = (character && Array.isArray(character.inventory)) ? character.inventory : [];
  return normaliseRowsForHeaders(rows, CSV_HEADERS.inventory).map((r) => ({
    ...r,
    qty: (r.qty ?? "") === "" ? "" : toInt(r.qty, 1),
    equipped: stringifyBool(!!r.equipped)
  }));
}

function toSpellRowsForCsv(character, which /* 'known'|'prepared' */) {
  const key = which === "prepared" ? "spells_prepared" : "spells_known";
  const rows = (character && Array.isArray(character[key])) ? character[key] : [];
  return normaliseRowsForHeaders(rows, CSV_HEADERS.spells).map((r) => ({
    ...r,
    level: (r.level ?? "") === "" ? "" : toInt(r.level, 0),
    ritual: stringifyBool(!!r.ritual),
    concentration: stringifyBool(!!r.concentration)
  }));
}

function toLogRowsForCsv(character) {
  const rows = (character && Array.isArray(character.log)) ? character.log : [];

  // Ensure stable column order and string types
  return normaliseRowsForHeaders(
    rows.map((e) => ({
      timestamp_utc: e.utc || "",
      type: "note",
      label: e.tag || "",
      data_json: JSON.stringify({ id: e.id || crypto.randomUUID(), message: e.message || "" })
    })),
    CSV_HEADERS.log
  );
}

/**
 * Known CSV header contracts (v1)
 */
const CSV_HEADERS = {
  inventory: [
    "id","name","category","qty","weight_each","weight_unit",
    "value","value_currency","attunement","container","equipped","notes"
  ],
  spells: [
    "id","name","level","school","source","ritual",
    "concentration","casting_time","range","components","notes"
  ],
  log: [
    "timestamp_utc","type","label","data_json"
  ]
};

export const CsvIO = {
  parseCsv,
  generateCsv,
  CSV_HEADERS,

  // Export helpers
  toInventoryRowsForCsv,
  toSpellRowsForCsv,
  toLogRowsForCsv,

  // Import helpers (coercion)
  fromInventoryCsvRows,
  fromSpellCsvRows,
  fromLogCsvRows,

  // Shared helpers (occasionally useful)
  normaliseRowsForHeaders
};