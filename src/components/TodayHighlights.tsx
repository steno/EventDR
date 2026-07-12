"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { eventDetailPath } from "@/lib/event-navigation";
import { saveScrollForReturn } from "@/lib/list-scroll-restoration";
import {
  getTodayHighlightEvents,
  HOME_TODAY_LIMIT,
} from "@/lib/home-layout";

interface TodayHighlightsProps {
  events: Event[];
  locale: Locale;
  dict: Dictionary;
  onBeforeNavigate?: () => void;
  limit?: number;
}

function TodayHighlightCard({
  event,
  locale,
  onBeforeNavigate,
}: {
  event: Event;
  locale: Locale;
  onBeforeNavigate?: () => void;
}) {
  const href = eventDetailPath(locale, event.id, `/${locale}`);

  return (
    <article className="group relative flex min-w-[72%] snap-start flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_16px_-8px_rgba(0,0,0,0.35)] transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 sm:min-w-[16rem]">
      <Link
        href={href}
        onClick={() => {
          if (onBeforeNavigate) {
            onBeforeNavigate();
          } else {
            saveScrollForReturn(`/${locale}`);
          }
        }}
        className="flex min-h-0 flex-1 flex-col touch-manipulation active:scale-[0.995] transition-transform"
        aria-label={event.title}
      >
        {event.imageUrl ? (
          <div className="relative h-32 w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <EventImage
              src={event.imageUrl}
              alt=""
              sizes="(max-width: 672px) 72vw, 256px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-orange-600/55 via-rose-500/35 to-transparent transition-opacity duration-300 group-hover:opacity-0"
              aria-hidden
            />
          </div>
        ) : (
          <div className="h-32 w-full shrink-0 bg-neutral-100 dark:bg-neutral-800" aria-hidden />
        )}

        <div className="flex flex-col gap-2 p-3.5">
          <h3 className="line-clamp-2 text-[17px] font-black leading-[1.25] tracking-tight text-neutral-950 dark:text-neutral-100">
            {event.title}
          </h3>
          {event.time && (
            <p className="inline-flex items-center gap-1.5 text-copy-meta font-medium text-neutral-600 dark:text-neutral-400">
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
  onBeforeNavigate,
  limit = HOME_TODAY_LIMIT,
}: TodayHighlightsProps) => {
  const todayEvents = useMemo(() => getTodayHighlightEvents(events), [events]);
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
            onClick={onBeforeNavigate}
            className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 text-xs font-bold text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950/70 transition-colors touch-manipulation"
          >
            {dict.events.seeAllToday}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        )}
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {visibleEvents.map((event) => (
          <TodayHighlightCard
            key={event.id}
            event={event}
            locale={locale}
            onBeforeNavigate={onBeforeNavigate}
          />
        ))}
      </div>
    </section>
  );
};

export const TodayHighlights = memo(TodayHighlightsComponent);
