import { CSV_HEADERS } from "./headers.js";

function assertPapa() {
  if (typeof Papa === "undefined") {
    throw new Error("PapaParse is required for CSV operations.");
  }
}

function asString(v) {
  return (v ?? "").toString();
}

function toInt(v, fallback = 0) {
  const n = Number.parseInt(asString(v), 10);
  return Number.isFinite(n) ? n : fallback;
}

function toBool(v) {
  const s = asString(v).trim().toLowerCase();
  if (["true", "t", "yes", "y", "1"].includes(s)) return true;
  if (["false", "f", "no", "n", "0", ""].includes(s)) return false;
  return false;
}

function ensureHeaders(rows, headers) {
  return (rows || []).map((row) => {
    const out = {};
    for (const h of headers) out[h] = row?.[h] ?? "";
    return out;
  });
}

export function parseCsv(text) {
  assertPapa();
  if (!text || !text.trim()) return [];
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  return (parsed.data || []).map((row) => {
    const out = {};
    for (const key of Object.keys(row || {})) out[key] = row[key] ?? "";
    return out;
  });
}

export function generateCsv(rows, headers) {
  assertPapa();
  const normalized = ensureHeaders(rows, headers);
  if (normalized.length === 0) return `${headers.join(",")}\n`;
  return `${Papa.unparse(normalized, { columns: headers })}\n`;
}

export function fromInventoryRows(rows) {
  return ensureHeaders(rows, CSV_HEADERS.inventory).map((r) => ({
    id: asString(r.id),
    name: asString(r.name),
    category: asString(r.category),
    qty: toInt(r.qty, 1),
    weight_each: asString(r.weight_each),
    weight_unit: asString(r.weight_unit),
    value: asString(r.value),
    value_currency: asString(r.value_currency),
    attunement: asString(r.attunement),
    container: asString(r.container),
    equipped: toBool(r.equipped),
    notes: asString(r.notes)
  }));
}

export function toInventoryRows(character) {
  const list = Array.isArray(character?.inventory) ? character.inventory : [];
  return ensureHeaders(list, CSV_HEADERS.inventory).map((r) => ({
    ...r,
    qty: r.qty === "" ? "" : toInt(r.qty, 1),
    equipped: toBool(r.equipped) ? "true" : "false"
  }));
}

export function fromSpellRows(rows) {
  return ensureHeaders(rows, CSV_HEADERS.spells).map((r) => ({
    id: asString(r.id),
    name: asString(r.name),
    level: toInt(r.level, 0),
    school: asString(r.school),
    source: asString(r.source),
    ritual: toBool(r.ritual),
    concentration: toBool(r.concentration),
    casting_time: asString(r.casting_time),
    range: asString(r.range),
    components: asString(r.components),
    duration: asString(r.duration),
    spell_id: asString(r.spell_id),
    page: asString(r.page),
    notes: asString(r.notes)
  }));
}

export function toSpellRows(character, which = "known") {
  const key = which === "prepared" ? "spells_prepared" : "spells_known";
  const list = Array.isArray(character?.[key]) ? character[key] : [];
  return ensureHeaders(list, CSV_HEADERS.spells).map((r) => ({
    ...r,
    level: r.level === "" ? "" : toInt(r.level, 0),
    ritual: toBool(r.ritual) ? "true" : "false",
    concentration: toBool(r.concentration) ? "true" : "false"
  }));
}

function parseJsonSafe(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function fromLogRows(rows) {
  return ensureHeaders(rows, CSV_HEADERS.log).map((r) => {
    const parsed = parseJsonSafe(asString(r.data_json));
    const msg = parsed?.message ?? "";
    const id = parsed?.id ?? "";
    return {
      id: asString(id),
      utc: asString(r.timestamp_utc),
      tag: asString(r.label),
      message: asString(msg)
    };
  });
}

export function toLogRows(character) {
  const list = Array.isArray(character?.log) ? character.log : [];
  return list.map((entry) => ({
    timestamp_utc: asString(entry?.utc),
    type: "note",
    label: asString(entry?.tag),
    data_json: JSON.stringify({
      id: asString(entry?.id),
      message: asString(entry?.message)
    })
  }));
}
