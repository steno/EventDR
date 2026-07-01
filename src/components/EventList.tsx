"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import type { Event, EventCategory } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { EventCard } from "./EventCard";

interface EventListProps {
  category?: EventCategory | null;
  locale: Locale;
  dict: Dictionary;
}

export function EventList({ category, locale, dict }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState<string>("");

  const fetchEvents = useCallback(
    async (refresh = false) => {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams();
        params.set("locale", locale);
        if (category) params.set("category", category);
        if (refresh) params.set("refresh", "true");

        const res = await fetch(`/api/events?${params}`);
        const data = (await res.json()) as {
          events: Event[];
          source: string;
        };
        setEvents(data.events ?? []);
        setSource(data.source ?? "");
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category, locale],
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const sourceLabel =
    source === "live"
      ? dict.events.sourceLive
      : source === "cache"
        ? dict.events.sourceCache
        : dict.events.sourceFallback;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-300" />
        <p className="text-sm text-neutral-400 font-medium">
          {dict.events.loading}
        </p>
      </div>
    );
  }

  const trending = events.filter((e) => e.trending);
  const rest = events.filter((e) => !e.trending);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight">
            {category ? dict.events.filtered : dict.events.trending}
          </h2>
          {source && (
            <p className="text-xs text-neutral-400 mt-0.5">{sourceLabel}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => fetchEvents(true)}
          disabled={refreshing}
          className="
            flex h-9 w-9 items-center justify-center rounded-full
            bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800
            transition-colors disabled:opacity-50
          "
          aria-label={dict.events.refresh}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 font-medium">{dict.events.empty}</p>
          <p className="text-sm text-neutral-400 mt-1">{dict.events.emptyHint}</p>
        </div>
      ) : (
        <>
          {trending.length > 0 && !category && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">
                {dict.events.mostPopular}
              </h3>
              <div className="space-y-3">
                {trending.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    dict={dict}
                    locale={locale}
                  />
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section>
              {!category && trending.length > 0 && (
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
                  {dict.events.moreEvents}
                </h3>
              )}
              <div className="space-y-3">
                {(category || trending.length === 0 ? events : rest).map(
                  (event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      dict={dict}
                      locale={locale}
                    />
                  ),
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
