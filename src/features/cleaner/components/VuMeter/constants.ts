// Geometría del dial (unidades del viewBox SVG).
export const DIAL_VIEWBOX = 200;
export const DIAL_CENTER = DIAL_VIEWBOX / 2;
export const SEGMENT_INNER_RADIUS = 82;
export const SEGMENT_OUTER_RADIUS = 96;

/** LEDs del arco: 24 sobre 40 GB → verde 0–10, amarillo 10–30, rojo 30–40. */
export const SEGMENT_COUNT = 24;
export const METER_MAX_GB = 40;

/** Arco abierto por abajo, como la aguja de un equipo de música. */
export const ARC_DEGREES = 270;
export const ARC_START_DEGREES = -ARC_DEGREES / 2;
