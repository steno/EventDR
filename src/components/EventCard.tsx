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
import { saveScrollForReturn } from "@/lib/list-scroll-restoration";
import { EventCallLink } from "@/components/EventCallLink";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { resolveLiveStatusDisplay } from "@/lib/event-status-label";

interface EventCardProps {
  event: Event;
  dict: Dictionary;
  locale: Locale;
  returnTo?: string;
  onBeforeNavigate?: () => void;
}

const EventCardComponent = ({
  event,
  dict,
  locale,
  returnTo,
  onBeforeNavigate,
}: EventCardProps) => {
  const category = getCategoryMeta(event.category, dict.categories);
  const emoji = event.imageEmoji ?? category?.emoji ?? "📅";
  const href = eventDetailPath(locale, event.id, returnTo);
  const liveDisplay = resolveLiveStatusDisplay(event, dict);
  const liveStatus = liveDisplay?.status ?? null;
  const liveStatusLabel = liveDisplay?.label ?? null;
  const isEndedToday = liveStatus === "ended";

  return (
    <article
      className={`
        group relative w-full rounded-2xl bg-white dark:bg-neutral-900 px-4 py-[1.125rem]
        border border-neutral-200 dark:border-neutral-800
        shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]
        hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]
        active:scale-[0.99] transition-all duration-200
        ${isEndedToday ? "opacity-60" : ""}
      `}
    >
      <Link
        href={href}
        scroll={false}
        onClick={() => {
          if (onBeforeNavigate) {
            onBeforeNavigate();
          } else {
            saveScrollForReturn(returnTo ?? window.location.pathname);
          }
        }}
        className="flex gap-3.5 text-left"
      >
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
          <div className="flex items-start gap-2.5 mb-2">
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-[1.0625rem] leading-[1.3] line-clamp-2 flex-1">
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

          {event.description ? (
            <p className="text-copy line-clamp-2 mb-3.5">
              {event.description}
            </p>
          ) : null}

          <EventCardMeta event={event} locale={locale} dict={dict} />
        </div>
      </Link>
      {event.phone && (
        <div className="mt-4 pl-[4.875rem]">
          <EventCallLink phone={event.phone} label={dict.detail.call} />
        </div>
      )}
    </article>
  );
};

export const EventCard = memo(EventCardComponent);
