import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RULESET = process.argv[2] || "dnd5e_2014";
const BASE_DIR = path.join(ROOT, "data", RULESET);
const SRC_FILE = path.join(ROOT, "data_src", RULESET, "options-overrides.json");

const CLASSES = path.join(BASE_DIR, "classes.json");
const SPECIES = path.join(BASE_DIR, "species.json");
const SUBCLASSES = path.join(BASE_DIR, "subclasses.json");
const SPECIES_MIN = path.join(BASE_DIR, "species.min.json");
const SUBCLASSES_MIN = path.join(BASE_DIR, "subclasses.min.json");
const META = path.join(BASE_DIR, "meta.json");

function readJson(p, fallback = null) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fallback; }
}

function writeJson(p, data, pretty = true) {
  fs.writeFileSync(p, JSON.stringify(data, null, pretty ? 2 : 0) + "\n", "utf8");
}

function slug(v) {
  return (v ?? "").toString().toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function normalizeSource(v) {
  return (v ?? "").toString().trim().toUpperCase() || "UNKNOWN";
}

function availabilityForSource(source) {
  const core = source === "PHB";
  return {
    default: core ? "allowed" : "requires_dm_approval",
    content_group: core ? "core" : "expanded",
    official: true,
    era: "5e_2014"
  };
}

function mergeById(base, extra, normalizer) {
  const out = new Map();
  for (const row of base || []) {
    const n = normalizer(row);
    if (n?.id) out.set(n.id, n);
  }
  for (const row of extra || []) {
    const n = normalizer(row);
    if (n?.id) out.set(n.id, { ...(out.get(n.id) || {}), ...n });
  }
  return [...out.values()];
}

function main() {
  const classes = readJson(CLASSES, []);
  const species = readJson(SPECIES, []);
  const subclasses = readJson(SUBCLASSES, []);
  const overlay = readJson(SRC_FILE, { species: [], subclasses: [] });

  const classIds = new Set((classes || []).map((c) => (c?.id || "").toString().trim().toLowerCase()).filter(Boolean));

  const normalizedSpecies = mergeById(species, overlay.species, (row) => {
    const id = (row?.id || slug(row?.name)).toString().trim().toLowerCase();
    const name = (row?.name || id).toString().trim();
    const source = normalizeSource(row?.source);
    return {
      ...row,
      id,
      name,
      source,
      availability: row?.availability || availabilityForSource(source)
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const normalizedSubclasses = mergeById(subclasses, overlay.subclasses, (row) => {
    const id = (row?.id || slug(row?.name)).toString().trim().toLowerCase();
    const class_id = (row?.class_id || row?.classId || "").toString().trim().toLowerCase();
    if (!classIds.has(class_id)) return null;
    const name = (row?.name || id).toString().trim();
    const source = normalizeSource(row?.source);
    const min_level = Number.isFinite(Number(row?.min_level)) ? Math.max(1, Math.min(20, Number(row.min_level))) : 3;
    return {
      ...row,
      id,
      class_id,
      name,
      source,
      min_level,
      availability: row?.availability || availabilityForSource(source)
    };
  }).filter(Boolean).sort((a, b) => a.class_id.localeCompare(b.class_id) || a.name.localeCompare(b.name));

  writeJson(SPECIES, normalizedSpecies, true);
  writeJson(SUBCLASSES, normalizedSubclasses, true);
  writeJson(SPECIES_MIN, normalizedSpecies, false);
  writeJson(SUBCLASSES_MIN, normalizedSubclasses, false);

  const meta = readJson(META, { rulesetId: RULESET, schemaVersion: "0.1.0", sources: [], counts: {} });
  const srcSet = new Map();
  for (const row of [...classes, ...normalizedSpecies, ...normalizedSubclasses]) {
    const s = normalizeSource(row?.source);
    if (!srcSet.has(s)) srcSet.set(s, { id: s, name: s });
  }

  const nextMeta = {
    ...meta,
    builtAt: new Date().toISOString(),
    sources: [...srcSet.values()].sort((a, b) => a.id.localeCompare(b.id)),
    counts: {
      ...(meta.counts || {}),
      classes: Array.isArray(classes) ? classes.length : 0,
      species: normalizedSpecies.length,
      subclasses: normalizedSubclasses.length
    }
  };

  writeJson(META, nextMeta, true);

  console.log(`Ingested ${RULESET}`);
  console.log(`- species: ${normalizedSpecies.length}`);
  console.log(`- subclasses: ${normalizedSubclasses.length}`);
  console.log(`- sources: ${nextMeta.sources.length}`);
}

main();
