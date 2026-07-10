"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { AppHeader } from "@/components/AppHeader";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import { resolveEventReturnPath } from "@/lib/event-navigation";

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

  function handleClose() {
    router.push(backHref);
  }

  return (
    <>
      <main className="flex-1 bg-neutral-50 min-h-screen pb-12">
        <div className="mx-auto max-w-lg sm:max-w-2xl px-4">
          <AppHeader locale={locale} dict={dict} />
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {dict.browse.back}
          </Link>
        </div>
      </main>

      <EventDetailSheet
        event={event}
        onClose={handleClose}
        dict={dict}
        locale={locale}
        isSaved={isSaved(event)}
        onToggleSave={toggleSave}
        standalone
      />
    </>
  );
}
