import { notFound } from "next/navigation";
import { VenuePage } from "@/components/VenuePage";
import { fetchVenueBySlug } from "@/lib/firebase/events";
import { getSeedVenue } from "@/lib/venues-seed";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateStaticParams() {
  const slugs = [
    "lax-cabarete",
    "malecon-puerto-plata",
    "kite-beach",
    "el-batey-sosua",
    "cowork-cabarete",
    "ocean-world",
  ];
  const locales = ["en", "es", "fr"] as const;
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const venue = (await fetchVenueBySlug(slug)) ?? getSeedVenue(slug);
  if (!venue) notFound();

  const dict = getDictionary(locale);
  return <VenuePage venue={venue} locale={locale} dict={dict} />;
}
