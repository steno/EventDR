import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventsMapPage } from "@/components/EventsMapPage";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { eventsWithMapPins, slimEventsForMap } from "@/lib/map-events";
import { getPublicEvents } from "@/lib/public-events";
import { buildAlternates } from "@/lib/seo";

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
  return {
    title: dict.map.metaTitle,
    description: dict.map.metaDescription,
    alternates: buildAlternates(locale, "/map"),
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ venue?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const query = await searchParams;
  const venueRaw = query.venue;
  const initialVenueSlug =
    typeof venueRaw === "string"
      ? venueRaw
      : Array.isArray(venueRaw)
        ? venueRaw[0]
        : null;

  const dict = getDictionary(locale);
  const events = slimEventsForMap(
    eventsWithMapPins(await getPublicEvents({ locale })),
  );

  return (
    <>
      <link
        rel="preconnect"
        href="https://tiles.openfreemap.org"
        crossOrigin="anonymous"
      />
      <link rel="dns-prefetch" href="https://tiles.openfreemap.org" />
      <EventsMapPage
        locale={locale}
        dict={dict}
        initialEvents={events}
        initialVenueSlug={initialVenueSlug}
      />
    </>
  );
}
