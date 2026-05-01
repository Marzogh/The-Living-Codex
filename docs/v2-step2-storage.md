# v2 Step 2: Storage Engine

This step introduces a standalone storage module that is not yet wired to the active UI.

## Added Module

- `js/v2/storage/index.js`
- `js/v2/storage/constants.js`
- `js/v2/storage/migrations.js`
- `js/v2/storage/integrity.js`
- `js/v2/storage/storage.js`

## Database Contract

1. DB name: `living-codex-v2`
2. DB version: `1`
3. Stores:
   1. `characters`
   2. `app`

## Record Model

`characters` store record:

```json
{
  "id": "character-id",
  "ruleset_id": "dnd5e_2014",
  "name": "Character Name",
  "saved_utc": "ISO timestamp",
  "hash": "sha256-...",
  "character": { "...": "full character object" }
}
```

`app` store records:

1. `activeCharacterId`
2. `lastOpenedAt`
3. `storageVersion`

## Exposed API

From `V2Storage`:

1. `openDb()`
2. `getAppValue(key, fallback)`
3. `setAppValue(key, value)`
4. `saveCharacter(character, { makeActive })`
5. `loadCharacterById(id)`
6. `loadActiveCharacter()`
7. `listCharacters()`
8. `deleteCharacter(id)`
9. `setActiveCharacter(id)`
10. `getStorageHealth()`

## Integrity

1. Payload hashing via SHA-256 when available.
2. Deterministic fallback hash when SubtleCrypto is unavailable.
3. Integrity mismatch is returned as a blocked load result.

## Notes

1. This step is storage-only and does not change live app behavior yet.
2. Integration with autosave/import/export UI comes in later steps.
