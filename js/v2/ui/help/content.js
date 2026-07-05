export const HELP_SHORTCUTS = [
  {
    id: "palette",
    keys: "Cmd/Ctrl + K",
    detail: "Open the command palette from almost anywhere in the app."
  },
  {
    id: "save",
    keys: "Cmd/Ctrl + S",
    detail: "Save the active character immediately."
  },
  {
    id: "jump",
    keys: "Cmd/Ctrl + 1-6",
    detail: "Jump between major Edit Mode sections."
  },
  {
    id: "escape",
    keys: "Esc",
    detail: "Close overlays like Help, Diagnostics, the Dice Tray, and Lookups."
  }
];

export const HELP_GLOSSARY = {
  ruleset: {
    id: "ruleset",
    title: "Ruleset",
    body: "The version of D&D rules your character follows, such as 2014 or 2024."
  },
  species: {
    id: "species",
    title: "Species",
    body: "Your character's people or ancestry. Species affects identity, flavor, and sometimes mechanics."
  },
  class_subclass: {
    id: "class_subclass",
    title: "Class and Subclass",
    body: "Your class is your main adventuring role, like Wizard or Fighter. A subclass is your specialization inside that class."
  },
  known_prepared_spells: {
    id: "known_prepared_spells",
    title: "Known vs Prepared Spells",
    body: "Known spells are spells your character has learned. Prepared spells are the spells currently ready to use today. Some classes use one list more than the other."
  },
  trackers: {
    id: "trackers",
    title: "Trackers",
    body: "Trackers are counters for things you want to watch during play, such as arrows, rage uses, ki points, or custom reminders."
  },
  concentration: {
    id: "concentration",
    title: "Concentration",
    body: "Some spells require your focus to stay active. If you lose concentration, that spell ends."
  },
  conditions: {
    id: "conditions",
    title: "Conditions",
    body: "Conditions are temporary states like Poisoned, Restrained, or Invisible that change how your character acts."
  },
  rests: {
    id: "rests",
    title: "Short Rest and Long Rest",
    body: "A short rest restores some class features for some characters. A long rest usually resets more resources, spell slots, and daily abilities."
  }
};

export const HELP_SECTIONS = [
  {
    id: "help-start",
    title: "Start Here",
    navLabel: "Start Here",
    summary: "Choose the fastest next step for a brand-new or returning player.",
    audience: "beginner",
    featureIds: ["create.panel", "import.flow"],
    related: ["help-create", "help-data", "help-terms"],
    blocks: [
      {
        type: "paragraph",
        text: "If this is your first visit, make a new character. If you already have one saved, import its ZIP pack and keep going from there."
      },
      {
        type: "action_reference",
        title: "Most common first steps",
        actions: [
          { actionId: "openCreateCharacter", label: "Create Character", detail: "Open the new-character flow." },
          { actionId: "runImportZip", label: "Import ZIP", detail: "Bring in a character you exported earlier." }
        ]
      },
      {
        type: "callout",
        tone: "note",
        text: "Your character lives in this browser until you export it. If a character matters to you, make ZIP backups regularly."
      },
      {
        type: "bullets",
        title: "A good first session with the app usually looks like this",
        items: [
          "Create or import a character.",
          "Fill in the important identity and combat fields in Edit Mode.",
          "Check your spells, attacks, inventory, and trackers.",
          "Switch to Play Mode at the table when you want a faster action-focused view."
        ]
      }
    ]
  },
  {
    id: "help-create",
    title: "Create or Import a Character",
    navLabel: "Create or Import",
    summary: "Learn the difference between starting fresh and bringing in a saved adventurer.",
    audience: "beginner",
    featureIds: ["create.panel", "import.flow"],
    related: ["help-edit", "help-data", "help-terms"],
    blocks: [
      {
        type: "steps",
        title: "Creating a new character",
        items: [
          "Use New Character or the large Create Character panel.",
          "Pick a ruleset first so the app knows which player options to show.",
          "Choose a class and species if you want the portrait and class badge preview.",
          "Enter starting ability scores, then create the character and continue into Edit Mode."
        ]
      },
      {
        type: "steps",
        title: "Importing an existing character",
        items: [
          "Choose Import and select a ZIP character pack.",
          "The app loads character.json first, then applies any inventory, spell, or log CSV overrides inside the pack.",
          "If the import needs fixes or has blocked problems, check Diagnostics for the report."
        ]
      },
      {
        type: "callout",
        tone: "tip",
        text: "If you move between devices, ZIP export and ZIP import are the safest way to keep the same character with you."
      }
    ]
  },
  {
    id: "help-edit",
    title: "Edit Mode",
    navLabel: "Edit Mode",
    summary: "Use Edit Mode to build the full character sheet and keep the details accurate between sessions.",
    audience: "beginner",
    featureIds: ["edit.tab.core", "edit.tab.battle", "edit.tab.spellcraft", "edit.tab.gear", "edit.tab.chronicle"],
    related: ["help-lookups", "help-play", "help-terms"],
    blocks: [
      {
        type: "paragraph",
        text: "Edit Mode is your workshop. This is where you record identity, stats, combat values, spells, inventory, attacks, story details, and anything you want ready before play begins."
      },
      {
        type: "bullets",
        title: "What each major area is for",
        items: [
          "Core: name, ruleset, species, and ability scores.",
          "Classes: class levels, multiclassing, and subclass choices.",
          "Battle: armor class, hit points, speed, initiative, saves, skills, and attacks.",
          "Spellcraft: spellcasting setup plus known and prepared spells.",
          "Gear: inventory, custom trackers, and log support.",
          "Chronicle: portrait, backstory, personality, player details, and treasure."
        ]
      },
      {
        type: "action_reference",
        title: "Useful jumps",
        actions: [
          { actionId: "switchToEditMode", label: "Switch to Edit Mode", detail: "Return to editing if you are currently in Play Mode." },
          { actionId: "openSpellLookup", label: "Open Spell Lookup", detail: "Search official spell data and add it directly." },
          { actionId: "openClassLookup", label: "Open Class Lookup", detail: "Search classes and subclasses from the built-in rules data." }
        ]
      }
    ]
  },
  {
    id: "help-lookups",
    title: "Rules Lookups",
    navLabel: "Rules Lookups",
    summary: "Use lookups to pull official game data into the character instead of typing it all by hand.",
    audience: "beginner",
    featureIds: ["lookup.class", "lookup.subclass", "lookup.species", "lookup.spell", "lookup.attack"],
    related: ["help-edit", "help-terms"],
    blocks: [
      {
        type: "paragraph",
        text: "Lookups search the built-in rules data for classes, subclasses, species, spells, and attacks. They help you add consistent records faster and reduce manual typing errors."
      },
      {
        type: "bullets",
        title: "What the lookups help with",
        items: [
          "Species lookup updates the species on the character.",
          "Class and subclass lookup fills in class rows more safely.",
          "Spell lookup can add names, levels, schools, concentration flags, durations, and other spell details.",
          "Attack lookup can pull in weapon or attack templates to use as a starting point."
        ]
      },
      {
        type: "callout",
        tone: "note",
        text: "The player-options toggle at the top of the app controls whether lookups show all official player options or only the core ones."
      },
      {
        type: "action_reference",
        title: "Open a lookup now",
        actions: [
          { actionId: "openSpeciesLookup", label: "Species Lookup", detail: "Pick a species from the rules data." },
          { actionId: "openClassLookup", label: "Class Lookup", detail: "Search classes and subclasses." },
          { actionId: "openSpellLookup", label: "Spell Lookup", detail: "Search and add spells." }
        ]
      }
    ]
  },
  {
    id: "help-play",
    title: "Play Mode",
    navLabel: "Play Mode",
    summary: "Use Play Mode at the table when you want fast access to actions, resources, logs, and combat tracking.",
    audience: "beginner",
    featureIds: ["play.mode", "play.pane.spells", "play.pane.attacks", "play.pane.trackers", "play.pane.log", "play.pane.notes"],
    related: ["help-edit", "help-data", "help-terms"],
    blocks: [
      {
        type: "paragraph",
        text: "Play Mode turns the character into an at-table dashboard. It favors speed and visibility over full sheet editing."
      },
      {
        type: "bullets",
        title: "What Play Mode gives you",
        items: [
          "A Combat HUD for AC, initiative, speed, hit points, proficiency, passive perception, and inspiration.",
          "Spell, attack, tracker, log, and notes panes for the things you reach for most often during play.",
          "Round-based condition and concentration tracking.",
          "Quick actions like rests, dice rolls, and initiative rolls."
        ]
      },
      {
        type: "callout",
        tone: "tip",
        text: "If your character has a prepared-spell list, Play Mode prefers that list. If not, it falls back to known spells."
      },
      {
        type: "action_reference",
        title: "Go there now",
        actions: [
          { actionId: "switchToPlayMode", label: "Switch to Play Mode", detail: "Open the faster at-table view." },
          { actionId: "focusPlaySpells", label: "Open Spell Pane", detail: "Jump straight to the spell console." },
          { actionId: "focusPlayAttacks", label: "Open Attack Pane", detail: "Jump straight to attacks." }
        ]
      }
    ]
  },
  {
    id: "help-data",
    title: "Save, Export, and Move Between Devices",
    navLabel: "Saving & Export",
    summary: "Understand what is saved automatically, what stays in this browser, and when to export a ZIP.",
    audience: "beginner",
    featureIds: ["save.export", "import.flow"],
    related: ["help-start", "help-troubleshooting"],
    blocks: [
      {
        type: "paragraph",
        text: "The app autosaves locally, but local browser storage is not the same as a portable backup. If you want to move a character or protect it against browser or device changes, export a ZIP pack."
      },
      {
        type: "bullets",
        title: "What each action is for",
        items: [
          "Save: writes the latest character state right away.",
          "Export ZIP: creates a portable character pack you can import elsewhere.",
          "Export PDF: creates a printable or shareable reading version.",
          "Import: restores a ZIP pack into the app."
        ]
      },
      {
        type: "callout",
        tone: "warning",
        text: "If a character matters to you, export a ZIP before big edits, before changing devices, and before clearing browser data."
      },
      {
        type: "action_reference",
        title: "Backup actions",
        actions: [
          { actionId: "saveNow", label: "Save Now", detail: "Force an immediate save." },
          { actionId: "runExportZip", label: "Export ZIP", detail: "Create a backup you can move or re-import." },
          { actionId: "runImportZip", label: "Import ZIP", detail: "Restore a saved character pack." }
        ]
      }
    ]
  },
  {
    id: "help-terms",
    title: "Common Terms",
    navLabel: "Key Terms",
    summary: "Quick explanations for the game and app terms most likely to confuse a new player.",
    audience: "beginner",
    featureIds: ["glossary"],
    related: ["help-create", "help-edit", "help-play"],
    blocks: [
      {
        type: "term_definition",
        title: "Quick glossary",
        termIds: [
          "ruleset",
          "species",
          "class_subclass",
          "known_prepared_spells",
          "trackers",
          "concentration",
          "conditions",
          "rests"
        ]
      }
    ]
  },
  {
    id: "help-troubleshooting",
    title: "Troubleshooting",
    navLabel: "Troubleshooting",
    summary: "Use this section when something feels wrong, missing, or out of date.",
    audience: "beginner",
    featureIds: ["diagnostics.drawer"],
    related: ["help-data", "help-lookups"],
    blocks: [
      {
        type: "troubleshooting_case",
        title: "Common problems",
        cases: [
          {
            issue: "The app looks stale or out of date.",
            fix: "Refresh the page so your browser picks up the newest files."
          },
          {
            issue: "An import did not behave the way you expected.",
            fix: "Open Diagnostics and review the import report for warnings, fixes, and blocked issues."
          },
          {
            issue: "You are worried about losing a character.",
            fix: "Export a ZIP before large edits and keep that backup somewhere safe."
          },
          {
            issue: "You are running the project from GitHub yourself.",
            fix: "Use a local web server and open the app over HTTP instead of opening files directly."
          }
        ]
      },
      {
        type: "action_reference",
        title: "Helpful tools",
        actions: [
          { actionId: "openDiagnostics", label: "Open Diagnostics", detail: "Review runtime and import issues." },
          { actionId: "runExportZip", label: "Export ZIP", detail: "Make a safety backup before more changes." }
        ]
      }
    ]
  }
];
