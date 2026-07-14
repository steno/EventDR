"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useTodayHighlightShuffleSeed } from "@/hooks/useTodayHighlightShuffleSeed";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import {
  getHomeHeroEvent,
  getTodayHighlightExcludeIds,
  HOME_PICKS_LIMIT,
  HOME_TODAY_LIMIT,
  homeViewAllPath,
} from "@/lib/home-layout";
import { type TimeRange } from "@/lib/filters";
import type { Event, Venue } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { AppTab, Dictionary } from "@/i18n/dictionaries";

interface HomeProps {
  locale: Locale;
  dict: Dictionary;
  initialVenues?: Venue[];
}

export function Home({ locale, dict, initialVenues }: HomeProps) {
  const [tab, setTab] = useState<AppTab>("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [submitOpen, setSubmitOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { toggleSave, isSaved, filterSaved, reconcileWithEvents } = useSavedEvents();
  const todayShuffleSeed = useTodayHighlightShuffleSeed();

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
  const homePath = `/${locale}`;

  const heroEvent = useMemo(
    () => getHomeHeroEvent(allEvents, { sessionSeed: todayShuffleSeed }),
    [allEvents, todayShuffleSeed],
  );

  const todayHighlightExcludeIds = useMemo(() => {
    const ids = getTodayHighlightExcludeIds(allEvents, HOME_TODAY_LIMIT, {
      sessionSeed: todayShuffleSeed,
    });
    if (heroEvent && !ids.includes(heroEvent.id)) {
      return [...ids, heroEvent.id];
    }
    return ids;
  }, [allEvents, todayShuffleSeed, heroEvent]);

  const heroExcludeIds = useMemo(
    () => (heroEvent ? [heroEvent.id] : []),
    [heroEvent],
  );

  const viewAllHref = homeViewAllPath(locale, timeRange);

  function handleTabChange(newTab: AppTab) {
    if (newTab === "submit") {
      setSubmitOpen(true);
      return;
    }
    setTab(newTab);
    if (newTab === "search") {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
    if (newTab === "discover") {
      setSearchQuery("");
    }
  }

  const isSearching = searchQuery.trim().length > 0;

  return (
    <>
      <PwaRegister />
      <main className="relative bg-neutral-50 dark:bg-transparent pb-6">
        <div className="relative mx-auto max-w-lg px-4 sm:max-w-3xl lg:max-w-5xl lg:rounded-[2rem] lg:bg-white/70 lg:px-8 lg:pb-10 lg:pt-2 lg:shadow-[0_24px_80px_-48px_rgba(0,0,0,0.35)] lg:ring-1 lg:ring-neutral-200/80 dark:lg:bg-neutral-950/75 dark:lg:shadow-[0_30px_90px_-50px_rgba(0,0,0,0.95)] dark:lg:ring-white/10">
          <AppHeader
            locale={locale}
            dict={dict}
            onLogoClick={() => {
              setTab("discover");
              setSearchQuery("");
            }}
            desktopActions={
              <>
                <button
                  type="button"
                  onClick={() => handleTabChange("saved")}
                  className={`rounded-full px-3.5 py-2 text-xs font-bold tracking-wide transition-colors touch-manipulation ${
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
                  className="rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-transform active:scale-95 touch-manipulation"
                >
                  {dict.nav.submit}
                </button>
              </>
            }
          />

          {(tab === "discover" || tab === "search") && (
            <>
              <InstallBanner dict={dict} />
              <div className="flex flex-col">
                <div className="order-2 sm:order-1">
                  <SearchBar
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={setSearchQuery}
                    dict={dict}
                  />
                </div>
                <div className="order-1 sm:order-2">
                  <PhotoHero
                    dict={dict}
                    locale={locale}
                    featuredEvent={heroEvent}
                    onAddEvent={() => setSubmitOpen(true)}
                  />
                </div>
              </div>
              {!isSearching && (
                <div className="mb-6 rounded-2xl border border-neutral-200/80 bg-white/60 p-4 dark:border-neutral-800/80 dark:bg-neutral-900/40 sm:mb-8 sm:p-5 lg:mb-8">
                  <CityLocationPicker locale={locale} dict={dict} />
                  <div className="mt-1">
                    <CategoryGrid locale={locale} dict={dict} />
                  </div>
                </div>
              )}

              {!isSearching && tab === "discover" && (
                <TodayHighlights
                  events={allEvents}
                  locale={locale}
                  dict={dict}
                  excludeEventIds={heroExcludeIds}
                />
              )}

              {tab === "search" && !isSearching && (
                <p className="text-center text-sm text-neutral-400 dark:text-neutral-500 font-medium py-8 px-6">
                  {dict.search.placeholder}
                </p>
              )}

              <div className={tab === "search" && !isSearching ? "hidden" : undefined}>
                <EventList
                  locale={locale}
                  dict={dict}
                  searchQuery={isSearching ? searchQuery : ""}
                  timeRange={isSearching ? "all" : timeRange}
                  onEventsLoaded={handleEventsLoaded}
                  refreshKey={refreshKey}
                  ourPicks={!isSearching}
                  onTimeRangeChange={setTimeRange}
                  showTimeFilter={!isSearching}
                  returnTo={homePath}
                  limit={isSearching ? undefined : HOME_PICKS_LIMIT}
                  excludeEventIds={
                    !isSearching && timeRange === "all"
                      ? todayHighlightExcludeIds
                      : []
                  }
                  viewAllHref={!isSearching ? viewAllHref : undefined}
                />
              </div>

              {!isSearching && tab === "discover" && (
                <>
                  <div className="mt-8">
                    <VenueStrip locale={locale} dict={dict} initialVenues={initialVenues} />
                  </div>
                </>
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
