import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PartnersPage } from "@/components/PartnersPage";
import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { generateQrSvg } from "@/lib/partner-qr";
import {
  fillPartnersTemplate,
  getPartnersCopy,
  partnerQrTargets,
} from "@/lib/partners-copy";
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

  const copy = getPartnersCopy(locale);

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: buildAlternates(locale, "/for-partners"),
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
  const copy = getPartnersCopy(locale);
  const targets = partnerQrTargets(locale);

  const [allSvg, weekendSvg, ...citySvgs] = await Promise.all([
    generateQrSvg(targets.all),
    generateQrSvg(targets.weekend),
    ...targets.cities.map((c) => generateQrSvg(c.url)),
  ]);

  const qrCards = {
    all: {
      label: copy.qrCards.all.label,
      hint: copy.qrCards.all.hint,
      url: targets.all,
      svg: allSvg,
    },
    weekend: {
      label: copy.qrCards.weekend.label,
      hint: copy.qrCards.weekend.hint,
      url: targets.weekend,
      svg: weekendSvg,
    },
    cities: targets.cities.map((city, i) => ({
      label: fillPartnersTemplate(copy.qrCards.city.label, { city: city.name }),
      hint: copy.qrCards.city.hint,
      url: city.url,
      svg: citySvgs[i]!,
    })),
  };

  return <PartnersPage copy={copy} locale={locale} qrCards={qrCards} />;
}
