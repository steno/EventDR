import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventScopePage } from "@/components/EventScopePage";
import { JsonLd } from "@/components/JsonLd";
import {
  getCityMeta,
  getCityName,
  isCitySlug,
  type CitySlug,
} from "@/lib/cities";
import { categoryNavLinks } from "@/lib/event-navigation";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import {
  buildCityWhenMetadata,
  buildListingPageJsonLd,
  cityWhenListingSeo,
  localePath,
} from "@/lib/seo";
import { sortEventsForDisplay } from "@/lib/event-sort";
import { eventsInWeekendOrder } from "@/lib/list-day-groups";
import { pinSpecialEvents } from "@/lib/special-events";
import { isWhenSlug, type WhenSlug } from "@/lib/time-seo";

/** Same list order as regional /when pages, scoped to one city. */
async function listedCityWhenEvents(
  locale: Locale,
  citySlug: CitySlug,
  range: WhenSlug,
) {
  const events = await getPublicEvents({
    locale,
    city: citySlug,
    when: range,
  });
  const sorted = sortEventsForDisplay(events, {
    recurringLast: true,
    oneTimeFirst: true,
    pinTodayOneOffs: true,
  });
  const pinned =
    range === "weekend"
      ? pinSpecialEvents(sorted, { placement: "weekend-list" })
      : sorted;
  return range === "weekend" ? eventsInWeekendOrder(pinned) : pinned;
}

// ISR on first request — same pattern as city×category (avoid SSG blowups).
export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; range: string }>;
}): Promise<Metadata> {
  const { locale, slug, range } = await params;
  if (!isValidLocale(locale)) return {};
  if (!isCitySlug(slug)) return {};
  if (!isWhenSlug(range)) return {};

  const city = getCityMeta(slug);
  if (!city) return {};

  const events = await listedCityWhenEvents(locale, slug, range);
  return buildCityWhenMetadata(locale, city, range, events);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string; range: string }>;
}) {
  const { locale, slug, range } = await params;
  if (!isValidLocale(locale)) notFound();
  if (!isCitySlug(slug)) notFound();
  if (!isWhenSlug(range)) notFound();

  const city = getCityMeta(slug);
  if (!city) notFound();

  const dict = getDictionary(locale);
  const cityName = getCityName(city, locale);
  const cityPath = localePath(locale, `/city/${slug}`);
  const pagePath = localePath(locale, `/city/${slug}/when/${range}`);
  const [listedEvents, cityCatalog] = await Promise.all([
    listedCityWhenEvents(locale, slug, range),
    getPublicEvents({ locale, city: slug }),
  ]);
  const pageSeo = cityWhenListingSeo(locale, city, range, listedEvents);
  const relatedCategoryLinks = categoryNavLinks(
    locale,
    dict.categories,
    slug,
    cityCatalog,
  );

  return (
    <>
      <JsonLd
        data={buildListingPageJsonLd(
          locale,
          pagePath,
          pageSeo,
          pageSeo.h1,
          listedEvents,
          [
            { name: dict.seo.siteName, path: localePath(locale) },
            { name: cityName, path: cityPath },
            { name: pageSeo.h1, path: pagePath },
          ],
        )}
      />
      <EventScopePage
        locale={locale}
        dict={dict}
        initialEvents={cityCatalog}
        fetchUrl={`/api/events?locale=${locale}&city=${slug}`}
        returnTo={pagePath}
        backHref={cityPath}
        title={pageSeo.h1}
        intro={pageSeo.intro}
        defaultTimeRange={range}
        citySlug={slug}
        relatedCategoryLinks={relatedCategoryLinks}
        relatedCategoryLinksLabel={dict.cities.browseTopCategories}
      />
    </>
  );
}
