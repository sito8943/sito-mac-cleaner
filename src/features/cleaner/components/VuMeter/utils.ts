import { BYTES_PER_GB } from "@/features/cleaner/constants";
import { meterLevel } from "@/features/cleaner/utils";
import {
  ARC_DEGREES,
  ARC_START_DEGREES,
  DIAL_CENTER,
  METER_MAX_GB,
  SEGMENT_COUNT,
  SEGMENT_INNER_RADIUS,
  SEGMENT_OUTER_RADIUS,
} from "./constants";
import { Segment } from "./types";

const GB_PER_SEGMENT = METER_MAX_GB / SEGMENT_COUNT;
const DEGREES_PER_SEGMENT = ARC_DEGREES / SEGMENT_COUNT;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** LEDs fijos del dial: posición y zona de color de cada uno (0° = arriba). */
export const SEGMENTS: readonly Segment[] = Array.from(
  { length: SEGMENT_COUNT },
  (_, index) => {
    const angle = toRadians(
      ARC_START_DEGREES + (index + 0.5) * DEGREES_PER_SEGMENT,
    );
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return {
      index,
      x1: DIAL_CENTER + SEGMENT_INNER_RADIUS * sin,
      y1: DIAL_CENTER - SEGMENT_INNER_RADIUS * cos,
      x2: DIAL_CENTER + SEGMENT_OUTER_RADIUS * sin,
      y2: DIAL_CENTER - SEGMENT_OUTER_RADIUS * cos,
      level: meterLevel(index * GB_PER_SEGMENT * BYTES_PER_GB),
    };
  },
);

/** LEDs encendidos: cualquier cantidad > 0 enciende el primero. */
export function litSegments(bytes: number): number {
  const gb = bytes / BYTES_PER_GB;
  return Math.min(SEGMENT_COUNT, Math.ceil(gb / GB_PER_SEGMENT));
}
