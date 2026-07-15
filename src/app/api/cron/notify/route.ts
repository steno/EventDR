import { NextRequest, NextResponse } from "next/server";
import { countWeekendEvents } from "@/lib/firebase/events";
import { sendMailboxWeekendDigest, isMailboxEmailConfigured } from "@/lib/mailbox";
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

  const pushConfigured = isPushConfigured();
  const emailConfigured = isMailboxEmailConfigured();

  if (!pushConfigured && !emailConfigured) {
    return NextResponse.json(
      { error: "Neither push nor mailbox email is configured" },
      { status: 503 },
    );
  }

  const count = await countWeekendEvents();

  const pushSent = pushConfigured
    ? await sendWeekendDigest(Math.max(count, 1))
    : 0;

  const mailbox = emailConfigured
    ? await sendMailboxWeekendDigest()
    : { attempted: 0, sent: 0, skippedUnconfigured: true };

  return NextResponse.json({
    success: true,
    count,
    pushSent,
    mailbox,
  });
}
