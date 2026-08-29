import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { VenuePage } from "@/components/VenuePage";
import { JsonLd } from "@/components/JsonLd";
import { getVenueBySlug } from "@/lib/venues";
import { getVenueAssessment } from "@/lib/venue-assessments";
import { getNearbyTonightForVenue } from "@/lib/get-nearby-tonight";
import { getPublicEvents } from "@/lib/public-events";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  buildBreadcrumbJsonLd,
  buildLocalBusinessJsonLd,
  buildVenueMetadata,
  localePath,
} from "@/lib/seo";

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  // Do not prebuild venues. ~80 home-slider slugs × 3 locales plus next/image
  // on unique JPEGs SIGKILL'd Netlify's 8GB box (worker exit at ~111/447).
  // First request ISR-fills the page (revalidate=120).
  return [];
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
