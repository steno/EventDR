/**
 * Shared layout width tokens.
 *
 * Listing shells are fluid up to a soft ~1440px ceiling (Airbnb-ish density
 * without infinite stretch on ultrawide). Card grids use auto-fit so columns
 * grow inside that shell. Detail pages stay narrower for readable prose.
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

/** Event/venue detail — readable split width, no outer framed panel. */
export const PAGE_SHELL_DETAIL_CLASS = `relative mx-auto w-full max-w-6xl ${PAGE_GUTTER_CLASS}`;

/**
 * Card discovery grids — elastic columns: 2 on narrow phones, then as many
 * ~220px tiles as fit. Underscore in `1fr` keeps the arbitrary value valid in
 * Tailwind; `auto-fit` collapses unused tracks when the whole grid is short.
 * Truncated lists fill leftover cells with extra events (`fillCardGridPage`);
 * “More events” is a full-width bar on the next row (`col-span-full`).
 */
export const CARD_GRID_CLASS =
  "grid grid-cols-2 items-stretch gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(220px,_1fr))] sm:gap-3";

/** Full-row control under a complete card grid (More events). */
export const CARD_GRID_FULL_ROW_CLASS = "col-span-full w-full";
