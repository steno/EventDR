"use client";

import { useEffect, useState } from "react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { TimeRange } from "@/lib/filters";
import { FilteredEventList } from "@/components/FilteredEventList";
import {
  CityCategoryLinks,
  type RelatedCategoryLink,
} from "@/components/CityCategoryLinks";
import { CityLocationPicker } from "@/components/CityLocationPicker";
import { CityPhotoHero } from "@/components/CityPhotoHero";
import { SubmitEventSheet } from "@/components/SubmitEventSheet";
import { attachEventImages } from "@/lib/event-images";
import { StickyListHeader } from "@/components/StickyListHeader";
import { resolveBackLabel } from "@/lib/event-navigation";
import {
  getCityMeta,
  NORTH_COAST_HERO_IMAGE,
  type CitySlug,
} from "@/lib/cities";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";

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
  relatedCategoryActiveHref?: string;
  initialExpanded?: boolean;
  citySlug?: CitySlug;
  /** When set, the location picker switches cities while staying on this category. */
  categoryId?: Event["category"];
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
  addEventLabel = dict.submit.createEvent,
  submitDefaults,
  relatedCategoryLinks,
  relatedCategoryLinksLabel,
  relatedCategoryActiveHref,
  initialExpanded = false,
  citySlug,
  categoryId,
}: EventScopePageProps) {
  const [events, setEvents] = useState<Event[]>(() => attachEventImages(initialEvents));
  const [loading, setLoading] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data: { events?: Event[] }) =>
        setEvents(attachEventImages(data.events ?? [])),
      )
      .catch(() => setEvents(attachEventImages(initialEvents)))
      .finally(() => setLoading(false));
  }, [fetchUrl, initialEvents]);

  const city = citySlug ? getCityMeta(citySlug) : undefined;
  // City pages use place photos; region category pages use the North Coast hero.
  const scopeHeroImage =
    city?.heroImage ?? (categoryId ? NORTH_COAST_HERO_IMAGE : undefined);
  const headerEmojiClassName =
    emojiClassName ??
    "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800";
  const backLabel = resolveBackLabel(locale, backHref, dict);

  return (
    <>
      <main className="relative bg-neutral-50 dark:bg-transparent pb-6">
        <div className={PAGE_SHELL_CLASS}>
          <StickyListHeader
            locale={locale}
            dict={dict}
            backHref={backHref}
            backLabel={backLabel}
            flushBottom={Boolean(scopeHeroImage)}
          />

          {scopeHeroImage ? (
            <CityPhotoHero
              title={title}
              eyebrow={subtitle}
              subtitle={intro}
              imageUrl={scopeHeroImage}
            />
          ) : (
            <>
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

              <p className="text-copy-lead mb-6">{intro}</p>
            </>
          )}

          {citySlug || categoryId ? (
            <CityLocationPicker
              locale={locale}
              dict={dict}
              currentSlug={citySlug ?? null}
              categoryId={categoryId}
            />
          ) : null}

          {relatedCategoryLinks && relatedCategoryLinksLabel ? (
            <CityCategoryLinks
              label={relatedCategoryLinksLabel}
              links={relatedCategoryLinks}
              activeHref={relatedCategoryActiveHref}
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
            initialExpanded={initialExpanded}
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
            .then((data: { events?: Event[] }) =>
              setEvents(attachEventImages(data.events ?? [])),
            )
            .catch(() => {});
        }}
      />
    </>
  );
}
