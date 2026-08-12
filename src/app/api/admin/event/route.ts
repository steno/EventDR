import { NextRequest, NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/ops-auth";
import { deleteEvent, patchEventFields, isFirebaseConfigured } from "@/lib/firebase/events";

export const dynamic = "force-dynamic";


/** Delete an event by id (cron-authenticated maintenance). */
export async function DELETE(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const ok = await deleteEvent(id);
  if (!ok) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, id, deleted: true });
}

/** Patch event fields (cron-authenticated maintenance). */
export async function PATCH(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const ok = await patchEventFields(id, body);
  if (!ok) {
    return NextResponse.json({ error: "Patch failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, id, patched: true });
}
