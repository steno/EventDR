import type { ReactNode } from "react";
import { EventImage } from "@/components/EventImage";
import {
  getHomeHeroTagline,
  type CitySlug,
} from "@/lib/cities";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface PhotoHeroProps {
  dict: Dictionary;
  locale: Locale;
  /** Featured event for the photo plane; falls back to brand gradient if missing. */
  featuredEvent?: Event | null;
  /** Place name synced with the home city picker (city or North Coast). */
  placeName?: string;
  /** Active home area — drives the SEO H2 so it stays in sync with the select. */
  citySlug?: CitySlug | null;
  /** Replaces the static H1 place name — typically the city dropdown. */
  locationPicker?: ReactNode;
  /** Shown under the tagline — e.g. cruise-day ship pill. */
  afterTagline?: ReactNode;
}

export function PhotoHero({
  dict,
  locale,
  featuredEvent = null,
  placeName,
  citySlug = null,
  locationPicker,
  afterTagline,
}: PhotoHeroProps) {
  const imageUrl = featuredEvent?.imageUrl?.trim() || null;
  const heroPlace = placeName?.trim() || dict.hero.nearYou;
  const tagline = getHomeHeroTagline(
    locale,
    citySlug,
    dict.hero.regionTagline,
  );

  // Use "Events in the" for North Coast region, "Events in" for specific cities
  const isRegion = citySlug == null || heroPlace === dict.cities.regionName;
  const eventsPrefix = isRegion ? dict.hero.events : dict.cities.eventsIn;

  return (
    <header className="relative -mx-5 mb-5 sm:-mx-6 lg:mx-0">
      <div className="absolute inset-0 overflow-hidden sm:rounded-2xl">
        {imageUrl ? (
          <div className="absolute inset-0">
            <EventImage
              src={imageUrl}
              alt=""
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600"
            aria-hidden
          />
        )}

        {/* Light: bottom-heavy scrim — photo stays open at the top */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-neutral-950/78 via-neutral-950/40 via-40% to-neutral-950/10 dark:hidden"
          aria-hidden
        />
        {/* Light: soft brand tip under copy */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-rose-800/30 to-transparent dark:hidden"
          aria-hidden
        />

        {/* Dark: fuller wash for large white type */}
        <div
          className="absolute inset-0 hidden bg-gradient-to-t from-black/80 via-black/45 to-black/25 dark:block"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-[15.5rem] flex-col justify-end gap-3 px-4 pb-5 pt-10 sm:min-h-[12.5rem] sm:px-6 sm:pb-5 sm:pt-8">
        <div className="@container min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
            {dict.seo.siteName}
          </p>
          <h1 className="mt-1 flex max-w-full flex-nowrap items-center gap-x-1 whitespace-nowrap font-extrabold leading-none [font-size:min(2.35rem,7.22cqi)] sm:items-baseline sm:gap-x-2 sm:text-[clamp(1.625rem,4.5vw,2.75rem)] sm:leading-[1.05]">
            <span className="shrink-0 text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
              {eventsPrefix}{" "}
            </span>
            <span className="shrink-0">
              {locationPicker ?? (
                <span className="bg-gradient-to-r from-orange-300 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent">
                  {heroPlace}
                </span>
              )}
            </span>
          </h1>
          <h2
            key={citySlug ?? "north-coast"}
            className="mt-2 max-w-xl text-copy font-medium text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
          >
            {tagline}
          </h2>
          {afterTagline}
        </div>
      </div>
    </header>
  );
}
