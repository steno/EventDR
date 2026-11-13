"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { FilterTimeRange } from "@/lib/filters";
import type { AllBrowseDayGroup } from "@/lib/list-day-groups";
import { formatBrowseDayHeader } from "@/lib/format-date";
import {
  BRAND_GRADIENT_TEXT_CLASS,
  CARD_GRID_CLASS,
  DAY_GROUP_TITLE_CLASS,
  STICKY_CHROME_SURFACE_CLASS,
} from "@/lib/page-shell";
import { EventCard } from "@/components/EventCard";
import type { EventWithVenueSiblings } from "@/lib/venue-recurring-siblings";

/** Day column labels — full weekday caps. */
const BROWSE_DAY_HEADER_CLASS = `text-[0.8125rem] font-bold uppercase leading-tight tracking-[0.06em] ${BRAND_GRADIENT_TEXT_CLASS}`;

/**
 * Flush under StickyListHeader + StickyListFilters (live heights). Overlap 1px
 * so cards can’t show through the hairline between the two sticky surfaces.
 */
const BROWSE_DAY_STICKY_TOP_CLASS =
  "sticky top-[calc(var(--sticky-list-header-height,3.5rem)-4px+var(--sticky-list-filters-height,5.5rem)-1px)] z-[9]";

/** Wider than the Weekly & daily auto-fill tiles (148px min) — ~5–6 large posters. */
const BROWSE_DAY_COL_MIN_PX = 220;
const BROWSE_DAY_COL_MAX_PX = 300;
const DAY_COL_STYLE = {
  flex: `1 0 ${BROWSE_DAY_COL_MIN_PX}px`,
  minWidth: BROWSE_DAY_COL_MIN_PX,
  maxWidth: BROWSE_DAY_COL_MAX_PX,
} as const;

/** Multi-event day autoplay — common carousel cadence. */
const BROWSE_DAY_ROTATE_MS = 4000;

/** z-index stays inside the card’s `isolate` context — never above sticky chrome. */
const DAY_SLIDE_BTN_CLASS =
  "absolute top-1/2 z-[1] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-md ring-1 ring-neutral-200/90 transition-colors hover:bg-white dark:bg-neutral-900/95 dark:text-neutral-100 dark:ring-white/12 dark:hover:bg-neutral-900";

type BrowseEvent = EventWithVenueSiblings;

interface AllBrowseCalendarProps {
  days: AllBrowseDayGroup<BrowseEvent>[];
  recurring: BrowseEvent[];
  dict: Dictionary;
  locale: Locale;
  returnTo?: string;
  returnTitle?: string | null;
  listTimeRange: FilterTimeRange;
  pendingId: string | null;
  onNavigate: (id: string) => void;
  showEnlarge: boolean;
  weeklyHeading: string;
  /** Trailing tiles under Weekly & daily (More, pads, end teaser). */
  weeklyTrailing?: ReactNode;
}

interface BrowseDayColumnProps {
  day: AllBrowseDayGroup<BrowseEvent>;
  dict: Dictionary;
  locale: Locale;
  returnTo?: string;
  returnTitle?: string | null;
  listTimeRange: FilterTimeRange;
  pendingId: string | null;
  onNavigate: (id: string) => void;
  showEnlarge: boolean;
}

/**
 * One fixed-height date cell — single poster. Extra events that day auto-rotate
 * and can also be stepped with chevrons (no stacked column).
 */
function BrowseDayColumn({
  day,
  dict,
  locale,
  returnTo,
  returnTitle,
  listTimeRange,
  pendingId,
  onNavigate,
  showEnlarge,
}: BrowseDayColumnProps) {
  const count = day.events.length;
  const multi = count > 1;
  const [index, setIndex] = useState(() =>
    multi ? Math.floor(Math.random() * count) : 0,
  );
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!multi || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, BROWSE_DAY_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [multi, paused, count]);

  const activeIndex = Math.min(index, Math.max(0, count - 1));
  const event = day.events[activeIndex];

  if (!event) return null;

  return (
    <section
      role="listitem"
      className="flex min-w-0 shrink-0 flex-col"
      style={DAY_COL_STYLE}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <h2 className="sr-only">{formatBrowseDayHeader(day.date, locale)}</h2>
      <div className="relative isolate">
        <div
          key={event.id}
          className="motion-safe:animate-[browse-day-fade_500ms_ease-out]"
        >
          <EventCard
            event={event}
            dict={dict}
            locale={locale}
            returnTo={returnTo}
            returnTitle={returnTitle}
            listTimeRange={listTimeRange}
            view="cards"
            pending={pendingId === event.id}
            dimmed={pendingId != null && pendingId !== event.id}
            onNavigate={() => onNavigate(event.id)}
            showEnlarge={showEnlarge}
          />
        </div>
        {multi ? (
          <>
            <button
              type="button"
              aria-label={dict.events.browseDayPrev}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIndex((i) => (i - 1 + count) % count);
              }}
              className={`${DAY_SLIDE_BTN_CLASS} left-1`}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label={dict.events.browseDayNext}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIndex((i) => (i + 1) % count);
              }}
              className={`${DAY_SLIDE_BTN_CLASS} right-1`}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-2 left-1/2 z-[1] flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/55 px-2 py-1 backdrop-blur-sm"
            >
              {day.events.map((slot, i) => (
                <span
                  key={slot.id}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                    i === activeIndex
                      ? "w-3.5 bg-white"
                      : "w-1.5 bg-white/45"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Desktop All-tab calendar strip: one column per dated day, then Weekly & daily.
 * Parent mounts this only at `xl+` — mobile keeps stacked day headings.
 * Day labels stick under list chrome; header + body rails share horizontal scroll.
 * Each day is a single-card row; multi-event days auto-rotate with chevron nav.
 */
export function AllBrowseCalendar({
  days,
  recurring,
  dict,
  locale,
  returnTo,
  returnTitle,
  listTimeRange,
  pendingId,
  onNavigate,
  showEnlarge,
  weeklyHeading,
  weeklyTrailing,
}: AllBrowseCalendarProps) {
  const headerRailRef = useRef<HTMLDivElement>(null);
  const bodyRailRef = useRef<HTMLDivElement>(null);
  const syncingScroll = useRef(false);

  function syncRails(source: "header" | "body") {
    if (syncingScroll.current) return;
    const from =
      source === "header" ? headerRailRef.current : bodyRailRef.current;
    const to =
      source === "header" ? bodyRailRef.current : headerRailRef.current;
    if (!from || !to) return;
    syncingScroll.current = true;
    to.scrollLeft = from.scrollLeft;
    requestAnimationFrame(() => {
      syncingScroll.current = false;
    });
  }

  return (
    // min-w-0: flex/grid ancestors default to min-content; without it the
    // day rail widens the whole page instead of scrolling inside the shell.
    <div className="min-w-0 max-w-full">
      {/*
        Wrap only the dated strip so sticky day labels release once this
        block ends — they must not stay pinned over Weekly & daily.
      */}
      {days.length > 0 ? (
        <div className="relative min-w-0 max-w-full">
          <div
            className={`${BROWSE_DAY_STICKY_TOP_CLASS} -mx-1 mb-0 min-w-0 max-w-full px-1 pb-2 pt-2 ${STICKY_CHROME_SURFACE_CLASS}`}
            data-sticky-browse-days
          >
            <div
              ref={headerRailRef}
              onScroll={() => syncRails("header")}
              className="min-w-0 w-full max-w-full overflow-x-auto overscroll-x-contain scrollbar-hide"
              aria-hidden
            >
              <div className="flex w-max gap-2.5">
                {days.map((day) => (
                  <div
                    key={`h-${day.date}`}
                    className="min-w-0 shrink-0 border-b-2 border-orange-400/70 pb-1.5 dark:border-orange-400/50"
                    style={DAY_COL_STYLE}
                  >
                    <p className={`font-sans ${BROWSE_DAY_HEADER_CLASS}`}>
                      {formatBrowseDayHeader(day.date, locale)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={bodyRailRef}
            onScroll={() => syncRails("body")}
            className="min-w-0 w-full max-w-full overflow-x-auto overscroll-x-contain pb-0.5 pt-2 scrollbar-hide"
            role="list"
            aria-label={dict.time.all}
          >
            <div className="flex w-max gap-2.5">
              {days.map((day) => (
                <BrowseDayColumn
                  key={day.date}
                  day={day}
                  dict={dict}
                  locale={locale}
                  returnTo={returnTo}
                  returnTitle={returnTitle}
                  listTimeRange={listTimeRange}
                  pendingId={pendingId}
                  onNavigate={onNavigate}
                  showEnlarge={showEnlarge}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {recurring.length > 0 || weeklyTrailing ? (
        <div className={days.length > 0 ? "mt-3" : undefined}>
          {recurring.length > 0 ? (
            <h2 className="pt-2">
              <span
                className={`inline-block font-sans ${DAY_GROUP_TITLE_CLASS}`}
              >
                {weeklyHeading}
              </span>
            </h2>
          ) : null}
          <div className={`mt-2 ${CARD_GRID_CLASS}`}>
            {recurring.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                dict={dict}
                locale={locale}
                returnTo={returnTo}
                returnTitle={returnTitle}
                listTimeRange={listTimeRange}
                view="cards"
                pending={pendingId === event.id}
                dimmed={pendingId != null && pendingId !== event.id}
                onNavigate={() => onNavigate(event.id)}
                showEnlarge={showEnlarge}
              />
            ))}
            {weeklyTrailing}
          </div>
        </div>
      ) : null}
    </div>
  );
}
