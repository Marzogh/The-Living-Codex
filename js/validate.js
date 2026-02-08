

/**
 * Minimal validation helpers for D&D Character Pack (v1)
 * 
 * Purpose:
 * - Catch obviously invalid or corrupt imports early
 * - Avoid full JSON Schema validation in v1
 * - Provide clear, actionable error messages
 */

/**
 * Validate the basic structure of a character object.
 *
 * @param {any} character
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
function validateCharacter(character) {
  if (!character || typeof character !== "object") {
    return { ok: false, error: "Character data is not an object." };
  }

  if (!character.meta || typeof character.meta !== "object") {
    return { ok: false, error: "Missing meta section." };
  }

  if (character.meta.schema !== "dnd-character-pack") {
    return { ok: false, error: "Invalid or missing schema identifier." };
  }

  if (!character.meta.schema_version) {
    return { ok: false, error: "Missing schema_version." };
  }

  if (!character.meta.name) {
    return { ok: false, error: "Character name is missing." };
  }

  if (!character.meta.ruleset_id) {
    return { ok: false, error: "ruleset_id is missing." };
  }

  if (!character.identity || !Array.isArray(character.identity.classes)) {
    return { ok: false, error: "Identity/classes section is missing or invalid." };
  }

  if (!character.abilities) {
    return { ok: false, error: "Abilities section is missing." };
  }

  if (!character.combat) {
    return { ok: false, error: "Combat section is missing." };
  }

  if (!character.currency) {
    return { ok: false, error: "Currency section is missing." };
  }

  return { ok: true };
}

/**
 * Assert-style wrapper.
 * Throws if validation fails.
 *
 * @param {any} character
 */
function assertValidCharacter(character) {
  const result = validateCharacter(character);
  if (!result.ok) {
    throw new Error(`Invalid character pack: ${result.error}`);
  }
}

export const Validator = {
  validateCharacter,
  assertValidCharacter
};