"use client";

import { Car } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { IntentLink } from "@/components/IntentLink";
import { WalkingPersonIcon } from "@/components/icons/WalkingPersonIcon";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getCategoryMeta } from "@/lib/categories";
import { eventDetailPath, rememberReturnPath } from "@/lib/event-navigation";
import { formatEventTimeForList } from "@/lib/event-time-display";
import { formatEventDateRange } from "@/lib/format-date";
import type { NearbyEventHit, NearbyTonightResult } from "@/lib/nearby-events";
import { localDateISO } from "@/lib/event-dates";
import {
  getEventLiveStatus,
  type EventLiveStatus,
} from "@/lib/event-status";
import {
  pocketDisplayName,
  pocketStripLabel,
} from "@/lib/walkable-pockets";

interface NearbyTonightProps {
  nearby: NearbyTonightResult;
  locale: Locale;
  dict: Dictionary;
  returnTo?: string;
  className?: string;
  /** Live status of the event/venue this rail sits under. */
  sourceStatus?: EventLiveStatus | null;
  /**
   * When true, prefer “today” over “tonight” (daytime standing attractions
   * like museums and umbrella streets).
   */
  daytimeSource?: boolean;
}

function relationLabel(
  hit: NearbyEventHit,
  dict: Dictionary,
): string | null {
  if (hit.relation === "same-venue") return dict.detail.sameVenue;
  if (hit.relation === "same-pocket") return dict.detail.sameStrip;
  return null;
}

/** Drop places that already closed today — don’t claim they’re “still open.” */
function isHitStillVisitable(
  hit: NearbyEventHit,
  now: Date = new Date(),
): boolean {
  const today = localDateISO(now);
  const date = hit.event.date?.trim();
  // Strip look-ahead: tomorrow+ stays.
  if (date && date > today) return true;

  const status = getEventLiveStatus(hit.event, now);
  return (
    status === "live" ||
    status === "ending" ||
    status === "upcoming" ||
    status === "unknown"
  );
}

function hitIsOpenNow(
  hit: NearbyEventHit,
  now: Date = new Date(),
): boolean {
  const status = getEventLiveStatus(hit.event, now);
  return status === "live" || status === "ending";
}

function pickNearbyHeading(
  nearby: NearbyTonightResult,
  dict: Dictionary,
  hits: NearbyEventHit[],
  sourceStatus?: EventLiveStatus | null,
  daytimeSource?: boolean,
  now: Date = new Date(),
): string {
  if (nearby.stripAhead) return dict.detail.alsoOnThisStrip;
  if (!nearby.isToday) return dict.detail.alsoNearby;

  const sourceClosed =
    sourceStatus === "closedToday" || sourceStatus === "ended";
  if (sourceClosed) {
    // Only promise “still open” when at least one neighbor is actually open.
    return hits.some((hit) => hitIsOpenNow(hit, now))
      ? dict.detail.stillOpenNearby
      : dict.detail.alsoNearby;
  }

  if (daytimeSource) return dict.detail.alsoNearbyToday;

  return dict.detail.alsoNearbyTonight;
}

function TravelMeta({
  hit,
  dict,
}: {
  hit: NearbyEventHit;
  dict: Dictionary;
}) {
  const relation = relationLabel(hit, dict);
  const driveLabel = dict.detail.driveMinutes.replace(
    "{n}",
    String(hit.driveMinutes),
  );
  const walkLabel = dict.detail.walkMinutes.replace(
    "{n}",
    String(hit.walkMinutes),
  );

  return (
    <p className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs font-semibold text-orange-700 dark:text-orange-400">
      {relation ? <span className="truncate">{relation}</span> : null}
      {relation ? (
        <span className="text-orange-300 dark:text-orange-700" aria-hidden>
          ·
        </span>
      ) : null}
      <span className="inline-flex items-center gap-2">
        <span
          className="inline-flex items-center gap-0.5"
          title={driveLabel}
          aria-label={driveLabel}
        >
          <Car className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>{hit.driveMinutes}&nbsp;min</span>
        </span>
        <span
          className="inline-flex items-center gap-0.5"
          title={walkLabel}
          aria-label={walkLabel}
        >
          <WalkingPersonIcon className="h-3 w-3 shrink-0" />
          <span>{hit.walkMinutes}&nbsp;min</span>
        </span>
      </span>
    </p>
  );
}

function NearbyCard({
  hit,
  locale,
  dict,
  returnTo,
  showDate,
}: {
  hit: NearbyEventHit;
  locale: Locale;
  dict: Dictionary;
  returnTo?: string;
  showDate?: boolean;
}) {
  const { event } = hit;
  const href = eventDetailPath(locale, event.id);
  const category = getCategoryMeta(event.category, dict.categories);
  const emoji = event.imageEmoji ?? category?.emoji ?? "📅";
  const timeLabel = formatEventTimeForList(event.time, {
    recurrence: event.recurrence,
    allDayLabel: dict.events.allDay,
  });
  const dateLabel = showDate
    ? formatEventDateRange(event.date, locale, { short: true })
    : null;
  const schedule = [dateLabel, timeLabel.display].filter(Boolean).join(" · ");

  return (
    <article className="group relative w-[11.5rem] shrink-0 snap-start overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 ring-1 ring-neutral-200/90 dark:ring-neutral-800 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.12)] transition-[box-shadow,transform] duration-300 hover:shadow-[0_8px_24px_-10px_rgba(251,146,60,0.28)] hover:ring-orange-300/70 dark:hover:ring-orange-800/60 active:scale-[0.99] cursor-pointer">
      <IntentLink
        href={href}
        onClick={() => rememberReturnPath(returnTo)}
        className="absolute inset-0 z-0 rounded-2xl touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        aria-label={event.title}
      />
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden pointer-events-none ${
          event.imageUrl
            ? "bg-neutral-100 dark:bg-neutral-800"
            : `bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}`
        }`}
      >
        {event.imageUrl ? (
          <EventImage
            src={event.imageUrl}
            alt=""
            sizes="184px"
            className="object-cover card-media-zoom"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl" aria-hidden>
            {emoji}
          </div>
        )}
      </div>
      <div className="relative z-[1] space-y-1 p-2.5 pointer-events-none">
        <h3 className="line-clamp-2 font-sans text-xs font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-100">
          {event.title}
        </h3>
        <TravelMeta hit={hit} dict={dict} />
        {schedule ? (
          <p className="truncate text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {schedule}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function NearbyTonight({
  nearby,
  locale,
  dict,
  returnTo,
  className = "mt-6",
  sourceStatus = null,
  daytimeSource = false,
}: NearbyTonightProps) {
  const hits = nearby.hits.filter((hit) => isHitStillVisitable(hit));
  if (!hits.length) return null;

  const heading = pickNearbyHeading(
    nearby,
    dict,
    hits,
    sourceStatus,
    daytimeSource,
  );

  return (
    <section
      className={className}
      aria-labelledby="nearby-tonight-heading"
    >
      <div className="mb-3 flex items-start gap-2.5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
          <WalkingPersonIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2
            id="nearby-tonight-heading"
            className="font-sans text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            {heading}
          </h2>
          {nearby.parkOnce && nearby.pocket ? (
            <p className="mt-0.5 text-sm font-medium leading-snug text-neutral-800 dark:text-neutral-200">
              {dict.detail.parkOnceWalk}
              <span className="text-neutral-400 dark:text-neutral-500">
                {" · "}
                {pocketDisplayName(nearby.pocket, locale)}
              </span>
            </p>
          ) : nearby.pocket ? (
            <p className="mt-0.5 text-sm font-medium leading-snug text-neutral-600 dark:text-neutral-300">
              {pocketDisplayName(nearby.pocket, locale)}
              {" · "}
              {pocketStripLabel(nearby.pocket, locale)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {hits.map((hit) => (
          <NearbyCard
            key={hit.event.id}
            hit={hit}
            locale={locale}
            dict={dict}
            returnTo={returnTo}
            showDate={Boolean(nearby.stripAhead)}
          />
        ))}
      </div>
    </section>
  );
}

/** Compact place-line meta when the event sits in a walkable pocket. */
export function PocketPlaceHint({
  pocket,
  locale,
  dict,
}: {
  pocket: NonNullable<NearbyTonightResult["pocket"]>;
  locale: Locale;
  dict: Dictionary;
}) {
  const label = dict.detail.pocketPlaceMeta
    .replace("{pocket}", pocketDisplayName(pocket, locale))
    .replace("{strip}", pocketStripLabel(pocket, locale));

  return (
    <span className="mt-1 block text-xs font-medium leading-snug text-neutral-500 dark:text-neutral-400">
      {label}
    </span>
  );
}
