import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { StickyListHeader } from "@/components/StickyListHeader";
import { VenueDirectory } from "@/components/VenueDirectory";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import {
  buildVenuesDirectoryJsonLd,
  buildVenuesDirectoryMetadata,
} from "@/lib/seo";
import { getVenues } from "@/lib/venues";
import { buildVenueDirectory } from "@/lib/venues-directory";

export const revalidate = 120;

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

  const dict = getDictionary(locale);
  return buildVenuesDirectoryMetadata(locale, dict);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const [venues, events] = await Promise.all([
    getVenues(locale),
    getPublicEvents({ locale }),
  ]);
  const groups = buildVenueDirectory(venues, events);

  return (
    <>
      <JsonLd data={buildVenuesDirectoryJsonLd(locale, dict, venues)} />
      <main className="relative bg-background pb-6 dark:bg-transparent">
        <div className={PAGE_SHELL_CLASS}>
          <StickyListHeader
            locale={locale}
            dict={dict}
            backHref={`/${locale}`}
            backLabel={dict.nav.discover}
            variant="compact"
          />

          <div className="mb-5">
            <h1 className="text-title font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
              {dict.venues.directory.title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm font-medium text-neutral-500 dark:text-neutral-400 sm:text-base">
              {dict.venues.directory.intro}
            </p>
          </div>

          <VenueDirectory locale={locale} dict={dict} groups={groups} />
        </div>
      </main>
    </>
  );
}
