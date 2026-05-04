(function () {
  function esc(v) {
    return (v ?? "").toString()
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
  function norm(v) { return (v ?? "").toString().trim().toLowerCase(); }
  function titleize(v) {
    return (v || "").toString().trim().replaceAll("_", " ").replaceAll("-", " ")
      .split(/\s+/).filter(Boolean).map((x) => x[0].toUpperCase() + x.slice(1)).join(" ");
  }
  function lookup(rows, id) {
    const k = norm(id);
    const row = (rows || []).find((r) => norm(r?.id) === k);
    return row?.name || titleize(k);
  }
  function mod(score) {
    const s = Number(score ?? 10);
    if (!Number.isFinite(s)) return 0;
    return Math.floor((s - 10) / 2);
  }
  function fmt(n) { return `${n >= 0 ? "+" : ""}${n}`; }
  function rulesetLabel(id) { return id === "dnd5e_2014" ? "D&D 5e (2014)" : id === "dnd5e_2024" ? "D&D 5e (2024)" : (id || ""); }
  const SPECIES_DEFAULT_PORTRAITS = {
    aarakocra: "assets/species-portraits-by-id/aarakocra.png", aasimar: "assets/species-portraits-by-id/aasimar.png",
    bugbear: "assets/species-portraits-by-id/bugbear.png", centaur: "assets/species-portraits-by-id/centaur.png",
    changeling: "assets/species-portraits-by-id/changeling.png", deep_gnome: "assets/species-portraits-by-id/deep_gnome.png",
    dragonborn: "assets/species-portraits-by-id/dragonborn.png", elf_drow: "assets/species-portraits-by-id/elf_drow.png",
    duergar: "assets/species-portraits-by-id/duergar.png", eladrin: "assets/species-portraits-by-id/eladrin.png",
    fairy: "assets/species-portraits-by-id/fairy.png", firbolg: "assets/species-portraits-by-id/firbolg.png",
    gnome_forest: "assets/species-portraits-by-id/gnome_forest.png", genasi_air: "assets/species-portraits-by-id/genasi_air.png",
    genasi_earth: "assets/species-portraits-by-id/genasi_earth.png", genasi_fire: "assets/species-portraits-by-id/genasi_fire.png",
    genasi_water: "assets/species-portraits-by-id/genasi_water.png", githyanki: "assets/species-portraits-by-id/githyanki.png",
    githzerai: "assets/species-portraits-by-id/githzerai.png", goblin: "assets/species-portraits-by-id/goblin.png",
    goliath: "assets/species-portraits-by-id/goliath.png", half_elf: "assets/species-portraits-by-id/half_elf.png",
    half_orc: "assets/species-portraits-by-id/half_orc.png", harengon: "assets/species-portraits-by-id/harengon.png",
    elf_high: "assets/species-portraits-by-id/elf_high.png", dwarf_hill: "assets/species-portraits-by-id/dwarf_hill.png",
    hobgoblin: "assets/species-portraits-by-id/hobgoblin.png", human: "assets/species-portraits-by-id/human.png",
    kenku: "assets/species-portraits-by-id/kenku.png", kobold: "assets/species-portraits-by-id/kobold.png",
    halfling_lightfoot: "assets/species-portraits-by-id/halfling_lightfoot.png", lizardfolk: "assets/species-portraits-by-id/lizardfolk.png",
    minotaur: "assets/species-portraits-by-id/minotaur.png", dwarf_mountain: "assets/species-portraits-by-id/dwarf_mountain.png",
    orc: "assets/species-portraits-by-id/orc.png", gnome_rock: "assets/species-portraits-by-id/gnome_rock.png",
    satyr: "assets/species-portraits-by-id/satyr.png", sea_elf: "assets/species-portraits-by-id/sea_elf.png",
    shadar_kai: "assets/species-portraits-by-id/shadar_kai.png", shifter: "assets/species-portraits-by-id/shifter.png",
    halfling_stout: "assets/species-portraits-by-id/halfling_stout.png", tabaxi: "assets/species-portraits-by-id/tabaxi.png",
    tiefling: "assets/species-portraits-by-id/tiefling.png", tortle: "assets/species-portraits-by-id/tortle.png",
    triton: "assets/species-portraits-by-id/triton.png", elf_wood: "assets/species-portraits-by-id/elf_wood.png",
    yuan_ti: "assets/species-portraits-by-id/yuan_ti.png"
  };
  const CLASS_BADGES = {
    artificer: "assets/class-badges/artificer.png", barbarian: "assets/class-badges/Barbarian.png",
    bard: "assets/class-badges/Bard.png", cleric: "assets/class-badges/Cleric.png", druid: "assets/class-badges/Druid.png",
    fighter: "assets/class-badges/Fighter.png", monk: "assets/class-badges/Monk.png", paladin: "assets/class-badges/Paladin.png",
    ranger: "assets/class-badges/Ranger.png", rogue: "assets/class-badges/Rogue.png", sorcerer: "assets/class-badges/Sorcerer.png",
    warlock: "assets/class-badges/Warlock.png", wizard: "assets/class-badges/Wazard.png"
  };
  function getEffectivePortrait(character) {
    const uploaded = character?.ui?.portrait?.data_url || "";
    if (uploaded) return uploaded;
    return SPECIES_DEFAULT_PORTRAITS[norm(character?.core?.speciesId)] || "";
  }
  function getClassBadge(classId) {
    return CLASS_BADGES[norm(classId)] || "";
  }
  function cleanSpellField(value) {
    if (value == null) return "";
    let txt = String(value);
    txt = Array.from(txt).filter((ch) => ch.charCodeAt(0) >= 32 && ch.charCodeAt(0) <= 126).join("").trim();
    txt = txt.replace(/\s+/g, " ");
    if (!txt) return "";
    const dotCount = (txt.match(/\./g) || []).length;
    const pipeCount = (txt.match(/\|/g) || []).length;
    if (dotCount > 8 || pipeCount > 6) return "";
    if (!/[A-Za-z]/.test(txt)) return "";
    return txt;
  }
  function extractSpellRange(value) {
    const txt = cleanSpellField(value);
    if (!txt) return "";
    const m = txt.match(/\b(Self|Touch|\d+\s*(?:feet|foot|miles?|meters?|metres?))\b/i);
    return m ? m[1] : "";
  }
  function extractSpellDuration(value) {
    const txt = cleanSpellField(value);
    if (!txt) return "";
    const m = txt.match(/\b(Instantaneous|Until dispelled|\d+\s*(?:rounds?|minutes?|hours?|days?)|Concentration,\s*up to\s*\d+\s*(?:minutes?|hours?|days?))\b/i);
    return m ? m[1] : "";
  }

  function classesSummary(character, catalog) {
    const classes = character?.core?.classes || [];
    return classes.map((cl) => {
      const cn = lookup(catalog?.classes || [], cl?.id);
      const sn = cl?.subclassId ? lookup((catalog?.subclasses || []).filter((s) => norm(s?.class_id) === norm(cl?.id)), cl?.subclassId) : "";
      const lvl = cl?.level ?? "";
      return sn ? `${cn} - ${sn} - Level ${lvl}` : `${cn} - Level ${lvl}`;
    }).join(", ");
  }

  function buildHtml(character, catalog) {
    const name = character?.meta?.name || "Unnamed Character";
    const core = character?.core || {};
    const combat = character?.combat || {};
    const abilities = character?.abilities || {};
    const profile = character?.profile || {};
    const spellcasting = character?.spellcasting || {};
    const pbonus = Number(combat?.proficiency_bonus ?? 0) || 0;
    const castAbility = spellcasting?.ability || "wis";
    const saveDc = 8 + pbonus + mod(abilities?.[castAbility] ?? 10);
    const attackBonus = pbonus + mod(abilities?.[castAbility] ?? 10);
    const appearance = character?.ui?.appearance || {};
    const theme = {
      ink: appearance.ink || "#1b2432",
      muted: appearance.inkSoft || "#4a5568",
      line: appearance.line || "#c8d1df",
      accent: appearance.accent || "#b73a57",
      panel: appearance.paper || "#f6f8fc"
    };

    const knownRows = (character?.spells_known || []).map((s) => `<tr><td>${esc(`${s?.name || ""} (L${s?.level ?? ""})`)}</td><td>${esc(cleanSpellField(s?.school || ""))}</td><td>${s?.ritual ? "Y" : "N"}</td><td>${s?.concentration ? "Y" : "N"}</td><td>${esc(extractSpellRange(s?.range || ""))}</td><td>${esc(extractSpellDuration(s?.duration || ""))}</td></tr>`).join("");
    const prepRows = (character?.spells_prepared || []).map((s) => `<tr><td>${esc(`${s?.name || ""} (L${s?.level ?? ""})`)}</td><td>${esc(cleanSpellField(s?.school || ""))}</td><td>${s?.ritual ? "Y" : "N"}</td><td>${s?.concentration ? "Y" : "N"}</td><td>${esc(extractSpellRange(s?.range || ""))}</td><td>${esc(extractSpellDuration(s?.duration || ""))}</td></tr>`).join("");
    const invRows = (character?.inventory || []).map((it) => `<tr><td>${esc(`${it?.name || ""} x${it?.qty ?? ""}`)}</td><td>${esc(it?.category || "")}</td><td>${it?.equipped ? "Y" : "N"}</td><td>${esc(it?.attunement || "")}</td><td>${esc(it?.notes || "")}</td></tr>`).join("");
    const logRows = (character?.log || []).map((l) => `<tr><td>${esc((l?.utc || "").toString().slice(0, 19).replace("T", " "))}</td><td>${esc(l?.tag || "")}</td><td>${esc(l?.label || "")}</td><td>${esc(l?.message || "")}</td></tr>`).join("");
    const notes = (character?.play_state?.session_notes || profile?.backstory || "").toString();
    const portraitSrc = getEffectivePortrait(character);
    const classBadges = (core?.classes || []).map((cl) => {
      const src = getClassBadge(cl?.id);
      if (!src) return "";
      return `<img class="class-badge-chip" src="${esc(src)}" alt="${esc(lookup(catalog?.classes || [], cl?.id))} badge" />`;
    }).filter(Boolean).join("");

    return `<!doctype html><html><head><meta charset="utf-8"/><base href="${esc(window.location.href)}"/><title>${esc(name)} - Living Codex Sheet</title>
    <style>
      @page { size: A4; margin: 14mm; }
      :root { --ink:${theme.ink}; --muted:${theme.muted}; --line:${theme.line}; --accent:${theme.accent}; --panel:${theme.panel}; }
      body { margin:0; font-family: Helvetica, Arial, sans-serif; color:var(--ink); font-size:11px; background:#fff; }
      .page { width: 100%; min-height: 262mm; page-break-after: always; position: relative; box-sizing: border-box; }
      .hdr { border-bottom:1px solid var(--line); padding-bottom:6px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:flex-start; }
      .hdr h1 { margin:0; font-size:20px; }
      .hdr-title { display:flex; align-items:center; gap:8px; }
      .sub { color:var(--muted); font-size:11px; margin-top:2px; }
      .tag { color:var(--accent); font-weight:700; font-size:10px; }
      .hero { display:flex; gap:10px; align-items:flex-start; margin-bottom:8px; }
      .hero-portrait { width:34mm; height:34mm; object-fit:cover; border-radius:8px; border:1px solid var(--line); background:#eef2f7; }
      .hero-portrait-fallback { width:34mm; height:34mm; border-radius:8px; border:1px dashed var(--line); display:flex; align-items:center; justify-content:center; color:var(--muted); font-size:10px; }
      .class-badges { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
      .class-badges.inline { margin-top:0; }
      .class-badge-chip { width:6mm; height:6mm; object-fit:contain; border:0; border-radius:0; background:transparent; padding:0; }
      .sec { margin: 8px 0; }
      .sec-title { background:var(--panel); border:1px solid var(--line); border-radius:6px; padding:4px 6px; color:var(--accent); font-weight:700; font-size:12px; margin-bottom:6px; }
      .grid4, .grid2, .grid5 { display:grid; gap:6px; }
      .grid4 { grid-template-columns: repeat(4, 1fr); } .grid2 { grid-template-columns: repeat(2, 1fr); } .grid5 { grid-template-columns: repeat(5, 1fr); }
      .box { border:1px solid var(--line); border-radius:6px; padding:5px; background:#fff; }
      .lbl { color:var(--muted); font-size:9px; font-weight:700; margin-bottom:4px; }
      .val { font-size:11px; font-weight:700; }
      table { width:100%; border-collapse: collapse; font-size:10px; }
      th, td { border:1px solid #d8dee8; padding:4px; text-align:left; vertical-align:top; }
      th { background:#f8fafc; }
      .footer { position:absolute; left:0; right:0; bottom:0; border-top:1px solid var(--line); color:var(--muted); font-size:9px; display:flex; justify-content:space-between; padding-top:4px; }
      .notes { white-space: pre-wrap; line-height:1.35; border:1px solid var(--line); border-radius:6px; padding:8px; min-height:220mm; }
    </style></head><body>
      <section class="page">
        <div class="hdr"><div><div class="hdr-title"><h1>${esc(name)}</h1><div class="class-badges inline">${classBadges}</div></div><div class="sub">Core sheet</div></div><div class="tag">CORE</div></div>
        <div class="hero">
          ${portraitSrc ? `<img class="hero-portrait" src="${esc(portraitSrc)}" alt="${esc(name)} portrait" />` : `<div class="hero-portrait-fallback">No portrait</div>`}
          <div style="flex:1;"></div>
        </div>
        <div class="sec"><div class="sec-title">Identity</div><div class="grid4">
          <div class="box"><div class="lbl">Player</div><div class="val">${esc(profile?.player_name || "")}</div></div>
          <div class="box"><div class="lbl">Campaign</div><div class="val">${esc(character?.identity?.campaign || "")}</div></div>
          <div class="box"><div class="lbl">Ruleset</div><div class="val">${esc(rulesetLabel(character?.meta?.ruleset_id || core?.rulesetId || ""))}</div></div>
          <div class="box"><div class="lbl">Species</div><div class="val">${esc(lookup(catalog?.species || [], core?.speciesId || ""))}</div></div>
        </div></div>
        <div class="box"><div class="lbl">Class / Subclass / Level</div><div class="val">${esc(classesSummary(character, catalog))}</div></div>
        <div class="sec"><div class="sec-title">Combat</div><div class="grid4">
          <div class="box"><div class="lbl">AC</div><div class="val">${esc(combat?.ac ?? "")}</div></div>
          <div class="box"><div class="lbl">Initiative</div><div class="val">${esc(fmt(Number(combat?.initiative_bonus ?? 0) || 0))}</div></div>
          <div class="box"><div class="lbl">Speed</div><div class="val">${esc(combat?.speed ?? "")}</div></div>
          <div class="box"><div class="lbl">Proficiency Bonus</div><div class="val">${esc(fmt(Number(combat?.proficiency_bonus ?? 0) || 0))}</div></div>
        </div></div>
        <div class="sec"><div class="sec-title">Abilities</div><div class="grid4">
          ${["str","dex","con","int","wis","cha"].map((k)=>`<div class="box"><div class="lbl">${k.toUpperCase()}</div><div class="val">${esc(fmt(mod(abilities?.[k] ?? 10)))} (${esc(abilities?.[k] ?? "")})</div></div>`).join("")}
        </div></div>
        <div class="sec"><div class="sec-title">Senses and Spellcasting</div><div class="grid2">
          <div class="box"><div class="lbl">Spell Save DC</div><div class="val">${saveDc}</div></div>
          <div class="box"><div class="lbl">Spell Attack Bonus</div><div class="val">${fmt(attackBonus)}</div></div>
        </div></div>
        <div class="footer"><span>The Living Codex</span><span>Exported ${esc(new Date().toISOString().slice(0,16).replace("T"," "))} UTC</span><span>Page 1</span></div>
      </section>

      <section class="page">
        <div class="hdr"><div><div class="hdr-title"><h1>${esc(name)}</h1><div class="class-badges inline">${classBadges}</div></div><div class="sub">Spellbook</div></div><div class="tag">SPELLS</div></div>
        <div class="sec"><div class="sec-title">Spellcasting Summary</div><div class="grid4">
          <div class="box"><div class="lbl">Class</div><div class="val">${esc(spellcasting?.class_id || core?.classes?.[0]?.id || "")}</div></div>
          <div class="box"><div class="lbl">Casting Ability</div><div class="val">${esc((castAbility||"").toUpperCase())}</div></div>
          <div class="box"><div class="lbl">Spell Save DC</div><div class="val">${saveDc}</div></div>
          <div class="box"><div class="lbl">Spell Attack Bonus</div><div class="val">${fmt(attackBonus)}</div></div>
        </div></div>
        <div class="sec"><div class="sec-title">Spells Known</div><table><thead><tr><th>Name/Level</th><th>School</th><th>Ritual</th><th>Conc</th><th>Range</th><th>Duration</th></tr></thead><tbody>${knownRows}</tbody></table></div>
        <div class="sec"><div class="sec-title">Spells Prepared</div><table><thead><tr><th>Name/Level</th><th>School</th><th>Ritual</th><th>Conc</th><th>Range</th><th>Duration</th></tr></thead><tbody>${prepRows}</tbody></table></div>
        <div class="footer"><span>The Living Codex</span><span>Exported ${esc(new Date().toISOString().slice(0,16).replace("T"," "))} UTC</span><span>Page 2</span></div>
      </section>

      <section class="page">
        <div class="hdr"><div><h1>${esc(name)}</h1><div class="sub">Inventory</div></div><div class="tag">GEAR</div></div>
        <div class="sec"><div class="sec-title">Inventory</div><table><thead><tr><th>Item / Qty</th><th>Category</th><th>Eq</th><th>Att</th><th>Notes</th></tr></thead><tbody>${invRows}</tbody></table></div>
        <div class="footer"><span>The Living Codex</span><span>Exported ${esc(new Date().toISOString().slice(0,16).replace("T"," "))} UTC</span><span>Page 3</span></div>
      </section>

      <section class="page">
        <div class="hdr"><div><h1>${esc(name)}</h1><div class="sub">Story and utility</div></div><div class="tag">PROFILE</div></div>
        <div class="sec"><div class="sec-title">Identity and Story</div><div class="grid2">
          <div class="box"><div class="lbl">Background / Alignment</div><div class="val">${esc([profile?.background, profile?.alignment].filter(Boolean).join(" | "))}</div></div>
          <div class="box"><div class="lbl">Age / Height / Weight / Eyes / Skin / Hair</div><div class="val">${esc([profile?.age, profile?.height, profile?.weight, profile?.eyes, profile?.skin, profile?.hair].filter(Boolean).join(" | "))}</div></div>
        </div></div>
        <div class="sec"><div class="sec-title">Notes</div><div class="notes">${esc(profile?.backstory || "")}</div></div>
        <div class="footer"><span>The Living Codex</span><span>Exported ${esc(new Date().toISOString().slice(0,16).replace("T"," "))} UTC</span><span>Page 4</span></div>
      </section>

      <section class="page">
        <div class="hdr"><div><h1>${esc(name)}</h1><div class="sub">Session log</div></div><div class="tag">SESSION LOG</div></div>
        <div class="sec"><table><thead><tr><th>Timestamp</th><th>Type</th><th>Label</th><th>Notes / Outcome</th></tr></thead><tbody>${logRows}</tbody></table></div>
        <div class="footer"><span>The Living Codex</span><span>Exported ${esc(new Date().toISOString().slice(0,16).replace("T"," "))} UTC</span><span>Page 5</span></div>
      </section>

      <section class="page">
        <div class="hdr"><div><h1>${esc(name)}</h1><div class="sub">Campaign notes</div></div><div class="tag">CAMPAIGN NOTES</div></div>
        <div class="sec"><div class="sec-title">Campaign Notes</div><div class="notes">${esc(notes)}</div></div>
        <div class="footer"><span>The Living Codex</span><span>Exported ${esc(new Date().toISOString().slice(0,16).replace("T"," "))} UTC</span><span>Page 6</span></div>
      </section>
    </body></html>`;
  }

  async function openPrintableHtml(character, catalog) {
    const w = window.open("", "_blank");
    if (!w) throw new Error("Popup blocked. Allow popups for Export PDF.");
    const html = buildHtml(character || {}, catalog || {});
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    try {
      w.location.replace(url);
      setTimeout(() => {
        try { URL.revokeObjectURL(url); } catch {}
      }, 30_000);
    } catch {
      // Fallback for stricter browsers: write directly.
      w.document.open();
      w.document.write(html);
      w.document.close();
    }
    setTimeout(() => { try { w.focus(); w.print(); } catch {} }, 180);
  }

  globalThis.LivingCodexPdfHtml = { openPrintableHtml };
})();
