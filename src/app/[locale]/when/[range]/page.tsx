import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventScopePage } from "@/components/EventScopePage";
import { JsonLd } from "@/components/JsonLd";
import { categoryNavLinks } from "@/lib/event-navigation";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import {
  buildListingPageJsonLd,
  buildWhenMetadata,
  localePath,
} from "@/lib/seo";
import { getWhenSeo, isWhenSlug, WHEN_SLUGS } from "@/lib/time-seo";

export const revalidate = 120;

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    WHEN_SLUGS.map((range) => ({ locale, range })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; range: string }>;
}): Promise<Metadata> {
  const { locale, range } = await params;
  if (!isValidLocale(locale)) return {};
  if (!isWhenSlug(range)) return {};

  return buildWhenMetadata(locale, range);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; range: string }>;
}) {
  const { locale, range } = await params;
  if (!isValidLocale(locale)) notFound();
  if (!isWhenSlug(range)) notFound();

  const dict = getDictionary(locale);
  const whenSeo = getWhenSeo(locale, range);
  const whenPath = localePath(locale, `/when/${range}`);
  const events = await getPublicEvents({ locale, when: range });
  const relatedCategoryLinks = categoryNavLinks(locale, dict.categories);
  const relatedCategoryLinksLabel = dict.cities.browseTopCategories;

  return (
    <>
      <JsonLd
        data={buildListingPageJsonLd(
          locale,
          whenPath,
          whenSeo,
          whenSeo.h1,
          events,
          [
            { name: dict.seo.siteName, path: localePath(locale) },
            { name: whenSeo.h1, path: whenPath },
          ],
        )}
      />
      <EventScopePage
        locale={locale}
        dict={dict}
        initialEvents={events}
        fetchUrl={`/api/events?locale=${locale}&when=${range}`}
        returnTo={whenPath}
        title={whenSeo.h1}
        intro={whenSeo.intro}
        fixedTimeRange={range}
        relatedCategoryLinks={relatedCategoryLinks}
        relatedCategoryLinksLabel={relatedCategoryLinksLabel}
      />
    </>
  );
}
