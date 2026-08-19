import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { DATA_DELETION_COPY } from "@/lib/legal-copy";
import { buildAlternates } from "@/lib/seo";

export const revalidate = 86400;

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
  const copy = DATA_DELETION_COPY[locale];
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: buildAlternates(locale, "/data-deletion"),
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
  return <LegalPage locale={locale} copy={DATA_DELETION_COPY[locale]} />;
}
