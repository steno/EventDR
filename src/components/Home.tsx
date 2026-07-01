"use client";

import { useCallback, useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { EventList } from "@/components/EventList";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchBar } from "@/components/SearchBar";
import { TimeFilter } from "@/components/TimeFilter";
import { BottomNav } from "@/components/BottomNav";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { SubmitEventSheet } from "@/components/SubmitEventSheet";
import { InstallBanner } from "@/components/InstallBanner";
import { PwaRegister } from "@/components/PwaRegister";
import { EventCard } from "@/components/EventCard";
import { VenueStrip } from "@/components/VenueStrip";
import { NearMeToggle } from "@/components/NearMeToggle";
import { PushNotifyButton } from "@/components/PushNotifyButton";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import { useGeolocation } from "@/hooks/useGeolocation";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import type { Event, EventCategory } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { AppTab, Dictionary } from "@/i18n/dictionaries";
import type { TimeRange } from "@/lib/filters";

interface HomeProps {
  locale: Locale;
  dict: Dictionary;
}

export function Home({ locale, dict }: HomeProps) {
  const [tab, setTab] = useState<AppTab>("discover");
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [nearMe, setNearMe] = useState(false);

  const { toggleSave, isSaved, filterSaved, savedIds } = useSavedEvents();
  const geo = useGeolocation();
  const push = usePushNotifications(locale);

  useEffect(() => {
    if (localStorage.getItem("popevents-nearme") === "1") {
      setNearMe(true);
    }
  }, []);

  useEffect(() => {
    fetch(`/api/events?locale=${locale}`)
      .then((r) => r.json())
      .then((d: { events?: Event[] }) => setAllEvents(d.events ?? []))
      .catch(() => {});
  }, [locale, refreshKey]);

  const handleEventsLoaded = useCallback((events: Event[]) => {
    setAllEvents(events);
  }, []);

  const handleSubmitted = useCallback((event: Event, pending?: boolean) => {
    if (!pending) {
      setAllEvents((prev) => [event, ...prev]);
    }
    setRefreshKey((k) => k + 1);
    setTab("discover");
  }, []);

  function handleNearMeToggle() {
    if (!nearMe) {
      geo.requestLocation();
      localStorage.setItem("popevents-nearme", "1");
      setNearMe(true);
      setRefreshKey((k) => k + 1);
    } else {
      localStorage.removeItem("popevents-nearme");
      setNearMe(false);
      setRefreshKey((k) => k + 1);
    }
  }

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
      <main className="flex-1 bg-neutral-50 pb-24">
        <div className="mx-auto max-w-lg sm:max-w-2xl px-4 pb-6">
          <div className="flex justify-end pt-3">
            <LanguageSwitcher locale={locale} dict={dict} />
          </div>

          {tab === "discover" && (
            <>
              <InstallBanner dict={dict} />
              <Hero dict={dict} />
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                dict={dict}
              />
              <TimeFilter
                value={timeRange}
                onChange={setTimeRange}
                dict={dict}
              />
              <div className="flex flex-wrap gap-2 mb-4">
                <NearMeToggle
                  active={nearMe && geo.lat != null}
                  loading={geo.loading}
                  error={geo.error}
                  onToggle={handleNearMeToggle}
                  dict={dict}
                />
              </div>
              <VenueStrip locale={locale} dict={dict} />
              <div className="mb-6">
                <PushNotifyButton
                  dict={dict}
                  supported={push.supported}
                  subscribed={push.subscribed}
                  loading={push.loading}
                  onSubscribe={handlePushSubscribe}
                />
              </div>
              <div className="mb-8">
                <CategoryGrid
                  selected={category}
                  onSelect={setCategory}
                  dict={dict}
                />
              </div>
              <EventList
                category={category}
                locale={locale}
                dict={dict}
                searchQuery={searchQuery}
                timeRange={timeRange}
                onSelectEvent={setSelectedEvent}
                onEventsLoaded={handleEventsLoaded}
                refreshKey={refreshKey}
                nearMe={nearMe}
                userLat={geo.lat}
                userLng={geo.lng}
              />
            </>
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

        <footer className="border-t border-neutral-100 bg-white py-6 text-center mb-16">
          <p className="text-xs text-neutral-400 font-medium">
            {dict.footer.tagline}
          </p>
          <a
            href="https://github.com/steno/EventDR"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors mt-1 inline-block"
          >
            github.com/steno/EventDR
          </a>
        </footer>
      </main>

      <BottomNav
        active={tab === "submit" && submitOpen ? "submit" : tab}
        onChange={handleTabChange}
        dict={dict}
        savedCount={savedIds.size}
      />

      <EventDetailSheet
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        dict={dict}
        locale={locale}
        isSaved={selectedEvent ? isSaved(selectedEvent.id) : false}
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
