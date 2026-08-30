"use client";

import { Building2, X } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { EventImage } from "@/components/EventImage";
import { IntentLink } from "@/components/IntentLink";
import { getEventHeroObjectPosition } from "@/lib/event-images";
import { DETAIL_HERO_PHOTO_HEIGHT_MOBILE_CLASS } from "@/lib/page-shell";

interface EventDetailMediaProps {
  event: Event;
  dict: Dictionary;
  variant: "sheet" | "standalone";
  onClose?: () => void;
  priority?: boolean;
  /** When set, the photo is a link to the venue page. */
  venueHref?: string;
  onNavigateToVenue?: () => void;
}

export function EventDetailMedia({
  event,
  dict,
  variant,
  onClose,
  priority = false,
  venueHref,
  onNavigateToVenue,
}: EventDetailMediaProps) {
  if (!event.imageUrl) return null;

  const heightClass =
    variant === "standalone"
      ? `h-full min-h-[calc((min(68dvh,36rem)-2.75rem)/2)]`
      : DETAIL_HERO_PHOTO_HEIGHT_MOBILE_CLASS;
  const roundedClass =
    variant === "standalone"
      ? "rounded-t-3xl lg:rounded-none lg:rounded-l-3xl"
      : "";
  const imageSizes =
    variant === "standalone"
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 48rem, 64rem"
      : "(max-width: 672px) 100vw, 672px";
  const venueLabel = event.venue
    ? `${dict.detail.viewVenue}: ${event.venue}`
    : dict.detail.viewVenue;

  const photo = (
    <EventImage
      src={event.imageUrl}
      alt={event.title}
      sizes={imageSizes}
      className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
        venueHref ? "group-hover/venue:scale-[1.03]" : ""
      } ${getEventHeroObjectPosition(event.id)}`}
      priority={priority}
    />
  );

  return (
    <div
      className={`relative isolate z-0 w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${heightClass} ${roundedClass}`}
    >
      {venueHref ? (
        <IntentLink
          href={venueHref}
          onClick={onNavigateToVenue}
          className="group/venue absolute inset-0 z-0 block touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          aria-label={venueLabel}
        >
          {photo}
          <span
            className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm transition-colors group-hover/venue:bg-black/70"
            aria-hidden
          >
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            {dict.detail.viewVenue}
          </span>
        </IntentLink>
      ) : (
        photo
      )}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-800/90 shadow-sm touch-manipulation"
          aria-label={dict.detail.close}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/** Whether the detail view should show a hero media block. */
export function hasEventDetailHero(event: Event): boolean {
  return Boolean(event.imageUrl);
}
