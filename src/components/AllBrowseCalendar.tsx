import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { FilterTimeRange } from "@/lib/filters";
import type { AllBrowseDayGroup } from "@/lib/list-day-groups";
import { formatEventDate } from "@/lib/format-date";
import { CARD_GRID_MIN_TRACK_PX } from "@/lib/card-grid";
import {
  CARD_GRID_CLASS,
  DAY_GROUP_TITLE_CLASS,
} from "@/lib/page-shell";
import { EventCard } from "@/components/EventCard";
import type { EventWithVenueSiblings } from "@/lib/venue-recurring-siblings";

type BrowseEvent = EventWithVenueSiblings;

interface AllBrowseCalendarProps {
  days: AllBrowseDayGroup<BrowseEvent>[];
  recurring: BrowseEvent[];
  dict: Dictionary;
  locale: Locale;
  returnTo?: string;
  returnTitle?: string | null;
  listTimeRange: FilterTimeRange;
  pendingId: string | null;
  onNavigate: (id: string) => void;
  showEnlarge: boolean;
  weeklyHeading: string;
  /** Trailing tiles under Weekly & daily (More, pads, end teaser). */
  weeklyTrailing?: ReactNode;
}

/**
 * Desktop All-tab calendar strip: one column per dated day, then Weekly & daily.
 * Parent mounts this only at `xl+` — mobile keeps stacked day headings.
 */
export function AllBrowseCalendar({
  days,
  recurring,
  dict,
  locale,
  returnTo,
  returnTitle,
  listTimeRange,
  pendingId,
  onNavigate,
  showEnlarge,
  weeklyHeading,
  weeklyTrailing,
}: AllBrowseCalendarProps) {
  return (
    <div>
      {days.length > 0 ? (
        <div
          className="flex gap-2.5 overflow-x-auto pb-0.5 scrollbar-hide"
          role="list"
          aria-label={dict.time.all}
        >
          {days.map((day) => (
            <section
              key={day.date}
              role="listitem"
              className="flex min-w-0 shrink-0 flex-col gap-2.5"
              style={{
                flex: `1 0 ${CARD_GRID_MIN_TRACK_PX}px`,
                minWidth: CARD_GRID_MIN_TRACK_PX,
                maxWidth: 220,
              }}
            >
              <h2 className="pt-2">
                <span
                  className={`inline-block font-sans ${DAY_GROUP_TITLE_CLASS}`}
                >
                  {formatEventDate(day.date, locale)}
                </span>
              </h2>
              <div className="flex flex-col gap-2.5">
                {day.events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    dict={dict}
                    locale={locale}
                    returnTo={returnTo}
                    returnTitle={returnTitle}
                    listTimeRange={listTimeRange}
                    view="cards"
                    pending={pendingId === event.id}
                    dimmed={pendingId != null && pendingId !== event.id}
                    onNavigate={() => onNavigate(event.id)}
                    showEnlarge={showEnlarge}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}

      {recurring.length > 0 || weeklyTrailing ? (
        <div className={days.length > 0 ? "mt-3" : undefined}>
          {recurring.length > 0 ? (
            <h2 className="pt-2">
              <span
                className={`inline-block font-sans ${DAY_GROUP_TITLE_CLASS}`}
              >
                {weeklyHeading}
              </span>
            </h2>
          ) : null}
          <div className={`mt-2 ${CARD_GRID_CLASS}`}>
            {recurring.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                dict={dict}
                locale={locale}
                returnTo={returnTo}
                returnTitle={returnTitle}
                listTimeRange={listTimeRange}
                view="cards"
                pending={pendingId === event.id}
                dimmed={pendingId != null && pendingId !== event.id}
                onNavigate={() => onNavigate(event.id)}
                showEnlarge={showEnlarge}
              />
            ))}
            {weeklyTrailing}
          </div>
        </div>
      ) : null}
    </div>
  );
}
