import type { Event, EventOpinion } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import {
  SEED_EVENT_OPINIONS,
  eventSeriesKey,
} from "@/lib/event-opinions-seed";

export function areEventOpinionsEnabled(): boolean {
  const flag = (
    process.env.NEXT_PUBLIC_EVENT_OPINIONS_ENABLED ??
    process.env.EVENT_OPINIONS_ENABLED ??
    process.env.NEXT_PUBLIC_VENUE_ASSESSMENTS_ENABLED ??
    process.env.VENUE_ASSESSMENTS_ENABLED
  )
    ?.trim()
    .toLowerCase();
  if (flag === "0" || flag === "false" || flag === "off") return false;
  return true;
}

const byEventId = new Map<string, EventOpinion>();
const bySeriesKey = new Map<string, EventOpinion>();

for (const opinion of SEED_EVENT_OPINIONS) {
  if (opinion.eventId) byEventId.set(opinion.eventId, opinion);
  if (opinion.seriesKey) bySeriesKey.set(opinion.seriesKey, opinion);
}

export function resolveEventOpinionBody(
  opinion: EventOpinion,
  locale: Locale,
): string {
  return opinion.localized?.[locale] ?? opinion.body;
}

export function resolveEventOpinionPriceNote(
  opinion: EventOpinion,
  locale: Locale,
): string | null {
  const note =
    opinion.priceNoteLocalized?.[locale] ?? opinion.priceNote ?? null;
  return note?.trim() || null;
}

function formatRatingCite(rating: number, reviewCount?: number): string {
  const r = rating.toFixed(1);
  if (reviewCount != null && Number.isFinite(reviewCount)) {
    return `Google ${r} · ${reviewCount} reviews`;
  }
  return `Google ${r}`;
}

/**
 * Attach Google ★ rating (same chip as venue tips) when the opinion lacks one.
 */
export function withGoogleRating(
  opinion: EventOpinion,
  rating: { rating: number; reviewCount?: number } | null | undefined,
): EventOpinion {
  if (!rating || !Number.isFinite(rating.rating)) return opinion;
  if (typeof opinion.googleRating === "number") return opinion;

  return {
    ...opinion,
    googleRating: rating.rating,
    ...(typeof rating.reviewCount === "number"
      ? { googleReviewCount: rating.reviewCount }
      : {}),
    ratingCite:
      opinion.ratingCite?.trim() ||
      formatRatingCite(rating.rating, rating.reviewCount),
  };
}

/** Pull Google rating from a venue assessment payload (Places source). */
export function googleRatingFromAssessment(assessment: {
  sources?: { kind: string; rating?: number; reviewCount?: number }[];
} | null): { rating: number; reviewCount?: number } | null {
  const google = assessment?.sources?.find(
    (s) => s.kind === "google_places" && s.rating != null,
  );
  if (!google || typeof google.rating !== "number") return null;
  return {
    rating: google.rating,
    ...(typeof google.reviewCount === "number"
      ? { reviewCount: google.reviewCount }
      : {}),
  };
}

/**
 * Unique opinion for this event only — never falls back to venue tip templates.
 * Returns null when we have no researched take for this night/series.
 */
export function getEventOpinion(event: Event): EventOpinion | null {
  if (!areEventOpinionsEnabled()) return null;

  const byId = byEventId.get(event.id);
  if (byId) return byId;

  const series = eventSeriesKey({
    venueSlug: event.venueSlug,
    recurrence: event.recurrence,
    recurrenceDay: event.recurrenceDay,
    recurrenceDays: event.recurrenceDays,
  });
  if (series) {
    const bySeries = bySeriesKey.get(series);
    if (bySeries) return bySeries;
  }

  return null;
}
