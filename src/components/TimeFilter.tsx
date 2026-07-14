"use client";

import type { TimeRange } from "@/lib/filters";
import type { Dictionary } from "@/i18n/dictionaries";

const RANGES: TimeRange[] = ["all", "today", "tomorrow", "weekend"];

interface TimeFilterProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  dict: Dictionary;
  className?: string;
}

export function TimeFilter({ value, onChange, dict, className = "mb-4" }: TimeFilterProps) {
  return (
    <div
      className={`-mx-1 overflow-x-auto px-1 scrollbar-hide ${className}`}
      role="tablist"
      aria-label={dict.browse.subtitle}
    >
      <div className="flex min-w-max gap-0 border-b border-neutral-200 dark:border-neutral-800">
        {RANGES.map((range) => {
          const selected = value === range;
          return (
            <button
              key={range}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(range)}
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
  );
}
