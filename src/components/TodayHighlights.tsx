"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Navigation } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatEventDateRange } from "@/lib/format-date";
import { getDirectionsUrl } from "@/lib/maps";
import { eventDetailPath } from "@/lib/event-navigation";
import {
  getEventLiveStatus,
  isEventActiveToday,
  happensOnLocalDate,
  parseEventTimeWindow,
} from "@/lib/event-status";
import { getEventLiveStatusLabel } from "@/lib/event-status-label";

interface TodayHighlightsProps {
  events: Event[];
  locale: Locale;
  dict: Dictionary;
}

function todayHighlightSortRank(event: Event): number {
  const status = getEventLiveStatus(event);
  if (status === "live") return 0;
  if (status === "upcoming") return 1;
  return 2;
}

function compareTodayHighlights(a: Event, b: Event): number {
  const rankA = todayHighlightSortRank(a);
  const rankB = todayHighlightSortRank(b);
  if (rankA !== rankB) return rankA - rankB;

  const startA = parseEventTimeWindow(a.time)?.start ?? 0;
  const startB = parseEventTimeWindow(b.time)?.start ?? 0;
  return startA - startB;
}

const TodayHighlightsComponent = ({
  events,
  locale,
  dict,
}: TodayHighlightsProps) => {
  const todayEvents = useMemo(
    () =>
      events
        .filter((e) => happensOnLocalDate(e) && isEventActiveToday(e))
        .sort(compareTodayHighlights),
    [events],
  );

  if (todayEvents.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <h2 className="text-xl font-black tracking-tight text-neutral-950 dark:text-neutral-100">
          {dict.events.happeningToday}
        </h2>
        {todayEvents.length > 1 && (
          <span className="rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 text-xs font-bold text-orange-600">
            {dict.events.moreToday.replace("{count}", String(todayEvents.length - 1))}
          </span>
        )}
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {todayEvents.map((event) => {
          const href = eventDetailPath(locale, event.id, `/${locale}`);
          const status = getEventLiveStatus(event);
          const statusLabel = getEventLiveStatusLabel(event, dict);

          return (
            <article
              key={event.id}
              className="group flex min-w-[86%] snap-start flex-col overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.16)] dark:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)] transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 sm:min-w-[20rem]"
            >
              <Link
                href={href}
                className="flex flex-1 flex-col touch-manipulation active:scale-[0.995] transition-transform"
              >
                {event.imageUrl && (
                  <div className="relative h-40 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <EventImage
                      src={event.imageUrl}
                      alt=""
                      sizes="(max-width: 672px) 86vw, 320px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 via-black/35 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0"
                      aria-hidden
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  {statusLabel && (
                    <EventStatusBadge
                      label={statusLabel}
                      status={status}
                      className="mb-2 w-fit"
                    />
                  )}
                  <h3 className="line-clamp-2 text-[19px] font-black leading-tight tracking-tight text-neutral-950 dark:text-neutral-100">
                    {event.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-2 text-copy">
                    {event.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-copy font-medium text-neutral-800 dark:text-neutral-200">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-neutral-500" />
                      {formatEventDateRange(event.date, locale, {
                        endDate: event.endDate,
                        short: true,
                      })}
                    </span>
                    {event.time && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-neutral-500" />
                        {event.time}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-neutral-500" />
                      {event.venue ? `${event.venue}, ` : ""}
                      {event.location}
                    </span>
                  </div>
                </div>
              </Link>

              {event.format !== "digital" && (
                <div className="flex justify-end px-5 pb-5 pt-0">
                  <a
                    href={getDirectionsUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-neutral-500 dark:text-neutral-400 ring-1 ring-neutral-200/80 dark:ring-neutral-700/80 hover:text-orange-600 hover:ring-orange-200/80 dark:hover:ring-orange-900/50 touch-manipulation transition-colors"
                    aria-label={dict.detail.directions}
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    {dict.detail.directions}
                  </a>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export const TodayHighlights = memo(TodayHighlightsComponent);
