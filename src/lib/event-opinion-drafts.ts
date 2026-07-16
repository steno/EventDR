import type { Event, EventOpinion, PriceFeel, Venue } from "@/lib/types";
import {
  fetchPlaceDetails,
  findPlaceId,
  isGooglePlacesConfigured,
  type GooglePlaceDetails,
} from "@/lib/google-places";
import { getRecurringEvents } from "@/lib/recurring-events";
import { getEventOpinion, areEventOpinionsEnabled } from "@/lib/event-opinions";
import { eventSeriesKey } from "@/lib/event-opinions-seed";
import { getSeedVenue } from "@/lib/venues-seed";
import {
  getOpinionDraft,
  saveOpinionDraft,
  type EventOpinionDraft,
} from "@/lib/firebase/opinion-drafts";

const PRICE_FEELS: PriceFeel[] = [
  "free",
  "budget",
  "moderate",
  "upscale",
  "varies",
];

export function formatGoogleRatingCite(
  rating: number,
  reviewCount?: number,
): string {
  const r = rating.toFixed(1);
  if (reviewCount != null && Number.isFinite(reviewCount)) {
    return `Google ${r} · ${reviewCount} reviews`;
  }
  return `Google ${r}`;
}

function isPriceFeel(value: unknown): value is PriceFeel {
  return typeof value === "string" && PRICE_FEELS.includes(value as PriceFeel);
}

export interface DraftGenerationResult {
  eventId: string;
  seriesKey?: string;
  status: "drafted" | "skipped" | "failed";
  reason?: string;
  places?: EventOpinionDraft["places"];
  draft?: EventOpinionDraft;
}

export interface GenerateOpinionDraftsOptions {
  /** Max events to attempt this run. */
  limit?: number;
  /** Only these event ids (comma-separated upstream). */
  eventIds?: string[];
  /** Skip events that already have a draft/approved row. */
  skipExisting?: boolean;
  /** Force regenerate even when a draft exists (resets to draft). */
  force?: boolean;
}

/**
 * Pick recurring series that lack a seed opinion and have a venue we can rate.
 */
export function selectOpinionDraftCandidates(
  options?: GenerateOpinionDraftsOptions,
): Event[] {
  const events = getRecurringEvents("en");
  const idFilter = options?.eventIds?.length
    ? new Set(options.eventIds)
    : null;

  const seenSeries = new Set<string>();
  const out: Event[] = [];

  for (const event of events) {
    if (idFilter && !idFilter.has(event.id)) continue;
    if (getEventOpinion(event)) continue;
    if (!event.venueSlug && !event.venue) continue;

    const series =
      eventSeriesKey({
        venueSlug: event.venueSlug,
        recurrence: event.recurrence,
        recurrenceDay: event.recurrenceDay,
        recurrenceDays: event.recurrenceDays,
      }) ?? event.id;
    if (seenSeries.has(series)) continue;
    seenSeries.add(series);
    out.push(event);
  }

  const limit = options?.limit ?? 8;
  return out.slice(0, Math.max(1, limit));
}

async function resolvePlacesForVenue(
  venue: Venue | undefined,
  fallbackName: string,
): Promise<GooglePlaceDetails | null> {
  if (!isGooglePlacesConfigured()) return null;

  let placeId = venue?.googlePlaceId?.trim() || null;
  if (!placeId) {
    placeId = await findPlaceId(venue?.name ?? fallbackName, venue);
  }
  if (!placeId) return null;
  return fetchPlaceDetails(placeId);
}

interface LlmOpinionPayload {
  body: string;
  localized?: { en?: string; es?: string; fr?: string };
  priceFeel?: PriceFeel;
  priceNote?: string;
  priceNoteLocalized?: { en?: string; es?: string; fr?: string };
  skip?: boolean;
  skipReason?: string;
}

async function draftOpinionWithOpenAI(input: {
  event: Event;
  venueName: string;
  city: string;
  places: GooglePlaceDetails | null;
}): Promise<{ payload: LlmOpinionPayload | null; model: string; error?: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  if (!apiKey) {
    return { payload: null, model, error: "OPENAI_API_KEY missing" };
  }

  const reviewBlock =
    input.places?.reviews
      .map(
        (r, i) =>
          `${i + 1}. (${r.rating ?? "?"}/5) ${r.text.slice(0, 400)}`,
      )
      .join("\n") || "(no review texts)";

  const ratingLine =
    input.places?.rating != null
      ? `Google rating: ${input.places.rating.toFixed(1)} (${input.places.userRatingCount ?? "?"} reviews)`
      : "Google rating: unknown";

  const system = `You write unique guest-facing opinions for ONE recurring night/event on the North Coast of the Dominican Republic (Puerto Plata, Sosúa, Cabarete, Costambar, Playa Dorada).

Rules:
- Write a warm POP tip about THIS night/series — same voice as venue tips ("When guests ask…", "we actually send people to", "honestly, we get why").
- Do NOT restate the event description (venue name + what happens + genre/location list). The listing already shows that.
- Prefer 1 short sentence (max 2). Unique to this night — never a generic blurb that could paste onto every night.
- 1–2 sentences in English for "body". Also provide Spanish (es) and French (fr) in localized.
- Include priceFeel when evidence supports it: free | budget | moderate | upscale | varies. Prefer skip over guessing.
- priceNote: short EN note about cover/drinks/spend; localized es/fr when present.
- Use Google reviews only as evidence of crowd/vibe/service/price feel — do not invent facts not supported by reviews or the event description.
- If reviews are too thin or only say "nice place" with nothing night-specific, set "skip": true and "skipReason".
- Return ONLY valid JSON.`;

  const user = `Event:
- id: ${input.event.id}
- title: ${input.event.title}
- description: ${input.event.description}
- recurrence: ${input.event.recurrence ?? "n/a"} day=${input.event.recurrenceDay ?? "n/a"}
- venue: ${input.venueName} (${input.city})
- time: ${input.event.time ?? "n/a"}

${ratingLine}

Recent Google reviews:
${reviewBlock}

JSON shape:
{
  "skip": false,
  "body": "...",
  "localized": { "en": "...", "es": "...", "fr": "..." },
  "priceFeel": "budget|moderate|upscale|free|varies",
  "priceNote": "...",
  "priceNoteLocalized": { "en": "...", "es": "...", "fr": "..." }
}
Or { "skip": true, "skipReason": "..." }`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      return { payload: null, model, error: `OpenAI ${res.status}: ${errText.slice(0, 200)}` };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) return { payload: null, model, error: "Empty OpenAI response" };

    const parsed = JSON.parse(raw) as LlmOpinionPayload;
    if (parsed.skip) {
      return { payload: parsed, model };
    }
    if (!parsed.body?.trim()) {
      return { payload: null, model, error: "Missing body in model JSON" };
    }
    if (parsed.priceFeel && !isPriceFeel(parsed.priceFeel)) {
      delete parsed.priceFeel;
    }
    return { payload: parsed, model };
  } catch (err) {
    return {
      payload: null,
      model,
      error: err instanceof Error ? err.message : "OpenAI request failed",
    };
  }
}

export async function generateOpinionDraftForEvent(
  event: Event,
  options?: { force?: boolean; skipExisting?: boolean },
): Promise<DraftGenerationResult> {
  const seriesKey =
    eventSeriesKey({
      venueSlug: event.venueSlug,
      recurrence: event.recurrence,
      recurrenceDay: event.recurrenceDay,
      recurrenceDays: event.recurrenceDays,
    }) ?? undefined;

  if (getEventOpinion(event)) {
    return {
      eventId: event.id,
      seriesKey,
      status: "skipped",
      reason: "seed_opinion_exists",
    };
  }

  const existing = await getOpinionDraft(event.id);
  if (
    existing &&
    !options?.force &&
    (options?.skipExisting !== false) &&
    (existing.status === "draft" || existing.status === "approved")
  ) {
    return {
      eventId: event.id,
      seriesKey,
      status: "skipped",
      reason: `existing_${existing.status}`,
      places: existing.places,
      draft: existing,
    };
  }

  const venue = event.venueSlug ? getSeedVenue(event.venueSlug) : undefined;
  const venueName = venue?.name ?? event.venue ?? event.location;
  const city = venue?.city ?? event.location;

  const places = await resolvePlacesForVenue(venue, venueName);
  if (!places || places.rating == null) {
    return {
      eventId: event.id,
      seriesKey,
      status: "skipped",
      reason: places ? "places_missing_rating" : "places_unresolved",
    };
  }

  if (places.reviews.length < 2) {
    return {
      eventId: event.id,
      seriesKey,
      status: "skipped",
      reason: "insufficient_reviews",
      places: {
        placeId: places.placeId,
        rating: places.rating,
        reviewCount: places.userRatingCount,
        reviewSampleCount: places.reviews.length,
      },
    };
  }

  const { payload, model, error } = await draftOpinionWithOpenAI({
    event,
    venueName,
    city,
    places,
  });

  if (error || !payload) {
    return {
      eventId: event.id,
      seriesKey,
      status: "failed",
      reason: error ?? "llm_failed",
      places: {
        placeId: places.placeId,
        rating: places.rating,
        reviewCount: places.userRatingCount,
        reviewSampleCount: places.reviews.length,
      },
    };
  }

  if (payload.skip) {
    return {
      eventId: event.id,
      seriesKey,
      status: "skipped",
      reason: payload.skipReason ?? "model_skipped",
      places: {
        placeId: places.placeId,
        rating: places.rating,
        reviewCount: places.userRatingCount,
        reviewSampleCount: places.reviews.length,
      },
    };
  }

  const now = new Date().toISOString();
  const ratingCite = formatGoogleRatingCite(
    places.rating,
    places.userRatingCount,
  );

  const draft: EventOpinionDraft = {
    eventId: event.id,
    seriesKey,
    body: payload.body.trim(),
    localized: payload.localized,
    priceFeel: payload.priceFeel,
    priceNote: payload.priceNote,
    priceNoteLocalized: payload.priceNoteLocalized,
    attribution: "POP research · Google reviews",
    ratingCite,
    googleRating: places.rating,
    googleReviewCount: places.userRatingCount,
    researchNotes: `LLM draft from Places ${places.placeId}; not published until approved.`,
    updatedAt: now,
    status: "draft",
    places: {
      placeId: places.placeId,
      rating: places.rating,
      reviewCount: places.userRatingCount,
      reviewSampleCount: places.reviews.length,
    },
    model,
    generatedAt: now,
  };

  const saved = await saveOpinionDraft(draft);
  if (!saved) {
    return {
      eventId: event.id,
      seriesKey,
      status: "failed",
      reason: "firestore_save_failed",
      places: draft.places,
      draft,
    };
  }

  return {
    eventId: event.id,
    seriesKey,
    status: "drafted",
    places: draft.places,
    draft,
  };
}

export async function generateOpinionDrafts(
  options?: GenerateOpinionDraftsOptions,
): Promise<{
  enabled: boolean;
  placesConfigured: boolean;
  openaiConfigured: boolean;
  results: DraftGenerationResult[];
}> {
  const candidates = selectOpinionDraftCandidates(options);
  const results: DraftGenerationResult[] = [];

  for (const event of candidates) {
    results.push(
      await generateOpinionDraftForEvent(event, {
        force: options?.force,
        skipExisting: options?.skipExisting,
      }),
    );
  }

  return {
    enabled: areEventOpinionsEnabled(),
    placesConfigured: isGooglePlacesConfigured(),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()),
    results,
  };
}

/** Map an approved draft (or any draft) to a public EventOpinion. */
export function draftToPublicOpinion(draft: EventOpinionDraft): EventOpinion {
  return {
    eventId: draft.eventId,
    seriesKey: draft.seriesKey,
    body: draft.body,
    localized: draft.localized,
    priceFeel: draft.priceFeel,
    priceNote: draft.priceNote,
    priceNoteLocalized: draft.priceNoteLocalized,
    attribution: draft.attribution,
    ratingCite: draft.ratingCite,
    googleRating: draft.googleRating ?? draft.places?.rating,
    googleReviewCount: draft.googleReviewCount ?? draft.places?.reviewCount,
    researchNotes: draft.researchNotes,
    updatedAt: draft.updatedAt,
  };
}
