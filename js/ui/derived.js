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
  const n = Math.max(1, Math.min(20, lvl));
  return n;
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

function inferSpellcastingAbility(character) {
  // Possible explicit fields
  const explicit = character?.spellcasting?.ability || character?.spellcasting_ability || character?.spellcastingAbility;
  if (explicit) return explicit.toString().trim().toLowerCase();

  // If user later adds class info, we can infer from class name.
  // For v1, keep conservative: no guess if not explicit.
  return null;
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
    const passivePerception = wisMod == null ? null : (10 + wisMod);

    const sca = inferSpellcastingAbility(c); // 'int'|'wis'|'cha' etc.
    const scaMod = sca ? modFromScore(getAbilityScore(c, sca)) : null;
    const spellAttack = (prof != null && scaMod != null) ? (prof + scaMod) : null;
    const spellSaveDc = (prof != null && scaMod != null) ? (8 + prof + scaMod) : null;

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
            <label>Passive Perception (10 + WIS)</label>
            <div>${passivePerception ?? "—"}</div>
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