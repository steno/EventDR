"use client";

import { useMemo, useState } from "react";
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
  RESTAURANT_WEEK_2026_ID,
  RESTAURANT_WEEK_LOGO_PARTICIPANTS,
  type RestaurantWeekLogoParticipant,
} from "@/lib/restaurant-week";
import { fillTemplate } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

const AREA_ORDER: CitySlug[] = ["puerto-plata", "sosua", "cabarete"];

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

interface RestaurantWeekParticipantLogosProps {
  locale: Locale;
  returnTo: string;
  returnTitle?: string | null;
  openVenueLabel: string;
  openEventLabel: string;
  filterLabel: string;
  filterAll: string;
  emptyArea: string;
}

function participantHref(
  participant: RestaurantWeekLogoParticipant,
  locale: Locale,
  returnTo: string,
  returnTitle?: string | null,
): string {
  const title = returnTitle ?? undefined;
  if (participant.venueSlug) {
    return venueDetailPath(locale, participant.venueSlug, returnTo, title);
  }
  return eventDetailPath(locale, RESTAURANT_WEEK_2026_ID);
}

/** Full logo directory for the Restaurant Week event detail page. */
export function RestaurantWeekParticipantLogos({
  locale,
  returnTo,
  returnTitle,
  openVenueLabel,
  openEventLabel,
  filterLabel,
  filterAll,
  emptyArea,
}: RestaurantWeekParticipantLogosProps) {
  const [area, setArea] = useState<CitySlug | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const participants = useMemo(
    () => getRestaurantWeekLogoParticipants(area),
    [area],
  );

  if (RESTAURANT_WEEK_LOGO_PARTICIPANTS.length === 0) return null;

  return (
    <div>
      <div
        className="mb-2.5 flex flex-wrap gap-1.5"
        role="tablist"
        aria-label={filterLabel}
      >
        <AreaChip
          selected={area === null}
          onSelect={() => setArea(null)}
          label={filterAll}
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

      {participants.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
          {emptyArea}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
          {participants.map((participant) => {
            const href = participantHref(
              participant,
              locale,
              returnTo,
              returnTitle,
            );
            const pending = pendingId === participant.id;
            const dimmed = pendingId != null && pendingId !== participant.id;
            return (
              <li key={participant.id}>
                <IntentLink
                  href={href}
                  returnTo={returnTo}
                  returnTitle={returnTitle}
                  onClick={() => setPendingId(participant.id)}
                  aria-busy={pending || undefined}
                  aria-label={
                    participant.venueSlug
                      ? fillTemplate(openVenueLabel, {
                          name: participant.name,
                        })
                      : fillTemplate(openEventLabel, {
                          name: participant.name,
                        })
                  }
                  className={`
                    group flex h-[4.75rem] items-center justify-center overflow-hidden
                    rounded-xl border bg-white px-1.5 py-1.5
                    touch-manipulation
                    transition-[border-color,box-shadow,opacity,transform]
                    duration-300 ease-out
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-orange-500
                    sm:h-[5.25rem] sm:px-2 sm:py-2
                    ${pending ? LOGO_TILE_PENDING : LOGO_TILE_IDLE}
                    ${dimmed ? "opacity-45" : ""}
                  `}
                >
                  <span className="relative h-full w-full overflow-hidden bg-white">
                    <EventImage
                      src={participant.logoSrc}
                      alt=""
                      sizes="(max-width: 640px) 45vw, 30vw"
                      className="object-contain object-center no-photo-filter rw-logo-zoom"
                    />
                  </span>
                </IntentLink>
              </li>
            );
          })}
        </ul>
      )}
    </div>
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
