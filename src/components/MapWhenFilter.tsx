"use client";

import { trackEvent } from "@/lib/analytics";
import {
  MAP_TIME_FILTERS,
  type MapTimeFilter,
} from "@/lib/map-events";
import type { Dictionary } from "@/i18n/dictionaries";

interface MapWhenFilterProps {
  value: MapTimeFilter;
  onChange: (when: MapTimeFilter) => void;
  dict: Dictionary;
  className?: string;
}

/** Compact Today / Weekend / All control for the events map. */
export function MapWhenFilter({
  value,
  onChange,
  dict,
  className = "",
}: MapWhenFilterProps) {
  return (
    <div
      role="tablist"
      aria-label={dict.map.whenFilter}
      className={`
        inline-flex items-center gap-0.5 rounded-full bg-white/95 p-1
        shadow-lg ring-1 ring-neutral-200/80 backdrop-blur-xl
        dark:bg-neutral-900/95 dark:ring-white/10
        ${className}
      `}
    >
      {MAP_TIME_FILTERS.map((when) => {
        const selected = value === when;
        return (
          <button
            key={when}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => {
              if (when === value) return;
              trackEvent("select_time", { time_range: when, surface: "map" });
              onChange(when);
            }}
            className={`
              min-h-8 rounded-full px-3 text-xs font-bold tracking-tight
              transition-colors touch-manipulation sm:min-h-9 sm:px-3.5 sm:text-sm
              ${
                selected
                  ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
              }
            `}
          >
            {dict.map.when[when]}
          </button>
        );
      })}
    </div>
  );
}
