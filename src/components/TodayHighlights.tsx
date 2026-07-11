"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Navigation } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { EventCardMeta } from "@/components/EventCardMeta";
import { getDirectionsUrl } from "@/lib/maps";
import { eventDetailPath } from "@/lib/event-navigation";
import { saveScrollForReturn } from "@/lib/list-scroll-restoration";
import {
  getTodayHighlightEvents,
  HOME_TODAY_LIMIT,
} from "@/lib/home-layout";
import { resolveLiveStatusDisplay } from "@/lib/event-status-label";

interface TodayHighlightsProps {
  events: Event[];
  locale: Locale;
  dict: Dictionary;
  onBeforeNavigate?: () => void;
  limit?: number;
}

const TodayHighlightsComponent = ({
  events,
  locale,
  dict,
  onBeforeNavigate,
  limit = HOME_TODAY_LIMIT,
}: TodayHighlightsProps) => {
  const todayEvents = useMemo(() => getTodayHighlightEvents(events), [events]);
  const visibleEvents = todayEvents.slice(0, limit);
  const hasMore = todayEvents.length > limit;

  if (visibleEvents.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <h2 className="text-xl font-black tracking-tight text-neutral-950 dark:text-neutral-100">
          {dict.events.happeningToday}
        </h2>
        {hasMore && (
          <Link
            href={`/${locale}/when/today`}
            onClick={onBeforeNavigate}
            className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 text-xs font-bold text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-950/70 transition-colors touch-manipulation"
          >
            {dict.events.seeAllToday}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        )}
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {visibleEvents.map((event) => {
          const href = eventDetailPath(locale, event.id, `/${locale}`);
          const display = resolveLiveStatusDisplay(event, dict);
          const status = display?.status ?? "unknown";
          const statusLabel = display?.label ?? null;

          return (
            <article
              key={event.id}
              className="group flex min-w-[86%] snap-start flex-col overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.16)] dark:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)] transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 sm:min-w-[20rem]"
            >
              <Link
                href={href}
                scroll={false}
                onClick={() => {
                  if (onBeforeNavigate) {
                    onBeforeNavigate();
                  } else {
                    saveScrollForReturn(`/${locale}`);
                  }
                }}
                className="flex min-h-0 flex-1 flex-col touch-manipulation active:scale-[0.995] transition-transform"
              >
                {event.imageUrl ? (
                  <div className="relative h-40 w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <EventImage
                      src={event.imageUrl}
                      alt=""
                      sizes="(max-width: 672px) 86vw, 320px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-orange-600/55 via-rose-500/35 to-transparent transition-opacity duration-300 group-hover:opacity-0"
                      aria-hidden
                    />
                  </div>
                ) : (
                  <div className="h-40 w-full shrink-0 bg-neutral-100 dark:bg-neutral-800" aria-hidden />
                )}

                <div className="flex min-h-0 flex-1 flex-col p-5 pb-3">
                  {statusLabel && (
                    <EventStatusBadge
                      label={statusLabel}
                      status={status}
                      className="mb-2 w-fit shrink-0"
                    />
                  )}
                  <h3 className="line-clamp-2 shrink-0 text-[19px] font-black leading-[1.25] tracking-tight text-neutral-950 dark:text-neutral-100">
                    {event.title}
                  </h3>
                  {event.description ? (
                    <p className="mt-3 line-clamp-2 flex-1 text-copy">
                      {event.description}
                    </p>
                  ) : (
                    <div className="mt-3 flex-1" aria-hidden />
                  )}

                  <EventCardMeta
                    event={event}
                    locale={locale}
                    dict={dict}
                    className="mt-auto shrink-0 pt-4"
                  />
                </div>
              </Link>

              <div className="flex shrink-0 justify-end px-5 pb-5 pt-1 min-h-[2.25rem]">
                {event.format !== "digital" && (
                  <a
                    href={getDirectionsUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-neutral-500 dark:text-neutral-400 ring-1 ring-neutral-200/80 dark:ring-neutral-700/80 hover:text-orange-600 hover:ring-orange-200/80 dark:hover:ring-orange-900/50 touch-manipulation transition-colors"
                    aria-label={dict.detail.directions}
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    {dict.detail.directions}
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export const TodayHighlights = memo(TodayHighlightsComponent);
