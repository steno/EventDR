import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SupportPage } from "@/components/SupportPage";
import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { isDonateAvailable } from "@/lib/donate";
import { getSupportCopy } from "@/lib/support-copy";
import { buildAlternates } from "@/lib/seo";

export const dynamic = "force-dynamic";

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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ thanks?: string; canceled?: string; session_id?: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const query = await searchParams;
  const copy = getSupportCopy(locale);

  return (
    <SupportPage
      locale={locale}
      copy={copy}
      available={isDonateAvailable()}
      thanks={query.thanks === "1"}
      canceled={query.canceled === "1"}
      sessionId={query.session_id ?? null}
    />
  );
}
