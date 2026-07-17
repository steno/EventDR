/** Shared Eventbrite-style category capsule scroller classes. */

export const CATEGORY_PILL_BASE = `
  inline-flex h-9 shrink-0 items-center justify-start gap-1.5 rounded-full
  px-3.5 text-sm font-semibold leading-none
  transition-colors active:scale-[0.98] touch-manipulation
`;

export const CATEGORY_PILL_ACTIVE = `
  bg-orange-500 text-white
  hover:bg-orange-600
  dark:bg-orange-500 dark:text-white dark:hover:bg-orange-400
`;

export const CATEGORY_PILL_IDLE = `
  bg-neutral-100 text-neutral-800
  hover:bg-neutral-200/90
  dark:bg-neutral-800 dark:text-neutral-100
  dark:hover:bg-neutral-700
`;

export const CATEGORY_SCROLLER_BAR = `
  relative flex items-center gap-1.5 rounded-full
  border border-neutral-200/80 bg-white py-1.5 pl-1.5 pr-1.5
  shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_14px_rgba(15,23,42,0.04)]
  dark:border-neutral-700/80 dark:bg-neutral-900
  dark:shadow-none
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
