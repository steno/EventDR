import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import type { Event, EventCategory, EventFormat, Venue } from "@/lib/types";
import type { LocalizedText } from "@/lib/localized-text";
import {
  eventInCategory,
  getEventCategoryList,
  withResolvedCategories,
} from "@/lib/categorize";
import { sanitizeEventPlaceFields } from "@/lib/event-location";
import { normalizeLineup } from "@/lib/event-lineup";
import { applyCuratedEventPatch } from "@/lib/curated-events";
import { resolveEventCoords } from "@/lib/event-coords";
import { translateEventCopy } from "@/lib/translate-event";
import { getVenueImageUrl } from "@/lib/venue-images";
import { SEED_VENUES } from "@/lib/venues-seed";
import {
  findNearDuplicate,
  mergeIngestIntoExisting,
} from "@/lib/ingest-dedupe";
import { sourceEventImageUrl } from "@/lib/ingest-images";
import { getFirestoreDb, isFirebaseConfigured } from "./admin";

/** Process-local cache — cuts repeat full-collection reads on Netlify instances. */
const APPROVED_EVENTS_CACHE_TTL_MS = 12 * 60 * 1000;

let approvedEventsCache: { events: Event[]; fetchedAt: number } | null = null;
let approvedEventsInflight: Promise<Event[]> | null = null;

export function invalidateApprovedEventsCache(): void {
  approvedEventsCache = null;
  approvedEventsInflight = null;
}

async function loadAllApprovedEvents(): Promise<Event[]> {
  const now = Date.now();
  if (
    approvedEventsCache &&
    now - approvedEventsCache.fetchedAt < APPROVED_EVENTS_CACHE_TTL_MS
  ) {
    return approvedEventsCache.events;
  }

  if (approvedEventsInflight) return approvedEventsInflight;

  approvedEventsInflight = (async () => {
    const db = getFirestoreDb();
    if (!db) return [];

    const snap = await db
      .collection("events")
      .where("status", "==", "approved")
      .get();

    const events = snap.docs.map((doc) => docToEvent(doc.id, doc.data()));
    events.sort((a, b) => a.date.localeCompare(b.date));
    approvedEventsCache = { events, fetchedAt: Date.now() };
    return events;
  })().finally(() => {
    approvedEventsInflight = null;
  });

  return approvedEventsInflight;
}

function readLocalizedText(data: DocumentData, field: string): LocalizedText | undefined {
  const raw = data[field];
  if (!raw || typeof raw !== "object") return undefined;

  const record = raw as Record<string, unknown>;
  const result: LocalizedText = {};
  for (const locale of ["en", "es", "fr"] as const) {
    if (typeof record[locale] === "string") {
      result[locale] = record[locale] as string;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function docToEvent(id: string, data: DocumentData): Event {
  const titles = readLocalizedText(data, "titles");
  const descriptions = readLocalizedText(data, "descriptions");

  const event: Event = {
    id,
    title: (titles?.en as string | undefined) ?? (data.title as string),
    description:
      (descriptions?.en as string | undefined) ?? (data.description as string),
    date: data.date as string,
    endDate: (data.endDate as string | null) ?? undefined,
    time: (data.time as string | null) ?? undefined,
    location: data.location as string,
    address: (data.address as string | null) ?? undefined,
    venue: (data.venueName as string | null) ?? undefined,
    venueSlug: (data.venueSlug as string | null) ?? undefined,
    category: data.category as EventCategory,
    categories: Array.isArray(data.categories)
      ? (data.categories as EventCategory[])
      : undefined,
    format: data.format as EventFormat,
    trending: Boolean(data.trending),
    sourceUrl: (data.sourceUrl as string | null) ?? undefined,
    ticketUrl: (data.ticketUrl as string | null) ?? undefined,
    isFree: data.isFree === true ? true : data.isFree === false ? false : undefined,
    admissionPrice: (data.admissionPrice as string | null) ?? undefined,
    callForPricing:
      data.callForPricing === true
        ? true
        : data.callForPricing === false
          ? false
          : undefined,
    imageEmoji: (data.imageEmoji as string | null) ?? undefined,
    imageUrl: (data.imageUrl as string | null) ?? undefined,
    lineup: normalizeLineup(data.lineup),
    recurrence: data.recurrence as Event["recurrence"],
    recurrenceDay: (data.recurrenceDay as number | null) ?? undefined,
    recurrenceDays: (data.recurrenceDays as number[] | null) ?? undefined,
    lat: (data.lat as number | null) ?? undefined,
    lng: (data.lng as number | null) ?? undefined,
    communitySubmitted:
      data.sourceType === "community" ||
      data.sourceType === "instagram" ||
      data.sourceType === "whatsapp",
    sourceType: data.sourceType as Event["sourceType"],
    status: data.status as Event["status"],
    localized:
      titles || descriptions
        ? {
            title: titles ?? { en: data.title as string },
            description: descriptions ?? { en: data.description as string },
          }
        : undefined,
  };
  return applyCuratedEventPatch(
    withResolvedCategories(sanitizeEventPlaceFields(event)),
  );
}

function docToVenue(slug: string, data: DocumentData): Venue {
  return {
    slug,
    name: data.name as string,
    city: data.city as string,
    description: (data.description as string | null) ?? "",
    lat: data.lat as number,
    lng: data.lng as number,
    emoji: (data.emoji as string | null) ?? "📍",
    instagram: (data.instagram as string | null) ?? undefined,
    website: (data.website as string | null) ?? undefined,
    phone: (data.phone as string | null) ?? undefined,
    googlePlaceId: (data.googlePlaceId as string | null) ?? undefined,
    googleRating:
      typeof data.googleRating === "number" && Number.isFinite(data.googleRating)
        ? data.googleRating
        : undefined,
    googleReviewCount:
      typeof data.googleReviewCount === "number" &&
      Number.isFinite(data.googleReviewCount)
        ? data.googleReviewCount
        : undefined,
    googleRatingFetchedAt:
      typeof data.googleRatingFetchedAt === "string"
        ? data.googleRatingFetchedAt
        : undefined,
    googleReviews: Array.isArray(data.googleReviews)
      ? (data.googleReviews as { text?: unknown; rating?: unknown }[])
          .flatMap((r) => {
            const text = typeof r?.text === "string" ? r.text.trim() : "";
            if (!text) return [];
            const review: { text: string; rating?: number } = { text };
            if (typeof r.rating === "number" && Number.isFinite(r.rating)) {
              review.rating = r.rating;
            }
            return [review];
          })
          .slice(0, 5)
      : undefined,
    googleReviewsFetchedAt:
      typeof data.googleReviewsFetchedAt === "string"
        ? data.googleReviewsFetchedAt
        : undefined,
    temporarilyClosed:
      typeof data.temporarilyClosed === "boolean"
        ? data.temporarilyClosed
        : undefined,
  };
}

function eventToFirestore(
  event: Event,
  sourceType: string,
  status: string,
): Record<string, unknown> {
  const titles = event.localized?.title ?? { en: event.title };
  const descriptions = event.localized?.description ?? { en: event.description };

  return {
    title: titles.en ?? event.title,
    description: descriptions.en ?? event.description,
    titles,
    descriptions,
    date: event.date,
    endDate: event.endDate ?? null,
    time: event.time ?? null,
    location: event.location,
    address: event.address ?? null,
    venueSlug: event.venueSlug ?? null,
    venueName: event.venue ?? null,
    category: event.category,
    categories: event.categories?.length ? event.categories : null,
    searchCategories: getEventCategoryList(event),
    format: event.format,
    trending: event.trending ?? false,
    sourceUrl: event.sourceUrl ?? null,
    ticketUrl: event.ticketUrl ?? null,
    isFree: event.isFree ?? null,
    admissionPrice: event.admissionPrice ?? null,
    callForPricing: event.callForPricing ?? null,
    sourceType,
    imageEmoji: event.imageEmoji ?? "📌",
    imageUrl: event.imageUrl ?? null,
    lineup: event.lineup?.length ? event.lineup : null,
    recurrence: event.recurrence ?? null,
    recurrenceDay: event.recurrenceDay ?? null,
    recurrenceDays: event.recurrenceDays ?? null,
    lat: event.lat ?? null,
    lng: event.lng ?? null,
    status,
    createdAt: FieldValue.serverTimestamp(),
  };
}

/** Upsert seed venues into Firestore. Use from cron/seed routes only — not on read paths. */
export async function syncSeedVenues(options?: {
  /** When true (default), only write venues missing from Firestore. */
  missingOnly?: boolean;
  /** When true (default with missingOnly: false), refresh stored event coordinates. */
  refreshEventCoords?: boolean;
}): Promise<number> {
  const db = getFirestoreDb();
  if (!db) return 0;

  const missingOnly = options?.missingOnly !== false;
  let venues = SEED_VENUES;
  if (missingOnly) {
    const snap = await db.collection("venues").get();
    const existing = new Set(snap.docs.map((doc) => doc.id));
    venues = SEED_VENUES.filter((venue) => !existing.has(venue.slug));
    if (venues.length === 0) return 0;
  }

  const batch = db.batch();
  for (const venue of venues) {
    const ref = db.collection("venues").doc(venue.slug);
    const curatedImage = getVenueImageUrl(venue.slug);
    batch.set(
      ref,
      {
        name: venue.name,
        city: venue.city,
        description: venue.description,
        lat: venue.lat,
        lng: venue.lng,
        emoji: venue.emoji ?? "📍",
        instagram: venue.instagram ?? null,
        website: venue.website ?? null,
        phone: venue.phone ?? null,
        ...(venue.googlePlaceId
          ? { googlePlaceId: venue.googlePlaceId }
          : {}),
        ...(typeof venue.temporarilyClosed === "boolean"
          ? { temporarilyClosed: venue.temporarilyClosed }
          : {}),
        ...(curatedImage ? { imageUrl: curatedImage } : {}),
      },
      { merge: true },
    );
  }
  await batch.commit();

  const shouldRefreshCoords = options?.refreshEventCoords ?? !missingOnly;
  if (shouldRefreshCoords) {
    await refreshEventCoordsFromVenues();
  }

  return venues.length;
}

/** Rewrite Firestore event lat/lng from canonical seed venue coordinates. */
export async function refreshEventCoordsFromVenues(): Promise<number> {
  const db = getFirestoreDb();
  if (!db) return 0;

  const snap = await db.collection("events").get();
  let updated = 0;
  let batch = db.batch();
  let ops = 0;

  for (const doc of snap.docs) {
    const event = docToEvent(doc.id, doc.data());
    const coords = resolveEventCoords(event);
    if (!coords) continue;

    const data = doc.data();
    if (data.lat === coords.lat && data.lng === coords.lng) continue;

    batch.update(doc.ref, { lat: coords.lat, lng: coords.lng });
    updated++;
    ops++;

    if (ops >= 400) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }

  if (ops > 0) await batch.commit();
  return updated;
}

export async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const db = getFirestoreDb();
    if (!db) return null;

    const doc = await db.collection("events").doc(id).get();
    if (!doc.exists) return null;

    const event = docToEvent(doc.id, doc.data()!);
    if (event.status === "rejected" || event.status === "pending") return null;
    return event;
  } catch (error) {
    console.error("fetchEventById failed:", id, error);
    return null;
  }
}

/** Load events by id regardless of moderation status (cron / enrich). */
export async function fetchEventsByIds(ids: string[]): Promise<Event[]> {
  const db = getFirestoreDb();
  if (!db || ids.length === 0) return [];

  const unique = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  const events: Event[] = [];
  for (const id of unique) {
    try {
      const doc = await db.collection("events").doc(id).get();
      if (!doc.exists) continue;
      events.push(docToEvent(doc.id, doc.data()!));
    } catch (error) {
      console.error("fetchEventsByIds failed:", id, error);
    }
  }
  return events;
}

/** Approved events that still need a photo (post-approve backfill). */
export async function fetchApprovedEventsMissingImages(
  limit = 8,
): Promise<Event[]> {
  try {
    const events = await loadAllApprovedEvents();
    return events
      .filter((e) => !e.imageUrl?.trim())
      .sort((a, b) => b.id.localeCompare(a.id))
      .slice(0, Math.max(1, limit));
  } catch (error) {
    console.error("fetchApprovedEventsMissingImages failed:", error);
    return [];
  }
}

export async function fetchApprovedEvents(options?: {
  category?: EventCategory;
  venueSlug?: string;
  locale?: string;
}): Promise<Event[]> {
  try {
    let events = await loadAllApprovedEvents();

    // Filter in memory so category/venue pages share one cached collection read.
    if (options?.category) {
      events = events.filter((e) => eventInCategory(e, options.category!));
    }
    if (options?.venueSlug) {
      events = events.filter((e) => e.venueSlug === options.venueSlug);
    }

    return events;
  } catch (error) {
    console.error("fetchApprovedEvents failed:", error);
    return [];
  }
}

export async function fetchPendingEvents(): Promise<Event[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  const snap = await db.collection("events").where("status", "==", "pending").get();

  return snap.docs
    .map((doc) => docToEvent(doc.id, doc.data()))
    .sort((a, b) => b.id.localeCompare(a.id));
}

export async function insertPendingEvent(
  event: Event,
  sourceType: string = "community",
): Promise<Event | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    await db
      .collection("events")
      .doc(event.id)
      .set(eventToFirestore(event, sourceType, "pending"));
    return { ...event, status: "pending" };
  } catch (err) {
    console.error("insertPendingEvent:", err);
    return null;
  }
}

export async function patchEventFields(
  id: string,
  fields: Record<string, unknown>,
): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  const update: Record<string, unknown> = {};
  if ("sourceUrl" in fields) update.sourceUrl = fields.sourceUrl ?? null;
  if ("ticketUrl" in fields) update.ticketUrl = fields.ticketUrl ?? null;
  if ("isFree" in fields) update.isFree = fields.isFree ?? null;
  if ("admissionPrice" in fields) update.admissionPrice = fields.admissionPrice ?? null;
  if ("callForPricing" in fields) update.callForPricing = fields.callForPricing ?? null;
  if ("address" in fields) update.address = fields.address ?? null;
  if ("location" in fields) update.location = fields.location ?? null;
  if ("endDate" in fields) update.endDate = fields.endDate ?? null;
  if ("description" in fields) update.description = fields.description ?? null;
  if ("venueSlug" in fields) update.venueSlug = fields.venueSlug ?? null;
  if ("time" in fields) update.time = fields.time ?? null;
  if ("title" in fields) update.title = fields.title ?? null;
  if ("imageUrl" in fields) update.imageUrl = fields.imageUrl ?? null;
  if ("lat" in fields) update.lat = fields.lat ?? null;
  if ("lng" in fields) update.lng = fields.lng ?? null;
  if ("lineup" in fields) {
    update.lineup = Array.isArray(fields.lineup) ? fields.lineup : null;
  }
  if ("venue" in fields || "venueName" in fields) {
    update.venueName = fields.venue ?? fields.venueName ?? null;
  }

  if (Object.keys(update).length === 0) return false;

  try {
    await db.collection("events").doc(id).update(update);
    invalidateApprovedEventsCache();
    return true;
  } catch (err) {
    console.error("patchEventFields:", err);
    return false;
  }
}

export async function deleteEvent(id: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    await db.collection("events").doc(id).delete();
    invalidateApprovedEventsCache();
    return true;
  } catch (err) {
    console.error("deleteEvent:", err);
    return false;
  }
}

export async function moderateEvent(
  id: string,
  status: "approved" | "rejected",
): Promise<boolean> {
  if (status === "rejected") {
    return updateEventStatus(id, "rejected");
  }
  return approveEvent(id);
}

async function updateEventStatus(
  id: string,
  status: "approved" | "rejected",
): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    await db.collection("events").doc(id).update({ status });
    invalidateApprovedEventsCache();
    return true;
  } catch (err) {
    console.error("updateEventStatus:", err);
    return false;
  }
}

export async function approveEvent(id: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const ref = db.collection("events").doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;

    const event = docToEvent(doc.id, doc.data()!);
    const translated = await translateEventCopy(event.title, event.description);

    const update: Record<string, unknown> = { status: "approved" };
    if (translated) {
      update.titles = translated.title;
      update.descriptions = translated.description;
      update.title = translated.title.en ?? event.title;
      update.description = translated.description.en ?? event.description;
    }

    // Always try to attach a photo if the pending row still lacks one.
    if (!event.imageUrl?.trim()) {
      const imageUrl = await sourceEventImageUrl(
        event.id,
        [event.sourceUrl, event.ticketUrl],
        `${event.title} ${event.venue ?? ""} ${event.location}`,
      );
      if (imageUrl) update.imageUrl = imageUrl;
    }

    // Link venue slug + coords when missing.
    if (!event.venueSlug?.trim()) {
      try {
        const { resolveEventVenue } = await import("@/lib/ingest-venue");
        const resolved = await resolveEventVenue(event);
        if (resolved.venueSlug) update.venueSlug = resolved.venueSlug;
        if (resolved.venue) update.venueName = resolved.venue;
        if (typeof resolved.lat === "number") update.lat = resolved.lat;
        if (typeof resolved.lng === "number") update.lng = resolved.lng;
      } catch (err) {
        console.warn("approveEvent: venue resolve skipped", id, err);
      }
    }

    await ref.update(update);
    invalidateApprovedEventsCache();

    // Draft a POP opinion for the newly approved event (never auto-published).
    try {
      const { generateOpinionDraftForEvent } = await import(
        "@/lib/event-opinion-drafts"
      );
      await generateOpinionDraftForEvent(
        { ...event, ...(update.imageUrl ? { imageUrl: String(update.imageUrl) } : {}) },
        { skipExisting: true, allowWithoutPlaces: true },
      );
    } catch (err) {
      console.warn("approveEvent: opinion draft skipped", id, err);
    }

    return true;
  } catch (err) {
    console.error("approveEvent:", err);
    return false;
  }
}

export type InsertIngestedResult = {
  upserted: number;
  merged: number;
  skippedRejected: number;
};

/**
 * Upsert crawled events for moderation.
 * Near-duplicates of pending/approved rows are merged into the existing id
 * (overwrite) instead of creating clone pending cards.
 */
export async function insertIngestedEvents(
  events: Event[],
): Promise<InsertIngestedResult> {
  const db = getFirestoreDb();
  if (!db || events.length === 0) {
    return { upserted: 0, merged: 0, skippedRejected: 0 };
  }

  const [pending, approved] = await Promise.all([
    fetchPendingEvents(),
    fetchApprovedEvents(),
  ]);
  const known = [...pending, ...approved];

  let upserted = 0;
  let merged = 0;
  let skippedRejected = 0;

  for (const event of events) {
    const near = findNearDuplicate(event, known);
    const targetId = near?.id ?? event.id;
    const isMergeIntoOther =
      Boolean(near) && near!.reason === "near_title" && near!.id !== event.id;

    const ref = db.collection("events").doc(targetId);
    const existingDoc = await ref.get();

    if (existingDoc.exists) {
      const existing = docToEvent(existingDoc.id, existingDoc.data()!);
      if (existing.status === "rejected") {
        skippedRejected++;
        continue;
      }

      const mergedEvent = mergeIngestIntoExisting(existing, {
        ...event,
        id: existing.id,
      });
      const data = eventToFirestore(
        mergedEvent,
        mergedEvent.sourceType ?? "crawl",
        existing.status ?? "pending",
      );
      const { createdAt: _, ...withoutCreated } = data;
      await ref.set(withoutCreated, { merge: true });

      const idx = known.findIndex((e) => e.id === existing.id);
      if (idx >= 0) known[idx] = { ...mergedEvent, status: existing.status };
      else known.push({ ...mergedEvent, status: existing.status });

      if (isMergeIntoOther) merged++;
      else upserted++;
      continue;
    }

    await ref.set(eventToFirestore(event, event.sourceType ?? "crawl", "pending"));
    known.push({ ...event, id: targetId, status: "pending" });
    upserted++;
  }

  invalidateApprovedEventsCache();
  return { upserted, merged, skippedRejected };
}

/** Upsert events as approved (idempotent). Used for curated Facebook discoveries. */
export async function upsertApprovedEvents(
  events: Event[],
  sourceType: string = "crawl",
): Promise<number> {
  const db = getFirestoreDb();
  if (!db || events.length === 0) return 0;

  let upserted = 0;
  for (const event of events) {
    const ref = db.collection("events").doc(event.id);
    const existing = await ref.get();
    const data = eventToFirestore(event, sourceType, "approved");

    if (existing.exists) {
      const { createdAt: _, ...withoutCreated } = data;
      await ref.set(withoutCreated, { merge: true });
    } else {
      await ref.set(data);
    }
    upserted++;
  }
  invalidateApprovedEventsCache();
  return upserted;
}

export async function fetchVenues(): Promise<Venue[]> {
  try {
    const db = getFirestoreDb();
    if (!db) return [];

    const snap = await db.collection("venues").orderBy("name").get();
    return snap.docs.map((doc) => docToVenue(doc.id, doc.data()));
  } catch (error) {
    console.error("fetchVenues failed:", error);
    return [];
  }
}

export async function fetchVenueBySlug(slug: string): Promise<Venue | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const doc = await db.collection("venues").doc(slug).get();
  if (!doc.exists) return null;
  const data = doc.data();
  if (!data) return null;
  return docToVenue(doc.id, data);
}

/** Upsert a single venue (ingest-created or seed sync of one row). */
export async function upsertVenue(venue: Venue): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const curatedImage = getVenueImageUrl(venue.slug);
    await db
      .collection("venues")
      .doc(venue.slug)
      .set(
        {
          name: venue.name,
          city: venue.city,
          description: venue.description,
          lat: venue.lat,
          lng: venue.lng,
          emoji: venue.emoji ?? "📍",
          instagram: venue.instagram ?? null,
          website: venue.website ?? null,
          phone: venue.phone ?? null,
          ...(venue.googlePlaceId
            ? { googlePlaceId: venue.googlePlaceId }
            : {}),
          ...(typeof venue.googleRating === "number"
            ? {
                googleRating: venue.googleRating,
                googleReviewCount: venue.googleReviewCount ?? null,
                googleRatingFetchedAt:
                  venue.googleRatingFetchedAt ?? new Date().toISOString(),
              }
            : {}),
          ...(typeof venue.temporarilyClosed === "boolean"
            ? { temporarilyClosed: venue.temporarilyClosed }
            : {}),
          ...(curatedImage ? { imageUrl: curatedImage } : {}),
        },
        { merge: true },
      );
    return true;
  } catch (err) {
    console.error("upsertVenue:", err);
    return false;
  }
}

/** Persist a resolved Google place_id without rewriting other venue fields. */
export async function patchVenueGooglePlaceId(
  slug: string,
  googlePlaceId: string,
): Promise<boolean> {
  return patchVenueGooglePlacesSnapshot(slug, { googlePlaceId });
}

/** Persist place_id and/or a Place Details snapshot (rating and/or reviews). */
export async function patchVenueGooglePlacesSnapshot(
  slug: string,
  snapshot: {
    googlePlaceId?: string;
    googleRating?: number;
    googleReviewCount?: number;
    googleRatingFetchedAt?: string;
    googleReviews?: { text: string; rating?: number }[];
    googleReviewsFetchedAt?: string;
  },
): Promise<boolean> {
  if (!slug.trim()) return false;
  const db = getFirestoreDb();
  if (!db) return false;

  const patch: Record<string, unknown> = {};
  const placeId = snapshot.googlePlaceId?.trim();
  if (placeId) patch.googlePlaceId = placeId;
  if (
    typeof snapshot.googleRating === "number" &&
    Number.isFinite(snapshot.googleRating)
  ) {
    patch.googleRating = snapshot.googleRating;
    if (
      typeof snapshot.googleReviewCount === "number" &&
      Number.isFinite(snapshot.googleReviewCount)
    ) {
      patch.googleReviewCount = snapshot.googleReviewCount;
    }
    patch.googleRatingFetchedAt =
      snapshot.googleRatingFetchedAt?.trim() || new Date().toISOString();
  }
  if (Array.isArray(snapshot.googleReviews)) {
    const reviews = snapshot.googleReviews
      .map((r) => {
        const text = r.text?.trim();
        if (!text) return null;
        return {
          text: text.slice(0, 800),
          ...(typeof r.rating === "number" && Number.isFinite(r.rating)
            ? { rating: r.rating }
            : {}),
        };
      })
      .filter((r): r is { text: string; rating?: number } => r != null)
      .slice(0, 5);
    patch.googleReviews = reviews;
    patch.googleReviewsFetchedAt =
      snapshot.googleReviewsFetchedAt?.trim() || new Date().toISOString();
  }
  if (Object.keys(patch).length === 0) return false;

  try {
    await db.collection("venues").doc(slug).set(patch, { merge: true });
    return true;
  } catch (err) {
    console.error("patchVenueGooglePlacesSnapshot:", err);
    return false;
  }
}

export async function countWeekendEvents(): Promise<number> {
  const events = await loadAllApprovedEvents();
  if (events.length === 0) return 0;

  // Use APP_TIMEZONE for consistent weekend calculation
  const now = new Date();
  const todayISO = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  
  const todayDate = new Date(todayISO + "T12:00:00Z");
  const day = todayDate.getUTCDay();
  const daysUntilSat = (6 - day + 7) % 7;
  
  const saturday = new Date(todayDate);
  saturday.setUTCDate(todayDate.getUTCDate() + daysUntilSat);
  const sunday = new Date(saturday);
  sunday.setUTCDate(saturday.getUTCDate() + 1);

  const satStr = saturday.toISOString().slice(0, 10);
  const sunStr = sunday.toISOString().slice(0, 10);

  return events.filter((e) => e.date >= satStr && e.date <= sunStr).length;
}

export async function deleteExpiredEvents(): Promise<{
  deleted: number;
  errors: number;
}> {
  const db = getFirestoreDb();
  if (!db) return { deleted: 0, errors: 0 };

  const now = new Date();
  const todayStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const snap = await db
    .collection("events")
    .where("status", "==", "approved")
    .where("date", "<", todayStr)
    .get();

  let deleted = 0;
  let errors = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const hasRecurrence = data.recurrence != null;

    if (!hasRecurrence) {
      try {
        await doc.ref.delete();
        deleted++;
      } catch (err) {
        console.error(`Failed to delete event ${doc.id}:`, err);
        errors++;
      }
    }
  }

  if (deleted > 0) invalidateApprovedEventsCache();
  return { deleted, errors };
}

export { isFirebaseConfigured };
