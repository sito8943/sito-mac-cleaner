/**
 * Contrato de todos los diccionarios: cada idioma define las mismas claves,
 * y las cadenas con datos son funciones (ARCHITECTURE_RULES §9).
 */
export interface Dictionary {
  appName: string;
  consentTitle: string;
  consentText: string;
  shortcutHint: (shortcut: string) => string;
  consentAccept: string;
  trayDisable: string;
  hideWindow: string;
  reanalyze: string;
  freeOnDisk: (size: string) => string;
  scanning: string;
  scanningTitle: string;
  scanningHint: string;
  emptyTitle: string;
  levelOk: string;
  levelWarn: string;
  levelDanger: string;
  unknownExtra: (count: number) => string;
  hintScanning: string;
  hintCleaning: string;
  hintNothing: string;
  hintCover: string;
  hintArmed: string;
  doomsdayLabel: string;
  cleanNow: string;
  liftCover: string;
  freed: (size: string) => string;
  logTitle: string;
  selectedCount: (selected: number, total: number) => string;
  selectAll: string;
  selectNone: string;
  sizeUnknown: string;
  sectionCaches: string;
  sectionPackages: string;
  sectionDocker: string;
  sectionVscode: string;
  sectionBackups: string;
  sectionSessions: string;
  sectionChat: string;
  dismiss: string;
  errorScriptNotFound: string;
  errorScriptFailed: string;
  errorInvalidItem: string;
  errorBusy: string;
  errorGeneric: string;
}
