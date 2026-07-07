import { memo } from "react";
import { MapPin, Calendar, Clock, Globe, Flame, Navigation2 } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import type { Event } from "@/lib/types";
import { getCategoryMeta } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { formatEventDateRange } from "@/lib/format-date";
import { formatDistance } from "@/lib/geo";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import { formatEventPlace } from "@/lib/event-location";

interface EventCardProps {
  event: Event;
  dict: Dictionary;
  locale: Locale;
  onSelect: (event: Event) => void;
}

const EventCardComponent = ({ event, dict, locale, onSelect }: EventCardProps) => {
  const category = getCategoryMeta(event.category, dict.categories);
  const emoji = event.imageEmoji ?? category?.emoji ?? "📅";
  const recurrenceLabel = formatRecurrenceLabel(event, locale, dict);

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className="w-full text-left block"
    >
      <article
        className="
          group relative flex gap-4 rounded-2xl bg-white p-4
          border border-neutral-200
          shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]
          hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]
          active:scale-[0.99] transition-all duration-200
        "
      >
        <div
          className={`
            relative flex-shrink-0 h-16 w-16 overflow-hidden rounded-xl shadow-sm
            ${event.imageUrl ? "bg-neutral-100" : `bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}`}
          `}
          aria-hidden={!event.imageUrl}
        >
          {event.imageUrl ? (
            <EventImage
              src={event.imageUrl}
              alt=""
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
            <h3 className="font-bold text-neutral-900 text-base leading-snug line-clamp-2 flex-1">
              {event.title}
            </h3>
            {event.trending && (
              <span className="flex-shrink-0 inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-600">
                <Flame className="h-3.5 w-3.5" />
                {dict.events.hot}
              </span>
            )}
          </div>

          <p className="text-[13px] text-neutral-600 line-clamp-2 mb-3 leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-neutral-700">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Calendar className="h-4 w-4 text-neutral-500" />
              {formatEventDateRange(event.date, locale, {
                endDate: event.endDate,
                short: true,
              })}
            </span>
            {recurrenceLabel && (
              <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-600">
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
            {event.distanceKm != null && isFinite(event.distanceKm) && (
              <span className="inline-flex items-center gap-1.5 font-bold text-orange-600">
                <Navigation2 className="h-4 w-4" />
                {formatDistance(event.distanceKm, locale)} {dict.events.distanceAway}
              </span>
            )}
          </div>
        </div>
      </article>
    </button>
  );
};

export const EventCard = memo(EventCardComponent);
