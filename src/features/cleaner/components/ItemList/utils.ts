import type { CleanItem } from "@/shared/models";

/** Suma de los tamaños conocidos; `null` si ninguno lo es. */
export function knownBytes(items: CleanItem[]): number | null {
  const sizes = items
    .map((item) => item.bytes)
    .filter((bytes): bytes is number => bytes !== null);
  return sizes.length ? sizes.reduce((a, b) => a + b, 0) : null;
}
