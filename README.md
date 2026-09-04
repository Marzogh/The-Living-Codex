# The Living Codex

![Version](https://img.shields.io/badge/version-v2.0-2c5f52?style=flat-square) · ![Status](https://img.shields.io/badge/status-stable-2f6f49?style=flat-square) · ![Local First](https://img.shields.io/badge/local--first-yes-6d5a41?style=flat-square) · ![Ruleset](https://img.shields.io/badge/D%26D-5e%20(2014)-8b3a2f?style=flat-square) · ![GitHub Release](https://img.shields.io/github/v/release/Marzogh/The-Living-Codex?display_name=tag&style=flat-square) · ![Last Commit](https://img.shields.io/github/last-commit/Marzogh/The-Living-Codex?style=flat-square) · ![Open Issues](https://img.shields.io/github/issues/Marzogh/The-Living-Codex?style=flat-square) · ![Open PRs](https://img.shields.io/github/issues-pr/Marzogh/The-Living-Codex?style=flat-square) · ![License](https://img.shields.io/badge/license-MIT-2c5f52?style=flat-square)

The Living Codex is a local-first tabletop character companion designed for real play at the table, not just data entry. v2 is now the active release line, and legacy v1 has been archived under `archive/v1/`.

## Quick Start

Run a local server from the project root:

```bash
cd The-Living-Codex
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

That root entry is the canonical v2 experience. If you open the app directly via `file://`, browser module restrictions can prevent loading, so always use local HTTP.

## What You Get in v2

v2 gives you a fast Play Mode and a full Edit Mode, with local save/import/export flows, subclass and spell lookup, multiclass-aware visuals, and species/class identity elements (including default portraits and class badges). It runs fully local-first, with no backend and no cloud dependency.

## Typical Flow

Create or import a character, refine identity and mechanics in Edit Mode, then switch to Play Mode for turn-by-turn decisions, tracking, and logging. When you want a backup or to move devices, export a ZIP character pack.

## Project Layout

The main implementation lives in `js/v2/` with styling in `css/v2.css`, while 2014 rules data is in `data/dnd5e_2014/`. Legacy code remains available in `archive/v1/` for reference only.

## Troubleshooting

If the app fails to load, confirm you are opening `http://localhost:8000/` and not a file URL. If import/export behaves unexpectedly, verify vendor scripts are present in `vendor/`. If the UI looks stale after updates, do a hard refresh to clear cached assets.

## Contributing

Contributions are welcome through issues and pull requests. The most useful bug reports include reproduction steps, expected vs actual behavior, and any console errors.

## Legal, Copyright, and Trademarks

This repository contains original software, UI, and project-authored content owned by this project and its contributors.

Dungeons & Dragons, Wizards of the Coast, and related names or marks are trademarks and/or copyrighted property of their respective owners. The Living Codex does **not** claim ownership of third-party intellectual property.

No warranty. Use at your own risk; you’re responsible for outcomes and any errors.

## License

This project is licensed under the **MIT License**. See [`LICENSE`](LICENSE).

The MIT license applies to original code and project-authored content in this repository. It does **not** grant rights to third-party IP, trademarks, or copyrighted material.
