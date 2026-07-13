"use client";

import { useRouter } from "next/navigation";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { StickyListHeader } from "@/components/StickyListHeader";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import { resolveBackLabel, resolveEventReturnPath } from "@/lib/event-navigation";

interface EventPageProps {
  event: Event;
  locale: Locale;
  dict: Dictionary;
  returnTo?: string | null;
  formattedDateRange?: string;
  recurrenceLabel?: string | null;
}

export function EventPage({
  event,
  locale,
  dict,
  returnTo,
  formattedDateRange,
  recurrenceLabel,
}: EventPageProps) {
  const router = useRouter();
  const { toggleSave, isSaved } = useSavedEvents();
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
      <div className="mx-auto max-w-lg sm:max-w-2xl px-4">
        <StickyListHeader
          locale={locale}
          dict={dict}
          backLabel={backLabel}
          onBack={handleClose}
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
          standalone
        />
      </div>
    </div>
  );
}
