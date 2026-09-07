import { NextRequest, NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/ops-auth";
import { isPushConfigured, sendDueEventReminders } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isPushConfigured()) {
    return NextResponse.json({ error: "Push not configured" }, { status: 503 });
  }

  const result = await sendDueEventReminders();
  return NextResponse.json({ success: true, ...result });
}
