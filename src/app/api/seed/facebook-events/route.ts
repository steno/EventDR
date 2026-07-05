import { NextRequest, NextResponse } from "next/server";
import { FACEBOOK_SEED_EVENT_IDS } from "@/lib/facebook-groups";
import { getFallbackEvents } from "@/lib/fallback-events";
import { upsertApprovedEvents, isFirebaseConfigured } from "@/lib/firebase/events";
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

/** Idempotent: publish curated Facebook group events from fallback seeds. */
export async function POST(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const byId = new Map(getFallbackEvents("en").map((e) => [e.id, e]));
  const events = FACEBOOK_SEED_EVENT_IDS.map((id) => byId.get(id))
    .filter((e): e is Event => Boolean(e))
    .map(attachVenue);

  if (events.length !== FACEBOOK_SEED_EVENT_IDS.length) {
    return NextResponse.json({ error: "Missing fallback seed events" }, { status: 500 });
  }

  const upserted = await upsertApprovedEvents(events, "crawl");

  return NextResponse.json({
    success: true,
    upserted,
    ids: events.map((e) => e.id),
  });
}
