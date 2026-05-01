# v2 Step 3: Import/Export + Validation/Fix Engine

This step adds standalone v2 IO modules. They are not yet wired to the live app UI.

## Added Module

- `js/v2/io/index.js`
- `js/v2/io/headers.js`
- `js/v2/io/csv.js`
- `js/v2/io/validate.js`
- `js/v2/io/zipio.js`

## Capabilities

1. Export editable ZIP packs:
   1. `character.json` (pretty JSON)
   2. `inventory.csv`
   3. `spells_known.csv`
   4. `spells_prepared.csv`
   5. `log.csv`
2. Import ZIP packs from file.
3. Optional CSV override ingestion over `character.json`.
4. Validation + auto-fix pass with report:
   1. `ok`
   2. `errors`
   3. `warnings`
   4. `fixes_applied`
   5. `fixes_available` (guided)
   6. `blocked`

## Auto-Fix Coverage (implemented)

1. Missing arrays/objects initialization.
2. Alias normalization (`armour -> armor`, `saving_throws -> saves`).
3. Ability score clamp to `1..30`.
4. Currency coercion to integers.
5. Tracker normalization (`id`, `label`, bounds, reset fallback guidance).
6. Spell level clamp to `0..9`; ritual/concentration boolean coercion.
7. Missing timestamps (`created_utc`, `modified_utc`) fill.

## Guided/Blocked Signals (implemented)

1. Guided:
   1. Unknown ruleset.
   2. Legacy single-class migration to `core.classes`.
   3. Prepared spells not present in known spells.
   4. Invalid tracker reset value.
2. Blocked:
   1. Root not object.
   2. Missing/unsupported schema.
   3. Missing `meta.id`.
   4. Missing `meta.name`.
   5. Missing `meta.ruleset_id`.

## Dev Console Quick Tests

After future wiring, expected usage pattern:

```js
const result = await V2ZipIO.importZipFromFile(file);
console.log(result.ok, result.report);
```

```js
await V2ZipIO.exportZipToDownload(character, { includeReport: false });
```
