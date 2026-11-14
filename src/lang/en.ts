import type { Dictionary } from "./types";

export const en: Dictionary = {
  appName: "Sito Mac Cleaner",
  consentTitle: "Put me in the menu bar?",
  consentText:
    "Sito Mac Cleaner lives next to the clock and shows there how many GB you can free. The window will hide and the app will leave the Dock.",
  shortcutHint: (shortcut: string) =>
    `Can't see the icon? Press ${shortcut} from any app, or reopen Sito Mac Cleaner from Spotlight or Launchpad.`,
  consentAccept: "Yes, put it in the menu bar",
  trayDisable: "Remove from the menu bar",
  hideWindow: "Hide window",
  reanalyze: "Analyze again",
  freeOnDisk: (size: string) => `${size} free on disk`,
  scanning: "Analyzing…",
  scanningTitle: "Looking for what can go",
  scanningHint:
    "Same analysis as disk-clean --dry-run: nothing is deleted. Takes about 20 seconds.",
  emptyTitle: "Nothing to clean. Spotless disk.",
  levelOk: "All under control",
  levelWarn: "It's filling up",
  levelDanger: "Red zone! Time to clean",
  unknownExtra: (count: number) =>
    count === 1
      ? "+ 1 task of unknown size"
      : `+ ${count} tasks of unknown size`,
  hintScanning: "Wait for the analysis to finish",
  hintCleaning: "Cleaning… don't shut down",
  hintNothing: "Tick something to clean",
  hintCover: "Lift the cover to arm the button",
  hintArmed: "Armed! Press to clean",
  doomsdayLabel: "CLEAN",
  cleanNow: "Clean the ticked items",
  liftCover: "Lift the safety cover",
  freed: (size: string) => `${size} freed!`,
  logTitle: "disk-clean output",
  viewOutput: "See the full output",
  logEmpty: "Nothing yet. The cleanup output shows up here.",
  tabMain: "Clean",
  tabItems: "Items",
  tabOutput: "Output",
  alertTitle: "DISK ALERT",
  selectedCount: (selected: number, total: number) =>
    `${selected} of ${total} ticked`,
  selectAll: "Tick all",
  selectNone: "Untick all",
  noteAppBundle:
    "Contains an app: macOS only lets it be deleted with the App Management permission, so it will be skipped. Remove it from Finder or grant the permission in System Settings > Privacy & Security.",
  sizeUnknown: "The script can't estimate how much this frees",
  sectionCaches: "App caches",
  sectionPackages: "Package managers",
  sectionNodeModules:
    "node_modules in ~/Documents (pnpm install brings them back)",
  sectionRustTarget:
    "Tauri / Rust builds (target/; cargo build brings them back)",
  sectionDocker: "Docker",
  sectionVscode: "Old VS Code extensions",
  sectionBackups: "VPS backups",
  sectionSessions: "Claude Code and Codex sessions",
  sectionTrash: "Trash (emptied through Finder)",
  sectionChat: "Chat apps (size only; clean them from the app)",
  dismiss: "Close",
  errorScriptNotFound: "Can't find disk-clean inside the app.",
  errorScriptFailed: "disk-clean failed:",
  errorInvalidItem: "A ticked item has an invalid id.",
  errorBusy: "An analysis or cleanup is already running.",
  errorGeneric: "Something went wrong:",
};
