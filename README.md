# The Living Codex (Beta)

The Living Codex is a locally hosted, browser-based character sheet system for  
tabletop role-playing games.

It is designed to be:
- Rules-aware but player-controlled
- Multiclass-safe
- Data-driven (CSV / JSON → UI)
- Offline-friendly
- Transparent and hackable

This project is currently in beta. Expect iteration.

---

## Beta Status

This is a functional beta:
- Core systems work end-to-end
- Rules logic is implemented
- UI and data formats may still evolve

There is no backend server and no cloud storage.  
Everything runs locally in your browser.

---

## What This Is (and Isn’t)

### What it is
- A responsive character sheet
- Automatic spell slot calculation
- Multiclass and subclass aware
- Prepared and known spell tracking
- Designed for self-hosting and tinkering

### What it is not
- A game engine
- A rules adjudicator
- A hosted web service
- Locked to any single tabletop system

---

## Running Locally (Required)

Because this project uses ES modules and dynamic imports,  
you must run it via a local web server.  
Opening `index.html` directly from disk will not work.

---

### Option A: Python (Recommended)

If you have Python 3 installed:

```bash
cd The-Living-Codex
python3 -m http.server 8000
```

Then open your browser at:
```
http://localhost:8000
```
---
### Using The Living Codex

Creating a Character
	•	Click “New Character”
	•	Choose:
	•	Species
	•	Class
	•	Level
	•	Ability scores
	•	Proficiencies and derived stats are calculated automatically

---

### Classes, Multiclassing, and Subclasses
	•	Multiple classes are supported
	•	Subclasses unlock at the correct class level
	•	Spellcasting progression respects:
	•	Full, half, and third casters
	•	Pact magic
	•	Subclass-gated casting

---

### Spells
	•	Spells are selected from a searchable rules database
	•	Known and prepared spells are tracked separately
	•	Prepared limits are enforced per class
	•	Cantrips are handled independently
	•	Spell slots auto-calculate from class levels

Manual overrides are always available.

---

### Proficiencies
	•	Displayed as readable pills
	•	Editable via an overlay
	•	Supports:
	•	Saving throws
	•	Skills
	•	Tools
	•	Weapons
	•	Armour
	•	Languages

---

## Data and Rules Architecture

The Living Codex uses a layered architecture:

```
CSV / JSON (data)
      ↓
RulesDB (indexed runtime rules)
      ↓
Character State
      ↓
Derived Calculations
      ↓
      UI
```

This makes it easy to:
	•	Add new systems
	•	Extend rules
	•	Audit calculations
	•	Replace datasets

---

### Repository Structure (High Level)

```
/data/
  /dnd5e_2014/
    classes.json
    subclasses.json
    species.json
    spells.min.json
    cantrips.json

/js/
  app.js
  /ui/
    editor.js
    spells.js
    derived.js

/tools/
  normalize_spells.py
  build_rulesdb.mjs
```

---

### Known Limitations (Beta)
	•	No persistence beyond the current session
	•	No character export yet
	•	Inventory automation incomplete
	•	Subclass spell restrictions not yet enforced (hooks exist)

---

## License and Attribution

This project does not reproduce proprietary rule text.
All trademarks referred to belong to their respective owners.
