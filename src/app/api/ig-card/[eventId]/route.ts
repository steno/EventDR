import { NextRequest, NextResponse } from "next/server";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getEventGallerySlides } from "@/lib/event-images";
import { getEventById } from "@/lib/get-event";
import { buildInstagramFeedCardJpeg } from "@/lib/instagram-story-card-server";

export const dynamic = "force-dynamic";

const EVENT_ID = /^[a-zA-Z0-9._-]{1,160}$/;

/**
 * Share → Instagram card as a 4:5 JPEG. Spotlight posts point Meta here so
 * the feed photo matches the detail-page share design.
 *
 * Optional `?slide=N` (0-based) uses that curated gallery slide as the flyer
 * instead of the event hero — for per-artist Money Heist–style posts.
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

  const slideRaw = request.nextUrl.searchParams.get("slide");
  let cardEvent = event;
  if (slideRaw != null && slideRaw !== "") {
    const slideIndex = Number.parseInt(slideRaw, 10);
    if (!Number.isInteger(slideIndex) || slideIndex < 0) {
      return new NextResponse("Bad slide", { status: 400 });
    }
    const slides = getEventGallerySlides(id);
    const slide = slides[slideIndex];
    if (!slide?.imageUrl) {
      return new NextResponse("Slide not found", { status: 404 });
    }
    cardEvent = { ...event, imageUrl: slide.imageUrl };
  }

  try {
    // Same-host origin so localhost ig-card can fetch /events/* without
    // bundling public/ into the Netlify server handler.
    const jpeg = await buildInstagramFeedCardJpeg(
      cardEvent,
      locale,
      request.nextUrl.origin,
    );
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
