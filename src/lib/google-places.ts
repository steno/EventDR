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

export interface PlacesProbeResult {
  ok: boolean;
  configured: boolean;
  step: "config" | "text_search" | "place_details" | "done";
  placeId?: string;
  rating?: number;
  reviewCount?: number;
  reviewTexts?: number;
  status?: number;
  error?: string;
}

export function isGooglePlacesConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY?.trim());
}

function apiKey(): string | null {
  return process.env.GOOGLE_PLACES_API_KEY?.trim() || null;
}

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as {
      error?: { message?: string; status?: string };
      message?: string;
    };
    return (
      body.error?.message ||
      body.message ||
      `${res.status} ${res.statusText}`
    );
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

/**
 * Resolve a Google place_id from venue name + optional coords.
 * Tries several query variants (aliases, ASCII fold, city splits).
 */
export async function findPlaceId(
  name: string,
  venue?: Partial<Pick<Venue, "lat" | "lng" | "city" | "slug">>,
): Promise<string | null> {
  const probed = await findPlaceIdWithStatus(name, venue);
  return probed.placeId ?? null;
}

function asciiFold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ü/gi, "u")
    .replace(/ñ/gi, "n");
}

/** Extra Text Search queries when the seed name alone misses Google. */
const PLACE_SEARCH_ALIASES: Record<string, string[]> = {
  "cowork-cabarete": [
    "Blue Coworking Cabarete",
    "Blue Coworking Cabarete Dominican Republic",
  ],
  "pingui-bar": [
    "Pingui Bar El Pueblito Puerto Plata",
    "Pingui Bar Restaurant Playa El Pueblito Puerto Plata",
    "Pingüi Bar Puerto Plata",
  ],
  "sea-horse-ranch": [
    "Sea Horse Ranch Sosua Cabarete",
    "Sea Horse Ranch Sosúa",
    "Sea Horse Ranch Cabarete Dominican Republic",
  ],
  "paseo-dona-blanca": [
    "Paseo de Doña Blanca Puerto Plata",
    "Paseo Dona Blanca Puerto Plata",
    "Calle Rosada Puerto Plata",
  ],
  "el-batey-sosua": [
    "El Batey Sosua Dominican Republic",
    "Pedro Clisante Sosua",
  ],
  "paella-pop-el-pueblito": [
    "Paella POP Playa El Pueblito Puerto Plata",
    "Paella POP El Pueblito",
  ],
};

function buildPlaceQueries(
  name: string,
  venue?: Partial<Pick<Venue, "lat" | "lng" | "city" | "slug">>,
): string[] {
  const queries: string[] = [];
  const push = (q: string) => {
    const t = q.trim();
    if (t && !queries.includes(t)) queries.push(t);
  };

  const city = venue?.city?.trim() ?? "";
  const cityParts = city
    .split(/[-–,\/]| and /i)
    .map((p) => p.trim())
    .filter(Boolean);

  push(`${name} ${city} Dominican Republic`.replace(/\s+/g, " "));
  push(`${name} Dominican Republic`);
  push(name);
  for (const part of cityParts) {
    push(`${name} ${part} Dominican Republic`);
  }
  push(asciiFold(`${name} ${city} Dominican Republic`));

  if (venue?.slug && PLACE_SEARCH_ALIASES[venue.slug]) {
    for (const alias of PLACE_SEARCH_ALIASES[venue.slug]) {
      push(alias);
      push(`${alias} Dominican Republic`);
    }
  }

  return queries;
}

async function textSearchPlaceId(
  textQuery: string,
  venue?: Partial<Pick<Venue, "lat" | "lng">>,
): Promise<{ placeId?: string; status?: number; error?: string }> {
  const key = apiKey();
  if (!key) return { error: "GOOGLE_PLACES_API_KEY missing" };

  const body: Record<string, unknown> = {
    textQuery,
    maxResultCount: 1,
    languageCode: "en",
  };
  if (
    typeof venue?.lat === "number" &&
    Number.isFinite(venue.lat) &&
    typeof venue?.lng === "number" &&
    Number.isFinite(venue.lng)
  ) {
    body.locationBias = {
      circle: {
        center: { latitude: venue.lat, longitude: venue.lng },
        radius: 8000,
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
        cache: "no-store",
      },
    );
    if (!res.ok) {
      return { status: res.status, error: await readError(res) };
    }
    const data = (await res.json()) as {
      places?: { id?: string; name?: string }[];
    };
    const place = data.places?.[0];
    const raw = place?.id ?? place?.name;
    const placeId = raw?.replace(/^places\//, "") ?? undefined;
    if (!placeId) {
      return { status: res.status, error: "Text Search returned no places" };
    }
    return { placeId, status: res.status };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Text Search network error",
    };
  }
}

export type PlaceLocationResult = {
  placeId: string;
  lat: number;
  lng: number;
  displayName?: string;
};

/**
 * Resolve lat/lng for a venue name via Places Text Search (ingest venue linking).
 */
export async function findPlaceLocation(
  name: string,
  city?: string,
): Promise<PlaceLocationResult | null> {
  const key = apiKey();
  if (!key || !name.trim()) return null;

  const textQuery = `${name.trim()} ${city?.trim() ?? ""} Dominican Republic`
    .replace(/\s+/g, " ")
    .trim();

  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.location",
        },
        body: JSON.stringify({
          textQuery,
          maxResultCount: 1,
          languageCode: "en",
        }),
        cache: "no-store",
      },
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      places?: {
        id?: string;
        name?: string;
        displayName?: { text?: string };
        location?: { latitude?: number; longitude?: number };
      }[];
    };
    const place = data.places?.[0];
    const raw = place?.id ?? place?.name;
    const placeId = raw?.replace(/^places\//, "");
    const lat = place?.location?.latitude;
    const lng = place?.location?.longitude;
    if (
      !placeId ||
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return null;
    }
    return {
      placeId,
      lat,
      lng,
      displayName: place?.displayName?.text,
    };
  } catch {
    return null;
  }
}

export async function findPlaceIdWithStatus(
  name: string,
  venue?: Partial<Pick<Venue, "lat" | "lng" | "city" | "slug">>,
): Promise<{ placeId?: string; status?: number; error?: string }> {
  if (!apiKey() || !name.trim()) {
    return { error: "GOOGLE_PLACES_API_KEY missing or empty name" };
  }

  const queries = buildPlaceQueries(name, venue);
  let lastError = "Text Search returned no places";
  let lastStatus: number | undefined;

  for (const query of queries) {
    const result = await textSearchPlaceId(query, venue);
    if (result.placeId) return result;
    lastError = result.error ?? lastError;
    lastStatus = result.status ?? lastStatus;
  }

  return { status: lastStatus, error: lastError };
}

function toSnippet(text: string, max = 140): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/**
 * Place Details field masks map to Google SKUs:
 * - rating: Enterprise (rating + count) — no Atmosphere surcharge
 * - reviews: Enterprise + Atmosphere (review text) — ~$25/1k after free cap
 * Default is rating-only so callers do not accidentally bill Atmosphere.
 */
export type PlaceDetailsMode = "rating" | "reviews";

const PLACE_DETAILS_FIELD_MASK: Record<PlaceDetailsMode, string> = {
  rating: "id,rating,userRatingCount",
  reviews: "id,rating,userRatingCount,reviews.rating,reviews.text",
};

export interface FetchPlaceDetailsOptions {
  /** @default "rating" */
  mode?: PlaceDetailsMode;
}

/** Place Details (New) — rating/count by default; review texts only when mode=reviews. */
export async function fetchPlaceDetails(
  placeId: string,
  options?: FetchPlaceDetailsOptions,
): Promise<GooglePlaceDetails | null> {
  const probed = await fetchPlaceDetailsWithStatus(placeId, options);
  return probed.details ?? null;
}

export async function fetchPlaceDetailsWithStatus(
  placeId: string,
  options?: FetchPlaceDetailsOptions,
): Promise<{
  details?: GooglePlaceDetails;
  status?: number;
  error?: string;
}> {
  const key = apiKey();
  if (!key || !placeId.trim()) {
    return { error: "GOOGLE_PLACES_API_KEY missing or empty placeId" };
  }

  const mode: PlaceDetailsMode = options?.mode ?? "rating";
  const id = placeId.startsWith("places/") ? placeId : `places/${placeId}`;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/${id}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": PLACE_DETAILS_FIELD_MASK[mode],
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return { status: res.status, error: await readError(res) };
    }

    const data = (await res.json()) as {
      id?: string;
      rating?: number;
      userRatingCount?: number;
      reviews?: { text?: { text?: string }; rating?: number }[];
    };

    const reviews: GooglePlaceReview[] = [];
    if (mode === "reviews") {
      for (const r of data.reviews ?? []) {
        const text = r.text?.text?.trim() ?? "";
        if (!text) continue;
        reviews.push({
          text,
          ...(typeof r.rating === "number" ? { rating: r.rating } : {}),
        });
        if (reviews.length >= 5) break;
      }
    }

    return {
      status: res.status,
      details: {
        placeId: (data.id ?? id).replace(/^places\//, ""),
        rating: data.rating,
        userRatingCount: data.userRatingCount,
        reviews,
        snippets: reviews.slice(0, 3).map((r) => toSnippet(r.text)),
      },
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Place Details network error",
    };
  }
}

/** One-venue health check for ops / cron. */
export async function probeGooglePlaces(
  name: string,
  venue?: Partial<Pick<Venue, "lat" | "lng" | "city" | "slug">>,
): Promise<PlacesProbeResult> {
  if (!isGooglePlacesConfigured()) {
    return {
      ok: false,
      configured: false,
      step: "config",
      error: "GOOGLE_PLACES_API_KEY is not set",
    };
  }

  const search = await findPlaceIdWithStatus(name, venue);
  if (!search.placeId) {
    return {
      ok: false,
      configured: true,
      step: "text_search",
      status: search.status,
      error: search.error,
    };
  }

  // Probe uses rating-only — avoids Atmosphere SKU on health checks.
  const details = await fetchPlaceDetailsWithStatus(search.placeId, {
    mode: "rating",
  });
  if (!details.details) {
    return {
      ok: false,
      configured: true,
      step: "place_details",
      placeId: search.placeId,
      status: details.status,
      error: details.error,
    };
  }

  return {
    ok: true,
    configured: true,
    step: "done",
    placeId: details.details.placeId,
    rating: details.details.rating,
    reviewCount: details.details.userRatingCount,
    reviewTexts: details.details.reviews.length,
  };
}
