function safeName(name) {
  return (name ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\- _]/g, "")
    .replace(/\s+/g, "-")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "") || "character";
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function asInt(v, fallback = 0) {
  const n = Number.parseInt((v ?? "").toString(), 10);
  return Number.isFinite(n) ? n : fallback;
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

function lookupLabel(rows, id) {
  const key = (id || "").toString().trim().toLowerCase();
  if (!key) return "";
  const row = (rows || []).find((x) => (x?.id || "").toString().trim().toLowerCase() === key);
  return (row?.name || "").toString().trim() || titleizeId(key);
}

function loadJsPdf() {
  const g = globalThis;
  const ctor = g?.jspdf?.jsPDF || g?.jsPDF;
  if (!ctor) throw new Error("jsPDF not loaded. Expected vendor/jspdf.umd.min.js.");
  return ctor;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function characterSubtitle(character, catalog = {}) {
  const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
  const classRows = classes.filter((c) => (c?.id || "").toString().trim());
  const classText = classRows.length <= 1
    ? (() => {
        const row = classRows[0];
        if (!row) return "";
        const className = lookupLabel(catalog.classes || [], row.id);
        const lvl = clamp(asInt(row.level, 1), 1, 20);
        return `Level ${lvl} ${className}`;
      })()
    : `Classes: ${classRows.map((row) => `Level ${clamp(asInt(row.level, 1), 1, 20)} ${lookupLabel(catalog.classes || [], row.id)}`).join(" / ")}`;
  const species = lookupLabel(catalog.species || [], character?.core?.speciesId || "");
  return [classText, species].filter(Boolean).join(" • ");
}

async function buildCharacterPdfBlob(character, catalog = {}) {
  const jsPDF = loadJsPdf();
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const m = 40;
  let y = m;
  const name = character?.meta?.name || "Unnamed Character";
  const subtitle = characterSubtitle(character, catalog);
  const theme = character?.ui?.appearance || {};

  const accent = /^#[0-9a-f]{6}$/i.test((theme.accent || "").toString()) ? theme.accent : "#2c5f52";
  const toRgb = (hex) => {
    const n = hex.replace("#", "");
    return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("The Living Codex", m, y);
  const [ar, ag, ab] = toRgb(accent);
  doc.setTextColor(ar, ag, ab);
  doc.setFontSize(10);
  doc.text("Character Sheet Export", pageW - m, y, { align: "right" });
  doc.setTextColor(20, 20, 20);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(name, m, y);
  y += 14;
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(subtitle || "No class/species", m, y);
  doc.setTextColor(20, 20, 20);
  y += 16;
  doc.setDrawColor(210, 210, 210);
  doc.line(m, y, pageW - m, y);
  y += 18;

  const core = character?.core || {};
  const combat = character?.combat || {};
  const profile = character?.profile || {};
  const abilities = character?.abilities || {};
  const lines = [
    `Ruleset: ${core?.rulesetId || character?.meta?.ruleset_id || "dnd5e_2014"}`,
    `AC: ${combat?.ac ?? 10}    HP: ${combat?.hp?.current ?? 0}/${combat?.hp?.max ?? 0} (+${combat?.hp?.temp ?? 0} temp)`,
    `Speed: ${combat?.speed ?? 30}    Initiative: ${combat?.initiative_bonus ?? 0}    Proficiency: ${combat?.proficiency_bonus ?? 2}`,
    `STR ${abilities.str ?? 10}  DEX ${abilities.dex ?? 10}  CON ${abilities.con ?? 10}  INT ${abilities.int ?? 10}  WIS ${abilities.wis ?? 10}  CHA ${abilities.cha ?? 10}`,
    `Background: ${profile?.background || "-"}`,
    `Alignment: ${profile?.alignment || "-"}`,
    `Player: ${profile?.player_name || "-"}`,
  ];
  doc.setFontSize(10);
  for (const line of lines) {
    const wrapped = doc.splitTextToSize(line, pageW - (2 * m));
    doc.text(wrapped, m, y);
    y += (wrapped.length * 13);
  }

  const notes = (character?.play_state?.session_notes || profile?.backstory || "").toString().trim();
  if (notes) {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Session Notes", m, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(notes, pageW - (2 * m));
    for (const row of wrapped) {
      if (y > pageH - 56) {
        doc.addPage();
        y = m;
      }
      doc.text(row, m, y);
      y += 12;
    }
  }

  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text(new Date().toISOString(), pageW - m, pageH - 20, { align: "right" });
  doc.setTextColor(20, 20, 20);

  const buf = doc.output("arraybuffer");
  return new Blob([buf], { type: "application/pdf" });
}

async function exportPdfToDownload(character, catalog = {}, opts = {}) {
  const blob = await buildCharacterPdfBlob(character, catalog, opts);
  triggerDownload(blob, `${safeName(character?.meta?.name)}-v2-sheet.pdf`);
}

export const V2PdfIO = {
  buildCharacterPdfBlob,
  exportPdfToDownload
};

