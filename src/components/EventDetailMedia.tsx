"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { EventImage } from "@/components/EventImage";
import { ImageStoryEnlarge } from "@/components/ImageStoryEnlarge";
import { IntentLink } from "@/components/IntentLink";
import {
  getEventGallerySlides,
  getEventHeroObjectPosition,
} from "@/lib/event-images";
import { venueDetailPath } from "@/lib/event-navigation";
import { getSeedVenue } from "@/lib/venues-seed";
import { DETAIL_HERO_PHOTO_HEIGHT_MOBILE_CLASS } from "@/lib/page-shell";

interface EventDetailMediaProps {
  event: Event;
  dict: Dictionary;
  locale: Locale;
  variant: "sheet" | "standalone";
  onClose?: () => void;
  priority?: boolean;
  /** Fallback venue link when the active slide has no venueSlug. */
  venueHref?: string;
  onNavigateToVenue?: () => void;
}

type HeroSlide = {
  imageUrl: string;
  venueHref?: string;
  venueName?: string;
  label?: string;
};

export function EventDetailMedia({
  event,
  dict,
  locale,
  variant,
  onClose,
  priority = false,
  venueHref,
  onNavigateToVenue,
}: EventDetailMediaProps) {
  const gallery = useMemo(() => getEventGallerySlides(event.id), [event.id]);

  const slides = useMemo<HeroSlide[]>(() => {
    if (gallery.length > 0) {
      return gallery.map((slide) => {
        const slug = slide.venueSlug;
        const venue = slug ? getSeedVenue(slug) : undefined;
        return {
          imageUrl: slide.imageUrl,
          venueHref: slug ? venueDetailPath(locale, slug) : venueHref,
          venueName: venue?.name ?? event.venue,
          label: slide.label,
        };
      });
    }
    if (!event.imageUrl) return [];
    return [
      {
        imageUrl: event.imageUrl,
        venueHref,
        venueName: event.venue,
      },
    ];
  }, [gallery, event.imageUrl, event.venue, locale, venueHref]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const multi = slides.length > 1;
  const active = slides[activeIndex] ?? slides[0];
  const canPrev = multi && activeIndex > 0;
  const canNext = multi && activeIndex < slides.length - 1;

  const syncActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || slides.length < 2) return;
    const width = el.clientWidth || 1;
    const next = Math.round(el.scrollLeft / width);
    setActiveIndex(Math.max(0, Math.min(slides.length - 1, next)));
  }, [slides.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !multi) return;
    const onScroll = () => syncActiveFromScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [multi, syncActiveFromScroll]);

  useEffect(() => {
    setActiveIndex(0);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: 0 });
  }, [event.id]);

  if (slides.length === 0) return null;

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
      ? "(max-width: 640px) 100vw, (max-width: 768px) 48rem, 64rem"
      : "(max-width: 672px) 100vw, 672px";

  const venueLabel = active?.venueName
    ? `${dict.detail.viewVenue}: ${active.venueName}`
    : dict.detail.viewVenue;

  function goTo(index: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: "smooth",
    });
    setActiveIndex(clamped);
  }

  const navBtnClass =
    "absolute top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg ring-1 ring-black/10 transition-colors hover:bg-orange-50 touch-manipulation";

  return (
    <div
      className={`relative isolate z-0 w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800 lg:bg-transparent lg:bg-gradient-to-br lg:from-orange-50/85 lg:via-rose-50/70 lg:to-fuchsia-50/55 lg:dark:from-orange-950/50 lg:dark:via-rose-950/38 lg:dark:to-fuchsia-950/28 ${heightClass} ${roundedClass}`}
    >
      <div
        ref={scrollerRef}
        className={`flex h-full w-full ${
          multi
            ? "snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "overflow-hidden"
        }`}
        style={multi ? { WebkitOverflowScrolling: "touch" } : undefined}
        role={multi ? "region" : undefined}
        aria-roledescription={multi ? "carousel" : undefined}
        aria-label={multi ? event.title : undefined}
      >
        {slides.map((slide, index) => {
          const photo = (
            <EventImage
              src={slide.imageUrl}
              alt={slide.label ? `${event.title} — ${slide.label}` : event.title}
              sizes={imageSizes}
              className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
                slide.venueHref ? "group-hover/venue:scale-[1.03]" : ""
              } ${getEventHeroObjectPosition(event.id)} lg:object-contain lg:object-top`}
              priority={priority && index === 0}
            />
          );

          return (
            <div
              key={`${slide.imageUrl}-${index}`}
              className="relative h-full min-w-full shrink-0 grow-0 basis-full snap-center snap-always"
              aria-hidden={multi && index !== activeIndex ? true : undefined}
            >
              {slide.venueHref ? (
                <IntentLink
                  href={slide.venueHref}
                  onClick={onNavigateToVenue}
                  className="group/venue absolute inset-0 z-0 block touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  aria-label={
                    slide.venueName
                      ? `${dict.detail.viewVenue}: ${slide.venueName}`
                      : dict.detail.viewVenue
                  }
                  tabIndex={multi && index !== activeIndex ? -1 : undefined}
                >
                  {photo}
                </IntentLink>
              ) : (
                <div className="absolute inset-0">{photo}</div>
              )}
            </div>
          );
        })}
      </div>

      {multi ? (
        <>
          {canPrev ? (
            <button
              type="button"
              className={`${navBtnClass} left-2`}
              aria-label="Previous slide"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goTo(activeIndex - 1);
              }}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
          ) : null}
          {canNext ? (
            <button
              type="button"
              className={`${navBtnClass} right-2`}
              aria-label="Next slide"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          ) : null}
          <div
            className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white px-3 py-1.5 text-xs font-bold tabular-nums text-neutral-800 shadow-lg ring-1 ring-black/10"
            aria-live="polite"
            aria-atomic="true"
          >
            {activeIndex + 1}/{slides.length}
          </div>
        </>
      ) : null}

      {active?.venueHref ? (
        <IntentLink
          href={active.venueHref}
          onClick={onNavigateToVenue}
          className="absolute bottom-3 left-3 z-20 inline-flex max-w-[calc(50%-2.5rem)] items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/80 touch-manipulation"
          aria-label={venueLabel}
        >
          <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {dict.detail.viewVenue}
            {active.venueName ? ` · ${active.venueName}` : ""}
          </span>
        </IntentLink>
      ) : null}

      <ImageStoryEnlarge
        src={active?.imageUrl ?? slides[0].imageUrl}
        alt={
          active?.label
            ? `${event.title} — ${active.label}`
            : event.title
        }
        enlargeLabel={dict.detail.enlargeImage}
        closeLabel={dict.detail.close}
        className="bottom-3 right-3 z-20"
        showOnDesktop
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
  return (
    Boolean(event.imageUrl) || getEventGallerySlides(event.id).length > 0
  );
}
