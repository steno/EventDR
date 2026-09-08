"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, CircleAlert, Calendar, Clock } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { HomeAlerts } from "@/components/HomeAlerts";
import { HorizontalScrollEdgeFades } from "@/components/HorizontalScrollEdgeFades";
import { IntentLink, warmRoutesIdle } from "@/components/IntentLink";
import {
  SNAP_RAIL_PEEK_CLASS,
  useHorizontalScrollHints,
} from "@/hooks/useHorizontalScrollHints";
import { useLiveStatusDisplay } from "@/hooks/useLiveStatusDisplay";
import type { HomeAlert } from "@/lib/alerts";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { TimeRange } from "@/lib/filters";
import { eventDetailPath, rememberReturnPath } from "@/lib/event-navigation";
import { formatEventDateRange } from "@/lib/format-date";
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
  /** Override the see-all pill label (defaults to “See all today”). */
  seeAllLabel?: string;
  /** Return path when opening a highlight (keeps home area). */
  returnTo?: string;
  returnTitle?: string | null;
  /** When true, `events` is already today’s sorted highlight list. */
  prefiltered?: boolean;
  /** Know-before-you-go notices, opened from a labeled chip next to the title. */
  alerts?: HomeAlert[];
  /** Override the section heading (e.g. cruise “Fits before you sail”). */
  title?: string;
  /** Extra line under each highlight card, keyed by event id. */
  notes?: Record<string, string>;
  /** Hide the “See all today” link (used when the rest of the list is on-page). */
  hideSeeAll?: boolean;
  /** Live-status label context for cards (default today). */
  listTimeRange?: TimeRange;
  /** Show calendar date on cards (useful for Coming up / non-today grids). */
  showDate?: boolean;
}

function TodayHighlightCard({
  event,
  locale,
  dict,
  returnTo,
  returnTitle,
  pending,
  dimmed,
  onNavigate,
  note,
  listTimeRange,
  showDate,
}: {
  event: Event;
  locale: Locale;
  dict: Dictionary;
  returnTo?: string;
  returnTitle?: string | null;
  pending: boolean;
  dimmed: boolean;
  onNavigate: () => void;
  note?: string;
  listTimeRange?: TimeRange;
  showDate?: boolean;
}) {
  const href = eventDetailPath(locale, event.id);
  const liveDisplay = useLiveStatusDisplay(event, dict, {
    listTimeRange: listTimeRange ?? "today",
  });
  const liveStatus = liveDisplay?.status ?? null;
  const liveStatusLabel = liveDisplay?.label ?? null;
  const dateLabel = showDate
    ? formatEventDateRange(event.date, locale, {
        endDate: event.endDate,
        short: true,
      })
    : null;
  const timeLabel = formatEventTimeForList(event.time, {
    recurrence: event.recurrence,
    allDayLabel: dict.events.allDay,
  });
  const metaTitle =
    dateLabel && timeLabel.full && timeLabel.full !== timeLabel.display
      ? `${dateLabel} · ${timeLabel.full}`
      : dateLabel && timeLabel.display
        ? `${dateLabel} · ${timeLabel.display}`
        : timeLabel.full !== timeLabel.display
          ? timeLabel.full
          : undefined;

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
          rememberReturnPath(returnTo ?? `/${locale}`, returnTitle);
        }}
        className="relative block aspect-[16/10] w-full overflow-hidden touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 rounded-2xl sm:aspect-[3/2]"
        aria-label={event.title}
      >
        {event.imageUrl ? (
          <div className="absolute inset-0">
            <EventImage
              src={event.imageUrl}
              alt=""
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
              className="object-cover object-top sm:object-center card-media-zoom"
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
          <h3 className="line-clamp-2 font-sans text-xl font-extrabold leading-snug tracking-[0.01em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] sm:text-2xl">
            {event.title}
          </h3>
          {(dateLabel || timeLabel.display) && (
            <p
              className="inline-flex min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] sm:text-base"
              title={metaTitle}
            >
              {dateLabel ? (
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <Calendar
                    className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                    aria-hidden
                  />
                  <span className="truncate">{dateLabel}</span>
                </span>
              ) : null}
              {timeLabel.display ? (
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <Clock
                    className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                    aria-hidden
                  />
                  <span className="truncate">{timeLabel.display}</span>
                </span>
              ) : null}
            </p>
          )}
          {note ? (
            <p className="text-xs font-semibold text-orange-200 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] sm:text-sm">
              {note}
            </p>
          ) : null}
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
  seeAllLabel,
  returnTo,
  returnTitle,
  prefiltered = false,
  alerts = [],
  title,
  notes,
  hideSeeAll = false,
  listTimeRange = "today",
  showDate = false,
}: TodayHighlightsProps) => {
  const router = useRouter();
  const railRef = useRef<HTMLDivElement>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const excludeSet = useMemo(() => new Set(excludeEventIds), [excludeEventIds]);
  const todayEvents = useMemo(() => {
    const base = prefiltered ? events : getTodayHighlightEvents(events);
    return base.filter((event) => !excludeSet.has(event.id));
  }, [events, excludeSet, prefiltered]);
  const visibleEvents = todayEvents.slice(0, limit);
  const hasMore = todayEvents.length > limit;
  const allTodayHref = seeAllHref ?? `/${locale}/when/today`;
  const sectionLabel = title ?? dict.events.happeningToday;
  const {
    canScrollRight,
    onScroll: onRailScroll,
  } = useHorizontalScrollHints(railRef, visibleEvents.length);

  const highlightHrefs = useMemo(
    () => visibleEvents.map((event) => eventDetailPath(locale, event.id)),
    [visibleEvents, locale],
  );

  // Prebuild detail RSC payloads while the user is still on home — mobile has
  // no hover, so intent-only prefetch is too late for the first tap.
  useEffect(() => {
    return warmRoutesIdle(router, highlightHrefs, HOME_TODAY_LIMIT);
  }, [highlightHrefs, router]);

  if (visibleEvents.length === 0 && alerts.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="text-section font-extrabold text-neutral-950 dark:text-neutral-100">
            {sectionLabel}
          </h2>
          {alerts.length > 0 && (
            <button
              type="button"
              onClick={() => setAlertsOpen(true)}
              className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide ring-1 transition-colors touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                alerts.some((alert) => alert.kind === "closure")
                  ? "bg-rose-50 text-rose-800 ring-rose-200/90 hover:bg-rose-100 dark:bg-rose-500/20 dark:text-rose-100 dark:ring-rose-400/35 dark:hover:bg-rose-500/30"
                  : "bg-amber-50 text-amber-800 ring-amber-200/90 hover:bg-amber-100 dark:bg-amber-500/20 dark:text-amber-100 dark:ring-amber-400/35 dark:hover:bg-amber-500/30"
              }`}
              aria-expanded={alertsOpen}
              aria-haspopup="dialog"
            >
              <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{dict.alerts.title}</span>
            </button>
          )}
        </div>
        {hasMore && !hideSeeAll && (
          <IntentLink
            href={allTodayHref}
            className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 text-sm font-bold text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950/70 transition-colors touch-manipulation"
          >
            {seeAllLabel ?? dict.events.seeAllToday}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </IntentLink>
        )}
      </div>

      {visibleEvents.length > 0 && (
        <div className="relative">
          <div
            ref={railRef}
            onScroll={onRailScroll}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-0.5 scrollbar-hide sm:grid sm:grid-cols-2 sm:items-stretch sm:gap-3 sm:overflow-visible sm:pb-0 sm:snap-none lg:grid-cols-3"
            aria-label={sectionLabel}
          >
            {visibleEvents.map((event) => (
              <div
                key={event.id}
                data-snap-slide
                className={
                  visibleEvents.length === 1
                    ? "w-full shrink-0 snap-start sm:w-auto sm:min-w-0 sm:shrink"
                    : `${SNAP_RAIL_PEEK_CLASS} shrink-0 snap-start sm:w-auto sm:min-w-0 sm:shrink`
                }
              >
                <TodayHighlightCard
                  event={event}
                  locale={locale}
                  dict={dict}
                  returnTo={returnTo}
                  returnTitle={returnTitle}
                  pending={pendingId === event.id}
                  dimmed={pendingId != null && pendingId !== event.id}
                  onNavigate={() => setPendingId(event.id)}
                  note={notes?.[event.id]}
                  listTimeRange={listTimeRange}
                  showDate={showDate}
                />
              </div>
            ))}
          </div>
          <div className="sm:hidden">
            <HorizontalScrollEdgeFades canScrollRight={canScrollRight} />
          </div>
        </div>
      )}

      <HomeAlerts
        open={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        alerts={alerts}
        dict={dict}
        locale={locale}
        returnTo={returnTo}
      />
    </section>
  );
};

export const TodayHighlights = memo(TodayHighlightsComponent);
