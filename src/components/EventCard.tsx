import { MapPin, Calendar, Clock, Globe, Flame } from "lucide-react";
import type { Event } from "@/lib/types";
import { getCategoryMeta } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

interface EventCardProps {
  event: Event;
  dict: Dictionary;
  locale: Locale;
}

function formatDate(dateStr: string, locale: Locale): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString(locale === "es" ? "es-DO" : "en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  } catch {
    /* keep original */
  }
  return dateStr;
}

export function EventCard({ event, dict, locale }: EventCardProps) {
  const category = getCategoryMeta(event.category, dict.categories);
  const emoji = event.imageEmoji ?? category?.emoji ?? "📅";

  const content = (
    <article
      className="
        group relative flex gap-4 rounded-2xl bg-white p-4
        border border-neutral-100
        shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]
        hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]
        transition-shadow duration-200
      "
    >
      <div
        className={`
          flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl
          bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}
          text-2xl shadow-sm
        `}
        aria-hidden
      >
        {emoji}
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
            {formatDate(event.date, locale)}
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
          <span className="inline-flex items-center gap-1.5 font-medium text-neutral-400">
            <Globe className="h-3.5 w-3.5" />
            {dict.events.format[event.format]}
          </span>
        </div>
      </div>
    </article>
  );

  if (event.sourceUrl) {
    return (
      <a
        href={event.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}
