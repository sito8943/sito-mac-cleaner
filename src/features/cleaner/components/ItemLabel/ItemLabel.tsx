import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import { t } from "@/lang";
import { formatBytes } from "@/features/cleaner/utils";
import { Tooltip } from "@/shared/components/elements/Tooltip";
import { TOOLTIP_ALIGN, TOOLTIP_SIDE } from "@/shared/constants";
import { KIND_ICON, NOTE_TEXT } from "./constants";
import { ItemLabelProps } from "./types";

/** Una fila: tipo, ruta o comando (tal cual lo imprime disk-clean) y tamaño. */
export function ItemLabel({ item }: ItemLabelProps) {
  const note = item.note ? NOTE_TEXT[item.note]?.() : undefined;
  return (
    <span className="ItemLabel">
      <FontAwesomeIcon className="kind" icon={KIND_ICON[item.kind]} />
      <span className="label" title={item.label}>
        {item.label}
      </span>
      {note ? (
        <Tooltip label={note} side={TOOLTIP_SIDE.TOP} align={TOOLTIP_ALIGN.END}>
          <span
            className="note"
            aria-label={note}
            // La fila es el <label> del checkbox: tocar el icono no debe marcarla.
            onClick={(event) => event.preventDefault()}
          >
            <FontAwesomeIcon icon={faCircleInfo} />
          </span>
        </Tooltip>
      ) : null}
      <span
        className="size"
        title={item.bytes === null ? t("sizeUnknown") : undefined}
      >
        {formatBytes(item.bytes)}
      </span>
    </span>
  );
}
