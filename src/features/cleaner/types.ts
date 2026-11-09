import type { CleanItem } from "@/shared/models";

/** Elementos de una sección, ya en el orden del registro SECTIONS. */
export interface SectionGroup {
  id: string;
  label: string;
  items: CleanItem[];
}
