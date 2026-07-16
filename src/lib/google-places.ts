import type { Venue } from "@/lib/types";

export interface GooglePlaceReview {
  text: string;
  rating?: number;
}

export interface GooglePlaceDetails {
  placeId: string;
  rating?: number;
  userRatingCount?: number;
  /** Full review texts used for sentiment aggregation (up to 5). */
  reviews: GooglePlaceReview[];
  /** Short quotes for UI attribution. */
  snippets: string[];
}

export function isGooglePlacesConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY?.trim());
}

function apiKey(): string | null {
  return process.env.GOOGLE_PLACES_API_KEY?.trim() || null;
}

/**
 * Resolve a Google place_id from venue name + optional coords.
 * Uses Places API (New) text search — only call from cron or cached loaders.
 */
export async function findPlaceId(
  name: string,
  venue?: Pick<Venue, "lat" | "lng" | "city">,
): Promise<string | null> {
  const key = apiKey();
  if (!key || !name.trim()) return null;

  const query = venue?.city ? `${name} ${venue.city} Dominican Republic` : name;
  const body: Record<string, unknown> = {
    textQuery: query,
    maxResultCount: 1,
    languageCode: "en",
  };
  if (venue?.lat != null && venue?.lng != null) {
    body.locationBias = {
      circle: {
        center: { latitude: venue.lat, longitude: venue.lng },
        radius: 2000,
      },
    };
  }

  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "places.id,places.name",
        },
        body: JSON.stringify(body),
        next: { revalidate: 60 * 60 * 24 * 7 },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      places?: { id?: string; name?: string }[];
    };
    const place = data.places?.[0];
    const raw = place?.id ?? place?.name;
    return raw?.replace(/^places\//, "") ?? null;
  } catch {
    return null;
  }
}

function toSnippet(text: string, max = 140): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/** Place Details (New) — rating, count, and review texts for aggregation. */
export async function fetchPlaceDetails(
  placeId: string,
): Promise<GooglePlaceDetails | null> {
  const key = apiKey();
  if (!key || !placeId.trim()) return null;

  const id = placeId.startsWith("places/") ? placeId : `places/${placeId}`;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/${id}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "id,rating,userRatingCount,reviews.rating,reviews.text",
      },
      next: { revalidate: 60 * 60 * 24 * 7 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      id?: string;
      rating?: number;
      userRatingCount?: number;
      reviews?: { text?: { text?: string }; rating?: number }[];
    };

    const reviews: GooglePlaceReview[] = [];
    for (const r of data.reviews ?? []) {
      const text = r.text?.text?.trim() ?? "";
      if (!text) continue;
      reviews.push({
        text,
        ...(typeof r.rating === "number" ? { rating: r.rating } : {}),
      });
      if (reviews.length >= 5) break;
    }

    return {
      placeId: (data.id ?? id).replace(/^places\//, ""),
      rating: data.rating,
      userRatingCount: data.userRatingCount,
      reviews,
      snippets: reviews.slice(0, 3).map((r) => toSnippet(r.text)),
    };
  } catch {
    return null;
  }
}
