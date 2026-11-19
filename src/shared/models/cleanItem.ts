/** Espejo de `CleanItem` en src-tauri/src/cleaner.rs (una línea de `disk-clean --list`). */
export interface CleanItem {
  /** Id estable que acepta `disk-clean --only`. */
  id: string;
  /** Clave de sección del script: "caches", "packages", "docker"… */
  section: string;
  kind: CleanItemKind;
  /** `null` cuando el script no puede estimar lo que libera. */
  bytes: number | null;
  /** Ruta o comando, tal cual lo imprime el script. */
  label: string;
  /** Aviso del script sobre el elemento (ver ITEM_NOTE); `null` si no hay. */
  note: string | null;
  /** Tope de lo que puede liberar cuando `bytes` es `null` (p. ej. el store de pnpm antes del prune). */
  maxBytes: number | null;
  /** Líneas de shell para limpiarlo a mano (`rm -rf …` o el comando); vacío en info. */
  commands: string[];
}

/** rm = borra rutas, cmd = ejecuta un comando, info = solo se muestra. */
export type CleanItemKind = "rm" | "cmd" | "info";

export interface ScanResult {
  freeBytes: number;
  items: CleanItem[];
  /** Informe del dry run (`disk-clean --dry-run`), una línea por entrada. */
  log: string[];
}
