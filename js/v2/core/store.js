import { appReducer, ActionTypes, initialState } from "./reducer.js";

function clone(value) {
  return structuredClone(value);
}

function nowIso() {
  return new Date().toISOString();
}

function withModifiedUtc(character) {
  if (!character || typeof character !== "object") return character;
  const out = clone(character);
  out.meta = out.meta || {};
  out.meta.modified_utc = nowIso();
  return out;
}

export function createAppStore({ historyLimit = 50 } = {}) {
  let state = initialState();
  const subscribers = new Set();
  const history = {
    past: [],
    future: [],
    limit: Math.max(1, historyLimit)
  };

  function notify(action) {
    const snapshot = clone(state);
    for (const fn of subscribers) fn(snapshot, action);
  }

  function commit(nextState, action) {
    state = nextState;
    notify(action);
    return clone(state);
  }

  function getState() {
    return clone(state);
  }

  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }

  function dispatch(action) {
    const prev = state;
    const next = appReducer(prev, action);
    if (next === prev) return getState();
    return commit(next, action);
  }

  function pushHistory(characterBefore) {
    if (!characterBefore) return;
    history.past.push(clone(characterBefore));
    if (history.past.length > history.limit) history.past.shift();
    history.future = [];
  }

  function setCharacter(character, { dirty = false, pushUndo = false, lastSavedUtc = "" } = {}) {
    const prevCharacter = state.character;
    if (pushUndo && prevCharacter) pushHistory(prevCharacter);
    const nextCharacter = withModifiedUtc(character);
    return dispatch({
      type: ActionTypes.SET_CHARACTER,
      character: nextCharacter,
      dirty,
      lastSavedUtc
    });
  }

  function updateCharacter(mutator, { label = "character.update" } = {}) {
    if (!state.character) return getState();
    const before = clone(state.character);
    const after = clone(state.character);
    mutator(after);
    pushHistory(before);
    return setCharacter(after, { dirty: true, pushUndo: false, lastSavedUtc: "" , label});
  }

  function canUndo() {
    return history.past.length > 0;
  }

  function canRedo() {
    return history.future.length > 0;
  }

  function undo() {
    if (!canUndo()) return getState();
    const previous = history.past.pop();
    if (state.character) history.future.push(clone(state.character));
    return setCharacter(previous, { dirty: true, pushUndo: false });
  }

  function redo() {
    if (!canRedo()) return getState();
    const next = history.future.pop();
    if (state.character) history.past.push(clone(state.character));
    return setCharacter(next, { dirty: true, pushUndo: false });
  }

  function clearHistory() {
    history.past = [];
    history.future = [];
  }

  return {
    getState,
    subscribe,
    dispatch,
    setCharacter,
    updateCharacter,
    canUndo,
    canRedo,
    undo,
    redo,
    clearHistory,
    actionTypes: ActionTypes
  };
}
