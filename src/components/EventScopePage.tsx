"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
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
import { allEventsPath, resolveBackLabel } from "@/lib/event-navigation";
import {
  getCityMeta,
  lastHomePath,
  NORTH_COAST_HERO_IMAGE,
  type CitySlug,
} from "@/lib/cities";
import { getCategoryHeroImage } from "@/lib/category-heroes";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import { getOnboardingCopy } from "@/lib/onboarding";
import { useForegroundRefresh } from "@/hooks/useForegroundRefresh";

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
  /** Region-wide listing (North Coast) — shows area picker + coastal hero. */
  regionScope?: boolean;
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
  regionScope = false,
}: EventScopePageProps) {
  const [events, setEvents] = useState<Event[]>(() => attachEventImages(initialEvents));
  const [loading, setLoading] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const fetchUrlRef = useRef(fetchUrl);
  const initialEventsRef = useRef(initialEvents);
  const skipMountFetch = useRef(initialEvents.length > 0);
  initialEventsRef.current = initialEvents;

  const softRefreshEvents = useCallback(() => {
    const url = fetchUrlRef.current;
    fetch(url, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { events?: Event[] }) => {
        setEvents(attachEventImages(data.events ?? []));
      })
      .catch(() => {});
  }, []);

  // Trust SSR when present; refetch only when the scope URL changes (or SSR was empty).
  useEffect(() => {
    const urlChanged = fetchUrlRef.current !== fetchUrl;
    fetchUrlRef.current = fetchUrl;

    if (skipMountFetch.current && !urlChanged) {
      skipMountFetch.current = false;
      return;
    }
    skipMountFetch.current = false;

    // Swap in the new scope's SSR events immediately — never blank the list with a
    // loading flash while the client refetch runs (area-chip navigations).
    const ssrEvents = attachEventImages(initialEventsRef.current);
    setEvents(ssrEvents);

    let cancelled = false;
    if (ssrEvents.length === 0) setLoading(true);
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

  useForegroundRefresh(softRefreshEvents);

  const city = citySlug ? getCityMeta(citySlug) : undefined;
  // Topic photo when set; else place photo; else regional hero for when-scopes.
  const scopeHeroImage =
    getCategoryHeroImage(categoryId) ??
    city?.heroImage ??
    (categoryId || fixedTimeRange || regionScope
      ? NORTH_COAST_HERO_IMAGE
      : undefined);
  const showLocationPicker = Boolean(
    citySlug || categoryId || fixedTimeRange || regionScope,
  );
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
  const onboardingCopy = getOnboardingCopy(locale);

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
              allLink={{
                href: allEventsPath(locale, citySlug ?? null),
                label: dict.browse.allEvents,
                emoji: "📅",
              }}
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
            categoryId={categoryId}
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
          {fixedTimeRange === "weekend" ? (
            <aside className="mb-8 mt-6 overflow-hidden rounded-3xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900/60 dark:bg-orange-950/30">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-orange-700 dark:text-orange-300">
                <Building2 className="h-4 w-4" aria-hidden />
                {onboardingCopy.partner.weekendEyebrow}
              </p>
              <h2 className="mt-2 text-xl font-black tracking-tight text-neutral-950 dark:text-neutral-50">
                {onboardingCopy.partner.weekendTitle}
              </h2>
              <p className="mt-1.5 max-w-xl text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-300">
                {onboardingCopy.partner.weekendBody}
              </p>
              <Link
                href={`/${locale}/for-partners`}
                className="mt-4 inline-flex min-h-11 items-center rounded-full bg-neutral-950 px-4 text-sm font-bold text-white transition-transform active:scale-[0.98] dark:bg-white dark:text-neutral-950"
              >
                {onboardingCopy.partner.weekendCta}
              </Link>
            </aside>
          ) : null}
        </div>
      </main>

      <SubmitEventSheet
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        dict={dict}
        locale={locale}
        defaults={submitDefaults}
        onSubmitted={() => {
          softRefreshEvents();
        }}
      />
    </>
  );
}
