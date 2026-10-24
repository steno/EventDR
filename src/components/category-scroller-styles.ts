/** YouTube-style filter pills — text only, no icons. */

export const CATEGORY_PILL_BASE = `
  inline-flex shrink-0 items-center justify-center
  rounded-full px-4 py-2
  text-base font-medium leading-none whitespace-nowrap
  transition-[transform,opacity,background-color,color,box-shadow] duration-150
  active:scale-[0.97] touch-manipulation
  outline-none focus-visible:outline focus-visible:outline-2
  focus-visible:outline-offset-2 focus-visible:outline-orange-500
  [-webkit-tap-highlight-color:transparent]
`;

/** Selected: black on light / off-white on dark. */
export const CATEGORY_PILL_ACTIVE = `
  bg-neutral-950 text-white
  dark:bg-neutral-100 dark:text-neutral-950
`;

/**
 * Idle: light grey on light with a visible ring (cream page washes out bare
 * fills); warm mahogany → near-black → faint fuchsia + orange ring on dark
 * (matches page-glow atmosphere so pills read on `#0a0a0a`).
 */
export const CATEGORY_PILL_IDLE = `
  bg-neutral-100 text-neutral-800
  ring-1 ring-orange-500/40
  hover:bg-neutral-200/90 hover:ring-orange-500/55
  dark:bg-gradient-to-br dark:from-[#3a1810] dark:via-[#140806] dark:to-[#1a0a16]
  dark:text-neutral-100
  dark:ring-orange-400/30
  dark:hover:from-[#4a2018] dark:hover:via-[#1c0c0a] dark:hover:to-[#24101c]
  dark:hover:ring-orange-400/45
`;

/** Pressed pill waiting on RSC / soft-nav settle. */
export const CATEGORY_PILL_PENDING = `
  scale-[0.97] opacity-80
`;

/** Sibling pills while another is pending. */
export const CATEGORY_PILL_DIMMED = `opacity-45`;

export const CATEGORY_SCROLLER_BAR = `
  relative flex items-center
`;

/** z above rail fade only — parent `isolate` keeps this under sticky nav. */
export const CATEGORY_SCROLL_BTN = `
  absolute right-0 z-[11] flex h-8 w-8 shrink-0 items-center justify-center
  rounded-full border border-neutral-300 bg-white/95 text-neutral-700
  shadow-md backdrop-blur-sm transition-[transform,opacity,background-color]
  touch-manipulation
  hover:bg-neutral-50 hover:text-neutral-950
  active:scale-[0.96]
  dark:border-white/15 dark:bg-neutral-900/95 dark:text-neutral-100
  dark:hover:bg-neutral-800 dark:hover:text-white
`;
