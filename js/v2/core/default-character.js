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
      speed: 30,
      inspiration: 0,
      proficiency_bonus: 2,
      passive_perception: 10,
      hit_dice_total: 0,
      hit_dice_used: 0,
      concentration: { active: false, source: "", notes: "" },
      conditions: [],
      death_saves: { success: 0, fail: 0 },
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
    profile: {
      background: "",
      alignment: "",
      player_name: "",
      experience_points: 0,
      age: "",
      height: "",
      weight: "",
      eyes: "",
      skin: "",
      hair: "",
      personality_traits: "",
      ideals: "",
      bonds: "",
      flaws: "",
      other_proficiencies_languages: "",
      features_traits: "",
      backstory: "",
      allies_organizations: "",
      additional_features: "",
      treasure: ""
    },
    resources: {
      cp: 0, sp: 0, ep: 0, gp: 0, pp: 0
    },
    saving_throws: {
      str: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 },
      dex: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 },
      con: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 },
      int: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 },
      wis: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 },
      cha: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 }
    },
    skills: {},
    attacks: [],
    features: [],
    companions: [],
    play_state: {
      active_effects: [],
      recent_actions: [],
      session_notes: "",
      dice_last_roll: null,
      last_check_roll: null,
      last_attack_roll: null,
      last_attack_damage_roll: null
    },
    spellcasting: {
      class_id: classId || "",
      ability: "",
      save_dc_mode: "auto",
      save_dc_override: 0,
      attack_bonus_mode: "auto",
      attack_bonus_override: 0
    },
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
