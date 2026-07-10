"use client";

import type { TimeRange } from "@/lib/filters";
import type { Dictionary } from "@/i18n/dictionaries";

const RANGES: TimeRange[] = ["all", "today", "weekend", "week"];

interface TimeFilterProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  dict: Dictionary;
}

export function TimeFilter({ value, onChange, dict }: TimeFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-4 -mx-1 px-1">
      {RANGES.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => onChange(range)}
          className={`
            flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all
            ${
              value === range
                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm"
                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700"
            }
          `}
        >
          {dict.time[range]}
        </button>
      ))}
    </div>
  );
}
