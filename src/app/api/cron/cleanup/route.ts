import { NextRequest, NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/ops-auth";
import { deleteExpiredEvents, isFirebaseConfigured } from "@/lib/firebase/events";

export const dynamic = "force-dynamic";


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
