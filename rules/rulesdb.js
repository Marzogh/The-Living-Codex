/**
 * RulesDB (edition-agnostic)
 *
 * Loads minimal selector datasets (spells/items/classes/species) from:
 *   /data/<rulesetId>/
 *
 * This module lives under /rules/, so dataset URLs resolve via ../data/...
 */

function toStr(v) {
  return (v ?? "").toString();
}

function norm(s) {
  return toStr(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) {
    throw new Error(`Failed to load ${url} (${res.status})`);
  }
  return await res.json();
}

function buildIndex(records, { idKey = "id" } = {}) {
  const list = Array.isArray(records) ? records : [];
  const byId = new Map();

  for (const r of list) {
    const id = toStr(r?.[idKey]).trim();
    if (!id) continue;
    byId.set(id, r);
  }

  return { list, byId };
}

function makeSpellApi(spellsIndex) {
  return {
    list: () => spellsIndex.list,

    get: (id) => spellsIndex.byId.get(id) || null,

    /**
     * Search spells by text + optional filters.
     *
     * filters:
     * - level: number | null
     * - classes: string[] | null (spell record `classes` array must intersect)
     * - ritual: boolean | null
     * - concentration: boolean | null
     */
    search: (query, filters = {}) => {
      const q = norm(query);
      const level = filters.level ?? null;
      const classes = Array.isArray(filters.classes)
        ? filters.classes.map((c) => toStr(c).toLowerCase())
        : null;
      const ritual = typeof filters.ritual === "boolean" ? filters.ritual : null;
      const concentration = typeof filters.concentration === "boolean" ? filters.concentration : null;

      const out = [];
      for (const s of spellsIndex.list) {
        // Text match
        if (q) {
          const sn = norm(s?.name);
          if (!sn.includes(q)) continue;
        }

        // Level filter
        if (level != null) {
          const sl = Number(s?.level);
          if (!Number.isFinite(sl) || sl !== Number(level)) continue;
        }

        // Class availability filter
        if (classes && classes.length) {
          const sc = Array.isArray(s?.classes)
            ? s.classes.map((c) => toStr(c).toLowerCase())
            : [];
          const ok = sc.some((c) => classes.includes(c));
          if (!ok) continue;
        }

        // Flags
        if (ritual != null && Boolean(s?.ritual) !== ritual) continue;
        if (concentration != null && Boolean(s?.concentration) !== concentration) continue;

        out.push(s);
      }

      // Stable sort: level asc, then name asc
      out.sort(
        (a, b) =>
          (Number(a?.level) || 0) - (Number(b?.level) || 0) ||
          toStr(a?.name).localeCompare(toStr(b?.name))
      );

      return out;
    }
  };
}

function makeGenericApi(index) {
  return {
    list: () => index.list,
    get: (id) => index.byId.get(id) || null,
    search: (query) => {
      const q = norm(query);
      if (!q) return index.list;
      const out = [];
      for (const r of index.list) {
        const rn = norm(r?.name);
        if (rn.includes(q)) out.push(r);
      }
      out.sort((a, b) => toStr(a?.name).localeCompare(toStr(b?.name)));
      return out;
    }
  };
}

export const RulesDB = {
  /**
   * Load a rules dataset pack.
   */
  async load(rulesetId) {
    const rs = toStr(rulesetId).trim();
    if (!rs) throw new Error("RulesDB.load: rulesetId is required");

    // Resolve data paths relative to this module (/rules/rulesdb.js -> /data/...)
    const baseUrl = new URL(`../data/${rs}/`, import.meta.url);

    // Load what exists; keep missing files non-fatal so we can phase datasets in.
    let spells = [];
    let items = [];
    let classes = [];
    let species = [];
    let meta = null;

    try { spells = await fetchJson(new URL("spells.min.json", baseUrl).href); } catch { /* optional */ }
    try { items = await fetchJson(new URL("items.min.json", baseUrl).href); } catch { /* optional */ }
    try { classes = await fetchJson(new URL("classes.json", baseUrl).href); } catch { /* optional */ }
    try { species = await fetchJson(new URL("species.json", baseUrl).href); } catch { /* optional */ }
    try { meta = await fetchJson(new URL("meta.json", baseUrl).href); } catch { /* optional */ }

    const spellsIndex = buildIndex(spells);
    const itemsIndex = buildIndex(items);
    const classesIndex = buildIndex(classes);
    const speciesIndex = buildIndex(species);

    return {
      rulesetId: rs,
      loadedAt: new Date().toISOString(),
      meta,
      counts: {
        spells: spellsIndex.list.length,
        items: itemsIndex.list.length,
        classes: classesIndex.list.length,
        species: speciesIndex.list.length
      },
      spells: makeSpellApi(spellsIndex),
      items: makeGenericApi(itemsIndex),
      classes: makeGenericApi(classesIndex),
      species: makeGenericApi(speciesIndex)
    };
  }
};
