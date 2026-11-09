import { t } from "@/lang";
import { CLEANER_TAB, CleanerTab } from "./constants";

/**
 * Registro de pestañas (§4): orden y título de cada vista del limpiador.
 * Una pestaña nueva = una entrada aquí + su texto + su panel en Cleaner.
 */
export const CLEANER_TABS: readonly { id: CleanerTab; label: () => string }[] =
  [
    { id: CLEANER_TAB.MAIN, label: () => t("tabMain") },
    { id: CLEANER_TAB.ITEMS, label: () => t("tabItems") },
    { id: CLEANER_TAB.OUTPUT, label: () => t("tabOutput") },
  ];
