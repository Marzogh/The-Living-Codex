

export function createDefaultCharacter({ name, rulesetId }) {
  const now = new Date().toISOString();

  return {
    meta: {
      schema: "dnd-character-pack",
      schema_version: "0.1.0",
      id: crypto.randomUUID(),
      name: name ?? "New Character",
      ruleset_id: rulesetId,
      created_utc: now,
      modified_utc: now
    },

    identity: {
      player_name: "",
      campaign: "",
      ancestry: "",
      background: "",
      alignment: "",
      classes: []
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
      speed: {
        walk: 30,
        fly: 0,
        swim: 0,
        climb: 0,
        burrow: 0,
        other: []
      },
      hp: {
        max: 1,
        current: 1,
        temp: 0
      },
      death_saves: {
        success: 0,
        fail: 0
      },
      conditions: [],
      passives: {
        perception: null,
        insight: null,
        investigation: null
      }
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
      gp: 0,
      pp: 0
    },

    proficiencies: {
      saving_throws: [],
      skills: [],
      tools: [],
      weapons: [],
      armour: [],
      languages: []
    },

    trackers: [],

    spellcasting: {
      enabled: false,
      ability: "",
      dc: null,
      attack_bonus: null,
      slots: {}
    },

    assets: {
      portrait: false
    },

    ui: {
      pinned_trackers: [],
      collapsed_sections: {}
    }
  };
}