"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, CircleAlert, Calendar, Clock } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { EventCardPlaceholder } from "@/components/EventCardPlaceholder";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { FeatureSpecialModal } from "@/components/FeatureSpecialModal";
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
import { getEventCardObjectPosition } from "@/lib/event-images";
import { SECTION_TITLE_CLASS } from "@/lib/page-shell";

function chunkPairs<T>(items: T[]): T[][] {
  const slides: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    slides.push(items.slice(i, i + 2));
  }
  return slides;
}

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
  /** Show calendar date on cards (Coming up + Recently added). */
  showDate?: boolean;
  /**
   * When exactly one highlight is shown, fill remaining columns with a paid
   * “feature your event” promo (mailto for pricing) — used on Today's specials.
   */
  featurePromo?: boolean;
  /**
   * Mobile snap rail: two cards side-by-side per slide. Desktop keeps the
   * usual multi-column grid (`sm:contents` unwraps each pair).
   */
  mobilePairSlides?: boolean;
  /**
   * Mobile story rail (36:49 — ~1/4 shorter than 9:16) — used for Today's
   * specials so every area home gets the same tall flyer cards (not landscape
   * 16:10 when count ≠ 2).
   */
  storyCards?: boolean;
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
  layout = "grid",
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
  /** Pair = 2-up row; story = 36:49 specials; grid = 3-up tile. */
  layout?: "pair" | "story" | "grid";
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
  const imageSizes =
    layout === "pair"
      ? "(max-width: 640px) 44vw, 50vw"
      : layout === "story"
        ? "(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 33vw"
        : "(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 33vw";
  const titleClass =
    layout === "pair"
      ? "line-clamp-2 font-sans text-base font-extrabold leading-snug tracking-[0.01em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] sm:text-2xl"
      : "line-clamp-2 font-sans text-xl font-extrabold leading-snug tracking-[0.01em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] sm:text-2xl";
  const metaClass =
    layout === "pair"
      ? "inline-flex min-w-0 max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] sm:gap-x-2 sm:gap-y-1 sm:text-base"
      : "inline-flex min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] sm:text-base";
  const overlayPad =
    layout === "pair"
      ? "gap-1 p-2.5 sm:gap-1.5 sm:p-5"
      : layout === "story"
        ? "gap-1.5 p-3.5 sm:p-5"
        : "gap-1.5 p-4 sm:p-5";
  const mediaAspectClass =
    layout === "pair"
      ? "aspect-[4/5] sm:aspect-[3/2]"
      : layout === "story"
        ? "aspect-[36/49] sm:aspect-[3/2]"
        : "aspect-[16/10] sm:aspect-[3/2]";

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
        className={`relative block w-full overflow-hidden touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 rounded-2xl ${mediaAspectClass}`}
        aria-label={event.title}
      >
        {event.imageUrl ? (
          <div className="absolute inset-0">
            <EventImage
              src={event.imageUrl}
              alt=""
              sizes={imageSizes}
              priority={false}
              className={`object-cover card-media-zoom ${getEventCardObjectPosition(event.id)}`}
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

        <div className={`absolute inset-x-0 bottom-0 flex flex-col ${overlayPad}`}>
          {liveStatusLabel && liveStatus && (
            <EventStatusBadge
              label={liveStatusLabel}
              status={liveStatus}
              className="w-fit"
            />
          )}
          <h3 className={titleClass}>
            {event.title}
          </h3>
          {(dateLabel || timeLabel.display) && (
            <p
              className={metaClass}
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
  featurePromo = false,
  mobilePairSlides = false,
  storyCards = false,
}: TodayHighlightsProps) => {
  const router = useRouter();
  const railRef = useRef<HTMLDivElement>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [featureOpen, setFeatureOpen] = useState(false);
  const excludeSet = useMemo(() => new Set(excludeEventIds), [excludeEventIds]);
  const todayEvents = useMemo(() => {
    const base = prefiltered ? events : getTodayHighlightEvents(events);
    return base.filter((event) => !excludeSet.has(event.id));
  }, [events, excludeSet, prefiltered]);
  const visibleEvents = todayEvents.slice(0, limit);
  const count = visibleEvents.length;
  const showFeaturePromo = count === 1 && featurePromo;
  const usePairSlides =
    !storyCards && mobilePairSlides && !showFeaturePromo && count >= 2;
  const pairSlides = useMemo(
    () => (usePairSlides ? chunkPairs(visibleEvents) : null),
    [usePairSlides, visibleEvents],
  );
  const hasMore = todayEvents.length > limit;
  const allTodayHref = seeAllHref ?? `/${locale}/when/today`;
  const sectionLabel = title ?? dict.events.happeningToday;
  // Lone special + promo: 2-up on sm, 1 + span-2 on lg so the ad fills the row.
  // Story specials with ≤3 cards: exact columns so we never leave an empty cell.
  const gridColsClass = showFeaturePromo
    ? "sm:grid-cols-2 lg:grid-cols-3"
    : storyCards && count === 1
      ? "sm:grid-cols-1"
      : storyCards && count === 2
        ? "sm:grid-cols-2"
        : storyCards && count === 3
          ? "sm:grid-cols-3"
          : count <= 1
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : count === 2
              ? "sm:grid-cols-2"
              : "sm:grid-cols-2 lg:grid-cols-3";
  const cardLayout: "pair" | "story" | "grid" = storyCards
    ? "story"
    : usePairSlides || (!showFeaturePromo && count === 2)
      ? "pair"
      : "grid";
  /**
   * Story specials with 4+: keep a single row (max 3 visible) and scroll —
   * wrapping leaves an empty second row on desktop.
   */
  const desktopScrollRail = storyCards && !showFeaturePromo && count > 3;
  /** Story specials: ~72% width so 36:49 stays readable with a next-card peek. */
  const peekClass = storyCards
    ? desktopScrollRail
      ? "w-[72%] sm:w-[calc((100%-0.75rem)/2)] lg:w-[calc((100%-1.5rem)/3)]"
      : "w-[72%]"
    : SNAP_RAIL_PEEK_CLASS;
  const railItemCount = showFeaturePromo
    ? 2
    : pairSlides
      ? pairSlides.length
      : count;
  const {
    activeIndex,
    canScrollLeft,
    canScrollRight,
    onScroll: onRailScroll,
    scrollToIndex,
  } = useHorizontalScrollHints(railRef, railItemCount);

  const highlightHrefs = useMemo(
    () => visibleEvents.map((event) => eventDetailPath(locale, event.id)),
    [visibleEvents, locale],
  );

  // Prebuild detail RSC payloads while the user is still on home — mobile has
  // no hover, so intent-only prefetch is too late for the first tap.
  useEffect(() => {
    return warmRoutesIdle(router, highlightHrefs, HOME_TODAY_LIMIT);
  }, [highlightHrefs, router]);

  if (count === 0 && alerts.length === 0) return null;

  const showScrollArrows =
    desktopScrollRail && (canScrollLeft || canScrollRight);

  return (
    <section className="mb-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className={SECTION_TITLE_CLASS}>
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
        <div className="flex shrink-0 items-center gap-2">
          {showScrollArrows ? (
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
                disabled={!canScrollLeft}
                aria-label={dict.events.scrollSpecialsPrev}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 ring-1 ring-black/5 transition-colors touch-manipulation hover:bg-orange-50 hover:text-orange-600 disabled:pointer-events-none disabled:opacity-35 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-white/10 dark:hover:bg-orange-950/50 dark:hover:text-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() =>
                  scrollToIndex(Math.min(activeIndex + 1, railItemCount - 1))
                }
                disabled={!canScrollRight}
                aria-label={dict.events.scrollSpecialsNext}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 ring-1 ring-black/5 transition-colors touch-manipulation hover:bg-orange-50 hover:text-orange-600 disabled:pointer-events-none disabled:opacity-35 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-white/10 dark:hover:bg-orange-950/50 dark:hover:text-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : null}
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
      </div>

      {count > 0 && (
        <div className="relative">
          <div
            ref={railRef}
            onScroll={onRailScroll}
            className={
              desktopScrollRail
                ? "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-0.5 scrollbar-hide"
                : `flex snap-x snap-mandatory gap-3 overflow-x-auto pb-0.5 scrollbar-hide sm:grid sm:items-stretch sm:gap-3 sm:overflow-visible sm:pb-0 sm:snap-none ${gridColsClass}`
            }
            aria-label={sectionLabel}
          >
            {pairSlides
              ? pairSlides.map((pair) => (
                  <div
                    key={pair.map((event) => event.id).join(":")}
                    data-snap-slide
                    className={`${peekClass} grid shrink-0 snap-start grid-cols-2 gap-2 sm:contents`}
                  >
                    {pair.map((event) => (
                      <div
                        key={event.id}
                        className={
                          pair.length === 1
                            ? "min-w-0 col-span-2 sm:col-span-1 sm:w-auto sm:min-w-0 sm:shrink"
                            : "min-w-0 sm:w-auto sm:min-w-0 sm:shrink"
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
                          layout={cardLayout}
                        />
                      </div>
                    ))}
                  </div>
                ))
              : visibleEvents.map((event) => (
                  <div
                    key={event.id}
                    data-snap-slide
                    className={
                      count === 1 && !showFeaturePromo && !storyCards
                        ? "w-full shrink-0 snap-start sm:w-auto sm:min-w-0 sm:shrink"
                        : desktopScrollRail
                          ? `${peekClass} shrink-0 snap-start`
                          : `${peekClass} shrink-0 snap-start sm:w-auto sm:min-w-0 sm:shrink`
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
                      layout={cardLayout}
                    />
                  </div>
                ))}
            {showFeaturePromo ? (
              <div
                data-snap-slide
                className={`${peekClass} shrink-0 snap-start sm:col-span-1 sm:w-auto sm:min-w-0 sm:shrink lg:col-span-2`}
              >
                <EventCardPlaceholder
                  title={dict.events.featureSpecialTitle}
                  label={dict.events.featureSpecialLabel}
                  onClick={() => setFeatureOpen(true)}
                  stretch
                />
              </div>
            ) : null}
          </div>
          <div className={desktopScrollRail ? undefined : "sm:hidden"}>
            <HorizontalScrollEdgeFades canScrollRight={canScrollRight} />
          </div>
        </div>
      )}

      <FeatureSpecialModal
        open={featureOpen}
        onClose={() => setFeatureOpen(false)}
        dict={dict}
      />

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
