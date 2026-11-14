import type { Dictionary } from "./types";

export const es: Dictionary = {
  appName: "Sito Mac Cleaner",
  consentTitle: "¿Te pongo en la barra de menús?",
  consentText:
    "Sito Mac Cleaner vive junto al reloj y muestra ahí los GB que puedes liberar. La ventana se esconderá y la app dejará el Dock.",
  shortcutHint: (shortcut: string) =>
    `¿No ves el icono? Pulsa ${shortcut} desde cualquier app, o vuelve a abrir Sito Mac Cleaner desde Spotlight o Launchpad.`,
  consentAccept: "Sí, ponla en la barra de menús",
  trayDisable: "Quitar de la barra de menús",
  hideWindow: "Esconder ventana",
  reanalyze: "Volver a analizar",
  freeOnDisk: (size: string) => `${size} libres en disco`,
  scanning: "Analizando…",
  scanningTitle: "Buscando qué se puede borrar",
  scanningHint:
    "Es el mismo análisis que disk-clean --dry-run: no borra nada. Tarda unos 20 segundos.",
  emptyTitle: "Nada que limpiar. Disco impecable.",
  levelOk: "Todo bajo control",
  levelWarn: "Esto se está llenando",
  levelDanger: "¡Zona roja! Hora de limpiar",
  unknownExtra: (count: number) =>
    count === 1
      ? "+ 1 tarea de tamaño desconocido"
      : `+ ${count} tareas de tamaño desconocido`,
  hintScanning: "Espera a que termine el análisis",
  hintCleaning: "Limpiando… no apagues el Mac",
  hintNothing: "Marca algo para limpiar",
  hintCover: "Levanta la tapa para armar el botón",
  hintArmed: "¡Armado! Pulsa para limpiar",
  doomsdayLabel: "LIMPIAR",
  cleanNow: "Limpiar lo marcado",
  liftCover: "Levantar la tapa de seguridad",
  freed: (size: string) => `¡Liberados ${size}!`,
  logTitle: "Salida de disk-clean",
  viewOutput: "Ver la salida completa",
  logEmpty: "Nada todavía. Aquí sale la salida de la limpieza.",
  tabMain: "Limpiar",
  tabItems: "Lista",
  tabOutput: "Salida",
  alertTitle: "ALERTA DE DISCO",
  selectedCount: (selected: number, total: number) =>
    `${selected} de ${total} marcados`,
  selectAll: "Marcar todo",
  selectNone: "Desmarcar todo",
  noteAppBundle:
    "Contiene una app: macOS solo deja borrarla con el permiso de Gestión de apps, así que se saltará. Bórrala desde Finder o da el permiso en Ajustes del Sistema > Privacidad y seguridad.",
  sizeUnknown: "El script no puede estimar cuánto libera",
  sectionCaches: "Cachés de apps",
  sectionPackages: "Gestores de paquetes",
  sectionNodeModules: "node_modules en ~/Documents (pnpm install los recupera)",
  sectionRustTarget:
    "Builds de Tauri / Rust (target/; cargo build los recupera)",
  sectionDocker: "Docker",
  sectionVscode: "Extensiones viejas de VS Code",
  sectionBackups: "Backups del VPS",
  sectionSessions: "Sesiones de Claude Code y Codex",
  sectionTrash: "Papelera (se vacía con Finder)",
  sectionChat: "Apps de chat (solo tamaño; se limpian desde la app)",
  dismiss: "Cerrar",
  errorScriptNotFound: "No encuentro disk-clean dentro de la app.",
  errorScriptFailed: "disk-clean falló:",
  errorInvalidItem: "Hay un elemento marcado con un id no válido.",
  errorBusy: "Ya hay un análisis o una limpieza en marcha.",
  errorGeneric: "Algo salió mal:",
};
