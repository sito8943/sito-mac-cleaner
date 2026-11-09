import { Checkbox } from "@/shared/components/elements/Checkbox";
import { formatBytes, isCleanable } from "@/features/cleaner/utils";
import { ItemLabel } from "@/features/cleaner/components/ItemLabel";
import { ItemListProps } from "./types";
import { knownBytes } from "./utils";

import "@/styles/components/ItemList.css";

/** Lo que encontró el análisis, agrupado por sección y con casillas. */
export function ItemList({
  groups,
  selected,
  disabled,
  onToggleItem,
  onToggleSection,
}: ItemListProps) {
  return (
    <div className="ItemList">
      {groups.map((group) => {
        const cleanable = group.items.filter(isCleanable);
        const checked = cleanable.filter((item) => selected.has(item.id));
        const sectionTitle = (
          <span className="ItemList-section-title">
            <span>{group.label}</span>
            <span className="size">
              {formatBytes(
                knownBytes(cleanable.length ? checked : group.items),
              )}
            </span>
          </span>
        );
        return (
          <section key={group.id} className="ItemList-section">
            <header>
              {cleanable.length ? (
                <Checkbox
                  checked={checked.length === cleanable.length}
                  indeterminate={
                    checked.length > 0 && checked.length < cleanable.length
                  }
                  disabled={disabled}
                  onChange={(value) => onToggleSection(group, value)}
                >
                  {sectionTitle}
                </Checkbox>
              ) : (
                sectionTitle
              )}
            </header>
            <ul>
              {group.items.map((item) => (
                <li key={item.id}>
                  {isCleanable(item) ? (
                    <Checkbox
                      checked={selected.has(item.id)}
                      disabled={disabled}
                      onChange={(value) => onToggleItem(item, value)}
                    >
                      <ItemLabel item={item} />
                    </Checkbox>
                  ) : (
                    <div className="ItemList-info">
                      <ItemLabel item={item} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
