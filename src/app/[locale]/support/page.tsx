import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SupportPage } from "@/components/SupportPage";
import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { isDonateAvailable } from "@/lib/donate";
import { getSupportCopy } from "@/lib/support-copy";
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

  const copy = getSupportCopy(locale);

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: buildAlternates(locale, "/support"),
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
  const copy = getSupportCopy(locale);

  return (
    <SupportPage
      locale={locale}
      copy={copy}
      available={isDonateAvailable()}
    />
  );
}
