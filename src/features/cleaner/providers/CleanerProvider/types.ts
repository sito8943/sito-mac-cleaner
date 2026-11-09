import { CleanItem, ScanResult } from "@/shared/models";
import { Phase } from "@/features/cleaner/constants";
import { SectionGroup } from "@/features/cleaner/types";

export interface CleanerContextValue {
  /** `null` mientras se lee la preferencia guardada. */
  trayEnabled: boolean | null;
  phase: Phase;
  /** `null` hasta que termina el primer análisis. */
  scan: ScanResult | null;
  groups: SectionGroup[];
  selected: ReadonlySet<string>;
  /** Suma de lo marcado con tamaño conocido: lo que mide el medidor. */
  selectedBytes: number;
  /** Marcados cuyo tamaño el script no puede estimar (p. ej. `pnpm store prune`). */
  selectedUnknown: number;
  cleanableCount: number;
  /** Salida de disk-clean durante la última limpieza. */
  log: string[];
  /** Espacio que ganó el disco en la última limpieza. */
  freedBytes: number | null;
  error: string | null;
  analyze: () => Promise<void>;
  toggleItem: (item: CleanItem, checked: boolean) => void;
  toggleSection: (group: SectionGroup, checked: boolean) => void;
  selectAll: () => void;
  selectNone: () => void;
  clean: () => Promise<void>;
  enableTray: () => Promise<void>;
  disableTray: () => Promise<void>;
  hideWindow: () => Promise<void>;
  clearError: () => void;
}
