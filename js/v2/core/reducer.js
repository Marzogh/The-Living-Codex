export const ActionTypes = {
  BOOTSTRAP_START: "BOOTSTRAP_START",
  BOOTSTRAP_READY: "BOOTSTRAP_READY",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_CHARACTER: "SET_CHARACTER",
  SET_IMPORT_REPORT: "SET_IMPORT_REPORT",
  SET_DIRTY: "SET_DIRTY",
  SET_ACTIVE_CHARACTER_ID: "SET_ACTIVE_CHARACTER_ID"
};

export function initialState() {
  return {
    app: {
      ready: false,
      bootstrapping: false,
      activeCharacterId: "",
      dirty: false,
      lastError: null,
      lastSavedUtc: ""
    },
    character: null,
    importReport: null
  };
}

export function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.BOOTSTRAP_START:
      return {
        ...state,
        app: { ...state.app, bootstrapping: true, lastError: null }
      };

    case ActionTypes.BOOTSTRAP_READY:
      return {
        ...state,
        app: { ...state.app, bootstrapping: false, ready: true, lastError: null }
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        app: { ...state.app, lastError: action.error || "Unknown error" }
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        app: { ...state.app, lastError: null }
      };

    case ActionTypes.SET_CHARACTER:
      return {
        ...state,
        character: action.character || null,
        app: {
          ...state.app,
          activeCharacterId: action.character?.meta?.id || state.app.activeCharacterId || "",
          dirty: Boolean(action.dirty),
          lastSavedUtc: action.lastSavedUtc || state.app.lastSavedUtc || ""
        }
      };

    case ActionTypes.SET_IMPORT_REPORT:
      return {
        ...state,
        importReport: action.report || null
      };

    case ActionTypes.SET_DIRTY:
      return {
        ...state,
        app: { ...state.app, dirty: Boolean(action.dirty) }
      };

    case ActionTypes.SET_ACTIVE_CHARACTER_ID:
      return {
        ...state,
        app: { ...state.app, activeCharacterId: action.id || "" }
      };

    default:
      return state;
  }
}
