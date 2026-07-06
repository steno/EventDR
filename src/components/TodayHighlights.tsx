"use client";

import { memo } from "react";
import { Calendar, Clock, MapPin, Navigation } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatEventDateShort } from "@/lib/format-date";
import { localDateISO, parseLocalDate } from "@/lib/event-dates";
import { getDirectionsUrl } from "@/lib/maps";

interface TodayHighlightsProps {
  events: Event[];
  locale: Locale;
  dict: Dictionary;
  onSelectEvent: (event: Event) => void;
}

function parseTimeMinutes(time?: string): number {
  if (!time) return Number.MAX_SAFE_INTEGER;
  const match = [...time.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)].at(-1);
  if (!match) return Number.MAX_SAFE_INTEGER;

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
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
  const todayEvents = events
    .filter(happensToday)
    .sort((a, b) => {
      if (!a.recurrence && b.recurrence) return -1;
      if (a.recurrence && !b.recurrence) return 1;
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      if (a.imageUrl && !b.imageUrl) return -1;
      if (!a.imageUrl && b.imageUrl) return 1;
      return parseTimeMinutes(a.time) - parseTimeMinutes(b.time);
    });

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
            className="flex min-w-[86%] snap-start flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.16)] sm:min-w-[20rem]"
          >
            {event.imageUrl && (
              <button
                type="button"
                onClick={() => onSelectEvent(event)}
                className="relative block h-36 w-full overflow-hidden bg-neutral-100 text-left"
              >
                <EventImage
                  src={event.imageUrl}
                  alt=""
                  sizes="(max-width: 672px) 86vw, 320px"
                  className="object-cover"
                />
              </button>
            )}

            <div className="flex flex-1 flex-col p-4">
              <button
                type="button"
                onClick={() => onSelectEvent(event)}
                className="block w-full text-left"
              >
                <p className="mb-1 text-[11px] font-black uppercase tracking-[0.24em] text-orange-500">
                  {dict.events.happeningToday}
                </p>
                <h3 className="line-clamp-2 text-lg font-black leading-tight tracking-tight text-neutral-950">
                  {event.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm font-medium leading-relaxed text-neutral-500">
                  {event.description}
                </p>
              </button>

              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-semibold text-neutral-600">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                  {formatEventDateShort(event.date, locale)}
                </span>
                {event.time && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    {event.time}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                  {event.venue ? `${event.venue}, ` : ""}
                  {event.location}
                </span>
              </div>

              <div className="mt-auto flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => onSelectEvent(event)}
                  className="flex-1 rounded-full bg-neutral-950 px-4 py-2.5 text-sm font-black text-white"
                >
                  {dict.events.viewDetails}
                </button>
                {event.format !== "digital" && (
                  <a
                    href={getDirectionsUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-600"
                    aria-label={dict.detail.directions}
                  >
                    <Navigation className="h-4 w-4" />
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
