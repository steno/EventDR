import { NextRequest, NextResponse } from "next/server";
import { ingestSocialEvents } from "@/lib/ingest-social";
import { insertIngestedEvents, isFirebaseConfigured } from "@/lib/firebase/events";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function checkCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("authorization")?.replace("Bearer ", "");
  return provided === secret;
}

export async function POST(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  // Always ingest in English; translations are added on moderation approve.
  const events = await ingestSocialEvents("en");
  const upserted = await insertIngestedEvents(events);

  return NextResponse.json({
    success: true,
    discovered: events.length,
    upserted,
    message: `${upserted} ingested events synced for moderation`,
  });
}
