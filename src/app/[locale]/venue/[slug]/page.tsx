import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VenuePage } from "@/components/VenuePage";
import { JsonLd } from "@/components/JsonLd";
import { fetchVenueBySlug } from "@/lib/firebase/events";
import { getSeedVenue, SEED_VENUES } from "@/lib/venues-seed";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  buildVenueMetadata,
  localePath,
} from "@/lib/seo";
import { isScopeInitiallyExpanded } from "@/lib/home-layout";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    SEED_VENUES.map((venue) => ({ locale, slug: venue.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const venue = (await fetchVenueBySlug(slug)) ?? getSeedVenue(slug);
  if (!venue) return {};

  const dict = getDictionary(locale);
  return buildVenueMetadata(locale, dict, venue);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ all?: string }>;
}) {
  const { locale, slug } = await params;
  const { all } = await searchParams;
  if (!isValidLocale(locale)) notFound();

  const venue = (await fetchVenueBySlug(slug)) ?? getSeedVenue(slug);
  if (!venue) notFound();

  const dict = getDictionary(locale);

  return (
    <>
      <JsonLd
        data={[
          buildLocalBusinessJsonLd(venue, locale),
          buildBreadcrumbJsonLd([
            { name: dict.seo.siteName, path: localePath(locale) },
            { name: venue.name, path: localePath(locale, `/venue/${venue.slug}`) },
          ]),
        ]}
      />
      <VenuePage
        venue={venue}
        locale={locale}
        dict={dict}
        initialExpanded={isScopeInitiallyExpanded(all)}
      />
    </>
  );
}
