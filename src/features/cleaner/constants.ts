import type { CleanItemKind } from "@/shared/models";

// Códigos de error del backend (src-tauri/src/cleaner.rs)
export const ERROR_CODE = {
  SCRIPT_NOT_FOUND: "script-not-found",
  SCRIPT_FAILED: "script-failed",
  INVALID_ITEM: "invalid-item",
  BUSY: "busy",
} as const;

export const ITEM_KIND = {
  RM: "rm",
  CMD: "cmd",
  INFO: "info",
} as const satisfies Record<string, CleanItemKind>;

// Claves de sección que imprime cli/disk-clean (SECTIONS en el script).
export const SECTION = {
  CACHES: "caches",
  PACKAGES: "packages",
  DOCKER: "docker",
  VSCODE: "vscode",
  BACKUPS: "backups",
  SESSIONS: "sessions",
  CHAT: "chat",
} as const;

export type Section = (typeof SECTION)[keyof typeof SECTION];

export const PHASE = {
  IDLE: "idle",
  SCANNING: "scanning",
  CLEANING: "cleaning",
} as const;

export type Phase = (typeof PHASE)[keyof typeof PHASE];

export const METER_LEVEL = {
  OK: "ok",
  WARN: "warn",
  DANGER: "danger",
} as const;

export type MeterLevel = (typeof METER_LEVEL)[keyof typeof METER_LEVEL];

// Misma base que `human` en disk-clean y la bandeja: 1 GB = 1024³ bytes.
export const BYTES_PER_GB = 1024 ** 3;
export const BYTES_PER_MB = 1024 ** 2;

// Medidor: verde hasta 10 GB liberables, amarillo hasta 30, rojo desde 30.
export const METER_WARN_GB = 10;
export const METER_DANGER_GB = 30;
