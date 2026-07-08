"use client";

import { useCallback, useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { EventList } from "@/components/EventList";
import { SearchBar } from "@/components/SearchBar";
import { BottomNav } from "@/components/BottomNav";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { SubmitEventSheet } from "@/components/SubmitEventSheet";
import { InstallBanner } from "@/components/InstallBanner";
import { PwaRegister } from "@/components/PwaRegister";
import { EventCard } from "@/components/EventCard";
import { VenueStrip } from "@/components/VenueStrip";
import { PushNotifyButton } from "@/components/PushNotifyButton";
import { SiteFooter } from "@/components/SiteFooter";
import { TodayHighlights } from "@/components/TodayHighlights";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import { useGeolocation } from "@/hooks/useGeolocation";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { NORTH_COAST_CENTER } from "@/lib/geo";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { AppTab, Dictionary } from "@/i18n/dictionaries";

interface HomeProps {
  locale: Locale;
  dict: Dictionary;
}

export function Home({ locale, dict }: HomeProps) {
  const [tab, setTab] = useState<AppTab>("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const { toggleSave, isSaved, filterSaved, reconcileWithEvents } = useSavedEvents();
  const geo = useGeolocation();
  const push = usePushNotifications(locale);

  const sortLat = geo.lat ?? NORTH_COAST_CENTER.lat;
  const sortLng = geo.lng ?? NORTH_COAST_CENTER.lng;

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

  async function handlePushSubscribe() {
    await push.subscribe(geo.lat ?? undefined, geo.lng ?? undefined);
  }

  const savedEvents = filterSaved(allEvents);

  function handleTabChange(newTab: AppTab) {
    setTab(newTab);
    if (newTab === "submit") {
      setSubmitOpen(true);
    }
  }

  return (
    <>
      <PwaRegister />
      <main className="relative flex-1 overflow-hidden bg-neutral-50 pb-24">
        <div className="pointer-events-none absolute -top-20 -left-24 h-56 w-56 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="pointer-events-none absolute top-20 -right-24 h-64 w-64 rounded-full bg-fuchsia-200/35 blur-3xl" />
        <div className="relative mx-auto max-w-lg sm:max-w-2xl px-4 pb-6">
          <AppHeader
            locale={locale}
            dict={dict}
            onLogoClick={() => {
              setTab("discover");
              setSearchQuery("");
            }}
          />

          {tab === "discover" && (
            <>
              <InstallBanner dict={dict} />
              <Hero dict={dict} onAddEvent={() => setSubmitOpen(true)} />
              <TodayHighlights
                events={allEvents}
                locale={locale}
                dict={dict}
                onSelectEvent={setSelectedEvent}
              />
              <div className="mb-6">
                <CategoryGrid locale={locale} dict={dict} />
              </div>
              <div className="mb-8">
                <VenueStrip locale={locale} dict={dict} />
              </div>
              <EventList
                locale={locale}
                dict={dict}
                onSelectEvent={setSelectedEvent}
                onEventsLoaded={handleEventsLoaded}
                refreshKey={refreshKey}
                sortByDistance
                userLat={sortLat}
                userLng={sortLng}
              />
              <div className="mt-6 mb-2">
                <PushNotifyButton
                  dict={dict}
                  supported={push.supported}
                  subscribed={push.subscribed}
                  loading={push.loading}
                  onSubscribe={handlePushSubscribe}
                />
              </div>
            </>
          )}

          {tab === "search" && (
            <div className="pt-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                dict={dict}
                autoFocus
              />
              {searchQuery.trim() ? (
                <EventList
                  locale={locale}
                  dict={dict}
                  searchQuery={searchQuery}
                  timeRange="all"
                  onSelectEvent={setSelectedEvent}
                  refreshKey={refreshKey}
                  sortByDistance
                  userLat={sortLat}
                  userLng={sortLng}
                />
              ) : (
                <p className="text-center text-sm text-neutral-400 font-medium py-16 px-6">
                  {dict.search.placeholder}
                </p>
              )}
            </div>
          )}

          {tab === "saved" && (
            <div className="pt-4">
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-6">
                {dict.saved.title}
              </h2>
              {savedEvents.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-neutral-500 font-medium">{dict.saved.empty}</p>
                  <p className="text-sm text-neutral-400 mt-1">
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
                      onSelect={setSelectedEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <SiteFooter dict={dict} locale={locale} className="mb-16" />
      </main>

      <BottomNav
        active={tab === "submit" && submitOpen ? "submit" : tab}
        onChange={handleTabChange}
        dict={dict}
        savedCount={savedEvents.length}
      />

      <EventDetailSheet
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        dict={dict}
        locale={locale}
        isSaved={selectedEvent ? isSaved(selectedEvent) : false}
        onToggleSave={toggleSave}
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
