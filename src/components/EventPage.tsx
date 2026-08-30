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
import { navigateBackSoft, navigateSoft } from "@/lib/nav-feedback";
import { PAGE_SHELL_DETAIL_CLASS } from "@/lib/page-shell";
import { isDetailNavPath } from "@/lib/scope-listing";
import type { NearbyTonightResult } from "@/lib/nearby-events";
import type { VenueSiblingNight } from "@/lib/venue-recurring-siblings";

interface EventPageProps {
  event: Event;
  locale: Locale;
  dict: Dictionary;
  returnTo?: string | null;
  formattedDateRange?: string;
  recurrenceLabel?: string | null;
  nearbyTonight?: NearbyTonightResult | null;
  venueOtherNights?: VenueSiblingNight[];
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
  venueOtherNights = [],
  opinionOverride = null,
  initialVenueRating = null,
}: EventPageProps) {
  const router = useRouter();
  const { toggleSave, isSaved } = useSavedEvents();
  // Return path from sessionStorage (set on list → detail / nearby click).
  const [returnTo, setReturnTo] = useState<string | null | undefined>(returnToProp);
  const [returnTitle, setReturnTitle] = useState<string | null>(null);

  useEffect(() => {
    if (returnToProp) return;
    // One-shot read of session back-context after mount (avoids SSR mismatch).
    const stored = takeReturnPath(locale);
    if (!stored?.path) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- external sessionStorage hydrate
    setReturnTo(stored.path);
    setReturnTitle(stored.title ?? null);
  }, [returnToProp, locale]);

  const backHref = resolveEventReturnPath(locale, event, returnTo);
  const backLabel = resolveBackLabel(
    locale,
    returnTo ?? backHref,
    dict,
    returnTitle,
  );

  function handleClose() {
    // Nearby / venue hops store a detail returnTo — push so label matches.
    // List → detail keeps history.back() so the list scroll position survives.
    if (returnTo && isDetailNavPath(returnTo)) {
      navigateSoft(router, returnTo);
      return;
    }
    if (returnTo && typeof window !== "undefined" && window.history.length > 1) {
      navigateBackSoft(router);
      return;
    }
    navigateSoft(router, backHref);
  }

  return (
    <div className="min-h-dvh bg-background dark:bg-transparent pb-8">
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
          formattedDateRange={formattedDateRange}
          recurrenceLabel={recurrenceLabel}
          nearbyTonight={nearbyTonight}
          venueOtherNights={venueOtherNights}
          opinionOverride={opinionOverride}
          initialVenueRating={initialVenueRating}
          standalone
        />
      </div>
    </div>
  );
}
