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
  ExternalLink,
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
import { addToCalendar } from "@/lib/calendar";
import { ShareMenu } from "@/components/ShareMenu";
import { matchVenueSlug } from "@/lib/venues-seed";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import { useLiveStatusDisplay } from "@/hooks/useLiveStatusDisplay";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { EventImage } from "@/components/EventImage";
import { formatEventPlace } from "@/lib/event-location";
import { EventCallLink } from "@/components/EventCallLink";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";

interface EventDetailSheetProps {
  event: Event | null;
  onClose: () => void;
  dict: Dictionary;
  locale: Locale;
  isSaved: boolean;
  onToggleSave: (event: Pick<Event, "id" | "title">) => void;
  /** Clears stale home scroll/tab state when sharing externally. */
  returnTo?: string | null;
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
  standalone = false,
}: EventDetailSheetProps) {
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!event) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [event]);

  const {
    sheetRef,
    sheetStyle,
    dragZoneProps,
    dismiss: dismissSheet,
    backdropOpacity,
    swipeEnabled,
  } = useSwipeToDismiss(onClose, Boolean(event) && !shareOpen);

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
  const recurrenceLabel = formatRecurrenceLabel(event, locale, dict);
  const venueSlug =
    event.venueSlug ?? matchVenueSlug(event.venue) ?? matchVenueSlug(event.location);
  const liveDisplay = useLiveStatusDisplay(event, dict);
  const liveStatus = liveDisplay?.status ?? null;
  const liveStatusLabel = liveDisplay?.label ?? null;
  const TitleTag = standalone ? "h1" : "h2";

  function handleShareFeedback(message: string, durationMs = 5000) {
    setShareMsg(message);
    setTimeout(() => setShareMsg(null), durationMs);
  }

  function handleViewVenue() {
    if (!venueSlug) return;
    requestClose();
    router.push(`/${locale}/venue/${venueSlug}`);
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
        <div
          {...(swipeEnabled ? dragZoneProps : {})}
          className={
            swipeEnabled
              ? "shrink-0 touch-none cursor-grab active:cursor-grabbing"
              : "shrink-0"
          }
        >
          {swipeEnabled && (
            <div className="flex justify-center pt-2.5 pb-1" aria-hidden>
              <div className="h-1 w-10 rounded-full bg-neutral-300/90 dark:bg-neutral-600/90" />
            </div>
          )}
        {event.imageUrl ? (
          <div className="relative h-[min(32dvh,13rem)] w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <EventImage
              src={event.imageUrl}
              alt={event.title}
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover object-center"
              priority
            />
            <button
              type="button"
              onClick={requestClose}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-sm"
              aria-label={dict.detail.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
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

        <div className="min-h-0 flex-1 px-5 pt-4 pb-3 overflow-hidden">
          {event.communitySubmitted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 dark:bg-violet-950/50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400 mb-3">
              <Users className="h-3.5 w-3.5" />
              {dict.detail.community}
            </span>
          )}

          <TitleTag className="text-2xl font-black text-neutral-900 dark:text-neutral-100 leading-tight tracking-tight line-clamp-2">
            {event.title}
          </TitleTag>

          <p className="mt-4 text-copy line-clamp-3">
            {event.description}
          </p>

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
                <span className="font-medium">
                  {formatEventDateRange(event.date, locale, { endDate: event.endDate })}
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
            <div className="flex items-start gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200">
              <MapPin className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 dark:text-neutral-400" />
              <span className="min-w-0 font-medium leading-snug">
                {formatEventPlace(event)}
              </span>
            </div>
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
            {event.sourceUrl && (
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 touch-manipulation group py-0.5"
              >
                <ExternalLink className="h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 dark:text-neutral-400" />
                <span className="text-copy-meta font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-neutral-100 transition-colors">
                  {dict.detail.source}
                </span>
              </a>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 pt-4 pb-4">
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
          <div className="grid grid-cols-2 gap-3">
            {event.format !== "digital" && (
              <a
                href={getDirectionsUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 py-3.5 text-[15px] font-bold text-white shadow-[0_14px_30px_-14px_rgba(244,63,94,0.8)] touch-manipulation transition-transform active:scale-[0.98]"
              >
                <Navigation className="h-5 w-5" />
                {dict.detail.directions}
              </a>
            )}
            <button
              type="button"
              onClick={() => addToCalendar(event)}
              className="flex items-center justify-center gap-2 rounded-full bg-white dark:bg-neutral-800 py-3.5 text-[15px] font-bold text-neutral-500 dark:text-neutral-400 shadow-sm ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 touch-manipulation transition-all hover:text-neutral-800 dark:hover:text-neutral-200 active:scale-[0.98]"
            >
              <CalendarPlus className="h-5 w-5" />
              {dict.detail.calendar}
            </button>
            <button
              type="button"
              onClick={() => setShareOpen((open) => !open)}
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
      </div>
    </div>
  );
}
