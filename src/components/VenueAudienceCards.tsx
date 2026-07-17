"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EventImage } from "@/components/EventImage";
import type { Venue } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  getFeaturedVenues,
  HOME_VENUE_LIMIT,
  VENUE_AUDIENCE_FILTERS,
  type VenueAudienceFilter,
} from "@/lib/home-layout";

interface VenueAudienceCardsProps {
  locale: Locale;
  dict: Dictionary;
  /** SSR-provided venues so the sections are visible on first paint. */
  initialVenues?: Venue[];
  /** Max venues in each audience slider. */
  limit?: number;
}

function VenueSlideCard({
  venue,
  locale,
}: {
  venue: Venue;
  locale: Locale;
}) {
  return (
    <Link
      href={`/${locale}/venue/${venue.slug}`}
      className="
        group flex h-full flex-col overflow-hidden rounded-2xl
        border border-neutral-200/90 bg-white
        shadow-[0_8px_24px_-16px_rgba(0,0,0,0.22)]
        transition-colors touch-manipulation
        hover:border-orange-300/70 dark:border-neutral-800 dark:bg-neutral-950
        dark:shadow-[0_8px_24px_-16px_rgba(0,0,0,0.6)] dark:hover:border-orange-700/50
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
      "
      aria-label={venue.name}
    >
      <div className="relative aspect-[2.4/1] w-full shrink-0 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        {venue.imageUrl ? (
          <EventImage
            src={venue.imageUrl}
            alt=""
            sizes="(max-width: 640px) 92vw, 45vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center text-2xl"
            aria-hidden
          >
            {venue.emoji ?? "📍"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3.5 py-3 sm:px-4 sm:py-3.5">
        <h3 className="text-[15px] font-black leading-snug tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-base">
          {venue.name}
        </h3>
        <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
          {venue.city}
        </p>
        {venue.description ? (
          <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {venue.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function AudienceSlider({
  audience,
  venues,
  locale,
  dict,
}: {
  audience: VenueAudienceFilter;
  venues: Venue[];
  locale: Locale;
  dict: Dictionary;
}) {
  const hint =
    audience === "local" ? dict.venues.localHint : dict.venues.visitorHint;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(venues.length > 1);

  const syncScrollHints = useCallback(() => {
    const el = scrollRef.current;
    if (!el || venues.length === 0) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    setCanScrollLeft(left > 4);
    setCanScrollRight(left < maxScroll - 4);

    // Prefer slide width over full track when cards peek (~88%).
    const slide = el.querySelector<HTMLElement>("[data-venue-slide]");
    const slideWidth = slide?.offsetWidth ?? el.clientWidth;
    const gap = 12; // gap-3
    const index = Math.round(left / Math.max(slideWidth + gap, 1));
    setActiveIndex(Math.min(Math.max(index, 0), venues.length - 1));
  }, [venues.length]);

  useEffect(() => {
    syncScrollHints();
    const el = scrollRef.current;
    if (!el) return;
    const onResize = () => syncScrollHints();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncScrollHints, venues]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const slide = el.querySelector<HTMLElement>("[data-venue-slide]");
    const slideWidth = slide?.offsetWidth ?? el.clientWidth;
    const gap = 12;
    el.scrollTo({ left: index * (slideWidth + gap), behavior: "smooth" });
  }, []);

  return (
    <article className="min-w-0">
      <header className="mb-3 px-0.5">
        <h2 className="text-lg font-black tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-xl">
          {dict.venues[audience]}
        </h2>
        <p className="mt-0.5 text-sm leading-snug text-neutral-600 dark:text-neutral-400">
          {hint}
        </p>
      </header>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={syncScrollHints}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-0.5 scrollbar-hide"
          aria-label={dict.venues[audience]}
        >
          {venues.map((venue) => (
            <div
              key={venue.slug}
              data-venue-slide
              className="w-[88%] shrink-0 snap-start sm:w-[90%]"
            >
              <VenueSlideCard venue={venue} locale={locale} />
            </div>
          ))}
        </div>

        {/* Edge fades — scroll hint; only while more content exists */}
        {canScrollLeft && (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-neutral-50 to-transparent dark:from-black sm:w-14"
            aria-hidden
          />
        )}
        {canScrollRight && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-neutral-50 to-transparent dark:from-black sm:w-16"
            aria-hidden
          />
        )}

        {venues.length > 1 && (
          <div
            className="mt-2.5 flex justify-center gap-1.5"
            role="tablist"
            aria-label={dict.venues[audience]}
          >
            {venues.map((venue, index) => (
              <button
                key={venue.slug}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`${venue.name} (${index + 1}/${venues.length})`}
                onClick={() => scrollToIndex(index)}
                className={`h-1.5 rounded-full transition-all touch-manipulation ${
                  index === activeIndex
                    ? "w-4 bg-orange-500"
                    : "w-1.5 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-500"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function VenueAudienceCards({
  locale,
  dict,
  initialVenues,
  limit = HOME_VENUE_LIMIT,
}: VenueAudienceCardsProps) {
  const [venues, setVenues] = useState<Venue[]>(initialVenues ?? []);

  useEffect(() => {
    if (initialVenues?.length) return;
    fetch(`/api/venues?locale=${locale}`)
      .then((r) => r.json())
      .then((d: { venues?: Venue[] }) => setVenues(d.venues ?? []))
      .catch(() => {});
  }, [initialVenues, locale]);

  const sections = VENUE_AUDIENCE_FILTERS.map((audience) => ({
    audience,
    venues: getFeaturedVenues(venues, audience, limit),
  })).filter((section) => section.venues.length > 0);

  if (sections.length === 0) return null;

  return (
    <section className="mb-6 sm:mb-8" aria-label={dict.venues.title}>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-5">
        {sections.map(({ audience, venues: featured }) => (
          <AudienceSlider
            key={audience}
            audience={audience}
            venues={featured}
            locale={locale}
            dict={dict}
          />
        ))}
      </div>
    </section>
  );
}
