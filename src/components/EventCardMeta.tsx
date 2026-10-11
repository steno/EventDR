import type { ReactNode } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { formatEventDateRange } from "@/lib/format-date";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import { formatEventTimeForList } from "@/lib/event-time-display";
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
  /** Tighter gaps + line-height (map pin sheet on short viewports). */
  dense?: boolean;
  liveStatus?: EventLiveStatus | null;
  liveStatusLabel?: string | null;
}

function MetaRow({
  icon,
  children,
  dense = false,
}: {
  icon: ReactNode;
  children: ReactNode;
  dense?: boolean;
}) {
  return (
    <div
      className={`flex items-start text-copy-meta text-neutral-800 dark:text-neutral-200 ${
        dense ? "gap-2" : "gap-2.5"
      }`}
    >
      <span className="mt-px shrink-0 text-neutral-500 dark:text-neutral-400">{icon}</span>
      <span
        className={`min-w-0 truncate ${dense ? "leading-tight" : "leading-snug"}`}
      >
        {children}
      </span>
    </div>
  );
}

function RecurrencePill({ label, compact }: { label: string; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-neutral-100 dark:bg-neutral-800 font-bold leading-none text-neutral-700 dark:text-neutral-200 ${
        compact ? "px-2 py-1 text-xs" : "px-2.5 py-1 text-sm"
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
  dense = false,
  liveStatus = null,
  liveStatusLabel = null,
}: EventCardMetaProps) {
  const recurrenceLabel = formatRecurrenceLabel(event, locale, dict);
  // A temporary closure overrides the live/ended badge so guests aren't told an
  // event is "Happening now" while the venue is shut.
  const badgeStatus: EventLiveStatus | null = event.temporarilyClosed
    ? "temporarilyClosed"
    : event.soldOut
      ? "soldOut"
      : liveStatus;
  const badgeLabel = event.temporarilyClosed
    ? dict.events.temporarilyClosed
    : event.soldOut
      ? dict.events.soldOut
      : liveStatusLabel;
  const dateLabel = formatEventDateRange(event.date, locale, {
    endDate: event.endDate,
    short: true,
  });
  const timeLabel = formatEventTimeForList(event.time, {
    recurrence: event.recurrence,
    allDayLabel: dict.events.allDay,
  });
  if (compact) {
    return (
      <div
        className={`${dense ? "space-y-1" : "space-y-1.5"} text-sm font-medium ${
          dense ? "leading-tight" : "leading-snug"
        } text-neutral-600 dark:text-neutral-300 ${className}`}
      >
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {dateLabel}
          </span>
          {badgeLabel && badgeStatus && (
            <EventStatusBadge label={badgeLabel} status={badgeStatus} />
          )}
        </span>
        {(timeLabel.display || recurrenceLabel) && (
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            {timeLabel.display && (
              <span
                className="inline-flex shrink-0 items-center gap-1.5 tabular-nums"
                title={
                  timeLabel.full !== timeLabel.display ? timeLabel.full : undefined
                }
              >
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="whitespace-nowrap">{timeLabel.display}</span>
              </span>
            )}
            {recurrenceLabel && (
              <RecurrencePill label={recurrenceLabel} compact />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${dense ? "space-y-1.5" : "space-y-2"} ${
        dense ? "leading-tight" : ""
      } ${className}`}
    >
      <div
        className={`flex flex-wrap items-center ${
          dense ? "gap-x-2.5 gap-y-1" : "gap-x-3 gap-y-1.5"
        }`}
      >
        <span
          className={`inline-flex items-center gap-2 text-copy-meta font-medium text-neutral-800 dark:text-neutral-200 ${
            dense ? "leading-tight" : ""
          }`}
        >
          <Calendar
            className={`${dense ? "h-3.5 w-3.5" : "h-4 w-4"} shrink-0 text-neutral-500 dark:text-neutral-400`}
            aria-hidden
          />
          {dateLabel}
        </span>
        {badgeLabel && badgeStatus && (
          <EventStatusBadge label={badgeLabel} status={badgeStatus} />
        )}
      </div>
      {(timeLabel.display || recurrenceLabel) && (
        <div
          className={`flex flex-wrap items-center ${
            dense ? "gap-x-2.5 gap-y-1" : "gap-x-3 gap-y-1.5"
          }`}
        >
          {timeLabel.display && (
            <MetaRow
              dense={dense}
              icon={<Clock className={dense ? "h-3.5 w-3.5" : "h-4 w-4"} />}
            >
              <span title={timeLabel.full !== timeLabel.display ? timeLabel.full : undefined}>
                {timeLabel.display}
              </span>
            </MetaRow>
          )}
          {recurrenceLabel && <RecurrencePill label={recurrenceLabel} compact={dense} />}
        </div>
      )}
      <EventCategoryLinks
        event={event}
        locale={locale}
        dict={dict}
        className={`relative z-[2] pointer-events-auto ${dense ? "pt-0" : "pt-0.5"}`}
        linkable
      />
      <MetaRow
        dense={dense}
        icon={<MapPin className={dense ? "h-3.5 w-3.5" : "h-4 w-4"} />}
      >
        {formatEventPlace(event)}
      </MetaRow>
    </div>
  );
}
