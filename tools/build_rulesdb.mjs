/****
 * Build RulesDB datasets from CSV source-of-truth.
 *
 * Usage:
 *   node tools/build_rulesdb.mjs dnd5e_2014
 *   node tools/build_rulesdb.mjs                 (defaults to dnd5e_2014)
 *
 * Inputs:
 *   data_src/<rulesetId>/spells.csv
 *   data/<rulesetId>/classes.json
 *   data/<rulesetId>/species.json (or races.json)
 *
 * Outputs:
 *   data/<rulesetId>/spells.min.json
 *   data/<rulesetId>/classes.min.json
 *   data/<rulesetId>/species.min.json
 *   data/<rulesetId>/meta.json  (updates builtAt + counts)
 */

import fs from "node:fs";
import path from "node:path";

const RULESET_ID = process.argv[2] || "dnd5e_2014";

const ROOT = process.cwd();
const IN_CSV = path.join(ROOT, "data_src", RULESET_ID, "spells.csv");
const OUT_DIR = path.join(ROOT, "data", RULESET_ID);
const OUT_JSON = path.join(OUT_DIR, "spells.min.json");
const META_JSON = path.join(OUT_DIR, "meta.json");

// Optional JSON datasets (source-of-truth lives in data/<rulesetId>/)
const IN_CLASSES_JSON = path.join(OUT_DIR, "classes.json");
const IN_SPECIES_JSON = path.join(OUT_DIR, "species.json");
const IN_RACES_JSON = path.join(OUT_DIR, "races.json");

const OUT_CLASSES_MIN = path.join(OUT_DIR, "classes.min.json");
const OUT_SPECIES_MIN = path.join(OUT_DIR, "species.min.json");

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function nowIso() {
  return new Date().toISOString();
}

// Minimal CSV parser (handles quoted fields, commas, CRLF)
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = i + 1 < text.length ? text[i + 1] : "";

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ',') {
      row.push(cur);
      cur = "";
      continue;
    }

    if (ch === '\n') {
      row.push(cur);
      cur = "";
      // trim CR from last field
      row = row.map((v) => (v.endsWith("\r") ? v.slice(0, -1) : v));
      // ignore empty trailing lines
      if (!(row.length === 1 && row[0] === "")) rows.push(row);
      row = [];
      continue;
    }

    cur += ch;
  }

  // final line
  if (cur.length || row.length) {
    row.push(cur);
    row = row.map((v) => (v.endsWith("\r") ? v.slice(0, -1) : v));
    if (!(row.length === 1 && row[0] === "")) rows.push(row);
  }

  return rows;
}

function toBool(v) {
  const s = String(v ?? "").trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes" || s === "y";
}

function toInt(v, fallback = 0) {
  const n = Number(String(v ?? "").trim());
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function splitClasses(v) {
  const s = String(v ?? "").trim();
  if (!s) return [];
  return s
    .split("|")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeSpellRow(obj) {
  return {
    id: String(obj.id ?? "").trim(),
    name: String(obj.name ?? "").trim(),
    level: toInt(obj.level, 0),
    school: String(obj.school ?? "").trim(),
    ritual: toBool(obj.ritual),
    concentration: toBool(obj.concentration),
    casting_time: String(obj.casting_time ?? "").trim(),
    range: String(obj.range ?? "").trim(),
    components: String(obj.components ?? "").trim(),
    duration: String(obj.duration ?? "").trim(),
    classes: splitClasses(obj.classes),
    source: String(obj.source ?? "").trim(),
    page: String(obj.page ?? "").trim(),
    summary_basic: String(obj.summary_basic ?? "").trim(),
    summary_expert: String(obj.summary_expert ?? "").trim()
  };
}

function validateSpells(spells) {
  const required = ["id", "name", "level", "classes"];
  const idSeen = new Set();
  const errors = [];

  for (const s of spells) {
    for (const k of required) {
      if (s[k] == null) errors.push(`Missing key '${k}' for ${s.name || s.id}`);
    }
    if (!s.id) errors.push(`Missing id for spell '${s.name}'`);
    if (!s.name) errors.push(`Missing name for id '${s.id}'`);

    if (idSeen.has(s.id)) errors.push(`Duplicate id '${s.id}'`);
    idSeen.add(s.id);

    if (!Array.isArray(s.classes)) errors.push(`Classes not array for '${s.id}'`);
  }

  if (errors.length) {
    die("RulesDB build failed:\n" + errors.slice(0, 50).join("\n") + (errors.length > 50 ? `\n...and ${errors.length - 50} more` : ""));
  }
}

function sortSpells(spells) {
  spells.sort((a, b) => (a.level - b.level) || a.name.localeCompare(b.name));
  return spells;
}

function readMeta() {
  if (!fileExists(META_JSON)) return null;
  try {
    return JSON.parse(fs.readFileSync(META_JSON, "utf-8"));
  } catch {
    return null;
  }
}

function writeMeta(meta, counts) {
  const base = meta && typeof meta === "object" ? meta : { rulesetId: RULESET_ID, schemaVersion: "0.1.0" };
  const out = {
    ...base,
    rulesetId: base.rulesetId || RULESET_ID,
    builtAt: nowIso(),
    counts
  };
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(META_JSON, JSON.stringify(out, null, 2) + "\n", "utf-8");
}

function readJsonArrayOrNull(p) {
  if (!fileExists(p)) return null;
  try {
    const v = JSON.parse(fs.readFileSync(p, "utf-8"));
    return Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}

function validateIdNameArray(arr, label) {
  if (!Array.isArray(arr)) return;
  const seen = new Set();
  const errors = [];
  for (const rec of arr) {
    const id = String(rec?.id ?? "").trim();
    const name = String(rec?.name ?? "").trim();
    if (!id) errors.push(`${label}: missing id`);
    if (!name) errors.push(`${label} '${id || "(no id)"}': missing name`);
    if (id) {
      if (seen.has(id)) errors.push(`${label}: duplicate id '${id}'`);
      seen.add(id);
    }
  }
  if (errors.length) {
    die("RulesDB build failed:\n" + errors.slice(0, 50).join("\n") + (errors.length > 50 ? `\n...and ${errors.length - 50} more` : ""));
  }
}

function writeMinJson(pOut, arr) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(pOut, JSON.stringify(arr) + "\n", "utf-8");
}

function main() {
  if (!fileExists(IN_CSV)) {
    die(`Input CSV not found: ${IN_CSV}`);
  }

  const csvText = fs.readFileSync(IN_CSV, "utf-8");
  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    die(`CSV has no data rows: ${IN_CSV}`);
  }

  const header = rows[0].map((h) => String(h).trim());
  const idx = new Map(header.map((h, i) => [h, i]));

  const requiredCols = ["id", "name", "level", "classes"];
  for (const col of requiredCols) {
    if (!idx.has(col)) die(`Missing required CSV column '${col}' in ${IN_CSV}`);
  }

  const spells = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const obj = {};
    for (const [col, i] of idx.entries()) {
      obj[col] = i < row.length ? row[i] : "";
    }
    spells.push(normalizeSpellRow(obj));
  }

  validateSpells(spells);
  sortSpells(spells);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  // Minified (small) but still stable ordering
  fs.writeFileSync(OUT_JSON, JSON.stringify(spells) + "\n", "utf-8");

  // Optional datasets: classes + species
  const classes = readJsonArrayOrNull(IN_CLASSES_JSON);
  validateIdNameArray(classes, "Class");
  if (classes) {
    writeMinJson(OUT_CLASSES_MIN, classes);
  }

  // Prefer species.json; fall back to races.json (legacy)
  const species = readJsonArrayOrNull(IN_SPECIES_JSON) || readJsonArrayOrNull(IN_RACES_JSON);
  validateIdNameArray(species, "Species");
  if (species) {
    writeMinJson(OUT_SPECIES_MIN, species);
  }

  const counts = {
    spells: spells.length,
    items: 0,
    classes: classes ? classes.length : 0,
    species: species ? species.length : 0
  };
  writeMeta(readMeta(), counts);

  console.log(`Built ruleset '${RULESET_ID}'`);
  console.log(`- wrote ${OUT_JSON}`);
  if (classes) console.log(`- wrote ${OUT_CLASSES_MIN}`);
  if (species) console.log(`- wrote ${OUT_SPECIES_MIN}`);
  console.log(`- updated ${META_JSON}`);
  console.log(`- spells: ${counts.spells}`);
  if (classes) console.log(`- classes: ${counts.classes}`);
  if (species) console.log(`- species: ${counts.species}`);
}

main();