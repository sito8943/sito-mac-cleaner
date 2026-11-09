import type { UnlistenFn } from "@tauri-apps/api/event";

import { api } from "@/shared/services";
import { ScanResult } from "@/shared/models";

/**
 * Operaciones de dominio sobre la bandeja y disk-clean: los componentes
 * hablan con este manager, nunca con la capa de IPC (ARCHITECTURE_RULES §3).
 */
export class CleanerManager {
  isTrayEnabled(): Promise<boolean> {
    return api.getTrayEnabled();
  }

  setTrayEnabled(enabled: boolean): Promise<void> {
    return api.setTrayEnabled(enabled);
  }

  scan(): Promise<ScanResult> {
    return api.scanDisk();
  }

  /** Limpia `ids` y entrega cada línea de salida a `onLog` mientras dura. */
  async clean(ids: string[], onLog: (line: string) => void): Promise<void> {
    // Suscribirse antes de lanzar: las primeras líneas salen enseguida.
    const unlisten: UnlistenFn = await api.onCleanLog(onLog);
    try {
      await api.cleanDisk(ids);
    } finally {
      unlisten();
    }
  }

  hideWindow(): Promise<void> {
    return api.hideWindow();
  }
}
