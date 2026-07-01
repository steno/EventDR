import { NextRequest, NextResponse } from "next/server";
import {
  addCommunityEvent,
  createCommunityEvent,
  isValidSubmitPayload,
} from "@/lib/community-store";
import { addToPool } from "@/lib/cache";
import { isValidLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { EventCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const localeParam = request.nextUrl.searchParams.get("locale") ?? "es";
    const locale: Locale = isValidLocale(localeParam) ? localeParam : "es";

    if (!isValidSubmitPayload(body)) {
      return NextResponse.json(
        { error: locale === "es" ? "Datos inválidos" : "Invalid submission" },
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
      message:
        locale === "es"
          ? "¡Gracias! Tu evento ya está visible para la comunidad."
          : "Thanks! Your event is now visible to the community.",
    });
  } catch {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
