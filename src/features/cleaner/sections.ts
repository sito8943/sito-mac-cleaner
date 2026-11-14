import { t } from "@/lang";
import { SECTION, Section } from "./constants";

/**
 * Registro de secciones (§4): orden y título de cada grupo de la lista.
 * Una sección nueva del script = una entrada aquí + sus textos.
 */
export const SECTIONS: readonly { id: Section; label: () => string }[] = [
  { id: SECTION.CACHES, label: () => t("sectionCaches") },
  { id: SECTION.PACKAGES, label: () => t("sectionPackages") },
  { id: SECTION.NODE_MODULES, label: () => t("sectionNodeModules") },
  { id: SECTION.RUST_TARGET, label: () => t("sectionRustTarget") },
  { id: SECTION.DOCKER, label: () => t("sectionDocker") },
  { id: SECTION.VSCODE, label: () => t("sectionVscode") },
  { id: SECTION.BACKUPS, label: () => t("sectionBackups") },
  { id: SECTION.SESSIONS, label: () => t("sectionSessions") },
  { id: SECTION.TRASH, label: () => t("sectionTrash") },
  { id: SECTION.CHAT, label: () => t("sectionChat") },
];
