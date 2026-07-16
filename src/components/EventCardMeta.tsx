import type { ReactNode } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { formatEventDateRange } from "@/lib/format-date";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import { formatEventPlace } from "@/lib/event-location";
import { EventCategoryLinks } from "@/components/EventCategoryLinks";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import type { EventLiveStatus } from "@/lib/event-status";

interface EventCardMetaProps {
  event: Event;
  locale: Locale;
  dict: Dictionary;
  className?: string;
  compact?: boolean;
  liveStatus?: EventLiveStatus | null;
  liveStatusLabel?: string | null;
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

function RecurrencePill({ label, compact }: { label: string; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-950/50 font-bold leading-none text-orange-600 ${
        compact ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      }`}
    >
      {label}
    </span>
  );
}

export function EventCardMeta({
  event,
  locale,
  dict,
  className = "",
  compact = false,
  liveStatus = null,
  liveStatusLabel = null,
}: EventCardMetaProps) {
  const recurrenceLabel = formatRecurrenceLabel(event, locale, dict);
  const dateLabel = formatEventDateRange(event.date, locale, {
    endDate: event.endDate,
    short: true,
  });
  if (compact) {
    return (
      <div className={`space-y-1.5 text-copy-meta font-medium text-neutral-600 dark:text-neutral-400 ${className}`}>
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {dateLabel}
          </span>
          {liveStatusLabel && liveStatus && (
            <EventStatusBadge
              label={liveStatusLabel}
              status={liveStatus}
              className="py-0.5"
            />
          )}
        </span>
        {(event.time || recurrenceLabel) && (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            {event.time && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {event.time}
              </span>
            )}
            {recurrenceLabel && (
              <RecurrencePill label={recurrenceLabel} compact />
            )}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className="inline-flex items-center gap-2 text-copy-meta font-medium text-neutral-800 dark:text-neutral-200">
          <Calendar className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
          {dateLabel}
        </span>
        {liveStatusLabel && liveStatus && (
          <EventStatusBadge label={liveStatusLabel} status={liveStatus} />
        )}
      </div>
      {(event.time || recurrenceLabel) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {event.time && (
            <span className="inline-flex items-center gap-2 text-copy-meta font-medium text-neutral-800 dark:text-neutral-200">
              <Clock className="h-4 w-4 shrink-0 text-neutral-500 dark:text-neutral-400" />
              {event.time}
            </span>
          )}
          {recurrenceLabel && <RecurrencePill label={recurrenceLabel} />}
        </div>
      )}
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
