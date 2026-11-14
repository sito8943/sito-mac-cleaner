# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.3.0] - 2026-11-14

### Added

- node_modules section: one item per `node_modules` under `~/Documents`
  (`--projects DIR` to change the folder). (14bae7c)
- Tauri / Rust builds section: one item per `target/` next to a `Cargo.toml`.
  (14bae7c)
- Trash section: empties `~/.Trash` through Finder. Its size is unknown unless
  the app has Full Disk Access. (14bae7c)

### Fixed

- `disk-clean` printed full paths instead of `~/…` when run with bash 5.
  (f8b9626)

## [0.2.0] - 2026-11-09

### Added

- Clean / Items / Output tabs in the window.
- The clean button escalates with the meter: `CLEAN!` in yellow from 10 GB,
  red `CLEAN!!!` from 30 GB, plus an alert banner with animated 🚨 sirens.
- While cleaning, the hint shows the step `disk-clean` is on and links to the
  Output tab.
- `disk-clean --list` adds a note field; paths that contain a `.app` are
  flagged (`app-bundle`) and shown with an info icon and tooltip.

### Fixed

- A cleanup could hang forever: `disk-clean`'s stderr was never read, so a
  noisy `rm` filled the pipe and blocked. stderr is now drained and shown in
  the output.
- Caches holding a `.app` (e.g. `~/Library/Caches/dotslash`) are skipped with a
  warning instead of waiting on macOS's App Management permission.

## [0.1.0] - 2026-11-09

### Added

- `disk-clean` CLI with `--list` (TSV plan) and `--only ID,...` (clean only the
  given items), on top of the existing `--dry-run`, `--keep-days` and
  `--session-days`. Runs under `/bin/bash` 3.2 and macOS's bare GUI `PATH`.
- Menu bar app (Tauri 2 + React + @sito/ui) that analyzes the disk with
  `disk-clean --list`, lists every cleanable item with a checkbox (all ticked
  by default) and cleans only the ticked ones.
- LED meter around a doomsday button with a safety cover: green under 10 GB,
  yellow from 10 GB, red from 30 GB of ticked space.
- Live `disk-clean` output while cleaning, and the space freed afterwards.
- Menu bar icon showing reclaimable GB, global ⌃⌥C shortcut and app reopen
  to show the window.
- English and Spanish UI for the window and tray menu.
- macOS DMG builds and Homebrew cask publishing workflows.

[0.2.0]: https://github.com/sito8943/sito-mac-cleaner/releases/tag/v0.2.0
[0.1.0]: https://github.com/sito8943/sito-mac-cleaner/releases/tag/v0.1.0
