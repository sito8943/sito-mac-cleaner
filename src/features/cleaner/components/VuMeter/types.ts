import type { ReactNode } from "react";

import type { MeterLevel } from "@/features/cleaner/constants";

export interface VuMeterProps {
  bytes: number;
  /** Animación de barrido mientras se analiza o limpia. */
  busy: boolean;
  /** Lo que va en el centro del dial (el botón del fin del mundo). */
  children: ReactNode;
}

export interface Segment {
  index: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  level: MeterLevel;
}
