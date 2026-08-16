"use client";

import {
  FILTER_TIME_RANGES,
  PRICE_FILTERS,
  type FilterTimeRange,
  type PriceFilter,
} from "@/lib/filters";
import type { Dictionary } from "@/i18n/dictionaries";
import { PAGE_GUTTER_BLEED_CLASS } from "@/lib/page-shell";

interface TimeFilterProps {
  value: FilterTimeRange;
  onChange: (range: FilterTimeRange) => void;
  dict: Dictionary;
  className?: string;
  /** Stick under the list header (or viewport top on home). */
  sticky?: boolean;
  /** Optional Gratis/Pago toggles on the same bar — ANDed with the time tab. */
  price?: PriceFilter;
  onPriceChange?: (price: PriceFilter) => void;
}

export function TimeFilter({
  value,
  onChange,
  dict,
  className = "",
  sticky = true,
  price,
  onPriceChange,
}: TimeFilterProps) {
  const showPrice = price != null && Boolean(onPriceChange);

  return (
    <div
      className={`
        ${
          sticky
            ? `sticky top-[calc(var(--sticky-list-header-height,0px)-1px)] z-10 mb-4 ${PAGE_GUTTER_BLEED_CLASS} border-b border-neutral-200/60 bg-neutral-50/95 pb-2 pt-px backdrop-blur-sm dark:border-neutral-800/60 dark:bg-neutral-950/95 transition-[top] duration-200 ease-out motion-reduce:transition-none`
            : ""
        }
        ${className}
      `}
    >
      <div className="-mx-1 overflow-x-auto px-1 scrollbar-hide">
        <div className="flex min-w-max items-end gap-3">
          <div
            className="flex min-w-max gap-0 border-b border-neutral-200 dark:border-neutral-800"
            role="tablist"
            aria-label={dict.submit.time}
          >
            {FILTER_TIME_RANGES.map((range) => {
              const selected = value === range;
              return (
                <button
                  key={range}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    if (range === value) return;
                    onChange(range);
                  }}
                  className={`
                    relative -mb-px flex-shrink-0 px-3.5 py-2.5 text-base font-bold tracking-tight
                    transition-colors touch-manipulation
                    ${
                      selected
                        ? "text-neutral-950 dark:text-neutral-50"
                        : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                    }
                  `}
                >
                  {dict.time[range]}
                  <span
                    aria-hidden
                    className={`
                      absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-opacity
                      ${
                        selected
                          ? "bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 opacity-100"
                          : "opacity-0"
                      }
                    `}
                  />
                </button>
              );
            })}
          </div>
          {showPrice ? (
            <div
              className="flex shrink-0 items-center gap-2 pb-2"
              role="group"
              aria-label={dict.price.ariaLabel}
            >
              {PRICE_FILTERS.map((option) => {
                const selected = price === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onPriceChange?.(selected ? "all" : option)}
                    className={`
                      inline-flex items-center rounded-full border px-3 py-1
                      text-sm font-bold tracking-tight
                      transition-[color,background-color,border-color,transform]
                      touch-manipulation active:scale-[0.98]
                      focus-visible:outline focus-visible:outline-2
                      focus-visible:outline-offset-2 focus-visible:outline-orange-500
                      ${
                        selected
                          ? "border-orange-500/60 bg-orange-500/12 text-orange-700 dark:border-orange-400/50 dark:bg-orange-400/15 dark:text-orange-300"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-orange-300 hover:text-orange-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-orange-800 dark:hover:text-orange-300"
                      }
                    `}
                  >
                    {dict.price[option]}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
