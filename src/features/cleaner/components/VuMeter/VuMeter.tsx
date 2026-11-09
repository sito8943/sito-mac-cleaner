import type { CSSProperties } from "react";

import { classNames } from "@/shared/utils";
import { DIAL_VIEWBOX } from "./constants";
import { VuMeterProps } from "./types";
import { SEGMENTS, litSegments } from "./utils";

import "@/styles/components/VuMeter.css";

/** Arco de LEDs estilo equipo de música alrededor del botón central. */
export function VuMeter({ bytes, busy, children }: VuMeterProps) {
  const lit = litSegments(bytes);
  return (
    <div className={classNames("VuMeter", busy && "busy")}>
      <svg
        className="VuMeter-dial"
        viewBox={`0 0 ${DIAL_VIEWBOX} ${DIAL_VIEWBOX}`}
        aria-hidden
      >
        {SEGMENTS.map((segment) => (
          <line
            key={segment.index}
            className={classNames(
              "VuMeter-led",
              segment.level,
              segment.index < lit && "lit",
            )}
            // El retardo escalonado por LED hace el barrido de "cargando".
            style={{ "--led-index": segment.index } as CSSProperties}
            x1={segment.x1}
            y1={segment.y1}
            x2={segment.x2}
            y2={segment.y2}
          />
        ))}
      </svg>
      <div className="VuMeter-center">{children}</div>
    </div>
  );
}
