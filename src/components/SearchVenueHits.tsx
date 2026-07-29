"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import type { Venue } from "@/lib/types";
import type { Locale } from "@/i18n/config";

interface SearchVenueHitsProps {
  venues: Venue[];
  locale: Locale;
  title: string;
}

/** Compact venue rows shown above event search results. */
export function SearchVenueHits({ venues, locale, title }: SearchVenueHitsProps) {
  if (venues.length === 0) return null;

  return (
    <section className="mb-6" aria-label={title}>
      <h2 className="mb-3 text-xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
        {title}
      </h2>
      <ul className="space-y-2">
        {venues.map((venue) => (
          <li key={venue.slug}>
            <Link
              href={`/${locale}/venue/${venue.slug}`}
              prefetch={false}
              className="
                flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-2.5
                shadow-sm transition-colors touch-manipulation
                hover:border-orange-300 dark:border-neutral-800 dark:bg-neutral-900
                dark:hover:border-orange-800
              "
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                {venue.imageUrl ? (
                  <EventImage
                    src={venue.imageUrl}
                    alt=""
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xl" aria-hidden>
                    {venue.emoji ?? "📍"}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {venue.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{venue.city}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
