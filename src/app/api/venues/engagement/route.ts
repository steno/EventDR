import { NextRequest, NextResponse } from "next/server";
import { defaultLocale } from "@/i18n/config";
import { getEventById } from "@/lib/get-event";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/admin";
import {
  getVenueEngagementScores,
  recordVenueShare,
} from "@/lib/firebase/venue-engagement";
import {
  isValidEngagementDeviceId,
  isValidEngagementEventId,
  isValidVenueEngagementSlug,
  isVenueEngagementKind,
} from "@/lib/venue-engagement";
import { VENUE_AUDIENCE_POOLS } from "@/lib/home-layout";
import {
  RATE_LIMITS,
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { matchVenueSlug } from "@/lib/venues-seed";

export const dynamic = "force-dynamic";

const SCORES_CACHE_CONTROL =
  "public, max-age=0, s-maxage=60, stale-while-revalidate=300";

function unavailable() {
  return NextResponse.json(
    { error: "Venue engagement is unavailable" },
    { status: 503 },
  );
}

async function resolveVenueSlug(eventId: string): Promise<string | null> {
  const event = await getEventById(eventId, defaultLocale);
  if (!event) return null;
  const fromField = event.venueSlug?.trim();
  if (fromField && isValidVenueEngagementSlug(fromField)) return fromField;
  const matched = matchVenueSlug(event.venue ?? event.location ?? "");
  return matched && isValidVenueEngagementSlug(matched) ? matched : null;
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("slugs") ?? "";
  const requested = raw
    .split(",")
    .map((s) => s.trim())
    .filter(isValidVenueEngagementSlug);
  const pool = new Set([
    ...VENUE_AUDIENCE_POOLS.local,
    ...VENUE_AUDIENCE_POOLS.visitor,
  ]);
  const slugs = (requested.length > 0 ? requested : [...pool]).filter((slug) =>
    pool.has(slug),
  );
  if (slugs.length === 0) {
    return NextResponse.json({ scores: {} });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { scores: {} },
      { headers: { "Cache-Control": SCORES_CACHE_CONTROL } },
    );
  }
  const db = getFirestoreDb();
  if (!db) return unavailable();

  try {
    const scores = await getVenueEngagementScores(db, slugs);
    return NextResponse.json(
      { scores },
      { headers: { "Cache-Control": SCORES_CACHE_CONTROL } },
    );
  } catch (error) {
    console.error("venue engagement: score lookup failed:", error);
    return unavailable();
  }
}

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, RATE_LIMITS.venueEngagement);
  if (!limited.ok) return rateLimitResponse(limited);

  let body: {
    kind?: unknown;
    eventId?: unknown;
    deviceId?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !isVenueEngagementKind(body.kind) ||
    body.kind !== "share" ||
    !isValidEngagementEventId(body.eventId) ||
    !isValidEngagementDeviceId(body.deviceId)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ ok: true, recorded: false });
  }
  const db = getFirestoreDb();
  if (!db) return unavailable();

  try {
    const venueSlug = await resolveVenueSlug(body.eventId);
    if (!venueSlug) {
      return NextResponse.json({ ok: true, recorded: false });
    }
    const recorded = await recordVenueShare(
      db,
      venueSlug,
      body.eventId,
      body.deviceId,
    );
    return NextResponse.json({ ok: true, recorded, venueSlug });
  } catch (error) {
    console.error("venue engagement: share failed:", error);
    return unavailable();
  }
}
