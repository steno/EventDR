"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { TimeRange } from "@/lib/filters";
import { FilteredEventList } from "@/components/FilteredEventList";
import {
  CityCategoryLinks,
  type RelatedCategoryLink,
} from "@/components/CityCategoryLinks";
import { SubmitEventSheet } from "@/components/SubmitEventSheet";
import { AppHeader } from "@/components/AppHeader";

interface EventScopePageProps {
  locale: Locale;
  dict: Dictionary;
  initialEvents: Event[];
  fetchUrl: string;
  returnTo: string;
  title: string;
  subtitle?: string;
  intro: string;
  sectionTitle: string;
  emoji?: string;
  emojiClassName?: string;
  backHref?: string;
  emptyMessage?: string;
  fixedTimeRange?: TimeRange;
  addEventLabel?: string;
  submitDefaults?: {
    category?: Event["category"];
    location?: string;
  };
  relatedCategoryLinks?: RelatedCategoryLink[];
  relatedCategoryLinksLabel?: string;
}

export function EventScopePage({
  locale,
  dict,
  initialEvents,
  fetchUrl,
  returnTo,
  title,
  subtitle = dict.region.northCoast,
  intro,
  sectionTitle,
  emoji = "📅",
  emojiClassName,
  backHref = `/${locale}`,
  emptyMessage = dict.browse.noEvents,
  fixedTimeRange,
  addEventLabel = dict.nav.submit,
  submitDefaults,
  relatedCategoryLinks,
  relatedCategoryLinksLabel,
}: EventScopePageProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data: { events?: Event[] }) => setEvents(data.events ?? []))
      .catch(() => setEvents(initialEvents))
      .finally(() => setLoading(false));
  }, [fetchUrl, initialEvents]);

  const headerEmojiClassName =
    emojiClassName ??
    "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800";

  return (
    <>
      <main className="relative flex-1 bg-neutral-50 dark:bg-transparent min-h-screen pb-12">
        <div className="relative mx-auto max-w-lg sm:max-w-2xl px-4">
          <AppHeader locale={locale} dict={dict} />
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {dict.browse.back}
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-sm ${headerEmojiClassName}`}
            >
              {emoji}
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                {subtitle}
              </p>
            </div>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            {intro}
          </p>

          {relatedCategoryLinks && relatedCategoryLinksLabel ? (
            <CityCategoryLinks
              label={relatedCategoryLinksLabel}
              links={relatedCategoryLinks}
            />
          ) : null}

          <FilteredEventList
            events={events}
            loading={loading}
            dict={dict}
            locale={locale}
            emptyMessage={emptyMessage}
            sectionTitle={sectionTitle}
            returnTo={returnTo}
            fixedTimeRange={fixedTimeRange}
            onAddEvent={() => setSubmitOpen(true)}
            addEventLabel={addEventLabel}
          />
        </div>
      </main>

      <SubmitEventSheet
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        dict={dict}
        locale={locale}
        defaults={submitDefaults}
        onSubmitted={() => {
          setSubmitOpen(false);
          fetch(fetchUrl)
            .then((response) => response.json())
            .then((data: { events?: Event[] }) => setEvents(data.events ?? []))
            .catch(() => {});
        }}
      />
    </>
  );
}
