(function () {
  const PAGE_W = 595.28; // A4 points
  const PAGE_H = 841.89;
  const M = 39.69; // 14mm in pt
  const CONTENT_W = PAGE_W - (2 * M);
  const FOOTER_RESERVED = M + 22;

  const THEME_DEFAULT = {
    ink: "#1b2432",
    muted: "#4a5568",
    line: "#c8d1df",
    accent: "#b73a57",
    panel: "#f6f8fc"
  };

  const ABILITY_ORDER = ["str", "dex", "con", "int", "wis", "cha"];
  const SKILL_ABILITY = {
    acrobatics: "dex",
    animal_handling: "wis",
    arcana: "int",
    athletics: "str",
    deception: "cha",
    history: "int",
    insight: "wis",
    intimidation: "cha",
    investigation: "int",
    medicine: "wis",
    nature: "int",
    perception: "wis",
    performance: "cha",
    persuasion: "cha",
    religion: "int",
    sleight_of_hand: "dex",
    stealth: "dex",
    survival: "wis"
  };

  const CAMPAIGN_NOTES_TEXT = "Generally rich population. Library of Ermack, fabled for knowledge, not open to public, takes up half the town and fountain. Body just appeared, might be magic. Bookkeeper's guild maintains order. Little child hears splash in fountain in town square and finds a man's corpse with a note pinned to the body: 'Next one at midnight'. Radall Tolstagg, local jeweller, found by Kara, daughter of local apothecary Katernin. We were at the bookkeeper's guild, 9 pm. Divination was blocked; priests could not work divination.\n\nNecklace is a teleport and sends a person to safety after a short chant.\n\nJeweller records: nothing strange in ledger, but a letter was found. Customers include Katenin and Flint Fyreforge with inconsistencies in jewel pricing.\n\nKara saw the body after the splash but missed clothing, necklace, and note details. Kara is apprentice at the library. Mr Tolstagg was not kind to her mother. Mother had a high-interest loan from him. Handwriting on the note matched Tolstagg. Handwriting in the letter matched Tolstagg and Katenin.\n\nOpen cathedral altar had nothing; temple of many gods. Second high priest missing, maybe drunk in nearest tavern by residential district.\n\nTavern is Tortly Drunk. Halfling and dwarf sharing drinks. Tortle barkeep. Broken furniture in back matched tavern stock.\n\nBehind the tavern was impossible geometry, turning 270 degrees away from the building.\n\nMothos, tiefling warlock and shop owner. Entangled warlock escaped; circumference lost memory of school days.\n\nEnded in alley with blood stain; divination block gone. Returned to temple to ask cleric.\n\nCleric divination showed hooded woman stabbing Randall. Knife under bed in bedroom, second room.\n\nThea brought in and conflicted about what to do with Katenin.\n\nTortle pickpocketed me. No GP.";

  function hexToRgb(hex) {
    const h = (hex || "").toString().trim().replace("#", "");
    if (!/^[0-9a-f]{6}$/i.test(h)) return [0, 0, 0];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function setDraw(doc, hex) { const [r, g, b] = hexToRgb(hex); doc.setDrawColor(r, g, b); }
  function setFill(doc, hex) { const [r, g, b] = hexToRgb(hex); doc.setFillColor(r, g, b); }
  function setText(doc, hex) { const [r, g, b] = hexToRgb(hex); doc.setTextColor(r, g, b); }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function asInt(v, fallback = 0) { const n = parseInt((v ?? "").toString(), 10); return Number.isFinite(n) ? n : fallback; }
  function fmtBonus(n) { return `${n >= 0 ? "+" : ""}${n}`; }
  function abilityMod(score) { return (asInt(score, 10) - 10) >= 0 ? Math.floor((asInt(score, 10) - 10) / 2) : Math.ceil((asInt(score, 10) - 10) / 2); }
  function titleizeId(v) {
    return (v || "").toString().trim().replaceAll("_", " ").replaceAll("-", " ").split(/\s+/).filter(Boolean).map((x) => x[0].toUpperCase() + x.slice(1)).join(" ");
  }
  function speciesLabel(v) { return titleizeId(v); }
  function rulesetLabel(v) { return v === "dnd5e_2014" ? "D&D 5e (2014)" : v === "dnd5e_2024" ? "D&D 5e (2024)" : (v || ""); }
  function normalize(v) { return (v || "").toString().trim().toLowerCase(); }
  function lookupLabel(rows, id) {
    const key = normalize(id);
    if (!key) return "";
    const row = (rows || []).find((x) => normalize(x?.id) === key);
    return row?.name || titleizeId(key);
  }

  function buildDerived(character) {
    const abilities = character?.abilities || {};
    const combat = character?.combat || {};
    const profBonus = asInt(combat?.proficiency_bonus, 0);
    const saves = character?.saving_throws || {};
    const skills = character?.skills || {};
    const spellcasting = character?.spellcasting || {};
    const abilityMods = {};
    for (const k of ABILITY_ORDER) abilityMods[k] = abilityMod(abilities[k] ?? 10);

    const saveRows = ABILITY_ORDER.map((ab) => {
      const node = saves?.[ab] || {};
      const manual = node?.bonus_mode === "manual";
      const total = manual
        ? asInt(node?.manual_total, 0)
        : abilityMods[ab] + (node?.proficient ? profBonus : 0) + asInt(node?.bonus, 0);
      return { name: ab.toUpperCase(), prof: node?.proficient ? "x" : "", mod: fmtBonus(abilityMods[ab]), total: fmtBonus(total) };
    });

    const skillRows = Object.keys(SKILL_ABILITY).sort().map((name) => {
      const node = skills?.[name] || {};
      const ab = SKILL_ABILITY[name];
      const manual = node?.bonus_mode === "manual";
      const profPart = profBonus * (node?.expertise ? 2 : (node?.proficient ? 1 : 0));
      const total = manual ? asInt(node?.manual_total, 0) : abilityMods[ab] + profPart + asInt(node?.bonus, 0);
      return { name: name.replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase()), p: node?.proficient ? "x" : "", e: node?.expertise ? "x" : "", mod: fmtBonus(abilityMods[ab]), total: fmtBonus(total) };
    });

    const castAbility = spellcasting?.ability;
    const castMod = abilityMods[castAbility] ?? Math.max(...Object.values(abilityMods));
    const saveDc = 8 + profBonus + castMod;
    const atkBonus = profBonus + castMod;

    return {
      abilityMods,
      saveRows,
      skillRows,
      passives: {
        passive_perception: asInt(combat?.passive_perception, 10),
        passive_investigation: 10 + asInt((skillRows.find((r) => r.name === "Investigation") || {}).total, 0),
        passive_insight: 10 + asInt((skillRows.find((r) => r.name === "Insight") || {}).total, 0),
        spell_save_dc: saveDc,
        spell_attack_bonus: fmtBonus(atkBonus)
      }
    };
  }

  function classesSummary(character, catalog) {
    const classes = character?.core?.classes || [];
    if (!classes.length) return "";
    return classes.map((cl) => {
      const className = lookupLabel(catalog?.classes || [], cl.id);
      const sub = cl?.subclassId || "";
      const subclassName = sub ? lookupLabel((catalog?.subclasses || []).filter((s) => normalize(s.class_id) === normalize(cl.id)), sub) : "";
      return sub ? `${className} - ${subclassName} - Level ${cl?.level ?? ""}` : `${className} - Level ${cl?.level ?? ""}`;
    }).join(", ");
  }

  function box(doc, theme, x, y, w, h, label, lines = 1) {
    setFill(doc, "#ffffff");
    setDraw(doc, theme.line);
    doc.roundedRect(x, y, w, h, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setText(doc, theme.muted);
    doc.text(label, x + 4, y + 10);
    if (lines > 0) {
      setDraw(doc, "#e6ebf3");
      for (let i = 0; i < lines; i += 1) {
        const ly = y + 20 + (i * 11);
        if (ly < y + h - 4) doc.line(x + 4, ly, x + w - 4, ly);
      }
    }
  }
  function boxValue(doc, theme, x, y, w, h, label, value, align = "left") {
    box(doc, theme, x, y, w, h, label, 0);
    setText(doc, theme.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    let text = value == null ? "" : String(value);
    if (text.length > 90) text = `${text.slice(0, 87)}...`;
    const ty = y + (h / 2) + 2;
    if (align === "center") doc.text(text, x + (w / 2), ty, { align: "center" });
    else if (align === "right") doc.text(text, x + w - 6, ty, { align: "right" });
    else doc.text(text, x + 6, ty);
  }
  function sectionTitle(doc, theme, x, y, text, width = 170) {
    setFill(doc, theme.panel);
    setDraw(doc, theme.line);
    doc.roundedRect(x, y, width, 20, 6, 6, "FD");
    setText(doc, theme.accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(text, x + 6, y + 14);
  }
  function drawHeader(doc, theme, title, subtitle, pageTag) {
    const top = PAGE_H - M;
    setText(doc, theme.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(title, M, top);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setText(doc, theme.muted);
    doc.text(subtitle, M, top + 14);
    setText(doc, theme.accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(pageTag, PAGE_W - M, top, { align: "right" });
    setDraw(doc, theme.line);
    doc.line(M, top + 22, PAGE_W - M, top + 22);
  }
  function drawFooter(doc, theme, leftText, centerText, rightText) {
    setDraw(doc, theme.line);
    doc.line(M, M - 2, PAGE_W - M, M - 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setText(doc, theme.muted);
    doc.text(leftText, M, M + 8);
    doc.text(centerText, PAGE_W / 2, M + 8, { align: "center" });
    doc.text(rightText, PAGE_W - M, M + 8, { align: "right" });
  }

  function drawListTable(doc, theme, x, yTop, w, h, title, columns, rows, rowHeight = 12) {
    box(doc, theme, x, yTop, w, h, title, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setText(doc, theme.ink);
    const labels = columns.map((c) => c[0]);
    const widths = columns.map((c) => c[1]);
    const colX = [x + 5];
    let running = x + 5;
    for (const frac of widths.slice(0, -1)) { running += w * frac; colX.push(running); }
    labels.forEach((label, i) => doc.text(label, colX[i], yTop + 22));
    setDraw(doc, "#e6ebf3");
    doc.line(x + 4, yTop + 26, x + w - 4, yTop + 26);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    let y = yTop + 37;
    for (const row of rows) {
      if (y > (yTop + h - 8)) break;
      const vals = [row.name || "", row.prof || row.p || "", row.e || "", row.mod || "", row.total || ""];
      vals.slice(0, labels.length).forEach((v, i) => doc.text(String(v), colX[i], y));
      doc.line(x + 4, y + 3, x + w - 4, y + 3);
      y += rowHeight;
    }
  }

  function drawGridTable(doc, theme, x, yTop, w, h, title, columns, rows, rowHeight = 12) {
    if (title) box(doc, theme, x, yTop, w, h, title, 0);
    else {
      setFill(doc, "#ffffff");
      setDraw(doc, theme.line);
      doc.roundedRect(x, yTop, w, h, 4, 4, "FD");
    }
    const headerY = title ? yTop + 18 : yTop + 12;
    const dividerY = title ? yTop + 22 : yTop + 16;
    let y = title ? yTop + 32 : yTop + 26;
    const xPos = [x + 4];
    let run = x + 4;
    for (const [, , frac] of columns.slice(0, -1)) { run += (w - 8) * frac; xPos.push(run); }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setText(doc, theme.ink);
    columns.forEach(([label], i) => doc.text(label, xPos[i] + 1, headerY));
    setDraw(doc, "#d8dee8");
    doc.line(x + 4, dividerY, x + w - 4, dividerY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    for (const row of rows) {
      if (y > yTop + h - 8) break;
      columns.forEach(([, key], i) => {
        let txt = String(row[key] ?? "");
        if (txt.length > 42) txt = `${txt.slice(0, 39)}...`;
        doc.text(txt, xPos[i] + 1, y);
      });
      doc.line(x + 4, y + 2, x + w - 4, y + 2);
      y += rowHeight;
    }
  }

  function spellRows(spells) {
    return (spells || []).map((s) => ({
      name: `${s?.name || ""} (L${s?.level ?? ""})`,
      school: s?.school || "",
      ritual: s?.ritual ? "Y" : "N",
      conc: s?.concentration ? "Y" : "N",
      range: s?.range || "",
      duration: s?.duration || ""
    }));
  }

  function pageCore(doc, theme, title, stamp, character, catalog, derived, pageNo, totalPages) {
    drawHeader(doc, theme, title, "Core sheet", "CORE");
    let y = PAGE_H - M - 38;
    sectionTitle(doc, theme, M, y, "Identity", CONTENT_W); y += 26;
    const identity = character?.identity || {};
    const meta = character?.meta || {};
    const core = character?.core || {};
    const profile = character?.profile || {};
    const col = CONTENT_W / 4;
    boxValue(doc, theme, M, y, col - 4, 32, "Player", identity?.player_name || profile?.player_name || "");
    boxValue(doc, theme, M + col, y, col - 4, 32, "Campaign", identity?.campaign || "");
    boxValue(doc, theme, M + (2 * col), y, col - 4, 32, "Ruleset", rulesetLabel(meta?.ruleset_id || ""));
    boxValue(doc, theme, M + (3 * col), y, col - 4, 32, "Species", lookupLabel(catalog?.species || [], core?.speciesId || speciesLabel(core?.speciesId || "")));
    y += 42;
    boxValue(doc, theme, M, y, CONTENT_W, 34, "Class / Subclass / Level", classesSummary(character, catalog));

    y += 48;
    sectionTitle(doc, theme, M, y, "Abilities", CONTENT_W); y += 26;
    const tileW = (CONTENT_W - 20) / 6;
    const labels = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    const abilityMods = derived.abilityMods || {};
    const abilityScores = character?.abilities || {};
    labels.forEach((lab, i) => {
      const x = M + (i * (tileW + 4));
      box(doc, theme, x, y, tileW, 44, lab, 0);
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); setText(doc, theme.ink);
      doc.text(fmtBonus(abilityMods[lab.toLowerCase()] || 0), x + (tileW / 2), y + 30, { align: "center" });
      doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); setText(doc, theme.muted);
      doc.text(String(abilityScores[lab.toLowerCase()] ?? ""), x + tileW - 4, y + 40, { align: "right" });
    });

    y += 58;
    sectionTitle(doc, theme, M, y, "Combat", CONTENT_W); y += 26;
    const cw = (CONTENT_W - 12) / 4;
    const combat = character?.combat || {};
    const topVals = [combat?.ac ?? "", fmtBonus(asInt(combat?.initiative_bonus, 0)), combat?.speed ?? "", fmtBonus(asInt(combat?.proficiency_bonus, 0))];
    const topLabels = ["AC", "Initiative", "Speed", "Proficiency Bonus"];
    topLabels.forEach((lab, i) => boxValue(doc, theme, M + (i * (cw + 4)), y, cw, 32, lab, topVals[i], "center"));
    y += 42;
    const hp = combat?.hp || {};
    const lowVals = [hp?.current ?? "", hp?.max ?? "", hp?.temp ?? "", combat?.passive_perception ?? ""];
    const lowLabels = ["HP Current", "HP Max", "HP Temp", "Passive Perception"];
    lowLabels.forEach((lab, i) => boxValue(doc, theme, M + (i * (cw + 4)), y, cw, 32, lab, lowVals[i], "center"));
    y += 42;
    boxValue(doc, theme, M, y, (CONTENT_W - 8) / 2, 32, "Hit Dice Used / Total", `${combat?.hit_dice_used ?? ""}/${combat?.hit_dice_total ?? ""}`, "center");
    const ds = combat?.death_saves || {};
    const conc = combat?.concentration?.active ? "Yes" : "No";
    boxValue(doc, theme, M + ((CONTENT_W - 8) / 2) + 8, y, (CONTENT_W - 8) / 2, 32, "Inspiration / Concentration / Death Saves", `${combat?.inspiration ?? 0} / ${conc} / ${ds?.success ?? 0}-${ds?.fail ?? 0}`, "center");

    y += 48;
    sectionTitle(doc, theme, M, y, "Saving Throws and Skills", CONTENT_W); y += 26;
    const leftW = (CONTENT_W - 8) * 0.37;
    const rightW = (CONTENT_W - 8) * 0.63;
    drawListTable(doc, theme, M, y, leftW, 132, "Saving Throws", [["Save", 0.46], ["P", 0.14], ["Mod", 0.20], ["Total", 0.20]], derived.saveRows.slice(0, 6), 15);
    drawListTable(doc, theme, M + leftW + 8, y, rightW, 132, "Skills", [["Skill", 0.52], ["P", 0.10], ["E", 0.10], ["Mod", 0.14], ["Total", 0.14]], derived.skillRows, 13);

    y += 144;
    sectionTitle(doc, theme, M, y, "Senses and Spellcasting", CONTENT_W); y += 26;
    const p = derived.passives || {};
    boxValue(doc, theme, M, y, (CONTENT_W - 8) / 2, 32, "Passive Perception", p.passive_perception ?? "", "center");
    boxValue(doc, theme, M + ((CONTENT_W - 8) / 2) + 8, y, (CONTENT_W - 8) / 2, 32, "Passive Insight / Investigation", `${p.passive_insight ?? ""} / ${p.passive_investigation ?? ""}`, "center");
    y += 46;
    boxValue(doc, theme, M, y, (CONTENT_W - 8) / 2, 32, "Spell Save DC", p.spell_save_dc ?? "", "center");
    boxValue(doc, theme, M + ((CONTENT_W - 8) / 2) + 8, y, (CONTENT_W - 8) / 2, 32, "Spell Attack Bonus", p.spell_attack_bonus ?? "", "center");

    y += 46;
    const neededH = 26 + 26 + 24 + 10 + 38;
    const canFitTail = (y + neededH) < (PAGE_H - FOOTER_RESERVED);
    if (canFitTail) {
      sectionTitle(doc, theme, M, y, "Currency and Quick Notes", CONTENT_W); y += 26;
      const curW = (CONTENT_W - 16) / 5;
      const currency = character?.currency || character?.resources || {};
      ["CP", "SP", "EP", "GP", "PP"].forEach((lab, i) => boxValue(doc, theme, M + (i * (curW + 4)), y, curW, 24, lab, currency[lab.toLowerCase()] ?? "", "center"));
      y += 36;
      box(doc, theme, M, y, CONTENT_W, 38, "Quick Notes", 1);
    }
    drawFooter(doc, theme, "The Living Codex", stamp, `Page ${pageNo} of ${totalPages}`);
    return !canFitTail;
  }

  function pageCurrencyNotes(doc, theme, title, stamp, character, pageNo, totalPages) {
    drawHeader(doc, theme, title, "Currency and notes", "NOTES");
    let y = PAGE_H - M - 38;
    sectionTitle(doc, theme, M, y, "Currency and Quick Notes", CONTENT_W); y += 26;
    const curW = (CONTENT_W - 16) / 5;
    const currency = character?.currency || character?.resources || {};
    ["CP", "SP", "EP", "GP", "PP"].forEach((lab, i) => boxValue(doc, theme, M + (i * (curW + 4)), y, curW, 24, lab, currency[lab.toLowerCase()] ?? "", "center"));
    y += 36;
    const notesH = Math.max(48, (PAGE_H - FOOTER_RESERVED) - y);
    box(doc, theme, M, y, CONTENT_W, notesH, "Quick Notes", 1);
    drawFooter(doc, theme, "The Living Codex", stamp, `Page ${pageNo} of ${totalPages}`);
  }

  function pageSpellsKnown(doc, theme, title, stamp, character, pageNo, totalPages) {
    drawHeader(doc, theme, title, "Spellbook", "SPELLS");
    let y = PAGE_H - M - 38;
    sectionTitle(doc, theme, M, y, "Spellcasting Summary", CONTENT_W); y += 26;
    const col = CONTENT_W / 4;
    const sc = character?.spellcasting || {};
    const core = character?.core || {};
    const combat = character?.combat || {};
    const abilities = character?.abilities || {};
    const pbonus = asInt(combat?.proficiency_bonus, 0);
    const castAbility = sc?.ability || "wis";
    const cmod = abilityMod(abilities?.[castAbility] ?? 10);
    const sdc = 8 + pbonus + cmod;
    const sab = fmtBonus(pbonus + cmod);
    boxValue(doc, theme, M, y, col - 3, 28, "Class", sc?.class_id || core?.classes?.[0]?.id || "", "center");
    boxValue(doc, theme, M + col, y, col - 3, 28, "Casting Ability", castAbility.toUpperCase(), "center");
    boxValue(doc, theme, M + (2 * col), y, col - 3, 28, "Spell Save DC", sdc, "center");
    boxValue(doc, theme, M + (3 * col), y, col - 3, 28, "Spell Attack Bonus", sab, "center");
    y += 40;
    sectionTitle(doc, theme, M, y, "Spell Slots", CONTENT_W); y += 26;
    const slots = character?.spell_slots?.levels || {};
    const slotText = Array.from({ length: 9 }, (_, i) => i + 1).map((lvl) => {
      const r = slots[String(lvl)] || {};
      return `L${lvl}: ${r.max ?? 0}/${r.used ?? 0}`;
    }).join(" | ");
    boxValue(doc, theme, M, y, CONTENT_W, 54, "Slots by Level (max/used)", slotText);
    y += 68;
    sectionTitle(doc, theme, M, y, "Spells Known", CONTENT_W); y += 26;
    const knownRows = spellRows(character?.spells_known || []);
    const availableH = Math.max(110, ((PAGE_H - FOOTER_RESERVED) - y) * 0.48);
    const knownH = Math.min(170, availableH);
    drawGridTable(doc, theme, M, y, CONTENT_W, knownH, "", [["Name/Level", "name", 0.34], ["School", "school", 0.20], ["Ritual", "ritual", 0.10], ["Conc", "conc", 0.10], ["Range", "range", 0.13], ["Duration", "duration", 0.13]], knownRows, 13);
    let y2 = y + knownH + 14;
    sectionTitle(doc, theme, M, y2, "Spells Prepared", CONTENT_W); y2 += 26;
    const preparedRows = spellRows(character?.spells_prepared || []);
    const preparedH = Math.max(90, (PAGE_H - FOOTER_RESERVED) - y2);
    drawGridTable(doc, theme, M, y2, CONTENT_W, preparedH, "", [["Name/Level", "name", 0.34], ["School", "school", 0.20], ["Ritual", "ritual", 0.10], ["Conc", "conc", 0.10], ["Range", "range", 0.13], ["Duration", "duration", 0.13]], preparedRows, 13);
    drawFooter(doc, theme, "The Living Codex", stamp, `Page ${pageNo} of ${totalPages}`);
  }

  function pageInventory(doc, theme, title, stamp, character, pageNo, totalPages) {
    drawHeader(doc, theme, title, "Inventory", "GEAR");
    let y = PAGE_H - M - 38;
    sectionTitle(doc, theme, M, y, "Inventory", CONTENT_W); y += 26;
    const invRows = (character?.inventory || []).map((it) => ({ item: `${it?.name || ""} x${it?.qty ?? ""}`, cat: it?.category || "", eq: it?.equipped ? "Y" : "N", att: it?.attunement || "", notes: it?.notes || "" }));
    const invH = Math.max(90, (PAGE_H - FOOTER_RESERVED) - y);
    drawGridTable(doc, theme, M, y, CONTENT_W, invH, "", [["Item / Qty", "item", 0.36], ["Category", "cat", 0.16], ["Eq", "eq", 0.08], ["Att", "att", 0.10], ["Notes", "notes", 0.30]], invRows, 13);
    drawFooter(doc, theme, "The Living Codex", stamp, `Page ${pageNo} of ${totalPages}`);
  }

  function pageProfile(doc, theme, title, stamp, character, pageNo, totalPages) {
    drawHeader(doc, theme, title, "Story and utility", "PROFILE");
    let y = PAGE_H - M - 38;
    sectionTitle(doc, theme, M, y, "Identity and Story", CONTENT_W); y += 26;
    const half = (CONTENT_W - 8) / 2;
    const identity = character?.identity || {};
    const profile = character?.profile || {};
    const leftIdent = [identity?.background || profile?.background, identity?.alignment || profile?.alignment, identity?.ancestry].filter(Boolean).join(" | ");
    const rightIdent = [profile?.age, profile?.height, profile?.weight, profile?.eyes, profile?.skin, profile?.hair].filter(Boolean).join(" | ");
    boxValue(doc, theme, M, y, half, 32, "Background / Alignment / Ancestry", leftIdent);
    boxValue(doc, theme, M + half + 8, y, half, 32, "Age / Height / Weight / Eyes / Skin / Hair", rightIdent);
    y += 46;
    boxValue(doc, theme, M, y, half, 74, "Personality Traits", profile?.personality_traits || "");
    boxValue(doc, theme, M + half + 8, y, half, 74, "Ideals / Bonds / Flaws", [profile?.ideals || "", profile?.bonds || "", profile?.flaws || ""].filter(Boolean).join(" | "));
    y += 88;
    boxValue(doc, theme, M, y, half, 74, "Features / Traits", profile?.features_traits || "");
    boxValue(doc, theme, M + half + 8, y, half, 74, "Backstory", profile?.backstory || "");
    y += 88;
    sectionTitle(doc, theme, M, y, "Defenses and Proficiencies", CONTENT_W); y += 26;
    const defenses = character?.defenses || {};
    const prof = character?.proficiencies || {};
    const expertise = character?.expertise || {};
    boxValue(doc, theme, M, y, half, 70, "Defenses", `Imm: ${(defenses?.immunities || []).join(", ")}  Res: ${(defenses?.resistances || []).join(", ")}  Vuln: ${(defenses?.vulnerabilities || []).join(", ")}`);
    boxValue(doc, theme, M + half + 8, y, half, 70, "Proficiencies / Expertise", `Lang: ${(prof?.languages || []).join(", ")}  Tools: ${(prof?.tools || []).join(", ")}  Skills(Exp): ${(expertise?.skills || []).join(", ")}`);
    y += 84;
    sectionTitle(doc, theme, M, y, "Trackers and Notes", CONTENT_W); y += 26;
    const trackers = character?.trackers || [];
    const trackTxt = trackers.length ? trackers.map((t) => `${t?.name || "tracker"}:${t?.value ?? ""}`).join(" | ") : "";
    boxValue(doc, theme, M, y, CONTENT_W, 68, "Trackers and Notes", trackTxt);
    drawFooter(doc, theme, "The Living Codex", stamp, `Page ${pageNo} of ${totalPages}`);
  }

  function pageSessionLog(doc, theme, title, stamp, logRows, pageNo, totalPages) {
    drawHeader(doc, theme, title, "Session log", "SESSION LOG");
    const y = PAGE_H - M - 38;
    const dataRows = Math.max(1, logRows.length);
    let rowH = 14;
    const rows = dataRows + 1;
    const x0 = M;
    const x1 = M + (CONTENT_W * 0.22);
    const x2 = M + (CONTENT_W * 0.36);
    const x3 = M + (CONTENT_W * 0.50);
    const tableTop = y + 6;
    let tableBottom = tableTop + (rows * rowH);
    const minBottom = M + 14;
    if (tableBottom > (PAGE_H - minBottom)) {
      rowH = Math.max(10, ((PAGE_H - minBottom) - tableTop) / rows);
      tableBottom = tableTop + (rows * rowH);
    }
    setDraw(doc, theme.line); setFill(doc, "#ffffff");
    doc.rect(M, tableTop, CONTENT_W, tableBottom - tableTop, "FD");
    setFill(doc, theme.panel); setDraw(doc, theme.line);
    doc.rect(M, tableTop, CONTENT_W, rowH, "FD");
    setText(doc, theme.ink); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
    doc.text("Timestamp", x0 + 4, tableTop + 11);
    doc.text("Type", x1 + 4, tableTop + 11);
    doc.text("Label", x2 + 4, tableTop + 11);
    doc.text("Notes / Outcome", x3 + 4, tableTop + 11);
    [x1, x2, x3].forEach((x) => doc.line(x, tableTop, x, tableBottom));
    let yLine = tableTop + rowH;
    for (let i = 0; i < dataRows; i += 1) { doc.line(M, yLine, PAGE_W - M, yLine); yLine += rowH; }
    setText(doc, theme.ink); doc.setFont("helvetica", "normal"); doc.setFontSize(7);
    let yTxt = tableTop + rowH + 9;
    logRows.forEach((row) => {
      let ts = (row?.utc || row?.timestamp || "").toString();
      if (ts.length > 19) ts = ts.slice(0, 19).replace("T", " ");
      const typ = (row?.tag || row?.type || "").toString();
      const lab = (row?.label || "").toString();
      let notes = (row?.message || row?.notes || "").toString();
      if (notes.length > 68) notes = `${notes.slice(0, 65)}...`;
      doc.text(ts, x0 + 3, yTxt);
      doc.text(typ, x1 + 3, yTxt);
      doc.text(lab, x2 + 3, yTxt);
      doc.text(notes, x3 + 3, yTxt);
      yTxt += rowH;
    });
    drawFooter(doc, theme, "The Living Codex", stamp, `Page ${pageNo} of ${totalPages}`);
  }

  function paginateCampaignNotes(doc, text) {
    const paras = text.split("\n\n");
    const pages = [];
    let current = [];
    const y = PAGE_H - M - 38 + 26;
    const h = (PAGE_H - (M + 6)) - y;
    const textStart = y + 28;
    const bottomY = y + h - 12;
    const leading = 10.2;
    const lineBudget = Math.max(8, Math.floor((bottomY - textStart) / leading));
    let lineCount = 0;
    for (const para of paras) {
      const lines = doc.splitTextToSize(para, CONTENT_W - 16);
      const needed = lines.length + 1;
      if ((lineCount + needed) > lineBudget && current.length) {
        pages.push(current.join("\n\n"));
        current = [para];
        lineCount = needed;
      } else {
        current.push(para);
        lineCount += needed;
      }
    }
    if (current.length) pages.push(current.join("\n\n"));
    return pages;
  }

  function pageSessionNotes(doc, theme, title, stamp, narrativeText, pageNo, totalPages) {
    drawHeader(doc, theme, title, "Campaign notes", "CAMPAIGN NOTES");
    let y = PAGE_H - M - 38;
    sectionTitle(doc, theme, M, y, "Campaign Notes", CONTENT_W); y += 26;
    const h = (PAGE_H - (M + 6)) - y;
    box(doc, theme, M, y, CONTENT_W, h, "Narrative", 0);
    setText(doc, theme.ink); doc.setFont("helvetica", "normal"); doc.setFontSize(8.2);
    const lines = [];
    narrativeText.split("\n\n").forEach((para) => { lines.push(...doc.splitTextToSize(para, CONTENT_W - 16)); lines.push(""); });
    let ty = y + 28;
    const bottom = y + h - 12;
    for (const line of lines) {
      if (ty > bottom) break;
      doc.text(line, M + 8, ty);
      ty += 10.2;
    }
    drawFooter(doc, theme, "The Living Codex", stamp, `Page ${pageNo} of ${totalPages}`);
  }

  async function exportCharacterPdf(character, catalog) {
    const jsPDF = globalThis?.jspdf?.jsPDF || globalThis?.jsPDF;
    if (!jsPDF) throw new Error("jsPDF not loaded");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const theme = { ...THEME_DEFAULT };
    const appearance = character?.ui?.appearance || {};
    const map = { ink: "ink", inkSoft: "muted", line: "line", accent: "accent", paper: "panel" };
    Object.entries(map).forEach(([src, dest]) => {
      const v = (appearance?.[src] || "").toString().trim();
      if (/^#[0-9a-f]{6}$/i.test(v)) theme[dest] = v;
    });

    const name = (character?.meta?.name || "[Character Name]").toString();
    const stamp = `Exported ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`;
    const derived = buildDerived(character || {});
    const allLogs = Array.isArray(character?.log) ? character.log : [];
    const sessionCapacity = 50;
    const logChunks = [];
    for (let i = 0; i < allLogs.length; i += sessionCapacity) logChunks.push(allLogs.slice(i, i + sessionCapacity));
    if (!logChunks.length) logChunks.push([]);
    const notePages = paginateCampaignNotes(doc, CAMPAIGN_NOTES_TEXT);
    const totalPages = 5 + logChunks.length + Math.max(0, notePages.length - 1);

    let pageNo = 1;
    const needsTail = pageCore(doc, theme, name, stamp, character || {}, catalog || {}, derived, pageNo, totalPages);
    pageNo += 1;
    if (needsTail) {
      doc.addPage();
      pageCurrencyNotes(doc, theme, name, stamp, character || {}, pageNo, totalPages);
      pageNo += 1;
    }
    doc.addPage(); pageSpellsKnown(doc, theme, name, stamp, character || {}, pageNo, totalPages); pageNo += 1;
    doc.addPage(); pageInventory(doc, theme, name, stamp, character || {}, pageNo, totalPages); pageNo += 1;
    doc.addPage(); pageProfile(doc, theme, name, stamp, character || {}, pageNo, totalPages); pageNo += 1;
    for (const chunk of logChunks) { doc.addPage(); pageSessionLog(doc, theme, name, stamp, chunk, pageNo, totalPages); pageNo += 1; }
    for (const notesText of notePages) { doc.addPage(); pageSessionNotes(doc, theme, name, stamp, notesText, pageNo, totalPages); pageNo += 1; }

    const fileSafe = (name || "character").toLowerCase().replace(/[^a-z0-9\- _]/g, "").replace(/\s+/g, "-").replace(/\-+/g, "-").replace(/^\-+|\-+$/g, "") || "character";
    doc.save(`${fileSafe}-v2-sheet.pdf`);
  }

  globalThis.LivingCodexPdf = { exportCharacterPdf };
})();

