import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Home } from "@/components/Home";
import { JsonLd } from "@/components/JsonLd";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildHomeMetadata, buildWebSiteJsonLd } from "@/lib/seo";
import { getVenues } from "@/lib/venues";

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
  const venues = await getVenues(locale);
  return (
    <>
      <JsonLd data={buildWebSiteJsonLd(locale, dict)} />
      <Suspense fallback={null}>
        <Home locale={locale} dict={dict} initialVenues={venues} />
      </Suspense>
    </>
  );
}
