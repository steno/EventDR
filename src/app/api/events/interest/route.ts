import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/admin";
import {
  applyEventInterest,
  getEventInterestCounts,
} from "@/lib/firebase/event-interest";
import {
  isInterestAction,
  isValidInterestDeviceId,
  normalizeInterestEventIds,
  type InterestCounts,
} from "@/lib/event-interest";
import { getEventById } from "@/lib/get-event";
import { defaultLocale } from "@/i18n/config";
import {
  RATE_LIMITS,
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const COUNTS_CACHE_CONTROL =
  "public, max-age=0, s-maxage=30, stale-while-revalidate=120";

function unavailable() {
  return NextResponse.json(
    { error: "Interest counts are unavailable" },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  const ids = normalizeInterestEventIds(
    (request.nextUrl.searchParams.get("ids") ?? "").split(","),
  );
  if (ids.length === 0) {
    return NextResponse.json({ error: "Missing ids" }, { status: 400 });
  }
  if (!isFirebaseConfigured()) return unavailable();
  const db = getFirestoreDb();
  if (!db) return unavailable();

  try {
    const counts = await getEventInterestCounts(db, ids);
    return NextResponse.json(
      { counts },
      { headers: { "Cache-Control": COUNTS_CACHE_CONTROL } },
    );
  } catch (error) {
    console.error("interest: count lookup failed:", error);
    return unavailable();
  }
}

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, RATE_LIMITS.interest);
  if (!limited.ok) return rateLimitResponse(limited);

  let body: { action?: unknown; eventIds?: unknown; deviceId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ids = normalizeInterestEventIds(body.eventIds);
  if (
    ids.length === 0 ||
    !isInterestAction(body.action) ||
    !isValidInterestDeviceId(body.deviceId)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!isFirebaseConfigured()) return unavailable();
  const db = getFirestoreDb();
  if (!db) return unavailable();

  const action = body.action;
  const deviceId = body.deviceId;
  const counts: InterestCounts = {};
  try {
    for (const id of ids) {
      // Unknown ids (typos, removed listings) never get a counter doc.
      if (action === "add" && !(await getEventById(id, defaultLocale))) continue;
      counts[id] = await applyEventInterest(db, id, deviceId, action);
    }
  } catch (error) {
    console.error("interest: update failed:", error);
    return unavailable();
  }

  return NextResponse.json({ counts });
}
