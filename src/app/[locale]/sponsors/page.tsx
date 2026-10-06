import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SponsorsPage } from "@/components/SponsorsPage";
import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { getSponsorsCopy } from "@/lib/sponsors-copy";
import { buildAlternates } from "@/lib/seo";

export const revalidate = 300;

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

  const copy = getSponsorsCopy(locale);

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: buildAlternates(locale, "/sponsors"),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const copy = getSponsorsCopy(locale);

  return <SponsorsPage locale={locale} copy={copy} />;
}
