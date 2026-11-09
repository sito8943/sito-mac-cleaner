import { METER_LEVEL, MeterLevel } from "../../constants";

/** La tapa se vuelve a cerrar sola si no se pulsa en este tiempo. */
export const ARM_TIMEOUT_MS = 5000;

// Cuanto más lleno, más urgente grita el botón: LIMPIAR → LIMPIAR! → LIMPIAR!!!
export const LEVEL_SUFFIX: Record<MeterLevel, string> = {
  [METER_LEVEL.OK]: "",
  [METER_LEVEL.WARN]: "!",
  [METER_LEVEL.DANGER]: "!!!",
};
