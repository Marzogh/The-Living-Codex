import { APP_KEYS, DB_NAME, DB_VERSION, STORES } from "./constants.js";
import { hashCharacterPayload, verifyCharacterPayload } from "./integrity.js";
import { runMigrations } from "./migrations.js";

function nowIso() {
  return new Date().toISOString();
}

function clone(value) {
  return structuredClone(value);
}

function asString(value) {
  return (value ?? "").toString().trim();
}

function validateCharacterEnvelopeShape(character) {
  const errors = [];
  if (!character || typeof character !== "object") errors.push("Character is not an object.");
  if (!character?.meta || typeof character.meta !== "object") errors.push("Missing meta object.");
  if (!asString(character?.meta?.id)) errors.push("Missing meta.id.");
  if (!asString(character?.meta?.name)) errors.push("Missing meta.name.");
  if (!asString(character?.meta?.ruleset_id)) errors.push("Missing meta.ruleset_id.");
  return { ok: errors.length === 0, errors };
}

function requestToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("IndexedDB request failed"));
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error || new Error("IndexedDB transaction aborted"));
    tx.onerror = () => reject(tx.error || new Error("IndexedDB transaction failed"));
  });
}

let dbPromise = null;
let healingAttempted = false;
let localFallbackMode = false;

const LOCAL_KEYS = {
  CHARACTERS: `${DB_NAME}.local.characters`,
  ACTIVE_ID: `${DB_NAME}.local.activeCharacterId`,
  LAST_OPENED: `${DB_NAME}.local.lastOpenedAt`,
  STORAGE_VERSION: `${DB_NAME}.local.storageVersion`
};

function readLocalJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeLocalJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function localCharactersMap() {
  return readLocalJson(LOCAL_KEYS.CHARACTERS, {});
}

function setLocalCharactersMap(map) {
  writeLocalJson(LOCAL_KEYS.CHARACTERS, map || {});
}

function localGetValue(key, fallback = "") {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : raw;
  } catch {
    return fallback;
  }
}

function localSetValue(key, value) {
  localStorage.setItem(key, value ?? "");
}

function hasRequiredStores(db) {
  return db.objectStoreNames.contains(STORES.CHARACTERS) && db.objectStoreNames.contains(STORES.APP);
}

function deleteDb(name) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(name);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error || new Error("Failed to delete storage database"));
    req.onblocked = () => reject(new Error("Database reset blocked. Close other tabs/windows and refresh."));
  });
}

function openDbRaw() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onblocked = () => {
      reject(new Error("Storage upgrade blocked. Close other tabs/windows using this app and refresh."));
    };

    req.onupgradeneeded = () => {
      const db = req.result;
      const tx = req.transaction;
      runMigrations(db, tx, req.oldVersion, req.newVersion || DB_VERSION);
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Failed to open storage database"));
  });
}

async function openDb() {
  if (localFallbackMode) return null;
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    const db = await openDbRaw();
    if (hasRequiredStores(db)) return db;

    db.close();
    if (healingAttempted) {
      localFallbackMode = true;
      return null;
    }

    healingAttempted = true;
    dbPromise = null;
    await deleteDb(DB_NAME);
    return openDb();
  })();

  try {
    return await dbPromise;
  } catch (err) {
    dbPromise = null;
    localFallbackMode = true;
    return null;
  }
}

async function getAppValueLocal(key, fallback = null) {
  const raw = localGetValue(key, "");
  if (raw === "") return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

async function setAppValueLocal(key, value) {
  if (typeof value === "string") {
    localSetValue(key, value);
    return;
  }
  localSetValue(key, JSON.stringify(value));
}

async function saveCharacterLocal(character, { makeActive = true } = {}) {
  const candidate = clone(character);
  const shape = validateCharacterEnvelopeShape(candidate);
  if (!shape.ok) return { ok: false, errors: shape.errors };

  candidate.meta.modified_utc = nowIso();
  const hash = await hashCharacterPayload(candidate);
  const record = makeRecord(candidate, hash);

  const map = localCharactersMap();
  map[record.id] = record;
  setLocalCharactersMap(map);

  localSetValue(LOCAL_KEYS.LAST_OPENED, nowIso());
  if (makeActive) localSetValue(LOCAL_KEYS.ACTIVE_ID, record.id);
  localSetValue(LOCAL_KEYS.STORAGE_VERSION, `${DB_VERSION}`);

  return {
    ok: true,
    character: clone(candidate),
    record: {
      id: record.id,
      name: record.name,
      ruleset_id: record.ruleset_id,
      saved_utc: record.saved_utc
    }
  };
}

async function loadCharacterByIdLocal(id) {
  const characterId = asString(id);
  if (!characterId) return { ok: false, blocked: [{ code: "missing-id", message: "Character ID is required." }] };

  const map = localCharactersMap();
  const row = map[characterId];
  if (!row) return { ok: false, blocked: [{ code: "not-found", message: `Character '${characterId}' not found.` }] };

  const shape = validateCharacterEnvelopeShape(row.character);
  if (!shape.ok) {
    return { ok: false, blocked: shape.errors.map((message) => ({ code: "invalid-shape", message })) };
  }

  const hashCheck = await verifyCharacterPayload(row.character, row.hash);
  if (!hashCheck.ok) {
    return {
      ok: false,
      blocked: [{ code: "integrity-mismatch", message: "Stored character hash mismatch.", expected: hashCheck.expected, actual: hashCheck.actual }],
      character: row.character
    };
  }

  return {
    ok: true,
    character: clone(row.character),
    info: {
      id: row.id,
      name: row.name,
      ruleset_id: row.ruleset_id,
      saved_utc: row.saved_utc
    }
  };
}

async function loadActiveCharacterLocal() {
  const activeId = localGetValue(LOCAL_KEYS.ACTIVE_ID, "");
  if (!activeId) return { ok: false, blocked: [{ code: "no-active-character", message: "No active character." }] };
  const loaded = await loadCharacterByIdLocal(activeId);
  if (loaded.ok) localSetValue(LOCAL_KEYS.LAST_OPENED, nowIso());
  return loaded;
}

async function listCharactersLocal() {
  const map = localCharactersMap();
  return Object.values(map)
    .map((row) => ({ id: row.id, name: row.name, ruleset_id: row.ruleset_id, saved_utc: row.saved_utc }))
    .sort((a, b) => b.saved_utc.localeCompare(a.saved_utc));
}

async function deleteCharacterLocal(id) {
  const characterId = asString(id);
  if (!characterId) return { ok: false, errors: ["Character ID is required."] };

  const map = localCharactersMap();
  delete map[characterId];
  setLocalCharactersMap(map);

  if (localGetValue(LOCAL_KEYS.ACTIVE_ID, "") === characterId) {
    localSetValue(LOCAL_KEYS.ACTIVE_ID, "");
  }

  return { ok: true };
}

async function setActiveCharacterLocal(id) {
  const characterId = asString(id);
  if (!characterId) return { ok: false, errors: ["Character ID is required."] };
  localSetValue(LOCAL_KEYS.ACTIVE_ID, characterId);
  localSetValue(LOCAL_KEYS.LAST_OPENED, nowIso());
  return { ok: true };
}

async function getStorageHealthLocal() {
  const map = localCharactersMap();
  return {
    ok: true,
    db_name: `${DB_NAME}:localStorage`,
    db_version: DB_VERSION,
    character_count: Object.keys(map).length,
    active_character_id: localGetValue(LOCAL_KEYS.ACTIVE_ID, ""),
    last_opened_at: localGetValue(LOCAL_KEYS.LAST_OPENED, ""),
    storage_version: Number.parseInt(localGetValue(LOCAL_KEYS.STORAGE_VERSION, "0"), 10) || 0
  };
}

async function getAppValue(key, fallback = null) {
  if (localFallbackMode) return getAppValueLocal(key, fallback);
  const db = await openDb();
  if (!db) return getAppValueLocal(key, fallback);
  const tx = db.transaction(STORES.APP, "readonly");
  const store = tx.objectStore(STORES.APP);
  const row = await requestToPromise(store.get(key));
  await txDone(tx);
  return row?.value ?? fallback;
}

async function setAppValue(key, value) {
  if (localFallbackMode) return setAppValueLocal(key, value);
  const db = await openDb();
  if (!db) return setAppValueLocal(key, value);
  const tx = db.transaction(STORES.APP, "readwrite");
  const store = tx.objectStore(STORES.APP);
  store.put({ key, value });
  await txDone(tx);
}

function makeRecord(character, hash) {
  return {
    id: asString(character.meta.id),
    ruleset_id: asString(character.meta.ruleset_id),
    name: asString(character.meta.name),
    saved_utc: nowIso(),
    hash,
    character
  };
}

async function saveCharacter(character, { makeActive = true } = {}) {
  if (localFallbackMode) return saveCharacterLocal(character, { makeActive });
  const candidate = clone(character);
  const shape = validateCharacterEnvelopeShape(candidate);
  if (!shape.ok) {
    return {
      ok: false,
      errors: shape.errors
    };
  }

  candidate.meta.modified_utc = nowIso();
  const hash = await hashCharacterPayload(candidate);
  const record = makeRecord(candidate, hash);

  const db = await openDb();
  if (!db) return saveCharacterLocal(character, { makeActive });
  const tx = db.transaction([STORES.CHARACTERS, STORES.APP], "readwrite");
  tx.objectStore(STORES.CHARACTERS).put(record);
  tx.objectStore(STORES.APP).put({ key: APP_KEYS.LAST_OPENED_AT, value: nowIso() });
  if (makeActive) {
    tx.objectStore(STORES.APP).put({ key: APP_KEYS.ACTIVE_CHARACTER_ID, value: record.id });
  }
  await txDone(tx);

  return {
    ok: true,
    character: clone(candidate),
    record: {
      id: record.id,
      name: record.name,
      ruleset_id: record.ruleset_id,
      saved_utc: record.saved_utc
    }
  };
}

async function loadCharacterById(id) {
  if (localFallbackMode) return loadCharacterByIdLocal(id);
  const characterId = asString(id);
  if (!characterId) {
    return { ok: false, blocked: [{ code: "missing-id", message: "Character ID is required." }] };
  }

  const db = await openDb();
  if (!db) return loadCharacterByIdLocal(id);
  const tx = db.transaction(STORES.CHARACTERS, "readonly");
  const store = tx.objectStore(STORES.CHARACTERS);
  const row = await requestToPromise(store.get(characterId));
  await txDone(tx);

  if (!row) {
    return { ok: false, blocked: [{ code: "not-found", message: `Character '${characterId}' not found.` }] };
  }

  const shape = validateCharacterEnvelopeShape(row.character);
  if (!shape.ok) {
    return {
      ok: false,
      blocked: shape.errors.map((message) => ({ code: "invalid-shape", message }))
    };
  }

  const hashCheck = await verifyCharacterPayload(row.character, row.hash);
  if (!hashCheck.ok) {
    return {
      ok: false,
      blocked: [
        {
          code: "integrity-mismatch",
          message: "Stored character hash mismatch.",
          expected: hashCheck.expected,
          actual: hashCheck.actual
        }
      ],
      character: row.character
    };
  }

  return {
    ok: true,
    character: clone(row.character),
    info: {
      id: row.id,
      name: row.name,
      ruleset_id: row.ruleset_id,
      saved_utc: row.saved_utc
    }
  };
}

async function loadActiveCharacter() {
  if (localFallbackMode) return loadActiveCharacterLocal();
  const activeId = await getAppValue(APP_KEYS.ACTIVE_CHARACTER_ID, "");
  if (!activeId) return { ok: false, blocked: [{ code: "no-active-character", message: "No active character." }] };

  const loaded = await loadCharacterById(activeId);
  if (loaded.ok) await setAppValue(APP_KEYS.LAST_OPENED_AT, nowIso());
  return loaded;
}

async function listCharacters() {
  if (localFallbackMode) return listCharactersLocal();
  const db = await openDb();
  if (!db) return listCharactersLocal();
  const tx = db.transaction(STORES.CHARACTERS, "readonly");
  const store = tx.objectStore(STORES.CHARACTERS);
  const rows = await requestToPromise(store.getAll());
  await txDone(tx);

  return rows
    .map((row) => ({
      id: row.id,
      name: row.name,
      ruleset_id: row.ruleset_id,
      saved_utc: row.saved_utc
    }))
    .sort((a, b) => b.saved_utc.localeCompare(a.saved_utc));
}

async function deleteCharacter(id) {
  if (localFallbackMode) return deleteCharacterLocal(id);
  const characterId = asString(id);
  if (!characterId) return { ok: false, errors: ["Character ID is required."] };

  const currentActive = await getAppValue(APP_KEYS.ACTIVE_CHARACTER_ID, "");

  const db = await openDb();
  if (!db) return deleteCharacterLocal(id);
  const tx = db.transaction([STORES.CHARACTERS, STORES.APP], "readwrite");
  tx.objectStore(STORES.CHARACTERS).delete(characterId);
  if (currentActive === characterId) {
    tx.objectStore(STORES.APP).put({ key: APP_KEYS.ACTIVE_CHARACTER_ID, value: "" });
  }
  await txDone(tx);

  return { ok: true };
}

async function setActiveCharacter(id) {
  if (localFallbackMode) return setActiveCharacterLocal(id);
  const characterId = asString(id);
  if (!characterId) return { ok: false, errors: ["Character ID is required."] };
  await setAppValue(APP_KEYS.ACTIVE_CHARACTER_ID, characterId);
  await setAppValue(APP_KEYS.LAST_OPENED_AT, nowIso());
  return { ok: true };
}

async function getStorageHealth() {
  if (localFallbackMode) return getStorageHealthLocal();
  const db = await openDb();
  if (!db) return getStorageHealthLocal();
  const tx = db.transaction([STORES.CHARACTERS, STORES.APP], "readonly");
  const characters = tx.objectStore(STORES.CHARACTERS);
  const app = tx.objectStore(STORES.APP);

  const count = await requestToPromise(characters.count());
  const activeIdRow = await requestToPromise(app.get(APP_KEYS.ACTIVE_CHARACTER_ID));
  const lastOpenedRow = await requestToPromise(app.get(APP_KEYS.LAST_OPENED_AT));
  const storageVersionRow = await requestToPromise(app.get(APP_KEYS.STORAGE_VERSION));
  await txDone(tx);

  return {
    ok: true,
    db_name: DB_NAME,
    db_version: db.version,
    character_count: count,
    active_character_id: activeIdRow?.value || "",
    last_opened_at: lastOpenedRow?.value || "",
    storage_version: storageVersionRow?.value || 0
  };
}

export const V2Storage = {
  openDb,
  getAppValue,
  setAppValue,
  saveCharacter,
  loadCharacterById,
  loadActiveCharacter,
  listCharacters,
  deleteCharacter,
  setActiveCharacter,
  getStorageHealth
};
