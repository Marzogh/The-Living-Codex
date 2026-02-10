#!/usr/bin/env python3
"""
Normalize extracted spell index into canonical IDs + class IDs + CSV source-of-truth.

Input:
  data/dnd5e_2014/spells.min.json   (from extractor)
  data/dnd5e_2014/classes.json      (canonical class IDs)
  data/dnd5e_2014/cantrips.json (optional: manual cantrip additions)

Output:
  data_src/dnd5e_2014/spells.csv    (source-of-truth)
  data/dnd5e_2014/spells.min.json   (optional: rewritten canonical JSON)

Rules:
- Spell ID = spell_<slug(name)>
- classes normalized to canonical IDs (wizard, cleric, ...)
- Merge/dedupe already done by name in your extractor, but we also guard against
  minor name inconsistencies via normalization.
"""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path
from typing import Dict, List, Any


def slugify(name: str) -> str:
    s = (name or "").strip().lower()
    s = s.replace("&", " and ")
    s = re.sub(r"[’']", "", s)           # remove apostrophes
    s = re.sub(r"[^a-z0-9]+", "_", s)    # non-alnum -> _
    s = re.sub(r"_+", "_", s).strip("_")
    return s


def norm_name(name: str) -> str:
    # used for dedupe guard
    return re.sub(r"\s+", " ", (name or "").strip().lower())


def load_json(p: Path):
    return json.loads(p.read_text(encoding="utf-8"))


def save_json(p: Path, obj: Any):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    ruleset = "dnd5e_2014"

    in_json = Path("data") / ruleset / "spells.min.json"
    classes_json = Path("data") / ruleset / "classes.json"
    extra_json = Path("data") / ruleset / "cantrips.json"

    if not in_json.exists():
        raise SystemExit(f"Missing input: {in_json}")
    if not classes_json.exists():
        raise SystemExit(f"Missing input: {classes_json}")

    spells: List[dict] = load_json(in_json)
    classes: List[dict] = load_json(classes_json)

    # Optional: merge in manual additions (e.g., cantrips not present in extractor PDFs)
    if extra_json.exists():
        extra = load_json(extra_json)
        if isinstance(extra, list):
            spells.extend(extra)
        else:
            raise SystemExit(f"Expected list in {extra_json}")

    # canonical class IDs
    class_ids = {c["id"] for c in classes if "id" in c}

    # map class display names to IDs (robust)
    # We derive this from classes.json names + common variants.
    name_to_id: Dict[str, str] = {}
    for c in classes:
        cid = c.get("id", "")
        cname = c.get("name", "")
        if cid and cname:
            name_to_id[cname.strip().lower()] = cid

    # manual extras (if your filenames used variants)
    # e.g. "Paladin" vs "Paladin Spells" are already stripped by extractor, but safe.
    name_to_id["artificer"] = "artificer"  # if you decide to include it later in classes.json
    # If artificer isn't in classes.json, it will be filtered out unless you add it.

    canonical: Dict[str, dict] = {}

    for s in spells:
        name = s.get("name", "").strip()
        if not name:
            continue

        key = norm_name(name)
        rec = canonical.get(key)

        # Normalize classes to IDs
        raw_classes = s.get("classes", []) or []
        class_out: List[str] = []
        for rc in raw_classes:
            rc_norm = str(rc).strip().lower()
            cid = name_to_id.get(rc_norm)
            if cid and cid in class_ids:
                class_out.append(cid)
        class_out = sorted(set(class_out))

        # Fill/normalize fields
        level = int(s.get("level", 0) or 0)
        school = (s.get("school", "") or "").strip()
        ritual = bool(s.get("ritual", False))
        concentration = bool(s.get("concentration", False))
        casting_time = (s.get("castingTime") or s.get("casting_time") or "").strip()
        rng = (s.get("range", "") or "").strip()
        components = (s.get("components", "") or "").strip()
        duration = (s.get("duration", "") or "").strip()

        source = (s.get("sourceHint") or s.get("source") or "").strip()
        page = str(s.get("page", "") or "").strip()

        # Summaries: keep if present; otherwise blank.
        summary_basic = (s.get("summary_basic", "") or "").strip()
        summary_expert = (s.get("summary_expert", "") or "").strip()

        if rec is None:
            canonical[key] = {
                "id": f"spell_{slugify(name)}",
                "name": name,
                "level": level,
                "school": school,
                "ritual": ritual,
                "concentration": concentration,
                "casting_time": casting_time,
                "range": rng,
                "components": components,
                "duration": duration,
                "classes": class_out,
                "source": source,
                "page": page,
                "summary_basic": summary_basic,
                "summary_expert": summary_expert,
            }
        else:
            # Merge: union classes + fill blanks
            rec["classes"] = sorted(set(rec["classes"]) | set(class_out))
            for k, v in [
                ("school", school),
                ("casting_time", casting_time),
                ("range", rng),
                ("components", components),
                ("duration", duration),
                ("source", source),
                ("page", page),
                ("summary_basic", summary_basic),
                ("summary_expert", summary_expert),
            ]:
                if (not rec.get(k)) and v:
                    rec[k] = v

            rec["ritual"] = bool(rec.get("ritual")) or ritual
            rec["concentration"] = bool(rec.get("concentration")) or concentration
            # Keep max level if inconsistent (shouldn't happen)
            rec["level"] = max(int(rec.get("level", 0)), level)

    out_list = list(canonical.values())
    out_list.sort(key=lambda r: (int(r.get("level", 0)), r.get("name", "")))

    # Write CSV source-of-truth
    out_csv = Path("data_src") / ruleset / "spells.csv"
    out_csv.parent.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "id","name","level","school","ritual","concentration",
        "casting_time","range","components","duration",
        "classes","source","page","summary_basic","summary_expert"
    ]
    with out_csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in out_list:
            row = dict(r)
            row["classes"] = "|".join(row.get("classes", []))
            w.writerow(row)

    # Optional: also overwrite spells.min.json in canonical form for immediate app use
    out_json = Path("data") / ruleset / "spells.min.json"
    save_json(out_json, out_list)

    # Report
    if extra_json.exists():
        print(f"Merged extras: {extra_json}")
    print(f"Canonical spells: {len(out_list)}")
    print(f"Wrote CSV: {out_csv}")
    print(f"Rewrote JSON: {out_json}")
    print(f"Spells with 0 recognised classes (likely Artificer until added): {sum(1 for r in out_list if not r.get('classes'))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())