import { NextRequest, NextResponse } from "next/server";
import {
  addCommunityEvent,
  createCommunityEvent,
  isValidSubmitPayload,
} from "@/lib/community-store";
import { addToPool } from "@/lib/cache";
import { isValidLocale, defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { EventCategory } from "@/lib/types";
import { getDictionary } from "@/i18n/dictionaries";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const localeParam = request.nextUrl.searchParams.get("locale") ?? defaultLocale;
    const locale: Locale = isValidLocale(localeParam) ? localeParam : defaultLocale;
    const dict = getDictionary(locale);

    if (!isValidSubmitPayload(body)) {
      return NextResponse.json(
        { error: dict.submit.error },
        { status: 400 },
      );
    }

    const event = createCommunityEvent({
      title: body.title,
      description: body.description,
      date: body.date,
      time: body.time,
      location: body.location,
      venue: body.venue,
      category: body.category as EventCategory,
      format: body.format as "physical" | "digital" | "hybrid",
    });

    addCommunityEvent(event);
    addToPool(locale, [event]);

    return NextResponse.json({
      success: true,
      event,
      message: dict.submit.success,
    });
  } catch {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
