import type { Event, EventCategory, EventFormat, Venue } from "@/lib/types";
import type { DbEvent, DbVenue } from "./client";
import { getSupabaseAdmin, getSupabaseAnon, isSupabaseConfigured } from "./client";

export function dbEventToEvent(row: DbEvent): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    endDate: row.end_date ?? undefined,
    time: row.time ?? undefined,
    location: row.location,
    venue: row.venue_name ?? undefined,
    venueSlug: row.venue_slug ?? undefined,
    category: row.category as EventCategory,
    format: row.format as EventFormat,
    trending: row.trending ?? false,
    sourceUrl: row.source_url ?? undefined,
    imageEmoji: row.image_emoji ?? undefined,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    communitySubmitted:
      row.source_type === "community" ||
      row.source_type === "instagram" ||
      row.source_type === "whatsapp",
    sourceType: row.source_type as Event["sourceType"],
    status: row.status as Event["status"],
  };
}

export function dbVenueToVenue(row: DbVenue): Venue {
  return {
    slug: row.slug,
    name: row.name,
    city: row.city,
    description: row.description ?? "",
    lat: row.lat,
    lng: row.lng,
    emoji: row.emoji ?? "📍",
    instagram: row.instagram ?? undefined,
    website: row.website ?? undefined,
  };
}

export async function fetchApprovedEvents(options?: {
  category?: EventCategory;
  venueSlug?: string;
  locale?: string;
}): Promise<Event[]> {
  const db = getSupabaseAnon() ?? getSupabaseAdmin();
  if (!db) return [];

  let query = db
    .from("events")
    .select("*")
    .eq("status", "approved")
    .order("date", { ascending: true });

  if (options?.category) query = query.eq("category", options.category);
  if (options?.venueSlug) query = query.eq("venue_slug", options.venueSlug);

  const { data, error } = await query;
  if (error) {
    console.error("fetchApprovedEvents:", error);
    return [];
  }
  return (data as DbEvent[]).map(dbEventToEvent);
}

export async function fetchPendingEvents(): Promise<Event[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];

  const { data, error } = await db
    .from("events")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchPendingEvents:", error);
    return [];
  }
  return (data as DbEvent[]).map(dbEventToEvent);
}

export async function insertPendingEvent(
  event: Event,
  sourceType: string = "community",
): Promise<Event | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;

  const row = {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    end_date: event.endDate ?? null,
    time: event.time ?? null,
    location: event.location,
    venue_slug: event.venueSlug ?? null,
    venue_name: event.venue ?? null,
    category: event.category,
    format: event.format,
    trending: event.trending ?? false,
    source_url: event.sourceUrl ?? null,
    source_type: sourceType,
    image_emoji: event.imageEmoji ?? "📌",
    lat: event.lat ?? null,
    lng: event.lng ?? null,
    status: "pending",
    locale: "en",
  };

  const { error } = await db.from("events").insert(row);
  if (error) {
    console.error("insertPendingEvent:", error);
    return null;
  }
  return { ...event, status: "pending" };
}

export async function moderateEvent(
  id: string,
  status: "approved" | "rejected",
): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db) return false;

  const { error } = await db.from("events").update({ status }).eq("id", id);
  if (error) {
    console.error("moderateEvent:", error);
    return false;
  }
  return true;
}

export async function insertIngestedEvents(events: Event[]): Promise<number> {
  const db = getSupabaseAdmin();
  if (!db || events.length === 0) return 0;

  const rows = events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date,
    end_date: e.endDate ?? null,
    time: e.time ?? null,
    location: e.location,
    venue_slug: e.venueSlug ?? null,
    venue_name: e.venue ?? null,
    category: e.category,
    format: e.format,
    trending: e.trending ?? false,
    source_url: e.sourceUrl ?? null,
    source_type: e.sourceType ?? "crawl",
    image_emoji: e.imageEmoji ?? "📌",
    lat: e.lat ?? null,
    lng: e.lng ?? null,
    status: "pending",
    locale: "en",
  }));

  const { error } = await db.from("events").upsert(rows, {
    onConflict: "id",
    ignoreDuplicates: true,
  });

  if (error) {
    console.error("insertIngestedEvents:", error);
    return 0;
  }
  return rows.length;
}

export async function fetchVenues(): Promise<Venue[]> {
  const db = getSupabaseAnon() ?? getSupabaseAdmin();
  if (!db) return [];

  const { data, error } = await db.from("venues").select("*").order("name");
  if (error) {
    console.error("fetchVenues:", error);
    return [];
  }
  return (data as DbVenue[]).map(dbVenueToVenue);
}

export async function fetchVenueBySlug(slug: string): Promise<Venue | null> {
  const db = getSupabaseAnon() ?? getSupabaseAdmin();
  if (!db) return null;

  const { data, error } = await db
    .from("venues")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return dbVenueToVenue(data as DbVenue);
}

export async function countWeekendEvents(): Promise<number> {
  const db = getSupabaseAdmin();
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

  const { count, error } = await db
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")
    .gte("date", satStr)
    .lte("date", sunStr);

  if (error) return 0;
  return count ?? 0;
}

export { isSupabaseConfigured };
