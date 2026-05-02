import { createEventBus } from "./events.js";
import { createAppStore } from "./store.js";
import { ActionTypes } from "./reducer.js";
import { V2Storage } from "../storage/index.js";

function nowIso() {
  return new Date().toISOString();
}

export function createAppController({
  storage = V2Storage,
  historyLimit = 50
} = {}) {
  const events = createEventBus();
  const store = createAppStore({ historyLimit });

  store.subscribe((snapshot, action) => {
    events.emit("state:changed", { state: snapshot, action });
    if (action?.type === ActionTypes.SET_CHARACTER) {
      events.emit("character:changed", { character: snapshot.character, action });
    }
    if (snapshot.app.lastError) {
      events.emit("app:error", { error: snapshot.app.lastError, action });
    }
  });

  async function bootstrap() {
    store.dispatch({ type: ActionTypes.BOOTSTRAP_START });

    try {
      await storage.openDb();
      const loaded = await storage.loadActiveCharacter();
      if (loaded.ok) {
        store.setCharacter(loaded.character, { dirty: false, lastSavedUtc: loaded.info?.saved_utc || nowIso() });
        store.dispatch({ type: ActionTypes.SET_ACTIVE_CHARACTER_ID, id: loaded.character?.meta?.id || "" });
      }
      store.dispatch({ type: ActionTypes.BOOTSTRAP_READY });
      return { ok: true, loaded: loaded.ok };
    } catch (err) {
      const message = err?.message || String(err);
      store.dispatch({ type: ActionTypes.SET_ERROR, error: message });
      store.dispatch({ type: ActionTypes.BOOTSTRAP_READY });
      return { ok: false, error: message };
    }
  }

  async function saveActiveCharacter({ makeActive = true } = {}) {
    const state = store.getState();
    const character = state.character;
    if (!character) return { ok: false, errors: ["No active character to save."] };

    const result = await storage.saveCharacter(character, { makeActive });
    if (!result.ok) {
      store.dispatch({ type: ActionTypes.SET_ERROR, error: (result.errors || []).join(" ") || "Save failed." });
      return result;
    }

    const persistedCharacter = result.character || character;
    store.dispatch({ type: ActionTypes.CLEAR_ERROR });
    store.dispatch({ type: ActionTypes.SET_DIRTY, dirty: false });
    store.dispatch({
      type: ActionTypes.SET_CHARACTER,
      character: persistedCharacter,
      dirty: false,
      lastSavedUtc: result?.record?.saved_utc || nowIso()
    });
    if (makeActive) {
      store.dispatch({ type: ActionTypes.SET_ACTIVE_CHARACTER_ID, id: persistedCharacter.meta?.id || "" });
    }

    return result;
  }

  async function loadCharacterById(id) {
    const loaded = await storage.loadCharacterById(id);
    if (!loaded.ok) {
      store.dispatch({
        type: ActionTypes.SET_ERROR,
        error: loaded.blocked?.map((b) => b.message).join(" ") || "Load failed."
      });
      return loaded;
    }

    store.clearHistory();
    store.setCharacter(loaded.character, { dirty: false, lastSavedUtc: loaded.info?.saved_utc || nowIso() });
    store.dispatch({ type: ActionTypes.SET_ACTIVE_CHARACTER_ID, id: loaded.info?.id || "" });
    await storage.setActiveCharacter(loaded.info?.id || "");
    return loaded;
  }

  function applyImportedCharacter(result) {
    if (!result || typeof result !== "object") {
      return { ok: false, errors: ["Import result is invalid."] };
    }

    store.dispatch({ type: ActionTypes.SET_IMPORT_REPORT, report: result.report || null });

    if (!result.ok || !result.character) {
      const message =
        result?.report?.blocked?.map((x) => x.message).join(" ") ||
        "Import blocked due to validation errors.";
      store.dispatch({ type: ActionTypes.SET_ERROR, error: message });
      return { ok: false, blocked: result?.report?.blocked || [] };
    }

    store.clearHistory();
    store.setCharacter(result.character, { dirty: true });
    store.dispatch({ type: ActionTypes.CLEAR_ERROR });
    return { ok: true };
  }

  async function createNewCharacter(character) {
    store.clearHistory();
    store.setCharacter(character, { dirty: true });
    return { ok: true };
  }

  return {
    store,
    events,
    bootstrap,
    saveActiveCharacter,
    loadCharacterById,
    createNewCharacter,
    applyImportedCharacter
  };
}
