import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventScopePage } from "@/components/EventScopePage";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORY_IDS, getCategoryMeta } from "@/lib/categories";
import { categoryNavLinks } from "@/lib/event-navigation";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import {
  filterCatalogForScope,
  resolveScopeListingChrome,
} from "@/lib/scope-listing";
import {
  buildCategoryMetadata,
  buildListingPageJsonLd,
  categoryListingSeo,
  localePath,
} from "@/lib/seo";
import type { EventCategory } from "@/lib/types";

// ISR on first request, same as /venue/[slug]. Do not export
// generateStaticParams — prebuilding 12×3 category pages (each embedding the
// region catalog for soft-nav) SIGKILL'd Netlify's 8GB SSG worker after the
// catalog-aware SEO metadata pass.
export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) return {};
  if (!CATEGORY_IDS.includes(id as EventCategory)) return {};

  const catalog = await getPublicEvents({ locale });
  const events = filterCatalogForScope(catalog, {
    categoryId: id as EventCategory,
    regionScope: true,
  });
  return buildCategoryMetadata(locale, id as EventCategory, events);
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
  const categoryId = id as EventCategory;
  const pagePath = localePath(locale, `/category/${id}`);
  // One region catalog powers SSR + instant city/category soft-nav.
  const catalog = await getPublicEvents({ locale });
  const events = filterCatalogForScope(catalog, {
    categoryId,
    regionScope: true,
  });
  const categorySeo = categoryListingSeo(locale, categoryId, events);
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
