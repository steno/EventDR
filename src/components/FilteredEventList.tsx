"use client";

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { matchesXlMedia, subscribeXlMedia } from "@/lib/breakpoints";
import {
  DEFAULT_PRICE_FILTER,
  filterByTimeAndPrice,
  isFilterTimeRange,
  listOtherMatchingFilterTimeRanges,
  type FilterTimeRange,
  type PriceFilter,
  type TimeRange,
} from "@/lib/filters";
import { sortEventsForDisplay } from "@/lib/event-sort";
import { LIST_PAGE_SIZE, SCOPE_LIST_LIMIT } from "@/lib/home-layout";
import { pinSpecialEvents } from "@/lib/special-events";
import {
  cardGridDayGroupPadSpans,
  cardGridDayGroupSpans,
  cardGridRowRemainder,
  fillCardGridPage,
} from "@/lib/card-grid";
import {
  scrollBehaviorPreference,
  scrollToListTop,
  scrollCategoryNavIntoView,
} from "@/lib/list-scroll";
import { syncScrollChromeDom } from "@/lib/scroll-chrome";
import { clusterRecurringVenueEvents } from "@/lib/venue-recurring-siblings";
import {
  defaultOpenWeekendDay,
  eventsInAllBrowseOrder,
  eventsInWeekendOrder,
  splitAllBrowseSections,
  splitWeekendDayGroups,
} from "@/lib/list-day-groups";
import { formatEventDate } from "@/lib/format-date";
import { useCardGridColumns } from "@/hooks/useCardGridColumns";
import { StickyListFilters, ListScrollAnchor } from "@/components/StickyListFilters";
import { TimeFilter } from "@/components/TimeFilter";
import { EventCard } from "@/components/EventCard";
import { AllBrowseCalendar } from "@/components/AllBrowseCalendar";
import {
  EventListScrollPads,
  EventCardPlaceholder,
  EventListMoreTile,
  LIST_SCROLL_PAD_TARGET,
} from "@/components/EventCardPlaceholder";
import {
  SearchEmptyState,
  nothingHereTitle,
} from "@/components/SearchEmptyState";
import { AddEventButton } from "@/components/AddEventButton";
import { EventViewToggle } from "@/components/EventViewToggle";
import { useEventListView } from "@/hooks/useEventListView";
import { useListTimeRange } from "@/hooks/useListTimeRange";
import { syncListTimeRangeForCategory } from "@/lib/list-time-range";
import { fillTemplate } from "@/lib/seo";
import {
  CARD_GRID_CLASS,
  DAY_GROUP_TITLE_CLASS,
  LIST_PARK_FILL_CLASS,
  PAGE_GUTTER_BLEED_CLASS,
  SECTION_TITLE_CLASS,
  STICKY_CHROME_SURFACE_CLASS,
} from "@/lib/page-shell";
import type { EventListView } from "@/lib/event-list-view";
import { ArrowLeft, ChevronDown } from "lucide-react";

const UNBOUNDED = Number.POSITIVE_INFINITY;

/** Cap sticky back-label width so All/Today/Weekend still fit on a phone. */
const CATEGORY_BACK_MAX_CLASS = "max-w-[4.75rem] sm:max-w-[6.5rem]";

/**
 * Stacked All / Weekend day labels park under sticky list chrome + filters.
 * Each section is its own sticky containing block — next day pushes the prior off.
 */
/**
 * Park flush under filters (−2px overlap). Also set `data-sticky-list-day` on
 * the node so hide-on-scroll / park-scroll lifts it with the filter bar when
 * the Discover header slides away (otherwise a header-sized gap appears).
 */
const LIST_DAY_STICKY_CLASS = `sticky top-[calc(var(--sticky-list-header-height,3.5rem)-4px+var(--sticky-list-filters-height,5.5rem)-2px)] z-[8] ${PAGE_GUTTER_BLEED_CLASS} ${STICKY_CHROME_SURFACE_CLASS} pt-1.5 pb-1`;

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
  /** When set, the short-list CTA subline uses “Add your {category} event”. */
  categoryId?: Event["category"];
  /** Area name for empty-state copy (“No X in Cabarete today?”). */
  areaLabel?: string | null;
  /**
   * Locked layout (hides the cards/list toggle). Venue schedules pass `"list"`.
   * Omit to follow the visitor’s saved preference (cards by default).
   */
  view?: EventListView;
  /**
   * When true (default), changing time tabs, Free/Tickets, city, or category
   * scrolls so list items start under the sticky header + filter bar.
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
  /** Hide Free entry / Tickets chips (venue schedules — not useful on a single place). */
  hidePriceFilter?: boolean;
  /**
   * Collapse recurring programs that share a venue into one card with
   * sibling night chips. Off for venue schedules (already the full grid).
   */
  clusterVenueRecurring?: boolean;
  /**
   * Keep All/Today/Tomorrow/Weekend across city swaps (sessionStorage).
   * Selecting a different category resets to All. Off for venue schedules so
   * a listing chip does not hide the weekly grid.
   */
  persistTimeRange?: boolean;
  /**
   * Optional lead control above the time tabs inside the sticky filter bar
   * (e.g. mobile area select on category pages).
   */
  stickyLead?: ReactNode;
  /**
   * Desktop area select — sits left of the category pill rail (home-matching
   * hero style). Mobile uses `stickyLead` instead.
   */
  locationPicker?: ReactNode;
  /**
   * Category pill rail inside the sticky filter bar (above time tabs).
   * When set, the ← category back cue is omitted — pills stay pinned.
   */
  categoryNav?: ReactNode;
  /**
   * Full-width block after the sticky tabs/chips and before the event grid.
   */
  listLead?: ReactNode;
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
  categoryId,
  areaLabel = null,
  view: lockedView,
  scrollOnFilterChange = true,
  addEventCta = "pad",
  hideTimeFilter = false,
  hidePriceFilter = false,
  clusterVenueRecurring = true,
  persistTimeRange = false,
  stickyLead,
  locationPicker,
  categoryNav,
  listLead,
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
  /** Last filters we scrolled for — skip mount / Strict Mode remount (same values). */
  const scrolledFiltersRef = useRef<{
    time: FilterTimeRange;
    price: PriceFilter;
    area: string | null;
    category: string | null;
  } | null>(null);
  /** List ↔ cards toggle — skip mount / Strict Mode remount. */
  const scrolledViewRef = useRef<EventListView | null>(null);
  const skipScrollForUrlWhen = useRef(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const [gridRef, columns] = useCardGridColumns(view === "cards");
  // All desktop calendar — SSR/phone assume stacked; xl mounts the day strip only.
  const isXlShell = useSyncExternalStore(
    subscribeXlMedia,
    matchesXlMedia,
    () => false,
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  /** Weekend day sections that are expanded (ISO dates). */
  const [openWeekendDays, setOpenWeekendDays] = useState(
    () => new Set<string>([defaultOpenWeekendDay()]),
  );
  const weekendRangeRef = useRef(false);
  const stickyCategoryLabel = categoryId ? dict.categories[categoryId] : null;
  // ← back cue only when category pills are NOT in the sticky bar (they scroll
  // away). Sticky `categoryNav` keeps pills pinned, so the cue is redundant.
  const categoryBackAriaLabel =
    !categoryNav && stickyCategoryLabel
      ? fillTemplate(dict.browse.backTo, { title: stickyCategoryLabel })
      : null;
  const categoryBackCue =
    !categoryNav && stickyCategoryLabel ? (
      <div className={`min-w-0 shrink ${CATEGORY_BACK_MAX_CLASS}`}>
        <button
          type="button"
          className="inline-flex h-8 max-w-full items-center gap-0.5 rounded-lg px-1 text-sm font-semibold tracking-tight text-neutral-500 transition-colors touch-manipulation hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          aria-label={categoryBackAriaLabel ?? stickyCategoryLabel}
          title={categoryBackAriaLabel ?? stickyCategoryLabel}
          onClick={() => {
            const nav = document.querySelector<HTMLElement>(
              "[data-category-nav]",
            );
            scrollCategoryNavIntoView(nav);
          }}
        >
          <ArrowLeft
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden
          />
          <span className="min-w-0 truncate">
            {stickyCategoryLabel}
          </span>
        </button>
      </div>
    ) : null;
  const areaKey = areaLabel ?? null;

  // Keep All/Today/Weekend across city and category swaps (session chip).
  useLayoutEffect(() => {
    if (!persistWhenChip) return;
    syncListTimeRangeForCategory(categoryId ?? "");
  }, [persistWhenChip, categoryId]);

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
  }, [timeRange, priceFilter, areaKey, categoryId, limit]);

  useEffect(() => {
    setPendingId(null);
  }, [areaKey, categoryId, returnTo]);

  useLayoutEffect(() => {
    if (!scrollOnFilterChange) return;
    // Scroll when the user changes time/price/city/category — not on mount
    // or React Strict Mode's double invoke.
    const categoryKey = categoryId ?? null;
    if (scrolledFiltersRef.current === null) {
      scrolledFiltersRef.current = {
        time: timeRange,
        price: priceFilter,
        area: areaKey,
        category: categoryKey,
      };
      return;
    }
    const prev = scrolledFiltersRef.current;
    if (
      prev.time === timeRange &&
      prev.price === priceFilter &&
      prev.area === areaKey &&
      prev.category === categoryKey
    ) {
      return;
    }
    const timeChanged = prev.time !== timeRange;
    const priceChanged = prev.price !== priceFilter;
    const areaChanged = prev.area !== areaKey;
    const categoryChanged = prev.category !== categoryKey;
    scrolledFiltersRef.current = {
      time: timeRange,
      price: priceFilter,
      area: areaKey,
      category: categoryKey,
    };
    // URL ?when= applies the time chip without a scroll jump.
    if (timeChanged && skipScrollForUrlWhen.current) {
      skipScrollForUrlWhen.current = false;
      // Still park when city/category also changed in the same tick.
      if (!areaChanged && !categoryChanged && !priceChanged) return;
    }
    if (!timeChanged && !priceChanged && !areaChanged && !categoryChanged) {
      return;
    }
    // Area / category soft-nav can swap hero ↔ list chrome — match home and
    // reset to the top of the page. Time/price only park under sticky filters.
    if (areaChanged || categoryChanged) {
      window.scrollTo({ top: 0, behavior: scrollBehaviorPreference() });
      return;
    }
    scrollToListTop(scrollAnchorRef.current);
  }, [timeRange, priceFilter, areaKey, categoryId, scrollOnFilterChange]);

  useLayoutEffect(() => {
    if (viewLocked || !scrollOnFilterChange) return;
    if (scrolledViewRef.current === null) {
      scrolledViewRef.current = view;
      return;
    }
    if (scrolledViewRef.current === view) return;
    scrolledViewRef.current = view;
    // List ↔ cards reflows the grid — park content under sticky filters.
    scrollToListTop(scrollAnchorRef.current);
  }, [view, viewLocked, scrollOnFilterChange]);

  // SSR/API payloads are already materialized — filter/sort only.
  const activeRange = fixedTimeRange ?? timeRange;

  // Reset open day when entering Weekend (Today ↔ Weekend chip, or remount).
  useEffect(() => {
    const onWeekend = activeRange === "weekend";
    if (onWeekend && !weekendRangeRef.current) {
      setOpenWeekendDays(new Set([defaultOpenWeekendDay()]));
    }
    weekendRangeRef.current = onWeekend;
  }, [activeRange]);

  const filtered = useMemo(() => {
    const combined = filterByTimeAndPrice(events, activeRange, priceFilter);
    const sorted = sortEventsForDisplay(combined, {
      recurringLast: true,
      oneTimeFirst: true,
      pinTodayOneOffs: true,
      discoveryMode: Boolean(categoryId) && activeRange === "all",
      preferPrimaryCategory: categoryId,
    });
    if (activeRange !== "weekend") return sorted;
    return pinSpecialEvents(sorted, { placement: "weekend-list" });
  }, [events, activeRange, priceFilter, categoryId]);

  const displayEvents = useMemo(() => {
    const clustered = clusterVenueRecurring
      ? clusterRecurringVenueEvents(filtered, locale, dict)
      : filtered;
    if (activeRange === "weekend") return eventsInWeekendOrder(clustered);
    if (activeRange === "all") return eventsInAllBrowseOrder(clustered);
    return clustered;
  }, [filtered, clusterVenueRecurring, locale, dict, activeRange]);

  /** All + cards: dated day columns (desktop) + weekly/daily tail. */
  const allBrowseSections = useMemo(
    () =>
      activeRange === "all" && view === "cards"
        ? splitAllBrowseSections(displayEvents)
        : null,
    [activeRange, view, displayEvents],
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
  const weekendDayGroups = useMemo(
    () =>
      activeRange === "weekend"
        ? splitWeekendDayGroups(visibleEvents)
        : null,
    [activeRange, visibleEvents],
  );
  const hasMore =
    Number.isFinite(eventCap) && displayEvents.length > visibleEvents.length;

  // Desktop All calendar: dated columns stay complete; More pages weekly only.
  const calendarRecurringCap = Number.isFinite(visibleCount)
    ? visibleCount
    : UNBOUNDED;
  const calendarRecurring = allBrowseSections
    ? Number.isFinite(calendarRecurringCap)
      ? allBrowseSections.recurring.slice(0, calendarRecurringCap)
      : allBrowseSections.recurring
    : [];
  const calendarHasMore =
    Boolean(allBrowseSections) &&
    Number.isFinite(calendarRecurringCap) &&
    allBrowseSections!.recurring.length > calendarRecurring.length;
  /**
   * Truncated grids fill leftover columns with extra events so More events
   * can sit on a complete row. The add-event teaser only appears once the
   * full list is already on screen.
   */
  /**
   * Mobile / non-calendar All-tab: same day + weekly split as desktop, so each
   * day can be a sticky section (calendar path uses AllBrowseCalendar instead).
   */
  const allListSections = useMemo(
    () =>
      activeRange === "all" && !(allBrowseSections && isXlShell)
        ? splitAllBrowseSections(visibleEvents)
        : null,
    [activeRange, allBrowseSections, isXlShell, visibleEvents],
  );

  // Day stickies mount after chrome may already be tucked — re-apply hide attrs.
  useLayoutEffect(() => {
    if (!allListSections && !weekendDayGroups) return;
    syncScrollChromeDom();
  }, [allListSections, weekendDayGroups]);

  const showEndTeaser =
    Boolean(onAddEvent) &&
    addEventCta === "pad" &&
    padDeficit === 0 &&
    !hasMore;
  const leftover = cardGridRowRemainder(
    showEndTeaser ? visibleEvents.length : displayEvents.length,
    columns,
  );
  // Day headers (Weekend / All) restart each row. Mobile stretches last-of-day
  // event cards; Weekend desktop fills empties with “Your event here” pads.
  // End teaser (when the last day is already full) starts a fresh row.
  const fillSpan =
    view === "cards"
      ? activeRange === "weekend" || activeRange === "all"
        ? "full"
        : leftover || "full"
      : undefined;

  const daySuggestions = !fixedTimeRange
    ? listOtherMatchingFilterTimeRanges(
        activeRange,
        (range) => filterByTimeAndPrice(events, range, priceFilter).length > 0,
      ).map((range) => ({
        range,
        label: dict.time[range],
        onSelect: () => setTimeRange(range),
      }))
    : [];
  const tryPriceLabel = dict.price.showAll;

  const showTimeFilter = !fixedTimeRange && !hideTimeFilter;
  const showPriceFilter = !hidePriceFilter && !hideTimeFilter;
  const showStickyFilters = Boolean(
    categoryNav ||
      stickyLead ||
      locationPicker ||
      showTimeFilter ||
      showPriceFilter,
  );

  /** Text link only when no card CTA is used (e.g. venue Past). */
  const showFooterAddButton =
    Boolean(onAddEvent) && addEventCta === "button";

  const addEventLabelResolved =
    addEventLabel ??
    (categoryId
      ? fillTemplate(dict.events.yourEventHere, {
          category: dict.categories[categoryId],
        })
      : dict.events.yourEventHereGeneric);

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
          <ListScrollAnchor
            anchorRef={scrollAnchorRef}
            className={stickyLead ? "mt-2 md:mt-1" : "mt-4 md:mt-2"}
          />
          <StickyListFilters>
            {/*
              Area select left + category pills (desktop). Mobile area select
              stays above the time tabs via stickyLead.
            */}
            {categoryNav || locationPicker ? (
              <div
                className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${
                  stickyLead ||
                  showTimeFilter ||
                  showPriceFilter ||
                  viewToggle
                    ? "pb-2.5"
                    : ""
                }`}
              >
                {locationPicker ? (
                  <div className="hidden shrink-0 sm:block">{locationPicker}</div>
                ) : null}
                {categoryNav ? (
                  <div className="min-w-0 flex-1 basis-full sm:basis-0">
                    {categoryNav}
                  </div>
                ) : null}
              </div>
            ) : null}
            {stickyLead ? (
              <div
                className={`sm:hidden ${
                  showTimeFilter || showPriceFilter || viewToggle
                    ? "pb-2.5"
                    : ""
                }`}
              >
                {stickyLead}
              </div>
            ) : null}

            <div className="flex items-end gap-2 md:gap-3">
              {showTimeFilter ? (
                <TimeFilter
                  key={categoryId ?? "all"}
                  value={timeRange}
                  onChange={setTimeRange}
                  dict={dict}
                  sticky={false}
                  className="min-w-0 flex-1"
                  price={showPriceFilter ? priceFilter : undefined}
                  onPriceChange={showPriceFilter ? setPriceFilter : undefined}
                  panelExtra={showPriceFilter ? viewToggle : undefined}
                  trailing={!showPriceFilter ? viewToggle : undefined}
                  leading={categoryBackCue}
                />
              ) : (
                categoryBackCue
              )}

              {!showTimeFilter && viewToggle ? (
                <div className="ml-auto shrink-0 md:pb-0.5">{viewToggle}</div>
              ) : null}
            </div>
          </StickyListFilters>
        </>
      ) : null}

      {listLead}

      {/*
        Spacing used to live as StickyListFilters `mb-4`, but that margin stays
        under the stuck bar and read as a dead gap above day titles / cards.
        Pad the list body instead so sticky day headers can sit flush.
      */}
      <div
        className={
          showStickyFilters
            ? allListSections || weekendDayGroups
              ? "mt-0"
              : "mt-2 md:mt-1.5"
            : undefined
        }
      >
      {(sectionTitle || showToggleInTitle) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {sectionTitle ? (
            <h2 className={`min-w-0 font-sans ${SECTION_TITLE_CLASS}`}>
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

      <div
        className={`min-w-0 max-w-full${
          scrollOnFilterChange && showStickyFilters
            ? ` ${LIST_PARK_FILL_CLASS}`
            : ""
        }`}
      >
        {loading ? (
          <p className="text-copy text-neutral-500 dark:text-neutral-400">
            {dict.events.loading}
          </p>
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
              title={nothingHereTitle(dict, activeRange, {
                category: categoryId ? dict.categories[categoryId] : null,
                area: areaLabel,
              })}
              hint={
                fixedTimeRange
                  ? dict.search.noResultsHint
                  : dict.events.emptyHint
              }
              suggestionsHeading={dict.search.tryTheseDays}
              suggestions={daySuggestions}
              actionLabel={priceFilter !== "all" ? tryPriceLabel : undefined}
              onAction={
                priceFilter !== "all" ? () => setPriceFilter("all") : undefined
              }
            />
            {showPadCta ? (
              <div
                className={view === "cards" ? `mt-3 ${CARD_GRID_CLASS}` : "mt-3"}
              >
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
        ) : allBrowseSections && isXlShell ? (
          <>
            <AllBrowseCalendar
              key={categoryId ?? "all"}
              days={allBrowseSections.days}
              recurring={calendarRecurring}
              dict={dict}
              locale={locale}
              returnTo={returnTo}
              returnTitle={returnTitle}
              listTimeRange={fixedTimeRange ?? timeRange}
              pendingId={pendingId}
              onNavigate={setPendingId}
              showEnlarge={!categoryId}
              weeklyHeading={dict.events.weeklyAndDaily}
              weeklyTrailing={
                calendarHasMore ||
                (showEndTeaser && !calendarHasMore) ||
                (showPadCta && !calendarHasMore) ? (
                  <>
                    {showEndTeaser && !calendarHasMore ? (
                      <EventCardPlaceholder
                        title={dict.events.yourEventHereTitle}
                        label={addEventLabelResolved}
                        onClick={onAddEvent!}
                        view="cards"
                        fillSpan={fillSpan}
                      />
                    ) : null}
                    {showPadCta && !calendarHasMore ? (
                      <EventListScrollPads
                        count={
                          allBrowseSections.days.reduce(
                            (n, day) => n + day.events.length,
                            0,
                          ) + calendarRecurring.length
                        }
                        title={dict.events.yourEventHereTitle}
                        label={addEventLabelResolved}
                        onAddEvent={onAddEvent}
                        view="cards"
                        fillSpan={fillSpan}
                      />
                    ) : null}
                    {calendarHasMore ? (
                      <EventListMoreTile
                        label={
                          categoryId
                            ? fillTemplate(dict.events.moreCategory, {
                                category: dict.categories[categoryId],
                              })
                            : dict.events.moreEvents
                        }
                        view="cards"
                        onClick={() =>
                          setVisibleCount((count) => {
                            if (!Number.isFinite(count)) return count;
                            return count + pageSize;
                          })
                        }
                      />
                    ) : null}
                  </>
                ) : undefined
              }
            />
            {addEventInlineCard}
          </>
        ) : weekendDayGroups ? (
          <>
            <div className="relative">
              {/*
                Keep the column probe out of `space-y` — as the first sibling it
                forced margin-top on the first day title (gap at scroll top only).
              */}
              {view === "cards" ? (
                <div
                  ref={gridRef}
                  className={`${CARD_GRID_CLASS} pointer-events-none absolute inset-x-0 top-0 h-0 overflow-hidden`}
                  aria-hidden
                />
              ) : null}
              <div className="space-y-2">
              {weekendDayGroups.map((group) => {
                const open = openWeekendDays.has(group.date);
                const daySpans =
                  view === "cards"
                    ? cardGridDayGroupSpans([group.events.length], columns)
                    : null;
                const dayPads =
                  view === "cards"
                    ? cardGridDayGroupPadSpans([group.events.length], columns)
                    : null;
                const dayPadSpan = dayPads?.get(group.events.length - 1);
                return (
                  <section key={group.date} className="min-w-0">
                    <h2
                      className={`${LIST_DAY_STICKY_CLASS} px-0.5`}
                      data-sticky-list-day
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => {
                          setOpenWeekendDays((prev) => {
                            const next = new Set(prev);
                            if (next.has(group.date)) next.delete(group.date);
                            else next.add(group.date);
                            return next;
                          });
                        }}
                        className="flex w-full items-center gap-2 py-0.5 text-left touch-manipulation transition-colors hover:text-orange-600 dark:hover:text-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                      >
                        <span
                          className={`min-w-0 flex-1 font-sans ${DAY_GROUP_TITLE_CLASS}`}
                        >
                          {formatEventDate(group.date, locale)}
                          <span className="ml-2 text-sm font-semibold tabular-nums text-neutral-500 dark:text-neutral-400">
                            {group.events.length}
                          </span>
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform dark:text-neutral-400 ${
                            open ? "rotate-0" : "-rotate-90"
                          }`}
                          aria-hidden
                        />
                      </button>
                    </h2>
                    {open ? (
                      <div
                        className={
                          view === "cards" ? CARD_GRID_CLASS : "space-y-2.5"
                        }
                      >
                        {group.events.map((event, index) => (
                          <Fragment key={event.id}>
                            <EventCard
                              event={event}
                              dict={dict}
                              locale={locale}
                              returnTo={returnTo}
                              returnTitle={returnTitle}
                              listTimeRange={fixedTimeRange ?? timeRange}
                              view={view}
                              pending={pendingId === event.id}
                              dimmed={
                                pendingId != null && pendingId !== event.id
                              }
                              onNavigate={() => setPendingId(event.id)}
                              showEnlarge={!categoryId}
                              fillSpan={
                                daySpans && daySpans[index] > 1
                                  ? daySpans[index]
                                  : undefined
                              }
                            />
                            {dayPadSpan &&
                            index === group.events.length - 1 &&
                            onAddEvent &&
                            addEventCta === "pad" ? (
                              <EventCardPlaceholder
                                title={dict.events.yourEventHereTitle}
                                label={addEventLabelResolved}
                                onClick={onAddEvent}
                                view={view}
                                fillSpan={dayPadSpan}
                              />
                            ) : null}
                          </Fragment>
                        ))}
                      </div>
                    ) : null}
                  </section>
                );
              })}
              {showEndTeaser ? (
                <div
                  className={view === "cards" ? CARD_GRID_CLASS : "space-y-2.5"}
                >
                  <EventCardPlaceholder
                    title={dict.events.yourEventHereTitle}
                    label={addEventLabelResolved}
                    onClick={onAddEvent!}
                    view={view}
                    fillSpan={fillSpan}
                  />
                </div>
              ) : null}
              {showPadCta ? (
                <div
                  className={view === "cards" ? CARD_GRID_CLASS : undefined}
                >
                  <EventListScrollPads
                    count={displayEvents.length}
                    title={dict.events.yourEventHereTitle}
                    label={addEventLabelResolved}
                    onAddEvent={onAddEvent}
                    view={view}
                    fillSpan={fillSpan}
                  />
                </div>
              ) : null}
              {hasMore ? (
                <div
                  className={view === "cards" ? CARD_GRID_CLASS : undefined}
                >
                  <EventListMoreTile
                    label={
                      categoryId
                        ? fillTemplate(dict.events.moreCategory, {
                            category: dict.categories[categoryId],
                          })
                        : dict.events.moreEvents
                    }
                    view={view}
                    onClick={() =>
                      setVisibleCount((count) => {
                        if (!Number.isFinite(count)) return count;
                        const shown =
                          view === "cards"
                            ? fillCardGridPage(
                                count,
                                displayEvents.length,
                                columns,
                              )
                            : count;
                        return shown + pageSize;
                      })
                    }
                  />
                </div>
              ) : null}
              </div>
            </div>
            {addEventInlineCard}
          </>
        ) : allListSections ? (
          <>
            <div className="relative">
              {view === "cards" ? (
                <div
                  ref={gridRef}
                  className={`${CARD_GRID_CLASS} pointer-events-none absolute inset-x-0 top-0 h-0 overflow-hidden`}
                  aria-hidden
                />
              ) : null}
              <div className="space-y-2">
              {allListSections.days.map((group) => {
                const daySpans =
                  view === "cards"
                    ? cardGridDayGroupSpans([group.events.length], columns)
                    : null;
                return (
                  <section key={group.date} className="min-w-0">
                    <h2 className={LIST_DAY_STICKY_CLASS} data-sticky-list-day>
                      <span
                        className={`inline-block font-sans ${DAY_GROUP_TITLE_CLASS}`}
                      >
                        {formatEventDate(group.date, locale)}
                      </span>
                    </h2>
                    <div
                      className={
                        view === "cards" ? CARD_GRID_CLASS : "space-y-2.5"
                      }
                    >
                      {group.events.map((event, index) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          dict={dict}
                          locale={locale}
                          returnTo={returnTo}
                          returnTitle={returnTitle}
                          listTimeRange={fixedTimeRange ?? timeRange}
                          view={view}
                          pending={pendingId === event.id}
                          dimmed={
                            pendingId != null && pendingId !== event.id
                          }
                          onNavigate={() => setPendingId(event.id)}
                          showEnlarge={!categoryId}
                          fillSpan={
                            daySpans && daySpans[index] > 1
                              ? daySpans[index]
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
              {allListSections.recurring.length > 0 ? (
                <section className="min-w-0">
                  <h2 className={LIST_DAY_STICKY_CLASS} data-sticky-list-day>
                    <span
                      className={`inline-block font-sans ${DAY_GROUP_TITLE_CLASS}`}
                    >
                      {dict.events.weeklyAndDaily}
                    </span>
                  </h2>
                  <div
                    className={
                      view === "cards" ? CARD_GRID_CLASS : "space-y-2.5"
                    }
                  >
                    {allListSections.recurring.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        dict={dict}
                        locale={locale}
                        returnTo={returnTo}
                        returnTitle={returnTitle}
                        listTimeRange={fixedTimeRange ?? timeRange}
                        view={view}
                        pending={pendingId === event.id}
                        dimmed={pendingId != null && pendingId !== event.id}
                        onNavigate={() => setPendingId(event.id)}
                        showEnlarge={!categoryId}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
              {showEndTeaser ? (
                <div
                  className={view === "cards" ? CARD_GRID_CLASS : "space-y-2.5"}
                >
                  <EventCardPlaceholder
                    title={dict.events.yourEventHereTitle}
                    label={addEventLabelResolved}
                    onClick={onAddEvent!}
                    view={view}
                    fillSpan={fillSpan}
                  />
                </div>
              ) : null}
              {showPadCta ? (
                <div
                  className={view === "cards" ? CARD_GRID_CLASS : undefined}
                >
                  <EventListScrollPads
                    count={displayEvents.length}
                    title={dict.events.yourEventHereTitle}
                    label={addEventLabelResolved}
                    onAddEvent={onAddEvent}
                    view={view}
                    fillSpan={fillSpan}
                  />
                </div>
              ) : null}
              {hasMore ? (
                <div
                  className={view === "cards" ? CARD_GRID_CLASS : undefined}
                >
                  <EventListMoreTile
                    label={
                      categoryId
                        ? fillTemplate(dict.events.moreCategory, {
                            category: dict.categories[categoryId],
                          })
                        : dict.events.moreEvents
                    }
                    view={view}
                    onClick={() =>
                      setVisibleCount((count) => {
                        if (!Number.isFinite(count)) return count;
                        const shown =
                          view === "cards"
                            ? fillCardGridPage(
                                count,
                                displayEvents.length,
                                columns,
                              )
                            : count;
                        return shown + pageSize;
                      })
                    }
                  />
                </div>
              ) : null}
              </div>
            </div>
            {addEventInlineCard}
          </>
        ) : (
          <>
            <div
              ref={view === "cards" ? gridRef : undefined}
              className={view === "cards" ? CARD_GRID_CLASS : "space-y-2.5"}
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
                  pending={pendingId === event.id}
                  dimmed={pendingId != null && pendingId !== event.id}
                  onNavigate={() => setPendingId(event.id)}
                  showEnlarge={!categoryId}
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
                  label={
                    categoryId
                      ? fillTemplate(dict.events.moreCategory, {
                          category: dict.categories[categoryId],
                        })
                      : dict.events.moreEvents
                  }
                  view={view}
                  onClick={() =>
                    setVisibleCount((count) => {
                      if (!Number.isFinite(count)) return count;
                      const shown =
                        view === "cards"
                          ? fillCardGridPage(
                              count,
                              displayEvents.length,
                              columns,
                            )
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
      </div>
      </div>

      {showFooterAddButton ? (
        <AddEventButton dict={dict} onClick={onAddEvent!} label={addEventLabel} />
      ) : null}
    </>
  );
}
