import { t } from "@/lang";
import { CleanItem } from "@/shared/models";
import {
  BYTES_PER_GB,
  BYTES_PER_MB,
  ERROR_CODE,
  ITEM_KIND,
  ITEM_NOTE,
  METER_DANGER_GB,
  METER_LEVEL,
  METER_WARN_GB,
  MeterLevel,
} from "./constants";
import { SECTIONS } from "./sections";
import { SectionGroup } from "./types";

/** "12.3 GB" / "540 MB"; `null` = tamaño desconocido. */
export function formatBytes(bytes: number | null): string {
  if (bytes === null) return "?";
  if (bytes >= BYTES_PER_GB) return `${(bytes / BYTES_PER_GB).toFixed(1)} GB`;
  return `${Math.round(bytes / BYTES_PER_MB)} MB`;
}

/** Última línea con texto del log (lo que el script está haciendo ahora). */
export function lastLogLine(lines: readonly string[]): string | null {
  for (let index = lines.length - 1; index >= 0; index--) {
    const line = lines[index].trim();
    if (line) return line;
  }
  return null;
}

export function meterLevel(bytes: number): MeterLevel {
  const gb = bytes / BYTES_PER_GB;
  if (gb >= METER_DANGER_GB) return METER_LEVEL.DANGER;
  if (gb >= METER_WARN_GB) return METER_LEVEL.WARN;
  return METER_LEVEL.OK;
}

export function isCleanable(item: CleanItem): boolean {
  return item.kind !== ITEM_KIND.INFO;
}

/** Agrupa por sección; una sección que el registro no conoce va al final. */
export function groupBySection(items: CleanItem[]): SectionGroup[] {
  const known = SECTIONS.map((section) => ({
    id: section.id as string,
    label: section.label(),
    items: items.filter((item) => item.section === section.id),
  }));
  const knownIds = new Set(known.map((group) => group.id));
  const unknown = [...new Set(items.map((item) => item.section))]
    .filter((id) => !knownIds.has(id))
    .map((id) => ({
      id,
      label: id,
      items: items.filter((item) => item.section === id),
    }));
  return [...known, ...unknown].filter((group) => group.items.length > 0);
}

/** Los errores llegan como "código" o "código: detalle". */
export function translateError(raw: string): string {
  const [code, ...rest] = raw.split(": ");
  const detail = rest.join(": ");
  switch (code) {
    case ERROR_CODE.SCRIPT_NOT_FOUND:
      return t("errorScriptNotFound");
    case ERROR_CODE.SCRIPT_FAILED:
      return `${t("errorScriptFailed")} ${detail}`.trim();
    case ERROR_CODE.INVALID_ITEM:
      return t("errorInvalidItem");
    case ERROR_CODE.BUSY:
      return t("errorBusy");
    default:
      return `${t("errorGeneric")} ${raw}`;
  }
}

const RM_PREFIX = "rm -rf ";

/**
 * Comandos de un elemento: varios `rm -rf` se juntan en uno, una ruta por
 * línea, para que un elemento con cientos de ficheros siga siendo una entrada.
 */
function itemCommands(item: CleanItem): string[] {
  const { commands } = item;
  if (
    commands.length < 2 ||
    !commands.every((command) => command.startsWith(RM_PREFIX))
  ) {
    return commands;
  }
  const paths = commands.map((command) => command.slice(RM_PREFIX.length));
  return [`${RM_PREFIX}\\\n  ${paths.join(" \\\n  ")}`];
}

/**
 * Lo marcado como script de shell para limpiarlo a mano: una cabecera y, por
 * sección, su título y cada elemento con su nombre y sus comandos. `null` si
 * no hay nada.
 */
export function manualScript(
  groups: readonly SectionGroup[],
  selected: ReadonlySet<string>,
): string | null {
  const blocks: string[] = [];
  let count = 0;
  for (const group of groups) {
    const items = group.items.filter(
      (item) => selected.has(item.id) && item.commands.length > 0,
    );
    if (!items.length) continue;
    const lines = [`# == ${group.label}`];
    for (const item of items) {
      const commands = itemCommands(item);
      // Un `cmd` suele llamarse como su comando: el título sobraría.
      if (!commands.some((command) => command.includes(item.label))) {
        lines.push(`# ${item.label}`);
      }
      if (item.note === ITEM_NOTE.APP_BUNDLE) {
        lines.push(`# ${t("manualAppBundle")}`);
      }
      lines.push(...commands);
    }
    blocks.push(lines.join("\n"));
    count += items.length;
  }
  if (!count) return null;
  return [`# ${t("manualHeader", count)}`, ...blocks].join("\n\n") + "\n";
}
