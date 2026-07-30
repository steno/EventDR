/**
 * Fast ingest runs weekly against a Netlify gateway budget, so it can only
 * afford a fraction of the configured queries per run. Slices rotate by week
 * rather than always taking the head of a list, so sources further down are
 * still reached eventually instead of never running at all.
 */

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function ingestWeekIndex(now: Date = new Date()): number {
  return Math.floor(now.getTime() / WEEK_MS);
}

/** Take `size` items starting at a week-dependent offset, wrapping around. */
export function rotatingSlice<T>(
  items: readonly T[],
  size: number,
  now?: Date,
): T[] {
  if (items.length === 0 || size <= 0) return [];
  const take = Math.min(size, items.length);
  const start = (ingestWeekIndex(now) * take) % items.length;
  return Array.from(
    { length: take },
    (_, i) => items[(start + i) % items.length],
  );
}
