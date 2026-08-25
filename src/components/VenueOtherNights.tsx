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
            className="font-sans text-base font-extrabold text-neutral-950 dark:text-white sm:text-lg"
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
              onClick={() => {
                setPendingId(sibling.id);
                rememberReturnPath(returnTo, returnTitle);
              }}
              className={`snap-start shrink-0 w-[11.5rem] rounded-2xl border border-neutral-200 bg-white p-2.5 transition-[opacity,transform] dark:border-neutral-800 dark:bg-neutral-900 ${
                pending ? "scale-[0.98] opacity-90" : ""
              } ${dimmed ? "opacity-50" : ""}`}
            >
              <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                {sibling.imageUrl ? (
                  <EventImage
                    src={sibling.imageUrl}
                    alt={sibling.title}
                    sizes="184px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl" aria-hidden>
                    📅
                  </div>
                )}
              </div>
              <p className="line-clamp-2 text-sm font-bold leading-snug text-neutral-950 dark:text-white">
                {sibling.title}
              </p>
              <p className="mt-1 text-xs font-bold text-neutral-600 dark:text-neutral-300">
                {sibling.label}
              </p>
              {(dateLabel || timeLabel.display) && (
                <p className="mt-0.5 truncate text-xs font-medium text-neutral-500 dark:text-neutral-400">
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
