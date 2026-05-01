function nowIso() {
  return new Date().toISOString();
}

export function createDefaultCharacterV2({
  name = "New Character",
  rulesetId = "dnd5e_2014",
  classId = "",
  speciesId = ""
} = {}) {
  const now = nowIso();
  const id = crypto.randomUUID();

  return {
    meta: {
      schema: "living-codex-character",
      schema_version: "2.0.0",
      id,
      name,
      ruleset_id: rulesetId,
      created_utc: now,
      modified_utc: now
    },
    core: {
      rulesetId,
      speciesId,
      classes: classId ? [{ id: classId, level: 1, isPrimary: true, subclassId: "" }] : []
    },
    abilities: {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10
    },
    combat: {
      ac: 10,
      initiative_bonus: 0,
      hp: {
        max: 1,
        current: 1,
        temp: 0
      }
    },
    identity: {
      player_name: "",
      campaign: "",
      ancestry: "",
      background: "",
      alignment: "",
      classes: []
    },
    defenses: {
      immunities: [],
      resistances: [],
      vulnerabilities: [],
      save_advantages: []
    },
    currency: {
      cp: 0,
      sp: 0,
      ep: 0,
      gp: 0,
      pp: 0
    },
    proficiencies: {
      skills: [],
      saves: [],
      tools: [],
      languages: [],
      armor: [],
      weapons: []
    },
    expertise: {
      skills: []
    },
    trackers: [],
    inventory: [],
    spells_known: [],
    spells_prepared: [],
    spell_slots: {
      auto: true,
      pact: { max: 0, used: 0, level: 1 },
      levels: {}
    },
    log: [],
    ui: {}
  };
}
