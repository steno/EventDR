"use client";

import { memo, useMemo } from "react";
import { Calendar, Clock, MapPin, Navigation } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatEventDateRange } from "@/lib/format-date";
import { localDateISO, parseLocalDate } from "@/lib/event-dates";
import { getDirectionsUrl } from "@/lib/maps";

interface TodayHighlightsProps {
  events: Event[];
  locale: Locale;
  dict: Dictionary;
  onSelectEvent: (event: Event) => void;
}

function parseEventTimeWindow(time?: string): { start: number; end: number } | null {
  if (!time) return null;
  const matches = [...time.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)];
  if (matches.length === 0) return null;

  const times = matches
    .map((match) => {
      let hours = Number(match[1]);
      const minutes = Number(match[2] ?? "0");
      const meridiem = match[3].toUpperCase();
      if (meridiem === "PM" && hours !== 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    })
    .filter((value) => Number.isFinite(value));

  if (times.length === 0) return null;

  const start = times[0];
  const end = times.length > 1 ? times[times.length - 1] : start + 120;
  return { start, end: Math.max(end, start) };
}

function currentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function isHappeningNow(event: Event): boolean {
  const window = parseEventTimeWindow(event.time);
  if (!window) return true;

  const now = currentMinutes();
  if (window.end < window.start) {
    return now >= window.start || now <= window.end;
  }
  return now >= window.start && now <= window.end;
}

function hasEventStarted(event: Event): boolean {
  const window = parseEventTimeWindow(event.time);
  if (!window) return false;
  return currentMinutes() >= window.start;
}

function todayHighlightSortRank(event: Event): number {
  if (isHappeningNow(event)) return 0;

  const window = parseEventTimeWindow(event.time);
  if (!window) return 0;

  return currentMinutes() < window.start ? 1 : 2;
}

function compareTodayHighlights(a: Event, b: Event): number {
  const rankA = todayHighlightSortRank(a);
  const rankB = todayHighlightSortRank(b);
  if (rankA !== rankB) return rankA - rankB;

  const startA = parseEventTimeWindow(a.time)?.start ?? 0;
  const startB = parseEventTimeWindow(b.time)?.start ?? 0;
  if (rankA === 2) return startB - startA;
  return startA - startB;
}

function happensToday(event: Event): boolean {
  const today = localDateISO();
  const start = parseLocalDate(event.date);
  const end = parseLocalDate(event.endDate ?? event.date);
  const current = parseLocalDate(today);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || isNaN(current.getTime())) {
    return false;
  }
  return start <= current && end >= current;
}

const TodayHighlightsComponent = ({
  events,
  locale,
  dict,
  onSelectEvent,
}: TodayHighlightsProps) => {
  const todayEvents = useMemo(
    () => events.filter(happensToday).sort(compareTodayHighlights),
    [events],
  );

  if (todayEvents.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <h2 className="text-xl font-black tracking-tight text-neutral-950">
          {dict.events.happeningToday}
        </h2>
        {todayEvents.length > 1 && (
          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
            {dict.events.moreToday.replace("{count}", String(todayEvents.length - 1))}
          </span>
        )}
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {todayEvents.map((event) => (
          <article
            key={event.id}
            className="group flex min-w-[86%] snap-start flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.16)] sm:min-w-[20rem]"
          >
            {event.imageUrl && (
              <button
                type="button"
                onClick={() => onSelectEvent(event)}
                className="relative block h-40 w-full overflow-hidden bg-neutral-100 text-left touch-manipulation"
              >
                <EventImage
                  src={event.imageUrl}
                  alt=""
                  sizes="(max-width: 672px) 86vw, 320px"
                  className="object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 via-black/35 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0"
                  aria-hidden
                />
              </button>
            )}

            <div className="flex flex-1 flex-col p-5">
              <button
                type="button"
                onClick={() => onSelectEvent(event)}
                className="block w-full text-left touch-manipulation"
              >
                <p className="mb-1.5 text-[11px] font-black uppercase tracking-[0.24em] text-orange-500">
                  {hasEventStarted(event)
                    ? dict.events.eventStarted
                    : dict.events.happeningToday}
                </p>
                <h3 className="line-clamp-2 text-[19px] font-black leading-tight tracking-tight text-neutral-950">
                  {event.title}
                </h3>
                <p className="mt-2.5 line-clamp-2 text-[14px] font-medium leading-relaxed text-neutral-600">
                  {event.description}
                </p>
              </button>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold text-neutral-700">
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

              <div className="mt-auto flex gap-2 pt-5">
                <button
                  type="button"
                  onClick={() => onSelectEvent(event)}
                  className="flex-1 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white touch-manipulation active:scale-[0.98] transition-transform"
                >
                  {dict.events.viewDetails}
                </button>
                {event.format !== "digital" && (
                  <a
                    href={getDirectionsUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600 touch-manipulation active:scale-95 transition-transform"
                    aria-label={dict.detail.directions}
                  >
                    <Navigation className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export const TodayHighlights = memo(TodayHighlightsComponent);
