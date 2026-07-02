import { MapPin, Calendar, Clock, Globe, Flame, Navigation2 } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import type { Event } from "@/lib/types";
import { getCategoryMeta } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { formatEventDateShort } from "@/lib/format-date";
import { formatDistance } from "@/lib/geo";

interface EventCardProps {
  event: Event;
  dict: Dictionary;
  locale: Locale;
  onSelect: (event: Event) => void;
}

export function EventCard({ event, dict, locale, onSelect }: EventCardProps) {
  const category = getCategoryMeta(event.category, dict.categories);
  const emoji = event.imageEmoji ?? category?.emoji ?? "📅";

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className="w-full text-left block"
    >
      <article
        className="
          group relative flex gap-4 rounded-2xl bg-white p-4
          border border-neutral-100
          shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]
          hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]
          active:scale-[0.99] transition-all duration-200
        "
      >
        <div
          className={`
            relative flex-shrink-0 h-14 w-14 overflow-hidden rounded-xl shadow-sm
            ${event.imageUrl ? "bg-neutral-100" : `bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}`}
          `}
          aria-hidden={!event.imageUrl}
        >
          {event.imageUrl ? (
            <EventImage
              src={event.imageUrl}
              alt=""
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl">
              {emoji}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-bold text-neutral-900 text-[15px] leading-snug line-clamp-2 flex-1">
              {event.title}
            </h3>
            {event.trending && (
              <span className="flex-shrink-0 inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-600">
                <Flame className="h-3 w-3" />
                {dict.events.hot}
              </span>
            )}
          </div>

          <p className="text-sm text-neutral-500 line-clamp-2 mb-3 leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-600">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-neutral-400" />
              {formatEventDateShort(event.date, locale)}
            </span>
            {event.time && (
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                {event.time}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 font-medium">
              <MapPin className="h-3.5 w-3.5 text-neutral-400" />
              {event.venue ? `${event.venue}, ` : ""}
              {event.location}
            </span>
            {event.distanceKm != null && isFinite(event.distanceKm) && (
              <span className="inline-flex items-center gap-1.5 font-medium text-orange-600">
                <Navigation2 className="h-3.5 w-3.5" />
                {formatDistance(event.distanceKm, locale)} {dict.events.distanceAway}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 font-medium text-neutral-400">
              <Globe className="h-3.5 w-3.5" />
              {dict.events.format[event.format]}
            </span>
          </div>
        </div>
      </article>
    </button>
  );
}
