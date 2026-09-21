"use client";

import { IntentLink } from "@/components/IntentLink";
import { EventImage } from "@/components/EventImage";
import { eventDetailPath } from "@/lib/event-navigation";
import {
  isRestaurantWeekPromoActive,
  RESTAURANT_WEEK_2026_ID,
  RESTAURANT_WEEK_TEASER_IMAGE,
} from "@/lib/restaurant-week";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface RestaurantWeekPromoProps {
  locale: Locale;
  dict: Dictionary;
  returnTo?: string;
  returnTitle?: string | null;
  /**
   * `home` — slim horizontal campaign nudge after weekend rail.
   * `compact` — Food & Drinks full-width teaser under list tabs (mobile).
   */
  variant?: "home" | "compact";
}

const CARD_CHROME = `
  group relative overflow-hidden rounded-2xl
  border border-neutral-200 bg-white
  shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]
  touch-manipulation transition-[border-color,box-shadow,transform]
  duration-300 ease-out
  hover:border-orange-300 hover:shadow-[0_8px_24px_-8px_rgba(251,146,60,0.25)]
  active:scale-[0.99] active:border-orange-400
  focus-visible:outline focus-visible:outline-2
  focus-visible:outline-offset-2 focus-visible:outline-orange-500
  dark:border-neutral-800 dark:bg-neutral-900
  dark:hover:border-orange-800 dark:active:border-orange-500
`;

/**
 * Restaurant Week campaign teaser.
 * Logo finder lives on the event page; home stays a slim nudge only.
 */
export function RestaurantWeekPromo({
  locale,
  dict,
  returnTo,
  returnTitle,
  variant = "compact",
}: RestaurantWeekPromoProps) {
  const copy = dict.events.restaurantWeek;

  if (!isRestaurantWeekPromoActive(locale)) return null;

  const eventHref = eventDetailPath(locale, RESTAURANT_WEEK_2026_ID);
  const headingId =
    variant === "home"
      ? "restaurant-week-home-heading"
      : "restaurant-week-heading";

  if (variant === "home") {
    return (
      <section
        className="mb-8 sm:mb-10"
        aria-labelledby={headingId}
      >
        <IntentLink
          href={eventHref}
          returnTo={returnTo}
          returnTitle={returnTitle}
          className={`${CARD_CHROME} flex w-full items-stretch gap-3 p-2.5 sm:gap-3.5 sm:p-3`}
        >
          <div className="relative h-[4.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-xl bg-[#f7f4ec] sm:h-[5.25rem] sm:w-[5.25rem]">
            <EventImage
              src={RESTAURANT_WEEK_TEASER_IMAGE}
              alt=""
              sizes="84px"
              className="object-cover object-center no-photo-filter"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-0.5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
              {copy.eyebrow}
            </p>
            <h2
              id={headingId}
              className="truncate text-base font-extrabold leading-snug text-neutral-900 dark:text-neutral-50 sm:text-lg"
            >
              {copy.title}
            </h2>
            <p className="line-clamp-2 text-sm leading-snug text-neutral-600 dark:text-neutral-300">
              <span className="font-medium text-neutral-800 dark:text-neutral-100">
                {copy.dates}
              </span>
              <span className="text-neutral-400 dark:text-neutral-500">
                {" · "}
              </span>
              {copy.priceLine}
            </p>
            <span className="mt-0.5 text-sm font-semibold text-orange-700 dark:text-orange-400">
              {copy.cta}
              <span
                aria-hidden
                className="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </div>
        </IntentLink>
      </section>
    );
  }

  return (
    <section
      className="mb-3 w-full sm:hidden"
      aria-labelledby={headingId}
    >
      <IntentLink
        href={eventHref}
        returnTo={returnTo}
        returnTitle={returnTitle}
        className={`${CARD_CHROME} flex w-full flex-col`}
      >
        <div className="relative aspect-[6/5] w-full overflow-hidden bg-[#f7f4ec]">
          <EventImage
            src={RESTAURANT_WEEK_TEASER_IMAGE}
            alt=""
            sizes="(max-width: 640px) 100vw, 480px"
            className="object-cover object-center no-photo-filter"
          />
        </div>
        <div className="flex flex-col gap-1.5 px-3.5 py-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
            {copy.eyebrow}
          </p>
          <h2
            id={headingId}
            className="text-lg font-extrabold leading-tight text-neutral-900 dark:text-neutral-50"
          >
            {copy.title}
          </h2>
          <p className="text-sm leading-snug text-neutral-600 dark:text-neutral-300">
            <span className="font-medium text-neutral-800 dark:text-neutral-100">
              {copy.dates}
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">
              {" · "}
            </span>
            {copy.priceLine}
          </p>
          <span className="mt-0.5 text-sm font-semibold text-orange-700 dark:text-orange-400">
            {copy.cta}
            <span
              aria-hidden
              className="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </div>
      </IntentLink>
    </section>
  );
}
