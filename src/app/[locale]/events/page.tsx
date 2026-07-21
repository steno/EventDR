import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventScopePage } from "@/components/EventScopePage";
import { JsonLd } from "@/components/JsonLd";
import { categoryNavLinks } from "@/lib/event-navigation";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import {
  buildAlternates,
  buildListingPageJsonLd,
  defaultOpenGraph,
  defaultTwitter,
  fillTemplate,
  localePath,
} from "@/lib/seo";

export const revalidate = 120;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const dict = getDictionary(locale);
  const title = fillTemplate(dict.browse.eventsInPlace, {
    place: dict.cities.regionName,
  });
  const description = dict.browse.allCategoriesIntro;
  const alternates = buildAlternates(locale, "/events");

  return {
    title,
    description,
    alternates,
    openGraph: defaultOpenGraph(locale, {
      title,
      description,
      url: alternates.canonical,
    }),
    twitter: defaultTwitter({ title, description }),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const eventsPath = localePath(locale, "/events");
  const regionName = dict.cities.regionName;
  const title = fillTemplate(dict.browse.eventsInPlace, { place: regionName });
  const events = await getPublicEvents({ locale });
  const relatedCategoryLinks = categoryNavLinks(locale, dict.categories);
  const relatedCategoryLinksLabel = dict.cities.browseTopCategories;

  return (
    <>
      <JsonLd
        data={buildListingPageJsonLd(
          locale,
          eventsPath,
          {
            title,
            description: dict.browse.allCategoriesIntro,
          },
          title,
          events,
          [
            { name: dict.seo.siteName, path: localePath(locale) },
            { name: regionName, path: eventsPath },
          ],
        )}
      />
      <EventScopePage
        locale={locale}
        dict={dict}
        initialEvents={events}
        fetchUrl={`/api/events?locale=${locale}`}
        returnTo={eventsPath}
        title={title}
        intro={dict.browse.allCategoriesIntro}
        emoji="📅"
        relatedCategoryLinks={relatedCategoryLinks}
        relatedCategoryLinksLabel={relatedCategoryLinksLabel}
        regionScope
      />
    </>
  );
}
