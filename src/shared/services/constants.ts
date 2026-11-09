// Nombres de comandos Tauri (deben coincidir con src-tauri/src/lib.rs)
export const CLEANER_COMMAND = {
  GET_TRAY_ENABLED: "get_tray_enabled",
  SET_TRAY_ENABLED: "set_tray_enabled",
  SCAN_DISK: "scan_disk",
  CLEAN_DISK: "clean_disk",
  HIDE_WINDOW: "hide_window",
} as const;

export type CleanerCommand =
  (typeof CLEANER_COMMAND)[keyof typeof CLEANER_COMMAND];

// Eventos del backend (LOG_EVENT en src-tauri/src/cleaner.rs)
export const CLEANER_EVENT = {
  LOG: "cleaner://log",
} as const;
