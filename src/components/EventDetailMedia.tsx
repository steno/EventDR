"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, MapPin, Navigation, X } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { EventImage } from "@/components/EventImage";
import { MapReveal } from "@/components/MapReveal";
import { resolveEventCoords } from "@/lib/event-coords";
import { getEventHeroObjectPosition } from "@/lib/event-images";
import { getDirectionsUrl } from "@/lib/maps";

const EventInlineMap = dynamic(
  () => import("@/components/EventInlineMap").then((m) => m.EventInlineMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-neutral-200 dark:bg-neutral-700">
        <MapPin className="h-8 w-8 animate-pulse text-neutral-400" aria-hidden />
      </div>
    ),
  },
);

interface EventDetailMediaProps {
  event: Event;
  dict: Dictionary;
  emoji: string;
  gradient?: string;
  variant: "sheet" | "standalone";
  onClose?: () => void;
  priority?: boolean;
}

export function EventDetailMedia({
  event,
  dict,
  emoji,
  gradient = "from-neutral-200 to-neutral-300",
  variant,
  onClose,
  priority = false,
}: EventDetailMediaProps) {
  const coords = resolveEventCoords(event);
  const hasImage = Boolean(event.imageUrl);
  const hasMap = coords != null;
  const totalSlides = hasMap ? 2 : hasImage ? 1 : 0;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  const heightClass =
    variant === "standalone"
      ? "h-full min-h-[min(32dvh,13rem)]"
      : "h-[min(32dvh,13rem)]";

  const scrollToSlide = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    setActiveSlide(index);
    if (index >= 1) setMapLoaded(true);
  }, []);

  const syncActiveSlide = useCallback(() => {
    const el = scrollRef.current;
    if (!el || totalSlides < 2) return;
    const index = Math.min(
      totalSlides - 1,
      Math.max(0, Math.round(el.scrollLeft / el.clientWidth)),
    );
    setActiveSlide(index);
    if (index >= 1) setMapLoaded(true);
  }, [totalSlides]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || totalSlides < 2) return;
    el.addEventListener("scrollend", syncActiveSlide);
    return () => el.removeEventListener("scrollend", syncActiveSlide);
  }, [syncActiveSlide, totalSlides]);

  if (totalSlides === 0) return null;

  const roundedClass =
    variant === "standalone"
      ? "rounded-t-3xl lg:rounded-none lg:rounded-l-3xl"
      : "";
  const mapIsActive = activeSlide === 1;
  const imageSizes =
    variant === "standalone"
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 48rem, 64rem"
      : "(max-width: 672px) 100vw, 672px";

  const navButtonClass =
    "z-10 flex items-center justify-center rounded-full bg-white/92 p-2 text-neutral-800 shadow-md ring-1 ring-black/10 backdrop-blur-sm touch-manipulation transition-opacity dark:bg-neutral-900/92 dark:text-neutral-100 dark:ring-white/15";

  function renderPhotoSlide() {
    if (hasImage) {
      return (
        <EventImage
          src={event.imageUrl!}
          alt={event.title}
          sizes={imageSizes}
          className={`h-full w-full object-cover ${getEventHeroObjectPosition(event.id)}`}
          priority={priority}
        />
      );
    }

    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
        aria-hidden
      >
        <span className="text-6xl drop-shadow-sm">{emoji}</span>
      </div>
    );
  }

  function renderMapSlide(interactive: boolean, requireClick = false) {
    if (!coords) return null;

    const map = mapLoaded ? (
      <EventInlineMap coords={coords} active={interactive} />
    ) : requireClick ? (
      <MapReveal
        lat={coords.lat}
        lng={coords.lng}
        label={dict.detail.showMap}
        className="h-full w-full"
      >
        <EventInlineMap coords={coords} active={interactive} />
      </MapReveal>
    ) : (
      <div className="flex h-full w-full items-center justify-center">
        <MapPin className="h-8 w-8 text-neutral-400" aria-hidden />
      </div>
    );

    return (
      <div
        className="event-inline-map relative h-full w-full bg-neutral-200 dark:bg-neutral-700"
      >
        {map}
        <a
          href={getDirectionsUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm touch-manipulation"
        >
          <Navigation className="h-3.5 w-3.5" aria-hidden />
          {dict.detail.mediaTapDirections}
        </a>
      </div>
    );
  }

  const carouselChrome = totalSlides > 1 && (
    <>
      {activeSlide === 0 && (
        <span className="pointer-events-none absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          {dict.detail.mediaSwipeMap}
        </span>
      )}

      {activeSlide === 0 && (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-black/35 to-transparent transition-opacity group-hover/media:from-black/45"
          aria-hidden
        />
      )}

      {activeSlide === 0 && (
        <button
          type="button"
          onClick={() => scrollToSlide(1)}
          className={`${navButtonClass} absolute top-1/2 right-2 -translate-y-1/2 opacity-90 sm:opacity-0 sm:group-hover/media:opacity-100`}
          aria-label={dict.detail.mediaSwipeMap}
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      )}

      {activeSlide === 1 && (
        <button
          type="button"
          onClick={() => scrollToSlide(0)}
          className={`${navButtonClass} absolute top-1/2 left-2 -translate-y-1/2 opacity-90 sm:opacity-0 sm:group-hover/media:opacity-100`}
          aria-label={dict.detail.mediaSwipePhoto}
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </button>
      )}

      <div className="absolute inset-x-0 bottom-2.5 z-10 flex justify-center gap-1.5">
        {Array.from({ length: totalSlides }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToSlide(i)}
            className={`rounded-full transition-all touch-manipulation ${
              i === activeSlide
                ? "h-1.5 w-4 bg-white shadow-md ring-1 ring-black/10"
                : "h-1.5 w-1.5 bg-white/35 ring-1 ring-white/70"
            }`}
            aria-label={i === 0 ? dict.detail.mediaPhoto : dict.detail.mediaMap}
          />
        ))}
      </div>
    </>
  );

  if (totalSlides === 1) {
    return (
      <div
        className={`relative isolate z-0 w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${heightClass} ${roundedClass}`}
      >
        {hasImage ? renderPhotoSlide() : renderMapSlide(true, true)}
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

  return (
    <div
      className={`group/media relative isolate z-0 w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${heightClass} ${roundedClass}`}
    >
      <div
        ref={scrollRef}
        onScroll={syncActiveSlide}
        className="flex h-full cursor-grab snap-x snap-mandatory overflow-x-auto scrollbar-hide active:cursor-grabbing"
        aria-label={`${dict.detail.mediaPhoto}, ${dict.detail.mediaMap}`}
      >
        <div className="h-full w-full shrink-0 snap-center" aria-hidden={activeSlide !== 0}>
          {renderPhotoSlide()}
        </div>
        <div
          className="h-full w-full shrink-0 snap-center"
          aria-hidden={activeSlide !== 1}
          onPointerDown={() => {
            if (!mapLoaded) setMapLoaded(true);
          }}
        >
          {renderMapSlide(mapIsActive)}
        </div>
      </div>

      {carouselChrome}

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

/** Whether the detail view should show a hero media block (image/map carousel). */
export function hasEventDetailHero(event: Event): boolean {
  return Boolean(event.imageUrl) || resolveEventCoords(event) != null;
}
