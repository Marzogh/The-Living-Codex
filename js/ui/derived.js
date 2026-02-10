/**
 * Derived Stats UI (v1)
 *
 * Read-only helpers computed from current character state.
 * No storage. No rules engine. Defensive about schema.
 */

function escapeHtml(text) {
  return (text ?? "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function asNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function clampLevel(lvl) {
  if (lvl == null) return null;
  const raw = asNumber(lvl);
  if (raw == null) return null;
  const n = Math.trunc(raw);
  return Math.max(1, Math.min(20, n));
}

function modFromScore(score) {
  if (score == null) return null;
  return Math.floor((score - 10) / 2);
}

function formatSigned(n) {
  if (n == null) return "—";
  return n >= 0 ? `+${n}` : `${n}`;
}

function profBonusFromLevel(level) {
  if (level == null) return null;
  // 5e: +2 levels 1–4, +3 5–8, +4 9–12, +5 13–16, +6 17–20
  if (level <= 4) return 2;
  if (level <= 8) return 3;
  if (level <= 12) return 4;
  if (level <= 16) return 5;
  return 6;
}

function normaliseKey(x) {
  return (x ?? "").toString().trim().toLowerCase();
}

function hasSkillInList(list, skillName) {
  if (!Array.isArray(list)) return false;
  const target = normaliseKey(skillName);
  return list.some((s) => normaliseKey(s) === target);
}

function getSkillProficiencyMultiplier(character, skillName) {
  // Returns 0 (not proficient), 1 (proficient), or 2 (expertise)
  const sk = normaliseKey(skillName);

  // Common shapes:
  // character.skills = { perception: { proficient:true } }
  // character.skills = { Perception: { prof:true, expertise:true } }
  // character.proficiencies.skills = ["perception", ...]
  // character.expertise.skills = ["perception", ...]

  const skillsObj = character?.skills;
  if (skillsObj && typeof skillsObj === "object") {
    const entry = skillsObj[sk] ?? skillsObj[sk.toUpperCase()] ?? skillsObj[sk[0]?.toUpperCase() + sk.slice(1)];
    if (entry && typeof entry === "object") {
      const exp = Boolean(entry.expertise || entry.expert || entry.isExpertise);
      if (exp) return 2;
      const prof = Boolean(entry.proficient || entry.prof || entry.isProficient);
      if (prof) return 1;
    }
    // Sometimes skills are booleans
    const boolish = skillsObj[sk] ?? skillsObj[sk.toUpperCase()];
    if (boolish === true) return 1;
  }

  if (hasSkillInList(character?.expertise?.skills, sk)) return 2;
  if (hasSkillInList(character?.proficiencies?.skills, sk)) return 1;

  // Legacy/fallback arrays
  if (hasSkillInList(character?.skillProficiencies, sk)) return 1;
  if (hasSkillInList(character?.skillExpertise, sk)) return 2;

  return 0;
}

function getSkillBonus(character, skillName, abilityKey, profBonus) {
  const abilityMod = modFromScore(getAbilityScore(character, abilityKey));
  if (abilityMod == null) return null;

  const mult = getSkillProficiencyMultiplier(character, skillName);
  if (!profBonus) return abilityMod;
  if (mult === 0) return abilityMod;
  if (mult === 1) return abilityMod + profBonus;
  return abilityMod + (2 * profBonus);
}

function getAbilityScore(character, key /* 'str'|'dex'|... */) {
  const k = key.toLowerCase();

  // Common shapes we might encounter
  // 1) character.abilities = { str: 10, dex: 14, ... }
  // 2) character.ability_scores = { STR: 10, DEX: 14, ... }
  // 3) character.stats = { str: { score: 10 }, ... }
  // 4) character.core = { abilities: { str: 10 } }

  const direct = character?.abilities?.[k] ?? character?.abilities?.[k.toUpperCase()];
  const directNum = asNumber(direct);
  if (directNum != null) return directNum;

  const alt = character?.ability_scores?.[k] ?? character?.ability_scores?.[k.toUpperCase()] ?? character?.abilityScores?.[k] ?? character?.abilityScores?.[k.toUpperCase()];
  const altNum = asNumber(alt);
  if (altNum != null) return altNum;

  const statObj = character?.stats?.[k] ?? character?.stats?.[k.toUpperCase()];
  const statScore = asNumber(statObj?.score ?? statObj?.value ?? statObj);
  if (statScore != null) return statScore;

  const core = character?.core?.abilities?.[k] ?? character?.core?.abilities?.[k.toUpperCase()];
  const coreNum = asNumber(core);
  if (coreNum != null) return coreNum;

  return null;
}

function inferLevel(character) {
  // Preferred: multiclass-ready core.classes
  if (Array.isArray(character?.core?.classes)) {
    const sum = character.core.classes
      .map((c) => asNumber(c?.level) ?? 0)
      .reduce((a, b) => a + b, 0);
    if (sum > 0) return clampLevel(sum);
  }

  // Legacy: character.classes
  if (Array.isArray(character?.classes)) {
    const sum = character.classes
      .map((c) => asNumber(c?.level) ?? 0)
      .reduce((a, b) => a + b, 0);
    if (sum > 0) return clampLevel(sum);
  }

  // Single-level fallbacks
  const n1 = asNumber(character?.level);
  if (n1 != null) return clampLevel(n1);

  const n2 = asNumber(character?.core?.level);
  if (n2 != null) return clampLevel(n2);

  return null;
}

function getClassSummary(character) {
  const rows = [];
  const classes = character?.core?.classes;
  if (!Array.isArray(classes) || classes.length === 0) return rows;

  for (const cl of classes) {
    if (!cl || !cl.id) continue;
    rows.push({
      id: cl.id,
      level: asNumber(cl.level) ?? 1,
      isPrimary: Boolean(cl.isPrimary)
    });
  }
  return rows;
}

function getClassIdsForInference(character) {
  // Prefer multiclass-ready location
  const out = [];

  const coreClasses = Array.isArray(character?.core?.classes) ? character.core.classes : null;
  if (coreClasses) {
    // Primary first, then the rest
    const primary = coreClasses.find(c => c?.isPrimary && c?.id);
    if (primary?.id) out.push(primary.id);
    for (const cl of coreClasses) {
      if (!cl?.id) continue;
      if (primary?.id && cl.id === primary.id) continue;
      out.push(cl.id);
    }
  }

  // Fallbacks
  if (out.length === 0) {
    if (character?.core?.classId) out.push(character.core.classId);
    else if (character?.core?.class_id) out.push(character.core.class_id);
    else if (character?.classId) out.push(character.classId);
    else if (character?.class_id) out.push(character.class_id);
  }

  // Legacy array
  if (out.length === 0 && Array.isArray(character?.classes)) {
    const legacyPrimary = character.classes.find(c => c?.isPrimary && (c?.id || c?.class_id || c?.name));
    if (legacyPrimary) out.push(legacyPrimary.id || legacyPrimary.class_id || legacyPrimary.name);
    for (const cl of character.classes) {
      const id = cl?.id || cl?.class_id || cl?.name;
      if (!id) continue;
      if (legacyPrimary && id === (legacyPrimary.id || legacyPrimary.class_id || legacyPrimary.name)) continue;
      out.push(id);
    }
  }

  return out
    .map(x => (x ?? "").toString().trim().toLowerCase())
    .filter(Boolean);
}


function inferSpellcastingAbility(character) {
  // Explicit always wins
  const explicit = character?.spellcasting?.ability || character?.spellcasting_ability || character?.spellcastingAbility;
  if (explicit) return explicit.toString().trim().toLowerCase();

  // Infer from class(es)
  const classIds = getClassIdsForInference(character);
  if (classIds.length === 0) return null;

  const map = {
    // INT
    wizard: "int",
    artificer: "int",

    // WIS
    cleric: "wis",
    druid: "wis",
    ranger: "wis",

    // CHA
    bard: "cha",
    paladin: "cha",
    sorcerer: "cha",
    warlock: "cha"
  };

  // Primary class first. If not a caster, pick first caster class.
  for (const cid of classIds) {
    const ability = map[cid];
    if (ability) return ability;
  }

  return null;
}

function uniqSorted(arr) {
  const seen = new Set();
  const out = [];
  for (const x of (arr || [])) {
    const s = (x ?? "").toString().trim();
    if (!s) continue;
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out.sort((a, b) => a.localeCompare(b));
}

function titleish(s) {
  const t = (s ?? "").toString().trim();
  if (!t) return "";
  // Keep common abbreviations like STR/DEX as-is
  if (t.length <= 4 && t.toUpperCase() === t) return t;
  return t
    .split(/\s+/)
    .map(w => w ? (w[0].toUpperCase() + w.slice(1)) : "")
    .join(" ");
}

function collectFromMany(character, paths) {
  // paths: array of functions returning an array-ish value
  const all = [];
  for (const fn of paths) {
    try {
      const v = fn(character);
      if (Array.isArray(v)) all.push(...v);
      else if (typeof v === "string" && v.trim()) all.push(v);
    } catch {
      // ignore
    }
  }
  return uniqSorted(all);
}

function getProficienciesSummary(character) {
  // Skills
  const skills = collectFromMany(character, [
    c => c?.proficiencies?.skills,
    c => c?.core?.proficiencies?.skills,
    c => c?.skillProficiencies,
    c => c?.skills && typeof c.skills === "object" ? Object.keys(c.skills).filter(k => {
      const entry = c.skills[k];
      if (entry === true) return true;
      if (entry && typeof entry === "object") return Boolean(entry.proficient || entry.prof || entry.isProficient);
      return false;
    }) : []
  ]);

  // Expertise
  const expertiseSkills = collectFromMany(character, [
    c => c?.expertise?.skills,
    c => c?.core?.expertise?.skills,
    c => c?.skillExpertise,
    c => c?.skills && typeof c.skills === "object" ? Object.keys(c.skills).filter(k => {
      const entry = c.skills[k];
      if (entry && typeof entry === "object") return Boolean(entry.expertise || entry.expert || entry.isExpertise);
      return false;
    }) : []
  ]);

  // Saving throws
  const saves = collectFromMany(character, [
    c => c?.proficiencies?.saves,
    c => c?.core?.proficiencies?.saves,
    c => c?.saveProficiencies,
    c => c?.savingThrowProficiencies
  ]).map(x => {
    const k = normaliseKey(x);
    const map = { str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA" };
    return map[k] || x.toString().trim().toUpperCase();
  });

  // Tools / kits
  const tools = collectFromMany(character, [
    c => c?.proficiencies?.tools,
    c => c?.core?.proficiencies?.tools,
    c => c?.toolProficiencies,
    c => c?.tools
  ]).map(titleish);

  // Languages
  const languages = collectFromMany(character, [
    c => c?.languages,
    c => c?.proficiencies?.languages,
    c => c?.core?.proficiencies?.languages
  ]).map(titleish);

  // Armor / weapons
  const armor = collectFromMany(character, [
    c => c?.proficiencies?.armor,
    c => c?.core?.proficiencies?.armor,
    c => c?.armorProficiencies
  ]).map(titleish);

  const weapons = collectFromMany(character, [
    c => c?.proficiencies?.weapons,
    c => c?.core?.proficiencies?.weapons,
    c => c?.weaponProficiencies
  ]).map(titleish);

  return {
    skills: skills.map(titleish),
    expertiseSkills: expertiseSkills.map(titleish),
    saves,
    tools,
    languages,
    armor,
    weapons
  };
}

function renderListOrDash(items) {
  if (!items || items.length === 0) return "—";
  return items.map(escapeHtml).join(", ");
}

export function mountDerived({ root, getCharacter }) {
  if (!root) throw new Error("mountDerived: root is required");
  if (typeof getCharacter !== "function") throw new Error("mountDerived: getCharacter must be a function");

  function render() {
    const c = getCharacter();
    if (!c) {
      root.innerHTML = "";
      return;
    }

    const level = inferLevel(c);
    const prof = profBonusFromLevel(level);
    const classSummary = getClassSummary(c);

    const abilities = [
      { k: "str", label: "STR" },
      { k: "dex", label: "DEX" },
      { k: "con", label: "CON" },
      { k: "int", label: "INT" },
      { k: "wis", label: "WIS" },
      { k: "cha", label: "CHA" }
    ].map((a) => {
      const score = getAbilityScore(c, a.k);
      const mod = modFromScore(score);
      return { ...a, score, mod };
    });

    const dexMod = abilities.find(x => x.k === "dex")?.mod ?? null;
    const wisMod = abilities.find(x => x.k === "wis")?.mod ?? null;

    const initiative = dexMod;

    // Passive Perception is 10 + Perception skill bonus when we can infer proficiency/expertise.
    // If we can't, fall back to 10 + WIS mod.
    const perceptionBonus = getSkillBonus(c, "perception", "wis", prof);
    const passivePerception = perceptionBonus == null
      ? (wisMod == null ? null : (10 + wisMod))
      : (10 + perceptionBonus);

    const sca = inferSpellcastingAbility(c); // 'int'|'wis'|'cha' etc.
    const scaMod = sca ? modFromScore(getAbilityScore(c, sca)) : null;
    const spellAttack = (prof != null && scaMod != null) ? (prof + scaMod) : null;
    const spellSaveDc = (prof != null && scaMod != null) ? (8 + prof + scaMod) : null;

    const profs = getProficienciesSummary(c);
    const hasAnyProfs = Object.values(profs).some(arr => Array.isArray(arr) && arr.length > 0);

    root.innerHTML = `
      <section class="card">
        <h2>Derived Stats</h2>

        <div class="grid">
          <div class="field">
            <label>Total Level</label>
            <div>${level ?? "—"}</div>
            ${classSummary.length > 1 ? `
              <div class="hint">
                ${classSummary.map(cl => `${escapeHtml(cl.id)} ${cl.level}`).join(", ")}
              </div>
            ` : ""}
          </div>
          <div class="field">
            <label>Proficiency Bonus</label>
            <div>${formatSigned(prof)}</div>
          </div>
          <div class="field">
            <label>Initiative (DEX)</label>
            <div>${formatSigned(initiative)}</div>
          </div>
          <div class="field">
            <label>Passive Perception</label>
            <div>${passivePerception ?? "—"}</div>
            <div class="hint">10 + Perception bonus (uses WIS mod, plus proficiency/expertise if known)</div>
          </div>
        </div>

        <h3 style="margin-top: 10px;">Ability Mods</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Ability</th>
              <th>Score</th>
              <th>Mod</th>
            </tr>
          </thead>
          <tbody>
            ${abilities.map(a => `
              <tr>
                <td>${escapeHtml(a.label)}</td>
                <td>${a.score ?? "—"}</td>
                <td>${formatSigned(a.mod)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <details class="profs" ${hasAnyProfs ? "" : ""}>
          <summary>Proficiencies</summary>
          ${hasAnyProfs ? `
            <div class="grid" style="margin-top: 10px;">
              ${profs.saves.length ? `
                <div class="field">
                  <label>Saving Throws</label>
                  <div>${renderListOrDash(profs.saves)}</div>
                </div>
              ` : ""}
              ${profs.skills.length ? `
                <div class="field">
                  <label>Skills</label>
                  <div>${renderListOrDash(profs.skills)}</div>
                </div>
              ` : ""}
              ${profs.expertiseSkills.length ? `
                <div class="field">
                  <label>Expertise</label>
                  <div>${renderListOrDash(profs.expertiseSkills)}</div>
                </div>
              ` : ""}
              ${profs.tools.length ? `
                <div class="field">
                  <label>Tools</label>
                  <div>${renderListOrDash(profs.tools)}</div>
                </div>
              ` : ""}
              ${profs.languages.length ? `
                <div class="field">
                  <label>Languages</label>
                  <div>${renderListOrDash(profs.languages)}</div>
                </div>
              ` : ""}
              ${(profs.armor.length || profs.weapons.length) ? `
                <div class="field">
                  <label>Armor / Weapons</label>
                  <div>
                    ${profs.armor.length ? `<div class="hint"><strong>Armor:</strong> ${renderListOrDash(profs.armor)}</div>` : ""}
                    ${profs.weapons.length ? `<div class="hint"><strong>Weapons:</strong> ${renderListOrDash(profs.weapons)}</div>` : ""}
                  </div>
                </div>
              ` : ""}
            </div>
          ` : `
            <p class="hint" style="margin-top: 10px;">No proficiency data recorded yet. Once skills/saves/tools/languages are added to the character data, they will appear here.</p>
          `}
        </details>

        ${sca ? `
          <h3 style="margin-top: 10px;">Spellcasting</h3>
          <p class="hint">Using spellcasting ability: <strong>${escapeHtml(sca.toUpperCase())}</strong></p>
          <div class="grid">
            <div class="field">
              <label>Spell Attack Bonus</label>
              <div>${formatSigned(spellAttack)}</div>
            </div>
            <div class="field">
              <label>Spell Save DC</label>
              <div>${spellSaveDc ?? "—"}</div>
            </div>
          </div>
        ` : `
          <p class="hint">Spellcasting derived stats will appear once a spellcasting ability is set in the character data.</p>
        `}
      </section>
    `;
  }

  return { render };
}