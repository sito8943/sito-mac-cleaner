import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CleanItem, ScanResult } from "@/shared/models";
import { CleanerManager } from "@/features/cleaner/managers/CleanerManager";
import { PHASE, Phase } from "@/features/cleaner/constants";
import { SectionGroup } from "@/features/cleaner/types";
import {
  groupBySection,
  isCleanable,
  translateError,
} from "@/features/cleaner/utils";
import { CleanerContext } from "./context";
import { CleanerContextValue } from "./types";

/** Lo que haría el dry run: todo lo limpiable, marcado. */
function allCleanableIds(result: ScanResult): Set<string> {
  return new Set(result.items.filter(isCleanable).map((item) => item.id));
}

export function CleanerProvider({ children }: { children: ReactNode }) {
  const managerRef = useRef(new CleanerManager());
  const [trayEnabled, setTrayEnabled] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>(PHASE.IDLE);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [log, setLog] = useState<string[]>([]);
  const [freedBytes, setFreedBytes] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runScan = useCallback(async (): Promise<ScanResult | null> => {
    setPhase(PHASE.SCANNING);
    try {
      const result = await managerRef.current.scan();
      setScan(result);
      setSelected(allCleanableIds(result));
      return result;
    } catch (e) {
      setError(translateError(String(e)));
      return null;
    } finally {
      setPhase(PHASE.IDLE);
    }
  }, []);

  const analyze = useCallback(async () => {
    setError(null);
    setFreedBytes(null);
    setLog([]);
    await runScan();
  }, [runScan]);

  // Arranque: preferencia de bandeja y primer análisis en paralelo. StrictMode
  // ejecuta los efectos dos veces en dev; el ref evita un segundo análisis, que
  // el backend rechazaría con "busy" y acabaría como error en pantalla.
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    (async () => {
      try {
        setTrayEnabled(await managerRef.current.isTrayEnabled());
      } catch (e) {
        setError(translateError(String(e)));
        setTrayEnabled(false);
      }
    })();
    runScan();
  }, [runScan]);

  const items = useMemo(() => scan?.items ?? [], [scan]);
  const groups = useMemo(() => groupBySection(items), [items]);

  const { selectedBytes, selectedUnknown, cleanableCount } = useMemo(() => {
    let bytes = 0;
    let unknown = 0;
    let cleanable = 0;
    for (const item of items) {
      if (!isCleanable(item)) continue;
      cleanable++;
      if (!selected.has(item.id)) continue;
      if (item.bytes === null) unknown++;
      else bytes += item.bytes;
    }
    return {
      selectedBytes: bytes,
      selectedUnknown: unknown,
      cleanableCount: cleanable,
    };
  }, [items, selected]);

  const setMany = useCallback((ids: string[], checked: boolean) => {
    setSelected((previous) => {
      const next = new Set(previous);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }, []);

  const toggleItem = useCallback(
    (item: CleanItem, checked: boolean) => setMany([item.id], checked),
    [setMany],
  );

  const toggleSection = useCallback(
    (group: SectionGroup, checked: boolean) =>
      setMany(
        group.items.filter(isCleanable).map((item) => item.id),
        checked,
      ),
    [setMany],
  );

  const selectAll = useCallback(() => {
    if (scan) setSelected(allCleanableIds(scan));
  }, [scan]);

  const selectNone = useCallback(() => setSelected(new Set()), []);

  const clean = useCallback(async () => {
    if (!scan || selected.size === 0) return;
    const freeBefore = scan.freeBytes;
    setError(null);
    setFreedBytes(null);
    setLog([]);
    setPhase(PHASE.CLEANING);
    try {
      await managerRef.current.clean([...selected], (line) =>
        setLog((previous) => [...previous, line]),
      );
    } catch (e) {
      setError(translateError(String(e)));
    }
    // Se vuelve a medir aunque falle: parte pudo borrarse ya.
    const after = await runScan();
    if (after) setFreedBytes(Math.max(0, after.freeBytes - freeBefore));
  }, [scan, selected, runScan]);

  const changeTray = useCallback(async (enabled: boolean) => {
    setError(null);
    try {
      await managerRef.current.setTrayEnabled(enabled);
      setTrayEnabled(enabled);
      // Aceptar = la app pasa a vivir en la barra de menús.
      if (enabled) await managerRef.current.hideWindow();
    } catch (e) {
      setError(translateError(String(e)));
    }
  }, []);

  const enableTray = useCallback(() => changeTray(true), [changeTray]);
  const disableTray = useCallback(() => changeTray(false), [changeTray]);

  const hideWindow = useCallback(() => managerRef.current.hideWindow(), []);

  // Escape oculta la ventana; sin bandeja no se oculta para no dejarla inaccesible.
  useEffect(() => {
    if (!trayEnabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideWindow();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [trayEnabled, hideWindow]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<CleanerContextValue>(
    () => ({
      trayEnabled,
      phase,
      scan,
      groups,
      selected,
      selectedBytes,
      selectedUnknown,
      cleanableCount,
      log,
      freedBytes,
      error,
      analyze,
      toggleItem,
      toggleSection,
      selectAll,
      selectNone,
      clean,
      enableTray,
      disableTray,
      hideWindow,
      clearError,
    }),
    [
      trayEnabled,
      phase,
      scan,
      groups,
      selected,
      selectedBytes,
      selectedUnknown,
      cleanableCount,
      log,
      freedBytes,
      error,
      analyze,
      toggleItem,
      toggleSection,
      selectAll,
      selectNone,
      clean,
      enableTray,
      disableTray,
      hideWindow,
      clearError,
    ],
  );

  return (
    <CleanerContext.Provider value={value}>{children}</CleanerContext.Provider>
  );
}
