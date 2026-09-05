/**
 * Shared cache timings.
 * `/api/events` uses a short CDN SWR for non-empty catalogs. Empty or
 * `?refresh=true` responses stay no-store so a cold miss cannot stick.
 */
export const LISTING_REVALIDATE_SECONDS = 600;
export const EVENT_REVALIDATE_SECONDS = 180;
export const VENUES_REVALIDATE_SECONDS = 300;

export const EVENT_DETAIL_CACHE_CONTROL =
  "public, max-age=60, s-maxage=180, stale-while-revalidate=300";

export const VENUES_CACHE_CONTROL =
  "public, max-age=120, s-maxage=300, stale-while-revalidate=600";

/** Listing HTML — short CDN TTL aligned with page `revalidate = 120`. */
export const LISTING_HTML_CACHE_CONTROL =
  "public, s-maxage=60, stale-while-revalidate=300";

/** JSON catalogs — browser 30s, CDN 60s, SWR 5 min. */
export const EVENTS_API_CACHE_CONTROL =
  "public, max-age=30, s-maxage=60, stale-while-revalidate=300";

export const NO_STORE_CACHE_CONTROL =
  "no-store, max-age=0, must-revalidate";

/**
 * Netlify Durable/Edge cache ignores query strings unless listed here.
 * Without this, `/api/events?venue=el-parq-cabarete` can reuse the unscoped
 * North Coast catalog (or another venue's schedule).
 */
export const EVENTS_API_NETLIFY_VARY =
  "query=locale|category|venue|city|when|includePast|refresh|__nextDataReq|_rsc,header=x-nextjs-data|x-next-debug-logging|next-router-prefetch|next-router-segment-prefetch|next-router-state-tree|next-url|rsc,cookie=__prerender_bypass|__next_preview_data";

export const VENUES_API_NETLIFY_VARY = "query=locale";

export function eventsApiCacheControl(options: {
  refresh?: boolean;
  empty?: boolean;
  error?: boolean;
}): string {
  if (options.refresh || options.empty || options.error) {
    return NO_STORE_CACHE_CONTROL;
  }
  return EVENTS_API_CACHE_CONTROL;
}

export function eventsApiHeaders(options?: {
  refresh?: boolean;
  empty?: boolean;
  error?: boolean;
}): Record<string, string> {
  return {
    "Cache-Control": eventsApiCacheControl(options ?? {}),
    "Netlify-Vary": EVENTS_API_NETLIFY_VARY,
  };
}
