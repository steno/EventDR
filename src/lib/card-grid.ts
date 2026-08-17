/**
 * Column math for CARD_GRID_CLASS (2 cols on phones, auto-fit minmax(220px)
 * from the `sm` breakpoint). Keep gaps in sync with page-shell.
 */

export const CARD_GRID_MIN_TRACK_PX = 220;
export const CARD_GRID_MOBILE_COLUMNS = 2;
export const CARD_GRID_SM_BREAKPOINT_PX = 640;
/** `sm:gap-3` — 0.75rem at a 16px root. */
export const CARD_GRID_GAP_PX = 12;

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
