import { NextRequest, NextResponse } from "next/server";
import { ingestSocialEvents } from "@/lib/ingest-social";
import { insertIngestedEvents, isSupabaseConfigured } from "@/lib/supabase/events";
import { isValidLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

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
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const localeParam = request.nextUrl.searchParams.get("locale") ?? "en";
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";

  const events = await ingestSocialEvents(locale);
  const inserted = await insertIngestedEvents(events);

  return NextResponse.json({
    success: true,
    discovered: events.length,
    queued: inserted,
    message: `${inserted} events queued for moderation`,
  });
}
