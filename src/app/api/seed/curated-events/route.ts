import { NextRequest, NextResponse } from "next/server";
import { CURATED_SEED_EVENT_IDS } from "@/lib/curated-events";
import {
  upsertApprovedEvents,
  deleteEvent,
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

  const { events, missing, skippedExpired } = resolveSeedEvents(
    CURATED_SEED_EVENT_IDS,
  );

  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Missing fallback seed events", missing, skippedExpired },
      { status: 500 },
    );
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
    skippedExpired,
    ids: events.map((e) => e.id),
  });
}
