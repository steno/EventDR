/** iOS-style category icon slider classes. */

export const CATEGORY_PILL_BASE = `
  flex flex-col items-center justify-center gap-1.5
  h-[7rem] w-[7.25rem] shrink-0 rounded-3xl
  box-border border border-transparent
  px-2 py-2 text-sm font-bold leading-tight text-center
  transition-[transform,opacity,filter,background-color,color] duration-200
  active:scale-[0.95] touch-manipulation
  outline-none focus:outline-none
  [-webkit-tap-highlight-color:transparent]
  shadow-[0_2px_8px_rgba(15,23,42,0.08)]
`;

export const CATEGORY_PILL_ACTIVE = `
  bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white
  border-transparent
  hover:from-orange-500 hover:via-orange-600 hover:to-orange-700
  dark:from-orange-500 dark:via-orange-600 dark:to-orange-700
  dark:hover:from-orange-400 dark:hover:via-orange-500 dark:hover:to-orange-600
`;

export const CATEGORY_PILL_IDLE = `
  bg-white text-neutral-800
  border-neutral-200/50
  hover:bg-orange-50 hover:text-orange-600
  dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700/50
  dark:hover:bg-orange-950/30 dark:hover:text-orange-400
`;

/** Pressed pill waiting on RSC / soft-nav settle. Inset ring — no outer yellow flash. */
export const CATEGORY_PILL_PENDING = `
  scale-[0.95] ring-2 ring-inset ring-orange-500/70
  dark:ring-orange-300/60
`;

/** Sibling pills while another is pending. */
export const CATEGORY_PILL_DIMMED = `opacity-45`;

export const CATEGORY_SCROLLER_BAR = `
  relative flex items-center gap-1.5
`;

export const CATEGORY_SCROLL_BTN = `
  flex h-9 w-9 shrink-0 items-center justify-center rounded-full
  border border-neutral-200 bg-white text-neutral-700
  shadow-sm transition-colors touch-manipulation
  hover:bg-neutral-50 hover:text-neutral-950
  active:scale-[0.96]
  dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100
  dark:hover:bg-neutral-700 dark:hover:text-white
`;
