import { NextRequest, NextResponse } from "next/server";
import { countWeekendEvents } from "@/lib/supabase/events";
import { sendWeekendDigest, isPushConfigured } from "@/lib/push";

export const dynamic = "force-dynamic";

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
  if (!isPushConfigured()) {
    return NextResponse.json({ error: "Push not configured" }, { status: 503 });
  }

  const count = await countWeekendEvents();
  const sent = await sendWeekendDigest(Math.max(count, 1));

  return NextResponse.json({ success: true, count, sent });
}
