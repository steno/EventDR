"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { RestaurantWeekPromo } from "@/components/RestaurantWeekPromo";
import { SubmitEventSheet } from "@/components/SubmitEventSheet";
import { StickyListHeader } from "@/components/StickyListHeader";
import { categoryNavLinks, resolveListingBackLabel } from "@/lib/event-navigation";
import {
  getCityMeta,
  lastHomePath,
  NORTH_COAST_HERO_IMAGE,
  writeHomeArea,
  getCityName,
  type CitySlug,
} from "@/lib/cities";
import { getCategoryHeroImage } from "@/lib/category-heroes";
import { isHomeHeroBackgroundSuitable } from "@/lib/event-images";
import { getFallbackEventById } from "@/lib/fallback-events";
import {
  isRestaurantWeekPromoActive,
  RESTAURANT_WEEK_2026_ID,
} from "@/lib/restaurant-week";
import { findActiveSpecialEvent } from "@/lib/special-events";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import { getOnboardingCopy } from "@/lib/onboarding";
import { useForegroundRefresh } from "@/hooks/useForegroundRefresh";
import {
  cityCountsForSelection,
  filterCatalogForScope,
  normalizeScopeSelection,
  parseScopeListingPath,
  resolveScopeListingChrome,
  scopeListingPath,
  selectionFromPathname,
  type ScopeListingSelection,
} from "@/lib/scope-listing";
import { signalNavDone } from "@/lib/nav-feedback";

interface EventScopePageProps {
  locale: Locale;
  dict: Dictionary;
  initialEvents: Event[];
  /**
   * Wider catalog for instant city/category soft-nav (usually region-wide).
   * When omitted, soft scope switching is disabled and the page refetches on
   * hard navigations only via foreground refresh.
   */
  catalogEvents?: Event[];
  /** Unscoped (or when-scoped) list API used to refresh the soft-nav catalog. */
  catalogFetchUrl?: string;
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

function selectionFromProps(
  citySlug: CitySlug | undefined,
  categoryId: Event["category"] | undefined,
  regionScope: boolean,
): ScopeListingSelection {
  return normalizeScopeSelection({
    citySlug,
    categoryId,
    regionScope,
  });
}

export function EventScopePage({
  locale,
  dict,
  initialEvents,
  catalogEvents,
  catalogFetchUrl,
  fetchUrl,
  returnTo: returnToProp,
  title: titleProp,
  subtitle = dict.region.northCoast,
  intro: introProp,
  sectionTitle,
  emoji: emojiProp = "📅",
  emojiClassName: emojiClassNameProp,
  backHref: backHrefProp,
  emptyMessage = dict.browse.noEvents,
  fixedTimeRange,
  addEventLabel = dict.submit.createEvent,
  submitDefaults: submitDefaultsProp,
  relatedCategoryLinks: relatedCategoryLinksProp,
  relatedCategoryLinksLabel,
  relatedCategoryActiveHref: relatedCategoryActiveHrefProp,
  initialExpanded = false,
  citySlug,
  categoryId,
  regionScope = false,
}: EventScopePageProps) {
  const softNav = Boolean(catalogEvents && !fixedTimeRange);

  const [selection, setSelection] = useState<ScopeListingSelection>(() => {
    const fromProps = selectionFromProps(citySlug, categoryId, regionScope);
    // Soft-nav pushState leaves Next props on the first hard-nav category.
    // After detail→back the URL still has the last pill — prefer it.
    if (!softNav || typeof window === "undefined") return fromProps;
    return selectionFromPathname(window.location.pathname, locale, fromProps);
  });
  const [catalog, setCatalog] = useState<Event[]>(
    () => catalogEvents ?? initialEvents,
  );
  const [loading, setLoading] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);

  const catalogFetchUrlRef = useRef(catalogFetchUrl ?? fetchUrl);
  const fetchUrlRef = useRef(fetchUrl);
  catalogFetchUrlRef.current = catalogFetchUrl ?? fetchUrl;
  fetchUrlRef.current = fetchUrl;

  // Recover soft-nav category before paint when Next remounts with stale props
  // (history.back from an event keeps the soft-nav URL, not the RSC category).
  useLayoutEffect(() => {
    if (!softNav) return;
    const fromProps = selectionFromProps(citySlug, categoryId, regionScope);
    setSelection(
      selectionFromPathname(window.location.pathname, locale, fromProps),
    );
    // Mount / softNav only — URL wins over the first hard-nav RSC props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [softNav, locale]);

  // Sync from RSC when a real route transition remounts/replaces props
  // (e.g. home → category, or when-page entry). Soft-nav updates selection
  // locally without waiting on this — and must not wipe a newer URL scope.
  useEffect(() => {
    const fromProps = selectionFromProps(citySlug, categoryId, regionScope);
    setCatalog(catalogEvents ?? initialEvents);
    if (!softNav) {
      setSelection(fromProps);
      return;
    }
    const fromUrl = selectionFromPathname(
      window.location.pathname,
      locale,
      fromProps,
    );
    if (
      scopeListingPath(locale, fromUrl) !== scopeListingPath(locale, fromProps)
    ) {
      setSelection(fromUrl);
      return;
    }
    setSelection(fromProps);
  }, [
    citySlug,
    categoryId,
    regionScope,
    catalogEvents,
    initialEvents,
    softNav,
    locale,
  ]);

  const softRefreshEvents = useCallback(() => {
    const url = softNav ? catalogFetchUrlRef.current : fetchUrlRef.current;
    fetch(url)
      .then((response) => response.json())
      .then((data: { events?: Event[] }) => {
        setCatalog(data.events ?? []);
      })
      .catch(() => {});
  }, [softNav]);

  // Trust SSR for first paint. Only fetch when SSR handed us an empty list
  // (cold cache / error) — never refetch after every category/city soft-nav.
  useEffect(() => {
    if (softNav) {
      if (catalogEvents && catalogEvents.length > 0) return;
      let cancelled = false;
      setLoading(true);
      fetch(catalogFetchUrlRef.current)
        .then((response) => response.json())
        .then((data: { events?: Event[] }) => {
          if (!cancelled) setCatalog(data.events ?? []);
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }

    if (initialEvents.length > 0) return;

    let cancelled = false;
    setLoading(true);
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data: { events?: Event[] }) => {
        if (!cancelled) setCatalog(data.events ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // Mount / softNav mode only — prop-driven catalog sync is handled above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [softNav]);

  useForegroundRefresh(softRefreshEvents);

  // Browser back/forward after soft city/category swaps.
  useEffect(() => {
    if (!softNav) return;

    const onPopState = () => {
      const parsed = parseScopeListingPath(window.location.pathname, locale);
      if (!parsed) return;
      setSelection(normalizeScopeSelection(parsed));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [softNav, locale]);

  const applySoftSelection = useCallback(
    (next: ScopeListingSelection, mode: "push" | "replace" = "push") => {
      const href = scopeListingPath(locale, next);
      setSelection(next);
      writeHomeArea(next.citySlug ?? null);
      if (href === window.location.pathname) {
        signalNavDone();
        return;
      }
      if (mode === "replace") {
        window.history.replaceState(window.history.state ?? null, "", href);
      } else {
        window.history.pushState(window.history.state ?? null, "", href);
      }
      // Soft-nav never updates Next pathname — clear any stray progress chrome.
      signalNavDone();
    },
    [locale],
  );

  const onSoftCitySelect = useCallback(
    (slug: CitySlug | null) => {
      applySoftSelection({
        citySlug: slug ?? undefined,
        categoryId: selection.categoryId,
        regionScope: !slug && !selection.categoryId,
      });
    },
    [applySoftSelection, selection.categoryId],
  );

  const onSoftCategoryNavigate = useCallback(
    (href: string) => {
      try {
        const url = new URL(href, window.location.origin);
        const parsed = parseScopeListingPath(url.pathname, locale);
        if (!parsed) return false;
        applySoftSelection(normalizeScopeSelection(parsed));
        return true;
      } catch {
        return false;
      }
    },
    [applySoftSelection, locale],
  );

  const chrome = useMemo(() => {
    if (!softNav) {
      return {
        title: titleProp,
        eyebrow: subtitle,
        intro: introProp,
        emoji: emojiProp,
        emojiClassName: emojiClassNameProp,
        returnTo: returnToProp,
        backHref: backHrefProp,
        submitDefaults: submitDefaultsProp,
      };
    }
    return resolveScopeListingChrome(locale, dict, selection);
  }, [
    softNav,
    locale,
    dict,
    selection,
    titleProp,
    subtitle,
    introProp,
    emojiProp,
    emojiClassNameProp,
    returnToProp,
    backHrefProp,
    submitDefaultsProp,
  ]);

  const events = useMemo(() => {
    if (!softNav) return catalog;
    return filterCatalogForScope(catalog, selection);
  }, [softNav, catalog, selection]);

  const activeCitySlug = softNav ? selection.citySlug : citySlug;
  const activeCategoryId = softNav ? selection.categoryId : categoryId;
  const activeRegionScope = softNav
    ? Boolean(selection.regionScope) ||
      (!selection.citySlug && !selection.categoryId)
    : regionScope;

  const relatedCategoryLinks = useMemo(() => {
    const venuesLink = {
      href: `/${locale}/venues`,
      label: dict.venues.directory.title,
      emoji: "📍",
    };
    const base = (() => {
      if (!softNav) return relatedCategoryLinksProp ?? [];
      // Order by region-wide counts so switching area does not reshuffle
      // pills under a selected category (hrefs still update per city).
      return categoryNavLinks(
        locale,
        dict.categories,
        selection.citySlug ?? null,
        catalog,
      );
    })();
    if (base.some((link) => link.href === venuesLink.href)) return base;
    return [...base, venuesLink];
  }, [
    softNav,
    relatedCategoryLinksProp,
    catalog,
    selection.citySlug,
    locale,
    dict.categories,
    dict.venues.directory.title,
  ]);

  const relatedCategoryActiveHref = softNav
    ? activeCategoryId
      ? scopeListingPath(locale, {
          categoryId: activeCategoryId,
          citySlug: activeCitySlug,
        })
      : undefined
    : relatedCategoryActiveHrefProp;

  const cityCounts = useMemo(
    () =>
      catalog.length > 0
        ? cityCountsForSelection(catalog, {
            categoryId: activeCategoryId,
          })
        : null,
    [catalog, activeCategoryId],
  );
  const city = activeCitySlug ? getCityMeta(activeCitySlug) : undefined;
  const areaLabel = city
    ? getCityName(city, locale)
    : activeRegionScope
      ? dict.region.name
      : null;
  const specialHeroEvent = useMemo(() => {
    // Food & Drinks: pin Restaurant Week calendar art while the campaign is live
    // (calendar is typography-heavy, so we bypass the scene-hero allowlist).
    if (
      activeCategoryId === "food-drinks" &&
      isRestaurantWeekPromoActive(locale)
    ) {
      const fromList = events.find(
        (event) => event.id === RESTAURANT_WEEK_2026_ID,
      );
      const fromSeed = getFallbackEventById(RESTAURANT_WEEK_2026_ID, locale);
      const rw = fromList ?? fromSeed;
      if (rw?.imageUrl?.trim()) return rw;
    }
    if (activeCitySlug) {
      return findActiveSpecialEvent(events, {
        placement: "city-hero",
        citySlug: activeCitySlug,
      });
    }
    if (activeRegionScope || fixedTimeRange) {
      return findActiveSpecialEvent(events, { placement: "home-hero" });
    }
    return null;
  }, [
    events,
    activeCitySlug,
    activeRegionScope,
    fixedTimeRange,
    activeCategoryId,
    locale,
  ]);

  const restaurantWeekHero =
    activeCategoryId === "food-drinks" &&
    specialHeroEvent?.id === RESTAURANT_WEEK_2026_ID;

  const specialHeroImage =
    specialHeroEvent &&
    (restaurantWeekHero ||
      isHomeHeroBackgroundSuitable(
        specialHeroEvent.id,
        specialHeroEvent.imageUrl,
      ))
      ? specialHeroEvent.imageUrl?.trim()
      : undefined;
  const scopeHeroImage =
    specialHeroImage ||
    getCategoryHeroImage(activeCategoryId) ||
    city?.heroImage ||
    (activeCategoryId || fixedTimeRange || activeRegionScope
      ? NORTH_COAST_HERO_IMAGE
      : undefined);
  const showRestaurantWeekStrip =
    activeCategoryId === "food-drinks" &&
    isRestaurantWeekPromoActive(locale);
  const showLocationPicker = Boolean(
    activeCitySlug || activeCategoryId || fixedTimeRange || activeRegionScope,
  );
  const headerEmojiClassName =
    chrome.emojiClassName ??
    emojiClassNameProp ??
    "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800";
  const [backHref, setBackHref] = useState(
    chrome.backHref ?? backHrefProp ?? `/${locale}`,
  );

  useEffect(() => {
    if (chrome.backHref) {
      setBackHref(chrome.backHref);
      return;
    }
    if (backHrefProp) {
      setBackHref(backHrefProp);
      return;
    }
    setBackHref(lastHomePath(locale));
  }, [chrome.backHref, backHrefProp, locale, activeCitySlug]);

  const backLabel = resolveListingBackLabel(
    locale,
    backHref,
    dict,
    activeCitySlug,
  );
  const onboardingCopy = getOnboardingCopy(locale);
  const title = chrome.title;
  const intro = chrome.intro;
  const eyebrow = chrome.eyebrow;
  const emoji = chrome.emoji;
  const returnTo = chrome.returnTo;
  const submitDefaults = chrome.submitDefaults ?? submitDefaultsProp;

  // Keep the document title in sync during soft scope swaps (SEO pages set it on SSR).
  useEffect(() => {
    if (!softNav || typeof document === "undefined") return;
    document.title = `${title} | POP Events`;
  }, [softNav, title]);

  return (
    <>
      <main className="relative bg-background dark:bg-transparent pb-6">
        <div className={PAGE_SHELL_CLASS}>
          <StickyListHeader
            locale={locale}
            dict={dict}
            backHref={backHref}
            backLabel={backLabel}
            flushBottom={Boolean(scopeHeroImage)}
            variant="compact"
          />

          {scopeHeroImage ? (
            <CityPhotoHero
              key={activeCitySlug ?? "north-coast"}
              title={title}
              eyebrow={
                restaurantWeekHero
                  ? dict.events.restaurantWeek.eyebrow
                  : eyebrow
              }
              subtitle={
                restaurantWeekHero
                  ? `${dict.events.restaurantWeek.dates} · ${dict.events.restaurantWeek.priceLine}`
                  : intro
              }
              imageUrl={scopeHeroImage}
              featuredEvent={specialHeroImage ? specialHeroEvent : null}
              locale={locale}
              dict={dict}
              returnTo={returnTo}
            />
          ) : (
            <>
              {showLocationPicker ? (
                <div className="sr-only sm:hidden">
                  <h1>{title}</h1>
                  {intro ? <p>{intro}</p> : null}
                </div>
              ) : null}
              <div
                className={
                  showLocationPicker ? "mb-6 hidden sm:block" : "mb-6"
                }
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-sm ${headerEmojiClassName}`}
                  >
                    {emoji}
                  </div>
                  <div>
                    <h1 className="text-title font-extrabold text-neutral-900 dark:text-neutral-100">
                      {title}
                    </h1>
                    <p className="text-copy-meta text-neutral-500 dark:text-neutral-400">
                      {eyebrow}
                    </p>
                  </div>
                </div>
                <p className="text-copy-lead mt-6">{intro}</p>
              </div>
            </>
          )}

          {relatedCategoryLinks && relatedCategoryLinksLabel ? (
            <CityCategoryLinks
              label={relatedCategoryLinksLabel}
              links={relatedCategoryLinks}
              activeHref={relatedCategoryActiveHref}
              activeCategoryId={activeCategoryId}
              allLink={{
                id: "all",
                href: scopeListingPath(locale, {
                  citySlug: activeCitySlug,
                  regionScope: !activeCitySlug,
                }),
                label: dict.browse.allEvents,
                emoji: "📅",
              }}
              onSoftNavigate={softNav ? onSoftCategoryNavigate : undefined}
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
            categoryId={activeCategoryId}
            areaLabel={areaLabel}
            persistTimeRange
            listLead={
              showRestaurantWeekStrip ? (
                <RestaurantWeekPromo
                  locale={locale}
                  dict={dict}
                  returnTo={returnTo}
                  variant="compact"
                />
              ) : undefined
            }
            stickyLead={
              showLocationPicker ? (
                <div className="w-full text-[1.5rem] font-extrabold leading-none sm:hidden">
                  <CityLocationPicker
                    variant="hero"
                    photoOverlay={false}
                    locale={locale}
                    dict={dict}
                    currentSlug={activeCitySlug ?? null}
                    categoryId={activeCategoryId}
                    onSelect={softNav ? onSoftCitySelect : undefined}
                    counts={cityCounts}
                  />
                </div>
              ) : undefined
            }
            locationPicker={
              showLocationPicker ? (
                <div className="hidden sm:block">
                  <CityLocationPicker
                    locale={locale}
                    dict={dict}
                    currentSlug={activeCitySlug ?? null}
                    categoryId={activeCategoryId}
                    onSelect={softNav ? onSoftCitySelect : undefined}
                    counts={cityCounts}
                  />
                </div>
              ) : undefined
            }
          />
          {fixedTimeRange === "weekend" ? (
            <aside className="mb-8 mt-6 overflow-hidden rounded-3xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900/60 dark:bg-orange-950/30">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-300">
                <Building2 className="h-4 w-4" aria-hidden />
                {onboardingCopy.partner.weekendEyebrow}
              </p>
              <h2 className="mt-2 text-section font-extrabold text-neutral-950 dark:text-neutral-50">
                {onboardingCopy.partner.weekendTitle}
              </h2>
              <p className="mt-1.5 max-w-xl text-copy font-medium text-neutral-600 dark:text-neutral-300">
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
