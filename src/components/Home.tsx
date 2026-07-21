"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { PhotoHero } from "@/components/PhotoHero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { CityLocationPicker } from "@/components/CityLocationPicker";
import { EventList } from "@/components/EventList";
import { SearchBar } from "@/components/SearchBar";
import { BottomNav } from "@/components/BottomNav";
import { InstallBanner } from "@/components/InstallBanner";
import { PwaRegister } from "@/components/PwaRegister";
import { EventCard } from "@/components/EventCard";
import { VenueAudienceCards } from "@/components/VenueAudienceCards";
import { TodayHighlights } from "@/components/TodayHighlights";
import { stickyBackControlClassName } from "@/components/StickyListHeader";
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
  homePathWithArea,
  parseHomeCityParam,
  readHomeArea,
  writeHomeArea,
  type CitySlug,
} from "@/lib/cities";
import type { Event, Venue } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { AppTab, Dictionary } from "@/i18n/dictionaries";
import {
  getOnboardingCopy,
  hasSeenOnboarding,
  markOnboardingSeen,
} from "@/lib/onboarding";
import { fillTemplate } from "@/lib/seo";

const SubmitEventSheet = dynamic(
  () =>
    import("@/components/SubmitEventSheet").then((m) => m.SubmitEventSheet),
  { ssr: false },
);

const CityPrimingSheet = dynamic(
  () =>
    import("@/components/CityPrimingSheet").then((m) => m.CityPrimingSheet),
  { ssr: false },
);

interface HomeProps {
  locale: Locale;
  dict: Dictionary;
  initialVenues?: Venue[];
  /** SSR event catalog so home skips a duplicate client Firestore fetch. */
  initialEvents?: Event[];
}

export function Home({
  locale,
  dict,
  initialVenues,
  initialEvents = [],
}: HomeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<AppTab>("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>(() => initialEvents);
  const [refreshKey, setRefreshKey] = useState(0);
  const [cityPrimingOpen, setCityPrimingOpen] = useState(false);
  /**
   * Local area override — wins over Next searchParams.
   * Used for session restore on bare `/[locale]` and for chip clicks so we can
   * update the URL with history.replaceState (no RSC soft-nav flash).
   */
  const [localArea, setLocalArea] = useState<{
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
      // Next has an explicit city param. Keep a chip override if we already set one
      // via history.replaceState (searchParams stay stale until a real Next nav).
      setLocalArea((prev) => (prev?.areaChosen ? prev : null));
      return;
    }
    const stored = readHomeArea();
    if (!stored.areaChosen || stored.city == null) {
      setLocalArea(null);
      return;
    }
    setLocalArea(stored);
    const href = homePathWithArea(locale, stored.city, true);
    window.history.replaceState(window.history.state ?? null, "", href);
  }, [locale, searchParams]);

  // Prefer localArea so chip clicks filter instantly without waiting on (or
  // triggering) a Next soft navigation.
  const selectedCity = localArea?.areaChosen ? localArea.city : urlArea.city;
  const areaChosen = Boolean(localArea?.areaChosen) || urlArea.areaChosen;

  useEffect(() => {
    if (areaChosen || hasSeenOnboarding("city-primed")) return;
    const timer = window.setTimeout(() => setCityPrimingOpen(true), 500);
    return () => window.clearTimeout(timer);
  }, [areaChosen]);

  const setArea = useCallback(
    (slug: CitySlug | null) => {
      setLocalArea({ city: slug, areaChosen: true });
      // Same pattern as session restore: update the address bar without an RSC
      // round-trip. router.replace(?city=…) was flashing the whole home shell.
      const href = homePathWithArea(locale, slug, true);
      window.history.replaceState(window.history.state ?? null, "", href);
    },
    [locale],
  );

  // Persist area: explicit ?city=, or bare home as North Coast default.
  useEffect(() => {
    if (areaChosen) {
      writeHomeArea(selectedCity);
      return;
    }
    writeHomeArea(null);
  }, [areaChosen, selectedCity]);

  const { filterSaved, reconcileWithEvents, ready: savedReady } = useSavedEvents();
  const [eventsReady, setEventsReady] = useState(false);

  const handleEventsLoaded = useCallback((events: Event[]) => {
    setAllEvents(events);
    setEventsReady(true);
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
  const onboardingCopy = getOnboardingCopy(locale);
  const savedExample =
    discoverLayout.heroEvent ?? discoverLayout.todayEvents[0] ?? scopedEvents[0];

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
              setLocalArea(null);
              const bareHome = `/${locale}`;
              // Chip clicks update the bar via history.replaceState — sync that
              // too, since Next searchParams may still look bare or stale.
              window.history.replaceState(
                window.history.state ?? null,
                "",
                bareHome,
              );
              if (searchParams.get("city")) {
                router.replace(bareHome, { scroll: false });
              }
            }}
            search={
              tab === "discover" ? (
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  dict={dict}
                />
              ) : undefined
            }
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
              {!cityPrimingOpen ? <InstallBanner dict={dict} /> : null}
              <div className="flex flex-col">
                <div className="order-1 mb-4 sm:order-1 lg:hidden">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    dict={dict}
                  />
                </div>
                <div className="order-2 sm:order-2">
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
                  <div className="pb-1 pt-1">
                    <CategoryGrid
                      locale={locale}
                      dict={dict}
                      citySlug={selectedCity}
                    />
                  </div>
                  <div className="relative z-10 py-3 sm:py-3.5">
                    <CityLocationPicker
                      locale={locale}
                      dict={dict}
                      currentSlug={selectedCity}
                      onSelect={setArea}
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
            </>
          )}

          {tab === "saved" && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleTabChange("discover")}
                className={stickyBackControlClassName}
              >
                <ArrowLeft className="h-[1.125rem] w-[1.125rem] shrink-0" aria-hidden />
                <span className="min-w-0 truncate">
                  {fillTemplate(dict.browse.backTo, {
                    title: dict.nav.discover,
                  })}
                </span>
              </button>
              <h2 className="mt-1 text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight mb-6">
                {dict.saved.title}
              </h2>
              {!savedReady || !eventsReady ? (
                <div className="py-16 text-center text-sm font-medium text-neutral-400 dark:text-neutral-500">
                  …
                </div>
              ) : savedEvents.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="font-bold text-neutral-700 dark:text-neutral-200">
                    {onboardingCopy.saved.exampleTitle}
                  </p>
                  <p className="mx-auto mt-1 max-w-sm text-base text-neutral-500 dark:text-neutral-400">
                    {onboardingCopy.saved.exampleBody}
                  </p>
                  {savedExample ? (
                    <div className="mx-auto mt-6 max-w-sm text-left">
                      <EventCard
                        event={savedExample}
                        dict={dict}
                        locale={locale}
                        returnTo={homePath}
                        view="cards"
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="grid grid-cols-2 items-stretch gap-2.5 sm:gap-3 lg:grid-cols-3">
                  {savedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      dict={dict}
                      locale={locale}
                      returnTo={homePath}
                      view="cards"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Keep catalog mounted across tabs so Saved can resolve before Discover remounts. */}
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
            silent={tab !== "discover" || !isSearching}
            initialEvents={initialEvents}
          />
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
      <CityPrimingSheet
        locale={locale}
        open={cityPrimingOpen}
        onChoose={(city) => {
          markOnboardingSeen("city-primed");
          setCityPrimingOpen(false);
          setArea(city);
        }}
        onDismiss={() => {
          markOnboardingSeen("city-primed");
          setCityPrimingOpen(false);
        }}
      />
    </>
  );
}
