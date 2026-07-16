import { memo } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { EventCardMeta } from "@/components/EventCardMeta";
import type { Event } from "@/lib/types";
import { getCategoryMeta } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { eventDetailPath } from "@/lib/event-navigation";
import { EventCallLink } from "@/components/EventCallLink";
import { useLiveStatusDisplay } from "@/hooks/useLiveStatusDisplay";
import type { TimeRange } from "@/lib/filters";
import type { EventListView } from "@/lib/event-list-view";

interface EventCardProps {
  event: Event;
  dict: Dictionary;
  locale: Locale;
  returnTo?: string;
  compact?: boolean;
  listTimeRange?: TimeRange;
  /** List = horizontal row; cards = image-forward grid tile. */
  view?: EventListView;
}

const EventCardComponent = ({
  event,
  dict,
  locale,
  returnTo,
  compact = true,
  listTimeRange,
  view = "list",
}: EventCardProps) => {
  const category = getCategoryMeta(event.category, dict.categories);
  const emoji = event.imageEmoji ?? category?.emoji ?? "📅";
  const href = eventDetailPath(locale, event.id, returnTo);
  const liveDisplay = useLiveStatusDisplay(event, dict, { listTimeRange });
  const liveStatus = liveDisplay?.status ?? null;
  const liveStatusLabel = liveDisplay?.label ?? null;
  const isEndedToday = liveStatus === "ended";
  const isCards = view === "cards";

  if (isCards) {
    return (
      <article
        className={`
          group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl
          bg-white dark:bg-neutral-900
          border border-neutral-200 dark:border-neutral-800
          shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]
          hover:border-orange-300 hover:shadow-[0_8px_24px_-8px_rgba(251,146,60,0.25)]
          dark:hover:border-orange-800 dark:hover:shadow-[0_8px_24px_-8px_rgba(251,146,60,0.3)]
          active:scale-[0.99] transition-all duration-200 cursor-pointer
          ${isEndedToday ? "opacity-60" : ""}
        `}
      >
        <Link
          href={href}
          className="absolute inset-0 z-0 rounded-2xl touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          aria-label={event.title}
        />
        <div
          className={`
            relative aspect-[4/3] w-full overflow-hidden
            ${event.imageUrl ? "bg-neutral-100 dark:bg-neutral-800" : `bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}`}
          `}
          aria-hidden={!event.imageUrl}
        >
          {event.imageUrl ? (
            <EventImage
              src={event.imageUrl}
              alt={event.title}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">
              {emoji}
            </div>
          )}
        </div>
        <div className="relative z-[1] flex flex-1 flex-col gap-1.5 p-3 pointer-events-none">
          <div className="flex items-start gap-1.5">
            <h3 className="min-w-0 flex-1 line-clamp-2 text-[15px] font-bold leading-snug text-neutral-900 dark:text-neutral-100">
              {event.title}
            </h3>
            {event.trending && !liveStatusLabel && (
              <span className="flex-shrink-0 inline-flex items-center gap-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-600">
                <Flame className="h-3 w-3" />
                {dict.events.hot}
              </span>
            )}
          </div>
          <EventCardMeta
            event={event}
            locale={locale}
            dict={dict}
            compact
            liveStatus={liveStatus}
            liveStatusLabel={liveStatusLabel}
          />
        </div>
      </article>
    );
  }

  return (
    <article
      className={`
        group relative w-full rounded-2xl bg-white dark:bg-neutral-900 px-4 py-[1.125rem]
        border border-neutral-200 dark:border-neutral-800
        shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]
        hover:border-orange-300 hover:shadow-[0_8px_24px_-8px_rgba(251,146,60,0.25)] 
        dark:hover:border-orange-800 dark:hover:shadow-[0_8px_24px_-8px_rgba(251,146,60,0.3)]
        active:scale-[0.99] transition-all duration-200
        cursor-pointer
        ${isEndedToday ? "opacity-60" : ""}
      `}
    >
      <Link
        href={href}
        className="absolute inset-0 z-0 rounded-2xl touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        aria-label={event.title}
      />
      <div className="relative z-[1] flex gap-3.5 text-left pointer-events-none">
        <div
          className={`
            relative flex-shrink-0 self-start h-[4.25rem] w-[4.25rem] overflow-hidden rounded-xl shadow-sm
            ${event.imageUrl ? "bg-neutral-100 dark:bg-neutral-800" : `bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}`}
          `}
          aria-hidden={!event.imageUrl}
        >
          {event.imageUrl ? (
            <EventImage
              src={event.imageUrl}
              alt={event.title}
              sizes="68px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[28px]">
              {emoji}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className={`flex items-start gap-2.5 ${compact ? "mb-1.5" : "mb-2"}`}>
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-[1.0625rem] leading-[1.3] line-clamp-3 sm:line-clamp-2 flex-1">
              {event.title}
            </h3>
            {event.trending && !liveStatusLabel && (
              <span className="flex-shrink-0 inline-flex items-center gap-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-orange-600">
                <Flame className="h-3.5 w-3.5" />
                {dict.events.hot}
              </span>
            )}
          </div>

          {!compact && event.description ? (
            <p className="text-copy line-clamp-2 mb-3.5">
              {event.description}
            </p>
          ) : null}

          <EventCardMeta
            event={event}
            locale={locale}
            dict={dict}
            compact={compact}
            liveStatus={liveStatus}
            liveStatusLabel={liveStatusLabel}
          />
        </div>
      </div>
      {!compact && event.phone && (
        <div className="relative z-[2] mt-4 pl-[4.875rem] pointer-events-auto">
          <EventCallLink phone={event.phone} label={dict.detail.call} />
        </div>
      )}
    </article>
  );
};

export const EventCard = memo(EventCardComponent);
