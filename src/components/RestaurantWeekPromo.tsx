"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IntentLink } from "@/components/IntentLink";
import { EventImage } from "@/components/EventImage";
import type { CitySlug } from "@/lib/cities";
import { getCityMeta, getCityName } from "@/lib/cities";
import {
  eventDetailPath,
  venueDetailPath,
} from "@/lib/event-navigation";
import {
  getRestaurantWeekLogoParticipants,
  isRestaurantWeekPromoActive,
  RESTAURANT_WEEK_2026_ID,
  RESTAURANT_WEEK_LOGO_PARTICIPANTS,
  type RestaurantWeekLogoParticipant,
} from "@/lib/restaurant-week";
import { SECTION_TITLE_CLASS } from "@/lib/page-shell";
import { fillTemplate } from "@/lib/seo";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const AREA_ORDER: CitySlug[] = ["puerto-plata", "sosua", "cabarete"];

/** Mobile teaser: 2×3 before “Show all”. Desktop always shows the full grid. */
const MOBILE_TEASER_LIMIT = 6;

const LOGO_TILE_IDLE = `
  border-neutral-200/90 bg-white
  hover:border-orange-300 hover:bg-white
  active:scale-[0.99] active:border-orange-400
  dark:border-neutral-700 dark:bg-white
  dark:hover:border-orange-400 dark:hover:bg-white
  dark:active:border-orange-500
`;

const LOGO_TILE_PENDING = `
  scale-[0.985] border-orange-400 bg-white
  shadow-[0_12px_32px_-16px_rgba(251,146,60,0.45)]
  ring-2 ring-orange-500/80
  dark:border-orange-500 dark:bg-white dark:ring-orange-400/70
`;

interface RestaurantWeekPromoProps {
  locale: Locale;
  dict: Dictionary;
  /** Home area filter — seeds the default chip when set. */
  citySlug?: CitySlug | null;
  returnTo?: string;
  returnTitle?: string | null;
}

function participantHref(
  participant: RestaurantWeekLogoParticipant,
  locale: Locale,
  returnTo?: string,
  returnTitle?: string | null,
): string {
  const title = returnTitle ?? undefined;
  if (participant.venueSlug) {
    return venueDetailPath(
      locale,
      participant.venueSlug,
      returnTo,
      title,
    );
  }
  return eventDetailPath(locale, RESTAURANT_WEEK_2026_ID);
}

export function RestaurantWeekPromo({
  locale,
  dict,
  citySlug = null,
  returnTo,
  returnTitle,
}: RestaurantWeekPromoProps) {
  const copy = dict.events.restaurantWeek;
  const [area, setArea] = useState<CitySlug | null>(citySlug);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setArea(citySlug);
  }, [citySlug]);

  useEffect(() => {
    setExpanded(false);
  }, [area]);

  const active = isRestaurantWeekPromoActive(locale);
  const participants = useMemo(
    () => getRestaurantWeekLogoParticipants(area),
    [area],
  );

  if (!active || RESTAURANT_WEEK_LOGO_PARTICIPANTS.length === 0) return null;

  const eventHref = eventDetailPath(locale, RESTAURANT_WEEK_2026_ID);
  const emptyFiltered = participants.length === 0;
  const hiddenCount = Math.max(0, participants.length - MOBILE_TEASER_LIMIT);
  const showMobileToggle = hiddenCount > 0;

  return (
    <section
      className="mb-8 sm:mb-10"
      aria-labelledby="restaurant-week-heading"
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
            {copy.eyebrow}
          </p>
          <h2
            id="restaurant-week-heading"
            className={`${SECTION_TITLE_CLASS} mt-0.5`}
          >
            {copy.title}
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-snug text-neutral-600 dark:text-neutral-300">
            <span className="font-medium text-neutral-800 dark:text-neutral-100">
              {copy.dates}
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">
              {" · "}
            </span>
            {copy.priceLine}
          </p>
        </div>
        <IntentLink
          href={eventHref}
          returnTo={returnTo}
          returnTitle={returnTitle}
          className="shrink-0 text-sm font-semibold text-orange-700 touch-manipulation hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
        >
          {copy.cta}
        </IntentLink>
      </div>

      <div
        className="mb-3 flex flex-wrap gap-1.5"
        role="tablist"
        aria-label={copy.filterLabel}
      >
        <AreaChip
          selected={area === null}
          onSelect={() => setArea(null)}
          label={copy.filterAll}
        />
        {AREA_ORDER.map((slug) => {
          const city = getCityMeta(slug);
          if (!city) return null;
          return (
            <AreaChip
              key={slug}
              selected={area === slug}
              onSelect={() => setArea(slug)}
              label={getCityName(city, locale)}
            />
          );
        })}
      </div>

      {emptyFiltered ? (
        <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
          {copy.emptyArea}
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5 lg:grid-cols-5">
            {participants.map((participant, index) => {
              const href = participantHref(
                participant,
                locale,
                returnTo,
                returnTitle,
              );
              const pending = pendingId === participant.id;
              const dimmed = pendingId != null && pendingId !== participant.id;
              const mobileCollapsed =
                !expanded && index >= MOBILE_TEASER_LIMIT;
              return (
                <li
                  key={participant.id}
                  className={mobileCollapsed ? "max-sm:hidden" : undefined}
                >
                  <IntentLink
                    href={href}
                    returnTo={returnTo}
                    returnTitle={returnTitle}
                    onClick={() => setPendingId(participant.id)}
                    aria-busy={pending || undefined}
                    aria-label={
                      participant.venueSlug
                        ? fillTemplate(copy.openVenue, {
                            name: participant.name,
                          })
                        : fillTemplate(copy.openEvent, {
                            name: participant.name,
                          })
                    }
                    className={`
                      group flex h-[5rem] items-center justify-center overflow-hidden
                      rounded-xl border bg-white px-1.5 py-1.5
                      touch-manipulation
                      transition-[border-color,box-shadow,opacity,transform]
                      duration-300 ease-out
                      focus-visible:outline focus-visible:outline-2
                      focus-visible:outline-offset-2 focus-visible:outline-orange-500
                      sm:h-[5.5rem] sm:px-2 sm:py-2
                      ${pending ? LOGO_TILE_PENDING : LOGO_TILE_IDLE}
                      ${dimmed ? "opacity-45" : ""}
                    `}
                  >
                    <span className="relative h-full w-full overflow-hidden bg-white">
                      <EventImage
                        src={participant.logoSrc}
                        alt=""
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 140px"
                        className="object-contain object-center no-photo-filter rw-logo-zoom"
                      />
                    </span>
                  </IntentLink>
                </li>
              );
            })}
          </ul>

          {showMobileToggle ? (
            <div className="mt-3 flex justify-center sm:hidden">
              <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                aria-expanded={expanded}
                className="
                  inline-flex min-h-11 items-center gap-1.5 rounded-full
                  border border-neutral-200 bg-white px-4 py-2
                  text-sm font-semibold text-neutral-800
                  touch-manipulation transition-colors active:scale-[0.98]
                  hover:border-orange-300 hover:text-orange-700
                  dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100
                  dark:hover:border-orange-600 dark:hover:text-orange-300
                "
              >
                {expanded ? (
                  <>
                    {copy.showLess}
                    <ChevronUp className="h-4 w-4" aria-hidden />
                  </>
                ) : (
                  <>
                    {fillTemplate(copy.showMore, {
                      count: String(hiddenCount),
                    })}
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  </>
                )}
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function AreaChip({
  selected,
  onSelect,
  label,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={`
        rounded-full px-3 py-1 text-xs font-semibold touch-manipulation
        transition-colors active:scale-[0.98]
        ${
          selected
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        }
      `}
    >
      {label}
    </button>
  );
}
