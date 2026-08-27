import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventScopePage } from "@/components/EventScopePage";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORY_IDS, getCategoryMeta } from "@/lib/categories";
import { getCityCategorySeo } from "@/lib/city-category-seo";
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
  buildCityCategoryMetadata,
  buildListingPageJsonLd,
  localePath,
} from "@/lib/seo";
import type { EventCategory } from "@/lib/types";

export const revalidate = 120;

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    CITY_SLUGS.flatMap((slug) =>
      CATEGORY_IDS.map((id) => ({ locale, slug, id })),
    ),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; id: string }>;
}): Promise<Metadata> {
  const { locale, slug, id } = await params;
  if (!isValidLocale(locale)) return {};
  if (!isCitySlug(slug)) return {};
  if (!CATEGORY_IDS.includes(id as EventCategory)) return {};

  const city = getCityMeta(slug);
  const dict = getDictionary(locale);
  const category = getCategoryMeta(id, dict.categories);
  if (!city || !category) return {};

  return buildCityCategoryMetadata(locale, city, id as EventCategory, category.label);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string; id: string }>;
}) {
  const { locale, slug, id } = await params;
  if (!isValidLocale(locale)) notFound();
  if (!isCitySlug(slug)) notFound();
  if (!CATEGORY_IDS.includes(id as EventCategory)) notFound();

  const city = getCityMeta(slug);
  if (!city) notFound();

  const dict = getDictionary(locale);
  const category = getCategoryMeta(id, dict.categories);
  if (!category) notFound();

  const cityName = getCityName(city, locale);
  const categoryId = id as EventCategory;
  const seo = getCityCategorySeo(locale, city, categoryId, category.label);
  const pagePath = localePath(locale, `/city/${slug}/category/${id}`);
  const cityPath = localePath(locale, `/city/${slug}`);
  const catalog = await getPublicEvents({ locale });
  const events = filterCatalogForScope(catalog, {
    citySlug: slug,
    categoryId,
  });
  const cityEvents = filterCatalogForScope(catalog, { citySlug: slug });
  const relatedCategoryLinks = categoryNavLinks(
    locale,
    dict.categories,
    slug,
    cityEvents,
  );
  const chrome = resolveScopeListingChrome(locale, dict, {
    citySlug: slug,
    categoryId,
  });

  return (
    <>
      <JsonLd
        data={buildListingPageJsonLd(
          locale,
          pagePath,
          seo,
          `${category.label} — ${cityName}`,
          events,
          [
            { name: dict.seo.siteName, path: localePath(locale) },
            { name: cityName, path: cityPath },
            { name: category.label, path: pagePath },
          ],
        )}
      />
      <EventScopePage
        locale={locale}
        dict={dict}
        initialEvents={events}
        catalogEvents={catalog}
        catalogFetchUrl={`/api/events?locale=${locale}`}
        fetchUrl={`/api/events?locale=${locale}&city=${slug}&category=${id}`}
        returnTo={pagePath}
        backHref={cityPath}
        title={chrome.title}
        intro={chrome.intro}
        emoji={chrome.emoji}
        emojiClassName={chrome.emojiClassName}
        submitDefaults={chrome.submitDefaults}
        relatedCategoryLinks={relatedCategoryLinks}
        relatedCategoryLinksLabel={dict.cities.browseTopCategories}
        relatedCategoryActiveHref={pagePath}
        citySlug={slug}
        categoryId={categoryId}
      />
    </>
  );
}
