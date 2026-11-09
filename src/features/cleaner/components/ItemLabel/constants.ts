import {
  faCircleInfo,
  faFolder,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";

import { t } from "@/lang";
import { ITEM_KIND, ITEM_NOTE } from "@/features/cleaner/constants";

/** Carpeta = se borran rutas; terminal = se ejecuta un comando; info = solo se mide. */
export const KIND_ICON = {
  [ITEM_KIND.RM]: faFolder,
  [ITEM_KIND.CMD]: faTerminal,
  [ITEM_KIND.INFO]: faCircleInfo,
};

/** Texto del tooltip de cada aviso del script; uno desconocido no muestra icono. */
export const NOTE_TEXT: Record<string, () => string> = {
  [ITEM_NOTE.APP_BUNDLE]: () => t("noteAppBundle"),
};
