"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { HorizontalScrollEdgeFades } from "@/components/HorizontalScrollEdgeFades";
import { IntentLink } from "@/components/IntentLink";
import {
  SNAP_RAIL_PEEK_CLASS,
  useHorizontalScrollHints,
} from "@/hooks/useHorizontalScrollHints";
import type { Venue } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { CitySlug } from "@/lib/cities";
import {
  getFeaturedVenues,
  HOME_VENUE_LIMIT,
  VENUE_AUDIENCE_FILTERS,
  type VenueAudienceFilter,
} from "@/lib/home-layout";
import { SECTION_TITLE_CLASS } from "@/lib/page-shell";
import { NETWORK_ONLY_FETCH } from "@/lib/pwa-refresh";
import { getVenueCardObjectPosition } from "@/lib/venue-images";

interface VenueAudienceCardsProps {
  locale: Locale;
  dict: Dictionary;
  /** SSR-provided venues so the sections are visible on first paint. */
  initialVenues?: Venue[];
  /** Max venues in each audience slider. */
  limit?: number;
  /** Home area filter — null means whole North Coast. */
  citySlug?: CitySlug | null;
  /** Limit which audience sliders render. Default: both. */
  audiences?: readonly VenueAudienceFilter[];
  /** When set, only these venue slugs appear (e.g. cruise-port allowlist). */
  allowedSlugs?: readonly string[];
  /** Override the visitor-slider heading. */
  visitorTitle?: string;
  returnTo?: string;
  returnTitle?: string | null;
}

function VenueSlideCard({
  venue,
  locale,
  loadImage,
  returnTo,
  returnTitle,
  pending,
  dimmed,
  onNavigate,
}: {
  venue: Venue;
  locale: Locale;
  /** When false, keep the card chrome but skip the image request. */
  loadImage: boolean;
  returnTo?: string;
  returnTitle?: string | null;
  pending?: boolean;
  dimmed?: boolean;
  onNavigate?: () => void;
}) {
  const sizes =
    "(max-width: 640px) 88vw, (max-width: 1280px) 50vw, 25vw";

  return (
    <IntentLink
      href={`/${locale}/venue/${venue.slug}`}
      returnTo={returnTo}
      returnTitle={returnTitle}
      onClick={() => onNavigate?.()}
      aria-busy={pending || undefined}
      aria-label={venue.name}
      className={`
        group relative block w-full overflow-hidden rounded-2xl
        aspect-[36/49] bg-neutral-100
        shadow-[0_8px_24px_-14px_rgba(0,0,0,0.18)] ring-1
        touch-manipulation
        transition-[box-shadow,transform,opacity,ring-color] duration-300 ease-out
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
        dark:bg-neutral-950 dark:shadow-[0_8px_24px_-14px_rgba(0,0,0,0.45)]
        ${
          pending
            ? "scale-[0.985] ring-2 ring-orange-500/80 shadow-[0_12px_32px_-16px_rgba(251,146,60,0.45)] dark:ring-orange-400/70"
            : dimmed
              ? "opacity-45 ring-black/5 dark:ring-white/10"
              : "ring-black/5 hover:ring-orange-400/50 hover:shadow-[0_12px_32px_-16px_rgba(251,146,60,0.35)] active:scale-[0.99] dark:ring-white/10 dark:hover:ring-orange-600/50"
        }
      `}
    >
      {venue.imageUrl && loadImage ? (
        <div className="absolute inset-0">
          <EventImage
            src={venue.imageUrl}
            alt=""
            sizes={sizes}
            priority={false}
            className={`object-cover ${getVenueCardObjectPosition(venue.slug)} card-media-zoom`}
          />
        </div>
      ) : venue.imageUrl ? (
        <span
          className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800"
          aria-hidden
        />
      ) : (
        <span
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 text-3xl"
          aria-hidden
        >
          {venue.emoji ?? "📍"}
        </span>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-neutral-950/75 via-neutral-950/35 to-transparent dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-rose-700/25 to-transparent transition-opacity duration-300 group-hover:opacity-50 dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[75%] bg-gradient-to-t from-black/80 via-black/45 to-transparent dark:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[70%] bg-gradient-to-t from-orange-600/50 via-rose-500/30 to-transparent transition-opacity duration-300 group-hover:opacity-40 dark:block"
        aria-hidden
      />

      {pending ? (
        <div
          className="pointer-events-none absolute inset-0 bg-orange-500/10"
          aria-hidden
        />
      ) : null}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3.5 sm:p-4">
        <h3 className="line-clamp-2 font-sans text-xl font-extrabold leading-snug tracking-[0.01em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)]">
          {venue.name}
        </h3>
        <p className="truncate text-sm font-medium text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
          {venue.city}
        </p>
      </div>
    </IntentLink>
  );
}

function AudienceSlider({
  audience,
  venues,
  locale,
  dict,
  mediaEnabled,
  title,
  returnTo,
  returnTitle,
  seeAllHref,
  seeAllLabel,
}: {
  audience: VenueAudienceFilter;
  venues: Venue[];
  locale: Locale;
  dict: Dictionary;
  /** Parent gates media until the section is near the viewport. */
  mediaEnabled: boolean;
  title?: string;
  returnTo?: string;
  returnTitle?: string | null;
  /** Optional “See all” link in the section header (usually Local favorites). */
  seeAllHref?: string;
  seeAllLabel?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    activeIndex,
    canScrollRight,
    onScroll: syncScrollHints,
    scrollToIndex,
  } = useHorizontalScrollHints(scrollRef, venues.length);
  // Once a slide has loaded, keep its image mounted so scroll-back doesn't flash.
  const [loadedThrough, setLoadedThrough] = useState(0);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaEnabled) return;
    // Rails are short (HOME_VENUE_LIMIT) and desktop shows 2–4 tiles — load all
    // once the section is near the viewport so peek/off-screen cards aren’t grey.
    setLoadedThrough(venues.length - 1);
  }, [mediaEnabled, venues.length]);

  const heading = title ?? dict.venues[audience];
  const railKey = `${audience}:${venues.map((venue) => venue.slug).join("|")}`;

  // snap-end on the last slide made some browsers open the rail at the end;
  // pin scroll to the first card after layout.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || venues.length === 0) return;
    el.scrollLeft = 0;
    const id = requestAnimationFrame(() => {
      el.scrollLeft = 0;
      syncScrollHints();
    });
    return () => cancelAnimationFrame(id);
  }, [railKey, venues.length, syncScrollHints]);

  return (
    <article className="min-w-0">
      <header className="mb-3 px-0.5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <h2 className={`${SECTION_TITLE_CLASS} tracking-tight`}>{heading}</h2>
          {seeAllHref ? (
            <IntentLink
              href={seeAllHref}
              className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 text-sm font-bold text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950/70 transition-colors touch-manipulation"
            >
              {seeAllLabel ?? dict.venues.directory.seeAll}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </IntentLink>
          ) : null}
        </div>
      </header>

      <div className="relative">
        <div
          key={railKey}
          ref={scrollRef}
          onScroll={syncScrollHints}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-0.5 scrollbar-hide"
          aria-label={heading}
        >
          {venues.map((venue, index) => (
            <div
              key={venue.slug}
              data-snap-slide
              // Width track matches On the horizon (88% → 2-up → 4-up).
              className={`${SNAP_RAIL_PEEK_CLASS} shrink-0 snap-start sm:w-[calc((100%-0.75rem)/2)] xl:w-[calc((100%-2.25rem)/4)]`}
            >
              <VenueSlideCard
                venue={venue}
                locale={locale}
                loadImage={mediaEnabled && index <= loadedThrough}
                returnTo={returnTo}
                returnTitle={returnTitle}
                pending={pendingSlug === venue.slug}
                dimmed={pendingSlug != null && pendingSlug !== venue.slug}
                onNavigate={() => setPendingSlug(venue.slug)}
              />
            </div>
          ))}
          {/*
            Leftover width after one card so the last slide can snap-start flush
            left — without snap-end (which opened some browsers on the last card).
          */}
          {venues.length > 1 ? (
            <div
              className="w-[12%] shrink-0 sm:w-[calc((100%+0.75rem)/2)] xl:w-[calc((300%+2.25rem)/4)]"
              aria-hidden
            />
          ) : null}
        </div>

        <HorizontalScrollEdgeFades canScrollRight={canScrollRight} />

        {venues.length > 1 ? (
          <div
            className="mt-2.5 flex justify-center gap-1.5"
            role="tablist"
            aria-label={heading}
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
        ) : null}
      </div>
    </article>
  );
}

export function VenueAudienceCards({
  locale,
  dict,
  initialVenues,
  limit = HOME_VENUE_LIMIT,
  citySlug = null,
  audiences = VENUE_AUDIENCE_FILTERS,
  allowedSlugs,
  visitorTitle,
  returnTo,
  returnTitle,
}: VenueAudienceCardsProps) {
  const [venues, setVenues] = useState<Venue[]>(initialVenues ?? []);
  const sectionRef = useRef<HTMLDivElement>(null);
  // Skip venue image requests until the section is near the viewport (or idle).
  const [mediaEnabled, setMediaEnabled] = useState(false);

  useEffect(() => {
    if (initialVenues?.length) {
      setVenues(initialVenues);
      return;
    }
    fetch(`/api/venues?locale=${locale}`, NETWORK_ONLY_FETCH)
      .then((r) => r.json())
      .then((d: { venues?: Venue[] }) => setVenues(d.venues ?? []))
      .catch(() => {});
  }, [initialVenues, locale]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let enabled = false;
    let timeoutId = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (enabled) return;
        enabled = true;
        setMediaEnabled(true);
        io.disconnect();
        window.clearTimeout(timeoutId);
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(el);

    // Fallback if IntersectionObserver never fires (e.g. unusual layout).
    timeoutId = window.setTimeout(() => {
      if (enabled) return;
      enabled = true;
      setMediaEnabled(true);
      io.disconnect();
    }, 4000);

    return () => {
      io.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, []);

  const sections = useMemo(
    () =>
      audiences
        .map((audience) => {
          if (allowedSlugs) {
            const bySlug = new Map(venues.map((venue) => [venue.slug, venue]));
            return {
              audience,
              venues: allowedSlugs
                .map((slug) => bySlug.get(slug))
                .filter((venue): venue is Venue => venue != null),
            };
          }
          return {
            audience,
            venues: getFeaturedVenues(venues, audience, limit, { citySlug }),
          };
        })
        .filter((section) => section.venues.length > 0),
    [venues, limit, citySlug, audiences, allowedSlugs],
  );

  if (sections.length === 0) return null;

  const wide = sections.length === 1;
  const showSeeAll = !allowedSlugs;
  const venuesHref = `/${locale}/venues`;

  return (
    <div ref={sectionRef} className="mb-6 sm:mb-8">
      <div className={wide ? "min-w-0" : "grid grid-cols-1 gap-7"}>
        {sections.map(({ audience, venues: featured }, index) => (
          <AudienceSlider
            key={`${audience}-${citySlug ?? "all"}`}
            audience={audience}
            venues={featured}
            locale={locale}
            dict={dict}
            mediaEnabled={mediaEnabled}
            title={audience === "visitor" ? visitorTitle : undefined}
            returnTo={returnTo}
            returnTitle={returnTitle}
            seeAllHref={showSeeAll && index === 0 ? venuesHref : undefined}
          />
        ))}
      </div>
    </div>
  );
}
