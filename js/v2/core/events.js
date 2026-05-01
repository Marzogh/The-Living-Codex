export function createEventBus() {
  const handlers = new Map();

  function on(eventName, fn) {
    if (!handlers.has(eventName)) handlers.set(eventName, new Set());
    handlers.get(eventName).add(fn);
    return () => off(eventName, fn);
  }

  function off(eventName, fn) {
    const set = handlers.get(eventName);
    if (!set) return;
    set.delete(fn);
    if (set.size === 0) handlers.delete(eventName);
  }

  function emit(eventName, payload) {
    const set = handlers.get(eventName);
    if (!set) return;
    for (const fn of set) {
      try {
        fn(payload);
      } catch (err) {
        // Keep bus resilient; listener failures should not break dispatch.
        console.error("Event bus listener failed:", { eventName, err });
      }
    }
  }

  return { on, off, emit };
}
