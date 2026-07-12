import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import type { Event, EventCategory, EventFormat, Venue } from "@/lib/types";
import type { LocalizedText } from "@/lib/localized-text";
import { getEventCategoryList, withResolvedCategories } from "@/lib/categorize";
import { sanitizeEventPlaceFields } from "@/lib/event-location";
import { normalizeLineup } from "@/lib/event-lineup";
import { applyCuratedEventPatch } from "@/lib/curated-events";
import { translateEventCopy } from "@/lib/translate-event";
import { SEED_VENUES } from "@/lib/venues-seed";
import { getFirestoreDb, isFirebaseConfigured } from "./admin";

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
}): Promise<number> {
  const db = getFirestoreDb();
  if (!db) return 0;

  let venues = SEED_VENUES;
  if (options?.missingOnly !== false) {
    const snap = await db.collection("venues").get();
    const existing = new Set(snap.docs.map((doc) => doc.id));
    venues = SEED_VENUES.filter((venue) => !existing.has(venue.slug));
    if (venues.length === 0) return 0;
  }

  const batch = db.batch();
  for (const venue of venues) {
    const ref = db.collection("venues").doc(venue.slug);
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
      },
      { merge: true },
    );
  }
  await batch.commit();
  return venues.length;
}

export async function fetchEventById(id: string): Promise<Event | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const doc = await db.collection("events").doc(id).get();
  if (!doc.exists) return null;

  const event = docToEvent(doc.id, doc.data()!);
  if (event.status === "rejected" || event.status === "pending") return null;
  return event;
}

export async function fetchApprovedEvents(options?: {
  category?: EventCategory;
  venueSlug?: string;
  locale?: string;
}): Promise<Event[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  let query = db
    .collection("events")
    .where("status", "==", "approved");

  // Apply filters at database level when possible
  if (options?.category) {
    query = query.where("searchCategories", "array-contains", options.category);
  }
  if (options?.venueSlug) {
    query = query.where("venueSlug", "==", options.venueSlug);
  }

  const snap = await query.get();

  const events = snap.docs.map((doc) => docToEvent(doc.id, doc.data()));
  events.sort((a, b) => a.date.localeCompare(b.date));

  return events;
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
  if ("address" in fields) update.address = fields.address ?? null;
  if ("location" in fields) update.location = fields.location ?? null;
  if ("endDate" in fields) update.endDate = fields.endDate ?? null;
  if ("description" in fields) update.description = fields.description ?? null;
  if ("venueSlug" in fields) update.venueSlug = fields.venueSlug ?? null;
  if ("time" in fields) update.time = fields.time ?? null;
  if ("title" in fields) update.title = fields.title ?? null;
  if ("lineup" in fields) {
    update.lineup = Array.isArray(fields.lineup) ? fields.lineup : null;
  }
  if ("venue" in fields || "venueName" in fields) {
    update.venueName = fields.venue ?? fields.venueName ?? null;
  }

  if (Object.keys(update).length === 0) return false;

  try {
    await db.collection("events").doc(id).update(update);
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

    await ref.update(update);
    return true;
  } catch (err) {
    console.error("approveEvent:", err);
    return false;
  }
}

export async function insertIngestedEvents(events: Event[]): Promise<number> {
  const db = getFirestoreDb();
  if (!db || events.length === 0) return 0;

  let upserted = 0;
  for (const event of events) {
    const ref = db.collection("events").doc(event.id);
    const existing = await ref.get();

    if (existing.exists) {
      const existingStatus = (existing.data()?.status as string) ?? "pending";
      if (existingStatus === "rejected") continue;

      const data = eventToFirestore(
        event,
        event.sourceType ?? "crawl",
        existingStatus,
      );
      const { createdAt: _, ...withoutCreated } = data;
      await ref.set(withoutCreated, { merge: true });
    } else {
      await ref.set(
        eventToFirestore(event, event.sourceType ?? "crawl", "pending"),
      );
    }
    upserted++;
  }
  return upserted;
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
  return upserted;
}

export async function fetchVenues(): Promise<Venue[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  const snap = await db.collection("venues").orderBy("name").get();
  return snap.docs.map((doc) => docToVenue(doc.id, doc.data()));
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

export async function countWeekendEvents(): Promise<number> {
  const db = getFirestoreDb();
  if (!db) return 0;

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

  const snap = await db
    .collection("events")
    .where("status", "==", "approved")
    .where("date", ">=", satStr)
    .where("date", "<=", sunStr)
    .get();

  return snap.size;
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

  return { deleted, errors };
}

export { isFirebaseConfigured };
