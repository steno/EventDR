import { addDaysISO, localDateISO } from "@/lib/event-dates";
import { isValidDeviceId } from "@/lib/device-id";

/** Firestore collection for per-venue daily share/save buckets. */
export const VENUE_ENGAGEMENT_COLLECTION = "venueEngagement";

/** Dedupe one share credit per device × event × calendar day. */
export const VENUE_SHARE_CREDITS_SUBCOLLECTION = "shareCredits";

export const ENGAGEMENT_SHARE_WEIGHT = 3;
export const ENGAGEMENT_SAVE_WEIGHT = 1;
/** Rolling window used for home Local / Visitor ranking. */
export const ENGAGEMENT_WINDOW_DAYS = 90;
/** Mild decay — recent activity counts more (~half after 30 days). */
export const ENGAGEMENT_HALF_LIFE_DAYS = 30;

export type VenueDayEngagement = {
  shares: number;
  saves: number;
};

export type VenueEngagementDays = Record<string, VenueDayEngagement>;

export type VenueEngagementScores = Record<string, number>;

export type VenueEngagementKind = "share" | "save";

const VENUE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EVENT_ID_PATTERN = /^[A-Za-z0-9_-]{1,160}$/;
const DAY_ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidVenueEngagementSlug(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 2 &&
    value.length <= 120 &&
    VENUE_SLUG_PATTERN.test(value)
  );
}

export function isValidEngagementEventId(value: unknown): value is string {
  return typeof value === "string" && EVENT_ID_PATTERN.test(value);
}

export function isVenueEngagementKind(
  value: unknown,
): value is VenueEngagementKind {
  return value === "share" || value === "save";
}

/** Re-export device check so API routes share one validator. */
export { isValidDeviceId as isValidEngagementDeviceId };

export function isEngagementDayISO(value: unknown): value is string {
  return typeof value === "string" && DAY_ISO_PATTERN.test(value);
}

/**
 * Exponential decay for a day bucket. `ageDays` 0 = today → 1;
 * `ENGAGEMENT_HALF_LIFE_DAYS` → 0.5.
 */
export function engagementDecay(ageDays: number): number {
  if (ageDays <= 0) return 1;
  return 2 ** (-ageDays / ENGAGEMENT_HALF_LIFE_DAYS);
}

/** Score one venue from daily share/save buckets (local calendar days). */
export function scoreVenueEngagement(
  days: VenueEngagementDays | null | undefined,
  now: Date = new Date(),
): number {
  if (!days) return 0;
  const today = localDateISO(now);
  const oldest = addDaysISO(today, -(ENGAGEMENT_WINDOW_DAYS - 1));
  let score = 0;

  for (const [day, bucket] of Object.entries(days)) {
    if (!isEngagementDayISO(day) || day < oldest || day > today) continue;
    const shares = Math.max(0, Number(bucket?.shares) || 0);
    const saves = Math.max(0, Number(bucket?.saves) || 0);
    if (shares === 0 && saves === 0) continue;
    const ageDays = Math.max(
      0,
      Math.round(
        (Date.parse(`${today}T12:00:00.000Z`) -
          Date.parse(`${day}T12:00:00.000Z`)) /
          86_400_000,
      ),
    );
    const decay = engagementDecay(ageDays);
    score +=
      (shares * ENGAGEMENT_SHARE_WEIGHT + saves * ENGAGEMENT_SAVE_WEIGHT) *
      decay;
  }

  return score;
}

/** Normalize a Firestore `days` map into countable buckets. */
export function normalizeEngagementDays(raw: unknown): VenueEngagementDays {
  if (!raw || typeof raw !== "object") return {};
  const out: VenueEngagementDays = {};
  for (const [day, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!isEngagementDayISO(day) || !value || typeof value !== "object") {
      continue;
    }
    const record = value as Record<string, unknown>;
    const shares = Math.max(0, Math.floor(Number(record.shares) || 0));
    const saves = Math.max(0, Math.floor(Number(record.saves) || 0));
    if (shares === 0 && saves === 0) continue;
    out[day] = { shares, saves };
  }
  return out;
}

/**
 * Drop day keys older than the ranking window (keeps Firestore docs bounded).
 */
export function pruneEngagementDays(
  days: VenueEngagementDays,
  now: Date = new Date(),
): VenueEngagementDays {
  const today = localDateISO(now);
  const oldest = addDaysISO(today, -(ENGAGEMENT_WINDOW_DAYS - 1));
  const pruned: VenueEngagementDays = {};
  for (const [day, bucket] of Object.entries(days)) {
    if (day < oldest || day > today) continue;
    pruned[day] = bucket;
  }
  return pruned;
}

export function shareCreditDocId(deviceId: string, eventId: string): string {
  return `${deviceId}__${eventId}`.slice(0, 700);
}
