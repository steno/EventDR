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
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import { isScopeInitiallyExpanded } from "@/lib/home-layout";
import {
  buildCityCategoryMetadata,
  buildListingPageJsonLd,
  localePath,
} from "@/lib/seo";
import type { EventCategory } from "@/lib/types";

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
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string; id: string }>;
  searchParams: Promise<{ all?: string }>;
}) {
  const { locale, slug, id } = await params;
  const { all } = await searchParams;
  if (!isValidLocale(locale)) notFound();
  if (!isCitySlug(slug)) notFound();
  if (!CATEGORY_IDS.includes(id as EventCategory)) notFound();

  const city = getCityMeta(slug);
  if (!city) notFound();

  const dict = getDictionary(locale);
  const category = getCategoryMeta(id, dict.categories);
  if (!category) notFound();

  const cityName = getCityName(city, locale);
  const seo = getCityCategorySeo(locale, city, id as EventCategory, category.label);
  const pagePath = localePath(locale, `/city/${slug}/category/${id}`);
  const cityPath = localePath(locale, `/city/${slug}`);
  const events = await getPublicEvents({
    locale,
    city: slug,
    category: id as EventCategory,
  });
  const title = `${category.label} — ${cityName}`;

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
        fetchUrl={`/api/events?locale=${locale}&city=${slug}&category=${id}`}
        returnTo={pagePath}
        backHref={cityPath}
        title={title}
        intro={seo.intro}
        sectionTitle={title}
        emoji={category.emoji}
        emojiClassName={`bg-gradient-to-br ${category.gradient}`}
        submitDefaults={{ category: id as EventCategory, location: cityName }}
        initialExpanded={isScopeInitiallyExpanded(all)}
        citySlug={slug}
      />
    </>
  );
}
