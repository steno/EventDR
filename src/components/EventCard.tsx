import { memo } from "react";
import Link from "next/link";
import { MapPin, Calendar, Clock, Flame } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import type { Event } from "@/lib/types";
import { getCategoryMeta } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { formatEventDateRange } from "@/lib/format-date";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import { formatEventPlace } from "@/lib/event-location";
import { eventDetailPath } from "@/lib/event-navigation";
import { EventCallLink } from "@/components/EventCallLink";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { getEventLiveStatus, happensOnLocalDate } from "@/lib/event-status";
import { getEventLiveStatusLabel } from "@/lib/event-status-label";

interface EventCardProps {
  event: Event;
  dict: Dictionary;
  locale: Locale;
  returnTo?: string;
}

const EventCardComponent = ({ event, dict, locale, returnTo }: EventCardProps) => {
  const category = getCategoryMeta(event.category, dict.categories);
  const emoji = event.imageEmoji ?? category?.emoji ?? "📅";
  const recurrenceLabel = formatRecurrenceLabel(event, locale, dict);
  const href = eventDetailPath(locale, event.id, returnTo);
  const liveStatus = happensOnLocalDate(event) ? getEventLiveStatus(event) : null;
  const liveStatusLabel =
    liveStatus && liveStatus !== "unknown"
      ? getEventLiveStatusLabel(event, dict)
      : null;
  const isEndedToday = liveStatus === "ended";

  return (
    <article
      className={`
        group relative w-full rounded-2xl bg-white dark:bg-neutral-900 p-4
        border border-neutral-200 dark:border-neutral-800
        shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]
        hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]
        active:scale-[0.99] transition-all duration-200
        ${isEndedToday ? "opacity-60" : ""}
      `}
    >
      <Link href={href} className="flex gap-4 text-left">
        <div
          className={`
            relative flex-shrink-0 h-16 w-16 overflow-hidden rounded-xl shadow-sm
            ${event.imageUrl ? "bg-neutral-100 dark:bg-neutral-800" : `bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}`}
          `}
          aria-hidden={!event.imageUrl}
        >
          {event.imageUrl ? (
            <EventImage
              src={event.imageUrl}
              alt={event.title}
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[28px]">
              {emoji}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1.5">
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-base leading-snug line-clamp-2 flex-1">
              {event.title}
            </h3>
            {liveStatusLabel && liveStatus && (
              <EventStatusBadge
                label={liveStatusLabel}
                status={liveStatus}
                className="flex-shrink-0"
              />
            )}
            {event.trending && !liveStatusLabel && (
              <span className="flex-shrink-0 inline-flex items-center gap-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-600">
                <Flame className="h-3.5 w-3.5" />
                {dict.events.hot}
              </span>
            )}
          </div>

          <p className="text-[13px] text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-neutral-700 dark:text-neutral-300">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Calendar className="h-4 w-4 text-neutral-500" />
              {formatEventDateRange(event.date, locale, {
                endDate: event.endDate,
                short: true,
              })}
            </span>
            {recurrenceLabel && (
              <span className="inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-0.5 text-[11px] font-bold text-orange-600">
                {recurrenceLabel}
              </span>
            )}
            {event.time && (
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Clock className="h-4 w-4 text-neutral-500" />
                {event.time}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <MapPin className="h-4 w-4 text-neutral-500" />
              {formatEventPlace(event)}
            </span>
          </div>
        </div>
      </Link>
      {event.phone && (
        <div className="mt-3 pl-20">
          <EventCallLink phone={event.phone} label={dict.detail.call} />
        </div>
      )}
    </article>
  );
};

export const EventCard = memo(EventCardComponent);
