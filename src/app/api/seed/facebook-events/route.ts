import { NextRequest, NextResponse } from "next/server";
import { FACEBOOK_SEED_EVENT_IDS } from "@/lib/facebook-groups";
import { getFallbackEvents } from "@/lib/fallback-events";
import {
  upsertApprovedEvents,
  isFirebaseConfigured,
  syncSeedVenues,
} from "@/lib/firebase/events";
import { prepareSeedEvent } from "@/lib/geo";
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
    .map(prepareSeedEvent);

  if (events.length !== FACEBOOK_SEED_EVENT_IDS.length) {
    return NextResponse.json({ error: "Missing fallback seed events" }, { status: 500 });
  }

  const venuesSynced = await syncSeedVenues({ missingOnly: false });
  const upserted = await upsertApprovedEvents(events, "crawl");

  return NextResponse.json({
    success: true,
    venuesSynced,
    upserted,
    ids: events.map((e) => e.id),
  });
}
