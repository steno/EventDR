import { NextRequest, NextResponse } from "next/server";
import { FACEBOOK_SEED_EVENT_IDS } from "@/lib/facebook-groups";
import {
  upsertApprovedEvents,
  isFirebaseConfigured,
  syncSeedVenues,
} from "@/lib/firebase/events";
import { resolveSeedEvents } from "@/lib/seed-events";

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

  const { events, missing, skippedExpired } = resolveSeedEvents(
    FACEBOOK_SEED_EVENT_IDS,
  );

  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Missing fallback seed events", missing, skippedExpired },
      { status: 500 },
    );
  }

  const venuesSynced = await syncSeedVenues({ missingOnly: false });
  const upserted = await upsertApprovedEvents(events, "crawl");

  return NextResponse.json({
    success: true,
    venuesSynced,
    upserted,
    skippedExpired,
    ids: events.map((e) => e.id),
  });
}
