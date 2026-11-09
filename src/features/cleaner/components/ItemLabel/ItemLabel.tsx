import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { t } from "@/lang";
import { formatBytes } from "@/features/cleaner/utils";
import { KIND_ICON } from "./constants";
import { ItemLabelProps } from "./types";

/** Una fila: tipo, ruta o comando (tal cual lo imprime disk-clean) y tamaño. */
export function ItemLabel({ item }: ItemLabelProps) {
  return (
    <span className="ItemLabel">
      <FontAwesomeIcon className="kind" icon={KIND_ICON[item.kind]} />
      <span className="label" title={item.label}>
        {item.label}
      </span>
      <span
        className="size"
        title={item.bytes === null ? t("sizeUnknown") : undefined}
      >
        {formatBytes(item.bytes)}
      </span>
    </span>
  );
}
