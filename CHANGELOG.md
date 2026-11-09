# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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

[0.1.0]: https://github.com/sito8943/sito-mac-cleaner/releases/tag/v0.1.0
