import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

import { ScanResult } from "@/shared/models";
import { CLEANER_COMMAND, CLEANER_EVENT } from "./constants";

/**
 * Único punto de la app que habla con el backend (ARCHITECTURE_RULES §13).
 * Los features consumen estos wrappers a través de sus managers.
 */

/** Si el usuario ya aceptó que la app viva en la barra de menús. */
export function getTrayEnabled(): Promise<boolean> {
  return invoke<boolean>(CLEANER_COMMAND.GET_TRAY_ENABLED);
}

/** Crea o quita el icono de la barra de menús y guarda la decisión. */
export function setTrayEnabled(enabled: boolean): Promise<void> {
  return invoke<void>(CLEANER_COMMAND.SET_TRAY_ENABLED, { enabled });
}

/** `disk-clean --list`: qué se puede limpiar y cuánto ocupa. No borra nada. */
export function scanDisk(): Promise<ScanResult> {
  return invoke<ScanResult>(CLEANER_COMMAND.SCAN_DISK);
}

/** `disk-clean --only <ids>`: limpia solo esos elementos. */
export function cleanDisk(ids: string[]): Promise<void> {
  return invoke<void>(CLEANER_COMMAND.CLEAN_DISK, { ids });
}

/** Cada línea que imprime disk-clean mientras limpia. */
export function onCleanLog(
  handler: (line: string) => void,
): Promise<UnlistenFn> {
  return listen<string>(CLEANER_EVENT.LOG, (event) => handler(event.payload));
}

export function hideWindow(): Promise<void> {
  return invoke<void>(CLEANER_COMMAND.HIDE_WINDOW);
}
