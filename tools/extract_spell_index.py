#!/usr/bin/env python3
"""
Extract a spell *index* (metadata + class membership) from class-split spell-card PDFs.

Design goals:
- Do NOT export full spell descriptions/body text.
- Extract: name, level, school, castingTime, range, components, duration, ritual?, concentration?
- Derive class from filename.
- Output:
  - data/dnd5e_2014/spells.min.json
  - data/dnd5e_2014/spells.min.csv

Requires:
  pip install pdfplumber
"""

from __future__ import annotations

import csv
import json
import os
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import pdfplumber


# ----------------------------
# Heuristics / regex helpers
# ----------------------------

RE_CASTING_TIME = re.compile(r"\bCASTING\s+TIME\b", re.IGNORECASE)
RE_RANGE = re.compile(r"\bRANGE\b", re.IGNORECASE)
RE_COMPONENTS = re.compile(r"\bCOMPONENTS\b", re.IGNORECASE)
RE_DURATION = re.compile(r"\bDURATION\b", re.IGNORECASE)

# Level line patterns commonly seen near the bottom/top:
# e.g. "Wizard Evocation cantrip", "Paladin 1st level Enchantment"
RE_LEVEL_SCHOOL = re.compile(
    r"\b(?P<school>Abjuration|Conjuration|Divination|Enchantment|Evocation|Illusion|Necromancy|Transmutation)\b.*?"
    r"\b(?P<level>cantrip|[1-9](st|nd|rd|th)\s+level)\b",
    re.IGNORECASE,
)

RE_CONCENTRATION = re.compile(r"\bConcentration\b", re.IGNORECASE)
RE_RITUAL = re.compile(r"\bRitual\b|\(RITUAL\)", re.IGNORECASE)


@dataclass
class SpellIndexRow:
    rulesetId: str
    name: str
    level: int
    school: str
    ritual: bool
    concentration: bool
    castingTime: str
    range: str
    components: str
    duration: str
    classes: List[str]
    sourceHint: str = ""
    page: str = ""
    summary_basic: str = ""  # intentionally blank in extractor


def normalize_space(s: str) -> str:
    # collapse whitespace, but keep commas etc
    return re.sub(r"\s+", " ", s).strip()


def guess_class_from_filename(path: Path) -> str:
    stem = path.stem.lower()
    # simple mapping for your filenames
    # examples: "Paladin Spells", "Wizard spells"
    stem = stem.replace("spells", "").replace("_", " ").strip()
    # title-case "warlock" -> "Warlock"
    return stem.title()


def extract_page_text(pdf_path: Path) -> List[str]:
    pages = []
    with pdfplumber.open(str(pdf_path)) as pdf:
        for p in pdf.pages:
            txt = p.extract_text() or ""
            pages.append(txt)
    return pages


def split_into_cards(page_text: str) -> List[str]:
    """
    These PDFs look like 3x3 or similar grids of spell cards per page.
    The extracted text is basically concatenated cards.

    We split by repeated "CASTING TIME" occurrences (one per card).
    This is a heuristic, but works surprisingly well for card PDFs.
    """
    chunks = []
    # Keep the marker; split on marker but reattach
    parts = re.split(r"(?=\bCASTING\s+TIME\b)", page_text, flags=re.IGNORECASE)
    for part in parts:
        part = normalize_space(part)
        if not part:
            continue
        if RE_CASTING_TIME.search(part):
            chunks.append(part)
    return chunks


def extract_field_after(label: str, card: str) -> str:
    """
    Extract content after a header label on the same line/nearby.
    Heuristic: find label and take next ~60 chars until another label.
    """
    idx = re.search(rf"\b{re.escape(label)}\b", card, flags=re.IGNORECASE)
    if not idx:
        return ""
    start = idx.end()
    tail = card[start:]

    # stop at next header
    stop_match = re.search(r"\b(CASTING\s+TIME|RANGE|COMPONENTS|DURATION)\b", tail, flags=re.IGNORECASE)
    snippet = tail[: stop_match.start()] if stop_match else tail[:120]
    return normalize_space(snippet)


def extract_name(card: str) -> str:
    """
    Spell name tends to appear after DURATION block in some extracts,
    but often it's a big uppercase phrase somewhere early.
    We'll look for a run of uppercase words that isn't the headers.
    """
    # remove header words
    cleaned = re.sub(r"\b(CASTING\s+TIME|RANGE|COMPONENTS|DURATION)\b", " ", card, flags=re.IGNORECASE)
    cleaned = normalize_space(cleaned)

    # Find sequences of words in ALL CAPS (A-Z + hyphen/apostrophe)
    # Example: "ACID SPLASH", "GREEN-FLAME BLADE"
    candidates = re.findall(r"\b[A-Z][A-Z'\-]+(?:\s+[A-Z][A-Z'\-]+){0,4}\b", cleaned)

    # filter out obvious non-names
    bad = {"V", "S", "M", "INSTANTANEOUS", "SELF", "FEET", "ACTION", "BONUS", "MINUTE", "HOUR", "ROUND"}
    filtered = []
    for c in candidates:
        c2 = c.strip()
        if len(c2) < 4:
            continue
        if c2 in bad:
            continue
        # avoid "AT HIGHER LEVELS" etc
        if "HIGHER" in c2 or "LEVELS" in c2:
            continue
        filtered.append(c2)

    # Choose the first candidate that looks like a name
    return filtered[0].title() if filtered else ""


def extract_level_school(card: str) -> Tuple[int, str]:
    """
    Try to detect level/school from the '... Evocation cantrip' or '... 1st level Abjuration' line.
    """
    m = RE_LEVEL_SCHOOL.search(card)
    if not m:
        return (0, "")
    school = m.group("school").title()
    lvl_raw = m.group("level").lower()
    if "cantrip" in lvl_raw:
        level = 0
    else:
        # "1st level" -> 1 etc
        level = int(re.match(r"([1-9])", lvl_raw).group(1))
    return (level, school)


def build_index_from_pdfs(pdf_paths: List[Path], ruleset_id: str) -> Dict[str, SpellIndexRow]:
    """
    Returns dict keyed by spell name (title-case), merged across class PDFs.
    """
    spells: Dict[str, SpellIndexRow] = {}

    for pdf_path in pdf_paths:
        cls = guess_class_from_filename(pdf_path)
        pages = extract_page_text(pdf_path)

        for page_text in pages:
            for card in split_into_cards(page_text):
                name = extract_name(card)
                if not name:
                    continue

                level, school = extract_level_school(card)
                ritual = bool(RE_RITUAL.search(card))
                concentration = bool(RE_CONCENTRATION.search(card))

                casting_time = extract_field_after("CASTING TIME", card)
                rng = extract_field_after("RANGE", card)
                components = extract_field_after("COMPONENTS", card)
                duration = extract_field_after("DURATION", card)

                # keep metadata if already exists; merge classes
                if name not in spells:
                    spells[name] = SpellIndexRow(
                        rulesetId=ruleset_id,
                        name=name,
                        level=level,
                        school=school,
                        ritual=ritual,
                        concentration=concentration,
                        castingTime=casting_time,
                        range=rng,
                        components=components,
                        duration=duration,
                        classes=[cls],
                    )
                else:
                    if cls not in spells[name].classes:
                        spells[name].classes.append(cls)

                    # fill blanks if earlier pass missed fields
                    row = spells[name]
                    if row.school == "" and school:
                        row.school = school
                    if row.level == 0 and level != 0:
                        row.level = level
                    row.ritual = row.ritual or ritual
                    row.concentration = row.concentration or concentration
                    if not row.castingTime and casting_time:
                        row.castingTime = casting_time
                    if not row.range and rng:
                        row.range = rng
                    if not row.components and components:
                        row.components = components
                    if not row.duration and duration:
                        row.duration = duration

    # sort class lists
    for row in spells.values():
        row.classes = sorted(row.classes)

    return spells


def write_outputs(spells: Dict[str, SpellIndexRow], out_json: Path, out_csv: Path) -> None:
    # JSON
    spell_list = sorted((asdict(v) for v in spells.values()), key=lambda r: (r["level"], r["name"]))
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(spell_list, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # CSV
    fieldnames = [
        "rulesetId", "name", "level", "school", "ritual", "concentration",
        "castingTime", "range", "components", "duration",
        "classes", "sourceHint", "page", "summary_basic"
    ]
    with out_csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in spell_list:
            r2 = dict(r)
            r2["classes"] = ",".join(r2["classes"])
            w.writerow(r2)


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: tools/extract_spell_index.py <pdf_dir_or_files...>")
        return 2

    inputs = [Path(a) for a in sys.argv[1:]]
    pdfs: List[Path] = []
    for p in inputs:
        if p.is_dir():
            pdfs.extend(sorted(p.glob("*.pdf")))
        else:
            pdfs.append(p)

    pdfs = [p for p in pdfs if p.suffix.lower() == ".pdf"]
    if not pdfs:
        print("No PDFs found.")
        return 2

    ruleset_id = "dnd5e_2014"
    spells = build_index_from_pdfs(pdfs, ruleset_id=ruleset_id)

    out_json = Path("data") / ruleset_id / "spells.min.json"
    out_csv = Path("data") / ruleset_id / "spells.min.csv"
    write_outputs(spells, out_json, out_csv)

    print(f"Extracted {len(spells)} unique spells")
    print(f"Wrote: {out_json}")
    print(f"Wrote: {out_csv}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())