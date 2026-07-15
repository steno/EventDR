"use client";

import { useEffect, useRef, useState } from "react";
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
  lastHomePath,
  NORTH_COAST_HERO_IMAGE,
  type CitySlug,
} from "@/lib/cities";
import { getCategoryHeroImage } from "@/lib/category-heroes";
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
  /** Optional list label — omit when the page title already names the list. */
  sectionTitle?: string;
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
  backHref: backHrefProp,
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
  const fetchUrlRef = useRef(fetchUrl);
  const initialEventsRef = useRef(initialEvents);
  const skipMountFetch = useRef(initialEvents.length > 0);
  initialEventsRef.current = initialEvents;

  // Trust SSR when present; refetch only when the scope URL changes (or SSR was empty).
  useEffect(() => {
    const urlChanged = fetchUrlRef.current !== fetchUrl;
    fetchUrlRef.current = fetchUrl;

    if (skipMountFetch.current && !urlChanged) {
      skipMountFetch.current = false;
      return;
    }
    skipMountFetch.current = false;

    let cancelled = false;
    setLoading(true);
    fetch(fetchUrl, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { events?: Event[] }) => {
        if (!cancelled) setEvents(attachEventImages(data.events ?? []));
      })
      .catch(() => {
        if (!cancelled) setEvents(attachEventImages(initialEventsRef.current));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchUrl]);

  const city = citySlug ? getCityMeta(citySlug) : undefined;
  // Topic photo when set; else place photo; else regional hero for when-scopes.
  const scopeHeroImage =
    getCategoryHeroImage(categoryId) ??
    city?.heroImage ??
    (categoryId || fixedTimeRange ? NORTH_COAST_HERO_IMAGE : undefined);
  const showLocationPicker = Boolean(citySlug || categoryId || fixedTimeRange);
  const headerEmojiClassName =
    emojiClassName ??
    "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800";
  const [backHref, setBackHref] = useState(backHrefProp ?? `/${locale}`);

  // Refresh when area changes via the location picker (session lastHomePath).
  useEffect(() => {
    if (backHrefProp) {
      setBackHref(backHrefProp);
      return;
    }
    setBackHref(lastHomePath(locale));
  }, [backHrefProp, locale, citySlug]);

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
            locationPicker={
              showLocationPicker ? (
                <CityLocationPicker
                  locale={locale}
                  dict={dict}
                  currentSlug={citySlug ?? null}
                  categoryId={categoryId}
                />
              ) : undefined
            }
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
