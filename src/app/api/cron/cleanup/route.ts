import { NextRequest, NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/ops-auth";
import {
  deleteExpiredEvents,
  deleteRemovedVenues,
  isFirebaseConfigured,
} from "@/lib/firebase/events";

export const dynamic = "force-dynamic";


export async function POST(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const [expired, venues] = await Promise.all([
    deleteExpiredEvents(),
    deleteRemovedVenues(),
  ]);

  return NextResponse.json({
    success: true,
    deleted: expired.deleted,
    errors: expired.errors,
    venuesDeleted: venues.deleted,
    venueErrors: venues.errors,
    message: `Cleaned up ${expired.deleted} expired events and ${venues.deleted} dumped venue(s)`,
  });
}
