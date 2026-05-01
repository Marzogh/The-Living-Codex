# v2 Step 5: UI Shell (Isolated)

This step adds a new v2 UI entrypoint without replacing the existing app.

## Added Files

1. `v2.html`
2. `css/v2.css`
3. `js/v2/app.js`
4. `js/v2/ui/app-ui.js`
5. `js/v2/core/default-character.js`

## What Works in v2 Shell

1. Bootstrap from v2 storage.
2. Create new character.
3. Edit core fields, classes, abilities, combat.
4. Edit inventory rows.
5. Edit known/prepared spells.
6. Edit log entries.
7. Undo/redo via store history.
8. Import ZIP via v2 IO pipeline (with report).
9. Export ZIP via v2 IO pipeline.
10. Debounced autosave to v2 IndexedDB.

## What Is Intentionally Deferred

1. Advanced spell rules/derived calculations UI.
2. Proficiencies editor polish.
3. Tracker management UI parity with current app.
4. Final production styling.
5. Cutover from `index.html` to v2.

## Local Test

1. Serve locally: `python3 -m http.server 8000`
2. Open: `/v2.html`
3. Create character, edit fields, refresh browser.
4. Verify character is restored.
5. Export ZIP, edit `character.json`, re-import, inspect import report.
