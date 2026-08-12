import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventScopePage } from "@/components/EventScopePage";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORY_IDS, getCategoryMeta } from "@/lib/categories";
import { getCategorySeo } from "@/lib/category-seo";
import { categoryNavLinks } from "@/lib/event-navigation";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import {
  filterCatalogForScope,
  resolveScopeListingChrome,
} from "@/lib/scope-listing";
import {
  buildCategoryMetadata,
  buildListingPageJsonLd,
  localePath,
} from "@/lib/seo";
import type { EventCategory } from "@/lib/types";

export const revalidate = 120;

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    CATEGORY_IDS.map((id) => ({ locale, id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) return {};
  if (!CATEGORY_IDS.includes(id as EventCategory)) return {};

  return buildCategoryMetadata(locale, id as EventCategory);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) notFound();
  if (!CATEGORY_IDS.includes(id as EventCategory)) notFound();

  const dict = getDictionary(locale);
  const category = getCategoryMeta(id, dict.categories);
  const categorySeo = getCategorySeo(locale, id as EventCategory);
  const categoryId = id as EventCategory;
  const pagePath = localePath(locale, `/category/${id}`);
  // One region catalog powers SSR + instant city/category soft-nav.
  const catalog = await getPublicEvents({ locale });
  const events = filterCatalogForScope(catalog, {
    categoryId,
    regionScope: true,
  });
  const relatedCategoryLinks = categoryNavLinks(
    locale,
    dict.categories,
    null,
    catalog,
  );
  const chrome = resolveScopeListingChrome(locale, dict, {
    categoryId,
    regionScope: true,
  });

  return (
    <>
      {category ? (
        <JsonLd
          data={buildListingPageJsonLd(
            locale,
            pagePath,
            categorySeo,
            category.label,
            events,
            [
              { name: dict.seo.siteName, path: localePath(locale) },
              { name: category.label, path: pagePath },
            ],
          )}
        />
      ) : null}
      <EventScopePage
        locale={locale}
        dict={dict}
        initialEvents={events}
        catalogEvents={catalog}
        catalogFetchUrl={`/api/events?locale=${locale}`}
        fetchUrl={`/api/events?locale=${locale}&category=${id}`}
        returnTo={pagePath}
        title={chrome.title}
        intro={chrome.intro}
        emoji={chrome.emoji}
        emojiClassName={chrome.emojiClassName}
        submitDefaults={chrome.submitDefaults}
        relatedCategoryLinks={relatedCategoryLinks}
        relatedCategoryLinksLabel={dict.cities.browseTopCategories}
        relatedCategoryActiveHref={pagePath}
        categoryId={categoryId}
        regionScope
      />
    </>
  );
}
