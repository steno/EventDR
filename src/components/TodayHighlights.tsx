"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Clock } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { IntentLink, warmRoutesIdle } from "@/components/IntentLink";
import { useLiveStatusDisplay } from "@/hooks/useLiveStatusDisplay";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { eventDetailPath, rememberReturnPath } from "@/lib/event-navigation";
import { formatEventTimeForList } from "@/lib/event-time-display";
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
  /** Override “See all today” destination (e.g. city page when a zone is picked). */
  seeAllHref?: string;
  /** Return path when opening a highlight (keeps home area). */
  returnTo?: string;
  /** When true, `events` is already today’s sorted highlight list. */
  prefiltered?: boolean;
}

function TodayHighlightCard({
  event,
  locale,
  dict,
  returnTo,
  pending,
  dimmed,
  onNavigate,
}: {
  event: Event;
  locale: Locale;
  dict: Dictionary;
  returnTo?: string;
  pending: boolean;
  dimmed: boolean;
  onNavigate: () => void;
}) {
  const href = eventDetailPath(locale, event.id);
  const liveDisplay = useLiveStatusDisplay(event, dict, {
    listTimeRange: "today",
  });
  const liveStatus = liveDisplay?.status ?? null;
  const liveStatusLabel = liveDisplay?.label ?? null;
  const timeLabel = formatEventTimeForList(event.time, {
    recurrence: event.recurrence,
    allDayLabel: dict.events.allDay,
  });

  return (
    <article
      className={`group relative min-w-0 overflow-hidden rounded-2xl bg-neutral-100 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.18)] ring-1 transition-[box-shadow,transform,opacity,ring-color] duration-300 ease-out cursor-pointer dark:bg-neutral-950 dark:shadow-[0_8px_24px_-14px_rgba(0,0,0,0.45)] ${
        pending
          ? "scale-[0.985] ring-2 ring-orange-500/80 shadow-[0_12px_32px_-16px_rgba(251,146,60,0.45)] dark:ring-orange-400/70"
          : dimmed
            ? "opacity-45 ring-black/5 dark:ring-white/10"
            : "ring-black/5 hover:ring-orange-400/50 hover:shadow-[0_12px_32px_-16px_rgba(251,146,60,0.35)] active:scale-[0.99] dark:ring-white/10 dark:hover:ring-orange-600/50"
      }`}
      aria-busy={pending || undefined}
    >
      <IntentLink
        href={href}
        onClick={() => {
          onNavigate();
          rememberReturnPath(returnTo ?? `/${locale}`);
        }}
        className="relative block aspect-[16/10] w-full overflow-hidden touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 rounded-2xl sm:aspect-[3/2]"
        aria-label={event.title}
      >
        {event.imageUrl ? (
          <div className="absolute inset-0">
            <EventImage
              src={event.imageUrl}
              alt=""
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
              className="object-cover card-media-zoom"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600"
            aria-hidden
          />
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

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4 sm:p-5">
          {liveStatusLabel && liveStatus && (
            <EventStatusBadge
              label={liveStatusLabel}
              status={liveStatus}
              className="w-fit"
            />
          )}
          <h3 className="line-clamp-2 font-sans text-lg font-bold leading-snug text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] sm:text-xl">
            {event.title}
          </h3>
          {timeLabel.display && (
            <p
              className="inline-flex min-w-0 max-w-full items-center gap-1.5 text-sm font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] sm:text-base"
              title={
                timeLabel.full !== timeLabel.display ? timeLabel.full : undefined
              }
            >
              <Clock className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
              <span className="truncate">{timeLabel.display}</span>
            </p>
          )}
        </div>
      </IntentLink>
    </article>
  );
}

const TodayHighlightsComponent = ({
  events,
  locale,
  dict,
  limit = HOME_TODAY_LIMIT,
  excludeEventIds = [],
  seeAllHref,
  returnTo,
  prefiltered = false,
}: TodayHighlightsProps) => {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const excludeSet = useMemo(() => new Set(excludeEventIds), [excludeEventIds]);
  const todayEvents = useMemo(() => {
    const base = prefiltered ? events : getTodayHighlightEvents(events);
    return base.filter((event) => !excludeSet.has(event.id));
  }, [events, excludeSet, prefiltered]);
  const visibleEvents = todayEvents.slice(0, limit);
  const hasMore = todayEvents.length > limit;
  const allTodayHref = seeAllHref ?? `/${locale}/when/today`;

  const highlightHrefs = useMemo(
    () => visibleEvents.map((event) => eventDetailPath(locale, event.id)),
    [visibleEvents, locale],
  );

  // Prebuild detail RSC payloads while the user is still on home — mobile has
  // no hover, so intent-only prefetch is too late for the first tap.
  useEffect(() => {
    return warmRoutesIdle(router, highlightHrefs, HOME_TODAY_LIMIT);
  }, [highlightHrefs, router]);

  if (visibleEvents.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <h2 className="text-section font-extrabold text-neutral-950 dark:text-neutral-100">
          {dict.events.happeningToday}
        </h2>
        {hasMore && (
          <IntentLink
            href={allTodayHref}
            className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 text-sm font-bold text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950/70 transition-colors touch-manipulation"
          >
            {dict.events.seeAllToday}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </IntentLink>
        )}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
        {visibleEvents.map((event) => (
          <TodayHighlightCard
            key={event.id}
            event={event}
            locale={locale}
            dict={dict}
            returnTo={returnTo}
            pending={pendingId === event.id}
            dimmed={pendingId != null && pendingId !== event.id}
            onNavigate={() => setPendingId(event.id)}
          />
        ))}
      </div>
    </section>
  );
};

export const TodayHighlights = memo(TodayHighlightsComponent);
