import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { CategoryDirectory } from "@/components/CategoryDirectory";
import { StickyListHeader } from "@/components/StickyListHeader";
import { getPublicEvents } from "@/lib/public-events";
import { buildAlternates, fillTemplate } from "@/lib/seo";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";

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

  return {
    title: dict.browse.title,
    description: dict.browse.allCategoriesIntro,
    alternates: buildAlternates(locale, "/browse"),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const events = await getPublicEvents({ locale });
  const backLabel = fillTemplate(dict.browse.backTo, {
    title: dict.nav.discover,
  });

  return (
    <main className="relative bg-neutral-50 pb-6 dark:bg-transparent">
      <div className={PAGE_SHELL_CLASS}>
        <StickyListHeader
          locale={locale}
          dict={dict}
          backHref={`/${locale}`}
          backLabel={backLabel}
        />

        <div className="mb-4">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
            {dict.browse.title}
          </h1>
          <p className="mt-0.5 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {dict.browse.allCategoriesIntro}
          </p>
        </div>

        <CategoryDirectory locale={locale} dict={dict} events={events} />
      </div>
    </main>
  );
}
