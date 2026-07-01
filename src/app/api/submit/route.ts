import { createCommunityEvent, isValidSubmitPayload } from "@/lib/community-store";
import { insertPendingEvent } from "@/lib/firebase/events";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { addToPool } from "@/lib/cache";
import { matchVenueSlug } from "@/lib/venues-seed";
import { SEED_VENUES } from "@/lib/venues-seed";
import { isValidLocale, defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { EventCategory } from "@/lib/types";
import { getDictionary } from "@/i18n/dictionaries";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const localeParam = request.nextUrl.searchParams.get("locale") ?? defaultLocale;
    const locale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale;
    const dict = getDictionary(locale);

    if (!isValidSubmitPayload(body)) {
      return NextResponse.json({ error: dict.submit.error }, { status: 400 });
    }

    let event = createCommunityEvent({
      title: body.title,
      description: body.description,
      date: body.date,
      time: body.time,
      location: body.location,
      venue: body.venue,
      category: body.category as EventCategory,
      format: body.format as "physical" | "digital" | "hybrid",
    });

    const venueSlug = matchVenueSlug(body.venue) ?? matchVenueSlug(body.location);
    if (venueSlug) {
      const venue = SEED_VENUES.find((v) => v.slug === venueSlug);
      event = {
        ...event,
        venueSlug,
        lat: venue?.lat,
        lng: venue?.lng,
      };
    }

    if (isFirebaseConfigured()) {
      const saved = await insertPendingEvent(event, "community");
      if (!saved) {
        return NextResponse.json({ error: dict.submit.error }, { status: 500 });
      }
      return NextResponse.json({
        success: true,
        pending: true,
        event: saved,
        message: dict.submit.pendingSuccess,
      });
    }

    addToPool(locale, [event]);
    return NextResponse.json({
      success: true,
      pending: false,
      event,
      message: dict.submit.success,
    });
  } catch {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
