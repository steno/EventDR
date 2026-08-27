import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VenuePage } from "@/components/VenuePage";
import { JsonLd } from "@/components/JsonLd";
import { getVenueBySlug } from "@/lib/venues";
import { getVenueAssessment } from "@/lib/venue-assessments";
import { getNearbyTonightForVenue } from "@/lib/get-nearby-tonight";
import { getPublicEvents } from "@/lib/public-events";
import { VENUE_AUDIENCE_POOLS } from "@/lib/home-layout";
import { SEED_VENUES } from "@/lib/venues-seed";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  buildVenueMetadata,
  localePath,
} from "@/lib/seo";

export const revalidate = 120;

const PREBUILD_VENUE_SLUGS = new Set([
  ...VENUE_AUDIENCE_POOLS.local,
  ...VENUE_AUDIENCE_POOLS.visitor,
]);

export async function generateStaticParams() {
  // Home-slider venues only. Prebuilding ~100 slugs × 3 locales plus
  // next/image on unique JPEGs SIGKILL'd Netlify (8GB). The rest ISR.
  return locales.flatMap((locale) =>
    SEED_VENUES.filter((venue) => PREBUILD_VENUE_SLUGS.has(venue.slug)).map(
      (venue) => ({ locale, slug: venue.slug }),
    ),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const venue = await getVenueBySlug(slug, locale);
  if (!venue) return {};

  const dict = getDictionary(locale);
  return buildVenueMetadata(locale, dict, venue);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const venue = await getVenueBySlug(slug, locale);
  if (!venue) notFound();

  const dict = getDictionary(locale);
  const [assessment, nearbyTonight, events] = await Promise.all([
    getVenueAssessment(slug),
    getNearbyTonightForVenue(venue, locale),
    getPublicEvents({
      locale,
      venueSlug: venue.slug,
      includePast: true,
    }),
  ]);

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
        assessment={assessment}
        nearbyTonight={nearbyTonight}
        initialEvents={events}
      />
    </>
  );
}
