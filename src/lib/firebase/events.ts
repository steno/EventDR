import { FieldValue, type DocumentData } from "firebase-admin/firestore";
import type { Event, EventCategory, EventFormat, Venue } from "@/lib/types";
import { SEED_VENUES } from "@/lib/venues-seed";
import { getFirestoreDb, isFirebaseConfigured } from "./admin";

function docToEvent(id: string, data: DocumentData): Event {
  return {
    id,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    endDate: (data.endDate as string | null) ?? undefined,
    time: (data.time as string | null) ?? undefined,
    location: data.location as string,
    venue: (data.venueName as string | null) ?? undefined,
    venueSlug: (data.venueSlug as string | null) ?? undefined,
    category: data.category as EventCategory,
    format: data.format as EventFormat,
    trending: Boolean(data.trending),
    sourceUrl: (data.sourceUrl as string | null) ?? undefined,
    imageEmoji: (data.imageEmoji as string | null) ?? undefined,
    imageUrl: (data.imageUrl as string | null) ?? undefined,
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
  };
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
  };
}

function eventToFirestore(
  event: Event,
  sourceType: string,
  status: string,
): Record<string, unknown> {
  return {
    title: event.title,
    description: event.description,
    date: event.date,
    endDate: event.endDate ?? null,
    time: event.time ?? null,
    location: event.location,
    venueSlug: event.venueSlug ?? null,
    venueName: event.venue ?? null,
    category: event.category,
    format: event.format,
    trending: event.trending ?? false,
    sourceUrl: event.sourceUrl ?? null,
    sourceType,
    imageEmoji: event.imageEmoji ?? "📌",
    imageUrl: event.imageUrl ?? null,
    recurrence: event.recurrence ?? null,
    recurrenceDay: event.recurrenceDay ?? null,
    recurrenceDays: event.recurrenceDays ?? null,
    lat: event.lat ?? null,
    lng: event.lng ?? null,
    status,
    locale: "en",
    createdAt: FieldValue.serverTimestamp(),
  };
}

async function seedVenuesIfEmpty(): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;

  const snap = await db.collection("venues").limit(1).get();
  if (!snap.empty) return;

  const batch = db.batch();
  for (const venue of SEED_VENUES) {
    const ref = db.collection("venues").doc(venue.slug);
    batch.set(ref, {
      name: venue.name,
      city: venue.city,
      description: venue.description,
      lat: venue.lat,
      lng: venue.lng,
      emoji: venue.emoji ?? "📍",
      instagram: venue.instagram ?? null,
      website: venue.website ?? null,
    });
  }
  await batch.commit();
}

export async function fetchApprovedEvents(options?: {
  category?: EventCategory;
  venueSlug?: string;
  locale?: string;
}): Promise<Event[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  const snap = await db
    .collection("events")
    .where("status", "==", "approved")
    .get();

  let events = snap.docs.map((doc) => docToEvent(doc.id, doc.data()));
  events.sort((a, b) => a.date.localeCompare(b.date));

  if (options?.category) {
    events = events.filter((e) => e.category === options.category);
  }
  if (options?.venueSlug) {
    events = events.filter((e) => e.venueSlug === options.venueSlug);
  }

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

export async function moderateEvent(
  id: string,
  status: "approved" | "rejected",
): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    await db.collection("events").doc(id).update({ status });
    return true;
  } catch (err) {
    console.error("moderateEvent:", err);
    return false;
  }
}

export async function insertIngestedEvents(events: Event[]): Promise<number> {
  const db = getFirestoreDb();
  if (!db || events.length === 0) return 0;

  let inserted = 0;
  for (const event of events) {
    const ref = db.collection("events").doc(event.id);
    const existing = await ref.get();
    if (existing.exists) continue;

    await ref.set(
      eventToFirestore(event, event.sourceType ?? "crawl", "pending"),
    );
    inserted++;
  }
  return inserted;
}

export async function fetchVenues(): Promise<Venue[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  await seedVenuesIfEmpty();

  const snap = await db.collection("venues").orderBy("name").get();
  return snap.docs.map((doc) => docToVenue(doc.id, doc.data()));
}

export async function fetchVenueBySlug(slug: string): Promise<Venue | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  await seedVenuesIfEmpty();

  const doc = await db.collection("venues").doc(slug).get();
  if (!doc.exists) return null;
  const data = doc.data();
  if (!data) return null;
  return docToVenue(doc.id, data);
}

export async function countWeekendEvents(): Promise<number> {
  const db = getFirestoreDb();
  if (!db) return 0;

  const now = new Date();
  const day = now.getDay();
  const daysUntilSat = (6 - day + 7) % 7;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + daysUntilSat);
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

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

export { isFirebaseConfigured };
