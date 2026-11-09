import type { CleanItem } from "@/shared/models";
import type { SectionGroup } from "@/features/cleaner/types";

export interface ItemListProps {
  groups: SectionGroup[];
  selected: ReadonlySet<string>;
  disabled: boolean;
  onToggleItem: (item: CleanItem, checked: boolean) => void;
  onToggleSection: (group: SectionGroup, checked: boolean) => void;
}
