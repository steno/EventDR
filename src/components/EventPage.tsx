"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { StickyListHeader } from "@/components/StickyListHeader";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import { resolveBackLabel, resolveEventReturnPath } from "@/lib/event-navigation";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";

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
  returnTo: returnToProp,
  formattedDateRange,
  recurrenceLabel,
}: EventPageProps) {
  const router = useRouter();
  const { toggleSave, isSaved } = useSavedEvents();
  // Read ?from= on the client so the server page can stay ISR-cached.
  const [returnTo, setReturnTo] = useState<string | null | undefined>(returnToProp);

  useEffect(() => {
    if (returnToProp) return;
    const from = new URLSearchParams(window.location.search).get("from");
    if (from) setReturnTo(from);
  }, [returnToProp]);

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
      <div className={PAGE_SHELL_CLASS}>
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
