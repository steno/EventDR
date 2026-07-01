import { NextRequest, NextResponse } from "next/server";
import {
  fetchPendingEvents,
  moderateEvent,
  isSupabaseConfigured,
} from "@/lib/supabase/events";

export const dynamic = "force-dynamic";

function checkSecret(request: NextRequest): boolean {
  const secret = process.env.MODERATOR_SECRET;
  if (!secret) return false;
  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-moderator-secret");
  return provided === secret;
}

export async function GET(request: NextRequest) {
  if (!checkSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const events = await fetchPendingEvents();
  return NextResponse.json({ events, count: events.length });
}

export async function POST(request: NextRequest) {
  if (!checkSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = (await request.json()) as { id?: string; action?: "approve" | "reject" };
  if (!body.id || !body.action) {
    return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
  }

  const status = body.action === "approve" ? "approved" : "rejected";
  const ok = await moderateEvent(body.id, status);
  if (!ok) {
    return NextResponse.json({ error: "Moderation failed" }, { status: 500 });
  }
  return NextResponse.json({ success: true, id: body.id, status });
}
