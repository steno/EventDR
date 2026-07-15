import { NextRequest, NextResponse } from "next/server";
import { isValidLocale } from "@/i18n/config";
import { isFirebaseConfigured } from "@/lib/firebase/events";
import { VENUES_CACHE_CONTROL } from "@/lib/http-cache";
import { getVenues } from "@/lib/venues";

export const revalidate = 300;

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("locale") ?? undefined;
  const locale = localeParam && isValidLocale(localeParam) ? localeParam : undefined;
  const venues = await getVenues(locale);
  return NextResponse.json(
    {
      venues,
      source: isFirebaseConfigured() && venues.length > 0 ? "firebase" : "seed",
    },
    {
      headers: {
        "Cache-Control": VENUES_CACHE_CONTROL,
      },
    },
  );
}
