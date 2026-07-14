"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { useLiveStatusDisplay } from "@/hooks/useLiveStatusDisplay";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { eventDetailPath } from "@/lib/event-navigation";
import { useTodayHighlightShuffleSeed } from "@/hooks/useTodayHighlightShuffleSeed";
import {
  getTodayHighlightEvents,
  HOME_TODAY_LIMIT,
} from "@/lib/home-layout";

interface TodayHighlightsProps {
  events: Event[];
  locale: Locale;
  dict: Dictionary;
  limit?: number;
  /** Skip events already featured elsewhere on the home page (e.g. photo hero). */
  excludeEventIds?: string[];
}

function TodayHighlightCard({
  event,
  locale,
  dict,
}: {
  event: Event;
  locale: Locale;
  dict: Dictionary;
}) {
  const href = eventDetailPath(locale, event.id, `/${locale}`);
  const liveDisplay = useLiveStatusDisplay(event, dict);
  const liveStatus = liveDisplay?.status ?? null;
  const liveStatusLabel = liveDisplay?.label ?? null;

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-2xl bg-neutral-950 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.45)] transition-transform active:scale-[0.99]">
      <Link
        href={href}
        className="relative block aspect-[3/2] w-full overflow-hidden touch-manipulation"
        aria-label={event.title}
      >
        {event.imageUrl ? (
          <div className="absolute inset-0">
            <EventImage
              src={event.imageUrl}
              alt=""
              sizes="(max-width: 640px) 45vw, 220px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600"
            aria-hidden
          />
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3.5">
          {liveStatusLabel && liveStatus && (
            <EventStatusBadge
              label={liveStatusLabel}
              status={liveStatus}
              className="w-fit"
            />
          )}
          <h3 className="line-clamp-2 text-[15px] font-black leading-snug tracking-tight text-white sm:text-base">
            {event.title}
          </h3>
          {event.time && (
            <p className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {event.time}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

const TodayHighlightsComponent = ({
  events,
  locale,
  dict,
  limit = HOME_TODAY_LIMIT,
  excludeEventIds = [],
}: TodayHighlightsProps) => {
  const sessionSeed = useTodayHighlightShuffleSeed();
  const excludeSet = useMemo(() => new Set(excludeEventIds), [excludeEventIds]);
  const todayEvents = useMemo(
    () =>
      getTodayHighlightEvents(events, { sessionSeed }).filter(
        (event) => !excludeSet.has(event.id),
      ),
    [events, sessionSeed, excludeSet],
  );
  const visibleEvents = todayEvents.slice(0, limit);
  const hasMore = todayEvents.length > limit;

  if (visibleEvents.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <h2 className="text-xl font-black tracking-tight text-neutral-950 dark:text-neutral-100">
          {dict.events.happeningToday}
        </h2>
        {hasMore && (
          <Link
            href={`/${locale}/when/today`}
            className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 text-xs font-bold text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950/70 transition-colors touch-manipulation"
          >
            {dict.events.seeAllToday}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 items-stretch gap-2.5 sm:gap-3 lg:grid-cols-3">
        {visibleEvents.map((event) => (
          <TodayHighlightCard
            key={event.id}
            event={event}
            locale={locale}
            dict={dict}
          />
        ))}
      </div>
    </section>
  );
};

export const TodayHighlights = memo(TodayHighlightsComponent);
