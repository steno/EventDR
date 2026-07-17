"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
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
import { VenueAudienceCards } from "@/components/VenueAudienceCards";
import { TodayHighlights } from "@/components/TodayHighlights";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import {
  getHomeDiscoverLayout,
  HOME_SEARCH_LIMIT,
} from "@/lib/home-layout";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
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
  const [submitOpen, setSubmitOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  /** Session city applied before paint when the URL is bare `/[locale]`. */
  const [restoredArea, setRestoredArea] = useState<{
    city: CitySlug | null;
    areaChosen: boolean;
  } | null>(null);

  const urlArea = useMemo(
    () => parseHomeCityParam(searchParams.get("city")),
    [searchParams],
  );

  // Restore a remembered city when a content back link lands on bare `/[locale]`.
  // Apply state + history before paint; avoid router.replace (extra RSC = second load).
  useLayoutEffect(() => {
    if (searchParams.get("city")) {
      setRestoredArea(null);
      return;
    }
    const stored = readHomeArea();
    if (!stored.areaChosen || stored.city == null) {
      setRestoredArea(null);
      return;
    }
    setRestoredArea(stored);
    const href = homePathWithArea(locale, stored.city, true);
    window.history.replaceState(window.history.state ?? null, "", href);
  }, [locale, searchParams]);

  const selectedCity = urlArea.areaChosen
    ? urlArea.city
    : restoredArea?.areaChosen
      ? restoredArea.city
      : urlArea.city;
  const areaChosen = urlArea.areaChosen || Boolean(restoredArea?.areaChosen);

  const setArea = useCallback(
    (slug: CitySlug | null) => {
      setRestoredArea(null);
      const params = new URLSearchParams(searchParams.toString());
      params.set("city", slug ?? HOME_CITY_ALL);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Persist area: explicit ?city=, or bare home as North Coast default.
  useEffect(() => {
    if (areaChosen) {
      writeHomeArea(selectedCity);
      return;
    }
    writeHomeArea(null);
  }, [areaChosen, selectedCity]);

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
  // Bare home and ?city=all both mean North Coast for return links.
  const homePath = homePathWithArea(locale, selectedCity, true);

  /** Zone pick scopes home highlights; null = whole North Coast. */
  const scopedEvents = useMemo(() => {
    if (!selectedCity) return allEvents;
    return allEvents.filter((event) => eventMatchesCity(event, selectedCity));
  }, [allEvents, selectedCity]);

  const discoverLayout = useMemo(
    () => getHomeDiscoverLayout(scopedEvents),
    [scopedEvents],
  );

  const seeAllTodayHref = selectedCity
    ? `/${locale}/city/${selectedCity}`
    : `/${locale}/when/today`;

  const heroPlaceName = (() => {
    if (selectedCity) {
      const city = getCityMeta(selectedCity);
      return city ? getCityName(city, locale) : dict.hero.nearYou;
    }
    return dict.cities.regionName;
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
              setRestoredArea(null);
              // URL may already show ?city= from history.replaceState while
              // Next searchParams are still bare — always reset to fresh home.
              if (searchParams.get("city") || restoredArea?.areaChosen) {
                router.replace(`/${locale}`, { scroll: false });
              }
            }}
            desktopActions={
              <>
                <button
                  type="button"
                  onClick={() => handleTabChange("saved")}
                  className={`rounded-full px-3.5 py-2 text-xs font-bold tracking-wide transition-colors touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
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
                  className="rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-transform active:scale-95 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
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
                <div className="mb-6 sm:mb-8 lg:mb-8">
                  <div className="relative z-10 py-3 sm:py-3.5">
                    <CityLocationPicker
                      locale={locale}
                      dict={dict}
                      currentSlug={selectedCity}
                      onSelect={setArea}
                    />
                  </div>
                  <div className="pb-1 pt-3 sm:pt-3.5">
                    <CategoryGrid
                      locale={locale}
                      dict={dict}
                      citySlug={selectedCity}
                    />
                  </div>
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

              {!isSearching && (
                <VenueAudienceCards
                  locale={locale}
                  dict={dict}
                  initialVenues={initialVenues}
                />
              )}

              {/* Always fetch for hero / today / saved; list UI only while searching. */}
              <EventList
                locale={locale}
                dict={dict}
                searchQuery={listSearchQuery}
                timeRange="all"
                onEventsLoaded={handleEventsLoaded}
                refreshKey={refreshKey}
                onAddEvent={() => setSubmitOpen(true)}
                returnTo={homePath}
                limit={HOME_SEARCH_LIMIT}
                silent={!isSearching}
              />
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
