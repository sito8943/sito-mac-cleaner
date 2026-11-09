import { t } from "@/lang";
import { ALERT_SIREN_COUNT, SIREN } from "../../constants";

import "@/styles/components/AlertBanner.css";

const SIRENS = Array.from({ length: ALERT_SIREN_COUNT }, (_, index) => index);

/** Franja de zona roja con sirenas girando a ambos lados del título. */
export function AlertBanner() {
  const sirens = SIRENS.map((index) => (
    <span key={index} className="AlertBanner-siren" aria-hidden>
      {SIREN}
    </span>
  ));
  return (
    <aside className="AlertBanner" role="alert">
      <span className="AlertBanner-sirens">{sirens}</span>
      <strong>{t("alertTitle")}</strong>
      <span className="AlertBanner-sirens">{sirens}</span>
    </aside>
  );
}
