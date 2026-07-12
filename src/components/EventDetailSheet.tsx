"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Navigation,
  CalendarPlus,
  Share2,
  Heart,
  Building2,
  Mic2,
  Phone,
  Users,
} from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getCategoryMeta } from "@/lib/categories";
import { formatEventDateRange } from "@/lib/format-date";
import { getDirectionsUrl } from "@/lib/maps";
import { ShareMenu } from "@/components/ShareMenu";
import { CalendarMenu } from "@/components/CalendarMenu";
import { matchVenueSlug } from "@/lib/venues-seed";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import { EventCategoryLinks } from "@/components/EventCategoryLinks";
import { useLiveStatusDisplay } from "@/hooks/useLiveStatusDisplay";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { EventImage } from "@/components/EventImage";
import { EventDetailMedia, hasEventDetailHero } from "@/components/EventDetailMedia";
import { resolveEventCoords } from "@/lib/event-coords";
import { formatEventPlace } from "@/lib/event-location";
import { EventCallLink } from "@/components/EventCallLink";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";
import { clearListScroll } from "@/lib/list-scroll-restoration";

interface EventDetailSheetProps {
  event: Event | null;
  onClose: () => void;
  dict: Dictionary;
  locale: Locale;
  isSaved: boolean;
  onToggleSave: (event: Pick<Event, "id" | "title">) => void;
  /** Clears stale home scroll/tab state when sharing externally. */
  returnTo?: string | null;
  /** Pre-formatted on the server so SSR matches hydration (Node vs browser Intl). */
  formattedDateRange?: string;
  recurrenceLabel?: string | null;
  /** Use h1 when this sheet is the primary page content (dedicated event route). */
  standalone?: boolean;
}

export function EventDetailSheet({
  event,
  onClose,
  dict,
  locale,
  isSaved,
  onToggleSave,
  returnTo,
  formattedDateRange,
  recurrenceLabel: recurrenceLabelProp,
  standalone = false,
}: EventDetailSheetProps) {
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!event || standalone) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous || "";
    };
  }, [event, standalone]);

  const {
    sheetRef,
    sheetStyle,
    dragZoneProps,
    dismiss: dismissSheet,
    backdropOpacity,
    swipeEnabled,
  } = useSwipeToDismiss(
    onClose,
    !standalone && Boolean(event) && !shareOpen && !calendarOpen,
  );

  const requestClose = useCallback(() => {
    if (swipeEnabled) {
      dismissSheet();
      return;
    }
    onClose();
  }, [dismissSheet, onClose, swipeEnabled]);

  if (!event) return null;

  const category = getCategoryMeta(event.category, dict.categories);
  const emoji = event.imageEmoji ?? category?.emoji ?? "📅";
  const dateLabel =
    formattedDateRange ??
    formatEventDateRange(event.date, locale, { endDate: event.endDate });
  const recurrenceLabel =
    recurrenceLabelProp !== undefined
      ? recurrenceLabelProp
      : formatRecurrenceLabel(event, locale, dict);
  const venueSlug =
    event.venueSlug ?? matchVenueSlug(event.venue) ?? matchVenueSlug(event.location);
  const liveDisplay = useLiveStatusDisplay(event, dict);
  const liveStatus = liveDisplay?.status ?? null;
  const liveStatusLabel = liveDisplay?.label ?? null;
  const TitleTag = standalone ? "h1" : "h2";
  const showHero = hasEventDetailHero(event);
  const hasMapCoords = resolveEventCoords(event) != null;
  const isPhysical = event.format !== "digital";
  const showBottomDirections = isPhysical && !hasMapCoords;

  const secondaryActionClass =
    "flex items-center justify-center gap-2 rounded-full bg-white dark:bg-neutral-800 py-3.5 text-[15px] font-bold text-neutral-500 dark:text-neutral-400 shadow-sm ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 touch-manipulation transition-all hover:text-neutral-800 dark:hover:text-neutral-200 active:scale-[0.98]";

  function handleShareFeedback(message: string, durationMs = 5000) {
    setShareMsg(message);
    setTimeout(() => setShareMsg(null), durationMs);
  }

  function handleViewVenue() {
    if (!venueSlug) return;
    const venuePath = `/${locale}/venue/${venueSlug}`;
    clearListScroll(venuePath);
    router.push(`${venuePath}?from=event`);
  }

  const contentSection = (
    <>
      {event.communitySubmitted && (
        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 dark:bg-violet-950/50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400 mb-3">
          <Users className="h-3.5 w-3.5" />
          {dict.detail.community}
        </span>
      )}

      <TitleTag className="text-2xl font-black text-neutral-900 dark:text-neutral-100 leading-tight tracking-tight">
        {event.title}
      </TitleTag>

      <p className="mt-4 text-copy">{event.description}</p>

      <EventCategoryLinks
        event={event}
        locale={locale}
        dict={dict}
        className="mt-4"
      />

      {event.lineup && event.lineup.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-neutral-500 mb-2">
            <Mic2 className="h-4 w-4 flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wide">
              {dict.detail.lineup}
            </span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {event.lineup.map((name) => (
              <li
                key={name}
                className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-copy font-medium text-neutral-800 dark:text-neutral-200"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 space-y-3.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="inline-flex items-center gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200">
            <Calendar className="h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 dark:text-neutral-400" />
            <span className="font-medium" suppressHydrationWarning>
              {dateLabel}
            </span>
          </div>
          {liveStatusLabel && liveStatus && (
            <EventStatusBadge label={liveStatusLabel} status={liveStatus} />
          )}
          {recurrenceLabel && (
            <span className="inline-flex shrink-0 rounded-full bg-orange-50 dark:bg-orange-950/50 px-2.5 py-0.5 text-[11px] font-bold leading-none text-orange-600">
              {recurrenceLabel}
            </span>
          )}
        </div>
        {event.time && (
          <div className="flex items-center gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200">
            <Clock className="h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 dark:text-neutral-400" />
            <span className="font-medium">{event.time}</span>
          </div>
        )}
        {isPhysical ? (
          <a
            href={getDirectionsUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="group/place flex items-start gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200 touch-manipulation"
          >
            <MapPin className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 transition-colors group-hover/place:text-orange-600 dark:text-neutral-400" />
            <span className="min-w-0 font-medium leading-snug transition-colors group-hover/place:text-orange-600">
              {formatEventPlace(event)}
            </span>
          </a>
        ) : (
          <div className="flex items-start gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200">
            <MapPin className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 dark:text-neutral-400" />
            <span className="min-w-0 font-medium leading-snug">
              {formatEventPlace(event)}
            </span>
          </div>
        )}
        {event.phone && (
          <div className="group/phone flex items-center gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200">
            <Phone className="h-[1.125rem] w-[1.125rem] shrink-0 text-emerald-600 dark:text-emerald-400 group-hover/phone:text-neutral-500 transition-colors" />
            <EventCallLink
              phone={event.phone}
              label={dict.detail.call}
              variant="row"
            />
          </div>
        )}
        {venueSlug && (
          <button
            type="button"
            onClick={handleViewVenue}
            className="flex w-full items-center gap-2.5 text-left touch-manipulation group py-0.5"
          >
            <Building2 className="h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 dark:text-neutral-400" />
            <span className="text-copy-meta font-medium text-orange-600 group-hover:text-orange-700 group-active:text-orange-800 transition-colors">
              {dict.detail.viewVenue}
            </span>
          </button>
        )}
      </div>
    </>
  );

  const actionsSection = (
    <div className="border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      {calendarOpen && (
        <CalendarMenu
          event={event}
          dict={dict}
          onClose={() => setCalendarOpen(false)}
        />
      )}
      {shareOpen && (
        <ShareMenu
          event={event}
          locale={locale}
          dict={dict}
          onClose={() => setShareOpen(false)}
          onFeedback={handleShareFeedback}
          returnTo={returnTo}
        />
      )}
      <div className={`grid gap-3 ${showBottomDirections ? "grid-cols-2" : "grid-cols-3"}`}>
        {showBottomDirections && (
          <a
            href={getDirectionsUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryActionClass}
          >
            <Navigation className="h-5 w-5" />
            {dict.detail.directions}
          </a>
        )}
        <button
          type="button"
          onClick={() => {
            setShareOpen(false);
            setCalendarOpen((open) => !open);
          }}
          className={`flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold touch-manipulation transition-all active:scale-[0.98] ${
            calendarOpen
              ? "bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 text-white shadow-sm"
              : "bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 shadow-sm ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 hover:text-neutral-800 dark:hover:text-neutral-200"
          }`}
        >
          <CalendarPlus className="h-5 w-5" />
          {dict.detail.calendar}
        </button>
        <button
          type="button"
          onClick={() => {
            setCalendarOpen(false);
            setShareOpen((open) => !open);
          }}
          className={`flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold touch-manipulation transition-all active:scale-[0.98] ${
            shareOpen || shareMsg
              ? "bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 text-white shadow-sm"
              : "bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 shadow-sm ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 hover:text-neutral-800 dark:hover:text-neutral-200"
          }`}
        >
          <Share2 className="h-5 w-5" />
          {shareMsg ?? dict.detail.share}
        </button>
        <button
          type="button"
          onClick={() => onToggleSave(event)}
          className={`flex items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-bold touch-manipulation transition-all active:scale-[0.98] ${
            isSaved
              ? "bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 text-white shadow-sm"
              : "bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 shadow-sm ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 hover:text-neutral-800 dark:hover:text-neutral-200"
          }`}
        >
          <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
          {isSaved ? dict.detail.saved : dict.detail.save}
        </button>
      </div>
    </div>
  );

  const emojiFallback = (
    <div className="flex items-start px-5 pt-5">
      <div
        className={`
          flex h-14 w-14 items-center justify-center rounded-2xl
          bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}
          text-2xl shadow-sm
        `}
      >
        {emoji}
      </div>
    </div>
  );

  if (standalone) {
    return (
      <article className="mx-auto w-full max-w-lg sm:max-w-2xl rounded-t-3xl bg-white dark:bg-neutral-900 shadow-2xl ring-1 ring-neutral-200/70 dark:ring-neutral-800">
        {showHero ? (
          <EventDetailMedia
            event={event}
            dict={dict}
            emoji={emoji}
            gradient={category?.gradient}
            variant="standalone"
            priority
          />
        ) : (
          emojiFallback
        )}
        <div className="px-5 pt-4 pb-3">{contentSection}</div>
        {actionsSection}
      </article>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {event.imageUrl && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <EventImage
            src={event.imageUrl}
            alt=""
            sizes="100vw"
            priority
            className="object-cover object-center scale-110 blur-xl opacity-70"
          />
        </div>
      )}
      <button
        type="button"
        className={
          event.imageUrl
            ? "absolute inset-0 bg-black/25"
            : "absolute inset-0 bg-black/40 backdrop-blur-sm"
        }
        style={
          swipeEnabled
            ? { opacity: event.imageUrl ? 0.25 * backdropOpacity : 0.4 * backdropOpacity }
            : undefined
        }
        onClick={requestClose}
        aria-label={dict.detail.close}
      />
      <div
        ref={sheetRef}
        style={sheetStyle}
        className="
          relative z-10 flex w-full max-w-lg sm:max-w-2xl flex-col
          max-h-[92dvh] overflow-hidden
          bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl
          pb-[env(safe-area-inset-bottom)]
          animate-in slide-in-from-bottom duration-300
        "
      >
        <div className="shrink-0">
          {swipeEnabled && (
            <div
              {...dragZoneProps}
              className="flex justify-center touch-none cursor-grab active:cursor-grabbing pt-2.5 pb-1"
              aria-hidden
            >
              <div className="h-1 w-10 rounded-full bg-neutral-300/90 dark:bg-neutral-600/90" />
            </div>
          )}
          {showHero ? (
            <EventDetailMedia
              event={event}
              dict={dict}
              emoji={emoji}
              gradient={category?.gradient}
              variant="sheet"
              onClose={requestClose}
              priority
            />
          ) : (
            <div className="flex shrink-0 items-start justify-between px-4 pt-4 pb-2">
              <div
                className={`
                  flex h-14 w-14 items-center justify-center rounded-2xl
                  bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}
                  text-2xl shadow-sm
                `}
              >
                {emoji}
              </div>
              <button
                type="button"
                onClick={requestClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
                aria-label={dict.detail.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y px-5 pt-4 pb-3">
          {contentSection}
        </div>

        <div className="shrink-0">{actionsSection}</div>
      </div>
    </div>
  );
}
