import { NextRequest, NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/ops-auth";
import { deleteVenue, isFirebaseConfigured } from "@/lib/firebase/events";
import { isRemovedVenueSlug } from "@/lib/removed-venues";

export const dynamic = "force-dynamic";

/** Delete a dumped ingest-stub venue by slug (cron-authenticated). */
export async function DELETE(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const slug = request.nextUrl.searchParams.get("slug")?.trim();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  if (!isRemovedVenueSlug(slug)) {
    return NextResponse.json(
      { error: "Slug is not on the removed-venue list" },
      { status: 400 },
    );
  }

  const ok = await deleteVenue(slug);
  if (!ok) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, slug, deleted: true });
}
