import type { MeterLevel } from "../../constants";

export interface DoomsdayButtonProps {
  /** Nada marcado, o analizando/limpiando: la tapa no se puede levantar. */
  disabled: boolean;
  busy: boolean;
  /** Zona del medidor: tiñe el botón y añade signos de exclamación. */
  level: MeterLevel;
  onFire: () => void;
  /** Avisa al padre de que la tapa está levantada (para el texto de ayuda). */
  onArmedChange: (armed: boolean) => void;
}
