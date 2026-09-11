/**
 * Shell breakpoints — keep in sync with `--breakpoint-*` in globals.css.
 *
 * `lg` is the mobile ↔ desktop shell switch (event/venue two-column detail,
 * bottom nav, sticky brand header). Lower than Tailwind’s default 1024px so
 * mid-width windows keep the desktop layout (Instagram-like).
 */

/** Matches `--breakpoint-lg` (48rem at a 16px root). */
export const LG_MIN_WIDTH_PX = 768;

export const LG_MEDIA_QUERY = `(min-width: ${LG_MIN_WIDTH_PX}px)`;
