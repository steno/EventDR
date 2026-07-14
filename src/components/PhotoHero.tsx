import Link from "next/link";
import { EventImage } from "@/components/EventImage";
import { eventDetailPath } from "@/lib/event-navigation";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface PhotoHeroProps {
  dict: Dictionary;
  locale: Locale;
  /** Featured event for the photo plane; falls back to brand gradient if missing. */
  featuredEvent?: Event | null;
  /** Return path when opening the featured event (keeps home area). */
  returnTo?: string;
}

export function PhotoHero({
  dict,
  locale,
  featuredEvent = null,
  returnTo,
}: PhotoHeroProps) {
  const imageUrl = featuredEvent?.imageUrl?.trim() || null;
  const eventHref =
    featuredEvent != null
      ? eventDetailPath(locale, featuredEvent.id, returnTo ?? `/${locale}`)
      : null;

  return (
    <header className="relative -mx-4 mb-5 overflow-hidden sm:rounded-2xl sm:mx-0">
      <div className="relative min-h-[15.5rem] sm:min-h-[12.5rem]">
        {imageUrl ? (
          <div className="absolute inset-0">
            <EventImage
              src={imageUrl}
              alt=""
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600"
            aria-hidden
          />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[15.5rem] flex-col justify-end gap-3 px-4 pb-5 pt-10 sm:min-h-[12.5rem] sm:px-6 sm:pb-5 sm:pt-8">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
              {dict.seo.siteName}
            </p>
            <h1 className="mt-1 text-[2rem] font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
              {dict.hero.events}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-rose-300 to-fuchsia-300">
                {dict.hero.nearYou}
              </span>
            </h1>
            <p className="mt-2 max-w-md text-sm font-medium leading-snug text-white/85 sm:text-[15px]">
              {dict.hero.subtitle}{" "}
              <span className="font-bold text-white">
                {dict.hero.subtitleHighlight}
              </span>
              . {dict.hero.subtitleEnd}
            </p>
          </div>

          {featuredEvent && eventHref && (
            <Link
              href={eventHref}
              className="group inline-flex max-w-full items-center gap-2 text-sm font-bold text-white/90 transition-colors hover:text-white touch-manipulation"
            >
              <span className="truncate underline-offset-2 group-hover:underline">
                {featuredEvent.title}
              </span>
              <span aria-hidden className="shrink-0 text-white/70">
                →
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
