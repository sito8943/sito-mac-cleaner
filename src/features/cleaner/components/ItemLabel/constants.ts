import {
  faCircleInfo,
  faFolder,
  faTerminal,
} from "@fortawesome/free-solid-svg-icons";

import { ITEM_KIND } from "@/features/cleaner/constants";

/** Carpeta = se borran rutas; terminal = se ejecuta un comando; info = solo se mide. */
export const KIND_ICON = {
  [ITEM_KIND.RM]: faFolder,
  [ITEM_KIND.CMD]: faTerminal,
  [ITEM_KIND.INFO]: faCircleInfo,
};
