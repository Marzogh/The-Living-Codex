/**
 * Spells Editor UI (v1)
 *
 * - Known is editable (mostly toggles); Prepared is a read-only view derived from Known toggles
 * - CSV-schema aligned rows
 * - No spell text, no automation
 */

function nowIso() {
  return new Date().toISOString();
}

function escapeHtml(text) {
  return (text ?? "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normaliseSpells(c) {
  if (!c.spells_known || !Array.isArray(c.spells_known)) c.spells_known = [];
  if (!c.spells_prepared || !Array.isArray(c.spells_prepared)) c.spells_prepared = [];

  // Backfill fields for older rows
  for (const row of c.spells_known) {
    if (row.ritual === "") row.ritual = false;
    if (row.concentration === "") row.concentration = false;
    if (row.ritual == null) row.ritual = false;
    if (row.concentration == null) row.concentration = false;
    if (row.spell_id == null) row.spell_id = "";
    if (row.page == null) row.page = "";
    if (row.source == null) row.source = row.source ?? "";
    if (row.notes == null) row.notes = "";
    if (row.level == null || row.level === "") row.level = 0;
  }
  for (const row of c.spells_prepared) {
    if (row.ritual === "") row.ritual = false;
    if (row.concentration === "") row.concentration = false;
    if (row.ritual == null) row.ritual = false;
    if (row.concentration == null) row.concentration = false;
    if (row.spell_id == null) row.spell_id = "";
    if (row.page == null) row.page = "";
    if (row.source == null) row.source = row.source ?? "";
    if (row.notes == null) row.notes = "";
    if (row.level == null || row.level === "") row.level = 0;
  }
}

function normaliseSpellSlots(c) {
  if (!c.spell_slots || typeof c.spell_slots !== "object") {
    c.spell_slots = { auto: true, pact: { max: 0, used: 0, level: 1 }, levels: {} };
  }
  if (!c.spell_slots.pact || typeof c.spell_slots.pact !== "object") {
    c.spell_slots.pact = { max: 0, used: 0, level: 1 };
  }
  if (!c.spell_slots.levels || typeof c.spell_slots.levels !== "object") {
    c.spell_slots.levels = {};
  }
  if (typeof c.spell_slots.auto !== "boolean") c.spell_slots.auto = true;

  // Ensure levels 1..9 exist
  for (let i = 1; i <= 9; i++) {
    const k = String(i);
    if (!c.spell_slots.levels[k] || typeof c.spell_slots.levels[k] !== "object") {
      c.spell_slots.levels[k] = { max: 0, used: 0 };
    }
    const row = c.spell_slots.levels[k];
    row.max = Number.isFinite(Number(row.max)) ? Math.max(0, Number(row.max)) : 0;
    row.used = Number.isFinite(Number(row.used)) ? Math.max(0, Number(row.used)) : 0;
    if (row.used > row.max) row.used = row.max;
  }

  // Pact
  c.spell_slots.pact.max = Number.isFinite(Number(c.spell_slots.pact.max)) ? Math.max(0, Number(c.spell_slots.pact.max)) : 0;
  c.spell_slots.pact.used = Number.isFinite(Number(c.spell_slots.pact.used)) ? Math.max(0, Number(c.spell_slots.pact.used)) : 0;
  c.spell_slots.pact.level = Number.isFinite(Number(c.spell_slots.pact.level)) ? Math.min(9, Math.max(1, Number(c.spell_slots.pact.level))) : 1;
  if (c.spell_slots.pact.used > c.spell_slots.pact.max) c.spell_slots.pact.used = c.spell_slots.pact.max;
}

function clamp(n, lo, hi) {
  const x = Number(n);
  if (!Number.isFinite(x)) return lo;
  return Math.max(lo, Math.min(hi, x));
}

function getRulesDbFromWindow() {
  try {
    const w = window;
    return w?.__codex?.appState?.rulesDb || w?.__codex?.rulesDb || null;
  } catch {
    return null;
  }
}

// --- Spellcasting ability inference and subclass spell hooks ---
function asNumber(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function abilityModFromScore(score) {
  const s = asNumber(score);
  if (s == null) return null;
  return Math.floor((s - 10) / 2);
}

function getAbilityScores(c) {
  // Accept a few common shapes.
  const a = c?.abilities || c?.core?.abilities || c?.stats?.abilities || c?.core?.stats?.abilities || null;
  if (!a || typeof a !== "object") return null;
  const pick = (k) => a?.[k] ?? a?.[k?.toUpperCase?.()] ?? a?.[k?.toLowerCase?.()];
  return {
    str: pick("str"),
    dex: pick("dex"),
    con: pick("con"),
    int: pick("int"),
    wis: pick("wis"),
    cha: pick("cha"),
  };
}

function inferTotalLevel(c) {
  try {
    const pairs = getClassLevelPairs(c);
    const total = pairs.reduce((acc, [, lvl]) => acc + (Number(lvl) || 0), 0);
    return clamp(total, 0, 20);
  } catch {
    return 0;
  }
}

function proficiencyBonusFromLevel(totalLevel) {
  const lvl = clamp(totalLevel, 1, 20);
  // 5e PB: 2 (1-4), 3 (5-8), 4 (9-12), 5 (13-16), 6 (17-20)
  if (lvl >= 17) return 6;
  if (lvl >= 13) return 5;
  if (lvl >= 9) return 4;
  if (lvl >= 5) return 3;
  return 2;
}

function inferSpellcastingAbility(c) {
  // Explicit override always wins
  const explicit = c?.spellcasting?.ability || c?.spellcasting_ability || c?.spellcastingAbility;
  if (explicit) return explicit.toString().trim().toLowerCase();

  const classes = Array.isArray(c?.core?.classes) ? c.core.classes : (Array.isArray(c?.classes) ? c.classes : []);
  if (!classes.length) return null;

  const db = getRulesDbFromWindow();
  const abilityForClassId = (cid) => {
    if (!db?.classes?.get || !cid) return null;
    const id = cid.toString().trim().toLowerCase();
    const rec = db.classes.get(id) || db.classes.get(id.toUpperCase()) || null;
    if (!rec) return null;

    const raw = rec.spellcasting_ability || rec.spellcastingAbility || rec.castingAbility || rec?.spellcasting?.ability || null;
    if (!raw) return null;

    const k = raw.toString().toLowerCase();
    if (k === "int" || k === "wis" || k === "cha") return k;
    if (k === "intelligence") return "int";
    if (k === "wisdom") return "wis";
    if (k === "charisma") return "cha";
    return null;
  };

  // 1) Primary class (if caster)
  const primary = classes.find(x => x?.isPrimary);
  if (primary) {
    const a = abilityForClassId(primary.id);
    if (a) return a;
  }

  // 2) Highest-level caster
  const casters = classes
    .map(x => ({ id: (x?.id || "").toString().trim().toLowerCase(), level: asNumber(x?.level) ?? 0 }))
    .map(x => ({ ...x, ability: abilityForClassId(x.id) }))
    .filter(x => x.ability);

  if (!casters.length) return null;
  casters.sort((a, b) => (b.level || 0) - (a.level || 0));
  return casters[0].ability;
}

function inferSpellcastingStats(c) {
  const ability = inferSpellcastingAbility(c);
  if (!ability) return { ability: null, mod: null, prof: null, saveDc: null, attackBonus: null };

  const scores = getAbilityScores(c);
  const mod = abilityModFromScore(scores?.[ability]);

  const totalLevel = inferTotalLevel(c);
  const prof = proficiencyBonusFromLevel(totalLevel || 1);

  const saveDc = (mod == null) ? null : (8 + prof + mod);
  const attackBonus = (mod == null) ? null : (prof + mod);

  return { ability, mod, prof, saveDc, attackBonus };
}

function inferSubclassSpellHooks(c) {
  // Hook data only (no enforcement yet).
  const db = getRulesDbFromWindow();
  const out = [];

  const classes = Array.isArray(c?.core?.classes) ? c.core.classes : (Array.isArray(c?.classes) ? c.classes : []);
  for (const cl of classes) {
    const id = (cl?.id || "").toString().trim().toLowerCase();
    const lvl = Number(cl?.level ?? 0) || 0;
    const subId = (cl?.subclassId || "").toString().trim();
    if (!id || !subId) continue;

    const sub = db?.subclasses?.get?.(subId) || null;
    const minLevel = Number(sub?.min_level ?? 0) || 0;
    if (minLevel && lvl < minLevel) continue;

    // We store the allowlist now; enforcement comes later.
    if (id === "rogue" && subId === "arcane_trickster") {
      out.push({ classId: id, subclassId: subId, allowedSchools: ["enchantment", "illusion"], note: "Arcane Trickster school restrictions (enforcement pending)" });
    }
    if (id === "fighter" && subId === "eldritch_knight") {
      out.push({ classId: id, subclassId: subId, allowedSchools: ["abjuration", "evocation"], note: "Eldritch Knight school restrictions (enforcement pending)" });
    }
  }

  return out;
}

function getClassLevel(c, classId) {
  const pairs = getClassLevelPairs(c);
  const id = (classId || "").toString().trim().toLowerCase();
  const hit = pairs.find(([cid]) => cid === id);
  return hit ? Number(hit[1]) || 0 : 0;
}

function preparedLimitForClass(c, classId) {
  const id = (classId || "").toString().trim().toLowerCase();
  const sc = inferSpellcastingStats(c);
  if (!sc.ability) return null;

  const scores = getAbilityScores(c);
  const mod = abilityModFromScore(scores?.[sc.ability]);
  if (mod == null) return null;

  const lvl = getClassLevel(c, id);
  if (!lvl) return null;

  // Soft v0 PHB-style prepared limits
  if (id === "wizard") return Math.max(1, mod + lvl);
  if (id === "cleric") return Math.max(1, mod + lvl);
  if (id === "druid") return Math.max(1, mod + lvl);
  if (id === "paladin") return Math.max(1, mod + Math.floor(lvl / 2));
  if (id === "artificer") return Math.max(1, mod + Math.floor(lvl / 2));

  return null;
}

function preparedLimitSummary(c) {
  const classes = Array.isArray(c?.core?.classes) ? c.core.classes : (Array.isArray(c?.classes) ? c.classes : []);
  const classIds = classes
    .map(x => (x?.id || "").toString().trim().toLowerCase())
    .filter(Boolean);

  const primary = classes.find(x => x?.isPrimary);
  const primaryId = primary?.id ? primary.id.toString().trim().toLowerCase() : null;

  const tryIds = [];
  if (primaryId) tryIds.push(primaryId);
  for (const id of classIds) if (!tryIds.includes(id)) tryIds.push(id);

  for (const id of tryIds) {
    const lim = preparedLimitForClass(c, id);
    if (lim != null) return { classId: id, limit: lim };
  }
  return null;
}

function getClassLevelPairs(c) {
  const out = [];

  // Multiclass-ready structures
  const arrays = [c?.classes, c?.core?.classes];
  for (const arr of arrays) {
    if (!Array.isArray(arr)) continue;
    for (const cl of arr) {
      if (!cl) continue;
      const id = (cl.id || cl.class_id || cl.name || "").toString().trim().toLowerCase();
      if (!id) continue;
      const lvl = Number(cl.level ?? cl.lvl ?? cl.levels ?? 0);
      if (!Number.isFinite(lvl) || lvl <= 0) continue;
      out.push([id, Math.floor(lvl)]);
    }
  }

  // Single-class legacy fields
  const oneId = (c?.core?.classId || c?.core?.class_id || c?.class_id || c?.class || c?.class_primary || c?.primary_class || "").toString().trim().toLowerCase();
  const oneLvl = Number(c?.core?.level ?? c?.level ?? c?.lvl ?? 0);
  if (oneId && Number.isFinite(oneLvl) && oneLvl > 0) out.push([oneId, Math.floor(oneLvl)]);

  // De-dup by id (sum levels)
  const map = new Map();
  for (const [id, lvl] of out) map.set(id, (map.get(id) || 0) + lvl);
  return Array.from(map.entries());
}

function getCastingProgressionForClass(classId) {
  const id = (classId || "").toString().trim().toLowerCase();

  // Prefer RulesDB if present
  const db = getRulesDbFromWindow();
  const cls = db?.classes;
  let rec = null;
  if (cls && typeof cls.get === "function") rec = cls.get(id) || cls.get(id.toUpperCase()) || null;
  else if (Array.isArray(cls)) rec = cls.find(r => (r?.id || r?.class_id || r?.name || "").toString().trim().toLowerCase() === id) || null;
  else if (cls && typeof cls === "object") rec = cls[id] || cls[id.toUpperCase()] || null;

  const raw = rec?.spellcasting_progression || rec?.spellcastingProgression || rec?.progression || rec?.caster_progression || rec?.casterProgression || null;
  if (raw) {
    const k = raw.toString().trim().toLowerCase();
    if (["full", "half", "third", "pact", "none"].includes(k)) return k;
  }

  // v0 fallback map (2014 PHB baseline)
  const map = {
    bard: "full",
    cleric: "full",
    druid: "full",
    sorcerer: "full",
    wizard: "full",

    paladin: "half",
    ranger: "half",
    artificer: "half", // special rounding handled separately

    rogue: "third",    // Arcane Trickster
    fighter: "third",  // Eldritch Knight

    warlock: "pact",
  };
  return map[id] || "none";
}

function standardSlotsByCasterLevel(casterLevel) {
  // Table: caster level 0..20 -> slots per spell level 1..9
  // Source: 5e multiclass spell slots table (PHB).
  const T = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,2,0,0,0,0,0,0,0,0],
    [0,3,0,0,0,0,0,0,0,0],
    [0,4,2,0,0,0,0,0,0,0],
    [0,4,3,0,0,0,0,0,0,0],
    [0,4,3,2,0,0,0,0,0,0],
    [0,4,3,3,0,0,0,0,0,0],
    [0,4,3,3,1,0,0,0,0,0],
    [0,4,3,3,2,0,0,0,0,0],
    [0,4,3,3,3,1,0,0,0,0],
    [0,4,3,3,3,2,0,0,0,0],
    [0,4,3,3,3,2,1,0,0,0],
    [0,4,3,3,3,2,1,0,0,0],
    [0,4,3,3,3,2,1,1,0,0],
    [0,4,3,3,3,2,1,1,0,0],
    [0,4,3,3,3,2,1,1,1,0],
    [0,4,3,3,3,2,1,1,1,0],
    [0,4,3,3,3,2,1,1,1,1],
    [0,4,3,3,3,3,1,1,1,1],
    [0,4,3,3,3,3,2,1,1,1],
    [0,4,3,3,3,3,2,2,1,1],
  ];

  const lvl = clamp(casterLevel, 0, 20);
  return T[lvl] || T[0];
}

function pactSlotsByWarlockLevel(warlockLevel) {
  // Table: warlock level 0..20 -> { max, level }
  // Source: Warlock Pact Magic table (PHB).
  const T = {
    0: { max: 0, level: 1 },
    1: { max: 1, level: 1 },
    2: { max: 2, level: 1 },
    3: { max: 2, level: 2 },
    4: { max: 2, level: 2 },
    5: { max: 2, level: 3 },
    6: { max: 2, level: 3 },
    7: { max: 2, level: 4 },
    8: { max: 2, level: 4 },
    9: { max: 2, level: 5 },
    10:{ max: 2, level: 5 },
    11:{ max: 3, level: 5 },
    12:{ max: 3, level: 5 },
    13:{ max: 3, level: 5 },
    14:{ max: 3, level: 5 },
    15:{ max: 3, level: 5 },
    16:{ max: 3, level: 5 },
    17:{ max: 4, level: 5 },
    18:{ max: 4, level: 5 },
    19:{ max: 4, level: 5 },
    20:{ max: 4, level: 5 },
  };
  const lvl = clamp(warlockLevel, 0, 20);
  return T[lvl] || T[0];
}

function computeAutoSlots(c) {
  const pairs = getClassLevelPairs(c);

  let casterLevel = 0;
  let warlockLevel = 0;

  // Third-caster subclasses (PHB): only count Rogue if Arcane Trickster, Fighter if Eldritch Knight.
  // Using floor((level + 2) / 3) matches the subclass tables for AT/EK.
  const classesArr = Array.isArray(c?.core?.classes) ? c.core.classes : (Array.isArray(c?.classes) ? c.classes : []);
  const subclassFor = (classId) => {
    const id = (classId || "").toString().trim().toLowerCase();
    const hit = classesArr.find(x => (x?.id || "").toString().trim().toLowerCase() === id);
    return (hit?.subclassId || hit?.subclass_id || "").toString().trim().toLowerCase();
  };

  for (const [id, lvl] of pairs) {
    const prog = getCastingProgressionForClass(id);

    if (prog === "pact") {
      if (id === "warlock") warlockLevel += lvl;
      continue;
    }

    if (prog === "full") {
      casterLevel += lvl;
      continue;
    }

    if (prog === "half") {
      if (id === "artificer") casterLevel += Math.ceil(lvl / 2);
      else casterLevel += Math.floor(lvl / 2);
      continue;
    }

    if (prog === "third") {
      // Enforce subclass-gated casting for Fighter/Rogue.
      if (id === "rogue") {
        const sub = subclassFor("rogue");
        if (sub !== "arcane_trickster") continue;
        if (lvl < 3) continue;
        casterLevel += Math.floor((lvl + 2) / 3);
        continue;
      }
      if (id === "fighter") {
        const sub = subclassFor("fighter");
        if (sub !== "eldritch_knight") continue;
        if (lvl < 3) continue;
        casterLevel += Math.floor((lvl + 2) / 3);
        continue;
      }

      casterLevel += Math.floor(lvl / 3);
      continue;
    }
  }

  casterLevel = clamp(casterLevel, 0, 20);
  warlockLevel = clamp(warlockLevel, 0, 20);

  const std = standardSlotsByCasterLevel(casterLevel);
  const pact = pactSlotsByWarlockLevel(warlockLevel);

  const levels = {};
  for (let i = 1; i <= 9; i++) levels[String(i)] = { max: std[i] || 0 };

  return {
    casterLevel,
    warlockLevel,
    levels,
    pact,
    hasAnyCasting: casterLevel > 0 || warlockLevel > 0,
  };
}

function slotsDiffer(current, auto) {
  if (!current) return true;
  for (let i = 1; i <= 9; i++) {
    const k = String(i);
    const cur = Number(current?.levels?.[k]?.max || 0);
    const want = Number(auto?.levels?.[k]?.max || 0);
    if (cur !== want) return true;
  }
  const pCurMax = Number(current?.pact?.max || 0);
  const pCurLvl = Number(current?.pact?.level || 1);
  const pWantMax = Number(auto?.pact?.max || 0);
  const pWantLvl = Number(auto?.pact?.level || 1);
  if (pCurMax !== pWantMax) return true;
  if (pCurLvl !== pWantLvl) return true;
  return false;
}

function hasWarlockClass(c) {
  try {
    const ids = inferCharacterClassIds(c);
    return ids.includes("warlock");
  } catch {
    return false;
  }
}

function renderSpellSlotsCard(c) {
  // v0: manual/auto entry; class-aware display only (Pact shown if Warlock present or pact.max>0)
  const showPact = hasWarlockClass(c) || (c.spell_slots?.pact?.max ?? 0) > 0;

  const sc = inferSpellcastingStats(c);

  const scBlock = sc.ability
    ? `
      <div class="card" style="padding: 10px; margin: 8px 0 10px 0;">
        <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
          <div style="min-width: 140px;"><strong>Spellcasting</strong></div>
          <div class="pill" style="padding: 4px 10px; border-radius: 999px;">Ability: <strong>${escapeHtml(sc.ability.toUpperCase())}</strong></div>
          ${sc.mod != null ? `<div class="pill" style="padding: 4px 10px; border-radius: 999px;">Mod: <strong>${sc.mod >= 0 ? "+" : ""}${escapeHtml(sc.mod)}</strong></div>` : ""}
          ${sc.saveDc != null ? `<div class="pill" style="padding: 4px 10px; border-radius: 999px;">Save DC: <strong>${escapeHtml(sc.saveDc)}</strong></div>` : ""}
          ${sc.attackBonus != null ? `<div class="pill" style="padding: 4px 10px; border-radius: 999px;">Attack: <strong>${sc.attackBonus >= 0 ? "+" : ""}${escapeHtml(sc.attackBonus)}</strong></div>` : ""}
        </div>
        <div class="hint" style="margin-top:6px;">Derived from ability scores + proficiency bonus (total character level).</div>
      </div>
    `
    : `
      <div class="hint" style="margin: 6px 0 10px 0;">No spellcasting ability detected (non-caster or missing abilities).</div>
    `;

  const pact = c.spell_slots?.pact || { max: 0, used: 0, level: 1 };

  const auto = computeAutoSlots(c);
  const scSummary = sc.ability
    ? ` | Spellcasting: ${sc.ability.toUpperCase()}${sc.mod != null ? ` (mod ${sc.mod >= 0 ? "+" : ""}${sc.mod})` : ""}${sc.saveDc != null ? ` | DC ${sc.saveDc}` : ""}${sc.attackBonus != null ? ` | Attack ${sc.attackBonus >= 0 ? "+" : ""}${sc.attackBonus}` : ""}`
    : "";
  const autoSummary = auto.hasAnyCasting
    ? `Auto: caster level ${auto.casterLevel}${auto.warlockLevel ? ", warlock " + auto.warlockLevel : ""}${scSummary}`
    : `Auto: no spellcasting slot progression detected for current class levels.${scSummary}`;

  const allRows = [];
  for (let lvl = 1; lvl <= 9; lvl++) {
    const k = String(lvl);
    const r = c.spell_slots?.levels?.[k] || { max: 0, used: 0 };
    allRows.push({ lvl, max: Number(r.max ?? 0) || 0, used: Number(r.used ?? 0) || 0 });
  }

  const relevantRows = allRows.filter(r => (r.max > 0) || (r.used > 0));
  const fallbackRows = relevantRows.length ? relevantRows : allRows.slice(0, 1);

  return `
    <section class="card" style="margin-top: 10px;">
      <h2>Spell Slots</h2>
      ${scBlock}

      <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin-bottom: 10px;">
        <button type="button" data-slot-reset="short">Short rest: reset Pact</button>
        <button type="button" data-slot-reset="long">Long rest: reset all</button>
        <button type="button" data-slot-auto="recalc">Recalculate max from class levels</button>
        <label style="display:flex; align-items:center; gap:6px; user-select:none;">
          <input id="slot_show_empty" type="checkbox" />
          <span>Show empty levels</span>
        </label>
        <span class="hint">v0: max slots can auto-fill from class levels (editable). Used slots can’t exceed max. <em>${escapeHtml(autoSummary)}</em></span>
      </div>

      ${showPact ? `
        <div class="card" style="padding: 10px; margin-bottom: 10px;">
          <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
            <div style="min-width:160px;"><strong>Pact Magic (Warlock)</strong></div>

            <div>
              <label class="hint" style="display:block;">Slot level</label>
              <input type="number" min="1" max="9" inputmode="numeric" data-pact-level="1" value="${escapeHtml(pact.level)}" style="width: 90px;" />
            </div>

            <div>
              <label class="hint" style="display:block;">Max</label>
              <input type="number" min="0" inputmode="numeric" data-pact-max="1" value="${escapeHtml(pact.max)}" style="width: 90px;" />
            </div>

            <div>
              <label class="hint" style="display:block;">Used</label>
              <div style="display:flex; gap:6px; align-items:center;">
                <button type="button" data-pact-used-delta="-1">−</button>
                <span data-pact-used="1" style="min-width: 2ch; text-align:center;">${escapeHtml(pact.used)}</span>
                <button type="button" data-pact-used-delta="+1">+</button>
              </div>
            </div>
          </div>
        </div>
      ` : ""}

      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Level</th>
              <th style="width: 120px;">Max</th>
              <th style="width: 180px;">Used</th>
            </tr>
          </thead>
          <tbody>
            ${(c.__slot_show_empty ? allRows : fallbackRows).map(r => `
              <tr data-slot-lvl="${r.lvl}">
                <td><strong>${r.lvl}</strong></td>
                <td>
                  <input type="number" min="0" inputmode="numeric" data-slot-max="1" data-slot-lvl="${r.lvl}" value="${escapeHtml(r.max)}" style="width: 100px;" />
                </td>
                <td>
                  <div style="display:flex; gap:6px; align-items:center;">
                    <button type="button" data-slot-used-delta="-1" data-slot-lvl="${r.lvl}">−</button>
                    <span data-slot-used="1" data-slot-lvl="${r.lvl}" style="min-width: 2ch; text-align:center;">${escapeHtml(r.used)}</span>
                    <button type="button" data-slot-used-delta="+1" data-slot-lvl="${r.lvl}">+</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function copySpellFields(src, dst) {
  dst.name = src.name;
  dst.level = src.level;
  dst.school = src.school;
  dst.ritual = src.ritual;
  dst.concentration = src.concentration;
  dst.source = src.source;
  dst.page = src.page;
  dst.spell_id = src.spell_id;
  dst.notes = src.notes;
}

function hasPrepared(c, id) {
  return Array.isArray(c.spells_prepared) && c.spells_prepared.some(s => s.id === id);
}

function emptySpell() {
  return {
    id: crypto.randomUUID(),
    spell_id: "",
    name: "",
    level: 0,
    school: "",
    ritual: false,
    concentration: false,
    source: "",
    page: "",
    notes: ""
  };
}

export function mountSpells({ root, getCharacter, onChange, getRulesDb }) {
  if (!root) throw new Error("mountSpells: root is required");
  if (typeof getCharacter !== "function") throw new Error("mountSpells: getCharacter must be a function");
  if (typeof onChange !== "function") throw new Error("mountSpells: onChange must be a function");
  const rulesDbGetter = typeof getRulesDb === "function" ? getRulesDb : () => null;

  let lastCharacter = null;
  let autoApplyingSlots = false;

  function inferCharacterClassIds(c) {
    const direct = [];

    if (c?.core?.classId) direct.push(c.core.classId);

    if (c?.class_primary) direct.push(c.class_primary);
    if (c?.primary_class) direct.push(c.primary_class);
    if (c?.core?.class_primary) direct.push(c.core.class_primary);
    if (c?.core?.primary_class) direct.push(c.core.primary_class);

    if (Array.isArray(c?.classes)) {
      for (const cl of c.classes) {
        if (!cl) continue;
        if (cl.id) direct.push(cl.id);
        else if (cl.class_id) direct.push(cl.class_id);
        else if (cl.name) direct.push(cl.name);
      }
    }

    if (Array.isArray(c?.core?.classes)) {
      for (const cl of c.core.classes) {
        if (!cl) continue;
        if (cl.id) direct.push(cl.id);
        else if (cl.class_id) direct.push(cl.class_id);
        else if (cl.name) direct.push(cl.name);
      }
    }

    if (c?.class) direct.push(c.class);
    if (c?.core?.class) direct.push(c.core.class);
    if (c?.class_id) direct.push(c.class_id);
    if (c?.core?.class_id) direct.push(c.core.class_id);

    const cleaned = direct
      .map(x => (x ?? "").toString().trim().toLowerCase())
      .filter(Boolean);

    const map = {
      "fighter": "fighter",
      "wizard": "wizard",
      "cleric": "cleric",
      "druid": "druid",
      "rogue": "rogue",
      "ranger": "ranger",
      "paladin": "paladin",
      "bard": "bard",
      "sorcerer": "sorcerer",
      "warlock": "warlock",
      "monk": "monk",
      "barbarian": "barbarian",
      "artificer": "artificer"
    };

    return [...new Set(cleaned.map(v => map[v] || v))];
  }

  function renderSpellSelector(c) {
    const db = rulesDbGetter();
    if (!db?.spells?.search) {
      return `
        <div class="hint" style="margin: 8px 0;">
          Rules dataset not loaded. You can still add spells manually.
        </div>
      `;
    }

    const classIds = inferCharacterClassIds(c);
    const classHint = classIds.length
      ? `Filtering by class: <strong>${escapeHtml(classIds.join(", "))}</strong> (toggle override to show all).`
      : `No class found on this character yet. Search will show all spells.`;

    return `
      <div class="card" style="margin: 8px 0; padding: 10px;">
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:end;">
          <div style="min-width: 220px; flex: 1;">
            <label class="hint" for="spell_sel_q" style="display:block; margin-bottom:4px;">Find a spell</label>
            <input id="spell_sel_q" type="text" placeholder="Search spells…" />
          </div>

          <div style="width: 120px;">
            <label class="hint" for="spell_sel_level" style="display:block; margin-bottom:4px;">Level</label>
            <select id="spell_sel_level">
              <option value="">Any</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <label style="display:flex; align-items:center; gap:6px; user-select:none;">
              <input id="spell_sel_all" type="checkbox" />
              <span>Show all spells (override)</span>
            </label>
          </div>
        </div>

        <div class="hint" style="margin-top:6px;">${classHint}</div>

        <div id="spell_sel_results" style="margin-top:8px;"></div>
      </div>
    `;
  }

  function applyUpdate(mutator) {
    const current = getCharacter();
    if (!current) return;

    const next = structuredClone(current);
    mutator(next);
    if (next.meta) next.meta.modified_utc = nowIso();
    lastCharacter = next;
    onChange(next);
  }

  function promptEditSpellFlow(spell, { isNew = false } = {}) {
    // Cancel on first prompt aborts without changes (required).
    const name = window.prompt("Spell name:", spell.name || "");
    if (name == null) return null;

    const lvlRaw = window.prompt("Spell level (0–9):", String(spell.level ?? 0));
    // If user cancels level prompt, keep existing
    let level = spell.level ?? 0;
    if (lvlRaw != null) {
      const n = Number(lvlRaw);
      level = Number.isFinite(n) ? clamp(Math.round(n), 0, 9) : (spell.level ?? 0);
    }

    const school = window.prompt("School (e.g., Evocation):", spell.school || "");
    const source = window.prompt("Source (e.g., PHB, XGtE, TCoE):", spell.source || "");
    const page = window.prompt("Page (e.g., 242):", spell.page || "");
    const notes = window.prompt("Notes (optional):", spell.notes || "");

    const out = structuredClone(spell);
    out.name = (name ?? "").toString().trim();
    out.level = level;
    if (school != null) out.school = school.toString().trim();
    if (source != null) out.source = source.toString().trim();
    if (page != null) out.page = page.toString().trim();
    if (notes != null) out.notes = notes.toString().trim();
    return out;
  }

  function openSpellEditModal(rowNow, { isNew = false } = {}) {
    const opener = window?.__codex?.ui?.openSpellEditDialog;

    // Fallback (should be rare): use the prompt-based flow.
    if (typeof opener !== "function") {
      const edited = promptEditSpellFlow(rowNow, { isNew });
      if (!edited) return null;
      return { mode: "sync", edited };
    }

    return { mode: "modal", opener };
  }

  function applySpellEdits({ next, id, edited }) {
    normaliseSpells(next);
    const row = next.spells_known.find(s => s.id === id);
    if (!row) return;

    // Only update the stable v1 fields we actually store/render.
    row.name = (edited.name ?? "").toString().trim();
    row.level = Number.isFinite(Number(edited.level)) ? clamp(Number(edited.level), 0, 9) : (row.level ?? 0);
    row.school = (edited.school ?? "").toString().trim();
    row.source = (edited.source ?? "").toString().trim();
    row.page = (edited.page ?? "").toString().trim();
    row.notes = (edited.notes ?? "").toString().trim();

    // If user made this a cantrip, ensure it's not prepared.
    if (Number(row.level) === 0) {
      next.spells_prepared = next.spells_prepared.filter(s => s.id !== id);
    } else {
      // Keep prepared copy in sync if it exists
      const p = next.spells_prepared.find(s => s.id === id);
      if (p) copySpellFields(row, p);
    }
  }

  function startSpellEdit(rowNow, { isNew = false } = {}) {
    const open = openSpellEditModal(rowNow, { isNew });

    // Prompt fallback returns an edited object synchronously
    if (open && open.mode === "sync") {
      const edited = open.edited;
      if (!edited || !edited.name || !edited.name.trim()) {
        // If this was a new row and user blanked it out, treat as cancel.
        if (isNew) {
          applyUpdate((next) => {
            normaliseSpells(next);
            next.spells_known = next.spells_known.filter(s => s.id !== rowNow.id);
            next.spells_prepared = next.spells_prepared.filter(s => s.id !== rowNow.id);
          });
          render();
        }
        return;
      }

      applyUpdate((next) => applySpellEdits({ next, id: rowNow.id, edited }));
      render();
      return;
    }

    // Modal path
    if (!open || open.mode !== "modal") return;

    const opener = open.opener;
    opener({
      spell: {
        name: rowNow.name,
        level: rowNow.level,
        school: rowNow.school,
        source: rowNow.source,
        page: rowNow.page,
        notes: rowNow.notes,
      },
      title: isNew ? "Add Spell" : `Edit: ${(rowNow.name || "Spell").toString()}`,
      onSave: (edited) => {
        // Require name
        if (!edited?.name || !edited.name.toString().trim()) {
          if (isNew) {
            applyUpdate((next) => {
              normaliseSpells(next);
              next.spells_known = next.spells_known.filter(s => s.id !== rowNow.id);
              next.spells_prepared = next.spells_prepared.filter(s => s.id !== rowNow.id);
            });
            render();
          }
          return;
        }

        applyUpdate((next) => applySpellEdits({ next, id: rowNow.id, edited }));
        render();
      },
      onCancel: () => {
        if (!isNew) return;
        // Cancel on a new row removes it (matches previous behaviour).
        applyUpdate((next) => {
          normaliseSpells(next);
          next.spells_known = next.spells_known.filter(s => s.id !== rowNow.id);
          next.spells_prepared = next.spells_prepared.filter(s => s.id !== rowNow.id);
        });
        render();
      }
    });
  }

  function sourceCell(sp) {
    const a = (sp?.source || "").toString().trim();
    const b = (sp?.page || "").toString().trim();
    if (a && b) return `${escapeHtml(a)} p.${escapeHtml(b)}`;
    if (a) return `${escapeHtml(a)}`;
    if (b) return `p.${escapeHtml(b)}`;
    return "";
  }

  function renderTable(c, list, key, opts = {}) {
    if (list.length === 0) return `<p class="hint">No spells in this list.</p>`;

    const showPreparedColumn =
      opts && typeof opts.showPreparedColumn === "boolean"
        ? opts.showPreparedColumn
        : (key === "spells_known");

    const allowPreparedToggle =
      opts && typeof opts.allowPreparedToggle === "boolean"
        ? opts.allowPreparedToggle
        : (key === "spells_known");

    // === Known table: TEXT + TOGGLES ===
    if (key === "spells_known") {
      return `
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Lvl</th>
              <th>School</th>
              <th>Ritual</th>
              <th>Conc.</th>
              ${showPreparedColumn ? "<th>Prepared</th>" : ""}
              <th>Source</th>
              <th>Notes</th>
              <th style="width: 150px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(sp => {
              const isCantrip = Number(sp.level) === 0;
              return `
                <tr data-spell-id="${escapeHtml(sp.id)}">
                  <td><strong>${escapeHtml(sp.name || "(unnamed)")}</strong></td>
                  <td>${escapeHtml(sp.level)}</td>
                  <td>${escapeHtml(sp.school || "")}</td>
                  <td>
                    <input data-spell-field="ritual" type="checkbox" ${sp.ritual ? "checked" : ""} />
                  </td>
                  <td>
                    <input data-spell-field="concentration" type="checkbox" ${sp.concentration ? "checked" : ""} />
                  </td>
                  ${showPreparedColumn ? `
                    <td>
                      ${isCantrip || !allowPreparedToggle ? `<span class="hint">—</span>` : `
                        <input
                          type="checkbox"
                          data-prep-toggle="1"
                          data-prep-id="${escapeHtml(sp.id)}"
                          ${hasPrepared(c, sp.id) ? "checked" : ""}
                        />
                      `}
                    </td>
                  ` : ""}
                  <td>${sourceCell(sp)}</td>
                  <td><span class="hint">${escapeHtml(sp.notes || "")}</span></td>
                  <td>
                    <button type="button" data-spell-action="edit">Edit</button>
                    <button type="button" data-spell-action="del">Delete</button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `;
    }

    // === Prepared table: keep existing read-only inputs (works, minimal change risk) ===
    return `
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Lvl</th>
            <th>School</th>
            <th>Ritual</th>
            <th>Conc.</th>
            ${showPreparedColumn ? "<th>Prepared</th>" : ""}
            <th>Source</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(sp => `
            <tr data-spell-id="${escapeHtml(sp.id)}">
              <td><input data-spell-field="name" type="text" value="${escapeHtml(sp.name)}" disabled /></td>
              <td><input data-spell-field="level" type="number" inputmode="numeric" value="${sp.level}" disabled /></td>
              <td><input data-spell-field="school" type="text" value="${escapeHtml(sp.school)}" disabled /></td>
              <td><input data-spell-field="ritual" type="checkbox" ${sp.ritual ? "checked" : ""} disabled /></td>
              <td><input data-spell-field="concentration" type="checkbox" ${sp.concentration ? "checked" : ""} disabled /></td>
              ${showPreparedColumn ? `<td><span class="hint">—</span></td>` : ""}
              <td>
                <input data-spell-field="source" type="text" value="${escapeHtml(sp.source)}" disabled style="width: 120px;" />
                <input data-spell-field="page" type="text" value="${escapeHtml(sp.page)}" disabled style="width: 70px; margin-left: 6px;" placeholder="p." />
              </td>
              <td><input data-spell-field="notes" type="text" value="${escapeHtml(sp.notes)}" disabled /></td>
              <td></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function render() {
    const c = lastCharacter || getCharacter();
    if (!c) {
      root.innerHTML = "";
      return;
    }

    normaliseSpells(c);
    normaliseSpellSlots(c);

    const subclassHooks = inferSubclassSpellHooks(c);
    const prepInfo = preparedLimitSummary(c);

    if (!autoApplyingSlots && c?.spell_slots?.auto === true) {
      const auto = computeAutoSlots(c);
      if (auto.hasAnyCasting && slotsDiffer(c.spell_slots, auto)) {
        autoApplyingSlots = true;
        applyUpdate((next) => {
          normaliseSpellSlots(next);
          for (let i = 1; i <= 9; i++) {
            const k = String(i);
            next.spell_slots.levels[k].max = Number(auto.levels[k].max) || 0;
            if (next.spell_slots.levels[k].used > next.spell_slots.levels[k].max) {
              next.spell_slots.levels[k].used = next.spell_slots.levels[k].max;
            }
          }
          next.spell_slots.pact.max = Number(auto.pact.max) || 0;
          next.spell_slots.pact.level = Number(auto.pact.level) || 1;
          if (next.spell_slots.pact.used > next.spell_slots.pact.max) next.spell_slots.pact.used = next.spell_slots.pact.max;
        });
        autoApplyingSlots = false;
        return render();
      }
    }

    const listKey = activeTab === "known" ? "spells_known" : "spells_prepared";
    let list, cantrips = [], slottedSpells = [];
    if (activeTab === "known") {
      list = c.spells_known;
      cantrips = list.filter(sp => Number(sp.level) === 0);
      slottedSpells = list.filter(sp => Number(sp.level) > 0);
    } else {
      list = Array.isArray(c.spells_prepared) ? c.spells_prepared.filter(s => Number(s?.level) > 0) : [];
      slottedSpells = list;
      cantrips = [];
    }
    const isReadOnly = listKey === "spells_prepared";

    root.innerHTML = `
      <section class="card">
        <h2>Spells</h2>
        ${subclassHooks.length ? `<div class="hint" style="margin-top:4px;">${escapeHtml(subclassHooks.map(h => h.note).join(" • "))}</div>` : ""}

        <div style="margin-bottom: 8px;">
          <button type="button" data-tab="known" ${activeTab === "known" ? "disabled" : ""}>Known</button>
          <button type="button" data-tab="prepared" ${activeTab === "prepared" ? "disabled" : ""}>Prepared</button>
        </div>

        <div style="margin-bottom: 8px;">
          <button id="spell_add" type="button" ${isReadOnly ? "disabled" : ""}>Add custom spell</button>
        </div>

        ${activeTab === "prepared" && prepInfo ? (() => {
          const used = Array.isArray(c.spells_prepared) ? c.spells_prepared.filter(s => Number(s?.level) > 0).length : 0;
          const lim = prepInfo.limit;
          const over = used > lim;
          return `<div class="hint" style="margin: 6px 0 10px 0;">Prepared spells: <strong>${used}</strong> / <strong>${lim}</strong> (${escapeHtml(prepInfo.classId)}). ${over ? `<span style="font-weight:700;">Over limit.</span>` : ""}</div>`;
        })() : ""}

        ${!isReadOnly ? renderSpellSelector(c) : ""}
        ${!isReadOnly ? renderSpellSlotsCard(c) : ""}

        ${
          activeTab === "known"
            ? `
          <h3>Cantrips</h3>
          ${
            cantrips.length === 0
              ? `<div class="hint">No cantrips known.</div>`
              : `
                <div>
                  ${cantrips.map(sp => `
                    <div class="cantrip-row" style="margin-bottom:6px;">
                      <strong>${escapeHtml(sp.name)}</strong>
                      ${sp.school ? `<span class="pill">${escapeHtml(sp.school)}</span>` : ""}
                      <span class="hint">
                        ${sp.source ? `${escapeHtml(sp.source)}` : ""}
                        ${sp.page ? ` p.${escapeHtml(sp.page)}` : ""}
                      </span>
                    </div>
                  `).join("")}
                </div>
              `
          }
          <h3>Spells (Level 1+)</h3>
          ${renderTable(c, slottedSpells, "spells_known", { showPreparedColumn: true, allowPreparedToggle: true })}
        `
            : renderTable(c, slottedSpells, "spells_prepared")
        }
      </section>
    `;

    root.querySelectorAll("button[data-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        activeTab = btn.getAttribute("data-tab");
        render();
      });
    });

    const showEmpty = root.querySelector("#slot_show_empty");
    if (showEmpty) {
      showEmpty.checked = Boolean(c.__slot_show_empty);
      showEmpty.addEventListener("change", () => {
        if (lastCharacter) lastCharacter.__slot_show_empty = showEmpty.checked;
        else c.__slot_show_empty = showEmpty.checked;
        render();
      });
    }

    if (!isReadOnly) {
      root.querySelector("#spell_add").addEventListener("click", () => {
        // Create row then immediately prompt for details; cancel removes the row.
        const newId = crypto.randomUUID();
        applyUpdate((next) => {
          normaliseSpells(next);
          const row = emptySpell();
          row.id = newId;
          next.spells_known.push(row);
        });

        // Use the updated state to edit
        const after = lastCharacter || getCharacter();
        const rowNow = after?.spells_known?.find(s => s.id === newId) || null;
        if (!rowNow) return;

        // Open the modal editor (or prompt fallback) for the new row.
        startSpellEdit(rowNow, { isNew: true });
        return;
      });
    }

    // Selector-based add (RulesDB) - Known tab only
    if (!isReadOnly) {
      const dbNow = rulesDbGetter();
      const qEl = root.querySelector("#spell_sel_q");
      const lvlEl = root.querySelector("#spell_sel_level");
      const allEl = root.querySelector("#spell_sel_all");
      const resEl = root.querySelector("#spell_sel_results");

      const classIds = inferCharacterClassIds(c);
      const resultsCache = new Map();

      function renderResults() {
        if (!resEl) return;
        if (!dbNow?.spells?.search) {
          resEl.innerHTML = "";
          return;
        }

        const query = qEl ? qEl.value : "";
        const levelVal = lvlEl ? lvlEl.value : "";
        const showAll = allEl ? allEl.checked : false;

        const filters = {};
        if (levelVal !== "") filters.level = Number(levelVal);
        if (!showAll && classIds.length) filters.classes = classIds;

        const results = dbNow.spells.search(query, filters).slice(0, 20);

        resultsCache.clear();
        for (const sp of results) {
          if (sp?.id) resultsCache.set(String(sp.id), sp);
        }

        if (!query && levelVal === "" && !showAll) {
          resEl.innerHTML = `<p class="hint">Type a search term to find spells, or turn on “Show all spells”.</p>`;
          return;
        }

        if (results.length === 0) {
          resEl.innerHTML = `<p class="hint">No matches.</p>`;
          return;
        }

        resEl.innerHTML = `
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Lvl</th>
                <th>School</th>
                <th>Ritual</th>
                <th>Conc.</th>
                <th>Source</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${results.map(sp => `
                <tr data-rule-spell-id="${encodeURIComponent(sp.id)}">
                  <td>${escapeHtml(sp.name)}</td>
                  <td>${escapeHtml(sp.level)}</td>
                  <td>${escapeHtml(sp.school)}</td>
                  <td>${sp.ritual ? "Yes" : ""}</td>
                  <td>${sp.concentration ? "Yes" : ""}</td>
                  <td>${escapeHtml(sp.source)} ${sp.page ? `(p.${escapeHtml(sp.page)})` : ""}</td>
                  <td><button type="button" data-add-rule-spell="1">Add</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `;

        if (!resEl.__addRuleSpellBound) {
          resEl.addEventListener("click", (e) => {
            const btn = e.target?.closest?.("button[data-add-rule-spell]");
            if (!btn) return;

            const tr = btn.closest("tr[data-rule-spell-id]");
            if (!tr) return;

            const ruleId = decodeURIComponent(tr.getAttribute("data-rule-spell-id") || "");
            if (!ruleId) return;

            const rec = resultsCache.get(String(ruleId)) || null;
            if (!rec) {
              console.warn("Add spell failed: record not found in current results cache for id", ruleId);
              return;
            }

            applyUpdate((next) => {
              normaliseSpells(next);

              const already = next.spells_known.some((s) => s.spell_id && s.spell_id === rec.id);
              if (already) return;

              const row = emptySpell();
              row.spell_id = rec.id;
              row.name = rec.name;
              row.level = Number(rec.level) || 0;
              row.school = rec.school || "";
              row.ritual = Boolean(rec.ritual);
              row.concentration = Boolean(rec.concentration);
              row.source = rec.source || "";
              row.page = rec.page || "";

              next.spells_known.push(row);
            });

            render();
          });
          resEl.__addRuleSpellBound = true;
        }
      }

      if (qEl) qEl.addEventListener("input", renderResults);
      if (lvlEl) lvlEl.addEventListener("change", renderResults);
      if (allEl) allEl.addEventListener("change", renderResults);

      renderResults();
    }

    // Wire spell row events
    root.querySelectorAll("tr[data-spell-id]").forEach(tr => {
      const id = tr.getAttribute("data-spell-id");

      if (!isReadOnly) {
        // Only ritual/concentration are editable inline now (Known table).
        tr.querySelectorAll("input[data-spell-field]").forEach(input => {
          const field = input.getAttribute("data-spell-field");
          input.addEventListener("change", () => {
            applyUpdate((next) => {
              normaliseSpells(next);
              const row = next.spells_known.find(s => s.id === id);
              if (!row) return;

              if (input.type === "checkbox") row[field] = input.checked;
            });
          });
        });

        // Edit button (Known only)
        const editBtn = tr.querySelector("button[data-spell-action='edit']");
        if (editBtn) {
          editBtn.addEventListener("click", () => {
            const current = lastCharacter || getCharacter();
            const rowNow = current?.spells_known?.find(s => s.id === id) || null;
            if (!rowNow) return;

            startSpellEdit(rowNow, { isNew: false });
            return;
          });
        }
      }

      // Prepared toggle (Known tab only)
      const prepToggle = tr.querySelector("input[data-prep-toggle]");
      if (prepToggle) {
        prepToggle.addEventListener("change", () => {
          const prepId = prepToggle.getAttribute("data-prep-id");
          const shouldBePrepared = prepToggle.checked;

          applyUpdate((next) => {
            normaliseSpells(next);

            const known = next.spells_known.find(s => s.id === prepId);
            if (!known) return;

            // Cantrips (level 0) are never “prepared”.
            if (Number(known.level) === 0) {
              next.spells_prepared = next.spells_prepared.filter(s => s.id !== prepId);
              return;
            }

            if (shouldBePrepared) {
              if (!next.spells_prepared.some(s => s.id === prepId)) {
                const copy = structuredClone(known);
                next.spells_prepared.push(copy);
              } else {
                const p = next.spells_prepared.find(s => s.id === prepId);
                if (p) copySpellFields(known, p);
              }
            } else {
              next.spells_prepared = next.spells_prepared.filter(s => s.id !== prepId);
            }
          });

          render();
        });
      }

      const delBtn = tr.querySelector("button[data-spell-action='del']");
      if (delBtn && !isReadOnly) {
        delBtn.addEventListener("click", () => {
          applyUpdate((next) => {
            normaliseSpells(next);
            next.spells_known = next.spells_known.filter(s => s.id !== id);
            next.spells_prepared = next.spells_prepared.filter(s => s.id !== id);
          });
          render();
        });
      }
    });

    // Spell slot tracker wiring (Known tab only)
    if (!isReadOnly) {
      root.querySelectorAll("input[data-slot-max]").forEach((inp) => {
        inp.addEventListener("input", () => {
          const lvl = inp.getAttribute("data-slot-lvl");
          applyUpdate((next) => {
            next.spell_slots.auto = false;
            normaliseSpellSlots(next);
            const k = String(lvl);
            const row = next.spell_slots.levels[k];
            row.max = Math.max(0, Number(inp.value) || 0);
            if (row.used > row.max) row.used = row.max;
          });
          render();
        });
      });

      root.querySelectorAll("button[data-slot-used-delta]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const lvl = btn.getAttribute("data-slot-lvl");
          const delta = Number(btn.getAttribute("data-slot-used-delta")) || 0;
          applyUpdate((next) => {
            normaliseSpellSlots(next);
            const k = String(lvl);
            const row = next.spell_slots.levels[k];
            row.used = clamp((row.used || 0) + delta, 0, row.max || 0);
          });
          render();
        });
      });

      const pactMax = root.querySelector("input[data-pact-max]");
      const pactLevel = root.querySelector("input[data-pact-level]");

      if (pactMax) {
        pactMax.addEventListener("input", () => {
          applyUpdate((next) => {
            normaliseSpellSlots(next);
            next.spell_slots.auto = false;
            next.spell_slots.pact.max = Math.max(0, Number(pactMax.value) || 0);
            if (next.spell_slots.pact.used > next.spell_slots.pact.max) next.spell_slots.pact.used = next.spell_slots.pact.max;
          });
          render();
        });
      }

      if (pactLevel) {
        pactLevel.addEventListener("input", () => {
          applyUpdate((next) => {
            normaliseSpellSlots(next);
            next.spell_slots.pact.level = clamp(Number(pactLevel.value) || 1, 1, 9);
          });
          render();
        });
      }

      root.querySelectorAll("button[data-pact-used-delta]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const delta = Number(btn.getAttribute("data-pact-used-delta")) || 0;
          applyUpdate((next) => {
            normaliseSpellSlots(next);
            const p = next.spell_slots.pact;
            p.used = clamp((p.used || 0) + delta, 0, p.max || 0);
          });
          render();
        });
      });

      root.querySelectorAll("button[data-slot-reset]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const kind = btn.getAttribute("data-slot-reset");
          applyUpdate((next) => {
            normaliseSpellSlots(next);
            if (kind === "short") {
              next.spell_slots.pact.used = 0;
            } else {
              for (let i = 1; i <= 9; i++) {
                next.spell_slots.levels[String(i)].used = 0;
              }
              next.spell_slots.pact.used = 0;
            }
          });
          render();
        });
      });

      root.querySelectorAll("button[data-slot-auto]").forEach((btn) => {
        btn.addEventListener("click", () => {
          applyUpdate((next) => {
            normaliseSpellSlots(next);
            next.spell_slots.auto = true;
          });
          render();
        });
      });

      lastCharacter = null;
    }
  }

  let activeTab = "known";
  return { render };
}