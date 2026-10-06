import { NextRequest, NextResponse } from "next/server";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getEventById } from "@/lib/get-event";
import { buildInstagramFeedCardJpeg } from "@/lib/instagram-story-card-server";

export const dynamic = "force-dynamic";

const EVENT_ID = /^[a-zA-Z0-9._-]{1,160}$/;

/**
 * Share → Instagram card as a 4:5 JPEG. Spotlight posts point Meta here so
 * the feed photo matches the detail-page share design.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await context.params;
  const id = decodeURIComponent(eventId).replace(/\.jpe?g$/i, "");
  if (!EVENT_ID.test(id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const localeParam = request.nextUrl.searchParams.get("locale") ?? "en";
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";
  const event = await getEventById(id, locale);
  if (!event) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const jpeg = await buildInstagramFeedCardJpeg(event, locale);
    return new NextResponse(new Uint8Array(jpeg), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Netlify-CDN-Cache-Control": "public, durable, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("ig-card render failed", id, error);
    return new NextResponse("Card render failed", { status: 500 });
  }
}
