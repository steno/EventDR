import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventScopePage } from "@/components/EventScopePage";
import { JsonLd } from "@/components/JsonLd";
import {
  CITY_SLUGS,
  getCityMeta,
  getCityName,
  getCitySeo,
  getCityTopCategories,
  isCitySlug,
} from "@/lib/cities";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import {
  buildCityMetadata,
  buildListingPageJsonLd,
  fillTemplate,
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

  return buildCityMetadata(locale, city);
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
  const citySeo = getCitySeo(city, locale);
  const cityName = getCityName(city, locale);
  const cityPath = localePath(locale, `/city/${slug}`);
  const eventsInCity = fillTemplate(dict.browse.eventsInPlace, { place: cityName });
  const events = await getPublicEvents({ locale, city: slug });
  const relatedCategoryLinks = getCityTopCategories(slug).map((categoryId) => ({
    href: `/${locale}/city/${slug}/category/${categoryId}`,
    label: dict.categories[categoryId],
  }));
  const relatedCategoryLinksLabel = fillTemplate(dict.cities.browseTopCategories, {
    city: cityName,
  });

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
        fetchUrl={`/api/events?locale=${locale}&city=${slug}`}
        returnTo={cityPath}
        title={eventsInCity}
        intro={citySeo.intro}
        emoji={city.emoji}
        submitDefaults={{ location: cityName }}
        relatedCategoryLinks={relatedCategoryLinks}
        relatedCategoryLinksLabel={relatedCategoryLinksLabel}
        citySlug={slug}
      />
    </>
  );
}
