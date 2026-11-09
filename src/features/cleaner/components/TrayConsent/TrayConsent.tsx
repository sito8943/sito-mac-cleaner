import { t } from "@/lang";
import { Button } from "@/shared/components/elements/Button";
import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  SHORTCUT_LABEL,
} from "@/shared/constants";
import { TrayConsentProps } from "./types";

import "@/styles/components/TrayConsent.css";

/** Banda superior: pide permiso antes de instalarse en la barra de menús. */
export function TrayConsent({ onAccept }: TrayConsentProps) {
  return (
    <section className="TrayConsent">
      <h2>{t("consentTitle")}</h2>
      <p>{t("consentText")}</p>
      <p className="hint">{t("shortcutHint", SHORTCUT_LABEL)}</p>
      <Button
        color={BUTTON_COLOR.PRIMARY}
        variant={BUTTON_VARIANT.SUBMIT}
        size={BUTTON_SIZE.SM}
        onClick={onAccept}
      >
        {t("consentAccept")}
      </Button>
    </section>
  );
}
