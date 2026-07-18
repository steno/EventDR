/** iOS-style category icon slider classes. */

export const CATEGORY_PILL_BASE = `
  flex flex-col items-center justify-center gap-2
  h-[110px] w-[90px] shrink-0 rounded-3xl
  p-3 text-xs font-semibold leading-tight text-center
  transition-all active:scale-[0.95] touch-manipulation
  shadow-[0_2px_8px_rgba(15,23,42,0.08)]
`;

export const CATEGORY_PILL_ACTIVE = `
  bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white
  hover:from-orange-500 hover:via-orange-600 hover:to-orange-700
  dark:from-orange-500 dark:via-orange-600 dark:to-orange-700
  dark:hover:from-orange-400 dark:hover:via-orange-500 dark:hover:to-orange-600
`;

export const CATEGORY_PILL_IDLE = `
  bg-white text-neutral-800
  hover:bg-neutral-50
  dark:bg-neutral-800 dark:text-neutral-100
  dark:hover:bg-neutral-750
  border border-neutral-200/50 dark:border-neutral-700/50
`;

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
