"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { IntentLink, warmRoutesIdle } from "@/components/IntentLink";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { eventDetailPath, rememberReturnPath } from "@/lib/event-navigation";
import { formatEventDateRange } from "@/lib/format-date";
import { formatEventTimeForList } from "@/lib/event-time-display";
import type { VenueSiblingNight } from "@/lib/venue-recurring-siblings";

interface VenueOtherNightsProps {
  siblings: VenueSiblingNight[];
  venueName?: string;
  locale: Locale;
  dict: Dictionary;
  returnTo?: string;
  returnTitle?: string | null;
  className?: string;
}

export function VenueOtherNights({
  siblings,
  venueName,
  locale,
  dict,
  returnTo,
  returnTitle = null,
  className = "mt-6",
}: VenueOtherNightsProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    const hrefs = siblings.map((s) => eventDetailPath(locale, s.id));
    if (hrefs.length === 0) return;
    return warmRoutesIdle(router, hrefs, hrefs.length);
  }, [siblings, locale, router]);

  if (siblings.length === 0) return null;

  const heading = venueName
    ? dict.detail.otherNightsAt.replace("{venue}", venueName)
    : dict.detail.otherNights;

  return (
    <section className={className} aria-labelledby="venue-other-nights-heading">
      <div className="mb-3 flex items-start gap-2.5">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          <CalendarDays className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2
            id="venue-other-nights-heading"
            className="font-sans text-lg font-extrabold text-neutral-950 dark:text-white sm:text-xl"
          >
            {heading}
          </h2>
        </div>
      </div>

      <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {siblings.map((sibling) => {
          const href = eventDetailPath(locale, sibling.id);
          const dateLabel = sibling.date
            ? formatEventDateRange(sibling.date, locale, { short: true })
            : null;
          const timeLabel = formatEventTimeForList(sibling.time);
          const pending = pendingId === sibling.id;
          const dimmed = pendingId != null && pendingId !== sibling.id;

          return (
            <IntentLink
              key={sibling.id}
              href={href}
              aria-busy={pending || undefined}
              onClick={() => {
                setPendingId(sibling.id);
                rememberReturnPath(returnTo, returnTitle);
              }}
              className={`group relative snap-start shrink-0 w-[12.5rem] overflow-hidden rounded-2xl bg-white p-3 shadow-[0_2px_12px_-6px_rgba(0,0,0,0.12)] transition-[box-shadow,transform,opacity,ring] duration-300 touch-manipulation dark:bg-neutral-900 ${
                pending
                  ? "scale-[0.985] ring-2 ring-orange-500/80 dark:ring-orange-400/70"
                  : dimmed
                    ? "opacity-45 ring-1 ring-neutral-200/90 dark:ring-neutral-800"
                    : "ring-1 ring-neutral-200/90 dark:ring-neutral-800 hover:shadow-[0_8px_24px_-10px_rgba(251,146,60,0.28)] hover:ring-orange-300/70 dark:hover:ring-orange-800/60 active:scale-[0.99]"
              }`}
            >
              <div className="relative mb-2.5 aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                {sibling.imageUrl ? (
                  <EventImage
                    src={sibling.imageUrl}
                    alt={sibling.title}
                    sizes="200px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl" aria-hidden>
                    📅
                  </div>
                )}
                {pending ? (
                  <div
                    className="pointer-events-none absolute inset-0 bg-orange-500/10"
                    aria-hidden
                  />
                ) : null}
              </div>
              <p className="line-clamp-2 text-base font-bold leading-snug text-neutral-950 dark:text-white">
                {sibling.title}
              </p>
              <p className="mt-1.5 text-sm font-bold text-neutral-700 dark:text-neutral-200">
                {sibling.label}
              </p>
              {(dateLabel || timeLabel.display) && (
                <p className="mt-1 truncate text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  {[dateLabel, timeLabel.display].filter(Boolean).join(" · ")}
                </p>
              )}
            </IntentLink>
          );
        })}
      </div>
    </section>
  );
}
