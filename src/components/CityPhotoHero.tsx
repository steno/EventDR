import Link from "next/link";
import { EventImage } from "@/components/EventImage";
import { eventDetailPath } from "@/lib/event-navigation";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface CityPhotoHeroProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  /** Place / region photo; omit for brand gradient only. */
  imageUrl?: string;
  /** When set, hero uses the event flyer and links through to the event. */
  featuredEvent?: Event | null;
  locale?: Locale;
  dict?: Dictionary;
  returnTo?: string;
}

export function CityPhotoHero({
  title,
  eyebrow,
  subtitle,
  imageUrl,
  featuredEvent = null,
  locale,
  dict,
  returnTo,
}: CityPhotoHeroProps) {
  const specialImage = featuredEvent?.imageUrl?.trim() || null;
  const resolvedImage = specialImage || imageUrl;
  const eventHref =
    featuredEvent && locale
      ? eventDetailPath(locale, featuredEvent.id, returnTo ?? `/${locale}`)
      : null;

  return (
    <header className="relative -mx-4 mb-5 overflow-hidden sm:rounded-2xl sm:mx-0">
      <div className="relative min-h-[14.5rem] sm:min-h-[17rem]">
        {resolvedImage ? (
          <div className="absolute inset-0">
            <EventImage
              src={resolvedImage}
              alt=""
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover object-center"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600"
            aria-hidden
          />
        )}

        {/* Light: bottom-heavy scrim — photo stays open at the top */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-neutral-950/78 via-neutral-950/40 via-40% to-neutral-950/10 dark:hidden"
          aria-hidden
        />
        {/* Light: soft brand tip under copy */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-rose-800/30 to-transparent dark:hidden"
          aria-hidden
        />

        {/* Dark: fuller wash for large white type */}
        <div
          className="absolute inset-0 hidden bg-gradient-to-t from-black/80 via-black/40 to-black/20 dark:block"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[14.5rem] flex-col justify-end gap-3 px-4 pb-5 pt-10 sm:min-h-[17rem] sm:px-6 sm:pb-6">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-1 text-[2rem] font-black leading-[1.05] tracking-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)] sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 max-w-xl text-sm font-medium leading-snug text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] sm:text-[15px]">
                {subtitle}
              </p>
            ) : null}
          </div>

          {featuredEvent && eventHref ? (
            <Link
              href={eventHref}
              className="group inline-flex max-w-full items-center gap-2 text-[15px] font-bold touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 focus-visible:rounded"
            >
              {dict?.hero.featured ? (
                <span className="shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-white/75 [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]">
                  {dict.hero.featured}
                </span>
              ) : null}
              <span className="truncate bg-gradient-to-r from-orange-300 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent transition-[filter] group-hover:brightness-110">
                {featuredEvent.title}
              </span>
              <span
                aria-hidden
                className="shrink-0 text-orange-300 transition-transform group-hover:translate-x-0.5 group-hover:text-rose-300"
              >
                →
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
