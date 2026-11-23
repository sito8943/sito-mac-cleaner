import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCopy,
  faEyeSlash,
  faPowerOff,
  faRotate,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { t } from "@/lang";
import { Button } from "@/shared/components/elements/Button";
import { IconButton } from "@/shared/components/elements/IconButton";
import { Tooltip } from "@/shared/components/elements/Tooltip";
import { Spinner } from "@/shared/components/elements/Spinner";
import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  SHORTCUT_LABEL,
  TOOLTIP_ALIGN,
  TOOLTIP_SIDE,
} from "@/shared/constants";
import { UnstyledButton } from "@/shared/components/elements/UnstyledButton";
import { Tabs, panelId, tabId } from "@/shared/components/elements/Tabs";
import { classNames } from "@/shared/utils";
import { AlertBanner } from "./components/AlertBanner";
import { CleanLog } from "./components/CleanLog";
import { DoomsdayButton } from "./components/DoomsdayButton";
import { ItemList } from "./components/ItemList";
import { TrayConsent } from "./components/TrayConsent";
import { VuMeter } from "./components/VuMeter";
import {
  BYTES_PER_GB,
  CLEANER_TAB,
  CLEANER_TABS_ID,
  COPIED_FEEDBACK_MS,
  CleanerTab,
  METER_LEVEL,
  PHASE,
  REBOOT_NOTICE_GB,
} from "./constants";
import { useCleaner } from "./providers/CleanerProvider";
import { CLEANER_TABS } from "./tabs";
import { formatBytes, lastLogLine, meterLevel } from "./utils";

import "@/styles/views/Cleaner.css";

const LEVEL_TEXT = {
  [METER_LEVEL.OK]: () => t("levelOk"),
  [METER_LEVEL.WARN]: () => t("levelWarn"),
  [METER_LEVEL.DANGER]: () => t("levelDanger"),
};

export function Cleaner() {
  const {
    trayEnabled,
    phase,
    scan,
    groups,
    selected,
    selectedBytes,
    selectedUnknown,
    cleanableCount,
    rebootBytes,
    log,
    freedBytes,
    error,
    analyze,
    toggleItem,
    toggleSection,
    selectAll,
    selectNone,
    clean,
    copyManual,
    enableTray,
    disableTray,
    hideWindow,
    clearError,
  } = useCleaner();
  const [armed, setArmed] = useState(false);
  const [tab, setTab] = useState<CleanerTab>(CLEANER_TAB.MAIN);
  const [copied, setCopied] = useState(false);

  // La confirmación de "copiado" se apaga sola.
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  if (trayEnabled === null) {
    return (
      <div className="Cleaner loading">
        <Spinner />
      </div>
    );
  }

  const scanning = phase === PHASE.SCANNING;
  const cleaning = phase === PHASE.CLEANING;
  const busy = scanning || cleaning;
  const level = meterLevel(selectedBytes);
  // Mientras trabaja no hay zona: el medidor hace el barrido de "cargando".
  const alert = !busy && level === METER_LEVEL.DANGER;
  const tabs = CLEANER_TABS.map((entry) => ({
    id: entry.id,
    label: entry.label(),
  }));
  const panelProps = (id: CleanerTab) => ({
    id: panelId(CLEANER_TABS_ID, id),

    role: "tabpanel",
    "aria-labelledby": tabId(CLEANER_TABS_ID, id),
  });

  // Limpiando, la pista es la última línea del script: dice qué está borrando.
  const currentStep = cleaning ? lastLogLine(log) : null;

  let hint = t("hintCover");
  if (scanning) hint = t("hintScanning");
  else if (cleaning) hint = t("hintCleaning");
  else if (selected.size === 0) hint = t("hintNothing");
  else if (armed) hint = t("hintArmed");

  return (
    <div className={classNames("Cleaner", alert && "alert")}>
      {error ? (
        <aside className="error">
          <p>{error}</p>
          <Tooltip
            label={t("dismiss")}
            side={TOOLTIP_SIDE.BOTTOM}
            align={TOOLTIP_ALIGN.END}
          >
            <IconButton
              aria-label={t("dismiss")}
              icon={<FontAwesomeIcon icon={faXmark} />}
              variant={BUTTON_VARIANT.TEXT}
              color={BUTTON_COLOR.ERROR}
              onClick={clearError}
            />
          </Tooltip>
        </aside>
      ) : null}

      {!trayEnabled ? <TrayConsent onAccept={enableTray} /> : null}

      <header>
        <div>
          <h1>{t("appName")}</h1>
          <span className="status">
            {scan ? t("freeOnDisk", formatBytes(scan.freeBytes)) : " "}
          </span>
        </div>
        <div className="header-actions">
          <Tooltip
            label={t("reanalyze")}
            side={TOOLTIP_SIDE.BOTTOM}
            align={TOOLTIP_ALIGN.END}
          >
            <IconButton
              aria-label={t("reanalyze")}
              icon={<FontAwesomeIcon icon={faRotate} spin={scanning} />}
              variant={BUTTON_VARIANT.TEXT}
              disabled={busy}
              onClick={analyze}
            />
          </Tooltip>
          {trayEnabled ? (
            <>
              <Tooltip
                label={t("hideWindow")}
                side={TOOLTIP_SIDE.BOTTOM}
                align={TOOLTIP_ALIGN.END}
              >
                <IconButton
                  aria-label={t("hideWindow")}
                  icon={<FontAwesomeIcon icon={faEyeSlash} />}
                  variant={BUTTON_VARIANT.TEXT}
                  onClick={hideWindow}
                />
              </Tooltip>
              <Tooltip
                label={t("trayDisable")}
                side={TOOLTIP_SIDE.BOTTOM}
                align={TOOLTIP_ALIGN.END}
              >
                <IconButton
                  aria-label={t("trayDisable")}
                  icon={<FontAwesomeIcon icon={faPowerOff} />}
                  variant={BUTTON_VARIANT.TEXT}
                  color={BUTTON_COLOR.ERROR}
                  onClick={disableTray}
                />
              </Tooltip>
            </>
          ) : null}
        </div>
      </header>

      {trayEnabled ? (
        <p className="shortcut-hint">{t("shortcutHint", SHORTCUT_LABEL)}</p>
      ) : null}

      {alert ? <AlertBanner /> : null}

      {/* Pestañas y, en Items, su barra: fijas arriba al desplazar la lista. */}
      <div className="sticky-bar">
        <Tabs
          tabs={tabs}
          value={tab}
          onChange={(id) => {
            // El botón se desmonta al cambiar de pestaña y la tapa vuelve cerrada.
            setArmed(false);
            setTab(id);
          }}
          idPrefix={CLEANER_TABS_ID}
        />
        {tab === CLEANER_TAB.ITEMS && scan ? (
          <div className="toolbar">
            <span className="count">
              {t("selectedCount", selected.size, cleanableCount)}
            </span>
            <div className="toolbar-actions">
              <Tooltip
                label={copied ? t("copiedManual") : t("copyManual")}
                side={TOOLTIP_SIDE.BOTTOM}
                align={TOOLTIP_ALIGN.END}
              >
                <IconButton
                  aria-label={t("copyManual")}
                  icon={<FontAwesomeIcon icon={copied ? faCheck : faCopy} />}
                  size={BUTTON_SIZE.SM}
                  variant={BUTTON_VARIANT.TEXT}
                  disabled={busy || selected.size === 0}
                  onClick={async () => setCopied(await copyManual())}
                />
              </Tooltip>
              <Button
                size={BUTTON_SIZE.SM}
                variant={BUTTON_VARIANT.TEXT}
                disabled={busy}
                onClick={selectAll}
              >
                {t("selectAll")}
              </Button>
              <Button
                size={BUTTON_SIZE.SM}
                variant={BUTTON_VARIANT.TEXT}
                disabled={busy}
                onClick={selectNone}
              >
                {t("selectNone")}
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {tab === CLEANER_TAB.MAIN ? (
        <div className="panel main" {...panelProps(CLEANER_TAB.MAIN)}>
          <section className={classNames("hero", !busy && level)}>
            <VuMeter bytes={selectedBytes} busy={busy}>
              <DoomsdayButton
                disabled={busy || selected.size === 0}
                busy={busy}
                level={busy ? METER_LEVEL.OK : level}
                onFire={clean}
                onArmedChange={setArmed}
              />
            </VuMeter>
            <div className="readout">
              <strong>
                {scanning ? t("scanning") : formatBytes(selectedBytes)}
              </strong>
              {!busy ? (
                <span className="level">{LEVEL_TEXT[level]()}</span>
              ) : null}
              {!busy && selectedUnknown > 0 ? (
                <span className="extra">
                  {t("unknownExtra", selectedUnknown)}
                </span>
              ) : null}
              {cleaning ? (
                <UnstyledButton
                  className="hint step"
                  title={t("viewOutput")}
                  onClick={() => setTab(CLEANER_TAB.OUTPUT)}
                >
                  {currentStep ?? hint}
                </UnstyledButton>
              ) : (
                <span className={classNames("hint", armed && "armed")}>
                  {hint}
                </span>
              )}
            </div>
          </section>

          {!busy && rebootBytes >= REBOOT_NOTICE_GB * BYTES_PER_GB ? (
            <aside className="reboot-notice" role="status">
              {t("rebootNotice", formatBytes(rebootBytes))}
            </aside>
          ) : null}

          {freedBytes !== null ? (
            <aside className="freed">
              {t("freed", formatBytes(freedBytes))}
            </aside>
          ) : null}
        </div>
      ) : null}

      {tab === CLEANER_TAB.ITEMS ? (
        <div className="panel items" {...panelProps(CLEANER_TAB.ITEMS)}>
          {scan ? (
            <>
              {groups.length ? (
                <ItemList
                  groups={groups}
                  selected={selected}
                  disabled={busy}
                  onToggleItem={toggleItem}
                  onToggleSection={toggleSection}
                />
              ) : (
                <div className="empty">
                  <p className="empty-title">{t("emptyTitle")}</p>
                </div>
              )}
            </>
          ) : scanning ? (
            <div className="empty">
              <p className="empty-title">{t("scanningTitle")}</p>
              <p className="empty-hint">{t("scanningHint")}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === CLEANER_TAB.OUTPUT ? (
        <div className="panel output" {...panelProps(CLEANER_TAB.OUTPUT)}>
          <CleanLog lines={log} />
        </div>
      ) : null}
    </div>
  );
}
