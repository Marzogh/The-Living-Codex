# v2 Step 4: Core State and Event Flow

This step introduces a standalone state layer for v2. It is not yet wired to the current UI.

## Added Module

- `js/v2/core/index.js`
- `js/v2/core/events.js`
- `js/v2/core/reducer.js`
- `js/v2/core/store.js`
- `js/v2/core/controller.js`

## Design Notes

1. Deterministic reducer-based state updates.
2. Undo/redo managed as explicit character snapshots.
3. Event bus emits state and error transitions without hidden globals.
4. Controller bridges state <-> storage and keeps integration logic out of UI.

## State Model

```json
{
  "app": {
    "ready": false,
    "bootstrapping": false,
    "activeCharacterId": "",
    "dirty": false,
    "lastError": null,
    "lastSavedUtc": ""
  },
  "character": null,
  "importReport": null
}
```

## Store API

1. `getState()`
2. `subscribe(fn)`
3. `dispatch(action)`
4. `setCharacter(character, options)`
5. `updateCharacter(mutator, options)`
6. `canUndo()`
7. `canRedo()`
8. `undo()`
9. `redo()`
10. `clearHistory()`

## Controller API

1. `bootstrap()`
2. `saveActiveCharacter({ makeActive })`
3. `loadCharacterById(id)`
4. `createNewCharacter(character)`
5. `applyImportedCharacter(result)`

## Event Bus Emissions

1. `state:changed`
2. `character:changed`
3. `app:error`

## Integration Intent (next steps)

1. Wire this controller into a v2 app shell.
2. Replace direct mutable updates in UI modules with `store.updateCharacter`.
3. Use import result reports directly from step 3 via `applyImportedCharacter`.
