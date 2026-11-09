import { useEffect, useState } from "react";

import { t } from "@/lang";
import { Spinner } from "@/shared/components/elements/Spinner";
import { UnstyledButton } from "@/shared/components/elements/UnstyledButton";
import { classNames } from "@/shared/utils";
import { ARM_TIMEOUT_MS, LEVEL_SUFFIX } from "./constants";
import { DoomsdayButtonProps } from "./types";

import "@/styles/components/DoomsdayButton.css";

/**
 * Botón verde con tapa de seguridad: el primer clic levanta la tapa y el
 * segundo limpia. Hace de confirmación sin un diálogo de "¿seguro?".
 */
export function DoomsdayButton({
  disabled,
  busy,
  level,
  onFire,
  onArmedChange,
}: DoomsdayButtonProps) {
  const [armedState, setArmedState] = useState(false);
  // Deshabilitado = tapa cerrada, sin efecto que la resetee a destiempo.
  const armed = armedState && !disabled;

  useEffect(() => onArmedChange(armed), [armed, onArmedChange]);

  useEffect(() => {
    if (!armed) return;
    const id = setTimeout(() => setArmedState(false), ARM_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [armed]);

  const fire = () => {
    setArmedState(false);
    onFire();
  };

  return (
    <div
      className={classNames(
        "Doomsday",
        level,
        armed && "armed",
        disabled && "disabled",
      )}
    >
      <UnstyledButton
        className="Doomsday-button"
        disabled={!armed}
        aria-label={t("cleanNow")}
        onClick={fire}
      >
        {busy ? (
          <Spinner />
        ) : (
          <span>{`${t("doomsdayLabel")}${LEVEL_SUFFIX[level]}`}</span>
        )}
      </UnstyledButton>
      <UnstyledButton
        className="Doomsday-cover"
        disabled={disabled || armed}
        aria-label={t("liftCover")}
        // Levantada no debe robar el foco al botón que tapa.
        tabIndex={armed ? -1 : 0}
        onClick={() => setArmedState(true)}
      />
    </div>
  );
}
