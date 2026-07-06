import { NextRequest, NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isBraveSearchConfigured } from "@/lib/scrape";
import { fetchPendingEvents, fetchVenues } from "@/lib/firebase/events";

export const dynamic = "force-dynamic";

function checkModeratorSecret(request: NextRequest): boolean {
  const secret = process.env.MODERATOR_SECRET;
  if (!secret) return false;
  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-moderator-secret");
  return provided === secret;
}

/** Quick health check — Firebase connection and optional moderation queue depth. */
export async function GET(request: NextRequest) {
  const firebase = isFirebaseConfigured();
  const moderatorConfigured = Boolean(process.env.MODERATOR_SECRET);

  let venueCount = 0;
  if (firebase) {
    const venues = await fetchVenues();
    venueCount = venues.length;
  }

  const base = {
    ok: firebase,
    firebase,
    braveSearchConfigured: isBraveSearchConfigured(),
    cronConfigured: Boolean(process.env.CRON_SECRET?.trim()),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()),
    moderatorConfigured,
    venueCount,
    project: process.env.FIREBASE_PROJECT_ID ?? "popevents-3264b",
  };

  if (!checkModeratorSecret(request)) {
    return NextResponse.json(base);
  }

  const pending = firebase ? await fetchPendingEvents() : [];
  return NextResponse.json({
    ...base,
    pendingCount: pending.length,
    pendingIds: pending.map((e) => e.id),
  });
}
