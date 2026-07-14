import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/admin";
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
  const firebaseConfigured = isFirebaseConfigured();
  const moderatorConfigured = Boolean(process.env.MODERATOR_SECRET);

  let venueCount = 0;
  let firebaseOk = false;
  if (firebaseConfigured) {
    try {
      // Triggers credential parse/init; returns null when credentials are unusable.
      const db = getFirestoreDb();
      if (db) {
        const venues = await fetchVenues();
        venueCount = venues.length;
        firebaseOk = true;
      }
    } catch (error) {
      console.error("Status: Firebase venue check failed:", error);
    }
  }

  const base = {
    ok: firebaseOk,
    firebase: firebaseOk,
    firebaseConfigured,
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

  let pending: Awaited<ReturnType<typeof fetchPendingEvents>> = [];
  if (firebaseOk) {
    try {
      pending = await fetchPendingEvents();
    } catch (error) {
      console.error("Status: pending events check failed:", error);
    }
  }

  return NextResponse.json({
    ...base,
    pendingCount: pending.length,
    pendingIds: pending.map((e) => e.id),
  });
}
