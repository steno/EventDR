"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { AppHeader } from "@/components/AppHeader";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import { resolveBackLabel, resolveEventReturnPath } from "@/lib/event-navigation";

interface EventPageProps {
  event: Event;
  locale: Locale;
  dict: Dictionary;
  returnTo?: string | null;
}

export function EventPage({ event, locale, dict, returnTo }: EventPageProps) {
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
    <>
      <main className="bg-neutral-50 dark:bg-transparent pb-6">
        <div className="mx-auto max-w-lg sm:max-w-2xl px-4">
          <AppHeader locale={locale} dict={dict} />
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </button>
        </div>
      </main>

      <EventDetailSheet
        event={event}
        onClose={handleClose}
        dict={dict}
        locale={locale}
        isSaved={isSaved(event)}
        onToggleSave={toggleSave}
        returnTo={returnTo ?? backHref}
        standalone
      />
    </>
  );
}
