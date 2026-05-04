function esc(v) {
  return (v ?? "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function asInt(v, fallback = 0) {
  const n = Number.parseInt((v ?? "").toString(), 10);
  return Number.isFinite(n) ? n : fallback;
}

function norm(v) {
  return (v ?? "").toString().trim().toLowerCase();
}

function toBoolFlag(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  const s = norm(v);
  if (!s) return false;
  return ["true", "yes", "y", "1", "concentration", "required"].includes(s);
}

function optionList(items, selected, placeholder) {
  const selectedNorm = norm(selected);
  const options = [`<option value="">${esc(placeholder)}</option>`];
  for (const item of items || []) {
    const id = (item?.id || "").toString();
    if (!id) continue;
    const sel = norm(id) === selectedNorm ? "selected" : "";
    options.push(`<option value="${esc(id)}" ${sel}>${esc(item?.name || id)}</option>`);
  }
  if (selected && !options.join("").includes(`value=\"${esc(selected)}\"`)) {
    options.push(`<option value="${esc(selected)}" selected>${esc(selected)} (custom)</option>`);
  }
  return options.join("");
}

function subclassOptions(items, classId) {
  const selectedClass = norm(classId);
  return (items || [])
    .filter((row) => norm(row?.class_id) === selectedClass)
    .map((row) => `<option value="${esc(row?.id || "")}">${esc(row?.name || row?.id || "")} (${esc(row?.source || "UNKNOWN")})</option>`)
    .join("");
}

function isTypingTarget(el) {
  if (!el) return false;
  const tag = (el.tagName || "").toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
}

function elementPathWithinRoot(el, root) {
  if (!el || !root || !root.contains(el)) return "";
  const parts = [];
  let node = el;
  while (node && node !== root) {
    const parent = node.parentElement;
    if (!parent) break;
    const idx = Array.from(parent.children).indexOf(node);
    parts.push(`${node.tagName}:${idx}`);
    node = parent;
  }
  return parts.reverse().join(">");
}

function queryByElementPath(root, path) {
  if (!root || !path) return null;
  let node = root;
  const steps = path.split(">");
  for (const step of steps) {
    const [tag, idxRaw] = step.split(":");
    const idx = asInt(idxRaw, -1);
    if (!node || !Number.isInteger(idx) || idx < 0) return null;
    const child = node.children[idx];
    if (!child || child.tagName !== tag) return null;
    node = child;
  }
  return node;
}

function makeSpellId(spell) {
  return (spell?.id || spell?.spell_id || spell?.name || crypto.randomUUID()).toString();
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function hexToRgbTriplet(hex, fallback = "253 249 239") {
  const raw = (hex || "").toString().trim();
  const m = raw.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = m[1];
  const r = Number.parseInt(n.slice(0, 2), 16);
  const g = Number.parseInt(n.slice(2, 4), 16);
  const b = Number.parseInt(n.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function hexToRgb(hex) {
  const raw = (hex || "").toString().trim();
  const m = raw.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  const n = m[1];
  return {
    r: Number.parseInt(n.slice(0, 2), 16),
    g: Number.parseInt(n.slice(2, 4), 16),
    b: Number.parseInt(n.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  const clampByte = (x) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, "0");
  return `#${clampByte(r)}${clampByte(g)}${clampByte(b)}`;
}

function blendHex(a, b, ratio = 0.5) {
  const c1 = hexToRgb(a);
  const c2 = hexToRgb(b);
  if (!c1 || !c2) return a || b || "#000000";
  const t = clamp(Number(ratio) || 0, 0, 1);
  return rgbToHex({
    r: c1.r + ((c2.r - c1.r) * t),
    g: c1.g + ((c2.g - c1.g) * t),
    b: c1.b + ((c2.b - c1.b) * t)
  });
}

function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  const toLin = (n) => {
    const v = n / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const r = toLin(rgb.r);
  const g = toLin(rgb.g);
  const b = toLin(rgb.b);
  return (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
}

function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

function ensureContrast(fg, bg, minRatio = 4.5) {
  let out = fg;
  let attempts = 0;
  while (contrastRatio(out, bg) < minRatio && attempts < 20) {
    const darken = relativeLuminance(out) >= relativeLuminance(bg);
    out = blendHex(out, darken ? "#101010" : "#f8f4e8", 0.12);
    attempts += 1;
  }
  return out;
}

function titleizeId(v) {
  return (v || "")
    .toString()
    .trim()
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((x) => x[0].toUpperCase() + x.slice(1))
    .join(" ");
}

const APPEARANCE_DEFAULTS = {
  bg: "#eee7d8",
  bgNoise: "#f6f1e6",
  paper: "#fdf9ef",
  paper2: "#f8f0dd",
  ink: "#2e2418",
  inkSoft: "#6d5a41",
  line: "#d6c7a8",
  accent: "#2c5f52",
  accent2: "#8b3a2f",
  ok: "#2f6f49",
  warn: "#9a6b1d",
  err: "#8f2f2f",
  surfaceAlpha: 0.9,
  shadowOpacity: 0.12,
  shadowBlur: 28
};

const APPEARANCE_FIELDS = [
  ["bg", "Background"],
  ["bgNoise", "Background Glow"],
  ["paper", "Surface Base"],
  ["paper2", "Surface Alt"],
  ["ink", "Primary Ink"],
  ["inkSoft", "Secondary Ink"],
  ["line", "Borders"],
  ["accent", "Accent"],
  ["accent2", "Accent Alt"],
  ["ok", "Success"],
  ["warn", "Warning"],
  ["err", "Error"]
];

const CLASS_THEME_BASE = {
  artificer: { accent: "#3b6f78", accent2: "#9a6f2f", ok: "#2f6f55", warn: "#a06a2d", err: "#914646", paper: "#f8f2e4", paper2: "#efe3cc" },
  barbarian: { accent: "#7a3a2a", accent2: "#a06a36", ok: "#42613f", warn: "#a56a1d", err: "#8f2f2f", paper: "#f8efe2", paper2: "#f0dfca" },
  bard: { accent: "#5c3a73", accent2: "#97682e", ok: "#3f6a57", warn: "#a1722c", err: "#7f3450", paper: "#f9f0e8", paper2: "#f1e1d4" },
  cleric: { accent: "#466b74", accent2: "#9f7a36", ok: "#3d6e5a", warn: "#9f7828", err: "#8b3d3d", paper: "#f8f3e8", paper2: "#eee4d3" },
  druid: { accent: "#44664a", accent2: "#8e6a3c", ok: "#2f6f49", warn: "#9a6b1d", err: "#8f3a2f", paper: "#f4efe0", paper2: "#e8ddc4" },
  fighter: { accent: "#3d5b66", accent2: "#7f3f2e", ok: "#3e694f", warn: "#91662b", err: "#7a3131", paper: "#f4f0e7", paper2: "#e8dfcf" },
  monk: { accent: "#5f5a46", accent2: "#8a6d3f", ok: "#3e6b54", warn: "#9b7425", err: "#8d3c2f", paper: "#f7f2e7", paper2: "#ece2d1" },
  paladin: { accent: "#395a77", accent2: "#b08a3a", ok: "#3b7058", warn: "#a37d2f", err: "#8a3535", paper: "#f7f1e4", paper2: "#ece0ca" },
  ranger: { accent: "#3f634b", accent2: "#876736", ok: "#2f6a46", warn: "#8f6823", err: "#7e3a30", paper: "#f3eee0", paper2: "#e7dcc4" },
  rogue: { accent: "#4d4e55", accent2: "#7a5e3f", ok: "#3d6550", warn: "#8a6427", err: "#7a2f39", paper: "#f2ede3", paper2: "#e6dccf" },
  sorcerer: { accent: "#5f3f76", accent2: "#99543a", ok: "#3a6755", warn: "#9b652a", err: "#8a3352", paper: "#f8efe8", paper2: "#efe0d5" },
  warlock: { accent: "#3e385f", accent2: "#8b4a38", ok: "#345f50", warn: "#8f6028", err: "#742f47", paper: "#f3ecdf", paper2: "#e6dac9" },
  wizard: { accent: "#3c4f79", accent2: "#91633a", ok: "#356752", warn: "#916728", err: "#7f3450", paper: "#f5efe6", paper2: "#e9dece" }
};

const SPECIES_FAMILY_ACCENT = {
  draconic: { primary: "#9d6b2f", secondary: "#7e3b2a", glow: "#d8b87a", chip: "#f3e6ca" },
  infernal: { primary: "#8f3a4d", secondary: "#5a345f", glow: "#d2a6b2", chip: "#f0d9de" },
  celestial: { primary: "#8f7a36", secondary: "#4d6b74", glow: "#dfd5a6", chip: "#f3efd8" },
  fey: { primary: "#5f6f44", secondary: "#6a4f78", glow: "#c7dca7", chip: "#e8f0d8" },
  elfkin: { primary: "#4f6e67", secondary: "#6a5078", glow: "#b9d4cf", chip: "#e0eee9" },
  dwarven: { primary: "#6b5943", secondary: "#4d5f66", glow: "#cdbda8", chip: "#ebe3d8" },
  goblinoid: { primary: "#5f6a39", secondary: "#6f4a35", glow: "#c5cf9b", chip: "#e6ebd0" },
  planar: { primary: "#3f6880", secondary: "#6d5b91", glow: "#b1cad9", chip: "#dae8ef" },
  folk: { primary: "#6a604d", secondary: "#4f6a63", glow: "#d3c9b5", chip: "#ece7dc" }
};

const SPECIES_TO_FAMILY = {
  dragonborn: "draconic", kobold: "draconic", lizardfolk: "draconic", yuan_ti: "draconic",
  tiefling: "infernal", aasimar: "celestial",
  eladrin: "fey", fairy: "fey", satyr: "fey", harengon: "fey", firbolg: "fey", changeling: "fey", shifter: "fey",
  elf_high: "elfkin", elf_wood: "elfkin", elf_drow: "elfkin", sea_elf: "elfkin", shadar_kai: "elfkin",
  dwarf_hill: "dwarven", dwarf_mountain: "dwarven", duergar: "dwarven", gnome_forest: "dwarven", gnome_rock: "dwarven", deep_gnome: "dwarven",
  goblin: "goblinoid", hobgoblin: "goblinoid", bugbear: "goblinoid", orc: "goblinoid", half_orc: "goblinoid", minotaur: "goblinoid", kenku: "goblinoid", tabaxi: "goblinoid", goliath: "goblinoid",
  genasi_air: "planar", genasi_earth: "planar", genasi_fire: "planar", genasi_water: "planar", githyanki: "planar", githzerai: "planar", triton: "planar",
  human: "folk", half_elf: "folk", halfling_lightfoot: "folk", halfling_stout: "folk", tortle: "folk", centaur: "folk", aarakocra: "folk"
};

const SPECIES_TWEAK = {
  dragonborn: { shift: 0.1 }, kobold: { shift: -0.1 }, yuan_ti: { shift: -0.08 }, tiefling: { shift: 0.08 }, aasimar: { shift: -0.06 },
  elf_drow: { shift: 0.12 }, sea_elf: { shift: -0.08 }, duergar: { shift: 0.1 }, goblin: { shift: -0.05 }, githyanki: { shift: -0.04 }, githzerai: { shift: 0.04 }
};

const SPECIES_DEFAULT_PORTRAITS = {
  aarakocra: "assets/species-portraits-by-id/aarakocra.png",
  aasimar: "assets/species-portraits-by-id/aasimar.png",
  bugbear: "assets/species-portraits-by-id/bugbear.png",
  centaur: "assets/species-portraits-by-id/centaur.png",
  changeling: "assets/species-portraits-by-id/changeling.png",
  deep_gnome: "assets/species-portraits-by-id/deep_gnome.png",
  dragonborn: "assets/species-portraits-by-id/dragonborn.png",
  elf_drow: "assets/species-portraits-by-id/elf_drow.png",
  duergar: "assets/species-portraits-by-id/duergar.png",
  eladrin: "assets/species-portraits-by-id/eladrin.png",
  fairy: "assets/species-portraits-by-id/fairy.png",
  firbolg: "assets/species-portraits-by-id/firbolg.png",
  gnome_forest: "assets/species-portraits-by-id/gnome_forest.png",
  genasi_air: "assets/species-portraits-by-id/genasi_air.png",
  genasi_earth: "assets/species-portraits-by-id/genasi_earth.png",
  genasi_fire: "assets/species-portraits-by-id/genasi_fire.png",
  genasi_water: "assets/species-portraits-by-id/genasi_water.png",
  githyanki: "assets/species-portraits-by-id/githyanki.png",
  githzerai: "assets/species-portraits-by-id/githzerai.png",
  goblin: "assets/species-portraits-by-id/goblin.png",
  goliath: "assets/species-portraits-by-id/goliath.png",
  half_elf: "assets/species-portraits-by-id/half_elf.png",
  half_orc: "assets/species-portraits-by-id/half_orc.png",
  harengon: "assets/species-portraits-by-id/harengon.png",
  elf_high: "assets/species-portraits-by-id/elf_high.png",
  dwarf_hill: "assets/species-portraits-by-id/dwarf_hill.png",
  hobgoblin: "assets/species-portraits-by-id/hobgoblin.png",
  human: "assets/species-portraits-by-id/human.png",
  kenku: "assets/species-portraits-by-id/kenku.png",
  kobold: "assets/species-portraits-by-id/kobold.png",
  halfling_lightfoot: "assets/species-portraits-by-id/halfling_lightfoot.png",
  lizardfolk: "assets/species-portraits-by-id/lizardfolk.png",
  minotaur: "assets/species-portraits-by-id/minotaur.png",
  dwarf_mountain: "assets/species-portraits-by-id/dwarf_mountain.png",
  orc: "assets/species-portraits-by-id/orc.png",
  gnome_rock: "assets/species-portraits-by-id/gnome_rock.png",
  satyr: "assets/species-portraits-by-id/satyr.png",
  sea_elf: "assets/species-portraits-by-id/sea_elf.png",
  shadar_kai: "assets/species-portraits-by-id/shadar_kai.png",
  shifter: "assets/species-portraits-by-id/shifter.png",
  halfling_stout: "assets/species-portraits-by-id/halfling_stout.png",
  tabaxi: "assets/species-portraits-by-id/tabaxi.png",
  tiefling: "assets/species-portraits-by-id/tiefling.png",
  tortle: "assets/species-portraits-by-id/tortle.png",
  triton: "assets/species-portraits-by-id/triton.png",
  elf_wood: "assets/species-portraits-by-id/elf_wood.png",
  yuan_ti: "assets/species-portraits-by-id/yuan_ti.png"
};

const CLASS_BADGES = {
  artificer: "assets/class-badges/artificer.png",
  barbarian: "assets/class-badges/Barbarian.png",
  bard: "assets/class-badges/Bard.png",
  cleric: "assets/class-badges/Cleric.png",
  druid: "assets/class-badges/Druid.png",
  fighter: "assets/class-badges/Fighter.png",
  monk: "assets/class-badges/Monk.png",
  paladin: "assets/class-badges/Paladin.png",
  ranger: "assets/class-badges/Ranger.png",
  rogue: "assets/class-badges/Rogue.png",
  sorcerer: "assets/class-badges/Sorcerer.png",
  warlock: "assets/class-badges/Warlock.png",
  wizard: "assets/class-badges/Wazard.png"
};

function getEffectivePortrait(character) {
  const uploaded = character?.ui?.portrait?.data_url || "";
  if (uploaded) return uploaded;
  const speciesId = norm(character?.core?.speciesId || "");
  return SPECIES_DEFAULT_PORTRAITS[speciesId] || "";
}

function getDraftPortrait(speciesId) {
  return SPECIES_DEFAULT_PORTRAITS[norm(speciesId)] || "";
}

function getClassBadge(classId) {
  return CLASS_BADGES[norm(classId)] || "";
}

function sanitizeAppearance(raw = {}) {
  const out = { ...APPEARANCE_DEFAULTS };
  for (const [key] of APPEARANCE_FIELDS) {
    const v = (raw?.[key] || "").toString().trim();
    if (/^#[0-9a-f]{6}$/i.test(v)) out[key] = v;
  }
  out.surfaceAlpha = clamp(Number(raw?.surfaceAlpha ?? out.surfaceAlpha) || out.surfaceAlpha, 0.65, 1);
  out.shadowOpacity = clamp(Number(raw?.shadowOpacity ?? out.shadowOpacity) || out.shadowOpacity, 0.05, 0.28);
  out.shadowBlur = clamp(asInt(raw?.shadowBlur, out.shadowBlur), 12, 44);
  return out;
}

function primaryClassRow(character) {
  const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  if (!rows.length) return null;
  const primary = rows.find((x) => x?.isPrimary && norm(x?.id));
  if (primary) return primary;
  const ranked = [...rows]
    .filter((x) => norm(x?.id))
    .sort((a, b) => asInt(b?.level, 0) - asInt(a?.level, 0));
  return ranked[0] || rows[0];
}

function autoThemeLabel(character) {
  const cls = primaryClassRow(character);
  const classText = titleizeId(norm(cls?.id));
  const speciesText = titleizeId(norm(character?.core?.speciesId));
  if (!classText || !speciesText) return "Default Parchment";
  return `${classText} + ${speciesText}`;
}

function tweakColor(hex, shift = 0) {
  if (!shift) return hex;
  return blendHex(shift > 0 ? hex : "#ffffff", shift > 0 ? "#1e1a14" : hex, Math.abs(shift));
}

function deriveAutoAppearance(character) {
  const cls = primaryClassRow(character);
  const classId = norm(cls?.id);
  const speciesId = norm(character?.core?.speciesId);
  if (!classId || !speciesId) {
    return { appearance: sanitizeAppearance(APPEARANCE_DEFAULTS), label: "Default Parchment" };
  }
  const base = CLASS_THEME_BASE[classId];
  if (!base) {
    return { appearance: sanitizeAppearance(APPEARANCE_DEFAULTS), label: autoThemeLabel(character) };
  }
  const familyId = SPECIES_TO_FAMILY[speciesId] || "folk";
  const family = SPECIES_FAMILY_ACCENT[familyId] || SPECIES_FAMILY_ACCENT.folk;
  const tweak = SPECIES_TWEAK[speciesId] || { shift: 0 };
  const primaryAccent = tweakColor(family.primary, tweak.shift || 0);
  const secondaryAccent = tweakColor(family.secondary, (tweak.shift || 0) * -0.6);
  const a = {
    ...APPEARANCE_DEFAULTS,
    paper: base.paper,
    paper2: blendHex(base.paper2, family.chip, 0.18),
    bg: blendHex(APPEARANCE_DEFAULTS.bg, base.paper, 0.25),
    bgNoise: blendHex(APPEARANCE_DEFAULTS.bgNoise, family.glow, 0.22),
    line: blendHex(APPEARANCE_DEFAULTS.line, family.secondary, 0.18),
    accent: blendHex(base.accent, primaryAccent, 0.32),
    accent2: blendHex(base.accent2, secondaryAccent, 0.32),
    ok: blendHex(base.ok, primaryAccent, 0.15),
    warn: base.warn,
    err: base.err,
    shadowOpacity: 0.12,
    shadowBlur: 28,
    surfaceAlpha: 0.9
  };
  a.ink = ensureContrast(APPEARANCE_DEFAULTS.ink, a.paper, 8);
  a.inkSoft = ensureContrast(blendHex(APPEARANCE_DEFAULTS.inkSoft, a.accent, 0.12), a.paper, 5.2);
  a.line = ensureContrast(a.line, a.paper, 2.1);
  a.accent = ensureContrast(a.accent, a.paper, 4);
  a.accent2 = ensureContrast(a.accent2, a.paper, 3.2);
  a.ok = ensureContrast(a.ok, a.paper, 3.3);
  a.warn = ensureContrast(a.warn, a.paper, 3.1);
  a.err = ensureContrast(a.err, a.paper, 3.8);
  return { appearance: sanitizeAppearance(a), label: autoThemeLabel(character) };
}

const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"];
const SKILL_DEFS = [
  ["acrobatics", "dex"], ["animal_handling", "wis"], ["arcana", "int"], ["athletics", "str"], ["deception", "cha"], ["history", "int"],
  ["insight", "wis"], ["intimidation", "cha"], ["investigation", "int"], ["medicine", "wis"], ["nature", "int"], ["perception", "wis"],
  ["performance", "cha"], ["persuasion", "cha"], ["religion", "int"], ["sleight_of_hand", "dex"], ["stealth", "dex"], ["survival", "wis"]
];

function fmtSigned(n) {
  const v = Number.isFinite(n) ? n : 0;
  return v >= 0 ? `+${v}` : `${v}`;
}

function dieOutlineColor(die) {
  const d = asInt(die, 20);
  const map = {
    4: "#6a4f91",
    6: "#3d6f88",
    8: "#3f7a52",
    10: "#8a6a2f",
    12: "#a05b2f",
    20: "#8f3a2f",
    100: "#4b4b63"
  };
  return map[d] || "#2c5f52";
}

function dieShapeClass(die) {
  return `die-shape-d${asInt(die, 20)}`;
}

function totalLevel(character) {
  const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  return rows.reduce((acc, row) => acc + clamp(asInt(row?.level, 0), 0, 20), 0);
}

function defaultProficiencyBonus(level) {
  if (level <= 0) return 2;
  return Math.min(6, 2 + Math.floor((Math.max(1, level) - 1) / 4));
}

function resolveSpellcastingClassId(character) {
  const chosen = norm(character?.spellcasting?.class_id || "");
  if (chosen) return chosen;
  const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  const primary = rows.find((x) => x?.isPrimary) || rows[0];
  return norm(primary?.id);
}

function resolveSpellcastingAbility(character, classId) {
  const chosen = norm(character?.spellcasting?.ability || "");
  if (ABILITY_KEYS.includes(chosen)) return chosen;
  const map = {
    artificer: "int",
    bard: "cha",
    cleric: "wis",
    druid: "wis",
    paladin: "cha",
    ranger: "wis",
    sorcerer: "cha",
    warlock: "cha",
    wizard: "int"
  };
  return map[classId] || "int";
}

function deriveStats(character) {
  const abilities = character?.abilities || {};
  const abilityMods = {};
  for (const key of ABILITY_KEYS) {
    const score = clamp(asInt(abilities[key], 10), 1, 30);
    abilityMods[key] = Math.floor((score - 10) / 2);
  }

  const lvl = totalLevel(character);
  const profDefault = defaultProficiencyBonus(lvl);
  const prof = Number.isFinite(asInt(character?.combat?.proficiency_bonus, profDefault))
    ? asInt(character?.combat?.proficiency_bonus, profDefault)
    : profDefault;

  const savingThrows = {};
  for (const key of ABILITY_KEYS) {
    const row = character?.saving_throws?.[key] || {};
    const base = abilityMods[key] + (row.proficient ? prof : 0) + asInt(row.bonus, 0);
    const total = row.bonus_mode === "manual" ? asInt(row.manual_total, base) : base;
    savingThrows[key] = { base, total };
  }

  const skills = {};
  for (const [skillId, ability] of SKILL_DEFS) {
    const row = character?.skills?.[skillId] || {};
    const profMult = row.expertise ? 2 : row.proficient ? 1 : 0;
    const base = (abilityMods[ability] || 0) + (profMult * prof) + asInt(row.bonus, 0);
    const total = row.bonus_mode === "manual" ? asInt(row.manual_total, base) : base;
    skills[skillId] = { base, total };
  }

  const passivePerceptionBase = 10 + (skills.perception?.total || 0);
  const passivePerception = Math.max(0, asInt(character?.combat?.passive_perception, passivePerceptionBase));

  const classId = resolveSpellcastingClassId(character);
  const ability = resolveSpellcastingAbility(character, classId);
  const spellMod = abilityMods[ability] || 0;
  const sc = character?.spellcasting || {};
  const saveDcBase = 8 + prof + spellMod;
  const attackBase = prof + spellMod;
  const spellSaveDc = sc.save_dc_mode === "manual" ? asInt(sc.save_dc_override, saveDcBase) : saveDcBase;
  const spellAttackBonus = sc.attack_bonus_mode === "manual" ? asInt(sc.attack_bonus_override, attackBase) : attackBase;

  return {
    level: lvl,
    abilityMods,
    proficiency: { default: profDefault, value: prof },
    savingThrows,
    skills,
    passivePerceptionBase,
    passivePerception,
    spellcasting: { classId, ability, spellMod, saveDcBase, spellSaveDc, attackBase, spellAttackBonus }
  };
}

function collectBonusActions(character) {
  const out = { features: [], spells: [] };
  const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  const primaryClass = primaryClassRow(character);
  const primaryClassBadge = getClassBadge(primaryClass?.id);
  const known = Array.isArray(character?.spells_known) ? character.spells_known : [];
  const prepared = Array.isArray(character?.spells_prepared) ? character.spells_prepared : [];
  const spellSource = prepared.length ? prepared : known;

  const starsDruid = classes.some((row) => norm(row?.id) === "druid" && norm(row?.subclassId || "").includes("stars"));
  if (starsDruid) {
    out.features.push({
      id: "stars_starry_form",
      title: "Starry Form",
      detail: "Bonus action to activate by expending one Wild Shape use."
    });
    out.features.push({
      id: "stars_archer",
      title: "Archer Constellation Shot",
      detail: "While Archer is active, bonus action each turn to fire the radiant arrow."
    });
  }

  const seenSpell = new Set();
  for (const spell of spellSource) {
    const casting = (spell?.casting_time || "").toString().toLowerCase();
    if (!casting.includes("bonus action")) continue;
    const name = (spell?.name || spell?.id || "").toString().trim();
    if (!name) continue;
    const key = norm(name);
    if (seenSpell.has(key)) continue;
    seenSpell.add(key);
    out.spells.push({
      id: spell?.id || name,
      title: name,
      detail: `Casting time: ${spell?.casting_time || "Bonus Action"}`
    });
  }

  out.spells.sort((a, b) => a.title.localeCompare(b.title));
  return out;
}

function collectClassActionFeatures(character) {
  const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  const out = { action: [], bonus: [], reaction: [], passive: [] };
  const ability = character?.abilities || {};
  const chaMod = Math.floor((clamp(asInt(ability.cha, 10), 1, 30) - 10) / 2);
  const push = (kind, id, title, detail, resource = null) => {
    if (!kind || !title) return;
    const bucket = out[kind] || out.passive;
    if (bucket.some((x) => x.id === id || x.title === title)) return;
    bucket.push({ id: id || norm(title), title, detail, resource });
  };
  for (const row of rows) {
    const cls = norm(row?.id);
    const sub = norm(row?.subclassId);
    const lvl = clamp(asInt(row?.level, 0), 0, 20);
    if (!cls || lvl <= 0) continue;
    if (cls === "artificer" && lvl >= 2) push("action", "infuse_item", "Infuse Item", "Action during downtime/loadout to apply infusions.");
    if (cls === "barbarian" && lvl >= 1) {
      const max = lvl >= 20 ? 99 : lvl >= 17 ? 6 : lvl >= 12 ? 5 : lvl >= 6 ? 4 : lvl >= 3 ? 3 : 2;
      push("bonus", "rage", "Rage", "Bonus action to enter a rage.", { max, rest: "long" });
    }
    if (cls === "bard" && lvl >= 1) push("bonus", "bardic_inspiration", "Bardic Inspiration", "Bonus action to grant an inspiration die.", { max: Math.max(1, chaMod), rest: "long" });
    if (cls === "bard" && lvl >= 14 && sub.includes("valor")) push("bonus", "battle_magic", "Battle Magic", "After casting a bard spell, you can make one weapon attack as a bonus action.");
    if (cls === "cleric" && lvl >= 2) push("action", "channel_divinity", "Channel Divinity", "Action to use Channel Divinity options.", { max: lvl >= 18 ? 3 : lvl >= 6 ? 2 : 1, rest: "short" });
    if (cls === "druid" && lvl >= 2) push("action", "wild_shape", "Wild Shape", "Action to transform using Wild Shape.", { max: lvl >= 20 ? 99 : 2, rest: "short" });
    if (cls === "druid" && lvl >= 18) push("bonus", "beast_spells", "Beast Spells", "While in Wild Shape, you can cast many spells (action economy follows each spell).");
    if (cls === "fighter" && lvl >= 1) push("bonus", "second_wind", "Second Wind", "Bonus action to regain hit points.", { max: 1, rest: "short" });
    if (cls === "fighter" && lvl >= 2) push("action", "action_surge", "Action Surge", "Special action boost on your turn.", { max: lvl >= 17 ? 2 : 1, rest: "short" });
    if (cls === "fighter" && lvl >= 3 && sub.includes("samurai")) push("bonus", "fighting_spirit", "Fighting Spirit", "Bonus action to gain advantage and temporary hit points.", { max: 3, rest: "long" });
    if (cls === "fighter" && lvl >= 3 && sub.includes("cavalier")) push("bonus", "unwavering_mark", "Warding Maneuver / Mark Follow-up", "Subclass can produce bonus-action follow-up attacks in specific conditions.");
    if (cls === "monk" && lvl >= 2) {
      push("bonus", "flurry_of_blows", "Flurry of Blows", "Bonus action after Attack; spend 1 ki.", { max: lvl, rest: "short", pool: "ki" });
      push("bonus", "patient_defense", "Patient Defense", "Bonus action; spend 1 ki to Dodge.", { max: lvl, rest: "short", pool: "ki" });
      push("bonus", "step_of_the_wind", "Step of the Wind", "Bonus action; spend 1 ki to Dash/Disengage.", { max: lvl, rest: "short", pool: "ki" });
    }
    if (cls === "paladin" && lvl >= 1) push("action", "lay_on_hands", "Lay on Hands", "Action to heal using your pool.", { max: lvl * 5, rest: "long" });
    if (cls === "ranger" && lvl >= 1) push("bonus", "two_weapon_fighting", "Two-Weapon Fighting (if dual wielding)", "Bonus action off-hand attack when eligible.");
    if (cls === "ranger" && lvl >= 3 && sub.includes("beast_master")) push("bonus", "beast_command", "Companion Command", "Use bonus action to command companion attacks (Primal Companion style).");
    if (cls === "ranger" && lvl >= 3 && sub.includes("horizon_walker")) push("bonus", "planar_warrior", "Planar Warrior", "Bonus action to empower one weapon attack this turn.");
    if (cls === "rogue" && lvl >= 2) push("bonus", "cunning_action", "Cunning Action", "Bonus action Dash, Disengage, or Hide.");
    if (cls === "rogue" && lvl >= 3 && sub.includes("mastermind")) push("bonus", "master_of_tactics", "Master of Tactics", "Bonus action Help at range (subclass feature).");
    if (cls === "rogue" && lvl >= 3 && sub.includes("thief")) push("bonus", "fast_hands", "Fast Hands", "Bonus action Sleight of Hand / thieves' tools / Use Object options.");
    if (cls === "rogue" && lvl >= 13 && sub.includes("arcane_trickster")) push("bonus", "versatile_trickster", "Versatile Trickster", "Bonus action to have Mage Hand distract target for advantage setup.");
    if (cls === "sorcerer" && lvl >= 3) push("bonus", "quickened_spell", "Quickened Spell", "Cast select spells as a bonus action via Metamagic.");
    if (cls === "sorcerer" && lvl >= 6 && sub.includes("storm")) push("bonus", "heart_of_the_storm", "Storm Sorcery Mobility", "Subclass enables bonus-action repositioning after leveled spellcasting.");
    if (cls === "warlock" && lvl >= 1) push("bonus", "hex_setup", "Hex / Hex-like effects", "Many warlock staples use bonus action setup.");
    if (cls === "warlock" && lvl >= 1 && sub.includes("hexblade")) push("bonus", "hexblades_curse", "Hexblade's Curse", "Bonus action to curse one creature.");
    if (cls === "wizard" && lvl >= 18) push("action", "spell_mastery", "Spell Mastery (at-will choices)", "Frequent action economy casting options.");

    if (cls === "druid" && sub.includes("stars") && lvl >= 2) {
      push("bonus", "starry_form", "Starry Form", "Bonus action to activate by expending one Wild Shape use.");
      push("bonus", "archer_constellation_shot", "Archer Constellation Shot", "While Archer is active, bonus action each turn to fire radiant arrow.");
    }
  }
  const species = norm(character?.core?.speciesId || "");
  if (species === "dragonborn") {
    push("action", "dragonborn_breath", "Breath Weapon", "Action to exhale destructive energy (species trait).");
  }
  if (species === "goblin") {
    push("bonus", "nimble_escape", "Nimble Escape", "Bonus action Disengage or Hide (species trait).");
  }
  if (species === "aasimar") {
    push("action", "celestial_revelation", "Celestial Revelation", "Action to unleash celestial form (species trait, level-dependent by source).");
  }
  return out;
}

function lookupLabel(rows, id) {
  const key = norm(id);
  if (!key) return "";
  const row = (rows || []).find((x) => norm(x?.id) === key);
  return (row?.name || "").toString().trim() || titleizeId(key);
}

function characterSubtitle(character, catalog = {}) {
  const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  const classRows = classes.filter((c) => norm(c?.id));
  const classText = classRows.length <= 1
    ? (() => {
        const row = classRows[0];
        if (!row) return "";
        const className = lookupLabel(catalog.classes || [], row.id);
        const subclassName = norm(row?.subclassId) ? lookupLabel(catalog.subclasses || [], row.subclassId) : "";
        const lvl = clamp(asInt(row.level, 1), 1, 20);
        return subclassName ? `Level ${lvl} ${subclassName} ${className}` : `Level ${lvl} ${className}`;
      })()
    : `Classes: ${classRows.map((row) => `Level ${clamp(asInt(row.level, 1), 1, 20)} ${lookupLabel(catalog.classes || [], row.id)}`).join(" / ")}`;
  const species = lookupLabel(catalog.species || [], character?.core?.speciesId || "");
  const background = (character?.profile?.background || "").toString().trim();
  const alignment = (character?.profile?.alignment || "").toString().trim();
  return [classText, species, background, alignment].filter(Boolean).join(" • ");
}

const EDIT_TABS = [
  { id: "core", label: "Core", sections: ["sec-core", "sec-classes"] },
  { id: "battle", label: "Battle", sections: ["sec-combat", "sec-mechanics"] },
  { id: "spellcraft", label: "Spellcraft", sections: ["sec-spells"] },
  { id: "gear", label: "Gear", sections: ["sec-inventory", "sec-trackers"] },
  { id: "chronicle", label: "Chronicle", sections: ["sec-profile"] }
];

const PLAY_PANES = [
  { id: "spells", label: "Spells" },
  { id: "bonus", label: "Bonus Actions" },
  { id: "attacks", label: "Attacks" },
  { id: "trackers", label: "Trackers" },
  { id: "log", label: "Log" },
  { id: "notes", label: "Notes" }
];

function tabSections(tabId) {
  return EDIT_TABS.find((t) => t.id === tabId)?.sections || EDIT_TABS[0].sections;
}

function classCasterProgression(classId, subclassId) {
  const c = norm(classId);
  if (["bard", "cleric", "druid", "sorcerer", "wizard"].includes(c)) return "full";
  if (["paladin", "ranger", "artificer"].includes(c)) return "half";
  if (c === "warlock") return "pact";
  if (c === "fighter" && norm(subclassId) === "eldritch_knight") return "third";
  if (c === "rogue" && norm(subclassId) === "arcane_trickster") return "third";
  return "none";
}

function standardSlotsByCasterLevel(casterLevel) {
  const table = {
    0: [0,0,0,0,0,0,0,0,0],
    1: [2,0,0,0,0,0,0,0,0],
    2: [3,0,0,0,0,0,0,0,0],
    3: [4,2,0,0,0,0,0,0,0],
    4: [4,3,0,0,0,0,0,0,0],
    5: [4,3,2,0,0,0,0,0,0],
    6: [4,3,3,0,0,0,0,0,0],
    7: [4,3,3,1,0,0,0,0,0],
    8: [4,3,3,2,0,0,0,0,0],
    9: [4,3,3,3,1,0,0,0,0],
    10:[4,3,3,3,2,0,0,0,0],
    11:[4,3,3,3,2,1,0,0,0],
    12:[4,3,3,3,2,1,0,0,0],
    13:[4,3,3,3,2,1,1,0,0],
    14:[4,3,3,3,2,1,1,0,0],
    15:[4,3,3,3,2,1,1,1,0],
    16:[4,3,3,3,2,1,1,1,0],
    17:[4,3,3,3,2,1,1,1,1],
    18:[4,3,3,3,3,1,1,1,1],
    19:[4,3,3,3,3,2,1,1,1],
    20:[4,3,3,3,3,2,2,1,1]
  };
  return table[clamp(casterLevel, 0, 20)] || table[0];
}

function warlockPactByLevel(level) {
  const l = clamp(level, 0, 20);
  if (l <= 0) return { max: 0, level: 1 };
  if (l <= 1) return { max: 1, level: 1 };
  if (l <= 10) return { max: 2, level: clamp(Math.ceil(l / 2), 1, 5) };
  if (l <= 16) return { max: 3, level: 5 };
  return { max: 4, level: 5 };
}

function computeEffectiveSlots(character) {
  const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  const existing = character?.spell_slots?.levels || {};
  const pactExisting = character?.spell_slots?.pact || { max: 0, used: 0, level: 1 };
  let casterLevel = 0;
  let warlockLevel = 0;

  for (const row of classes) {
    const lvl = clamp(asInt(row?.level, 0), 0, 20);
    const prog = classCasterProgression(row?.id, row?.subclassId);
    if (prog === "full") casterLevel += lvl;
    if (prog === "half") casterLevel += row?.id === "artificer" ? Math.ceil(lvl / 2) : Math.floor(lvl / 2);
    if (prog === "third") casterLevel += Math.floor((lvl + 2) / 3);
    if (prog === "pact") warlockLevel += lvl;
  }
  casterLevel = clamp(casterLevel, 0, 20);

  const std = standardSlotsByCasterLevel(casterLevel);
  const levels = {};
  for (let i = 1; i <= 9; i++) {
    const key = String(i);
    const max = std[i - 1] || 0;
    const used = clamp(asInt(existing?.[key]?.used, 0), 0, max);
    levels[key] = { max, used };
  }
  const pactAuto = warlockPactByLevel(warlockLevel);
  const pact = {
    max: pactAuto.max,
    level: pactAuto.level,
    used: clamp(asInt(pactExisting?.used, 0), 0, pactAuto.max)
  };
  return { levels, pact };
}

function renderReport(report) {
  if (!report) return `<p class="hint">No import diagnostics yet.</p>`;
  const rows = [
    ...(report.blocked || []),
    ...(report.errors || []).map((message) => ({ code: "error", message })),
    ...(report.warnings || []),
    ...(report.fixes_applied || []),
    ...(report.fixes_available || [])
  ].slice(0, 12);

  return `<div class="diag-grid">
    <span><strong>ok</strong> ${esc(report.ok)}</span>
    <span><strong>errors</strong> ${esc(report.errors?.length || 0)}</span>
    <span><strong>warnings</strong> ${esc(report.warnings?.length || 0)}</span>
    <span><strong>fixes</strong> ${esc(report.fixes_applied?.length || 0)}</span>
    <span><strong>guided</strong> ${esc(report.fixes_available?.length || 0)}</span>
    <span><strong>blocked</strong> ${esc(report.blocked?.length || 0)}</span>
  </div>
  <ul class="diag-list">
    ${rows.map((row) => `<li><code>${esc(row.code || "note")}</code> ${esc(row.message || "")}</li>`).join("")}
  </ul>`;
}

function renderLookup(state) {
  if (!state.open) return "";
  const subtitle = state.type === "spell" ? "Search and insert spell records" : state.type === "class" ? "Choose a class" : "Choose a species";
  return `<div class="lookup-overlay" id="lookupOverlay">
    <section class="card lookup-panel" id="lookupPanel" role="dialog" aria-modal="true">
      <button type="button" class="overlay-close" data-overlay-close="lookup" aria-label="Close overlay">×</button>
      <h2>Lookup: ${esc(state.type)}</h2>
      <div class="card-body">
      <p class="hint">${esc(subtitle)}</p>
      <div class="lookup-controls">
        <input id="lookupQuery" placeholder="Type to search" value="${esc(state.query)}" />
        ${state.type === "spell" ? `<select id="lookupSpellLevel">
          <option value="">Any level</option>
          ${Array.from({ length: 10 }, (_, i) => `<option value="${i}" ${state.level === String(i) ? "selected" : ""}>Level ${i}</option>`).join("")}
        </select>
        <label class="check lookup-dm-override"><input type="checkbox" id="lookupDmSpellOverride" ${state.allowOffClassSpells ? "checked" : ""} />Allow other-class spells (DM approved)</label>` : ""}
        <button type="button" id="lookupCancel">Cancel</button>
        <button type="button" class="btn-primary" id="lookupSave">Save</button>
      </div>
      <div class="lookup-list">
        ${state.results.length === 0 ? `<p class="hint">No results</p>` : state.results.map((row, idx) => `<button type="button" class="lookup-row ${state.selected === idx ? "is-selected" : ""}" data-lookup-pick="${idx}">
          <span>${esc(row.title)}</span>
          <small>${esc(row.subtitle || "")}</small>
        </button>`).join("")}
      </div>
      ${state.feedback ? `<p class="inline-note">${esc(state.feedback)}</p>` : ""}
      </div>
    </section>
  </div>`;
}

function renderPalette(state, commands) {
  if (!state.open) return "";
  return `<div class="palette-overlay" id="paletteOverlay">
    <section class="palette" role="dialog" aria-modal="true">
      <button type="button" class="overlay-close" data-overlay-close="palette" aria-label="Close overlay">×</button>
      <input id="paletteQuery" placeholder="Type a command..." value="${esc(state.query)}" />
      <div class="palette-list">
        ${commands.length === 0 ? `<p class="hint">No commands</p>` : commands.map((cmd, idx) => `<button type="button" class="palette-row ${state.selected === idx ? "is-selected" : ""}" data-command-id="${esc(cmd.id)}">
            <span>${esc(cmd.label)}</span>
            <small>${esc(cmd.hint || "")}</small>
          </button>`).join("")}
      </div>
    </section>
  </div>`;
}

const LOG_NOTES_CHAR_LIMIT = 5_000_000;

function textLen(v) {
  return (v ?? "").toString().length;
}

function parseRoundsFromDuration(durationText) {
  const raw = (durationText || "").toString().trim().toLowerCase();
  if (!raw) return null;
  const match = raw.match(/(\d+)\s*(round|rounds|minute|minutes|hour|hours)/);
  if (!match) return null;
  const qty = asInt(match[1], 0);
  const unit = match[2];
  if (qty <= 0) return null;
  if (unit.startsWith("round")) return qty;
  if (unit.startsWith("minute")) return qty * 10;
  if (unit.startsWith("hour")) return qty * 600;
  return null;
}

function computeLogNotesChars(character) {
  const log = Array.isArray(character?.log) ? character.log : [];
  const sessionNotes = (character?.play_state?.session_notes ?? "").toString();
  let used = textLen(sessionNotes);
  for (const row of log) {
    if (!row || typeof row !== "object") continue;
    used += textLen(row.tag);
    used += textLen(row.message);
    used += textLen(row.type);
    used += textLen(row.label);
    used += textLen(row.data_json);
    used += textLen(row.notes);
  }
  return {
    used,
    remaining: Math.max(0, LOG_NOTES_CHAR_LIMIT - used),
    limit: LOG_NOTES_CHAR_LIMIT
  };
}

function clampToBudget(character, incoming, existing = "") {
  const stats = computeLogNotesChars(character);
  const existingLen = textLen(existing);
  const allowed = Math.max(0, existingLen + stats.remaining);
  return (incoming ?? "").toString().slice(0, allowed);
}

function findSpellByAnyKey(rows, key) {
  const target = norm(key);
  if (!target || !Array.isArray(rows)) return null;
  return rows.find((s) => {
    const keys = [s?.id, s?.spell_id, s?.name].map((v) => norm(v)).filter(Boolean);
    return keys.includes(target);
  }) || null;
}

function inferConcentrationRoundsFromSource(sourceName, actions) {
  const name = norm(sourceName);
  if (!name) return null;
  const cat = actions?.getCatalog ? actions.getCatalog() : null;
  const spells = Array.isArray(cat?.spells) ? cat.spells : [];
  const row = spells.find((s) => norm(s?.name) === name || norm(s?.id) === name || norm(s?.spell_id) === name);
  if (!row) return null;
  return parseRoundsFromDuration(row?.duration || "");
}

function renderPlayMode(character, uiState, actions) {
  const hp = character?.combat?.hp || { max: 0, current: 0, temp: 0 };
  const trackers = Array.isArray(character?.trackers) ? character.trackers : [];
  const log = Array.isArray(character?.log) ? character.log : [];
  const sessionNotes = (character?.play_state?.session_notes ?? "").toString();
  const known = Array.isArray(character?.spells_known) ? character.spells_known : [];
  const prepared = Array.isArray(character?.spells_prepared) ? character.spells_prepared : [];
  const slots = computeEffectiveSlots(character).levels;
  const visibleSlotLevels = Array.from({ length: 9 }, (_, i) => i + 1)
    .filter((lvl) => {
      const row = slots[String(lvl)] || { max: 0, used: 0 };
      return row.max > 0 || row.used > 0;
    });
  const slotSummary = visibleSlotLevels
    .map((lvl) => {
      const row = slots[String(lvl)] || { max: 0, used: 0 };
      return { lvl, max: row.max, used: row.used, avail: Math.max(0, row.max - row.used) };
    });
  const spellSource = prepared.length ? prepared : known;
  const activeConditionsRaw = Array.isArray(character?.combat?.conditions) ? character.combat.conditions : [];
  const activeConditions = activeConditionsRaw.map((c, idx) => {
    if (typeof c === "string") return { name: c, source: "", duration: "", notes: "", active: true, _idx: idx };
    return {
      name: c?.name || `Condition ${idx + 1}`,
      source: c?.source || "",
      duration: c?.duration || "",
      rounds_remaining: c?.rounds_remaining ?? null,
      notes: c?.notes || "",
      active: c?.active !== false,
      _idx: idx
    };
  }).filter((c) => c.active !== false);
  const concentration = character?.combat?.concentration || { active: false, source: "", notes: "", rounds_remaining: null };
  const concentrationResolvedRounds = (() => {
    const n = asInt(concentration?.rounds_remaining, NaN);
    if (Number.isFinite(n) && n > 0) return n;
    if (!concentration?.active) return null;
    const inferred = inferConcentrationRoundsFromSource(concentration?.source, actions);
    return Number.isFinite(inferred) && inferred > 0 ? inferred : null;
  })();
  const controls = uiState.playBoard?.conditionControls || {};
  const showConditionControls = Boolean(controls.showConditions || activeConditions.length);
  const showConcentrationControls = Boolean(controls.showConcentration || concentration.active);
  const concentrationLabel = concentration.active
    ? `${concentration.source || "Concentration"}${concentrationResolvedRounds > 0 ? ` (${concentrationResolvedRounds} rounds)` : " (no round timer)"}`
    : "";
  const recentActions = Array.isArray(character?.play_state?.recent_actions) ? character.play_state.recent_actions.slice(0, 5) : [];
  const castFeedback = character?.play_state?.cast_feedback || "";
  const diceRollState = character?.play_state?.dice_last_roll || null;
  const checkRollState = character?.play_state?.last_check_roll || null;
  const rollState = (() => {
    if (!diceRollState && !checkRollState) return null;
    if (!diceRollState) {
      return {
        label: checkRollState?.label || "Check",
        total: checkRollState?.total ?? 0
      };
    }
    if (!checkRollState) return diceRollState;
    const diceAt = Date.parse(diceRollState?.utc || "");
    const checkAt = Date.parse(checkRollState?.utc || "");
    if (!Number.isFinite(diceAt) && !Number.isFinite(checkAt)) return diceRollState;
    if (!Number.isFinite(diceAt)) return { label: checkRollState?.label || "Check", total: checkRollState?.total ?? 0 };
    if (!Number.isFinite(checkAt)) return diceRollState;
    if (checkAt >= diceAt) {
      return {
        label: checkRollState?.label || "Check",
        total: checkRollState?.total ?? 0
      };
    }
    return diceRollState;
  })();
  const attacks = Array.isArray(character?.attacks) ? character.attacks : [];
  const logBudget = computeLogNotesChars(character);
  const derived = deriveStats(character);
  const bonusActions = collectBonusActions(character);
  const classActions = collectClassActionFeatures(character);
  const resolveFeatureUsage = (feature) => {
    const max = Math.max(0, asInt(feature?.resource?.max, 0));
    if (max <= 0) return { max: 0, current: 0, trackerIdx: -1 };
    const titleKey = norm(feature?.title || "");
    const idKey = norm(feature?.id || "");
    const trackerIdx = trackers.findIndex((t) => {
      const l = norm(t?.label || "");
      return l && (l.includes(titleKey) || (idKey && l.includes(idKey.replaceAll("_", " "))));
    });
    if (trackerIdx >= 0) {
      const t = trackers[trackerIdx] || {};
      const tMax = Math.max(0, asInt(t.max, max));
      const cur = clamp(asInt(t.current, tMax), 0, tMax);
      return { max: tMax, current: cur, trackerIdx };
    }
    const uses = character?.play_state?.feature_uses || {};
    const cur = clamp(asInt(uses[idKey], max), 0, max);
    return { max, current: cur, trackerIdx: -1 };
  };
  const byLevel = new Map();
  for (const s of spellSource) {
    const lvl = clamp(asInt(s?.level, 0), 0, 9);
    if (!byLevel.has(lvl)) byLevel.set(lvl, []);
    byLevel.get(lvl).push(s);
  }
  const levelsWithSpells = [...byLevel.keys()].sort((a, b) => a - b);
  const saveRows = ["str", "dex", "con", "int", "wis", "cha"].map((id) => ({
    id,
    label: `${id.toUpperCase()} Save`,
    mod: asInt(derived?.savingThrows?.[id]?.total, 0)
  }));
  const skillRows = SKILL_DEFS.map(([id]) => ({
    id,
    label: titleizeId(id),
    mod: asInt(derived?.skills?.[id]?.total, 0)
  }));
  const lastCheckRoll = checkRollState;

  const activePane = uiState.activePlayPane || "spells";
  const paneNav = `<nav class="play-pane-tabs">${PLAY_PANES.map((p) => `<button type="button" class="${activePane === p.id ? "is-active" : ""}" data-play-pane="${p.id}">${esc(p.label)}</button>`).join("")}
      <button type="button" data-open-checks-drawer>Checks</button>
      <button type="button" data-toggle-utility>${uiState.playBoard?.utilityRailOpen !== false ? "Hide Utility Rail" : "Show Utility Rail"}</button>
      <button type="button" data-toggle-band>${uiState.playBoard?.bandCompact ? "Expand Combat Band" : "Compact Combat Band"}</button>
    </nav>`;

  const spellsPane = `<article class="card play-actions"><h2>Spell Console</h2><div class="card-body">
      <div class="inline-actions">
        <button type="button" id="undoLastCast">Undo Last Cast</button>
        <button type="button" id="shortRestSlots">Short Rest</button>
        <button type="button" id="longRestSlots">Long Rest</button>
      </div>
      <p class="hint">${prepared.length ? "Prepared list active. Click a spell to cast and consume a slot automatically." : "Known list active. Click a spell to cast and consume a slot automatically."}</p>
      ${castFeedback ? `<p class="play-feedback">${esc(castFeedback)}</p>` : ""}
      ${levelsWithSpells.length === 0 ? `<p class="hint">No spells on this character yet.</p>` : `<div class="spell-level-groups">
        ${levelsWithSpells.map((lvl) => {
          const row = slots[String(lvl)] || { max: 0, used: 0 };
          const available = lvl === 0 ? "At-will" : `${Math.max(0, (row.max || 0) - (row.used || 0))}/${row.max || 0} slots`;
          const pips = lvl === 0 ? `<span class="slot-pips cantrip">Cantrip</span>` : `<span class="slot-pips">${Array.from({ length: row.max || 0 }, (_, i) => `<i class="${i < Math.max(0, (row.max || 0) - (row.used || 0)) ? "is-full" : "is-empty"}"></i>`).join("")}</span>`;
          return `<section class="spell-level-group">
            <header><strong>Level ${lvl}</strong><small>${esc(available)}</small>${pips}</header>
            <ul class="pill-list">${(byLevel.get(lvl) || []).slice(0, 16).map((s) => {
              const canCast = lvl === 0 || Math.max(0, (row.max || 0) - (row.used || 0)) > 0;
              return `<li><button type="button" class="spell-cast-pill" data-cast-spell="${esc(s.id || s.name || "spell")}" data-cast-name="${esc(s.name || s.id || "Spell")}" data-cast-base-level="${lvl}" data-cast-concentration="${toBoolFlag(s?.concentration) ? "1" : "0"}" data-cast-duration="${esc(s?.duration || "")}" ${canCast ? "" : "disabled title=\"No slots left at this level\""}>${esc(s.name || s.id || "Spell")}</button></li>`;
            }).join("")}</ul>
          </section>`;
        }).join("")}
      </div>`}
    </div></article>`;

  const attacksPane = `<article class="card"><h2>Arsenal</h2><div class="card-body">
      ${attacks.length === 0 ? `<p class="hint">No attacks added yet.</p>` : `<div class="attack-list">${attacks.slice(0, 8).map((a) => `<div class="attack-row"><strong>${esc(a.name || "Attack")}</strong><span>${esc(fmtSigned(asInt(a.atk_bonus, 0)))}</span><span>${esc([a.damage, a.damage_type].filter(Boolean).join(" "))}</span></div>`).join("")}</div>`}
    </div></article>`;
  const trackersPane = `<article class="card"><h2>Trackers</h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="playTrackerAdd">Add Tracker</button></div>
      ${trackers.length === 0 ? `<p class="hint">No trackers</p>` : trackers.map((t, idx) => `<div class="tracker-row">
        <input data-play-tracker-label="${idx}" value="${esc(t.label || "")}" placeholder="Tracker label" />
        <input data-play-tracker-current="${idx}" type="number" min="0" value="${esc(t.current ?? 0)}" />
        <input data-play-tracker-max="${idx}" type="number" min="0" value="${esc(t.max ?? 0)}" />
        <button type="button" data-play-tracker="${idx}:down">-1</button><button type="button" data-play-tracker="${idx}:up">+1</button><button type="button" data-play-tracker="${idx}:reset">Reset</button><button type="button" data-play-tracker-del="${idx}">Delete</button>
      </div>`).join("")}
    </div></article>`;
  const logPane = `<article class="card"><h2>Adventure Log</h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="playLogAdd">Add Log Entry</button></div>
      <div class="log-list">
        ${log.length === 0 ? `<p class="hint">No log entries</p>` : log.map((_, idx) => {
          const realIdx = log.length - 1 - idx;
          const row = log[realIdx];
          return `<div class="play-log-row">
          <input data-play-log-tag="${realIdx}" value="${esc(row.tag || "")}" placeholder="tag" />
          <input data-play-log-message="${realIdx}" value="${esc(row.message || "")}" placeholder="Log entry" />
          <button type="button" data-play-log-del="${realIdx}">Delete</button>
        </div>`; }).join("")}
      </div>
    </div></article>`;
  const notesPane = `<article class="card"><h2>Session Notes</h2><div class="card-body stack">
      <section class="session-notes-block">
        <textarea id="playSessionNotes" rows="20" placeholder="Write long-form notes for this session...">${esc(sessionNotes)}</textarea>
        <div class="inline-actions"><button type="button" id="playSessionNotesSave">Save Notes</button></div>
      </section>
    </div></article>`;

  const bonusPane = `<article class="card bonus-actions-card"><h2>Class Powers & Bonus Actions</h2><div class="card-body stack">
      ${classActions.bonus.length ? `<section><h3>Bonus Action Features</h3><ul class="bonus-actions-list">
        ${classActions.bonus.map((row) => {
          const usage = resolveFeatureUsage(row);
          const hasResource = usage.max > 0;
          return `<li><strong>${esc(row.title)}</strong><small>${esc(row.detail)}</small>
            ${hasResource ? `<div class="feature-usage"><span class="derived-chip">${esc(usage.current)}/${esc(usage.max)}</span>
              <button type="button" data-feature-use="${esc(row.id)}">Use</button>
              <button type="button" data-feature-refund="${esc(row.id)}">Restore</button>
            </div>` : `<div class="feature-usage"><button type="button" data-feature-tap="${esc(row.id)}">Mark Used</button></div>`}
          </li>`;
        }).join("")}
      </ul></section>` : `<p class="hint">No class bonus-action features detected at current levels.</p>`}
      ${bonusActions.spells.length ? `<section><h3>Bonus Action Spells</h3><ul class="bonus-actions-list">
        ${bonusActions.spells.map((row) => `<li><strong>${esc(row.title)}</strong><small>${esc(row.detail)}</small></li>`).join("")}
      </ul></section>` : ""}
      ${classActions.action.length ? `<section><h3>Action Features</h3><ul class="bonus-actions-list">
        ${classActions.action.map((row) => {
          const usage = resolveFeatureUsage(row);
          const hasResource = usage.max > 0;
          return `<li><strong>${esc(row.title)}</strong><small>${esc(row.detail)}</small>
            ${hasResource ? `<div class="feature-usage"><span class="derived-chip">${esc(usage.current)}/${esc(usage.max)}</span>
              <button type="button" data-feature-use="${esc(row.id)}">Use</button>
              <button type="button" data-feature-refund="${esc(row.id)}">Restore</button>
            </div>` : `<div class="feature-usage"><button type="button" data-feature-tap="${esc(row.id)}">Mark Used</button></div>`}
          </li>`;
        }).join("")}
      </ul></section>` : ""}
      ${classActions.reaction.length ? `<section><h3>Reaction Features</h3><ul class="bonus-actions-list">
        ${classActions.reaction.map((row) => `<li><strong>${esc(row.title)}</strong><small>${esc(row.detail)}</small></li>`).join("")}
      </ul></section>` : ""}
    </div></article>`;
  const paneMap = { spells: spellsPane, bonus: bonusPane, attacks: attacksPane, trackers: trackersPane, log: logPane, notes: notesPane };

  const hpPct = hp.max > 0 ? Math.max(0, Math.min(100, Math.round((hp.current / hp.max) * 100))) : 0;
  return `<section class="workspace play-workspace ${uiState.densityMode === "compact" ? "density-compact" : ""}">
    <section class="play-hud card ${uiState.playBoard?.bandCompact ? "is-compact" : ""} ${uiState.playBoard?.hudCollapsed ? "is-collapsed" : ""}">
      <h2>Combat HUD <button type="button" class="card-toggle" id="toggleHudCollapse">${uiState.playBoard?.hudCollapsed ? "Expand" : "Collapse"}</button></h2>
      <div class="card-body">
      <div class="hud-grid">
      <div class="hud-stat"><strong>AC</strong><p class="hud-value">${esc(character?.combat?.ac ?? 10)}</p></div>
      <button type="button" class="hud-stat hud-stat-action" id="rollInitiativeBtn" title="Roll initiative (1d20 + modifier)">
        <strong>Initiative</strong>
        <p class="hud-value">${esc(character?.combat?.initiative_bonus ?? 0)}</p>
        <small class="hint">Roll initiative</small>
      </button>
      <div class="hud-stat"><strong>Speed</strong><p class="hud-value">${esc(character?.combat?.speed ?? 30)}</p></div>
      <div class="hud-stat"><strong>Prof</strong><p class="hud-value">${esc(fmtSigned(derived.proficiency.value))}</p></div>
      <div class="hud-stat"><strong>Passive Perception</strong><p class="hud-value">${esc(derived.passivePerception)}</p></div>
      <div class="hud-stat"><strong>Inspiration</strong><p class="hud-value">${esc(character?.combat?.inspiration ?? 0)}</p></div>
      <div class="hud-stat hud-hp"><strong>HP</strong><p class="hud-value">${esc(hp.current)}/${esc(hp.max)} <small>(+${esc(hp.temp)} temp)</small></p>
        <span class="hp-bar"><i style="width:${hpPct}%"></i></span>
      </div>
      <div class="inline-actions hud-actions">
        <button type="button" data-play-hp="-1">-1 HP</button>
        <button type="button" data-play-hp="1">+1 HP</button>
        <input type="number" id="playHpCurrent" min="0" value="${esc(hp.current)}" aria-label="Current HP" />
        <button type="button" id="playHpSet">Set HP</button>
        <button type="button" id="openDiceTrayHud" class="d20-roll-tile" title="Open Dice Tray">
          <span class="d20-roll-icon" aria-hidden="true">
            <svg viewBox="0 0 100 100" focusable="false">
              <polygon points="50,6 88,28 88,72 50,94 12,72 12,28"></polygon>
              <line x1="50" y1="6" x2="50" y2="94"></line>
              <line x1="12" y1="28" x2="88" y2="28"></line>
              <line x1="12" y1="72" x2="88" y2="72"></line>
              <line x1="12" y1="28" x2="50" y2="50"></line>
              <line x1="88" y1="28" x2="50" y2="50"></line>
              <line x1="12" y1="72" x2="50" y2="50"></line>
              <line x1="88" y1="72" x2="50" y2="50"></line>
            </svg>
          </span>
          <span class="d20-roll-label">Roll Dice</span>
        </button>
      </div>
      </div>
      <div class="play-conditions">
        <div class="inline-actions">
          <strong>Turn Effects</strong>
          <label class="check check-condition"><input type="checkbox" id="conditionsVisibleToggle" ${showConditionControls ? "checked" : ""} />Track conditions</label>
          <label class="check check-concentration"><input type="checkbox" id="concentrationVisibleToggle" ${showConcentrationControls ? "checked" : ""} />Track concentration</label>
          ${((activeConditions.length > 0) || concentration.active) ? `<button type="button" id="advanceRoundBtn">End Round</button>` : ""}
        </div>
        <div class="inline-actions play-effects-actions">
          ${showConditionControls ? `<button type="button" id="addConditionBtn">+ Condition</button>` : ""}
        </div>
        <ul class="condition-strip">
          ${activeConditions.map((c) => `<li class="condition-pill"><button type="button" class="condition-chip-btn" data-cond-edit="${c._idx}">${esc(c.name)}${(c.rounds_remaining > 0) ? ` (${esc(c.rounds_remaining)} rounds)` : c.duration ? ` (${esc(c.duration)})` : ""}</button></li>`).join("")}
        </ul>
        ${(showConcentrationControls && concentration.active) ? `<ul class="condition-strip concentration-strip"><li class="concentration-pill"><button type="button" class="condition-chip-btn concentration-chip-btn" id="concentrationPill">${esc(concentrationLabel)}</button></li></ul>` : ""}
      </div>
      <div class="play-math-strip">
        <span>STR ${esc(fmtSigned(derived.abilityMods.str))}</span><span>DEX ${esc(fmtSigned(derived.abilityMods.dex))}</span><span>CON ${esc(fmtSigned(derived.abilityMods.con))}</span><span>INT ${esc(fmtSigned(derived.abilityMods.int))}</span><span>WIS ${esc(fmtSigned(derived.abilityMods.wis))}</span><span>CHA ${esc(fmtSigned(derived.abilityMods.cha))}</span>
        <span>STR Save ${esc(fmtSigned(derived.savingThrows.str.total))}</span><span>DEX Save ${esc(fmtSigned(derived.savingThrows.dex.total))}</span><span>CON Save ${esc(fmtSigned(derived.savingThrows.con.total))}</span><span>WIS Save ${esc(fmtSigned(derived.savingThrows.wis.total))}</span>
        <span>Spell DC ${esc(derived.spellcasting.spellSaveDc)}</span><span>Spell Atk ${esc(fmtSigned(derived.spellcasting.spellAttackBonus))}</span>
      </div>
      </div>
      <div class="play-hud-nav">
        ${paneNav}
      </div>
    </section>

    <section class="play-body">
      <div class="play-main-grid">
        <section class="play-turn-console">
          ${paneMap[activePane] || spellsPane}
        </section>
        ${uiState.playBoard?.utilityRailOpen !== false ? `<aside class="play-utility-rail">
          <article class="card play-recent"><h2>Recent Actions <small class="char-budget">${esc(logBudget.remaining.toLocaleString())} chars left</small></h2><div class="card-body">
          ${recentActions.length ? `<ul class="recent-actions-list">${recentActions.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ul>` : `<p class="hint">No recent actions yet.</p>`}
          ${rollState ? `<p class="hint">Last roll: <strong>${esc(rollState.label || "Roll")}</strong> = ${esc(rollState.total)}</p>` : ""}
          </div></article>
          <article class="card"><h2>Session Log</h2><div class="card-body">
            ${log.length ? log.slice().reverse().map((entry) => `<p><strong>${esc(entry.tag || "note")}</strong> ${esc(entry.message || "")}</p>`).join("") : `<p class="hint">No log entries</p>`}
          </div></article>
        </aside>` : ""}
      </div>
    </section>
    ${uiState.checksDrawerOpen ? `<div class="palette-overlay" id="checksDrawerOverlay">
      <aside class="checks-drawer" role="dialog" aria-modal="true" aria-label="Checks and saves">
        <button type="button" class="overlay-close" id="checksDrawerClose" aria-label="Close checks drawer">×</button>
        <h3>Checks &amp; Saves</h3>
        ${lastCheckRoll ? `<p class="checks-last-roll ${lastCheckRoll.nat20 ? "is-nat20" : ""} ${lastCheckRoll.nat1 ? "is-nat1" : ""}">${esc(lastCheckRoll.label)}: d20(${lastCheckRoll.d20}) ${lastCheckRoll.mod >= 0 ? "+" : "-"} ${esc(Math.abs(lastCheckRoll.mod))} = <strong>${esc(lastCheckRoll.total)}</strong></p>` : `<p class="hint">Tap any row to roll a d20 with your current modifier.</p>`}
        <div class="checks-drawer-body">
          <section>
            <h4>Saves</h4>
            <ul class="checks-roll-list">
              ${saveRows.map((row) => `<li><span>${esc(row.label)}</span><strong>${esc(fmtSigned(row.mod))}</strong><button type="button" data-roll-save="${esc(row.id)}">Roll</button></li>`).join("")}
            </ul>
          </section>
          <section>
            <h4>Skills</h4>
            <ul class="checks-roll-list">
              ${skillRows.map((row) => `<li><span>${esc(row.label)}</span><strong>${esc(fmtSigned(row.mod))}</strong><button type="button" data-roll-skill="${esc(row.id)}">Roll</button></li>`).join("")}
            </ul>
          </section>
        </div>
      </aside>
    </div>` : ""}
  </section>`;
}

function cardTitle(label, isEdited) {
  return `${esc(label)}${isEdited ? ` <span class="card-change-badge">Changes not saved</span>` : ""}`;
}

function renderEditMode(character, catalog, lookupState, edited = {}, uiState = {}) {
  const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  const inventory = Array.isArray(character?.inventory) ? character.inventory : [];
  const spells = Array.isArray(character?.spells_known) ? character.spells_known : [];
  const trackers = Array.isArray(character?.trackers) ? character.trackers : [];
  const log = Array.isArray(character?.log) ? character.log : [];
  const profile = character?.profile || {};
  const resources = character?.resources || {};
  const skills = character?.skills || {};
  const savingThrows = character?.saving_throws || {};
  const attacks = Array.isArray(character?.attacks) ? character.attacks : [];
  const derived = deriveStats(character);
  const spellcasting = character?.spellcasting || {};
  const portrait = getEffectivePortrait(character);
  const uploadedPortrait = character?.ui?.portrait?.data_url || "";
  const activeTab = uiState.activeEditTab || "core";
  const activeSections = new Set(tabSections(activeTab));
  const collapsed = uiState.collapsedSectionsByTab?.[activeTab] || {};
  const sectionClass = (id) => `${activeSections.has(id) ? "" : "is-hidden"} ${collapsed[id] ? "is-collapsed" : ""}`.trim();
  const summaryByTab = {
    core: `Level ${derived.level} · ${esc(character?.core?.speciesId || "species")} · ${esc((classes[0]?.id || "class"))}`,
    battle: `AC ${esc(character?.combat?.ac ?? 10)} · HP ${esc(character?.combat?.hp?.current ?? 0)}/${esc(character?.combat?.hp?.max ?? 0)} · Prof ${esc(fmtSigned(derived.proficiency.value))}`,
    spellcraft: `Save DC ${esc(derived.spellcasting.spellSaveDc)} · Spell Attack ${esc(fmtSigned(derived.spellcasting.spellAttackBonus))}`,
    gear: `${esc(inventory.length)} items · ${esc(trackers.length)} trackers`,
    chronicle: `${esc(character?.meta?.name || "Adventurer")} · Chronicle entries ready`
  };

  return `<section class="workspace edit-workspace ${uiState.densityMode === "compact" ? "density-compact" : ""}">
    <aside class="edit-rail card">
      <h2>Navigator</h2>
      <div class="card-body stack">
        <nav class="edit-tab-strip">
          ${EDIT_TABS.map((t) => `<button type="button" class="${activeTab === t.id ? "is-active" : ""}" data-edit-tab="${t.id}">${esc(t.label)}</button>`).join("")}
        </nav>
        <p class="hint">${summaryByTab[activeTab] || ""}</p>
        <div class="edit-section-links">
          ${tabSections(activeTab).map((sid) => `<button type="button" data-jump-sec="${sid}">${esc((sid || "").replace("sec-", "").replaceAll("-", " "))}${edited.core || edited.classes || edited.combat || edited.spells || edited.inventory || edited.trackers ? "" : ""}</button>`).join("")}
        </div>
        <div class="inline-actions"><button type="button" data-collapse-all>Collapse all</button><button type="button" data-expand-all>Expand all</button></div>
      </div>
    </aside>
    <section class="edit-content edit-stack">
    <article class="card ${sectionClass("sec-core")}" id="sec-core"><h2>${cardTitle("Core", edited.core)} <button type="button" class="card-toggle" data-toggle-sec="sec-core">${collapsed["sec-core"] ? "Expand" : "Collapse"}</button></h2><div class="card-body grid2">
      <label>Name<input id="charName" value="${esc(character?.meta?.name || "")}" /></label>
      <label>Ruleset<input id="charRuleset" value="${esc(character?.meta?.ruleset_id || "")}" /></label>
      <label>Species<select id="charSpecies">${optionList(catalog.species || [], character?.core?.speciesId || "", "Select species")}</select></label>
      <div class="inline-actions"><button type="button" data-open-lookup="species">Lookup Species</button></div>
      <div class="six-grid">
        ${["str", "dex", "con", "int", "wis", "cha"].map((k) => `<label>${k.toUpperCase()}<input type="number" min="1" max="30" data-ability="${k}" value="${esc(character?.abilities?.[k] ?? 10)}" /><small>Mod ${esc(fmtSigned(derived.abilityMods[k]))}</small></label>`).join("")}
      </div>
    </div></article>

    <article class="card ${sectionClass("sec-classes")}" id="sec-classes"><h2>${cardTitle("Classes", edited.classes)} <button type="button" class="card-toggle" data-toggle-sec="sec-classes">${collapsed["sec-classes"] ? "Expand" : "Collapse"}</button></h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="classAdd">Add Class</button><button type="button" data-open-lookup="class">Lookup Class</button><button type="button" data-open-lookup="subclass">Lookup Subclass</button></div>
      ${classes.length === 0 ? `<p class="hint">No classes</p>` : classes.map((row, idx) => `<div class="class-row">
        ${getClassBadge(row.id) ? `<img class="class-badge" src="${esc(getClassBadge(row.id))}" alt="${esc(titleizeId(row.id))} badge" />` : `<span class="class-badge class-badge-placeholder" aria-hidden="true"></span>`}
        <select data-class-id="${idx}">${optionList(catalog.classes || [], row.id || "", "Select class")}</select>
        <input type="number" min="1" max="20" data-class-level="${idx}" value="${esc(row.level ?? 1)}" />
        <input data-class-subclass="${idx}" list="subclass-list-${idx}" value="${esc(row.subclassId || "")}" placeholder="subclass id" />
        <datalist id="subclass-list-${idx}">${subclassOptions(catalog.subclasses || [], row.id || "")}</datalist>
        <button type="button" data-class-del="${idx}">Delete</button>
      </div>`).join("")}
    </div></article>

    <article class="card ${sectionClass("sec-combat")}" id="sec-combat"><h2>${cardTitle("Combat", edited.combat)} <button type="button" class="card-toggle" data-toggle-sec="sec-combat">${collapsed["sec-combat"] ? "Expand" : "Collapse"}</button></h2><div class="card-body grid2">
      <label>AC<input id="combatAc" type="number" min="0" value="${esc(character?.combat?.ac ?? 10)}" /></label>
      <label>Initiative<input id="combatInit" type="number" value="${esc(character?.combat?.initiative_bonus ?? 0)}" /></label>
      <label>HP Max<input id="hpMax" type="number" min="0" value="${esc(character?.combat?.hp?.max ?? 1)}" /></label>
      <label>HP Current<input id="hpCurrent" type="number" min="0" value="${esc(character?.combat?.hp?.current ?? 1)}" /></label>
      <label>HP Temp<input id="hpTemp" type="number" min="0" value="${esc(character?.combat?.hp?.temp ?? 0)}" /></label>
      <label>Speed<input id="combatSpeed" type="number" min="0" value="${esc(character?.combat?.speed ?? 30)}" /></label>
      <label>Inspiration<input id="combatInspiration" type="number" min="0" max="1" value="${esc(character?.combat?.inspiration ?? 0)}" /></label>
      <label>Proficiency Bonus<input id="combatProfBonus" type="number" value="${esc(character?.combat?.proficiency_bonus ?? derived.proficiency.default)}" /><small>Default for level ${esc(derived.level)}: ${esc(fmtSigned(derived.proficiency.default))}</small></label>
      <label>Passive Perception<input id="combatPassivePerception" type="number" min="0" value="${esc(character?.combat?.passive_perception ?? derived.passivePerceptionBase)}" /><small>Derived default: ${esc(derived.passivePerceptionBase)}</small></label>
      <label>Hit Dice Total<input id="combatHitDiceTotal" type="number" min="0" value="${esc(character?.combat?.hit_dice_total ?? 0)}" /></label>
      <label>Hit Dice Used<input id="combatHitDiceUsed" type="number" min="0" value="${esc(character?.combat?.hit_dice_used ?? 0)}" /></label>
      <label>Death Saves Success<input id="combatDeathSaveSuccess" type="number" min="0" max="3" value="${esc(character?.combat?.death_saves?.success ?? 0)}" /></label>
      <label>Death Saves Fail<input id="combatDeathSaveFail" type="number" min="0" max="3" value="${esc(character?.combat?.death_saves?.fail ?? 0)}" /></label>
    </div></article>

    <article class="card ${sectionClass("sec-profile")}" id="sec-profile"><h2>${cardTitle("Adventurer's Chronicle", edited.core)} <button type="button" class="card-toggle" data-toggle-sec="sec-profile">${collapsed["sec-profile"] ? "Expand" : "Collapse"}</button></h2><div class="card-body grid2">
      <div class="portrait-editor">
        ${portrait ? `<img class="portrait-preview" src="${esc(portrait)}" alt="Character portrait" />` : `<div class="portrait-placeholder">No portrait</div>`}
        <div class="inline-actions">
          <input id="portraitUpload" type="file" accept="image/*" />
          ${uploadedPortrait ? `<button type="button" id="portraitRemove">Remove</button>` : ""}
        </div>
      </div>
      <label>Background<input id="profileBackground" value="${esc(profile.background || "")}" /></label>
      <label>Alignment<input id="profileAlignment" value="${esc(profile.alignment || "")}" /></label>
      <label>Player Name<input id="profilePlayerName" value="${esc(profile.player_name || "")}" /></label>
      <label>XP<input id="profileXp" type="number" min="0" value="${esc(profile.experience_points ?? 0)}" /></label>
      <label>Age<input id="profileAge" value="${esc(profile.age || "")}" /></label>
      <label>Height<input id="profileHeight" value="${esc(profile.height || "")}" /></label>
      <label>Weight<input id="profileWeight" value="${esc(profile.weight || "")}" /></label>
      <label>Eyes<input id="profileEyes" value="${esc(profile.eyes || "")}" /></label>
      <label>Skin<input id="profileSkin" value="${esc(profile.skin || "")}" /></label>
      <label>Hair<input id="profileHair" value="${esc(profile.hair || "")}" /></label>
      <label>Personality Traits<textarea id="profileTraits">${esc(profile.personality_traits || "")}</textarea></label>
      <label>Ideals<textarea id="profileIdeals">${esc(profile.ideals || "")}</textarea></label>
      <label>Bonds<textarea id="profileBonds">${esc(profile.bonds || "")}</textarea></label>
      <label>Flaws<textarea id="profileFlaws">${esc(profile.flaws || "")}</textarea></label>
      <label>Other Proficiencies & Languages<textarea id="profileProficiencies">${esc(profile.other_proficiencies_languages || "")}</textarea></label>
      <label>Features & Traits<textarea id="profileFeatures">${esc(profile.features_traits || "")}</textarea></label>
      <label>Backstory<textarea id="profileBackstory">${esc(profile.backstory || "")}</textarea></label>
      <label>Allies & Organizations<textarea id="profileAllies">${esc(profile.allies_organizations || "")}</textarea></label>
      <label>Additional Features<textarea id="profileAdditionalFeatures">${esc(profile.additional_features || "")}</textarea></label>
      <label>Treasure<textarea id="profileTreasure">${esc(profile.treasure || "")}</textarea></label>
      <label>CP<input id="resCp" type="number" min="0" value="${esc(resources.cp ?? 0)}" /></label>
      <label>SP<input id="resSp" type="number" min="0" value="${esc(resources.sp ?? 0)}" /></label>
      <label>EP<input id="resEp" type="number" min="0" value="${esc(resources.ep ?? 0)}" /></label>
      <label>GP<input id="resGp" type="number" min="0" value="${esc(resources.gp ?? 0)}" /></label>
      <label>PP<input id="resPp" type="number" min="0" value="${esc(resources.pp ?? 0)}" /></label>
    </div></article>

    <article class="card ${sectionClass("sec-mechanics")}" id="sec-mechanics"><h2>${cardTitle("Battle Ledger", edited.combat)} <button type="button" class="card-toggle" data-toggle-sec="sec-mechanics">${collapsed["sec-mechanics"] ? "Expand" : "Collapse"}</button></h2><div class="card-body stack">
      <h3>Spellcraft</h3>
      <div class="grid2">
        <label>Spellcasting Class
          <select id="spellcastingClassId">
            <option value="">Auto (Primary class)</option>
            ${classes.map((row) => `<option value="${esc(row.id || "")}" ${norm(row.id) === derived.spellcasting.classId ? "selected" : ""}>${esc(row.id || "class")}</option>`).join("")}
          </select>
        </label>
        <label>Spellcasting Ability
          <select id="spellcastingAbility">
            ${ABILITY_KEYS.map((k) => `<option value="${k}" ${k === derived.spellcasting.ability ? "selected" : ""}>${k.toUpperCase()}</option>`).join("")}
          </select>
        </label>
        <label>Spell Save DC Mode
          <select id="spellcastingSaveDcMode"><option value="auto" ${(spellcasting.save_dc_mode || "auto") === "auto" ? "selected" : ""}>Auto</option><option value="manual" ${spellcasting.save_dc_mode === "manual" ? "selected" : ""}>Manual</option></select>
        </label>
        <label>Spell Save DC Override<input id="spellcastingSaveDcOverride" type="number" value="${esc(spellcasting.save_dc_override ?? derived.spellcasting.saveDcBase)}" /></label>
        <label>Spell Attack Mode
          <select id="spellcastingAtkMode"><option value="auto" ${(spellcasting.attack_bonus_mode || "auto") === "auto" ? "selected" : ""}>Auto</option><option value="manual" ${spellcasting.attack_bonus_mode === "manual" ? "selected" : ""}>Manual</option></select>
        </label>
        <label>Spell Attack Override<input id="spellcastingAtkOverride" type="number" value="${esc(spellcasting.attack_bonus_override ?? derived.spellcasting.attackBase)}" /></label>
        <p class="hint">Computed: Spell Save DC <strong>${esc(derived.spellcasting.spellSaveDc)}</strong> · Spell Attack <strong>${esc(fmtSigned(derived.spellcasting.spellAttackBonus))}</strong></p>
      </div>
      <h3>Saves</h3>
      <div class="saves-table">
        ${["str", "dex", "con", "int", "wis", "cha"].map((k) => `<div class="save-row">
          <strong>${k.toUpperCase()}</strong>
          <label class="check"><input type="checkbox" data-save-prof="${k}" ${savingThrows?.[k]?.proficient ? "checked" : ""}/>Prof</label>
          <label class="check"><input type="checkbox" data-save-mode="${k}" ${(savingThrows?.[k]?.bonus_mode || "auto") === "manual" ? "checked" : ""}/>Manual</label>
          <input type="number" data-save-bonus="${k}" value="${esc(savingThrows?.[k]?.bonus ?? 0)}" aria-label="${k.toUpperCase()} bonus" title="${k.toUpperCase()} bonus" />
          <input type="number" data-save-manual="${k}" value="${esc(savingThrows?.[k]?.manual_total ?? derived.savingThrows[k].base)}" aria-label="${k.toUpperCase()} manual total" title="${k.toUpperCase()} manual total" />
          <span class="derived-chip" title="Computed total">${esc(fmtSigned(derived.savingThrows[k].total))}</span>
        </div>`).join("")}
      </div>
      <h3>Talents</h3>
      <div class="stack">
        ${SKILL_DEFS.map(([id, ability]) => {
          const row = skills?.[id] || {};
          return `<div class="skill-row">
            <strong>${esc(id.replaceAll("_", " "))} (${esc(ability.toUpperCase())})</strong>
            <label class="check"><input type="checkbox" data-skill-prof="${esc(id)}" ${row.proficient ? "checked" : ""}/>Prof</label>
            <label class="check"><input type="checkbox" data-skill-exp="${esc(id)}" ${row.expertise ? "checked" : ""}/>Expertise</label>
            <label class="check"><input type="checkbox" data-skill-mode="${esc(id)}" ${(row.bonus_mode || "auto") === "manual" ? "checked" : ""}/>Manual total</label>
            <input type="number" data-skill-bonus="${esc(id)}" value="${esc(row.bonus ?? 0)}" placeholder="bonus" />
            <input type="number" data-skill-manual="${esc(id)}" value="${esc(row.manual_total ?? derived.skills[id].base)}" placeholder="manual total" />
            <span class="derived-chip">${esc(fmtSigned(derived.skills[id].total))}</span>
          </div>`;
        }).join("")}
      </div>
      <h3>Arsenal</h3>
      <div class="inline-actions"><button type="button" id="attackAdd">Add Attack</button></div>
      <div class="stack">
        ${attacks.length === 0 ? `<p class="hint">No attacks</p>` : attacks.map((a, idx) => `<div class="attack-edit-row">
          <input data-attack-name="${idx}" value="${esc(a.name || "")}" placeholder="Name" />
          <input data-attack-bonus="${idx}" type="number" value="${esc(a.atk_bonus ?? 0)}" placeholder="Atk bonus" />
          <input data-attack-damage="${idx}" value="${esc(a.damage || "")}" placeholder="Damage dice" />
          <input data-attack-damagetype="${idx}" value="${esc(a.damage_type || "")}" placeholder="Damage type" />
          <input data-attack-range="${idx}" value="${esc(a.range || "")}" placeholder="Range/Reach" />
          <input data-attack-notes="${idx}" value="${esc(a.notes || "")}" placeholder="Notes" />
          <button type="button" data-attack-del="${idx}">Delete</button>
        </div>`).join("")}
      </div>
    </div></article>

    <article class="card ${sectionClass("sec-spells")}" id="sec-spells"><h2>${cardTitle("Spells", edited.spells)} <button type="button" class="card-toggle" data-toggle-sec="sec-spells">${collapsed["sec-spells"] ? "Expand" : "Collapse"}</button></h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="spellAdd">Add Spell</button><button type="button" data-open-lookup="spell">Lookup Spells</button></div>
      ${spells.length === 0 ? `<p class="hint">No known spells</p>` : spells.map((s, idx) => `<div class="spell-row">
        <input data-spell-name="${idx}" value="${esc(s.name || "")}" placeholder="Name" />
        <input data-spell-level="${idx}" type="number" min="0" max="9" value="${esc(s.level ?? 0)}" />
        <input data-spell-school="${idx}" value="${esc(s.school || "")}" placeholder="School" />
        <label class="check"><input type="checkbox" data-spell-prep="${idx}" ${Array.isArray(character?.spells_prepared) && character.spells_prepared.some((p) => p.id === s.id) ? "checked" : ""}/>Prepared</label>
        <button type="button" data-spell-del="${idx}">Delete</button>
      </div>`).join("")}
    </div></article>

    <article class="card ${sectionClass("sec-inventory")}" id="sec-inventory"><h2>${cardTitle("Inventory", edited.inventory)} <button type="button" class="card-toggle" data-toggle-sec="sec-inventory">${collapsed["sec-inventory"] ? "Expand" : "Collapse"}</button></h2><div class="card-body stack">
      <button type="button" id="invAdd">Add Item</button>
      ${inventory.length === 0 ? `<p class="hint">No inventory items</p>` : inventory.map((r, idx) => `<div class="inv-row">
        <input data-inv-name="${idx}" value="${esc(r.name || "")}" placeholder="Item" />
        <input data-inv-qty="${idx}" type="number" min="0" value="${esc(r.qty ?? 1)}" />
        <input data-inv-notes="${idx}" value="${esc(r.notes || "")}" placeholder="Notes" />
        <button type="button" data-inv-del="${idx}">Delete</button>
      </div>`).join("")}
    </div></article>

    <article class="card ${sectionClass("sec-trackers")}" id="sec-trackers"><h2>${cardTitle("Trackers & Log", edited.trackers)} <button type="button" class="card-toggle" data-toggle-sec="sec-trackers">${collapsed["sec-trackers"] ? "Expand" : "Collapse"}</button></h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="trackerAdd">Add Tracker</button><button type="button" id="logAdd">Add Log Entry</button></div>
      ${trackers.length === 0 ? `<p class="hint">No trackers</p>` : trackers.map((t, idx) => `<div class="tracker-row">
        <input data-tracker-label="${idx}" value="${esc(t.label || "")}" placeholder="Label" />
        <select data-tracker-reset="${idx}">${["none", "short_rest", "long_rest", "daily", "manual"].map((x) => `<option value="${x}" ${(t.reset || "none") === x ? "selected" : ""}>${x}</option>`).join("")}</select>
        <input data-tracker-max="${idx}" type="number" min="0" value="${esc(t.max ?? 0)}" />
        <input data-tracker-current="${idx}" type="number" min="0" value="${esc(t.current ?? 0)}" />
        <button type="button" data-tracker-del="${idx}">Delete</button>
      </div>`).join("")}
      <div class="log-list">
        ${log.slice().reverse().map((entry) => `<p><strong>${esc(entry.tag || "note")}</strong> ${esc(entry.message || "")}</p>`).join("") || `<p class="hint">No log entries</p>`}
      </div>
    </div></article>

    ${renderLookup(lookupState)}
    </section>
  </section>`;
}

export function mountV2UI({ root, getState, actions }) {
  if (!root) throw new Error("mountV2UI requires root");

  const MODE_KEY = "living-codex-v2.ui.mode";
  const POLICY_KEY = "living-codex-v2.ui.policy";
  const DENSITY_KEY = "living-codex-v2.ui.density";
  const EDIT_TAB_KEY = "living-codex-v2.ui.edit_tab";
  const PLAY_PANE_KEY = "living-codex-v2.ui.play_pane";
  const PLAY_BOARD_KEY = "living-codex-v2.ui.play_board";
  const APPEARANCE_KEY = "living-codex-v2.ui.appearance";
  const draft = {
    name: "New Character",
    rulesetId: "dnd5e_2014",
    classId: "",
    speciesId: "",
    str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10
  };

  function readInitialPlayPane() {
    const valid = new Set(PLAY_PANES.map((p) => p.id));
    try {
      const fromSession = (sessionStorage.getItem(PLAY_PANE_KEY) || "").trim();
      if (valid.has(fromSession)) return fromSession;
    } catch {}
    const fromLocal = (localStorage.getItem(PLAY_PANE_KEY) || "").trim();
    if (valid.has(fromLocal)) return fromLocal;
    try {
      const raw = JSON.parse(localStorage.getItem(PLAY_BOARD_KEY) || "{}");
      const fromBoard = (raw?.activeModule || "").toString().trim();
      if (valid.has(fromBoard)) return fromBoard;
    } catch {}
    return "spells";
  }

  const uiState = {
    mode: localStorage.getItem(MODE_KEY) === "play" ? "play" : "edit",
    policyMode: localStorage.getItem(POLICY_KEY) === "core_only" ? "core_only" : "all_official",
    showCreate: false,
    diagnosticsOpen: false,
    edited: { core: false, classes: false, combat: false, spells: false, inventory: false, trackers: false },
    densityMode: localStorage.getItem(DENSITY_KEY) === "compact" ? "compact" : "comfortable",
    activeEditTab: localStorage.getItem(EDIT_TAB_KEY) || "core",
    activePlayPane: readInitialPlayPane(),
    playBoard: (() => {
      try {
        const raw = JSON.parse(localStorage.getItem(PLAY_BOARD_KEY) || "{}");
        return {
          utilityRailOpen: raw?.utilityRailOpen !== false,
          bandCompact: raw?.bandCompact === true,
          hudCollapsed: raw?.hudCollapsed === true,
          activeModule: typeof raw?.activeModule === "string" ? raw.activeModule : "spells"
        };
      } catch {
        return { utilityRailOpen: true, bandCompact: false, hudCollapsed: false, activeModule: "spells" };
      }
    })(),
    collapsedSectionsByTab: {},
    hudState: { pinned: true, collapsed: false },
    lastCastLevel: 0,
    lastAction: "",
    checksDrawerOpen: false,
    conditionEditor: { open: false, index: -1, model: { name: "", source: "", duration: "", rounds_remaining: "", notes: "", active: true } },
    diceTray: { open: false, die: 20, count: 1, mod: 0, rolling: false },
    portraitCrop: { open: false, src: "", zoom: 1, x: 0, y: 0, iw: 0, ih: 0 },
    toolsMenuOpen: false,
    toolsMenuOpenedAt: 0,
    exportMenuOpen: false,
    exportMenuOpenedAt: 0,
    appearanceOpen: false,
    appearanceSource: "auto",
    appearanceAutoLabel: "Default Parchment",
    appearanceDraft: sanitizeAppearance(),
    castMenu: { open: false, spellName: "", spellKey: "", baseLevel: 0, options: [], spellRef: null, concentrationForce: false, concentrationRounds: "" },
    palette: { open: false, query: "", selected: 0, recents: [] },
    lookup: { open: false, type: "spell", query: "", level: "", allowOffClassSpells: false, selected: 0, results: [], feedback: "", originSectionId: "", originScrollY: 0, cursor: 0 }
  };

  const sectionIds = ["sec-core", "sec-classes", "sec-combat", "sec-profile", "sec-mechanics", "sec-spells", "sec-inventory", "sec-trackers"];

  function captureFocusState() {
    const active = document.activeElement;
    if (!active || !root.contains(active) || !isTypingTarget(active)) return null;
    const textLike = active.tagName === "TEXTAREA" || (active.tagName === "INPUT" && !["checkbox", "radio", "button", "submit", "range", "color"].includes((active.type || "").toLowerCase()));
    return {
      id: active.id || "",
      path: elementPathWithinRoot(active, root),
      start: textLike ? (active.selectionStart ?? null) : null,
      end: textLike ? (active.selectionEnd ?? null) : null
    };
  }

  function restoreFocusState(state) {
    if (!state) return false;
    const target = (state.id && root.querySelector(`#${CSS.escape(state.id)}`)) || queryByElementPath(root, state.path);
    if (!target || !isTypingTarget(target)) return false;
    target.focus();
    if (state.start != null && typeof target.setSelectionRange === "function") {
      const max = (target.value || "").length;
      const s = clamp(asInt(state.start, 0), 0, max);
      const e = clamp(asInt(state.end, s), 0, max);
      target.setSelectionRange(s, e);
    }
    return true;
  }

  function readLocalAppearance() {
    try {
      const stored = localStorage.getItem(APPEARANCE_KEY);
      if (!stored) return null;
      const raw = JSON.parse(stored || "{}");
      if (!raw || typeof raw !== "object" || Object.keys(raw).length === 0) return null;
      return sanitizeAppearance(raw);
    } catch {
      return null;
    }
  }

  function readCharacterAppearance(character) {
    const raw = character?.ui?.appearance;
    if (!raw || typeof raw !== "object" || Object.keys(raw).length === 0) return null;
    return sanitizeAppearance(raw);
  }

  function sameAppearance(a, b) {
    const left = sanitizeAppearance(a || {});
    const right = sanitizeAppearance(b || {});
    for (const [key] of APPEARANCE_FIELDS) {
      if (left[key] !== right[key]) return false;
    }
    return left.surfaceAlpha === right.surfaceAlpha
      && left.shadowOpacity === right.shadowOpacity
      && left.shadowBlur === right.shadowBlur;
  }

  function persistAppearance(character, appearance, mode = "user") {
    if (!character) return;
    const finalAppearance = sanitizeAppearance(appearance);
    const currentAppearance = readCharacterAppearance(character);
    const currentMode = norm(character?.ui?.appearance_mode || "");
    if (sameAppearance(currentAppearance, finalAppearance) && currentMode === mode) return;
    actions.updateCharacter((c) => {
      c.ui = c.ui || {};
      c.ui.appearance = finalAppearance;
      c.ui.appearance_mode = mode;
    });
  }

  function resolveAppearance(character) {
    const appearanceMode = norm(character?.ui?.appearance_mode || "");
    const charTheme = readCharacterAppearance(character);
    if (charTheme && appearanceMode === "user") {
      uiState.appearanceSource = "user";
      uiState.appearanceAutoLabel = autoThemeLabel(character);
      return charTheme;
    }
    if (charTheme && appearanceMode === "auto") {
      const auto = deriveAutoAppearance(character);
      uiState.appearanceSource = "auto";
      uiState.appearanceAutoLabel = auto.label;
      if (!sameAppearance(charTheme, auto.appearance)) {
        persistAppearance(character, auto.appearance, "auto");
      }
      return auto.appearance;
    }
    if (charTheme && !appearanceMode) {
      const auto = deriveAutoAppearance(character);
      const isAuto = sameAppearance(charTheme, auto.appearance);
      if (isAuto) {
        uiState.appearanceSource = "auto";
        uiState.appearanceAutoLabel = auto.label;
        persistAppearance(character, auto.appearance, "auto");
        return auto.appearance;
      }
      uiState.appearanceSource = "user";
      uiState.appearanceAutoLabel = auto.label;
      persistAppearance(character, charTheme, "user");
      return charTheme;
    }
    const localTheme = readLocalAppearance();
    if (localTheme && appearanceMode !== "auto") {
      uiState.appearanceSource = "user";
      uiState.appearanceAutoLabel = autoThemeLabel(character);
      return localTheme;
    }
    const auto = deriveAutoAppearance(character);
    uiState.appearanceSource = "auto";
    uiState.appearanceAutoLabel = auto.label;
    persistAppearance(character, auto.appearance, "auto");
    return auto.appearance;
  }

  function applyAppearance(appearance) {
    const a = sanitizeAppearance(appearance);
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty("--bg", a.bg);
    rootStyle.setProperty("--bg-noise", a.bgNoise);
    rootStyle.setProperty("--paper", a.paper);
    rootStyle.setProperty("--paper-2", a.paper2);
    const paperRgb = hexToRgbTriplet(a.paper);
    rootStyle.setProperty("--paper-rgb", paperRgb);
    rootStyle.setProperty("--paper-2-rgb", hexToRgbTriplet(a.paper2, paperRgb));
    rootStyle.setProperty("--topbar-rgb", paperRgb);
    rootStyle.setProperty("--ink", a.ink);
    rootStyle.setProperty("--ink-soft", a.inkSoft);
    rootStyle.setProperty("--line", a.line);
    rootStyle.setProperty("--accent", a.accent);
    rootStyle.setProperty("--accent-2", a.accent2);
    rootStyle.setProperty("--ok", a.ok);
    rootStyle.setProperty("--warn", a.warn);
    rootStyle.setProperty("--err", a.err);
    rootStyle.setProperty("--surface-alpha", String(a.surfaceAlpha));
    rootStyle.setProperty("--shadow-alpha", String(a.shadowOpacity));
    rootStyle.setProperty("--shadow-blur", `${a.shadowBlur}px`);
  }

  function openAppearanceCustomizer() {
    const state = getState();
    uiState.appearanceDraft = resolveAppearance(state.character);
    uiState.appearanceOpen = true;
    uiState.toolsMenuOpen = false;
    applyAppearance(uiState.appearanceDraft);
    render();
  }

  function closeAppearanceCustomizer({ revert = false } = {}) {
    uiState.appearanceOpen = false;
    if (revert) {
      const state = getState();
      applyAppearance(resolveAppearance(state.character));
    }
    render();
  }

  function policyAllows(row) {
    if (uiState.policyMode !== "core_only") return true;
    return (row?.availability?.default || "allowed") !== "requires_dm_approval";
  }

  function policyCatalog(catalog) {
    const classes = (catalog.classes || []).filter(policyAllows);
    const species = (catalog.species || []).filter(policyAllows);
    const subclasses = (catalog.subclasses || []).filter(policyAllows);
    return { ...catalog, classes, species, subclasses };
  }

  function classIdsFromCharacter(character) {
    const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    return rows.map((x) => norm(x.id)).filter(Boolean);
  }

  function primaryClassId(character) {
    const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    const primary = rows.find((x) => x?.isPrimary) || rows[0];
    return norm(primary?.id);
  }

  function refreshLookup() {
    if (!uiState.lookup.open || typeof actions.lookupProvider !== "function") return;
    const state = getState();
    uiState.lookup.results = actions.lookupProvider({
      type: uiState.lookup.type,
      query: uiState.lookup.query,
      filters: {
        level: uiState.lookup.level,
        classIds: classIdsFromCharacter(state.character),
        subclassIds: (Array.isArray(state.character?.core?.classes) ? state.character.core.classes : []).map((x) => norm(x?.subclassId)).filter(Boolean),
        classId: primaryClassId(state.character),
        allowOffClassSpells: Boolean(uiState.lookup.allowOffClassSpells),
        policyMode: uiState.policyMode
      }
    }) || [];
    if (uiState.lookup.selected >= uiState.lookup.results.length) uiState.lookup.selected = Math.max(0, uiState.lookup.results.length - 1);
  }

  function setMode(mode) {
    uiState.mode = mode === "play" ? "play" : "edit";
    if (uiState.mode !== "play") uiState.checksDrawerOpen = false;
    localStorage.setItem(MODE_KEY, uiState.mode);
  }

  function setPolicyMode(mode) {
    uiState.policyMode = mode === "core_only" ? "core_only" : "all_official";
    localStorage.setItem(POLICY_KEY, uiState.policyMode);
  }

  function setDensityMode(mode) {
    uiState.densityMode = mode === "compact" ? "compact" : "comfortable";
    localStorage.setItem(DENSITY_KEY, uiState.densityMode);
  }

  function setActiveEditTab(tabId) {
    const id = EDIT_TABS.some((t) => t.id === tabId) ? tabId : "core";
    uiState.activeEditTab = id;
    localStorage.setItem(EDIT_TAB_KEY, id);
    if (!uiState.collapsedSectionsByTab[id]) uiState.collapsedSectionsByTab[id] = {};
  }

  function setActivePlayPane(paneId) {
    const id = PLAY_PANES.some((p) => p.id === paneId) ? paneId : "spells";
    uiState.activePlayPane = id;
    uiState.playBoard.activeModule = id;
    localStorage.setItem(PLAY_PANE_KEY, id);
    try { sessionStorage.setItem(PLAY_PANE_KEY, id); } catch {}
    localStorage.setItem(PLAY_BOARD_KEY, JSON.stringify(uiState.playBoard));
  }

  function persistPlayBoard() {
    localStorage.setItem(PLAY_BOARD_KEY, JSON.stringify(uiState.playBoard));
  }

  function setPlayBoard(patch) {
    uiState.playBoard = { ...uiState.playBoard, ...(patch || {}) };
    persistPlayBoard();
  }

  function openConditionEditor(index = -1) {
    const state = getState();
    const rows = Array.isArray(state.character?.combat?.conditions) ? state.character.combat.conditions : [];
    const row = index >= 0 ? rows[index] : null;
    const model = typeof row === "string"
      ? { name: row, source: "", duration: "", rounds_remaining: "", notes: "", active: true }
      : {
          name: row?.name || "",
          source: row?.source || "",
          duration: row?.duration || "",
          rounds_remaining: row?.rounds_remaining ?? "",
          notes: row?.notes || "",
          active: row?.active !== false
        };
    uiState.conditionEditor = { open: true, index, model };
    render();
  }

  function closeConditionEditor() {
    uiState.conditionEditor = { open: false, index: -1, model: { name: "", source: "", duration: "", rounds_remaining: "", notes: "", active: true } };
    render();
  }

  function openConcentrationEditor(prefill = {}) {
    const state = getState();
    const current = state.character?.combat?.concentration || {};
    uiState.conditionEditor = {
      open: true,
      index: -2,
      model: {
        name: "Concentration",
        source: prefill.source || current.source || "",
        duration: prefill.duration || "",
        rounds_remaining: Number.isFinite(prefill.rounds_remaining) ? prefill.rounds_remaining : (current.rounds_remaining ?? ""),
        notes: prefill.notes || current.notes || "",
        active: prefill.active !== undefined ? Boolean(prefill.active) : (current.active !== false)
      }
    };
    render();
  }

  function setConditionControls(patch = {}) {
    const current = uiState.playBoard?.conditionControls || { showConditions: false, showConcentration: false };
    setPlayBoard({ conditionControls: { ...current, ...patch } });
  }

  function advanceRound(steps = 1) {
    const roundsToAdvance = Math.max(1, asInt(steps, 1));
    let changed = false;
    actions.updateCharacter((c) => {
      c.combat = c.combat || {};
      c.combat.conditions = Array.isArray(c.combat.conditions) ? c.combat.conditions : [];
      c.combat.conditions = c.combat.conditions.map((row) => {
        if (!row || typeof row !== "object" || row.active === false) return row;
        const rounds = asInt(row.rounds_remaining, NaN);
        if (!Number.isFinite(rounds) || rounds <= 0) return row;
        changed = true;
        const next = Math.max(0, rounds - roundsToAdvance);
        return { ...row, rounds_remaining: next, active: next > 0 };
      });
      c.combat.concentration = c.combat.concentration || { active: false, source: "", notes: "", rounds_remaining: null };
      let cRounds = asInt(c.combat.concentration.rounds_remaining, NaN);
      if (c.combat.concentration.active && !Number.isFinite(cRounds)) {
        const inferred = inferConcentrationRoundsFromSource(c.combat.concentration.source, actions);
        if (Number.isFinite(inferred) && inferred > 0) {
          c.combat.concentration.rounds_remaining = inferred;
          cRounds = inferred;
          changed = true;
        }
      }
      if (c.combat.concentration.active && Number.isFinite(cRounds) && cRounds > 0) {
        changed = true;
        c.combat.concentration.rounds_remaining = Math.max(0, cRounds - roundsToAdvance);
        if (c.combat.concentration.rounds_remaining <= 0) {
          c.combat.concentration.active = false;
          c.combat.concentration.source = "";
        }
      }
    });
    const stateAfter = getState();
    const activeConcentration = Boolean(stateAfter?.character?.combat?.concentration?.active);
    const activeConditionsAfter = Array.isArray(stateAfter?.character?.combat?.conditions)
      ? stateAfter.character.combat.conditions.some((row) => {
          if (!row) return false;
          if (typeof row === "string") return true;
          return row.active !== false;
        })
      : false;
    if (!activeConcentration) setConditionControls({ showConcentration: false });
    if (!activeConditionsAfter) setConditionControls({ showConditions: false });
    if (changed) recordPlayAction(`Advanced ${roundsToAdvance} round${roundsToAdvance === 1 ? "" : "s"}`);
  }

  function openDiceTray() {
    uiState.diceTray.open = true;
    render();
  }

  function closeDiceTray() {
    uiState.diceTray.open = false;
    uiState.diceTray.rolling = false;
    render();
  }

  function openChecksDrawer() {
    uiState.checksDrawerOpen = true;
    render();
  }

  function closeChecksDrawer() {
    uiState.checksDrawerOpen = false;
    render();
  }

  function secureDieRoll(sides) {
    const max = Math.max(2, asInt(sides, 20));
    const span = Math.floor(0x100000000 / max) * max;
    const bucket = new Uint32Array(1);
    let v = 0;
    do {
      crypto.getRandomValues(bucket);
      v = bucket[0];
    } while (v >= span);
    return (v % max) + 1;
  }

  function buildDicePayload(die, count, mod) {
    const rolls = Array.from({ length: count }, () => secureDieRoll(die));
    const subtotal = rolls.reduce((a, b) => a + b, 0);
    const total = subtotal + mod;
    const label = `${count}d${die}${mod ? (mod > 0 ? ` + ${mod}` : ` - ${Math.abs(mod)}`) : ""}`;
    return { die, count, mod, rolls, subtotal, total, label, utc: new Date().toISOString() };
  }

  function applyDicePayload(payload) {
    const { die, count, mod, rolls, subtotal, total, label, utc } = payload;
    actions.updateCharacter((c) => {
      c.play_state = c.play_state || {};
      c.play_state.dice_last_roll = {
        die,
        count,
        mod,
        rolls,
        subtotal,
        total,
        label,
        utc
      };
      c.log = Array.isArray(c.log) ? c.log : [];
      c.log.push({ id: crypto.randomUUID(), utc, tag: "roll", message: `${label} => [${rolls.join(", ")}] = ${total}` });
    });
    recordPlayAction(`Rolled ${label}: ${total}`);
  }

  function performDiceRoll() {
    const die = Math.max(2, asInt(uiState.diceTray.die, 20));
    const count = clamp(asInt(uiState.diceTray.count, 1), 1, 20);
    const mod = clamp(asInt(uiState.diceTray.mod, 0), -99, 99);
    applyDicePayload(buildDicePayload(die, count, mod));
  }

  function applyCheckRollResult(payload, type, id, label, mod) {
    const d20 = payload.rolls?.[0] ?? payload.total;
    const nat1 = d20 === 1;
    const nat20 = d20 === 20;
    actions.updateCharacter((c) => {
      c.play_state = c.play_state || {};
      c.play_state.last_check_roll = {
        type,
        id,
        label,
        mod,
        d20,
        total: payload.total,
        nat1,
        nat20,
        utc: payload.utc
      };
      c.log = Array.isArray(c.log) ? c.log : [];
      c.log.push({
        id: crypto.randomUUID(),
        utc: payload.utc,
        tag: type === "save" ? "save" : "check",
        message: `${label}: d20(${d20}) ${mod >= 0 ? "+" : "-"} ${Math.abs(mod)} = ${payload.total}`
      });
    });
    recordPlayAction(`${label}: d20(${d20}) ${mod >= 0 ? "+" : "-"} ${Math.abs(mod)} = ${payload.total}${nat20 ? " (nat 20)" : nat1 ? " (nat 1)" : ""}`);
  }

  function performModifierRoll(type, id, label, mod = 0) {
    const payload = buildDicePayload(20, 1, clamp(asInt(mod, 0), -99, 99));
    applyCheckRollResult(payload, type, id, label, mod);
  }

  function performInitiativeRoll() {
    const state = getState();
    const derived = deriveStats(state.character || {});
    const initiativeMod = asInt(derived?.abilityMods?.dex, 0);
    const payload = buildDicePayload(20, 1, initiativeMod);
    const d20 = payload.rolls?.[0] ?? payload.total;
    actions.updateCharacter((c) => {
      c.combat = c.combat || {};
      c.combat.initiative_bonus = payload.total;
      c.play_state = c.play_state || {};
      c.play_state.last_check_roll = {
        type: "initiative",
        id: "initiative",
        label: "Initiative",
        mod: initiativeMod,
        d20,
        total: payload.total,
        nat1: d20 === 1,
        nat20: d20 === 20,
        utc: payload.utc
      };
      c.log = Array.isArray(c.log) ? c.log : [];
      c.log.push({ id: crypto.randomUUID(), utc: payload.utc, tag: "initiative", message: `Rolled initiative: d20(${d20}) ${initiativeMod >= 0 ? "+" : "-"} ${Math.abs(initiativeMod)} = ${payload.total}` });
    });
    recordPlayAction(`Rolled initiative: d20(${d20}) ${initiativeMod >= 0 ? "+" : "-"} ${Math.abs(initiativeMod)} = ${payload.total}`);
  }

  function openPortraitCrop(src, iw, ih) {
    uiState.portraitCrop = { open: true, src, zoom: 1, x: 0, y: 0, iw, ih };
    render();
  }

  function closePortraitCrop() {
    uiState.portraitCrop = { open: false, src: "", zoom: 1, x: 0, y: 0, iw: 0, ih: 0 };
    render();
  }

  function drawPortraitPreview(size = 280) {
    const crop = uiState.portraitCrop;
    if (!crop.open || !crop.src) return;
    const canvas = root.querySelector("#portraitPreview");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, size, size);
      const base = Math.max(size / img.width, size / img.height) * crop.zoom;
      const dw = img.width * base;
      const dh = img.height * base;
      const dx = (size - dw) / 2 + crop.x * ((Math.abs(size - dw)) / 2);
      const dy = (size - dh) / 2 + crop.y * ((Math.abs(size - dh)) / 2);
      ctx.drawImage(img, dx, dy, dw, dh);
    };
    img.src = crop.src;
  }

  function savePortraitFromCrop() {
    const crop = uiState.portraitCrop;
    if (!crop.open || !crop.src) return;
    const img = new Image();
    img.onload = () => {
      const out = document.createElement("canvas");
      out.width = 1024;
      out.height = 1024;
      const ctx = out.getContext("2d");
      const base = Math.max(1024 / img.width, 1024 / img.height) * crop.zoom;
      const dw = img.width * base;
      const dh = img.height * base;
      const dx = (1024 - dw) / 2 + crop.x * ((Math.abs(1024 - dw)) / 2);
      const dy = (1024 - dh) / 2 + crop.y * ((Math.abs(1024 - dh)) / 2);
      ctx.drawImage(img, dx, dy, dw, dh);
      const dataUrl = out.toDataURL("image/jpeg", 0.92);
      actions.updateCharacter((c) => {
        c.ui = c.ui || {};
        c.ui.portrait = { data_url: dataUrl, width: 1024, height: 1024, mime: "image/jpeg" };
      });
      closePortraitCrop();
    };
    img.src = crop.src;
  }

  function markEdited(sectionKey) {
    if (!sectionKey || !Object.prototype.hasOwnProperty.call(uiState.edited, sectionKey)) return;
    uiState.edited[sectionKey] = true;
  }

  function clearEdited() {
    for (const k of Object.keys(uiState.edited)) uiState.edited[k] = false;
  }

  function commandRegistry() {
    const state = getState();
    const hasCharacter = Boolean(state.character);
    return [
      { id: "save", label: "Save Character", hint: "Cmd/Ctrl+S", keywords: ["save", "persist"], enabled: () => hasCharacter, run: () => actions.saveNow() },
      { id: "import", label: "Import ZIP", hint: "Pack import", keywords: ["import", "zip"], enabled: () => true, run: () => actions.importZip() },
      { id: "export", label: "Export ZIP", hint: "Pack export", keywords: ["export", "zip"], enabled: () => hasCharacter, run: () => actions.exportZip() },
      { id: "toggle-mode", label: uiState.mode === "edit" ? "Switch to Play Mode" : "Switch to Edit Mode", hint: "View mode", keywords: ["mode", "play", "edit"], enabled: () => hasCharacter, run: () => setMode(uiState.mode === "edit" ? "play" : "edit") },
      { id: "policy-core", label: "Policy: Core Only", hint: "Hide DM approval options", keywords: ["policy", "core", "dm"], enabled: () => true, run: () => setPolicyMode("core_only") },
      { id: "policy-all", label: "Policy: All Official", hint: "Include DM approval options", keywords: ["policy", "all", "official"], enabled: () => true, run: () => setPolicyMode("all_official") },
      { id: "ui.openDiagnosticsDrawer", label: "Open Diagnostics", hint: "Drawer", keywords: ["diagnostics", "report", "errors"], enabled: () => true, run: () => { uiState.diagnosticsOpen = true; } },
      { id: "ui.openToolsMenu", label: "Open Tools Menu", hint: "Header tools", keywords: ["tools", "gear", "menu"], enabled: () => true, run: () => { uiState.toolsMenuOpen = true; } },
      { id: "ui.openAppearanceCustomizer", label: "Customize Appearance", hint: "Theme board", keywords: ["appearance", "theme", "colors"], enabled: () => true, run: () => openAppearanceCustomizer() },
      { id: "ui.openPalette", label: "Open Command Palette", hint: "Cmd/Ctrl+K", keywords: ["palette", "command"], enabled: () => true, run: () => {
        uiState.palette.open = true;
        uiState.palette.query = "";
        uiState.palette.selected = 0;
      } },
      { id: "new", label: "Open Create Character", hint: "New draft", keywords: ["new", "create"], enabled: () => true, run: () => { uiState.showCreate = true; } },
      { id: "jump-core", label: "Jump: Core", hint: "Ctrl/Cmd+1", keywords: ["jump", "core"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(0) },
      { id: "jump-classes", label: "Jump: Classes", hint: "Ctrl/Cmd+2", keywords: ["jump", "classes"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(1) },
      { id: "jump-combat", label: "Jump: Combat", hint: "Ctrl/Cmd+3", keywords: ["jump", "combat"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(2) },
      { id: "jump-spells", label: "Jump: Spells", hint: "Ctrl/Cmd+4", keywords: ["jump", "spells"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(5) },
      { id: "jump-inventory", label: "Jump: Inventory", hint: "Ctrl/Cmd+5", keywords: ["jump", "inventory"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(6) },
      { id: "jump-trackers", label: "Jump: Trackers & Log", hint: "Ctrl/Cmd+6", keywords: ["jump", "trackers", "log"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(7) },
      { id: "lookup-spell", label: "Open Spell Lookup", hint: "Rules data", keywords: ["lookup", "spell"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("spell") },
      { id: "lookup-class", label: "Open Class Lookup", hint: "Rules data", keywords: ["lookup", "class"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("class") },
      { id: "lookup-subclass", label: "Open Subclass Lookup", hint: "Rules data", keywords: ["lookup", "subclass"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("subclass") },
      { id: "lookup-species", label: "Open Species Lookup", hint: "Rules data", keywords: ["lookup", "species"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("species") },
      { id: "ui.toggleDensity", label: uiState.densityMode === "compact" ? "Switch to Comfortable View" : "Switch to Compact View", hint: "Density", keywords: ["density", "compact", "comfortable"], enabled: () => true, run: () => setDensityMode(uiState.densityMode === "compact" ? "comfortable" : "compact") },
      { id: "ui.tab.core", label: "Tab: Core", hint: "Edit tab", keywords: ["tab", "core"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => setActiveEditTab("core") },
      { id: "ui.tab.battle", label: "Tab: Battle", hint: "Edit tab", keywords: ["tab", "battle"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => setActiveEditTab("battle") },
      { id: "ui.tab.spellcraft", label: "Tab: Spellcraft", hint: "Edit tab", keywords: ["tab", "spells"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => setActiveEditTab("spellcraft") },
      { id: "ui.tab.gear", label: "Tab: Gear", hint: "Edit tab", keywords: ["tab", "gear", "inventory"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => setActiveEditTab("gear") },
      { id: "ui.tab.chronicle", label: "Tab: Chronicle", hint: "Edit tab", keywords: ["tab", "chronicle"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => setActiveEditTab("chronicle") },
      { id: "ui.collapseAll", label: "Collapse All Sections", hint: "Edit", keywords: ["collapse", "sections"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => {
        const tab = uiState.activeEditTab || "core";
        uiState.collapsedSectionsByTab[tab] = Object.fromEntries(tabSections(tab).map((s) => [s, true]));
      } },
      { id: "ui.expandAll", label: "Expand All Sections", hint: "Edit", keywords: ["expand", "sections"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => {
        const tab = uiState.activeEditTab || "core";
        uiState.collapsedSectionsByTab[tab] = Object.fromEntries(tabSections(tab).map((s) => [s, false]));
      } },
      { id: "ui.pane.spells", label: "Play Pane: Spells", hint: "Play pane", keywords: ["pane", "spells"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("spells") },
      { id: "ui.pane.bonus", label: "Play Pane: Bonus Actions", hint: "Play pane", keywords: ["pane", "bonus", "actions", "class"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("bonus") },
      { id: "ui.pane.attacks", label: "Play Pane: Attacks", hint: "Play pane", keywords: ["pane", "attacks"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("attacks") },
      { id: "ui.pane.trackers", label: "Play Pane: Trackers", hint: "Play pane", keywords: ["pane", "trackers"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("trackers") },
      { id: "ui.pane.log", label: "Play Pane: Log", hint: "Play pane", keywords: ["pane", "log"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("log") },
      { id: "ui.pane.notes", label: "Play Pane: Notes", hint: "Play pane", keywords: ["pane", "notes", "session"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("notes") },
      { id: "ui.play.openChecksDrawer", label: "Play: Open Checks Drawer", hint: "Checks and saves", keywords: ["play", "checks", "saves", "drawer"], enabled: () => hasCharacter && uiState.mode === "play", run: () => openChecksDrawer() },
      { id: "ui.play.closeChecksDrawer", label: "Play: Close Checks Drawer", hint: "Checks and saves", keywords: ["play", "checks", "saves", "drawer", "close"], enabled: () => hasCharacter && uiState.mode === "play" && uiState.checksDrawerOpen, run: () => closeChecksDrawer() },
      { id: "ui.play.focusCast", label: "Play Focus: Cast", hint: "Turn console", keywords: ["play", "cast", "focus"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("spells") },
      { id: "ui.play.focusBonus", label: "Play Focus: Bonus Actions", hint: "Turn console", keywords: ["play", "bonus", "focus"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("bonus") },
      { id: "ui.play.focusAttack", label: "Play Focus: Attack", hint: "Turn console", keywords: ["play", "attack", "focus"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("attacks") },
      { id: "ui.play.focusChecks", label: "Play Focus: Checks", hint: "Checks and saves", keywords: ["play", "checks", "focus"], enabled: () => hasCharacter && uiState.mode === "play", run: () => openChecksDrawer() },
      { id: "ui.play.focusResources", label: "Play Focus: Resources", hint: "Turn console", keywords: ["play", "resources", "focus"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("trackers") },
      { id: "ui.play.toggleUtilityRail", label: uiState.playBoard?.utilityRailOpen !== false ? "Hide Utility Rail" : "Show Utility Rail", hint: "Play layout", keywords: ["play", "utility", "rail"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setPlayBoard({ utilityRailOpen: !(uiState.playBoard?.utilityRailOpen !== false) }) },
      { id: "ui.play.toggleCompactBand", label: uiState.playBoard?.bandCompact ? "Expand Combat Band" : "Compact Combat Band", hint: "Play layout", keywords: ["play", "combat", "band", "compact"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setPlayBoard({ bandCompact: !uiState.playBoard?.bandCompact }) },
      { id: "ui.play.toggleHud", label: uiState.playBoard?.hudCollapsed ? "Expand Combat HUD" : "Collapse Combat HUD", hint: "Play layout", keywords: ["play", "hud", "collapse"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setPlayBoard({ hudCollapsed: !uiState.playBoard?.hudCollapsed }) },
      { id: "play.openDiceTray", label: "Play: Roll Dice", hint: "Open dice tray", keywords: ["play", "dice", "roll", "d20"], enabled: () => hasCharacter && uiState.mode === "play", run: () => openDiceTray() },
      { id: "play.rollInitiative", label: "Play: Roll Initiative", hint: "1d20 + Dex", keywords: ["play", "initiative", "roll"], enabled: () => hasCharacter && uiState.mode === "play", run: () => performInitiativeRoll() },
      { id: "play.roll.d20", label: "Play: Quick Roll 1d20", hint: "Immediate roll", keywords: ["play", "quick", "d20"], enabled: () => hasCharacter && uiState.mode === "play", run: () => {
        uiState.diceTray = { ...uiState.diceTray, die: 20, count: 1, mod: 0 };
        performDiceRoll();
      } },
      { id: "play.shortRest", label: "Play: Short Rest", hint: "Restore pact slots", keywords: ["play", "short", "rest", "slots"], enabled: () => hasCharacter && uiState.mode === "play", run: () => performShortRest() },
      { id: "play.longRest", label: "Play: Long Rest", hint: "Restore all slots", keywords: ["play", "long", "rest", "slots"], enabled: () => hasCharacter && uiState.mode === "play", run: () => performLongRest() },
      { id: "play.undoLastCast", label: "Play: Undo Last Cast", hint: "Reverse recent cast", keywords: ["play", "undo", "cast"], enabled: () => hasCharacter && uiState.mode === "play", run: () => performUndoLastCast() },
      { id: "play.castSpell", label: "Play: Cast Spell", hint: "Consume selected slot", keywords: ["play", "cast", "spell"], enabled: () => false, run: () => {} }
    ];
  }

  function recordPlayAction(label) {
    uiState.lastAction = label;
    actions.updateCharacter((c) => {
      c.play_state = c.play_state || {};
      const existing = Array.isArray(c.play_state.recent_actions) ? c.play_state.recent_actions : [];
      c.play_state.recent_actions = [label, ...existing].slice(0, 5);
    });
  }

  function setCastFeedback(message) {
    actions.updateCharacter((c) => {
      c.play_state = c.play_state || {};
      c.play_state.cast_feedback = message;
    });
  }

  function adjustFeatureUse(featureId, delta = -1) {
    const state = getState();
    const actionsByKind = collectClassActionFeatures(state.character || {});
    const all = [...actionsByKind.bonus, ...actionsByKind.action, ...actionsByKind.reaction, ...actionsByKind.passive];
    const feature = all.find((f) => norm(f.id) === norm(featureId));
    if (!feature?.resource?.max) return;
    const max = Math.max(0, asInt(feature.resource.max, 0));
    const titleKey = norm(feature.title || "");
    const trackerIdx = (state.character?.trackers || []).findIndex((t) => {
      const l = norm(t?.label || "");
      return l && l.includes(titleKey);
    });
    actions.updateCharacter((c) => {
      c.play_state = c.play_state || {};
      c.play_state.feature_uses = c.play_state.feature_uses || {};
      if (trackerIdx >= 0 && c.trackers?.[trackerIdx]) {
        const t = c.trackers[trackerIdx];
        const tMax = Math.max(0, asInt(t.max, max));
        t.current = clamp(asInt(t.current, tMax) + asInt(delta, 0), 0, tMax);
        return;
      }
      const key = norm(feature.id);
      const cur = clamp(asInt(c.play_state.feature_uses[key], max), 0, max);
      c.play_state.feature_uses[key] = clamp(cur + asInt(delta, 0), 0, max);
    });
    recordPlayAction(`${delta < 0 ? "Used" : "Restored"} feature: ${feature.title}`);
  }

  function markFeatureUsed(featureId) {
    const state = getState();
    const actionsByKind = collectClassActionFeatures(state.character || {});
    const all = [...actionsByKind.bonus, ...actionsByKind.action, ...actionsByKind.reaction, ...actionsByKind.passive];
    const feature = all.find((f) => norm(f.id) === norm(featureId));
    if (!feature) return;
    recordPlayAction(`Used feature: ${feature.title}`);
  }

  function resetFeatureUses(restKind = "long") {
    actions.updateCharacter((c) => {
      const actionsByKind = collectClassActionFeatures(c || {});
      const all = [...actionsByKind.bonus, ...actionsByKind.action, ...actionsByKind.reaction, ...actionsByKind.passive];
      c.play_state = c.play_state || {};
      c.play_state.feature_uses = c.play_state.feature_uses || {};
      for (const feature of all) {
        const max = Math.max(0, asInt(feature?.resource?.max, 0));
        const reset = feature?.resource?.rest || "";
        if (!max) continue;
        if (restKind === "long" || (restKind === "short" && reset === "short")) {
          c.play_state.feature_uses[norm(feature.id)] = max;
        }
      }
    });
  }

  function performUndoLastCast() {
    const lvl = clamp(asInt(uiState.lastCastLevel, 0), 0, 9);
    if (lvl <= 0) {
      setCastFeedback("No prior leveled spell cast to undo.");
      return;
    }
    actions.updateCharacter((c) => {
      c.spell_slots = c.spell_slots || { levels: {} };
      c.spell_slots.levels = c.spell_slots.levels || {};
      const key = String(lvl);
      const row = c.spell_slots.levels[key] || { max: 0, used: 0 };
      row.used = Math.max(0, (row.used || 0) - 1);
      c.spell_slots.levels[key] = row;
    });
    recordPlayAction(`Undo cast: level ${lvl} slot refunded`);
    setCastFeedback(`Undo complete: restored one level ${lvl} slot.`);
  }

  function performShortRest() {
    actions.updateCharacter((c) => {
      const effective = computeEffectiveSlots(c);
      c.spell_slots = c.spell_slots || { levels: {}, pact: { max: 0, used: 0, level: 1 } };
      c.spell_slots.pact = {
        max: effective.pact?.max || 0,
        level: effective.pact?.level || 1,
        used: 0
      };
    });
    resetFeatureUses("short");
    recordPlayAction("Short rest: pact slots restored");
    setCastFeedback("Short rest applied: pact slots restored.");
  }

  function performLongRest() {
    actions.updateCharacter((c) => {
      const effective = computeEffectiveSlots(c);
      c.spell_slots = c.spell_slots || { levels: {}, pact: { max: 0, used: 0, level: 1 } };
      c.spell_slots.levels = c.spell_slots.levels || {};
      for (let i = 1; i <= 9; i++) {
        const key = String(i);
        const autoMax = effective.levels?.[key]?.max || 0;
        c.spell_slots.levels[key] = { max: autoMax, used: 0 };
      }
      c.spell_slots.pact = {
        max: effective.pact?.max || 0,
        level: effective.pact?.level || 1,
        used: 0
      };
    });
    resetFeatureUses("long");
    recordPlayAction("Long rest: all spell slots restored");
    setCastFeedback("Long rest applied: all spell slots restored.");
  }

  function openCastMenu(spellName, spellKey, baseLevel, spellRef = null) {
    const state = getState();
    const effective = computeEffectiveSlots(state.character).levels;
    const options = [];
    for (let lvl = baseLevel; lvl <= 9; lvl++) {
      const row = effective[String(lvl)] || { max: 0, used: 0 };
      const avail = Math.max(0, (row.max || 0) - (row.used || 0));
      if (avail > 0) options.push({ level: lvl, available: avail, max: row.max || 0 });
    }
    const catalogSpell = (() => {
      const cat = actions.getCatalog ? actions.getCatalog() : null;
      const spells = Array.isArray(cat?.spells) ? cat.spells : [];
      return findSpellByAnyKey(spells, spellRef?.id || spellRef?.spell_id || spellKey || spellName) || spells.find((s) => norm(s?.name) === norm(spellName)) || null;
    })();
    const detectedConcentration = toBoolFlag(spellRef?.concentration) || toBoolFlag(catalogSpell?.concentration);
    const detectedRounds = parseRoundsFromDuration(spellRef?.duration || catalogSpell?.duration || "");
    uiState.castMenu = {
      open: true,
      spellName,
      spellKey,
      baseLevel,
      options,
      spellRef: spellRef || uiState.castMenu?.spellRef || null,
      concentrationForce: detectedConcentration,
      concentrationRounds: Number.isFinite(detectedRounds) ? String(detectedRounds) : ""
    };
    render();
  }

  function closeCastMenu() {
    uiState.castMenu = { open: false, spellName: "", spellKey: "", baseLevel: 0, options: [], spellRef: null, concentrationForce: false, concentrationRounds: "" };
    render();
  }

  function performCastAtLevel(lvl, spellName = "Spell", spellRef = null, castOptions = {}) {
    const level = clamp(asInt(lvl, 0), 0, 9);
    if (level === 0) {
      setCastFeedback("Cantrip cast: no slot consumed.");
      recordPlayAction(`Cast cantrip: ${spellName}`);
      return;
    }
    let consumed = false;
    actions.updateCharacter((c) => {
      const effective = computeEffectiveSlots(c);
      const key = String(level);
      c.spell_slots = c.spell_slots || { levels: {} };
      c.spell_slots.levels = c.spell_slots.levels || {};
      const autoMax = effective.levels?.[key]?.max || 0;
      if (autoMax <= 0) return;
      const row = c.spell_slots.levels[key] || { max: autoMax, used: 0 };
      if ((row.used || 0) >= autoMax) return;
      row.max = autoMax;
      row.used = Math.min(autoMax, (row.used || 0) + 1);
      c.spell_slots.levels[key] = row;
      consumed = true;
    });
    if (consumed) {
      uiState.lastCastLevel = level;
      const castSpell = (() => {
        if (spellRef) return spellRef;
        const ch = getState().character || {};
        const knownRows = Array.isArray(ch.spells_known) ? ch.spells_known : [];
        const preparedRows = Array.isArray(ch.spells_prepared) ? ch.spells_prepared : [];
        const allRows = [...knownRows, ...preparedRows];
        return findSpellByAnyKey(allRows, spellName) || allRows.find((s) => norm(s?.name) === norm(spellName)) || null;
      })();
      const catalogSpell = (() => {
        const cat = actions.getCatalog ? actions.getCatalog() : null;
        const spells = Array.isArray(cat?.spells) ? cat.spells : [];
        const direct = findSpellByAnyKey(spells, castSpell?.id || castSpell?.spell_id || spellName);
        return direct || spells.find((s) => norm(s?.name) === norm(castSpell?.name || spellName)) || null;
      })();
      const isConcentration = toBoolFlag(castSpell?.concentration) || toBoolFlag(catalogSpell?.concentration);
      const manualConcentration = castOptions?.forceConcentration === true;
      if (isConcentration || manualConcentration) {
        const manualRounds = asInt(castOptions?.concentrationRounds, 0);
        const rounds = (() => {
          if (manualRounds > 0) return manualRounds;
          const fromCatalog = parseRoundsFromDuration(catalogSpell?.duration || "");
          if (Number.isFinite(fromCatalog) && fromCatalog > 0) return fromCatalog;
          const fromSpellRow = parseRoundsFromDuration(castSpell?.duration || "");
          if (Number.isFinite(fromSpellRow) && fromSpellRow > 0) return fromSpellRow;
          return null;
        })();
        const sourceName = castSpell?.name || catalogSpell?.name || spellName;
        actions.updateCharacter((c) => {
          c.combat = c.combat || {};
          c.combat.concentration = c.combat.concentration || { active: false, source: "", notes: "", rounds_remaining: null };
          c.combat.concentration.active = true;
          c.combat.concentration.source = sourceName;
          c.combat.concentration.rounds_remaining = Number.isFinite(rounds) ? rounds : null;
        });
        setConditionControls({ showConcentration: true });
        if (!Number.isFinite(rounds) || rounds <= 0) {
          openConcentrationEditor({ source: sourceName, active: true, rounds_remaining: "" });
          recordPlayAction(`Concentration started: ${sourceName} (set rounds)`);
        } else {
          recordPlayAction(`Concentration started: ${sourceName} (${rounds} rounds)`);
        }
      }
      setCastFeedback(`Cast applied: ${spellName} at level ${level}.`);
      recordPlayAction(`Cast ${spellName} at L${level}`);
      return;
    }
    setCastFeedback(`No level ${level} slots available.`);
  }

  function visibleCommands() {
    const q = norm(uiState.palette.query);
    return commandRegistry()
      .filter((cmd) => cmd.enabled())
      .filter((cmd) => {
        if (!q) return true;
        const hay = `${cmd.label} ${(cmd.keywords || []).join(" ")} ${cmd.id}`.toLowerCase();
        return hay.includes(q);
      });
  }

  function runCommand(id) {
    const cmd = commandRegistry().find((c) => c.id === id && c.enabled());
    if (!cmd) return;
    cmd.run();
    uiState.palette.recents = [id, ...uiState.palette.recents.filter((x) => x !== id)].slice(0, 8);
    uiState.palette.open = false;
    uiState.palette.query = "";
    uiState.palette.selected = 0;
    render();
  }

  function applyLookupSelection(index = uiState.lookup.selected) {
    const state = getState();
    const character = state.character;
    const row = uiState.lookup.results[index];
    if (!row || !character) return false;

    if (uiState.lookup.type === "species") {
      markEdited("core");
      actions.updateCharacter((c) => {
        c.core = c.core || { classes: [] };
        c.core.speciesId = row.id;
      });
      uiState.lookup.feedback = `Set species to ${row.title}.`;
      return true;
    }

    if (uiState.lookup.type === "class") {
      const existing = Array.isArray(character?.core?.classes)
        ? character.core.classes.some((x) => norm(x?.id) === norm(row.id))
        : false;
      if (existing) {
        uiState.lookup.feedback = `Class already present: ${row.title}.`;
        return false;
      }
      markEdited("classes");
      actions.updateCharacter((c) => {
        c.core = c.core || { classes: [] };
        c.core.classes = Array.isArray(c.core.classes) ? c.core.classes : [];
        c.core.classes.push({ id: row.id, level: 1, isPrimary: c.core.classes.length === 0, subclassId: "" });
      });
      uiState.lookup.feedback = `Added class ${row.title}.`;
      return true;
    }

    if (uiState.lookup.type === "spell") {
      const spellId = makeSpellId(row.raw);
      const exists = (character.spells_known || []).some((x) => (x.id || x.spell_id || x.name) === spellId);
      if (exists) {
        uiState.lookup.feedback = `Spell already exists: ${row.title}.`;
        return false;
      }
      markEdited("spells");
      actions.updateCharacter((c) => {
        c.spells_known = Array.isArray(c.spells_known) ? c.spells_known : [];
        c.spells_known.push({
          id: spellId,
          name: row.raw?.name || row.title,
          level: asInt(row.raw?.level, 0),
          school: row.raw?.school || "",
          source: row.raw?.source || "",
          ritual: toBoolFlag(row.raw?.ritual),
          concentration: toBoolFlag(row.raw?.concentration),
          casting_time: row.raw?.casting_time || "",
          range: row.raw?.range || "",
          components: row.raw?.components || "",
          duration: row.raw?.duration || "",
          spell_id: row.raw?.id || "",
          page: row.raw?.page || "",
          notes: ""
        });
      });
      uiState.lookup.feedback = `Added spell ${row.title}.`;
      return true;
    }

    if (uiState.lookup.type === "subclass") {
      const classRows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
      const targetIdx = classRows.findIndex((x) => norm(x?.id) === norm(row.raw?.class_id));
      if (targetIdx < 0) {
        uiState.lookup.feedback = `No matching class found for ${row.title}. Add ${row.raw?.class_id || "that class"} first.`;
        return false;
      }
      markEdited("classes");
      actions.updateCharacter((c) => {
        c.core = c.core || { classes: [] };
        c.core.classes = Array.isArray(c.core.classes) ? c.core.classes : [];
        if (!c.core.classes[targetIdx]) return;
        c.core.classes[targetIdx].subclassId = row.id;
      });
      uiState.lookup.feedback = `Set subclass to ${row.title}.`;
      return true;
    }

    return false;
  }

  function jumpToSection(idx) {
    const ids = uiState.mode === "edit" ? tabSections(uiState.activeEditTab || "core") : sectionIds;
    const id = ids[idx];
    if (!id) return;
    const el = root.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openLookup(type) {
    const active = document.activeElement;
    const section = active?.closest?.(".card[id]") || null;
    uiState.lookup.open = true;
    uiState.lookup.type = type;
    uiState.lookup.query = "";
    uiState.lookup.level = "";
    uiState.lookup.allowOffClassSpells = false;
    uiState.lookup.selected = 0;
    uiState.lookup.cursor = 0;
    uiState.lookup.feedback = "";
    uiState.lookup.originSectionId = section?.id || "";
    uiState.lookup.originScrollY = window.scrollY || 0;
    refreshLookup();
    render();
  }

  function closeLookup({ restore = true } = {}) {
    const sectionId = uiState.lookup.originSectionId;
    const scrollY = uiState.lookup.originScrollY;
    uiState.lookup.open = false;
    uiState.lookup.originSectionId = "";
    uiState.lookup.originScrollY = 0;
    render();
    if (!restore) return;
    requestAnimationFrame(() => {
      const target = sectionId ? root.querySelector(`#${sectionId}`) : null;
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      window.scrollTo({ top: scrollY, behavior: "smooth" });
    });
  }

  function cycleSections(step) {
    if (uiState.mode !== "edit") return;
    const ids = tabSections(uiState.activeEditTab || "core");
    const tops = ids
      .map((id, idx) => ({ idx, el: root.querySelector(`#${id}`) }))
      .filter((x) => x.el)
      .map((x) => ({ idx: x.idx, top: x.el.getBoundingClientRect().top }));
    if (!tops.length) return;
    const current = tops.find((x) => x.top > 0) || tops[tops.length - 1];
    const next = (current.idx + step + ids.length) % ids.length;
    jumpToSection(next);
  }

  function render() {
    const priorFocus = captureFocusState();
    const state = getState();
    const character = state.character;
    const rawCatalog = actions.getCatalog ? actions.getCatalog() : { classes: [], species: [], spells: [], error: "" };
    const catalog = policyCatalog(rawCatalog);
    const runtime = actions.getRuntimeStatus ? actions.getRuntimeStatus() : { message: "", tone: "info", at: "" };
    if (!state.app.dirty) clearEdited();
    refreshLookup();
    const commands = visibleCommands();

    applyAppearance(uiState.appearanceOpen ? uiState.appearanceDraft : resolveAppearance(character));

    const portrait = getEffectivePortrait(character);
    const hasPortrait = Boolean(portrait);
    const classBadgeRows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    const classBadgeItems = classBadgeRows
      .map((row) => ({ id: norm(row?.id), level: clamp(asInt(row?.level, 1), 1, 20) }))
      .filter((row) => row.id && getClassBadge(row.id))
      .filter((row, idx, arr) => arr.findIndex((x) => x.id === row.id) === idx);
    root.innerHTML = `
      <header class="shell-topbar ${hasPortrait ? "has-play-portrait" : ""}">
        ${hasPortrait ? `<img class="play-profile-portrait" src="${esc(portrait)}" alt="${esc(character?.meta?.name || "Character")} portrait" />` : ""}
        <div class="brand-block">
          <h1>${character ? esc(character?.meta?.name || "Unnamed") : "No active character"}</h1>
          <p class="brand-meta">${character ? esc(characterSubtitle(character, catalog)) : "The Living Codex"} </p>
          ${classBadgeItems.length ? `<div class="header-class-strip" aria-label="Class badges">
            ${classBadgeItems.map((row) => `<img class="header-class-badge" src="${esc(getClassBadge(row.id))}" alt="${esc(titleizeId(row.id))} class badge" title="${esc(`${titleizeId(row.id)} (Level ${row.level})`)}" />`).join("")}
          </div>` : ""}
        </div>
        <div class="top-actions">
          <div class="top-controls-grid">
            <div class="toggle-stack">
              <label class="dual-toggle-chip" for="policyModeToggle" title="Choose which player options appear in lookups and selectors">
                <span class="${uiState.policyMode === "all_official" ? "is-active" : ""}">All Official Player Options</span>
                <input id="policyModeToggle" type="checkbox" ${uiState.policyMode === "core_only" ? "checked" : ""} />
                <span class="policy-switch" aria-hidden="true"></span>
                <span class="${uiState.policyMode === "core_only" ? "is-active" : ""}">Core Options Only (PHB)</span>
              </label>
              <label class="dual-toggle-chip ${character ? "" : "is-disabled"}" for="modeToggle">
                <span class="${uiState.mode === "edit" ? "is-active" : ""}">Edit</span>
                <input id="modeToggle" type="checkbox" ${uiState.mode === "play" ? "checked" : ""} ${character ? "" : "disabled"} />
                <span class="policy-switch" aria-hidden="true"></span>
                <span class="${uiState.mode === "play" ? "is-active" : ""}">Play</span>
              </label>
            </div>
          </div>
          <div class="top-row-actions">
            <span class="status-chip ${state.app.dirty ? "dirty" : "saved"}" title="${esc(runtime.message || "No recent action")}">${state.app.dirty ? "Unsaved" : "Saved"}</span>
            <div class="tools-menu-wrap">
              <button type="button" id="toolsMenuBtn" title="Tools" aria-label="Tools">⚙</button>
              ${uiState.toolsMenuOpen ? `<div class="tools-menu" id="toolsMenu">
                <button type="button" id="toolsOpenPalette">Command Palette</button>
                <button type="button" id="toolsExportPdf" ${character ? "" : "disabled"}>Export PDF</button>
                <button type="button" id="toolsOpenAppearance">Customize Appearance</button>
                <button type="button" id="toolsOpenDiagnostics">Diagnostics</button>
              </div>` : ""}
            </div>
            <button type="button" class="btn-primary" id="saveBtn" ${character ? "" : "disabled"}>Save</button>
            <button type="button" id="importBtn">Import</button>
            <div class="tools-menu-wrap export-menu-wrap">
              <button type="button" id="exportMenuBtn" ${character ? "" : "disabled"}>Export</button>
              ${uiState.exportMenuOpen ? `<div class="tools-menu" id="exportMenu">
                <button type="button" id="exportZipOption" ${character ? "" : "disabled"}>Export ZIP</button>
                <button type="button" id="exportPdfOption" ${character ? "" : "disabled"}>Export PDF</button>
              </div>` : ""}
            </div>
            <button type="button" id="newCharBtn">New Character</button>
          </div>
        </div>
      </header>

      ${(!character || uiState.showCreate) ? `<section class="card"><h2>Create Character</h2><div class="card-body create-grid">
        <div class="create-portrait-preview">
          ${getDraftPortrait(draft.speciesId)
            ? `<img src="${esc(getDraftPortrait(draft.speciesId))}" alt="${esc(titleizeId(draft.speciesId || "species"))} portrait preview" />`
            : `<div class="create-portrait-placeholder">Select a species to preview default portrait</div>`}
        </div>
        <label>Name<input id="newName" value="${esc(draft.name)}" /></label>
        <label>Ruleset<select id="newRuleset"><option value="dnd5e_2014" ${draft.rulesetId === "dnd5e_2014" ? "selected" : ""}>D&D 5e (2014)</option><option value="dnd5e_2024" ${draft.rulesetId === "dnd5e_2024" ? "selected" : ""}>D&D 5e (2024)</option></select></label>
        <label>Class
          <div class="create-class-picker">
            ${getClassBadge(draft.classId) ? `<img class="create-class-badge" src="${esc(getClassBadge(draft.classId))}" alt="${esc(titleizeId(draft.classId || "class"))} badge" />` : `<span class="create-class-badge-placeholder" aria-hidden="true"></span>`}
            <select id="newClass">${optionList(catalog.classes || [], draft.classId, "Optional class")}</select>
          </div>
        </label>
        <label>Species<select id="newSpecies">${optionList(catalog.species || [], draft.speciesId, "Optional species")}</select></label>
        <div class="create-identity-preview">
          ${getClassBadge(draft.classId) ? `<img class="create-class-badge" src="${esc(getClassBadge(draft.classId))}" alt="${esc(titleizeId(draft.classId || "class"))} badge" />` : `<span class="create-class-badge-placeholder" aria-hidden="true"></span>`}
          <span>${esc(titleizeId(draft.classId || "no class selected"))}</span>
          <span>•</span>
          <span>${esc(titleizeId(draft.speciesId || "no species selected"))}</span>
        </div>
        <div class="six-grid">${["str", "dex", "con", "int", "wis", "cha"].map((k) => `<label>${k.toUpperCase()}<input id="new${k.toUpperCase()}" type="number" min="1" max="30" value="${esc(draft[k])}" /></label>`).join("")}</div>
        <div class="inline-actions"><button type="button" class="btn-primary" id="createBtn">Create Character</button>${character ? `<button type="button" id="cancelCreateBtn">Cancel</button>` : ""}</div>
      </div></section>` : `${uiState.mode === "play" ? renderPlayMode(character, uiState, actions) : renderEditMode(character, catalog, uiState.lookup, uiState.edited, uiState)}`}

      ${renderPalette(uiState.palette, commands)}
      ${uiState.appearanceOpen ? `<div class="palette-overlay" id="appearanceOverlay">
        <section class="palette cast-menu" role="dialog" aria-modal="true">
          <button type="button" class="overlay-close" data-overlay-close="appearance" aria-label="Close overlay">×</button>
          <h3>Customize Appearance</h3>
          <p class="hint">Theme source: <strong>${uiState.appearanceSource === "auto" ? `Auto (${esc(uiState.appearanceAutoLabel)})` : "User Customized"}</strong></p>
          <div class="grid2 appearance-grid">
            ${APPEARANCE_FIELDS.map(([key, label]) => `<label>${esc(label)}<input type="color" data-appearance-color="${esc(key)}" value="${esc(uiState.appearanceDraft[key])}" /></label>`).join("")}
            <label>Surface Transparency<input type="range" min="0.65" max="1" step="0.01" data-appearance-range="surfaceAlpha" value="${esc(uiState.appearanceDraft.surfaceAlpha)}" /></label>
            <label>Shadow Depth<input type="range" min="12" max="44" step="1" data-appearance-range="shadowBlur" value="${esc(uiState.appearanceDraft.shadowBlur)}" /></label>
            <label>Shadow Opacity<input type="range" min="0.05" max="0.28" step="0.01" data-appearance-range="shadowOpacity" value="${esc(uiState.appearanceDraft.shadowOpacity)}" /></label>
          </div>
          <div class="inline-actions">
            <button type="button" id="appearanceReset">Reset to Auto Theme</button>
            <button type="button" id="appearanceCancel">Cancel</button>
            <button type="button" class="btn-primary" id="appearanceSave">Save Theme</button>
          </div>
        </section>
      </div>` : ""}
      ${uiState.castMenu.open ? `<div class="palette-overlay" id="castOverlay">
        <section class="palette cast-menu" role="dialog" aria-modal="true">
          <button type="button" class="overlay-close" data-overlay-close="cast" aria-label="Close overlay">×</button>
          <h3>Cast ${esc(uiState.castMenu.spellName)}</h3>
          <p class="hint">Choose spell slot level</p>
          <div class="cast-options">
            ${uiState.castMenu.options.length ? uiState.castMenu.options.map((x) => `<button type="button" data-cast-at="${x.level}">Level ${x.level} (${x.available}/${x.max})</button>`).join("") : `<p class="hint">No available slots for this spell.</p>`}
          </div>
          <div class="inline-actions"><button type="button" id="castMenuCancel">Cancel</button></div>
        </section>
      </div>` : ""}
      ${uiState.conditionEditor.open ? `<div class="palette-overlay" id="conditionOverlay">
        <section class="palette cast-menu" role="dialog" aria-modal="true">
          <button type="button" class="overlay-close" data-overlay-close="condition" aria-label="Close overlay">×</button>
          <h3>${uiState.conditionEditor.index === -2 ? "Set Concentration Details" : (uiState.conditionEditor.index >= 0 ? "Edit Condition" : "Add Condition")}</h3>
          <div class="stack">
            ${uiState.conditionEditor.index === -2 ? `<p class="hint">Tell the app what you are concentrating on, and if known, how many rounds concentration lasts.</p>` : ""}
            ${uiState.conditionEditor.index === -2 ? "" : `<label>Name<input id="condName" value="${esc(uiState.conditionEditor.model.name || "")}" placeholder="e.g. Poisoned" /></label>`}
            <label>${uiState.conditionEditor.index === -2 ? "Concentrating on" : "Source"}<input id="condSource" value="${esc(uiState.conditionEditor.model.source || "")}" placeholder="e.g. Hold Person" /></label>
            ${uiState.conditionEditor.index === -2 ? "" : `<label>Duration text<input id="condDuration" value="${esc(uiState.conditionEditor.model.duration || "")}" placeholder="e.g. Until the start of your next turn" /></label>`}
            <label>${uiState.conditionEditor.index === -2 ? "How many rounds does concentration last?" : "How many rounds does this condition last?"}<input id="condRounds" type="number" min="1" value="${esc(uiState.conditionEditor.model.rounds_remaining ?? "")}" placeholder="Leave blank if open-ended" /></label>
            <label>Notes<textarea id="condNotes">${esc(uiState.conditionEditor.model.notes || "")}</textarea></label>
            <label class="check"><input type="checkbox" id="condActive" ${uiState.conditionEditor.model.active !== false ? "checked" : ""}/>Active</label>
          </div>
          <div class="inline-actions">
            ${(uiState.conditionEditor.index >= 0 || uiState.conditionEditor.index === -2) ? `<button type="button" id="condDelete">${uiState.conditionEditor.index === -2 ? "Clear" : "Remove"}</button>` : ""}
            <button type="button" id="condCancel">Cancel</button>
            <button type="button" class="btn-primary" id="condSave">Save</button>
          </div>
        </section>
      </div>` : ""}
      ${uiState.diceTray.open ? `<div class="palette-overlay" id="diceOverlay">
        <section class="palette cast-menu dice-tray" role="dialog" aria-modal="true" style="--die-outline:${esc(dieOutlineColor(uiState.diceTray.die))}">
          <button type="button" class="overlay-close" data-overlay-close="dice" aria-label="Close overlay">×</button>
          <h3>Dice Tray</h3>
          <p class="hint">Choose dice, then roll.</p>
          <div class="grid2">
            <label>Dice Type
              <select id="diceType">
                ${[4, 6, 8, 10, 12, 20, 100].map((d) => `<option value="${d}" ${asInt(uiState.diceTray.die, 20) === d ? "selected" : ""}>d${d}</option>`).join("")}
              </select>
            </label>
            <label>Dice Count<input id="diceCount" type="number" min="1" max="20" value="${esc(uiState.diceTray.count)}" /></label>
            <label>Modifier<input id="diceMod" type="number" min="-99" max="99" value="${esc(uiState.diceTray.mod)}" /></label>
          </div>
          <div class="inline-actions">
            <button type="button" id="diceQuickD20">Quick 1d20</button>
            <button type="button" id="diceQuick2d6">Quick 2d6</button>
            <button type="button" id="diceCancel">Close</button>
            <button type="button" class="btn-primary" id="diceRollBtn">Roll</button>
          </div>
          ${character?.play_state?.dice_last_roll ? `<div class="dice-result">
            <p><strong>${esc(character.play_state.dice_last_roll.label || "Roll")}</strong></p>
            <p class="dice-result-rolls">Dice: ${(character.play_state.dice_last_roll.rolls || []).map((v) => `<span class="die-chip ${dieShapeClass(character.play_state.dice_last_roll.die || uiState.diceTray.die)}">${esc(v)}</span>`).join("")}</p>
            <p>Total: <strong>${esc(character.play_state.dice_last_roll.total ?? 0)}</strong></p>
          </div>` : ""}
        </section>
      </div>` : ""}
      ${uiState.diagnosticsOpen ? `<div class="palette-overlay" id="diagnosticsOverlay">
        <section class="diag-drawer" role="dialog" aria-modal="true">
          <button type="button" class="overlay-close" data-overlay-close="diagnostics" aria-label="Close overlay">×</button>
          <h3>Diagnostics</h3>
          <div class="diag-drawer-body">
            ${runtime.message ? `<p class="tone tone-${esc(runtime.tone || "info")}">${esc(runtime.message)}</p>` : `<p class="hint">No recent runtime message.</p>`}
            ${rawCatalog.error ? `<p class="error">Rules data error: ${esc(rawCatalog.error)}</p>` : ""}
            ${state.app.lastError ? `<p class="error">App error: ${esc(state.app.lastError)}</p>` : ""}
            ${renderReport(state.importReport)}
          </div>
        </section>
      </div>` : ""}
      ${uiState.portraitCrop.open ? `<div class="palette-overlay" id="portraitOverlay">
        <section class="palette cast-menu" role="dialog" aria-modal="true">
          <button type="button" class="overlay-close" data-overlay-close="portrait" aria-label="Close overlay">×</button>
          <h3>Crop Portrait</h3>
          <div class="split-grid">
            <canvas id="portraitPreview" width="280" height="280"></canvas>
            <div class="stack">
              <label>Zoom<input id="portraitZoom" type="range" min="1" max="3" step="0.01" value="${esc(uiState.portraitCrop.zoom)}" /></label>
              <label>Horizontal<input id="portraitX" type="range" min="-1" max="1" step="0.01" value="${esc(uiState.portraitCrop.x)}" /></label>
              <label>Vertical<input id="portraitY" type="range" min="-1" max="1" step="0.01" value="${esc(uiState.portraitCrop.y)}" /></label>
            </div>
          </div>
          <div class="inline-actions"><button type="button" id="portraitCancel">Cancel</button><button type="button" class="btn-primary" id="portraitSave">Save Portrait</button></div>
        </section>
      </div>` : ""}
      <footer class="app-footer">
        <div class="app-footer-mark" aria-hidden="true"></div>
        <div class="app-footer-left">
          <strong>The Living Codex <sup>v2</sup></strong>
        </div>
        <div class="app-footer-right">
          <p>Dungeons & Dragons and related marks are property of Wizards of the Coast. All trademarks and copyrights belong to their respective owners.</p>
          <p>No warranty. Use at your own risk; you’re responsible for outcomes and any errors.</p>
        </div>
      </footer>
    `;

    bindEvents();

    let explicitFocusHandled = false;
    if (uiState.palette.open) {
      const query = root.querySelector("#paletteQuery");
      if (query) {
        query.focus();
        explicitFocusHandled = true;
      }
    }

    if (uiState.lookup.open) {
      const lookup = root.querySelector("#lookupQuery");
      if (lookup) {
        lookup.focus();
        const pos = clamp(asInt(uiState.lookup.cursor, lookup.value.length), 0, lookup.value.length);
        lookup.setSelectionRange(pos, pos);
        explicitFocusHandled = true;
      }
    }
    if (uiState.portraitCrop.open) drawPortraitPreview();
    if (!explicitFocusHandled) restoreFocusState(priorFocus);
  }

  function bindEvents() {
    const state = getState();
    const character = state.character;

    root.querySelector("#toolsMenuBtn")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      uiState.toolsMenuOpen = !uiState.toolsMenuOpen;
      uiState.exportMenuOpen = false;
      if (uiState.toolsMenuOpen) uiState.toolsMenuOpenedAt = Date.now();
      render();
    });
    root.querySelector("#exportMenuBtn")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!character) return;
      uiState.exportMenuOpen = !uiState.exportMenuOpen;
      uiState.toolsMenuOpen = false;
      if (uiState.exportMenuOpen) uiState.exportMenuOpenedAt = Date.now();
      render();
    });
    root.querySelector("#toolsOpenPalette")?.addEventListener("click", () => {
      uiState.toolsMenuOpen = false;
      uiState.palette.open = true;
      uiState.palette.query = "";
      uiState.palette.selected = 0;
      render();
    });
    root.querySelector("#toolsExportPdf")?.addEventListener("click", async () => {
      uiState.toolsMenuOpen = false;
      render();
      await actions.exportPdf();
    });
    root.querySelector("#exportZipOption")?.addEventListener("click", async () => {
      uiState.exportMenuOpen = false;
      render();
      await actions.exportZip();
    });
    root.querySelector("#exportPdfOption")?.addEventListener("click", async () => {
      uiState.exportMenuOpen = false;
      render();
      await actions.exportPdf();
    });
    root.querySelector("#toolsOpenAppearance")?.addEventListener("click", () => openAppearanceCustomizer());
    root.querySelector("#toolsOpenDiagnostics")?.addEventListener("click", () => {
      uiState.toolsMenuOpen = false;
      uiState.diagnosticsOpen = true;
      render();
    });
    root.querySelector("#saveBtn")?.addEventListener("click", () => actions.saveNow());
    root.querySelector("#densityToggle")?.addEventListener("click", () => {
      setDensityMode(uiState.densityMode === "compact" ? "comfortable" : "compact");
      render();
    });
    root.querySelector("#newCharBtn")?.addEventListener("click", () => {
      uiState.showCreate = true;
      render();
    });
    root.querySelector("#policyModeToggle")?.addEventListener("change", (e) => {
      setPolicyMode(e.target.checked ? "core_only" : "all_official");
      render();
    });
    root.querySelector("#importBtn")?.addEventListener("click", async () => {
      await actions.importZip();
      if (getState().character) {
        uiState.showCreate = false;
        render();
      }
    });
    root.querySelector("#modeToggle")?.addEventListener("change", (e) => {
      setMode(e.target.checked ? "play" : "edit");
      render();
    });

    root.querySelector("#createBtn")?.addEventListener("click", () => {
      draft.name = root.querySelector("#newName")?.value || draft.name;
      draft.rulesetId = root.querySelector("#newRuleset")?.value || draft.rulesetId;
      draft.classId = root.querySelector("#newClass")?.value || "";
      draft.speciesId = root.querySelector("#newSpecies")?.value || "";
      for (const k of ["str", "dex", "con", "int", "wis", "cha"]) draft[k] = asInt(root.querySelector(`#new${k.toUpperCase()}`)?.value, 10);
      actions.newCharacter(draft);
      uiState.showCreate = false;
    });
    root.querySelector("#newSpecies")?.addEventListener("change", (e) => {
      draft.speciesId = e.target.value || "";
      render();
    });
    root.querySelector("#newClass")?.addEventListener("change", (e) => {
      draft.classId = e.target.value || "";
      render();
    });
    root.querySelector("#cancelCreateBtn")?.addEventListener("click", () => {
      uiState.showCreate = false;
      render();
    });

    root.querySelector("#paletteOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "paletteOverlay") {
        uiState.palette.open = false;
        render();
      }
    });
    root.querySelector("#appearanceOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "appearanceOverlay") closeAppearanceCustomizer({ revert: true });
    });
    root.querySelectorAll("[data-overlay-close]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const type = e.currentTarget.getAttribute("data-overlay-close");
        if (type === "palette") {
          uiState.palette.open = false;
          render();
          return;
        }
        if (type === "lookup") {
          closeLookup({ restore: true });
          return;
        }
        if (type === "cast") {
          closeCastMenu();
          return;
        }
        if (type === "condition") {
          closeConditionEditor();
          return;
        }
        if (type === "dice") {
          closeDiceTray();
          return;
        }
        if (type === "appearance") {
          closeAppearanceCustomizer({ revert: true });
          return;
        }
        if (type === "diagnostics") {
          uiState.diagnosticsOpen = false;
          render();
          return;
        }
        if (type === "portrait") {
          closePortraitCrop();
        }
      });
    });
    root.querySelector("#appearanceCancel")?.addEventListener("click", () => closeAppearanceCustomizer({ revert: true }));
    root.querySelector("#appearanceReset")?.addEventListener("click", () => {
      const stateNow = getState();
      const auto = deriveAutoAppearance(stateNow.character);
      uiState.appearanceDraft = auto.appearance;
      uiState.appearanceSource = "auto";
      uiState.appearanceAutoLabel = auto.label;
      persistAppearance(stateNow.character, auto.appearance, "auto");
      applyAppearance(uiState.appearanceDraft);
      render();
    });
    root.querySelector("#appearanceSave")?.addEventListener("click", () => {
      const finalAppearance = sanitizeAppearance(uiState.appearanceDraft);
      localStorage.setItem(APPEARANCE_KEY, JSON.stringify(finalAppearance));
      uiState.appearanceSource = "user";
      const stateNow = getState();
      persistAppearance(stateNow.character, finalAppearance, "user");
      closeAppearanceCustomizer({ revert: false });
    });
    root.querySelectorAll("[data-appearance-color]").forEach((el) => el.addEventListener("input", (e) => {
      const key = e.target.getAttribute("data-appearance-color");
      uiState.appearanceDraft[key] = e.target.value;
      applyAppearance(uiState.appearanceDraft);
    }));
    root.querySelectorAll("[data-appearance-range]").forEach((el) => el.addEventListener("input", (e) => {
      const key = e.target.getAttribute("data-appearance-range");
      uiState.appearanceDraft[key] = e.target.value;
      applyAppearance(uiState.appearanceDraft);
    }));
    root.querySelector("#castOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "castOverlay") closeCastMenu();
    });
    root.querySelector("#conditionOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "conditionOverlay") closeConditionEditor();
    });
    root.querySelector("#diceOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "diceOverlay") closeDiceTray();
    });
    root.querySelector("#checksDrawerOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "checksDrawerOverlay") closeChecksDrawer();
    });
    root.querySelector("#diagnosticsOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "diagnosticsOverlay") {
        uiState.diagnosticsOpen = false;
        render();
      }
    });
    root.querySelector("#portraitOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "portraitOverlay") closePortraitCrop();
    });
    root.querySelector("#castMenuCancel")?.addEventListener("click", () => closeCastMenu());
    root.querySelector("#condCancel")?.addEventListener("click", () => {
      if (uiState.conditionEditor.index === -2) {
        setConditionControls({ showConcentration: false });
      } else {
        setConditionControls({ showConditions: false });
      }
      closeConditionEditor();
    });
    root.querySelector("#condSave")?.addEventListener("click", () => {
      const idx = uiState.conditionEditor.index;
      const payload = {
        name: (root.querySelector("#condName")?.value || "").trim(),
        source: (root.querySelector("#condSource")?.value || "").trim(),
        duration: (root.querySelector("#condDuration")?.value || "").trim(),
        rounds_remaining: (() => {
          const raw = (root.querySelector("#condRounds")?.value || "").trim();
          if (!raw) return null;
          const n = asInt(raw, 0);
          return n > 0 ? n : null;
        })(),
        notes: (root.querySelector("#condNotes")?.value || "").trim(),
        active: Boolean(root.querySelector("#condActive")?.checked)
      };
      if (idx !== -2 && !payload.name) return;
      if (idx === -2) {
        actions.updateCharacter((c) => {
          c.combat = c.combat || {};
          c.combat.concentration = c.combat.concentration || { active: false, source: "", notes: "", rounds_remaining: null };
          c.combat.concentration.active = payload.active;
          c.combat.concentration.source = payload.source;
          c.combat.concentration.notes = payload.notes;
          c.combat.concentration.rounds_remaining = payload.rounds_remaining;
        });
        setConditionControls({ showConcentration: payload.active || Boolean(payload.source || payload.rounds_remaining) });
        recordPlayAction(payload.active ? `Concentration set: ${payload.source || "effect"}` : "Concentration cleared");
        closeConditionEditor();
        return;
      }
      actions.updateCharacter((c) => {
        c.combat = c.combat || {};
        c.combat.conditions = Array.isArray(c.combat.conditions) ? c.combat.conditions : [];
        if (idx >= 0 && c.combat.conditions[idx]) c.combat.conditions[idx] = payload;
        else c.combat.conditions.push(payload);
      });
      recordPlayAction(`${idx >= 0 ? "Updated" : "Added"} condition: ${payload.name}`);
      closeConditionEditor();
    });
    root.querySelector("#condDelete")?.addEventListener("click", () => {
      const idx = uiState.conditionEditor.index;
      if (idx === -2) {
        actions.updateCharacter((c) => {
          c.combat = c.combat || {};
          c.combat.concentration = { active: false, source: "", notes: "", rounds_remaining: null };
        });
        setConditionControls({ showConcentration: false });
        recordPlayAction("Concentration cleared");
        closeConditionEditor();
        return;
      }
      if (idx < 0) return;
      actions.updateCharacter((c) => {
        c.combat = c.combat || {};
        c.combat.conditions = Array.isArray(c.combat.conditions) ? c.combat.conditions : [];
        if (idx >= 0 && idx < c.combat.conditions.length) c.combat.conditions.splice(idx, 1);
      });
      setConditionControls({ showConditions: false });
      recordPlayAction("Removed condition");
      closeConditionEditor();
    });
    root.querySelector("#diceCancel")?.addEventListener("click", () => closeDiceTray());
    root.querySelector("#checksDrawerClose")?.addEventListener("click", () => closeChecksDrawer());
    root.querySelector("#diceQuickD20")?.addEventListener("click", () => {
      uiState.diceTray.die = 20;
      uiState.diceTray.count = 1;
      uiState.diceTray.mod = 0;
      performDiceRoll();
      render();
    });
    root.querySelector("#diceQuick2d6")?.addEventListener("click", () => {
      uiState.diceTray.die = 6;
      uiState.diceTray.count = 2;
      uiState.diceTray.mod = 0;
      performDiceRoll();
      render();
    });
    root.querySelector("#diceType")?.addEventListener("change", (e) => {
      uiState.diceTray.die = asInt(e.target.value, uiState.diceTray.die || 20);
      render();
    });
    root.querySelector("#diceRollBtn")?.addEventListener("click", () => {
      uiState.diceTray.die = asInt(root.querySelector("#diceType")?.value, uiState.diceTray.die || 20);
      uiState.diceTray.count = clamp(asInt(root.querySelector("#diceCount")?.value, uiState.diceTray.count || 1), 1, 20);
      uiState.diceTray.mod = clamp(asInt(root.querySelector("#diceMod")?.value, uiState.diceTray.mod || 0), -99, 99);
      performDiceRoll();
      render();
    });
    root.querySelector("#portraitCancel")?.addEventListener("click", () => closePortraitCrop());
    root.querySelector("#portraitSave")?.addEventListener("click", () => savePortraitFromCrop());
    root.querySelector("#portraitZoom")?.addEventListener("input", (e) => { uiState.portraitCrop.zoom = Number(e.target.value); drawPortraitPreview(); });
    root.querySelector("#portraitX")?.addEventListener("input", (e) => { uiState.portraitCrop.x = Number(e.target.value); drawPortraitPreview(); });
    root.querySelector("#portraitY")?.addEventListener("input", (e) => { uiState.portraitCrop.y = Number(e.target.value); drawPortraitPreview(); });
    root.querySelectorAll("[data-cast-at]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const lvl = asInt(e.currentTarget.getAttribute("data-cast-at"), 0);
        const spellName = uiState.castMenu.spellName || "Spell";
        const spellRef = uiState.castMenu.spellRef || null;
        closeCastMenu();
        performCastAtLevel(lvl, spellName, spellRef);
      });
    });

    root.querySelector("#paletteQuery")?.addEventListener("input", (e) => {
      uiState.palette.query = e.target.value;
      uiState.palette.selected = 0;
      render();
    });

    root.querySelectorAll("[data-command-id]").forEach((el) => {
      el.addEventListener("click", (e) => runCommand(e.currentTarget.getAttribute("data-command-id")));
    });

    root.querySelector("#lookupOverlay")?.addEventListener("click", (e) => {
      if (e.target?.id === "lookupOverlay") closeLookup({ restore: true });
    });
    root.querySelector("#lookupCancel")?.addEventListener("click", () => closeLookup({ restore: true }));
    root.querySelector("#lookupSave")?.addEventListener("click", () => {
      const ok = applyLookupSelection(uiState.lookup.selected);
      if (ok) closeLookup({ restore: true });
      else render();
    });
    root.querySelector("#lookupQuery")?.addEventListener("input", (e) => {
      uiState.lookup.query = e.target.value;
      uiState.lookup.cursor = e.target.selectionStart ?? uiState.lookup.query.length;
      refreshLookup();
      render();
    });
    root.querySelector("#lookupSpellLevel")?.addEventListener("change", (e) => {
      uiState.lookup.level = e.target.value;
      refreshLookup();
      render();
    });
    root.querySelector("#lookupDmSpellOverride")?.addEventListener("change", (e) => {
      uiState.lookup.allowOffClassSpells = Boolean(e.target.checked);
      refreshLookup();
      render();
    });
    root.querySelectorAll("[data-lookup-pick]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const idx = asInt(e.currentTarget.getAttribute("data-lookup-pick"), 0);
        uiState.lookup.selected = Math.max(0, Math.min(uiState.lookup.results.length - 1, idx));
        render();
      });
    });

    root.querySelectorAll("[data-open-lookup]").forEach((el) => {
      el.addEventListener("click", (e) => openLookup(e.currentTarget.getAttribute("data-open-lookup")));
    });
    root.querySelectorAll("[data-edit-tab]").forEach((el) => {
      el.addEventListener("click", (e) => {
        setActiveEditTab(e.currentTarget.getAttribute("data-edit-tab"));
        render();
      });
    });
    root.querySelectorAll("[data-jump-sec]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const sec = e.currentTarget.getAttribute("data-jump-sec");
        const target = sec ? root.querySelector(`#${sec}`) : null;
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    root.querySelectorAll("[data-toggle-sec]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const sec = e.currentTarget.getAttribute("data-toggle-sec");
        const tab = uiState.activeEditTab || "core";
        if (!uiState.collapsedSectionsByTab[tab]) uiState.collapsedSectionsByTab[tab] = {};
        uiState.collapsedSectionsByTab[tab][sec] = !uiState.collapsedSectionsByTab[tab][sec];
        render();
      });
    });
    root.querySelector("[data-collapse-all]")?.addEventListener("click", () => {
      const tab = uiState.activeEditTab || "core";
      uiState.collapsedSectionsByTab[tab] = Object.fromEntries(tabSections(tab).map((s) => [s, true]));
      render();
    });
    root.querySelector("[data-expand-all]")?.addEventListener("click", () => {
      const tab = uiState.activeEditTab || "core";
      uiState.collapsedSectionsByTab[tab] = Object.fromEntries(tabSections(tab).map((s) => [s, false]));
      render();
    });

    if (!character) return;

    if (uiState.mode === "play") {
      root.querySelector("#toggleHudCollapse")?.addEventListener("click", () => {
        setPlayBoard({ hudCollapsed: !uiState.playBoard?.hudCollapsed });
        render();
      });
      root.querySelector("#rollInitiativeBtn")?.addEventListener("click", () => performInitiativeRoll());
      root.querySelector("#openDiceTrayHud")?.addEventListener("click", () => openDiceTray());
      root.querySelectorAll("[data-open-checks-drawer]").forEach((el) => el.addEventListener("click", () => openChecksDrawer()));
      root.querySelectorAll("[data-toggle-utility]").forEach((el) => el.addEventListener("click", () => {
        setPlayBoard({ utilityRailOpen: !(uiState.playBoard?.utilityRailOpen !== false) });
        render();
      }));
      root.querySelectorAll("[data-toggle-band]").forEach((el) => el.addEventListener("click", () => {
        setPlayBoard({ bandCompact: !uiState.playBoard?.bandCompact });
        render();
      }));
      root.querySelectorAll("[data-play-pane]").forEach((el) => {
        el.addEventListener("click", (e) => {
          setActivePlayPane(e.currentTarget.getAttribute("data-play-pane"));
          render();
        });
      });
      root.querySelectorAll("[data-roll-save]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const id = e.currentTarget.getAttribute("data-roll-save") || "";
          const mod = asInt(deriveStats(getState().character || {}).savingThrows?.[id]?.total, 0);
          performModifierRoll("save", id, `${id.toUpperCase()} Save`, mod);
        });
      });
      root.querySelectorAll("[data-roll-skill]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const id = e.currentTarget.getAttribute("data-roll-skill") || "";
          const mod = asInt(deriveStats(getState().character || {}).skills?.[id]?.total, 0);
          performModifierRoll("skill", id, titleizeId(id), mod);
        });
      });
      root.querySelectorAll("[data-feature-use]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const id = e.currentTarget.getAttribute("data-feature-use") || "";
          adjustFeatureUse(id, -1);
        });
      });
      root.querySelectorAll("[data-feature-refund]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const id = e.currentTarget.getAttribute("data-feature-refund") || "";
          adjustFeatureUse(id, 1);
        });
      });
      root.querySelectorAll("[data-feature-tap]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const id = e.currentTarget.getAttribute("data-feature-tap") || "";
          markFeatureUsed(id);
        });
      });
      root.querySelector("#addConditionBtn")?.addEventListener("click", () => openConditionEditor(-1));
      root.querySelector("#concentrationPill")?.addEventListener("click", () => openConcentrationEditor());
      root.querySelector("#conditionsVisibleToggle")?.addEventListener("change", (e) => {
        setConditionControls({ showConditions: Boolean(e.target.checked) });
        render();
      });
      root.querySelector("#concentrationVisibleToggle")?.addEventListener("change", (e) => {
        const on = Boolean(e.target.checked);
        setConditionControls({ showConcentration: on });
        if (!on) {
          actions.updateCharacter((c) => {
            c.combat = c.combat || {};
            c.combat.concentration = { active: false, source: "", notes: "", rounds_remaining: null };
          });
          recordPlayAction("Concentration cleared");
        } else {
          openConcentrationEditor();
        }
      });
      root.querySelector("#advanceRoundBtn")?.addEventListener("click", () => advanceRound());
      root.querySelectorAll("[data-cond-edit]").forEach((el) => {
        el.addEventListener("click", (e) => openConditionEditor(asInt(e.currentTarget.getAttribute("data-cond-edit"), -1)));
      });
      root.querySelector("#undoLastCast")?.addEventListener("click", () => performUndoLastCast());
      root.querySelector("#shortRestSlots")?.addEventListener("click", () => performShortRest());
      root.querySelector("#longRestSlots")?.addEventListener("click", () => performLongRest());
      root.querySelectorAll("[data-play-hp]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const delta = asInt(e.currentTarget.getAttribute("data-play-hp"), 0);
          actions.updateCharacter((c) => {
            c.combat = c.combat || { hp: { max: 1, current: 1, temp: 0 } };
            c.combat.hp = c.combat.hp || { max: 1, current: 1, temp: 0 };
            c.combat.hp.current = Math.max(0, Math.min(c.combat.hp.max || 0, (c.combat.hp.current || 0) + delta));
          });
          recordPlayAction(delta > 0 ? `HP +${delta}` : `HP ${delta}`);
        });
      });
      root.querySelector("#playHpSet")?.addEventListener("click", () => {
        const val = Math.max(0, asInt(root.querySelector("#playHpCurrent")?.value, 0));
        actions.updateCharacter((c) => {
          c.combat = c.combat || { hp: { max: 1, current: 1, temp: 0 } };
          c.combat.hp = c.combat.hp || { max: 1, current: 1, temp: 0 };
          c.combat.hp.current = Math.min(c.combat.hp.max || 0, val);
        });
        recordPlayAction(`HP set to ${val}`);
      });
      root.querySelectorAll("[data-cast-spell]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const baseLevel = clamp(asInt(e.currentTarget.getAttribute("data-cast-base-level"), 0), 0, 9);
          const spellName = e.currentTarget.getAttribute("data-cast-name") || "Spell";
          const spellKey = e.currentTarget.getAttribute("data-cast-spell") || spellName;
          const characterNow = getState().character || {};
          const knownRows = Array.isArray(characterNow.spells_known) ? characterNow.spells_known : [];
          const preparedRows = Array.isArray(characterNow.spells_prepared) ? characterNow.spells_prepared : [];
          const sourceRows = [...knownRows, ...preparedRows];
          let spellRef = sourceRows.find((s) => norm(s?.id || s?.spell_id || s?.name) === norm(spellKey) || norm(s?.name) === norm(spellName)) || null;
          if (!spellRef) {
            spellRef = {
              id: spellKey,
              name: spellName,
              concentration: toBoolFlag(e.currentTarget.getAttribute("data-cast-concentration")),
              duration: e.currentTarget.getAttribute("data-cast-duration") || ""
            };
          }
          if (baseLevel === 0) {
            performCastAtLevel(0, spellName, spellRef);
            return;
          }
          openCastMenu(spellName, spellKey, baseLevel);
          uiState.castMenu.spellRef = spellRef;
        });
      });
      root.querySelectorAll("[data-play-tracker]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const [idxStr, op] = (e.currentTarget.getAttribute("data-play-tracker") || "").split(":");
          const idx = asInt(idxStr, -1);
          actions.updateCharacter((c) => {
            c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
            if (!c.trackers[idx]) return;
            if (op === "up") c.trackers[idx].current = Math.min(c.trackers[idx].max || 0, (c.trackers[idx].current || 0) + 1);
            if (op === "down") c.trackers[idx].current = Math.max(0, (c.trackers[idx].current || 0) - 1);
            if (op === "reset") c.trackers[idx].current = c.trackers[idx].max || 0;
          });
          recordPlayAction(`Tracker ${op}`);
        });
      });
      root.querySelector("#playTrackerAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
        c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
        c.trackers.push({ id: crypto.randomUUID(), label: "", type: "counter", reset: "none", max: 0, current: 0 });
      }));
    root.querySelector("#playLogAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
      const stats = computeLogNotesChars(c);
      if (stats.remaining <= 0) return;
      c.log = Array.isArray(c.log) ? c.log : [];
      c.log.push({ id: crypto.randomUUID(), utc: new Date().toISOString(), tag: "note", message: "" });
    }));
    const saveSessionNotes = () => {
      const text = root.querySelector("#playSessionNotes")?.value || "";
      actions.updateCharacter((c) => {
        c.play_state = c.play_state || {};
        c.play_state.session_notes = clampToBudget(c, text, c.play_state.session_notes || "");
      });
      recordPlayAction("Updated session notes");
    };
    const pinSessionNotesToBottom = () => {
      const notesEl = root.querySelector("#playSessionNotes");
      if (!notesEl) return;
      notesEl.scrollTop = notesEl.scrollHeight;
    };
    root.querySelector("#playSessionNotesSave")?.addEventListener("click", () => saveSessionNotes());
    root.querySelector("#playSessionNotes")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        saveSessionNotes();
      }
      setTimeout(pinSessionNotesToBottom, 0);
    });
    root.querySelector("#playSessionNotes")?.addEventListener("input", (e) => {
      const state = getState();
      const c = state.character || {};
      const existing = c?.play_state?.session_notes || "";
      const clamped = clampToBudget(c, e.target.value, existing);
      if (clamped !== e.target.value) e.target.value = clamped;
      pinSessionNotesToBottom();
    });
    setTimeout(() => {
      pinSessionNotesToBottom();
      const notesEl = root.querySelector("#playSessionNotes");
      if (notesEl && document.activeElement === notesEl) {
        const end = notesEl.value.length;
        notesEl.setSelectionRange(end, end);
      }
    });
      root.querySelectorAll("[data-play-tracker-label]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-play-tracker-label"), -1);
        actions.updateCharacter((c) => { if (c.trackers?.[i]) c.trackers[i].label = e.target.value; });
      }));
      root.querySelectorAll("[data-play-tracker-current]").forEach((el) => el.addEventListener("input", (e) => {
        const i = asInt(e.target.getAttribute("data-play-tracker-current"), -1);
        actions.updateCharacter((c) => { if (c.trackers?.[i]) c.trackers[i].current = Math.max(0, Math.min(c.trackers[i].max || 0, asInt(e.target.value, 0))); });
      }));
      root.querySelectorAll("[data-play-tracker-max]").forEach((el) => el.addEventListener("input", (e) => {
        const i = asInt(e.target.getAttribute("data-play-tracker-max"), -1);
        actions.updateCharacter((c) => { if (c.trackers?.[i]) c.trackers[i].max = Math.max(0, asInt(e.target.value, 0)); });
      }));
      root.querySelectorAll("[data-play-tracker-del]").forEach((el) => el.addEventListener("click", (e) => {
        const i = asInt(e.currentTarget.getAttribute("data-play-tracker-del"), -1);
        actions.updateCharacter((c) => { if (Array.isArray(c.trackers)) c.trackers.splice(i, 1); });
      }));
      root.querySelectorAll("[data-play-log-tag]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-play-log-tag"), -1);
        actions.updateCharacter((c) => {
          if (c.log?.[i]) c.log[i].tag = clampToBudget(c, e.target.value, c.log[i].tag || "");
        });
      }));
      root.querySelectorAll("[data-play-log-message]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-play-log-message"), -1);
        actions.updateCharacter((c) => {
          if (c.log?.[i]) c.log[i].message = clampToBudget(c, e.target.value, c.log[i].message || "");
        });
      }));
      root.querySelectorAll("[data-play-log-del]").forEach((el) => el.addEventListener("click", (e) => {
        const i = asInt(e.currentTarget.getAttribute("data-play-log-del"), -1);
        actions.updateCharacter((c) => { if (Array.isArray(c.log)) c.log.splice(i, 1); });
      }));
      return;
    }

    root.querySelector("#charName")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.meta.name = e.target.value; }));
    root.querySelector("#charRuleset")?.addEventListener("change", (e) => {
      actions.updateCharacter((c) => {
        c.meta.ruleset_id = e.target.value.trim() || "dnd5e_2014";
        c.core = c.core || { classes: [] };
        c.core.rulesetId = c.meta.ruleset_id;
      });
      actions.ensureCatalog(e.target.value.trim() || "dnd5e_2014");
    });
    root.querySelector("#charSpecies")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.core.speciesId = e.target.value; }));

    root.querySelectorAll("[data-ability]").forEach((el) => {
      el.addEventListener("change", (e) => {
        const key = e.target.getAttribute("data-ability");
        actions.updateCharacter((c) => {
          c.abilities[key] = Math.max(1, Math.min(30, asInt(e.target.value, 10)));
        });
      });
    });

    root.querySelector("#classAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
      c.core.classes = Array.isArray(c.core.classes) ? c.core.classes : [];
      c.core.classes.push({ id: "", level: 1, isPrimary: c.core.classes.length === 0, subclassId: "" });
    }));
    root.querySelectorAll("[data-class-id]").forEach((el) => el.addEventListener("change", (e) => {
      const idx = asInt(e.target.getAttribute("data-class-id"), -1);
      actions.updateCharacter((c) => { if (c.core.classes[idx]) c.core.classes[idx].id = e.target.value; });
    }));
    root.querySelectorAll("[data-class-level]").forEach((el) => el.addEventListener("change", (e) => {
      const idx = asInt(e.target.getAttribute("data-class-level"), -1);
      actions.updateCharacter((c) => { if (c.core.classes[idx]) c.core.classes[idx].level = Math.max(1, Math.min(20, asInt(e.target.value, 1))); });
    }));
    root.querySelectorAll("[data-class-subclass]").forEach((el) => el.addEventListener("change", (e) => {
      const idx = asInt(e.target.getAttribute("data-class-subclass"), -1);
      actions.updateCharacter((c) => { if (c.core.classes[idx]) c.core.classes[idx].subclassId = e.target.value.trim().toLowerCase(); });
    }));
    root.querySelectorAll("[data-class-del]").forEach((el) => el.addEventListener("click", (e) => {
      const idx = asInt(e.currentTarget.getAttribute("data-class-del"), -1);
      actions.updateCharacter((c) => { c.core.classes.splice(idx, 1); if (c.core.classes[0]) c.core.classes[0].isPrimary = true; });
    }));

    root.querySelector("#combatAc")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.ac = Math.max(0, asInt(e.target.value, 10)); }));
    root.querySelector("#combatInit")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.initiative_bonus = asInt(e.target.value, 0); }));
    root.querySelector("#hpMax")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.hp.max = Math.max(0, asInt(e.target.value, 1)); if (c.combat.hp.current > c.combat.hp.max) c.combat.hp.current = c.combat.hp.max; }));
    root.querySelector("#hpCurrent")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.hp.current = Math.max(0, asInt(e.target.value, 1)); if (c.combat.hp.current > c.combat.hp.max) c.combat.hp.current = c.combat.hp.max; }));
    root.querySelector("#hpTemp")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.hp.temp = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#combatSpeed")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.speed = Math.max(0, asInt(e.target.value, 30)); }));
    root.querySelector("#combatInspiration")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.inspiration = Math.max(0, Math.min(1, asInt(e.target.value, 0))); }));
    root.querySelector("#combatProfBonus")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.proficiency_bonus = asInt(e.target.value, 2); }));
    root.querySelector("#combatPassivePerception")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.passive_perception = Math.max(0, asInt(e.target.value, 10)); }));
    root.querySelector("#combatHitDiceTotal")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.hit_dice_total = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#combatHitDiceUsed")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.hit_dice_used = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#combatDeathSaveSuccess")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.death_saves = c.combat.death_saves || { success: 0, fail: 0 }; c.combat.death_saves.success = Math.max(0, Math.min(3, asInt(e.target.value, 0))); }));
    root.querySelector("#combatDeathSaveFail")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.combat.death_saves = c.combat.death_saves || { success: 0, fail: 0 }; c.combat.death_saves.fail = Math.max(0, Math.min(3, asInt(e.target.value, 0))); }));
    root.querySelector("#spellcastingClassId")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.spellcasting = c.spellcasting || {}; c.spellcasting.class_id = e.target.value; }));
    root.querySelector("#spellcastingAbility")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.spellcasting = c.spellcasting || {}; c.spellcasting.ability = e.target.value; }));
    root.querySelector("#spellcastingSaveDcMode")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.spellcasting = c.spellcasting || {}; c.spellcasting.save_dc_mode = e.target.value === "manual" ? "manual" : "auto"; }));
    root.querySelector("#spellcastingSaveDcOverride")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.spellcasting = c.spellcasting || {}; c.spellcasting.save_dc_override = asInt(e.target.value, 0); }));
    root.querySelector("#spellcastingAtkMode")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.spellcasting = c.spellcasting || {}; c.spellcasting.attack_bonus_mode = e.target.value === "manual" ? "manual" : "auto"; }));
    root.querySelector("#spellcastingAtkOverride")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.spellcasting = c.spellcasting || {}; c.spellcasting.attack_bonus_override = asInt(e.target.value, 0); }));

    root.querySelector("#profileBackground")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.background = e.target.value; }));
    root.querySelector("#profileAlignment")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.alignment = e.target.value; }));
    root.querySelector("#profilePlayerName")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.player_name = e.target.value; }));
    root.querySelector("#profileXp")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.experience_points = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#profileAge")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.age = e.target.value; }));
    root.querySelector("#profileHeight")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.height = e.target.value; }));
    root.querySelector("#profileWeight")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.weight = e.target.value; }));
    root.querySelector("#profileEyes")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.eyes = e.target.value; }));
    root.querySelector("#profileSkin")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.skin = e.target.value; }));
    root.querySelector("#profileHair")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.hair = e.target.value; }));
    root.querySelector("#profileTraits")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.personality_traits = e.target.value; }));
    root.querySelector("#profileIdeals")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.ideals = e.target.value; }));
    root.querySelector("#profileBonds")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.bonds = e.target.value; }));
    root.querySelector("#profileFlaws")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.flaws = e.target.value; }));
    root.querySelector("#profileProficiencies")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.other_proficiencies_languages = e.target.value; }));
    root.querySelector("#profileFeatures")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.features_traits = e.target.value; }));
    root.querySelector("#profileBackstory")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.backstory = e.target.value; }));
    root.querySelector("#profileAllies")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.allies_organizations = e.target.value; }));
    root.querySelector("#profileAdditionalFeatures")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.additional_features = e.target.value; }));
    root.querySelector("#profileTreasure")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.profile = c.profile || {}; c.profile.treasure = e.target.value; }));
    root.querySelector("#portraitUpload")?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result?.toString() || "";
        const img = new Image();
        img.onload = () => openPortraitCrop(src, img.width, img.height);
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
    root.querySelector("#portraitRemove")?.addEventListener("click", () => actions.updateCharacter((c) => {
      c.ui = c.ui || {};
      delete c.ui.portrait;
    }));
    root.querySelector("#resCp")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.resources = c.resources || {}; c.resources.cp = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#resSp")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.resources = c.resources || {}; c.resources.sp = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#resEp")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.resources = c.resources || {}; c.resources.ep = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#resGp")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.resources = c.resources || {}; c.resources.gp = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelector("#resPp")?.addEventListener("change", (e) => actions.updateCharacter((c) => { c.resources = c.resources || {}; c.resources.pp = Math.max(0, asInt(e.target.value, 0)); }));
    root.querySelectorAll("[data-save-prof]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-save-prof");
      actions.updateCharacter((c) => {
        c.saving_throws = c.saving_throws || {};
        c.saving_throws[key] = c.saving_throws[key] || { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
        c.saving_throws[key].proficient = Boolean(e.target.checked);
      });
    }));
    root.querySelectorAll("[data-save-bonus]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-save-bonus");
      actions.updateCharacter((c) => {
        c.saving_throws = c.saving_throws || {};
        c.saving_throws[key] = c.saving_throws[key] || { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
        c.saving_throws[key].bonus = asInt(e.target.value, 0);
      });
    }));
    root.querySelectorAll("[data-save-mode]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-save-mode");
      actions.updateCharacter((c) => {
        c.saving_throws = c.saving_throws || {};
        c.saving_throws[key] = c.saving_throws[key] || { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
        c.saving_throws[key].bonus_mode = e.target.checked ? "manual" : "auto";
      });
    }));
    root.querySelectorAll("[data-save-manual]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-save-manual");
      actions.updateCharacter((c) => {
        c.saving_throws = c.saving_throws || {};
        c.saving_throws[key] = c.saving_throws[key] || { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
        c.saving_throws[key].manual_total = asInt(e.target.value, 0);
      });
    }));
    root.querySelectorAll("[data-skill-prof]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-skill-prof");
      actions.updateCharacter((c) => {
        c.skills = c.skills || {};
        c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
        c.skills[key].proficient = Boolean(e.target.checked);
      });
    }));
    root.querySelectorAll("[data-skill-exp]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-skill-exp");
      actions.updateCharacter((c) => {
        c.skills = c.skills || {};
        c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
        c.skills[key].expertise = Boolean(e.target.checked);
      });
    }));
    root.querySelectorAll("[data-skill-bonus]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-skill-bonus");
      actions.updateCharacter((c) => {
        c.skills = c.skills || {};
        c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
        c.skills[key].bonus = asInt(e.target.value, 0);
      });
    }));
    root.querySelectorAll("[data-skill-mode]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-skill-mode");
      actions.updateCharacter((c) => {
        c.skills = c.skills || {};
        c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
        c.skills[key].bonus_mode = e.target.checked ? "manual" : "auto";
      });
    }));
    root.querySelectorAll("[data-skill-manual]").forEach((el) => el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-skill-manual");
      actions.updateCharacter((c) => {
        c.skills = c.skills || {};
        c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
        c.skills[key].manual_total = asInt(e.target.value, 0);
      });
    }));
    root.querySelector("#attackAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
      c.attacks = Array.isArray(c.attacks) ? c.attacks : [];
      c.attacks.push({ id: crypto.randomUUID(), name: "", atk_bonus: 0, damage: "", damage_type: "", range: "", notes: "" });
    }));
    root.querySelectorAll("[data-attack-name]").forEach((el) => el.addEventListener("change", (e) => {
      const i = asInt(e.target.getAttribute("data-attack-name"), -1);
      actions.updateCharacter((c) => { if (c.attacks?.[i]) c.attacks[i].name = e.target.value; });
    }));
    root.querySelectorAll("[data-attack-bonus]").forEach((el) => el.addEventListener("change", (e) => {
      const i = asInt(e.target.getAttribute("data-attack-bonus"), -1);
      actions.updateCharacter((c) => { if (c.attacks?.[i]) c.attacks[i].atk_bonus = asInt(e.target.value, 0); });
    }));
    root.querySelectorAll("[data-attack-damage]").forEach((el) => el.addEventListener("change", (e) => {
      const i = asInt(e.target.getAttribute("data-attack-damage"), -1);
      actions.updateCharacter((c) => { if (c.attacks?.[i]) c.attacks[i].damage = e.target.value; });
    }));
    root.querySelectorAll("[data-attack-damagetype]").forEach((el) => el.addEventListener("change", (e) => {
      const i = asInt(e.target.getAttribute("data-attack-damagetype"), -1);
      actions.updateCharacter((c) => { if (c.attacks?.[i]) c.attacks[i].damage_type = e.target.value; });
    }));
    root.querySelectorAll("[data-attack-range]").forEach((el) => el.addEventListener("change", (e) => {
      const i = asInt(e.target.getAttribute("data-attack-range"), -1);
      actions.updateCharacter((c) => { if (c.attacks?.[i]) c.attacks[i].range = e.target.value; });
    }));
    root.querySelectorAll("[data-attack-notes]").forEach((el) => el.addEventListener("change", (e) => {
      const i = asInt(e.target.getAttribute("data-attack-notes"), -1);
      actions.updateCharacter((c) => { if (c.attacks?.[i]) c.attacks[i].notes = e.target.value; });
    }));
    root.querySelectorAll("[data-attack-del]").forEach((el) => el.addEventListener("click", (e) => {
      const i = asInt(e.currentTarget.getAttribute("data-attack-del"), -1);
      actions.updateCharacter((c) => { if (Array.isArray(c.attacks)) c.attacks.splice(i, 1); });
    }));

    root.querySelector("#spellAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
      c.spells_known = Array.isArray(c.spells_known) ? c.spells_known : [];
      c.spells_known.push({ id: crypto.randomUUID(), name: "", level: 0, school: "", source: "", ritual: false, concentration: false, casting_time: "", range: "", components: "", duration: "", spell_id: "", page: "", notes: "" });
    }));
    root.querySelectorAll("[data-spell-name]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-spell-name"), -1); actions.updateCharacter((c) => { if (c.spells_known[i]) c.spells_known[i].name = e.target.value; }); }));
    root.querySelectorAll("[data-spell-level]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-spell-level"), -1); actions.updateCharacter((c) => { if (c.spells_known[i]) c.spells_known[i].level = Math.max(0, Math.min(9, asInt(e.target.value, 0))); }); }));
    root.querySelectorAll("[data-spell-school]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-spell-school"), -1); actions.updateCharacter((c) => { if (c.spells_known[i]) c.spells_known[i].school = e.target.value; }); }));
    root.querySelectorAll("[data-spell-prep]").forEach((el) => el.addEventListener("change", (e) => {
      const i = asInt(e.target.getAttribute("data-spell-prep"), -1);
      actions.updateCharacter((c) => {
        c.spells_prepared = Array.isArray(c.spells_prepared) ? c.spells_prepared : [];
        const spell = c.spells_known[i];
        if (!spell) return;
        const at = c.spells_prepared.findIndex((x) => x.id === spell.id);
        if (e.target.checked && at < 0) c.spells_prepared.push(structuredClone(spell));
        if (!e.target.checked && at >= 0) c.spells_prepared.splice(at, 1);
      });
    }));
    root.querySelectorAll("[data-spell-del]").forEach((el) => el.addEventListener("click", (e) => {
      const i = asInt(e.currentTarget.getAttribute("data-spell-del"), -1);
      actions.updateCharacter((c) => {
        const removed = c.spells_known[i]?.id;
        c.spells_known.splice(i, 1);
        c.spells_prepared = (c.spells_prepared || []).filter((x) => x.id !== removed);
      });
    }));

    root.querySelector("#invAdd")?.addEventListener("click", () => actions.updateCharacter((c) => { c.inventory = Array.isArray(c.inventory) ? c.inventory : []; c.inventory.push({ id: crypto.randomUUID(), name: "", qty: 1, notes: "" }); }));
    root.querySelectorAll("[data-inv-name]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-inv-name"), -1); actions.updateCharacter((c) => { if (c.inventory[i]) c.inventory[i].name = e.target.value; }); }));
    root.querySelectorAll("[data-inv-qty]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-inv-qty"), -1); actions.updateCharacter((c) => { if (c.inventory[i]) c.inventory[i].qty = Math.max(0, asInt(e.target.value, 1)); }); }));
    root.querySelectorAll("[data-inv-notes]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-inv-notes"), -1); actions.updateCharacter((c) => { if (c.inventory[i]) c.inventory[i].notes = e.target.value; }); }));
    root.querySelectorAll("[data-inv-del]").forEach((el) => el.addEventListener("click", (e) => { const i = asInt(e.currentTarget.getAttribute("data-inv-del"), -1); actions.updateCharacter((c) => { c.inventory.splice(i, 1); }); }));

    root.querySelector("#trackerAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
      c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
      c.trackers.push({ id: crypto.randomUUID(), label: "", type: "counter", reset: "none", max: 0, current: 0 });
    }));
    root.querySelectorAll("[data-tracker-label]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-tracker-label"), -1); actions.updateCharacter((c) => { if (c.trackers[i]) c.trackers[i].label = e.target.value; }); }));
    root.querySelectorAll("[data-tracker-reset]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-tracker-reset"), -1); actions.updateCharacter((c) => { if (c.trackers[i]) c.trackers[i].reset = e.target.value; }); }));
    root.querySelectorAll("[data-tracker-max]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-tracker-max"), -1); actions.updateCharacter((c) => { if (c.trackers[i]) { c.trackers[i].max = Math.max(0, asInt(e.target.value, 0)); if (c.trackers[i].current > c.trackers[i].max) c.trackers[i].current = c.trackers[i].max; } }); }));
    root.querySelectorAll("[data-tracker-current]").forEach((el) => el.addEventListener("change", (e) => { const i = asInt(e.target.getAttribute("data-tracker-current"), -1); actions.updateCharacter((c) => { if (c.trackers[i]) c.trackers[i].current = Math.max(0, Math.min(c.trackers[i].max || 0, asInt(e.target.value, 0))); }); }));
    root.querySelectorAll("[data-tracker-del]").forEach((el) => el.addEventListener("click", (e) => { const i = asInt(e.currentTarget.getAttribute("data-tracker-del"), -1); actions.updateCharacter((c) => { c.trackers.splice(i, 1); }); }));

    root.querySelector("#logAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
      const stats = computeLogNotesChars(c);
      if (stats.remaining <= 0) return;
      c.log = Array.isArray(c.log) ? c.log : [];
      c.log.push({ id: crypto.randomUUID(), utc: new Date().toISOString(), tag: "note", message: "" });
    }));
  }

  function handleGlobalHotkeys(e) {
    const cmd = e.metaKey || e.ctrlKey;
    const hasAnyMod = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey;
    const targetTyping = isTypingTarget(e.target);

    if (cmd && e.key.toLowerCase() === "k") {
      e.preventDefault();
      uiState.palette.open = true;
      uiState.palette.query = "";
      uiState.palette.selected = 0;
      render();
      return;
    }

    if (cmd && !e.shiftKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      actions.saveNow();
      return;
    }

    if (uiState.appearanceOpen && e.key === "Escape") {
      e.preventDefault();
      closeAppearanceCustomizer({ revert: true });
      return;
    }

    if (uiState.toolsMenuOpen && e.key === "Escape") {
      e.preventDefault();
      uiState.toolsMenuOpen = false;
      render();
      return;
    }
    if (uiState.exportMenuOpen && e.key === "Escape") {
      e.preventDefault();
      uiState.exportMenuOpen = false;
      render();
      return;
    }

    if (uiState.diagnosticsOpen && e.key === "Escape") {
      e.preventDefault();
      uiState.diagnosticsOpen = false;
      render();
      return;
    }

    if (uiState.checksDrawerOpen && e.key === "Escape") {
      e.preventDefault();
      closeChecksDrawer();
      return;
    }

    if (uiState.palette.open) {
      const list = visibleCommands();
      if (e.key === "Escape") {
        uiState.palette.open = false;
        render();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        uiState.palette.selected = Math.min(list.length - 1, uiState.palette.selected + 1);
        render();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        uiState.palette.selected = Math.max(0, uiState.palette.selected - 1);
        render();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const cmdRow = list[uiState.palette.selected];
        if (cmdRow) runCommand(cmdRow.id);
        return;
      }
    }

    if (uiState.lookup.open) {
      if (e.key === "Escape") {
        closeLookup({ restore: true });
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        uiState.lookup.selected = Math.min(uiState.lookup.results.length - 1, uiState.lookup.selected + 1);
        render();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        uiState.lookup.selected = Math.max(0, uiState.lookup.selected - 1);
        render();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const ok = applyLookupSelection(uiState.lookup.selected);
        if (ok) closeLookup({ restore: true });
        else render();
        return;
      }
    }

    if (uiState.diceTray.open) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDiceTray();
        return;
      }
      if (e.key === "Enter" && !targetTyping) {
        e.preventDefault();
        performDiceRoll();
        render();
        return;
      }
    }

    if (targetTyping) return;

    if (uiState.mode === "play" && e.altKey && /[1-5]/.test(e.key)) {
      e.preventDefault();
      const idx = asInt(e.key, 1) - 1;
      const pane = PLAY_PANES[idx]?.id;
      if (pane) {
        setActivePlayPane(pane);
        render();
      }
      return;
    }

    if (uiState.mode === "play" && !hasAnyMod) {
      if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        setActivePlayPane("spells");
        render();
        return;
      }
      if (e.key.toLowerCase() === "a") {
        e.preventDefault();
        setActivePlayPane("attacks");
        render();
        return;
      }
      if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        setActivePlayPane("bonus");
        render();
        return;
      }
      if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        openChecksDrawer();
        return;
      }
      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        setActivePlayPane("trackers");
        render();
        return;
      }
      if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        openDiceTray();
        return;
      }
    }

    if (uiState.mode === "edit" && e.altKey && /[1-5]/.test(e.key)) {
      e.preventDefault();
      const idx = asInt(e.key, 1) - 1;
      const tab = EDIT_TABS[idx]?.id;
      if (tab) {
        setActiveEditTab(tab);
        render();
      }
      return;
    }

    if (cmd && /[1-6]/.test(e.key)) {
      e.preventDefault();
      jumpToSection(asInt(e.key, 1) - 1);
      return;
    }

    if (!hasAnyMod && e.key === "[") {
      e.preventDefault();
      cycleSections(-1);
      return;
    }
    if (!hasAnyMod && e.key === "]") {
      e.preventDefault();
      cycleSections(1);
    }
  }

  window.addEventListener("keydown", handleGlobalHotkeys);
  if (!root.__lcxToolsDelegationBound) {
    root.addEventListener("click", (e) => {
      const target = e.target && e.target.nodeType === 1 ? e.target : e.target?.parentElement;
      if (!target) return;
      const importBtn = typeof target.closest === "function" ? target.closest("#importBtn") : null;
      if (importBtn) {
        e.preventDefault();
        e.stopPropagation();
        Promise.resolve(actions.importZip()).then(() => {
          if (getState().character) {
            uiState.showCreate = false;
            render();
          }
        });
        return;
      }
      const newCharBtn = typeof target.closest === "function" ? target.closest("#newCharBtn") : null;
      if (newCharBtn) {
        e.preventDefault();
        e.stopPropagation();
        uiState.showCreate = true;
        render();
        return;
      }
      const cancelCreateBtn = typeof target.closest === "function" ? target.closest("#cancelCreateBtn") : null;
      if (cancelCreateBtn) {
        e.preventDefault();
        e.stopPropagation();
        uiState.showCreate = false;
        render();
        return;
      }
      const createBtn = typeof target.closest === "function" ? target.closest("#createBtn") : null;
      if (createBtn) {
        e.preventDefault();
        e.stopPropagation();
        draft.name = root.querySelector("#newName")?.value || draft.name;
        draft.rulesetId = root.querySelector("#newRuleset")?.value || draft.rulesetId;
        draft.classId = root.querySelector("#newClass")?.value || "";
        draft.speciesId = root.querySelector("#newSpecies")?.value || "";
        for (const k of ["str", "dex", "con", "int", "wis", "cha"]) draft[k] = asInt(root.querySelector(`#new${k.toUpperCase()}`)?.value, 10);
        actions.newCharacter(draft);
        uiState.showCreate = false;
        return;
      }
      const btn = typeof target.closest === "function" ? target.closest("#toolsMenuBtn") : null;
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        uiState.toolsMenuOpen = !uiState.toolsMenuOpen;
        if (uiState.toolsMenuOpen) uiState.toolsMenuOpenedAt = Date.now();
        render();
        return;
      }
      const openPaletteBtn = typeof target.closest === "function" ? target.closest("#toolsOpenPalette") : null;
      if (openPaletteBtn) {
        e.preventDefault();
        e.stopPropagation();
        uiState.toolsMenuOpen = false;
        uiState.palette.open = true;
        uiState.palette.query = "";
        uiState.palette.selected = 0;
        render();
        return;
      }
      const openAppearanceBtn = typeof target.closest === "function" ? target.closest("#toolsOpenAppearance") : null;
      if (openAppearanceBtn) {
        e.preventDefault();
        e.stopPropagation();
        openAppearanceCustomizer();
        return;
      }
      const openDiagnosticsBtn = typeof target.closest === "function" ? target.closest("#toolsOpenDiagnostics") : null;
      if (openDiagnosticsBtn) {
        e.preventDefault();
        e.stopPropagation();
        uiState.toolsMenuOpen = false;
        uiState.diagnosticsOpen = true;
        render();
      }
    });
    root.__lcxToolsDelegationBound = true;
  }
  if (!root.__lcxChangeDelegationBound) {
    root.addEventListener("change", (e) => {
      const target = e.target && e.target.nodeType === 1 ? e.target : e.target?.parentElement;
      if (!target) return;
      if (target.id === "modeToggle") {
        setMode(target.checked ? "play" : "edit");
        render();
        return;
      }
      if (target.id === "policyModeToggle") {
        setPolicyMode(target.checked ? "core_only" : "all_official");
        render();
      }
    });
    root.__lcxChangeDelegationBound = true;
  }
  document.addEventListener("click", (e) => {
    if (!uiState.toolsMenuOpen && !uiState.exportMenuOpen) return;
    const openedAt = Math.max(asInt(uiState.toolsMenuOpenedAt, 0), asInt(uiState.exportMenuOpenedAt, 0));
    if (Date.now() - openedAt < 220) return;
    const path = typeof e.composedPath === "function" ? e.composedPath() : [];
    const targetEl = e.target && e.target.nodeType === 1 ? e.target : e.target?.parentElement;
    const insideToolsByClosest = typeof targetEl?.closest === "function" && targetEl.closest(".tools-menu-wrap");
    const insideToolsByPath = Array.isArray(path) && path.some((node) => node?.classList?.contains?.("tools-menu-wrap"));
    const insideTools = Boolean(insideToolsByClosest || insideToolsByPath);
    if (!insideTools) {
      uiState.toolsMenuOpen = false;
      uiState.exportMenuOpen = false;
      render();
    }
  });

  return {
    render,
    openPalette: () => {
      uiState.palette.open = true;
      uiState.palette.query = "";
      uiState.palette.selected = 0;
      render();
    },
    getActionRegistry: () => commandRegistry().map((cmd) => ({
      id: cmd.id,
      label: cmd.label,
      enabled: cmd.enabled(),
      keywords: cmd.keywords || []
    }))
  };
}
