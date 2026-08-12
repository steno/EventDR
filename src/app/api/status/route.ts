import { NextRequest, NextResponse } from "next/server";
import { checkModeratorSecret } from "@/lib/ops-auth";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/admin";
import { fetchPendingEvents, fetchVenues } from "@/lib/firebase/events";
import { isBraveSearchConfigured } from "@/lib/scrape";

export const dynamic = "force-dynamic";

/**
 * Public: minimal liveness only.
 * Authenticated (Bearer / x-moderator-secret): config + pending queue details.
 */
export async function GET(request: NextRequest) {
  const firebaseConfigured = isFirebaseConfigured();

  let venueCount = 0;
  let firebaseOk = false;
  if (firebaseConfigured) {
    try {
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

  if (!checkModeratorSecret(request)) {
    return NextResponse.json({
      ok: firebaseOk,
      firebase: firebaseOk,
    });
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
    ok: firebaseOk,
    firebase: firebaseOk,
    firebaseConfigured,
    braveSearchConfigured: isBraveSearchConfigured(),
    cronConfigured: Boolean(process.env.CRON_SECRET?.trim()),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()),
    moderatorConfigured: Boolean(process.env.MODERATOR_SECRET?.trim()),
    venueCount,
    project: process.env.FIREBASE_PROJECT_ID ?? null,
    pendingCount: pending.length,
    pendingIds: pending.map((e) => e.id),
  });
}
