"use client";

import { useState, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { FilterTimeRange } from "@/lib/filters";
import type { AllBrowseDayGroup } from "@/lib/list-day-groups";
import {
  browseDayFoldPlan,
  BROWSE_DAY_FOLD_CAP,
} from "@/lib/list-day-groups";
import {
  browseDayTearOffParts,
  formatBrowseDayHeader,
} from "@/lib/format-date";
import { fillTemplate } from "@/lib/seo";
import {
  BRAND_GRADIENT_TEXT_CLASS,
  CARD_GRID_CLASS,
  DAY_GROUP_TITLE_CLASS,
} from "@/lib/page-shell";
import { EventCard } from "@/components/EventCard";
import type { EventWithVenueSiblings } from "@/lib/venue-recurring-siblings";

/**
 * Desktop All-tab dated strip — wrap instead of a horizontal scroller.
 * ~220px tiles; wider column gap than the inner fold so days read as clusters.
 */
const BROWSE_DAY_GRID_CLASS =
  "grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] items-start gap-x-7 gap-y-6";

/** Fixed fold viewport — same 2:3 poster ratio as a single EventCard. */
const BROWSE_DAY_FOLD_FRAME_CLASS =
  "relative isolate aspect-[2/3] w-full overflow-hidden rounded-xl";

/** Tight gutters inside a day so space can go between day columns instead. */
const BROWSE_DAY_FOLD_GAP_CLASS = "gap-1";

/** Muted day tray — warm cream on light (matches page `#f6f3ee`), not cool grey. */
const BROWSE_DAY_TRAY_CLASS =
  "flex min-w-0 flex-col rounded-2xl bg-[#ebe6dc]/90 p-2 ring-1 ring-stone-400/25 dark:bg-neutral-800/70 dark:ring-white/12";

/**
 * Full-width date title bar — weekday chip first, tear-off on the right.
 * Quieter than white slabs: tray-tinted chips + shorter strip.
 */
const BROWSE_DAY_TITLE_BAR_CLASS =
  "-mx-2 -mt-2 mb-1.5 flex items-center gap-1 rounded-t-2xl border-b border-stone-400/15 bg-[#e8e2d6]/80 px-1.5 py-1 dark:border-white/[0.06] dark:bg-neutral-950/50";

/** Weekday chip shell — soft fill (gradient sits on the inner span). */
const BROWSE_DAY_WEEKDAY_CHIP_CLASS =
  "flex h-9 min-w-0 flex-1 items-center justify-center rounded-lg bg-white/55 px-2 ring-1 ring-stone-400/20 dark:bg-white/10 dark:ring-white/10";
const BROWSE_DAY_WEEKDAY_LABEL_CLASS = `truncate text-[0.8125rem] font-semibold uppercase leading-none tracking-[0.05em] ${BRAND_GRADIENT_TEXT_CLASS}`;

/**
 * Tear-off calendar — compact, soft border; slightly tighter than card xl so short chips don’t read as pills.
 */
const BROWSE_DAY_TEAROFF_CLASS =
  "flex h-9 w-9 shrink-0 flex-col overflow-hidden rounded-lg border border-stone-400/35 bg-white/70 font-sans dark:border-white/15 dark:bg-white/10";
const BROWSE_DAY_TEAROFF_MONTH_CLASS =
  "bg-stone-500/80 px-0.5 py-px text-center text-[0.5625rem] font-semibold leading-none tracking-wide text-white dark:bg-white/20";
const BROWSE_DAY_TEAROFF_DAY_CLASS =
  "flex flex-1 items-center justify-center text-[1.05rem] font-semibold leading-none tabular-nums text-neutral-800 dark:text-neutral-100";

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

function foldGridClass(visibleCount: number, hasMoreTile: boolean): string {
  const cells = visibleCount + (hasMoreTile ? 1 : 0);
  if (cells <= 1) return "h-full min-h-0";
  if (cells === 2)
    return `grid h-full min-h-0 grid-cols-2 grid-rows-1 ${BROWSE_DAY_FOLD_GAP_CLASS}`;
  return `grid h-full min-h-0 grid-cols-2 grid-rows-2 ${BROWSE_DAY_FOLD_GAP_CLASS}`;
}

/**
 * One date cell — fixed poster footprint; multiple same-day events fold
 * inside (2-up / 2×2). Beyond the fold cap, a “+N more” tile expands in place.
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
  const [expanded, setExpanded] = useState(false);
  const plan = browseDayFoldPlan(count, BROWSE_DAY_FOLD_CAP);
  const showAll = expanded || plan.more === 0;
  const visible = showAll ? day.events : day.events.slice(0, plan.show);
  const more = showAll ? 0 : plan.more;
  const growing = expanded && count > BROWSE_DAY_FOLD_CAP;

  if (count === 0) return null;

  const moreLabel = fillTemplate(dict.events.moreThatDay, {
    count: String(more),
  });
  const tearOff = browseDayTearOffParts(day.date, locale);
  const dayLabel = formatBrowseDayHeader(day.date, locale);

  return (
    <section role="listitem" className={BROWSE_DAY_TRAY_CLASS}>
      <header className={BROWSE_DAY_TITLE_BAR_CLASS}>
        <h2 className={BROWSE_DAY_WEEKDAY_CHIP_CLASS} aria-label={dayLabel}>
          <span className={BROWSE_DAY_WEEKDAY_LABEL_CLASS} aria-hidden>
            {tearOff?.weekday ?? dayLabel}
          </span>
        </h2>
        <div className={BROWSE_DAY_TEAROFF_CLASS} aria-hidden>
          {tearOff ? (
            <>
              <span className={BROWSE_DAY_TEAROFF_MONTH_CLASS}>
                {tearOff.month}
              </span>
              <span className={BROWSE_DAY_TEAROFF_DAY_CLASS}>{tearOff.day}</span>
            </>
          ) : null}
        </div>
      </header>
      <div
        className={
          growing
            ? "relative isolate w-full overflow-hidden rounded-xl"
            : BROWSE_DAY_FOLD_FRAME_CLASS
        }
      >
        <div
          className={
            growing
              ? `grid grid-cols-2 ${BROWSE_DAY_FOLD_GAP_CLASS}`
              : foldGridClass(visible.length, more > 0)
          }
        >
          {visible.map((event) => (
            <div key={event.id} className="min-h-0 min-w-0">
              <EventCard
                event={event}
                dict={dict}
                locale={locale}
                returnTo={returnTo}
                returnTitle={returnTitle}
                listTimeRange={listTimeRange}
                omitRelativeDayLabels
                view="cards"
                pending={pendingId === event.id}
                dimmed={pendingId != null && pendingId !== event.id}
                onNavigate={() => onNavigate(event.id)}
                showEnlarge={showEnlarge}
              />
            </div>
          ))}
          {more > 0 ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex min-h-0 min-w-0 flex-col items-center justify-center rounded-xl bg-white/70 text-center ring-1 ring-black/5 transition-colors touch-manipulation hover:bg-white hover:ring-orange-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 dark:bg-neutral-950/70 dark:ring-white/10 dark:hover:bg-neutral-950 dark:hover:ring-orange-500/40"
              aria-label={fillTemplate(dict.events.moreThatDayAria, {
                count: String(more),
              })}
            >
              <span
                className={`font-sans text-lg font-extrabold tabular-nums ${BRAND_GRADIENT_TEXT_CLASS}`}
              >
                {moreLabel}
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * Desktop All-tab calendar: one fixed fold-cell per dated day (wraps), then
 * Weekly & daily. Parent mounts this only at `xl+` — mobile keeps stacked days.
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
  return (
    <div className="min-w-0 max-w-full">
      {days.length > 0 ? (
        <div
          className={BROWSE_DAY_GRID_CLASS}
          role="list"
          aria-label={dict.time.all}
        >
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
