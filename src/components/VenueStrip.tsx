"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Venue } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  getFeaturedVenues,
  HOME_VENUE_LIMIT,
  VENUE_AUDIENCE_FILTERS,
  type VenueAudienceFilter,
} from "@/lib/home-layout";

interface VenueStripProps {
  locale: Locale;
  dict: Dictionary;
  /** SSR-provided venues so the strip is visible on first paint. */
  initialVenues?: Venue[];
  /** Max venues to show per audience tab. */
  limit?: number;
}

export function VenueStrip({
  locale,
  dict,
  initialVenues,
  limit = HOME_VENUE_LIMIT,
}: VenueStripProps) {
  const [venues, setVenues] = useState<Venue[]>(initialVenues ?? []);
  const [audience, setAudience] = useState<VenueAudienceFilter>("local");

  useEffect(() => {
    if (initialVenues?.length) return;
    fetch(`/api/venues?locale=${locale}`)
      .then((r) => r.json())
      .then((d: { venues?: Venue[] }) => setVenues(d.venues ?? []))
      .catch(() => {});
  }, [initialVenues, locale]);

  const featured = getFeaturedVenues(venues, audience, limit);
  if (featured.length === 0) return null;

  return (
    <section>
      <div
        className="-mx-1 mb-4 overflow-x-auto px-1 scrollbar-hide"
        role="tablist"
        aria-label={dict.venues.title}
      >
        <div className="flex min-w-max gap-0 border-b border-neutral-200 dark:border-neutral-800">
          {VENUE_AUDIENCE_FILTERS.map((filter) => {
            const selected = audience === filter;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setAudience(filter)}
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
                {dict.venues[filter]}
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
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {featured.map((v) => (
          <Link
            key={v.slug}
            href={`/${locale}/venue/${v.slug}`}
            className="
              flex-shrink-0 flex items-center gap-2 rounded-2xl
              bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 px-4 py-3
              shadow-sm hover:shadow-md transition-shadow
            "
          >
            <span className="text-xl" aria-hidden>
              {v.emoji ?? "📍"}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                {v.name}
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                {v.city}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
