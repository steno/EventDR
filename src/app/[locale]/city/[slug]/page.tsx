import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventScopePage } from "@/components/EventScopePage";
import { JsonLd } from "@/components/JsonLd";
import {
  CITY_SLUGS,
  getCityMeta,
  getCityName,
  isCitySlug,
} from "@/lib/cities";
import { categoryNavLinks } from "@/lib/event-navigation";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import {
  filterCatalogForScope,
  resolveScopeListingChrome,
} from "@/lib/scope-listing";
import {
  buildCityMetadata,
  buildListingPageJsonLd,
  cityListingSeo,
  localePath,
} from "@/lib/seo";

export const revalidate = 120;

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    CITY_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  if (!isCitySlug(slug)) return {};

  const city = getCityMeta(slug);
  if (!city) return {};

  const catalog = await getPublicEvents({ locale });
  const events = filterCatalogForScope(catalog, { citySlug: slug });
  return buildCityMetadata(locale, city, events);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  if (!isCitySlug(slug)) notFound();

  const city = getCityMeta(slug);
  if (!city) notFound();

  const dict = getDictionary(locale);
  const cityName = getCityName(city, locale);
  const cityPath = localePath(locale, `/city/${slug}`);
  const catalog = await getPublicEvents({ locale });
  const events = filterCatalogForScope(catalog, { citySlug: slug });
  const citySeo = cityListingSeo(locale, city, events);
  const relatedCategoryLinks = categoryNavLinks(
    locale,
    dict.categories,
    slug,
    events,
  );
  const chrome = resolveScopeListingChrome(locale, dict, { citySlug: slug });

  return (
    <>
      <JsonLd
        data={buildListingPageJsonLd(
          locale,
          cityPath,
          citySeo,
          cityName,
          events,
          [
            { name: dict.seo.siteName, path: localePath(locale) },
            { name: cityName, path: cityPath },
          ],
        )}
      />
      <EventScopePage
        locale={locale}
        dict={dict}
        initialEvents={events}
        catalogEvents={catalog}
        catalogFetchUrl={`/api/events?locale=${locale}`}
        fetchUrl={`/api/events?locale=${locale}&city=${slug}`}
        returnTo={cityPath}
        title={chrome.title}
        intro={chrome.intro}
        emoji={chrome.emoji}
        submitDefaults={chrome.submitDefaults}
        relatedCategoryLinks={relatedCategoryLinks}
        relatedCategoryLinksLabel={dict.cities.browseTopCategories}
        citySlug={slug}
      />
    </>
  );
}
