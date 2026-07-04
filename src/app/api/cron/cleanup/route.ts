import { NextRequest, NextResponse } from "next/server";
import { deleteExpiredEvents, isFirebaseConfigured } from "@/lib/firebase/events";

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
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const result = await deleteExpiredEvents();

  return NextResponse.json({
    success: true,
    deleted: result.deleted,
    errors: result.errors,
    message: `Cleaned up ${result.deleted} expired events`,
  });
}
