"use client";

import {
  FILTER_TIME_RANGES,
  type FilterTimeRange,
} from "@/lib/filters";
import type { Dictionary } from "@/i18n/dictionaries";

interface TimeFilterProps {
  value: FilterTimeRange;
  onChange: (range: FilterTimeRange) => void;
  dict: Dictionary;
  className?: string;
  /** Stick under the list header (or viewport top on home). */
  sticky?: boolean;
}

export function TimeFilter({
  value,
  onChange,
  dict,
  className = "",
  sticky = true,
}: TimeFilterProps) {
  return (
    <div
      className={`
        ${
          sticky
            ? "sticky top-[calc(var(--sticky-list-header-height,0px)-1px)] z-10 -mx-4 mb-4 border-b border-neutral-200/60 bg-neutral-50/95 px-4 pb-2 pt-px backdrop-blur-sm dark:border-neutral-800/60 dark:bg-neutral-950/95"
            : ""
        }
        ${className}
      `}
      role="tablist"
      aria-label={dict.submit.time}
    >
      <div className="-mx-1 overflow-x-auto px-1 scrollbar-hide">
        <div className="flex min-w-max gap-0 border-b border-neutral-200 dark:border-neutral-800">
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
                  relative -mb-px flex-shrink-0 px-3.5 py-2.5 text-sm font-bold tracking-tight
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
      </div>
    </div>
  );
}
