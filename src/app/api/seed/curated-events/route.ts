import { NextRequest, NextResponse } from "next/server";
import { CURATED_SEED_EVENT_IDS } from "@/lib/curated-events";
import { getFallbackEvents } from "@/lib/fallback-events";
import {
  upsertApprovedEvents,
  deleteEvent,
  isFirebaseConfigured,
  syncSeedVenues,
} from "@/lib/firebase/events";
import { matchVenueSlug } from "@/lib/venues-seed";
import { SEED_VENUES } from "@/lib/venues-seed";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

function checkCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("authorization")?.replace("Bearer ", "");
  return provided === secret;
}

function attachVenue(event: Event): Event {
  const venueSlug =
    event.venueSlug ??
    matchVenueSlug(event.venue ?? "") ??
    matchVenueSlug(event.location);
  if (!venueSlug) return event;
  const venue = SEED_VENUES.find((v) => v.slug === venueSlug);
  return {
    ...event,
    venueSlug,
    lat: event.lat ?? venue?.lat,
    lng: event.lng ?? venue?.lng,
  };
}

/** Legacy ingest ids superseded by stable curated ids. */
const LEGACY_DUPLICATE_IDS = [
  "ingest-1783371784615-0-18th-annual-cabarete-butterfly-effect",
] as const;

/** Idempotent: publish curated events from fallback seeds. */
export async function POST(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const byId = new Map(getFallbackEvents("en").map((e) => [e.id, e]));
  const events = CURATED_SEED_EVENT_IDS.map((id) => byId.get(id))
    .filter((e): e is Event => Boolean(e))
    .map(attachVenue);

  if (events.length !== CURATED_SEED_EVENT_IDS.length) {
    return NextResponse.json({ error: "Missing fallback seed events" }, { status: 500 });
  }

  const venuesSynced = await syncSeedVenues({ missingOnly: false });
  const upserted = await upsertApprovedEvents(events, "crawl");

  const deleted: string[] = [];
  for (const legacyId of LEGACY_DUPLICATE_IDS) {
    if (await deleteEvent(legacyId)) deleted.push(legacyId);
  }

  return NextResponse.json({
    success: true,
    venuesSynced,
    upserted,
    deleted,
    ids: events.map((e) => e.id),
  });
}
