"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  DEFAULT_PRICE_FILTER,
  filterByTimeAndPrice,
  isFilterTimeRange,
  suggestOtherFilterTimeRange,
  type FilterTimeRange,
  type PriceFilter,
  type TimeRange,
} from "@/lib/filters";
import { sortEventsForDisplay } from "@/lib/event-sort";
import { LIST_PAGE_SIZE, SCOPE_LIST_LIMIT } from "@/lib/home-layout";
import { pinSpecialEvents } from "@/lib/special-events";
import { cardGridRowRemainder, fillCardGridPage } from "@/lib/card-grid";
import { scrollToListTop } from "@/lib/list-scroll";
import { clusterRecurringVenueEvents } from "@/lib/venue-recurring-siblings";
import { useCardGridColumns } from "@/hooks/useCardGridColumns";
import { StickyListFilters, ListScrollAnchor } from "@/components/StickyListFilters";
import { TimeFilter } from "@/components/TimeFilter";
import { PriceFilterChips } from "@/components/PriceFilterChips";
import { EventCard } from "@/components/EventCard";
import {
  EventListScrollPads,
  EventCardPlaceholder,
  EventListMoreTile,
  LIST_SCROLL_PAD_TARGET,
} from "@/components/EventCardPlaceholder";
import { SearchEmptyState } from "@/components/SearchEmptyState";
import { AddEventButton } from "@/components/AddEventButton";
import { EventViewToggle } from "@/components/EventViewToggle";
import { useEventListView } from "@/hooks/useEventListView";
import { useListTimeRange } from "@/hooks/useListTimeRange";
import { fillTemplate } from "@/lib/seo";
import { CARD_GRID_CLASS } from "@/lib/page-shell";
import type { EventListView } from "@/lib/event-list-view";

const UNBOUNDED = Number.POSITIVE_INFINITY;

/** Scope/venue lists show the full upcoming schedule; home Our picks matches that. */
const DEFAULT_SCOPE_TIME_RANGE: FilterTimeRange = "all";

interface FilteredEventListProps {
  events: Event[];
  loading: boolean;
  dict: Dictionary;
  locale: Locale;
  emptyMessage: string;
  sectionTitle?: string;
  onAddEvent?: () => void;
  addEventLabel?: string;
  returnTo?: string;
  /** Optional title stored with returnTo for detail→detail back labels. */
  returnTitle?: string | null;
  fixedTimeRange?: TimeRange;
  /** Initial chip when time filters are shown (venue/city default: all). */
  defaultTimeRange?: FilterTimeRange;
  /** Reveal the full list when landing with ?all=1 (stripped from URL on mount). */
  initialExpanded?: boolean;
  /** First-page size before "More events" (defaults to SCOPE_LIST_LIMIT). */
  limit?: number;
  /** Cards added per "More events" tap. */
  pageSize?: number;
  /** Renders above time tabs inside the sticky filter bar (e.g. city picker). */
  locationPicker?: ReactNode;
  /** When set, the short-list CTA subline uses “Add your {category} event”. */
  categoryId?: Event["category"];
  /**
   * Locked layout (hides the cards/list toggle). Venue schedules pass `"list"`.
   * Omit to follow the visitor’s saved preference (cards by default).
   */
  view?: EventListView;
  /**
   * When true (default), changing time tabs scrolls the filter bar under the sticky header.
   * Disable on venue pages — hero/details sit above the list and the jump feels wrong.
   */
  scrollOnFilterChange?: boolean;
  /**
   * How to invite event submissions on short/empty lists.
   * - pad: scroll-pad CTA for category/home lists (default)
   * - inline: one Host card, no spacer, no footer link — for venue pages
   * - button: text link only, no pad card
   */
  addEventCta?: "pad" | "inline" | "button";
  /** Hide All/Today/Tomorrow/Weekend chips (venue Past tab). */
  hideTimeFilter?: boolean;
  /**
   * Collapse recurring programs that share a venue into one card with
   * sibling night chips. Off for venue schedules (already the full grid).
   */
  clusterVenueRecurring?: boolean;
  /**
   * Keep All/Today/Tomorrow/Weekend across city and category swaps
   * (sessionStorage). Off for venue schedules so a listing chip does not
   * hide the weekly grid.
   */
  persistTimeRange?: boolean;
}

export function FilteredEventList({
  events,
  loading,
  dict,
  locale,
  emptyMessage,
  sectionTitle,
  onAddEvent,
  addEventLabel,
  returnTo,
  returnTitle = null,
  fixedTimeRange,
  defaultTimeRange = DEFAULT_SCOPE_TIME_RANGE,
  initialExpanded = false,
  limit = SCOPE_LIST_LIMIT,
  pageSize = LIST_PAGE_SIZE,
  locationPicker,
  categoryId,
  view: lockedView,
  scrollOnFilterChange = true,
  addEventCta = "pad",
  hideTimeFilter = false,
  clusterVenueRecurring = true,
  persistTimeRange = false,
}: FilteredEventListProps) {
  const pathname = usePathname();
  const { view: preferredView, setView } = useEventListView();
  const viewLocked = lockedView != null;
  const view = lockedView ?? preferredView;
  const persistWhenChip = persistTimeRange && !fixedTimeRange;
  const persisted = useListTimeRange();
  const [localTimeRange, setLocalTimeRange] = useState<FilterTimeRange>(
    fixedTimeRange ?? defaultTimeRange,
  );
  const timeRange = persistWhenChip ? persisted.timeRange : localTimeRange;
  const setTimeRange = persistWhenChip
    ? persisted.setTimeRange
    : setLocalTimeRange;
  const [priceFilter, setPriceFilter] = useState<PriceFilter>(
    DEFAULT_PRICE_FILTER,
  );
  const [visibleCount, setVisibleCount] = useState(
    initialExpanded ? UNBOUNDED : limit,
  );
  const skipVisibleReset = useRef(true);
  const ignoreNextVisibleReset = useRef(false);
  /** Last timeRange we scrolled for — skip mount / Strict Mode remount (same value). */
  const scrolledTimeRangeRef = useRef<FilterTimeRange | null>(null);
  const skipScrollForUrlWhen = useRef(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const [gridRef, columns] = useCardGridColumns(view === "cards");

  useEffect(() => {
    const applyListingParams = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      let dirty = false;
      // Apply client-side so listing pages can stay ISR (no server searchParams).
      const when = params.get("when");
      if (when && isFilterTimeRange(when) && !fixedTimeRange) {
        // Don't collapse the page when landing with ?when= + ?all=1 together.
        ignoreNextVisibleReset.current = true;
        skipScrollForUrlWhen.current = true;
        setTimeRange(when);
        params.delete("when");
        dirty = true;
      }
      if (params.get("all") === "1") {
        setVisibleCount(UNBOUNDED);
        params.delete("all");
        dirty = true;
      }
      if (!dirty) return;
      const qs = params.toString();
      window.history.replaceState(null, "", qs ? `${path}?${qs}` : path);
    };

    applyListingParams();
    window.addEventListener("popstate", applyListingParams);
    return () => window.removeEventListener("popstate", applyListingParams);
  }, [pathname, fixedTimeRange]);

  useEffect(() => {
    if (skipVisibleReset.current) {
      skipVisibleReset.current = false;
      return;
    }
    if (ignoreNextVisibleReset.current) {
      ignoreNextVisibleReset.current = false;
      return;
    }
    setVisibleCount(limit);
  }, [timeRange, priceFilter, limit]);

  useLayoutEffect(() => {
    if (!scrollOnFilterChange) return;
    // Only scroll when the user changes tabs — not on mount, city-chip navigations,
    // or React Strict Mode's double invoke (one-shot skip flags fail that case).
    if (scrolledTimeRangeRef.current === null) {
      scrolledTimeRangeRef.current = timeRange;
      return;
    }
    if (scrolledTimeRangeRef.current === timeRange) return;
    scrolledTimeRangeRef.current = timeRange;
    if (skipScrollForUrlWhen.current) {
      skipScrollForUrlWhen.current = false;
      return;
    }
    // Park only when still above list chrome — never scroll up to re-show
    // category pills once sticky time tabs are already in place.
    scrollToListTop(undefined, { onlyScrollDown: true });
  }, [timeRange, scrollOnFilterChange]);

  // SSR/API payloads are already materialized — filter/sort only.
  const activeRange = fixedTimeRange ?? timeRange;
  const filtered = useMemo(() => {
    const combined = filterByTimeAndPrice(events, activeRange, priceFilter);
    const sorted = sortEventsForDisplay(combined, {
      recurringLast: true,
      oneTimeFirst: true,
      discoveryMode: Boolean(categoryId) && activeRange === "all",
      preferPrimaryCategory: categoryId,
    });
    if (activeRange !== "weekend") return sorted;
    return pinSpecialEvents(sorted, { placement: "weekend-list" });
  }, [events, activeRange, priceFilter, categoryId]);

  const displayEvents = useMemo(
    () =>
      clusterVenueRecurring
        ? clusterRecurringVenueEvents(filtered, locale, dict)
        : filtered,
    [filtered, clusterVenueRecurring, locale, dict],
  );

  const showPadCta = addEventCta === "pad";
  const showInlineAddCta = addEventCta === "inline" && Boolean(onAddEvent);
  const padDeficit = Math.max(0, LIST_SCROLL_PAD_TARGET - displayEvents.length);
  const eventCap =
    view === "cards" && Number.isFinite(visibleCount)
      ? fillCardGridPage(visibleCount, displayEvents.length, columns)
      : visibleCount;
  const visibleEvents = Number.isFinite(eventCap)
    ? displayEvents.slice(0, eventCap)
    : displayEvents;
  const hasMore =
    Number.isFinite(eventCap) && displayEvents.length > visibleEvents.length;
  /**
   * Truncated grids fill leftover columns with extra events so More events
   * can sit on a complete row. The add-event teaser only appears once the
   * full list is already on screen.
   */
  const showEndTeaser =
    Boolean(onAddEvent) &&
    addEventCta === "pad" &&
    padDeficit === 0 &&
    !hasMore;
  const leftover = cardGridRowRemainder(
    showEndTeaser ? visibleEvents.length : displayEvents.length,
    columns,
  );
  const fillSpan = view === "cards" ? leftover || "full" : undefined;

  const suggestedRange = suggestOtherFilterTimeRange(activeRange, (range) =>
    filterByTimeAndPrice(events, range, priceFilter).length > 0,
  );
  const suggestedTabLabel = dict.time[suggestedRange];
  const tryTabLabel = dict.search.tryTabHint.replace("{tab}", suggestedTabLabel);
  const tryPriceLabel = dict.price.showAll;

  const showTimeFilter = !fixedTimeRange && !hideTimeFilter;
  const showPriceFilter = !hideTimeFilter;
  const showStickyFilters = Boolean(
    locationPicker || showTimeFilter || showPriceFilter,
  );

  /** Text link only when no card CTA is used (e.g. venue Past). */
  const showFooterAddButton =
    Boolean(onAddEvent) && addEventCta === "button";

  const addEventLabelResolved =
    categoryId
      ? fillTemplate(dict.events.yourEventHere, {
          category: dict.categories[categoryId],
        })
      : dict.events.yourEventHereGeneric;

  const addEventInlineCard = showInlineAddCta ? (
    <div className={`${view === "cards" ? "mt-3" : "mt-3 max-w-sm"}`}>
      <EventCardPlaceholder
        title={dict.events.yourEventHereTitle}
        label={addEventLabelResolved}
        onClick={onAddEvent!}
        view={view}
      />
    </div>
  ) : null;

  const viewToggle = viewLocked ? null : (
    <EventViewToggle value={view} onChange={setView} dict={dict} />
  );
  const showToggleInTitle = Boolean(viewToggle) && !showStickyFilters;

  return (
    <>
      {showStickyFilters ? (
        <>
          <ListScrollAnchor anchorRef={scrollAnchorRef} className="mt-4" />
          <StickyListFilters>
            {locationPicker ? (
              <div className="pb-1.5">{locationPicker}</div>
            ) : null}
            {showTimeFilter ? (
              <TimeFilter
                value={timeRange}
                onChange={setTimeRange}
                dict={dict}
                sticky={false}
                price={priceFilter}
                onPriceChange={setPriceFilter}
                trailing={viewToggle}
              />
            ) : showPriceFilter ? (
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <PriceFilterChips
                    value={priceFilter}
                    onChange={setPriceFilter}
                    dict={dict}
                  />
                </div>
                {viewToggle}
              </div>
            ) : viewToggle ? (
              <div className="flex justify-end">{viewToggle}</div>
            ) : null}
          </StickyListFilters>
        </>
      ) : null}

      {(sectionTitle || showToggleInTitle) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {sectionTitle ? (
            <h2 className="min-w-0 font-sans text-section font-extrabold text-neutral-950 dark:text-neutral-100">
              {sectionTitle}
            </h2>
          ) : (
            <span className="min-w-0 text-copy-meta font-semibold text-neutral-400 dark:text-neutral-500">
              {dict.events.sortedUpcoming}
            </span>
          )}
          {showToggleInTitle ? viewToggle : null}
        </div>
      )}

      {loading ? (
        <p className="text-copy text-neutral-500 dark:text-neutral-400">{dict.events.loading}</p>
      ) : events.length === 0 ? (
        <>
          <p className="text-copy text-neutral-600 dark:text-neutral-400">
            {emptyMessage}
          </p>
          {addEventInlineCard}
        </>
      ) : filtered.length === 0 ? (
        <>
          <SearchEmptyState
            title={dict.search.noResults}
            hint={
              priceFilter !== "all"
                ? tryPriceLabel
                : fixedTimeRange
                  ? dict.search.noResultsHint
                  : tryTabLabel
            }
            gameLabels={dict.search.game}
            actionLabel={
              priceFilter !== "all"
                ? tryPriceLabel
                : fixedTimeRange
                  ? undefined
                  : tryTabLabel
            }
            onAction={
              priceFilter !== "all"
                ? () => setPriceFilter("all")
                : fixedTimeRange
                  ? undefined
                  : () => setTimeRange(suggestedRange)
            }
          />
          {showPadCta ? (
            <div className={view === "cards" ? `mt-3 ${CARD_GRID_CLASS}` : "mt-3"}>
              <EventListScrollPads
                count={0}
                title={dict.events.yourEventHereTitle}
                label={addEventLabelResolved}
                onAddEvent={onAddEvent}
                view={view}
                fillSpan={view === "cards" ? "full" : undefined}
              />
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div
            ref={view === "cards" ? gridRef : undefined}
            className={
              view === "cards"
                ? CARD_GRID_CLASS
                : "space-y-3.5"
            }
          >
            {visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                dict={dict}
                locale={locale}
                returnTo={returnTo}
                returnTitle={returnTitle}
                listTimeRange={fixedTimeRange ?? timeRange}
                view={view}
              />
            ))}
            {showEndTeaser ? (
              <EventCardPlaceholder
                title={dict.events.yourEventHereTitle}
                label={addEventLabelResolved}
                onClick={onAddEvent!}
                view={view}
                fillSpan={fillSpan}
              />
            ) : null}
            {showPadCta ? (
              <EventListScrollPads
                count={displayEvents.length}
                title={dict.events.yourEventHereTitle}
                label={addEventLabelResolved}
                onAddEvent={onAddEvent}
                view={view}
                fillSpan={fillSpan}
              />
            ) : null}
            {hasMore ? (
              <EventListMoreTile
                label={dict.events.moreEvents}
                view={view}
                onClick={() =>
                  setVisibleCount((count) => {
                    if (!Number.isFinite(count)) return count;
                    const shown =
                      view === "cards"
                        ? fillCardGridPage(count, displayEvents.length, columns)
                        : count;
                    return shown + pageSize;
                  })
                }
              />
            ) : null}
          </div>
          {addEventInlineCard}
        </>
      )}

      {showFooterAddButton ? (
        <AddEventButton dict={dict} onClick={onAddEvent!} label={addEventLabel} />
      ) : null}
    </>
  );
}
