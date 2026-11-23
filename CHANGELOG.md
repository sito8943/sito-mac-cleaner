# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.6.0] - 2026-11-23

### Added

- Reports space that only a restart frees: swap files, `/private/tmp` and
  `$TMPDIR` show up in a new info-only Items section, and the Main tab warns
  when they add up to 1 GB or more. (fa36a56)

## [0.5.0] - 2026-11-19

### Added

- Items tab: copy button that puts the ticked items on the clipboard as
  terminal commands, grouped by section with one entry per item. Useful for
  items the app can't delete itself (those holding an app). `disk-clean --list`
  now prints each item's `manual` shell lines. (b778df4)
- `pnpm store prune` items show the store's total as an upper bound
  (`≤ 2.0 GB`) instead of `?`. The meter still ignores it. (be97361)

### Changed

- Tabs and the Items toolbar stay fixed at the top while scrolling the list.
  (c84dceb)

### Fixed

- The analysis no longer hangs forever on an unresponsive Docker: `docker info`
  times out after 10 s and Docker shows as "not responding". (d691d82)

## [0.4.0] - 2026-11-17

### Added

- Next.js builds section: one item per `.next/` next to a `package.json` under
  `~/Documents` (or `--projects DIR`). (148f0e1)
- The analysis (dry run) now shows in the Output tab. `disk-clean --list` also
  prints the `--dry-run` report as `log` lines, so no second scan is needed.
  (42dd41c)

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

[0.6.0]: https://github.com/sito8943/sito-mac-cleaner/releases/tag/v0.6.0
[0.5.0]: https://github.com/sito8943/sito-mac-cleaner/releases/tag/v0.5.0
[0.4.0]: https://github.com/sito8943/sito-mac-cleaner/releases/tag/v0.4.0
[0.3.0]: https://github.com/sito8943/sito-mac-cleaner/releases/tag/v0.3.0
[0.2.0]: https://github.com/sito8943/sito-mac-cleaner/releases/tag/v0.2.0
[0.1.0]: https://github.com/sito8943/sito-mac-cleaner/releases/tag/v0.1.0
