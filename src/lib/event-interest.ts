/**
 * Anonymous "interested" counts — the Save heart doubles as interest.
 * Keyed by event id (stable across en/es/fr), one tap per device.
 */

export const EVENT_INTEREST_COLLECTION = "eventInterest";
export const EVENT_INTEREST_DEVICES_SUBCOLLECTION = "devices";

/** Below this, the public "N interested" line stays hidden. */
export const INTEREST_COUNT_DISPLAY_MIN = 3;

/** Max ids per POST (one-time backfill) or GET. */
export const INTEREST_BATCH_MAX = 50;

export type InterestAction = "add" | "remove";

export type InterestCounts = Record<string, number>;

const EVENT_ID_PATTERN = /^[A-Za-z0-9_-]{1,160}$/;
const DEVICE_ID_PATTERN = /^[A-Za-z0-9-]{16,64}$/;

export function isValidInterestEventId(id: unknown): id is string {
  return typeof id === "string" && EVENT_ID_PATTERN.test(id);
}

export function isValidInterestDeviceId(id: unknown): id is string {
  return typeof id === "string" && DEVICE_ID_PATTERN.test(id);
}

export function isInterestAction(value: unknown): value is InterestAction {
  return value === "add" || value === "remove";
}

/** Dedupe, validate, and cap a list of event ids from a request. */
export function normalizeInterestEventIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const ids = new Set<string>();
  for (const value of raw) {
    if (!isValidInterestEventId(value)) continue;
    ids.add(value);
    if (ids.size >= INTEREST_BATCH_MAX) break;
  }
  return [...ids];
}

export function shouldShowInterestCount(count: number | null | undefined): boolean {
  return typeof count === "number" && count >= INTEREST_COUNT_DISPLAY_MIN;
}
