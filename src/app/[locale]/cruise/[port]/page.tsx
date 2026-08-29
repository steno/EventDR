import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Home } from "@/components/Home";
import { HomeBootExpect } from "@/components/HomeBootExpect";
import { JsonLd } from "@/components/JsonLd";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  CRUISE_PORT_SLUGS,
  isCruisePortSlug,
  type CruisePortSlug,
} from "@/lib/cruise";
import { slimVenuesForList } from "@/lib/list-payload";
import { getPublicEvents } from "@/lib/public-events";
import {
  buildCruiseMetadata,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";
import { getVenues } from "@/lib/venues";

export const revalidate = 120;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    CRUISE_PORT_SLUGS.map((port) => ({ locale, port })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; port: string }>;
}): Promise<Metadata> {
  const { locale, port } = await params;
  if (!isValidLocale(locale) || !isCruisePortSlug(port)) return {};
  const dict = getDictionary(locale);
  return buildCruiseMetadata(locale, dict, port);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; port: string }>;
  searchParams: Promise<{ allAboard?: string | string[] }>;
}) {
  const { locale, port: portParam } = await params;
  if (!isValidLocale(locale) || !isCruisePortSlug(portParam)) notFound();
  const port = portParam as CruisePortSlug;

  const sp = await searchParams;
  const aboardRaw = sp.allAboard;
  const initialAllAboardParam =
    typeof aboardRaw === "string"
      ? aboardRaw
      : Array.isArray(aboardRaw)
        ? (aboardRaw[0] ?? null)
        : null;

  const dict = getDictionary(locale);
  const [venues, initialEvents] = await Promise.all([
    getVenues(locale),
    getPublicEvents({ locale }),
  ]);
  const listVenues = slimVenuesForList(venues);

  return (
    <>
      <JsonLd
        data={[
          buildOrganizationJsonLd(locale, dict),
          buildWebSiteJsonLd(locale, dict),
        ]}
      />
      <HomeBootExpect />
      <Home
        locale={locale}
        dict={dict}
        initialVenues={listVenues}
        initialEvents={initialEvents}
        initialCruisePort={port}
        initialAllAboardParam={initialAllAboardParam}
      />
    </>
  );
}
