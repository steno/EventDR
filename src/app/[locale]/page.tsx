import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Home } from "@/components/Home";
import { HomeBootExpect } from "@/components/HomeBootExpect";
import { JsonLd } from "@/components/JsonLd";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  buildBrandJsonLd,
  buildHomeMetadata,
} from "@/lib/seo";
import {
  collectHomeBootstrapEvents,
  collectHomeBootstrapVenues,
} from "@/lib/home-layout";
import { slimVenuesForList } from "@/lib/list-payload";
import { getPublicEvents } from "@/lib/public-events";
import { getVenues } from "@/lib/venues";

// ISR: regenerate home every 2 minutes instead of SSR every visit.
export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildHomeMetadata(locale, dict);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ city?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const sp = await searchParams;
  const cityRaw = sp.city;
  const initialCityParam =
    typeof cityRaw === "string"
      ? cityRaw
      : Array.isArray(cityRaw)
        ? (cityRaw[0] ?? null)
        : null;

  const dict = getDictionary(locale);
  const [venues, catalogEvents] = await Promise.all([
    getVenues(locale),
    getPublicEvents({ locale }),
  ]);
  // First HTML only needs rail events + slider venues; client hydrates the rest.
  const listVenues = slimVenuesForList(venues);
  const initialEvents = collectHomeBootstrapEvents(catalogEvents);
  const initialVenues = collectHomeBootstrapVenues(listVenues);
  return (
    <>
      <JsonLd data={buildBrandJsonLd(locale, dict)} />
      <HomeBootExpect />
      {/* No Suspense/null fallback — Home must be in the first HTML for Slow 3G. */}
      <Home
        locale={locale}
        dict={dict}
        initialVenues={initialVenues}
        initialEvents={initialEvents}
        hydrateFullCatalog
        initialCityParam={initialCityParam}
      />
    </>
  );
}
