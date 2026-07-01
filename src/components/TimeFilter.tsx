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
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 border border-neutral-100 hover:border-neutral-200"
            }
          `}
        >
          {dict.time[range]}
        </button>
      ))}
    </div>
  );
}
