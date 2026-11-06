import { NextRequest, NextResponse } from "next/server";
import { checkModeratorAuth } from "@/lib/ops-auth";
import {
  fetchPendingEvents,
  fetchApprovedEvents,
  fetchRejectedEvents,
  moderateEvent,
  deleteEvent,
  isFirebaseConfigured,
} from "@/lib/firebase/events";
import { findNearDuplicate } from "@/lib/ingest-dedupe";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LIVE_LIMIT = 30;
const REJECTED_LIMIT = 30;

function unauthorizedResponse(reason: "not_configured" | "unauthorized") {
  if (reason === "not_configured") {
    return NextResponse.json(
      { error: "Moderator not configured", code: "not_configured" },
      { status: 401 },
    );
  }
  return NextResponse.json(
    { error: "Unauthorized", code: "unauthorized" },
    { status: 401 },
  );
}

function withDuplicates(pending: Event[], approved: Event[]) {
  return pending.map((event) => {
    const others = [
      ...approved,
      ...pending.filter((p) => p.id !== event.id),
    ];
    const match = findNearDuplicate(event, others);
    return {
      ...event,
      duplicateOf: match
        ? {
            id: match.id,
            title: match.title,
            status: match.status ?? "unknown",
            score: match.score,
          }
        : null,
    };
  });
}

/** Prefer community submissions, then newest by id. */
function pickLiveCommunity(approved: Event[], limit: number): Event[] {
  const community = approved.filter(
    (e) => e.sourceType === "community" || e.communitySubmitted,
  );
  const rest = approved.filter(
    (e) => !(e.sourceType === "community" || e.communitySubmitted),
  );
  return [...community, ...rest]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, limit);
}

export async function GET(request: NextRequest) {
  const auth = checkModeratorAuth(request);
  if (!auth.ok) return unauthorizedResponse(auth.reason);
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }
  const [pending, approved, rejectedAll] = await Promise.all([
    fetchPendingEvents(),
    fetchApprovedEvents(),
    fetchRejectedEvents(80),
  ]);

  const events = withDuplicates(pending, approved);
  const live = pickLiveCommunity(approved, LIVE_LIMIT);
  const rejected = rejectedAll
    .filter((e) => e.sourceType === "community" || e.communitySubmitted)
    .slice(0, REJECTED_LIMIT);

  return NextResponse.json({
    events,
    pending: events,
    live,
    rejected,
    count: events.length,
    liveCount: live.length,
    rejectedCount: rejected.length,
  });
}

export async function POST(request: NextRequest) {
  const auth = checkModeratorAuth(request);
  if (!auth.ok) return unauthorizedResponse(auth.reason);
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const body = (await request.json()) as {
    id?: string;
    action?: "approve" | "reject" | "delete" | "reject-all-pending";
  };
  if (!body.action) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  if (body.action === "reject-all-pending") {
    const pending = await fetchPendingEvents();
    let rejected = 0;
    let failed = 0;
    for (const event of pending) {
      const ok = await moderateEvent(event.id, "rejected");
      if (ok) rejected += 1;
      else failed += 1;
    }
    return NextResponse.json({
      success: true,
      action: "reject-all-pending",
      rejected,
      failed,
    });
  }

  if (!body.id) {
    return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
  }

  if (body.action === "delete") {
    const ok = await deleteEvent(body.id);
    if (!ok) {
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
    return NextResponse.json({ success: true, id: body.id, deleted: true });
  }

  if (body.action !== "approve" && body.action !== "reject") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const status = body.action === "approve" ? "approved" : "rejected";
  const ok = await moderateEvent(body.id, status);
  if (!ok) {
    return NextResponse.json({ error: "Moderation failed" }, { status: 500 });
  }
  return NextResponse.json({ success: true, id: body.id, status });
}
