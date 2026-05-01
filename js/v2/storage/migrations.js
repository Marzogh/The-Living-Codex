import { APP_KEYS, STORES } from "./constants.js";

/**
 * Run schema migrations for IndexedDB upgrades.
 * Each migration is idempotent for its target version.
 */
export function runMigrations(db, tx, oldVersion, newVersion) {
  for (let version = oldVersion + 1; version <= newVersion; version++) {
    if (version === 1) migrateToV1(db, tx);
    if (version === 2) migrateToV2(db, tx);
    if (version === 3) migrateToV3(db, tx);
  }
}

function migrateToV1(db, tx) {
  if (!db.objectStoreNames.contains(STORES.CHARACTERS)) {
    const characters = db.createObjectStore(STORES.CHARACTERS, { keyPath: "id" });
    characters.createIndex("by_modified", "saved_utc", { unique: false });
    characters.createIndex("by_ruleset", "ruleset_id", { unique: false });
  }

  if (!db.objectStoreNames.contains(STORES.APP)) {
    db.createObjectStore(STORES.APP, { keyPath: "key" });
  }

  const appStore = tx.objectStore(STORES.APP);
  appStore.put({ key: APP_KEYS.STORAGE_VERSION, value: 1 });
}

function migrateToV2(db, tx) {
  // Healing migration: ensure required stores/indexes exist even when a
  // previous version-1 database was created with a mismatched schema.
  if (!db.objectStoreNames.contains(STORES.CHARACTERS)) {
    const characters = db.createObjectStore(STORES.CHARACTERS, { keyPath: "id" });
    characters.createIndex("by_modified", "saved_utc", { unique: false });
    characters.createIndex("by_ruleset", "ruleset_id", { unique: false });
  } else {
    const characters = tx.objectStore(STORES.CHARACTERS);
    if (!characters.indexNames.contains("by_modified")) {
      characters.createIndex("by_modified", "saved_utc", { unique: false });
    }
    if (!characters.indexNames.contains("by_ruleset")) {
      characters.createIndex("by_ruleset", "ruleset_id", { unique: false });
    }
  }

  if (!db.objectStoreNames.contains(STORES.APP)) {
    db.createObjectStore(STORES.APP, { keyPath: "key" });
  }

  const appStore = tx.objectStore(STORES.APP);
  appStore.put({ key: APP_KEYS.STORAGE_VERSION, value: 2 });
}

function migrateToV3(db, tx) {
  // Force-heal migration for previously inconsistent local schemas.
  if (!db.objectStoreNames.contains(STORES.CHARACTERS)) {
    const characters = db.createObjectStore(STORES.CHARACTERS, { keyPath: "id" });
    characters.createIndex("by_modified", "saved_utc", { unique: false });
    characters.createIndex("by_ruleset", "ruleset_id", { unique: false });
  } else {
    const characters = tx.objectStore(STORES.CHARACTERS);
    if (!characters.indexNames.contains("by_modified")) {
      characters.createIndex("by_modified", "saved_utc", { unique: false });
    }
    if (!characters.indexNames.contains("by_ruleset")) {
      characters.createIndex("by_ruleset", "ruleset_id", { unique: false });
    }
  }

  if (!db.objectStoreNames.contains(STORES.APP)) {
    db.createObjectStore(STORES.APP, { keyPath: "key" });
  }

  const appStore = tx.objectStore(STORES.APP);
  appStore.put({ key: APP_KEYS.STORAGE_VERSION, value: 3 });
}
