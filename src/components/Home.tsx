"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
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
  getTodayHighlightEvents,
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

  const todayHighlightIds = useMemo(() => {
    return getTodayHighlightEvents(allEvents)
      .slice(0, HOME_TODAY_LIMIT)
      .map((e) => e.id);
  }, [allEvents]);

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
        <div className="relative mx-auto max-w-lg sm:max-w-2xl px-4">
          <AppHeader
            locale={locale}
            dict={dict}
            onLogoClick={() => {
              setTab("discover");
              setSearchQuery("");
            }}
          />

          {(tab === "discover" || tab === "search") && (
            <>
              <InstallBanner dict={dict} />
              <Hero dict={dict} onAddEvent={() => setSubmitOpen(true)} />
              <SearchBar
                ref={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                dict={dict}
              />
              {!isSearching && (
                <div className="mb-6">
                  <CategoryGrid locale={locale} dict={dict} />
                </div>
              )}

              {!isSearching && tab === "discover" && (
                <TodayHighlights
                  events={allEvents}
                  locale={locale}
                  dict={dict}
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
                    !isSearching && timeRange === "all" ? todayHighlightIds : []
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
