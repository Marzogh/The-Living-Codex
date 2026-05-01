function isPlainObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function stableSortValue(value) {
  if (Array.isArray(value)) return value.map(stableSortValue);
  if (!isPlainObject(value)) return value;

  const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
  const out = {};
  for (const key of keys) {
    out[key] = stableSortValue(value[key]);
  }
  return out;
}

export function stableStringify(value) {
  return JSON.stringify(stableSortValue(value));
}

function fallbackHash(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
  }
  return `fnv32-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function bytesToHex(buf) {
  const view = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < view.length; i++) out += view[i].toString(16).padStart(2, "0");
  return out;
}

/**
 * Hash payload for integrity checks.
 * Uses SHA-256 when available, falls back to deterministic hash.
 */
export async function hashCharacterPayload(character) {
  const text = stableStringify(character);

  if (
    typeof crypto !== "undefined" &&
    crypto.subtle &&
    typeof TextEncoder !== "undefined"
  ) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return `sha256-${bytesToHex(digest)}`;
  }

  return fallbackHash(text);
}

export async function verifyCharacterPayload(character, expectedHash) {
  const actual = await hashCharacterPayload(character);
  return {
    ok: actual === expectedHash,
    actual,
    expected: expectedHash || ""
  };
}
