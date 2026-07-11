import { createCommunityEvent, getSubmitValidationError } from "@/lib/community-store";
import { insertPendingEvent } from "@/lib/firebase/events";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { addToPool } from "@/lib/cache";
import { matchVenueSlug } from "@/lib/venues-seed";
import { SEED_VENUES } from "@/lib/venues-seed";
import { isValidLocale, defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { EventCategory, EventRecurrence } from "@/lib/types";
import { CATEGORY_IDS } from "@/lib/categories";
import { getDictionary } from "@/i18n/dictionaries";
import { NextRequest, NextResponse } from "next/server";
import { uploadEventImage } from "@/lib/firebase/images";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const localeParam = request.nextUrl.searchParams.get("locale") ?? defaultLocale;
    const locale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale;
    const dict = getDictionary(locale);

    const validationError = getSubmitValidationError(body);
    if (validationError) {
      const messages: Record<string, string> = {
        title: dict.submit.validationTitle,
        description: dict.submit.validationDescription,
        date: dict.submit.validationDate,
        location: dict.submit.validationLocation,
        category: dict.submit.error,
        format: dict.submit.error,
        recurrence: dict.submit.error,
        image: dict.submit.validationImage,
        invalid: dict.submit.error,
      };
      return NextResponse.json(
        { error: messages[validationError] ?? dict.submit.error, field: validationError },
        { status: 400 },
      );
    }

    let event = createCommunityEvent({
      title: body.title,
      description: body.description,
      date: body.date,
      time: body.time,
      location: body.location,
      venue: body.venue,
      category: body.category as EventCategory,
      categories: Array.isArray(body.categories)
        ? body.categories.filter(
            (value: unknown): value is EventCategory =>
              typeof value === "string" &&
              CATEGORY_IDS.includes(value as EventCategory) &&
              value !== body.category,
          )
        : undefined,
      format: body.format as "physical" | "digital" | "hybrid",
      recurrence: body.recurrence as EventRecurrence | undefined,
      recurrenceDay: body.recurrenceDay,
      recurrenceDays: body.recurrenceDays,
      imageUrl: !isFirebaseConfigured() ? body.imageDataUrl : undefined,
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
      if (body.imageDataUrl) {
        const upload = await uploadEventImage(event.id, body.imageDataUrl);
        if (!upload.ok) {
          if (upload.reason === "invalid") {
            return NextResponse.json(
              { error: dict.submit.validationImage, field: "image" },
              { status: 400 },
            );
          }
          console.error("submit: image upload skipped:", upload.reason);
        } else {
          event = { ...event, imageUrl: upload.url };
        }
      }

      const saved = await insertPendingEvent(event, "community");
      if (!saved) {
        return NextResponse.json({ error: dict.submit.error }, { status: 500 });
      }
      const imageSkipped = Boolean(body.imageDataUrl && !event.imageUrl);
      return NextResponse.json({
        success: true,
        pending: true,
        event: saved,
        imageSkipped,
        message: imageSkipped
          ? dict.submit.imageUploadSkipped
          : dict.submit.pendingSuccess,
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
