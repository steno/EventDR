"use client";

import { X } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { EventImage } from "@/components/EventImage";
import { getEventHeroObjectPosition } from "@/lib/event-images";

interface EventDetailMediaProps {
  event: Event;
  dict: Dictionary;
  variant: "sheet" | "standalone";
  onClose?: () => void;
  priority?: boolean;
}

export function EventDetailMedia({
  event,
  dict,
  variant,
  onClose,
  priority = false,
}: EventDetailMediaProps) {
  if (!event.imageUrl) return null;

  const heightClass =
    variant === "standalone"
      ? "h-full min-h-[min(32dvh,13rem)]"
      : "h-[min(32dvh,13rem)]";
  const roundedClass =
    variant === "standalone"
      ? "rounded-t-3xl lg:rounded-none lg:rounded-l-3xl"
      : "";
  const imageSizes =
    variant === "standalone"
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 48rem, 64rem"
      : "(max-width: 672px) 100vw, 672px";

  return (
    <div
      className={`relative isolate z-0 w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${heightClass} ${roundedClass}`}
    >
      <EventImage
        src={event.imageUrl}
        alt={event.title}
        sizes={imageSizes}
        className={`h-full w-full object-cover ${getEventHeroObjectPosition(event.id)}`}
        priority={priority}
      />
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
