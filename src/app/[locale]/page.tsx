import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Home } from "@/components/Home";
import { HomeBootExpect } from "@/components/HomeBootExpect";
import { JsonLd } from "@/components/JsonLd";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  buildHomeMetadata,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";
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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const [venues, initialEvents] = await Promise.all([
    getVenues(locale),
    getPublicEvents({ locale }),
  ]);
  return (
    <>
      <JsonLd
        data={[
          buildOrganizationJsonLd(locale, dict),
          buildWebSiteJsonLd(locale, dict),
        ]}
      />
      <HomeBootExpect />
      <Suspense fallback={null}>
        <Home
          locale={locale}
          dict={dict}
          initialVenues={venues}
          initialEvents={initialEvents}
        />
      </Suspense>
    </>
  );
}
