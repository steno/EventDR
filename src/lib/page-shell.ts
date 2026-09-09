/**
 * Shared layout width tokens.
 *
 * Shells are fluid up to a soft ~1440px ceiling (Airbnb-ish density without
 * infinite stretch on ultrawide). Card grids use auto-fill so columns grow
 * inside that shell without a single tile ballooning full-width. Listing and
 * detail pages share the same max width so desktop columns line up.
 */

/** Soft desktop ceiling — wide enough for dense grids, not billboard-wide. */
export const PAGE_MAX_WIDTH_CLASS = "max-w-[90rem]";

/** Horizontal gutters — keep in sync with PAGE_GUTTER_BLEED_CLASS. */
export const PAGE_GUTTER_CLASS = "px-5 sm:px-6 lg:px-10";

/**
 * Sticky chrome that paints edge-to-edge within the shell: cancel gutter then
 * re-apply it so the blur/border spans the full content column.
 */
export const PAGE_GUTTER_BLEED_CLASS =
  "-mx-5 px-5 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10";

/** Listing / discovery — fluid inside the soft ceiling. */
export const PAGE_SHELL_CLASS = `relative mx-auto w-full ${PAGE_MAX_WIDTH_CLASS} ${PAGE_GUTTER_CLASS}`;

/** Footer / bottom-nav width (callers add gutters). */
export const PAGE_WIDTH_CLASS = `mx-auto w-full ${PAGE_MAX_WIDTH_CLASS}`;

/** Event/venue/cruise detail — same desktop width as home, no outer framed panel. */
export const PAGE_SHELL_DETAIL_CLASS = `relative mx-auto w-full ${PAGE_MAX_WIDTH_CLASS} ${PAGE_GUTTER_CLASS}`;

/**
 * Section-title text fill (orange→rose→fuchsia).
 * Light: deeper ink stops so the wash doesn’t neon on cream.
 * Dark: softer 300s (same as hero place select) for contrast on black.
 */
export const BRAND_GRADIENT_TEXT_CLASS =
  "bg-gradient-to-r from-orange-700 via-rose-700 to-fuchsia-800 bg-clip-text text-transparent dark:from-orange-300 dark:via-rose-300 dark:to-fuchsia-300";

/** Listing section titles — Happening today, Trending, Our picks, etc. */
export const SECTION_TITLE_CLASS = `text-section font-extrabold lg:text-[1.9rem] lg:leading-[1.15] ${BRAND_GRADIENT_TEXT_CLASS}`;

/**
 * Event/venue detail photo height.
 * Mobile: half of `min(68dvh, 36rem)` minus the 2.75rem action row (matches
 * venue place-card photo so detail photos line up).
 * Desktop: fill the remaining viewport under the sticky header (same as
 * venue place-card), so short copy does not leave a stubby hero.
 */
export const DETAIL_HERO_PHOTO_HEIGHT_MOBILE_CLASS =
  "h-[calc((min(68dvh,36rem)-2.75rem)/2)]";

export const DETAIL_HERO_PHOTO_HEIGHT_CLASS = `${DETAIL_HERO_PHOTO_HEIGHT_MOBILE_CLASS} lg:h-auto lg:min-h-[calc(100dvh-var(--sticky-list-header-height,_0px)-1.5rem)]`;

/**
 * Card discovery grids — elastic columns: 2 on narrow phones, then as many
 * ~220px tiles as fit. Underscore in `1fr` keeps the arbitrary value valid in
 * Tailwind; `auto-fill` keeps empty tracks so sparse lists (e.g. one saved
 * event) stay tile-sized instead of stretching billboard-wide.
 * Truncated lists fill leftover cells with extra events (`fillCardGridPage`);
 * “More events” is a full-width bar on the next row (`col-span-full`).
 */
export const CARD_GRID_CLASS =
  "grid grid-cols-2 items-stretch gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(220px,_1fr))] sm:gap-3";

/** Full-row control under a complete card grid (More events). */
export const CARD_GRID_FULL_ROW_CLASS = "col-span-full w-full";
