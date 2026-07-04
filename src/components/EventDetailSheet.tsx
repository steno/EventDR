"use client";

import { useEffect, useState } from "react";
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
  Users,
} from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getCategoryMeta } from "@/lib/categories";
import { formatEventDate } from "@/lib/format-date";
import { getDirectionsUrl } from "@/lib/maps";
import { addToCalendar } from "@/lib/calendar";
import { shareEvent } from "@/lib/share";
import { matchVenueSlug } from "@/lib/venues-seed";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import { EventImage } from "@/components/EventImage";

interface EventDetailSheetProps {
  event: Event | null;
  onClose: () => void;
  dict: Dictionary;
  locale: Locale;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export function EventDetailSheet({
  event,
  onClose,
  dict,
  locale,
  isSaved,
  onToggleSave,
}: EventDetailSheetProps) {
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!event) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [event]);

  if (!event) return null;

  const category = getCategoryMeta(event.category, dict.categories);
  const emoji = event.imageEmoji ?? category?.emoji ?? "📅";
  const recurrenceLabel = formatRecurrenceLabel(event, locale, dict);
  const venueSlug =
    event.venueSlug ?? matchVenueSlug(event.venue) ?? matchVenueSlug(event.location);

  async function handleShare() {
    const ok = await shareEvent(event!);
    setShareMsg(ok ? dict.detail.shared : dict.detail.copied);
    setTimeout(() => setShareMsg(null), 2000);
  }

  function handleViewVenue() {
    if (!venueSlug) return;
    onClose();
    router.push(`/${locale}/venue/${venueSlug}`);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label={dict.detail.close}
      />
      <div
        className="
          relative z-10 flex w-full max-w-lg sm:max-w-2xl flex-col
          max-h-[92dvh] overflow-hidden
          bg-white rounded-t-3xl shadow-2xl
          pb-[env(safe-area-inset-bottom)]
          animate-in slide-in-from-bottom duration-300
        "
      >
        {event.imageUrl ? (
          <div className="relative h-[min(32dvh,13rem)] w-full shrink-0 overflow-hidden rounded-t-3xl bg-neutral-100">
            <EventImage
              src={event.imageUrl}
              alt={event.title}
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover object-center"
              priority
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
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
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100"
              aria-label={dict.detail.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 px-4 pt-3 pb-2 overflow-hidden">
          {event.communitySubmitted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-600 mb-2">
              <Users className="h-3 w-3" />
              {dict.detail.community}
            </span>
          )}

          <h2 className="text-xl font-black text-neutral-900 leading-tight tracking-tight line-clamp-2">
            {event.title}
          </h2>

          <p className="mt-2 text-sm text-neutral-600 leading-snug line-clamp-2">
            {event.description}
          </p>

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center gap-2.5 text-neutral-700">
              <Calendar className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              <span className="font-medium truncate">{formatEventDate(event.date, locale)}</span>
              {recurrenceLabel && (
                <span className="inline-flex shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600">
                  {recurrenceLabel}
                </span>
              )}
            </div>
            {event.time && (
              <div className="flex items-center gap-2.5 text-neutral-700">
                <Clock className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <span className="font-medium">{event.time}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 text-neutral-700">
              <MapPin className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              <span className="font-medium truncate">
                {event.venue ? `${event.venue}, ` : ""}
                {event.location}
              </span>
            </div>
            {venueSlug && (
              <button
                type="button"
                onClick={handleViewVenue}
                className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 active:text-orange-800 touch-manipulation"
              >
                {dict.detail.viewVenue} →
              </button>
            )}
          </div>

          {event.sourceUrl && (
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {dict.detail.source}
            </a>
          )}
        </div>

        <div className="shrink-0 border-t border-neutral-100 bg-white px-4 pt-3 pb-3">
          <div className="grid grid-cols-2 gap-2">
            {event.format !== "digital" && (
              <a
                href={getDirectionsUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 text-white py-3 text-sm font-bold"
              >
                <Navigation className="h-4 w-4" />
                {dict.detail.directions}
              </a>
            )}
            <button
              type="button"
              onClick={() => addToCalendar(event)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-100 text-neutral-900 py-3 text-sm font-bold"
            >
              <CalendarPlus className="h-4 w-4" />
              {dict.detail.calendar}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-100 text-neutral-900 py-3 text-sm font-bold"
            >
              <Share2 className="h-4 w-4" />
              {shareMsg ?? dict.detail.share}
            </button>
            <button
              type="button"
              onClick={() => onToggleSave(event.id)}
              className={`
                flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold
                ${isSaved ? "bg-orange-50 text-orange-600" : "bg-neutral-100 text-neutral-900"}
              `}
            >
              <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? dict.detail.saved : dict.detail.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
