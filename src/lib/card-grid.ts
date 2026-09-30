/**
 * Column math for CARD_GRID_CLASS (2 cols below xl, auto-fill minmax(220px)
 * from the `xl` breakpoint). Keep gaps in sync with page-shell.
 */

export const CARD_GRID_MIN_TRACK_PX = 220;
export const CARD_GRID_MOBILE_COLUMNS = 2;
/** Matches Tailwind `xl` (80rem at a 16px root) — same as home highlight rails. */
export const CARD_GRID_SM_BREAKPOINT_PX = 1280;
/** `xl:gap-3` — 0.75rem at a 16px root. */
export const CARD_GRID_GAP_PX = 12;

/** Span leftover last-row columns, or the full next row. */
export type GridFillSpan = number | "full";

export function countCardGridColumns(
  gridWidth: number,
  viewportWidth: number,
): number {
  if (viewportWidth < CARD_GRID_SM_BREAKPOINT_PX) {
    return CARD_GRID_MOBILE_COLUMNS;
  }
  return Math.max(
    1,
    Math.floor((gridWidth + CARD_GRID_GAP_PX) / (CARD_GRID_MIN_TRACK_PX + CARD_GRID_GAP_PX)),
  );
}

/** Empty cells on the last row (0 when the row is already full). */
export function cardGridRowRemainder(
  itemCount: number,
  columns: number,
): number {
  if (columns < 1 || itemCount < 1) return 0;
  const rem = itemCount % columns;
  return rem === 0 ? 0 : columns - rem;
}

/**
 * How many columns the last item should span so a short final row has no
 * empty cells (e.g. 3 cards in 2 columns → last spans 2).
 */
export function cardGridLastItemSpan(
  itemCount: number,
  columns: number,
): number {
  const empty = cardGridRowRemainder(itemCount, columns);
  return empty === 0 ? 1 : empty + 1;
}

/**
 * Per-item column spans for day-grouped card grids (Weekend tab). Day
 * headers are `col-span-full`, so each day restarts the row.
 *
 * Fill leftover cells only on the fixed 2-col (mobile / mid-width) grid —
 * a 1- or 3-card day otherwise leaves an awkward half-empty row. From `xl`
 * the shell uses `auto-fill` minmax tracks; stretching the last card there
 * turns a lone Sunday into a billboard. Leave desktop tiles at span 1 and
 * fill holes with “Your event here” pads instead (`cardGridDayGroupPadSpans`).
 */
export function cardGridDayGroupSpans(
  dayLengths: number[],
  columns: number,
): number[] {
  const spans: number[] = [];
  const fillHoles = columns <= CARD_GRID_MOBILE_COLUMNS;
  for (const length of dayLengths) {
    const lastSpan = fillHoles ? cardGridLastItemSpan(length, columns) : 1;
    for (let i = 0; i < length; i++) {
      spans.push(i === length - 1 ? lastSpan : 1);
    }
  }
  return spans;
}

/**
 * Desktop weekend day empties → pad column spans keyed by the last event
 * index of that day. Empty on the 2-col grid (events stretch instead).
 */
export function cardGridDayGroupPadSpans(
  dayLengths: number[],
  columns: number,
): Map<number, number> {
  const pads = new Map<number, number>();
  if (columns <= CARD_GRID_MOBILE_COLUMNS) return pads;
  let index = 0;
  for (const length of dayLengths) {
    if (length > 0) {
      const empty = cardGridRowRemainder(length, columns);
      if (empty > 0) pads.set(index + length - 1, empty);
    }
    index += length;
  }
  return pads;
}

/**
 * Raise a page cap so leftover columns fill with real events when more exist.
 * 12 items in 5 columns → 15, so the last row is complete before “More events”.
 */
export function fillCardGridPage(
  cap: number,
  total: number,
  columns: number,
): number {
  if (!Number.isFinite(cap) || columns < 1) return cap;
  const shown = Math.min(cap, total);
  const remainder = cardGridRowRemainder(shown, columns);
  if (remainder === 0) return shown;
  return Math.min(shown + remainder, total);
}
