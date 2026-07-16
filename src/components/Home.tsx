"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PhotoHero } from "@/components/PhotoHero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CityLocationPicker } from "@/components/CityLocationPicker";
import { EventList } from "@/components/EventList";
import { SearchBar } from "@/components/SearchBar";
import { BottomNav } from "@/components/BottomNav";
import { SubmitEventSheet } from "@/components/SubmitEventSheet";
import { InstallBanner } from "@/components/InstallBanner";
import { PwaRegister } from "@/components/PwaRegister";
import { EventCard } from "@/components/EventCard";
import { VenueStrip } from "@/components/VenueStrip";
import { TodayHighlights } from "@/components/TodayHighlights";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import {
  EMPTY_EVENT_IDS,
  getHomeDiscoverLayout,
  HOME_PICKS_LIMIT,
  HOME_SEARCH_LIMIT,
  homeViewAllPath,
} from "@/lib/home-layout";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import {
  DEFAULT_FILTER_TIME_RANGE,
  type FilterTimeRange,
} from "@/lib/filters";
import {
  eventMatchesCity,
  getCityMeta,
  getCityName,
  HOME_CITY_ALL,
  homePathWithArea,
  parseHomeCityParam,
  readHomeArea,
  writeHomeArea,
  type CitySlug,
} from "@/lib/cities";
import { ChevronDown, X } from "lucide-react";
import type { Event, Venue } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { AppTab, Dictionary } from "@/i18n/dictionaries";

interface HomeProps {
  locale: Locale;
  dict: Dictionary;
  initialVenues?: Venue[];
}

export function Home({ locale, dict, initialVenues }: HomeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<AppTab>("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [timeRange, setTimeRange] = useState<FilterTimeRange>(
    DEFAULT_FILTER_TIME_RANGE,
  );
  const [submitOpen, setSubmitOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  /**
   * Category pills: open on the first area pick, then only via “See what’s on”.
   * Remounting Home (back from event/scope) always starts collapsed.
   */
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const { city: selectedCity, areaChosen } = useMemo(
    () => parseHomeCityParam(searchParams.get("city")),
    [searchParams],
  );

  // Restore area when a content back link lands on bare `/[locale]`.
  useEffect(() => {
    if (searchParams.get("city")) return;
    const stored = readHomeArea();
    if (!stored.areaChosen) return;
    router.replace(homePathWithArea(locale, stored.city, true), {
      scroll: false,
    });
  }, [locale, router, searchParams]);

  const setArea = useCallback(
    (slug: CitySlug | null) => {
      // First “Choose area” pick reveals categories; later changes stay collapsed.
      if (!areaChosen) setCategoriesOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set("city", slug ?? HOME_CITY_ALL);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [areaChosen, pathname, router, searchParams],
  );

  // Keep session in sync when arriving via shared/bookmarked ?city=.
  useEffect(() => {
    if (!areaChosen) return;
    writeHomeArea(selectedCity);
  }, [areaChosen, selectedCity]);

  const handleCategorySelect = useCallback(() => {
    setCategoriesOpen(false);
  }, []);

  const handleExpandCategories = useCallback(() => {
    setCategoriesOpen(true);
  }, []);

  const { filterSaved, reconcileWithEvents } = useSavedEvents();

  const handleEventsLoaded = useCallback((events: Event[]) => {
    setAllEvents(events);
    reconcileWithEvents(events);
  }, [reconcileWithEvents]);

  useEffect(() => {
    if (allEvents.length > 0) reconcileWithEvents(allEvents);
  }, [allEvents, reconcileWithEvents]);

  const handleSubmitted = useCallback((event: Event, pending?: boolean) => {
    if (!pending) {
      setAllEvents((prev) => [event, ...prev]);
    }
    setRefreshKey((k) => k + 1);
    setTab("discover");
  }, []);

  const savedEvents = filterSaved(allEvents);
  const homePath = homePathWithArea(locale, selectedCity, areaChosen);

  /** Zone pick scopes home highlights and picks; null = whole North Coast. */
  const scopedEvents = useMemo(() => {
    if (!selectedCity) return allEvents;
    return allEvents.filter((event) => eventMatchesCity(event, selectedCity));
  }, [allEvents, selectedCity]);

  const discoverLayout = useMemo(
    () => getHomeDiscoverLayout(scopedEvents),
    [scopedEvents],
  );

  const viewAllHref = homeViewAllPath(locale, timeRange, selectedCity);
  const seeAllTodayHref = selectedCity
    ? `/${locale}/city/${selectedCity}`
    : `/${locale}/when/today`;

  const heroPlaceName = (() => {
    if (selectedCity) {
      const city = getCityMeta(selectedCity);
      return city ? getCityName(city, locale) : dict.hero.nearYou;
    }
    if (areaChosen) return dict.cities.regionName;
    return dict.hero.nearYou;
  })();

  function handleTabChange(newTab: AppTab) {
    if (newTab === "submit") {
      setSubmitOpen(true);
      return;
    }
    setTab(newTab);
    if (newTab === "discover") {
      setSearchQuery("");
    }
  }

  const isSearching = searchQuery.trim().length > 0;
  const listSearchQuery = isSearching ? deferredSearchQuery : "";
  // Avoid duplicating TodayHighlights when the list is also scoped to today.
  const picksExcludeIds =
    !isSearching && timeRange === "today"
      ? discoverLayout.picksExcludeIds
      : EMPTY_EVENT_IDS;

  return (
    <>
      <PwaRegister />
      <main id="main-content" className="relative bg-neutral-50 dark:bg-transparent pb-6">
        <div className={PAGE_SHELL_CLASS}>
          <AppHeader
            locale={locale}
            dict={dict}
            onLogoClick={() => {
              setTab("discover");
              setSearchQuery("");
              setCategoriesOpen(false);
              if (searchParams.get("city")) {
                router.replace(`/${locale}`, { scroll: false });
              }
            }}
            desktopActions={
              <>
                <button
                  type="button"
                  onClick={() => handleTabChange("saved")}
                  className={`rounded-full px-3.5 py-2 text-[13px] font-bold tracking-wide transition-colors touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                    tab === "saved"
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                  }`}
                >
                  {dict.nav.saved}
                  {savedEvents.length > 0 ? ` (${savedEvents.length})` : ""}
                </button>
                <button
                  type="button"
                  onClick={() => setSubmitOpen(true)}
                  className="rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-3.5 py-2 text-[13px] font-bold text-white shadow-sm transition-transform active:scale-95 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                >
                  {dict.nav.submit}
                </button>
              </>
            }
          />

          {tab === "discover" && (
            <>
              <InstallBanner dict={dict} />
              <div className="flex flex-col">
                <div className="order-2 sm:order-1">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    dict={dict}
                  />
                </div>
                <div className="order-1 sm:order-2">
                  <PhotoHero
                    dict={dict}
                    locale={locale}
                    featuredEvent={discoverLayout.heroEvent}
                    returnTo={homePath}
                    placeName={heroPlaceName}
                  />
                </div>
              </div>
              {!isSearching && (
                <div className="mb-6 rounded-2xl border border-neutral-200/80 bg-white/60 dark:border-neutral-800/80 dark:bg-neutral-900/40 sm:mb-8 lg:mb-8">
                  <div className="relative z-10 flex items-center gap-2 bg-white/90 px-4 py-3 backdrop-blur-sm dark:bg-neutral-900/90 sm:px-5 sm:py-3.5">
                    <div className="relative z-20 min-w-0 flex-1">
                      <CityLocationPicker
                        locale={locale}
                        dict={dict}
                        currentSlug={selectedCity}
                        emptyLabel={areaChosen ? undefined : dict.cities.chooseArea}
                        onSelect={setArea}
                      />
                    </div>
                    {areaChosen && categoriesOpen && (
                      <button
                        type="button"
                        onClick={handleCategorySelect}
                        aria-label={dict.detail.close}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors touch-manipulation hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                      >
                        <X className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                      </button>
                    )}
                  </div>
                  {areaChosen && categoriesOpen && (
                    <div className="animate-reveal-down relative z-0 border-t border-neutral-200/60 px-4 pb-3 pt-2.5 dark:border-neutral-800/60 sm:px-5">
                      <CategoryGrid
                        locale={locale}
                        dict={dict}
                        citySlug={selectedCity}
                        onCategorySelect={handleCategorySelect}
                      />
                    </div>
                  )}
                  {areaChosen && !categoriesOpen && (
                    <div className="px-4 pb-3 sm:px-5">
                      <button
                        type="button"
                        onClick={handleExpandCategories}
                        className="inline-flex items-center gap-0.5 text-sm font-semibold leading-snug text-orange-600 transition-colors touch-manipulation hover:text-rose-600 dark:text-orange-400 dark:hover:text-rose-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 rounded"
                      >
                        {dict.browse.browseCategories}
                        <ChevronDown
                          className="h-3.5 w-3.5 opacity-80"
                          aria-hidden
                          strokeWidth={2.5}
                        />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!isSearching && (
                <TodayHighlights
                  events={discoverLayout.todayEvents}
                  locale={locale}
                  dict={dict}
                  prefiltered
                  excludeEventIds={discoverLayout.heroExcludeIds}
                  seeAllHref={seeAllTodayHref}
                  returnTo={homePath}
                />
              )}

              <EventList
                locale={locale}
                dict={dict}
                searchQuery={listSearchQuery}
                timeRange={isSearching ? "all" : timeRange}
                citySlug={isSearching ? null : selectedCity}
                onEventsLoaded={handleEventsLoaded}
                refreshKey={refreshKey}
                ourPicks={!isSearching}
                onTimeRangeChange={setTimeRange}
                showTimeFilter={!isSearching}
                onAddEvent={() => setSubmitOpen(true)}
                returnTo={homePath}
                limit={isSearching ? HOME_SEARCH_LIMIT : HOME_PICKS_LIMIT}
                excludeEventIds={picksExcludeIds}
                // All stays on-home with "More events"; other tabs deep-link.
                viewAllHref={
                  !isSearching && timeRange !== "all"
                    ? viewAllHref
                    : undefined
                }
              />

              {!isSearching && (
                <div className="mt-8">
                  <VenueStrip locale={locale} dict={dict} initialVenues={initialVenues} />
                </div>
              )}
            </>
          )}

          {tab === "saved" && (
            <div className="pt-4">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight mb-6">
                {dict.saved.title}
              </h2>
              {savedEvents.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-neutral-500 dark:text-neutral-400 font-medium">{dict.saved.empty}</p>
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                    {dict.saved.emptyHint}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      dict={dict}
                      locale={locale}
                      returnTo={homePath}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <BottomNav
        active={tab === "submit" && submitOpen ? "submit" : tab}
        onChange={handleTabChange}
        dict={dict}
        savedCount={savedEvents.length}
      />

      <SubmitEventSheet
        open={submitOpen}
        onClose={() => {
          setSubmitOpen(false);
          if (tab === "submit") setTab("discover");
        }}
        dict={dict}
        locale={locale}
        onSubmitted={handleSubmitted}
      />
    </>
  );
}
