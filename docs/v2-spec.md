# The Living Codex v2 Specification (Step 1)

## Goals

1. Serve as a static local web app (`python3 -m http.server`).
2. No account system, no cloud sync, no telemetry.
3. Survive reboots via local browser storage.
4. Export character packs that are user-editable in plain text tools.
5. Validate imports and provide fix options (auto-fix where safe).

## Runtime Model

1. App runs entirely in browser.
2. Rules data loaded from local repo files under `data/`.
3. Character state held in memory while app is open.
4. Character state persisted in IndexedDB with schema versioning and migrations.

## Persistence Contract

1. Primary storage: IndexedDB database `living-codex-v2`.
2. Object stores:
   1. `characters` (records by `meta.id`)
   2. `app` (keys: `activeCharacterId`, `lastOpenedAt`, `storageVersion`)
3. Autosave behavior:
   1. Save on user changes (debounced).
   2. Save immediately before export.
   3. Store `meta.modified_utc` on each successful save.
4. Recovery behavior:
   1. On load, open last active character if valid.
   2. If invalid, show recovery dialog with fix options.

## Character Pack Contract

ZIP at root contains:

1. `character.json` (required, canonical source)
2. `inventory.csv` (optional override view)
3. `spells_known.csv` (optional override view)
4. `spells_prepared.csv` (optional override view)
5. `log.csv` (optional override view)
6. `report/import-report.json` (generated only during import diagnostics; never required)

Editable guarantee:

1. `character.json` is pretty-printed UTF-8 JSON.
2. CSV files use stable headers and newline-terminated rows.
3. Unknown JSON fields are preserved (forward compatibility).

## Validation and Fix Policy

Severity levels:

1. `error` = must be fixed before import can complete.
2. `warning` = import can continue; value may be changed by fix.
3. `info` = note only.

Fix modes:

1. `auto` (safe deterministic fixes; applied immediately)
2. `guided` (user chooses keep/change)
3. `blocked` (cannot import until resolved)

Report shape:

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

Detailed fix rules are defined in:

- `contracts/v2/import-fix-rules.md`

## Data Contracts

1. JSON schema: `contracts/v2/character.schema.json`
2. CSV headers:
   1. `contracts/v2/inventory.schema.csv`
   2. `contracts/v2/spells.schema.csv`
   3. `contracts/v2/log.schema.csv`

## Compatibility and Migration

1. v1 imports are supported via migration layer.
2. Aliases normalized during migration:
   1. `armour -> armor`
   2. `saving_throws -> saves`
   3. legacy class/single-class fields -> `core.classes[]`
3. Migration output is v2 canonical object before final validation.

## Non-Goals (Step 1)

1. UI redesign details.
2. Rules feature expansion.
3. Network features.
