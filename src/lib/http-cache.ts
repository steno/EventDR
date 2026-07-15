/**
 * Shared cache timings.
 * Event listing APIs stay no-store (see /api/events) — CDN SWR briefly
 * served empty/stale catalogs after the Netlify credits pass.
 */
export const LISTING_REVALIDATE_SECONDS = 120;
export const EVENT_REVALIDATE_SECONDS = 180;
export const VENUES_REVALIDATE_SECONDS = 300;

export const EVENT_DETAIL_CACHE_CONTROL =
  "public, max-age=60, s-maxage=180, stale-while-revalidate=300";

export const VENUES_CACHE_CONTROL =
  "public, max-age=120, s-maxage=300, stale-while-revalidate=600";

export const NO_STORE_CACHE_CONTROL =
  "no-store, max-age=0, must-revalidate";
