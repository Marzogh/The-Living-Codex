# The Living Codex v2

A practical guide to how v2 works, how character data is stored, and how to safely hand-edit exported character packs.

## What v2 is

The Living Codex v2 is a local-first character system for tabletop play.

- Runs entirely in your browser
- No account or cloud required
- Stores data locally
- Supports ZIP export/import so your character data stays portable

## Running locally

From the repository root:

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/v2.html`
- `http://localhost:8000/v2-standalone.html`

Notes:
- `v2-standalone.html` depends on `js/v2/app-standalone.bundle.js`.
- `file://` loading may work for some flows, but local HTTP is the supported path.

## How the app is organized

At a high level, v2 runs on:

- `data/` for classes, species, subclasses, spells
- `js/v2/core` + `js/v2/storage` for state and persistence
- `js/v2/io` for import/export and validation
- `js/v2/ui/app-ui.js` for rendering and interaction

Flow:

`data files -> character state -> derived values -> UI -> save/export`

## Where your data is stored

### Primary storage

IndexedDB database: `living-codex-v2`

- `characters` store: saved characters keyed by `meta.id`
- `app` store: app-level state (active character, metadata)

### Recovery backup

A backup copy is also stored in localStorage:

- Key: `living-codex-v2.backup`

### Save behavior

- Changes autosave (debounced)
- Export triggers a save first
- `meta.modified_utc` updates on successful save

## Current character shape (v2)

Top-level keys currently used:

- `meta`
- `core`
- `abilities`
- `combat`
- `identity`
- `defenses`
- `currency`
- `proficiencies`
- `expertise`
- `trackers`
- `inventory`
- `profile`
- `resources`
- `saving_throws`
- `skills`
- `attacks`
- `spellcasting`
- `spells_known`
- `spells_prepared`
- `spell_slots`
- `log`
- `ui`

v2 also may include runtime fields under `play_state` (for example `recent_actions`, `session_notes`, `dice_last_roll`).

## ZIP Character Pack (editable format)

An export ZIP contains:

- `character.json` (required, canonical)
- `inventory.csv` (optional override)
- `spells_known.csv` (optional override)
- `spells_prepared.csv` (optional override)
- `log.csv` (optional override)
- `report/import-report.json` (optional diagnostics)

### Import precedence

On import, v2 does this in order:

1. Load `character.json`
2. Apply CSV overrides if those CSV files exist
3. Normalize/validate
4. Accept or block import with a report

---

## `character.json` internal structure

Below is a practical skeleton (trimmed, but representative):

```json
{
  "meta": {
    "schema": "living-codex-character",
    "schema_version": "2.0.0",
    "id": "uuid",
    "name": "Tarakesh",
    "ruleset_id": "dnd5e_2014",
    "created_utc": "...",
    "modified_utc": "..."
  },
  "core": {
    "rulesetId": "dnd5e_2014",
    "speciesId": "dragonborn",
    "classes": [
      { "id": "druid", "level": 3, "isPrimary": true, "subclassId": "circle_of_stars" }
    ]
  },
  "abilities": { "str": 10, "dex": 14, "con": 12, "int": 10, "wis": 18, "cha": 8 },
  "combat": {
    "ac": 15,
    "initiative_bonus": 2,
    "speed": 30,
    "inspiration": 0,
    "proficiency_bonus": 2,
    "passive_perception": 14,
    "hit_dice_total": 3,
    "hit_dice_used": 0,
    "death_saves": { "success": 0, "fail": 0 },
    "concentration": { "active": false, "source": "", "notes": "" },
    "conditions": [],
    "hp": { "max": 24, "current": 24, "temp": 0 }
  },
  "saving_throws": {
    "str": { "proficient": false, "bonus": 0, "bonus_mode": "auto", "manual_total": 0 },
    "dex": { "proficient": false, "bonus": 0, "bonus_mode": "auto", "manual_total": 0 },
    "con": { "proficient": false, "bonus": 0, "bonus_mode": "auto", "manual_total": 0 },
    "int": { "proficient": true, "bonus": 0, "bonus_mode": "auto", "manual_total": 0 },
    "wis": { "proficient": true, "bonus": 0, "bonus_mode": "auto", "manual_total": 0 },
    "cha": { "proficient": false, "bonus": 0, "bonus_mode": "auto", "manual_total": 0 }
  },
  "skills": {
    "perception": { "proficient": true, "expertise": false, "bonus": 0, "bonus_mode": "auto", "manual_total": 0 }
  },
  "spellcasting": {
    "class_id": "druid",
    "ability": "wis",
    "save_dc_mode": "auto",
    "save_dc_override": 0,
    "attack_bonus_mode": "auto",
    "attack_bonus_override": 0
  },
  "spells_known": [],
  "spells_prepared": [],
  "spell_slots": {
    "auto": true,
    "pact": { "max": 0, "used": 0, "level": 1 },
    "levels": { "1": { "max": 4, "used": 0 }, "2": { "max": 2, "used": 0 } }
  },
  "trackers": [],
  "inventory": [],
  "attacks": [],
  "log": [],
  "ui": {},
  "play_state": {
    "session_notes": "",
    "recent_actions": []
  }
}
```

### JSON manual-edit safety rules

Safe edits:

- Text fields (`name`, notes, labels)
- Numeric counters (HP, slots, tracker values)
- Lists (`spells_known`, `inventory`, `log`)

Be careful with:

- IDs (`meta.id`, item/spell IDs): keep stable unless you know why you are changing them
- Booleans: use `true/false`, not strings
- Numbers: keep numeric, not quoted
- Timestamps: ISO strings are expected

Avoid:

- Deleting required objects like `meta`, `core`, `abilities`, `combat`
- Changing key names casually (import normalizer can fix some aliases, but not all)

---

## CSV file structures (for manual editing)

Runtime source of truth:

- `js/v2/io/headers.js`
- `contracts/v2/inventory.schema.csv`
- `contracts/v2/spells.schema.csv`
- `contracts/v2/log.schema.csv`

CSV schemas are defined in:

- `contracts/v2/inventory.schema.csv`
- `contracts/v2/spells.schema.csv`
- `contracts/v2/log.schema.csv`

### `inventory.csv`

Expected columns (exact order):

- `id`
- `name`
- `category`
- `qty`
- `weight_each`
- `weight_unit`
- `value`
- `value_currency`
- `attunement`
- `container`
- `equipped`
- `notes`

Tips:

- `qty` should be a non-negative integer
- Keep `id` stable for existing rows when possible

### `spells_known.csv` and `spells_prepared.csv`

Expected columns (exact order):

- `id`
- `name`
- `level`
- `school`
- `source`
- `ritual`
- `concentration`
- `casting_time`
- `range`
- `components`
- `duration`
- `spell_id`
- `page`
- `notes`

Tips:

- `level` should be 0..9
- `ritual` and `concentration` should be boolean-like values the importer can normalize
- `id` can be custom, but should be unique per spell row

### `log.csv`

Expected columns (exact order):

- `timestamp_utc`
- `type`
- `label`
- `data_json`

Tips:

- `timestamp_utc` should be an ISO timestamp when possible
- `type` is machine-friendly (for example: `note`, `roll`, `initiative`)
- `label` is human-readable summary text
- `data_json` is optional structured JSON payload as a string

---

## Validation and import diagnostics

v2 validates and normalizes on import and returns a report shape like:

```json
{
  "ok": false,
  "errors": [],
  "warnings": [],
  "fixes_applied": [],
  "fixes_available": [],
  "blocked": []
}
```

Interpretation:

- `blocked` / `errors`: import cannot complete as-is
- `warnings`: import succeeded with caution
- `fixes_applied`: safe automatic fixes already performed
- `fixes_available`: optional guided/manual corrections

Detailed fix policy lives in:

- `contracts/v2/import-fix-rules.md`

## Compatibility notes

- v1-era packs are supported through migration/normalization.
- Legacy aliases are normalized where possible.
- Unknown fields are usually preserved unless a sanitizer rule constrains that field.

## Practical hand-edit workflow

1. Export from Codex
2. Unzip to a working folder
3. Edit `character.json` and/or CSV files
4. Keep filenames and headers exactly intact
5. Re-zip at root level (do not nest files in extra folder levels)
6. Import in v2
7. Check diagnostics if anything looks off

---

If this guide and runtime behavior ever diverge, runtime behavior in `js/v2` is the final source of truth.
