import type { ReactNode } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { formatEventDateRange } from "@/lib/format-date";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import { formatEventPlace } from "@/lib/event-location";
import { EventCategoryLinks } from "@/components/EventCategoryLinks";

interface EventCardMetaProps {
  event: Event;
  locale: Locale;
  dict: Dictionary;
  className?: string;
}

function MetaRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200">
      <span className="mt-px shrink-0 text-neutral-500 dark:text-neutral-400">{icon}</span>
      <span className="min-w-0 truncate leading-snug">{children}</span>
    </div>
  );
}

export function EventCardMeta({ event, locale, dict, className = "" }: EventCardMetaProps) {
  const recurrenceLabel = formatRecurrenceLabel(event, locale, dict);
  const dateLabel = formatEventDateRange(event.date, locale, {
    endDate: event.endDate,
    short: true,
  });

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="inline-flex items-center gap-2 text-copy-meta font-medium text-neutral-800 dark:text-neutral-200">
          <Calendar className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
          {dateLabel}
        </span>
        {event.time && (
          <span className="inline-flex items-center gap-2 text-copy-meta font-medium text-neutral-800 dark:text-neutral-200">
            <Clock className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
            {event.time}
          </span>
        )}
        {recurrenceLabel && (
          <span className="inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-0.5 text-[11px] font-bold leading-none text-orange-600">
            {recurrenceLabel}
          </span>
        )}
      </div>
      <EventCategoryLinks
        event={event}
        locale={locale}
        dict={dict}
        className="relative z-[2] pt-0.5 pointer-events-auto"
        linkable
      />
      <MetaRow icon={<MapPin className="h-4 w-4" />}>{formatEventPlace(event)}</MetaRow>
    </div>
  );
}
