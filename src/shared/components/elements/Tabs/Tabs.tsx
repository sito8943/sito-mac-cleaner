import { UnstyledButton } from "@/shared/components/elements/UnstyledButton";
import { classNames } from "@/shared/utils";
import { TabsPropsType } from "./types";
import { panelId, tabId } from "./utils";

import "@/styles/components/Tabs.css";

/**
 * @sito/ui 0.9.0 no trae pestañas: barra segmentada de la app (§14.1).
 * Los paneles los pinta quien la usa, con los ids de `panelId`.
 */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  idPrefix,
  className,
}: TabsPropsType<T>) {
  return (
    <div className={classNames("Tabs", className)} role="tablist">
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <UnstyledButton
            key={tab.id}
            id={tabId(idPrefix, tab.id)}
            className={classNames("Tabs-tab", active && "active")}
            // eslint-disable-next-line i18next/no-literal-string -- rol ARIA, no texto.
            role="tab"
            aria-selected={active}
            aria-controls={panelId(idPrefix, tab.id)}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </UnstyledButton>
        );
      })}
    </div>
  );
}
