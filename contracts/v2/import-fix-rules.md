# Import Validation and Fix Rules (v2)

## Auto-Fix Rules (safe and deterministic)

1. Missing optional arrays -> initialize `[]`.
2. Missing optional objects -> initialize `{}`.
3. Numeric strings for numeric fields -> parse to number.
4. Invalid booleans (`"yes"`, `"no"`, `"1"`, `"0"`) -> coerce to boolean.
5. Duplicate list entries (case-insensitive) -> de-duplicate preserving first value.
6. Alias normalization:
   1. `armour -> armor`
   2. `saving_throws -> saves`
   3. `raceId/race_id -> speciesId`
7. Clamp abilities to `1..30`.
8. Clamp tracker counters:
   1. `max >= 0`
   2. `current >= 0`
   3. `current <= max`
9. Clamp spell level to `0..9`.
10. Fill missing IDs on rows with generated UUID.
11. Fill missing `meta.modified_utc` with current timestamp.
12. Fill missing `meta.created_utc` with `modified_utc` if available.

## Guided-Fix Rules (user confirmation required)

1. Unknown `ruleset_id`.
2. Missing `core.classes` with legacy class fields present.
3. `spells_prepared` contains spells not present in `spells_known`.
4. Slot usage exceeds max by large margin (non-trivial data correction).
5. Invalid `reset` value for trackers.

## Blocked Rules (cannot import until fixed)

1. Invalid or missing root JSON object.
2. Missing `meta.schema`.
3. Unsupported `meta.schema` (not v1/v2 known schemas).
4. Missing `meta.id`.
5. Missing `meta.name`.
6. Missing `meta.ruleset_id` with no recoverable fallback.
7. Malformed CSV headers where mapping cannot be inferred.
8. JSON parse failure in `data_json` log rows when no fallback extraction possible.

## Reporting Requirements

For every fix candidate, report:

1. `code` (stable machine-readable id)
2. `path` (JSON path / CSV row reference)
3. `message`
4. `before` value (if available)
5. `after` value (if applied)
6. `mode` (`auto`, `guided`, `blocked`)
