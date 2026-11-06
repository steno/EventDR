/**
 * Shell breakpoints — keep in sync with `--breakpoint-*` in globals.css.
 *
 * `lg` is the mobile ↔ desktop shell switch (event/venue two-column detail,
 * bottom nav, sticky brand header). Lower than Tailwind’s default 1024px so
 * mid-width windows keep the desktop layout (Instagram-like).
 *
 * Home discovery: landscape rails 2-col from `sm`, 3-col from Tailwind `xl`
 * (1280px). Portrait pair rails (Weekend / Recently added) use 3-col from `sm`
 * and 4–5-col from `xl` so desktop keeps the mixed card formats.
 */

/** Matches `--breakpoint-lg` (48rem at a 16px root). */
export const LG_MIN_WIDTH_PX = 768;

export const LG_MEDIA_QUERY = `(min-width: ${LG_MIN_WIDTH_PX}px)`;

/** Tailwind default `xl` — home rails go from 2-col to 3-col here. */
export const XL_MIN_WIDTH_PX = 1280;
