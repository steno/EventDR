"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Event, EventOpinion } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { StickyListHeader } from "@/components/StickyListHeader";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import {
  resolveBackLabel,
  resolveEventReturnPath,
  takeReturnPath,
} from "@/lib/event-navigation";
import { PAGE_SHELL_DETAIL_CLASS } from "@/lib/page-shell";
import type { NearbyTonightResult } from "@/lib/nearby-events";

interface EventPageProps {
  event: Event;
  locale: Locale;
  dict: Dictionary;
  returnTo?: string | null;
  formattedDateRange?: string;
  recurrenceLabel?: string | null;
  nearbyTonight?: NearbyTonightResult | null;
  opinionOverride?: EventOpinion | null;
  initialVenueRating?: { rating: number; reviewCount?: number } | null;
}

export function EventPage({
  event,
  locale,
  dict,
  returnTo: returnToProp,
  formattedDateRange,
  recurrenceLabel,
  nearbyTonight = null,
  opinionOverride = null,
  initialVenueRating = null,
}: EventPageProps) {
  const router = useRouter();
  const { toggleSave, isSaved } = useSavedEvents();
  // Return path from sessionStorage (set on list → detail click), not ?from=.
  const [returnTo, setReturnTo] = useState<string | null | undefined>(returnToProp);

  useEffect(() => {
    if (returnToProp) return;
    const stored = takeReturnPath(locale);
    if (stored?.path) setReturnTo(stored.path);
  }, [returnToProp, locale]);

  const backHref = resolveEventReturnPath(locale, event, returnTo);
  const backLabel = resolveBackLabel(
    locale,
    returnTo ?? backHref,
    dict,
  );

  function handleClose() {
    if (returnTo && typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(backHref);
  }

  return (
    <div className="min-h-dvh bg-neutral-50 dark:bg-transparent pb-8">
      <div className={PAGE_SHELL_DETAIL_CLASS}>
        <StickyListHeader
          locale={locale}
          dict={dict}
          backLabel={backLabel}
          onBack={handleClose}
          variant="detail"
        />

        <EventDetailSheet
          event={event}
          onClose={handleClose}
          dict={dict}
          locale={locale}
          isSaved={isSaved(event)}
          onToggleSave={toggleSave}
          returnTo={returnTo ?? backHref}
          formattedDateRange={formattedDateRange}
          recurrenceLabel={recurrenceLabel}
          nearbyTonight={nearbyTonight}
          opinionOverride={opinionOverride}
          initialVenueRating={initialVenueRating}
          standalone
        />
      </div>
    </div>
  );
}
