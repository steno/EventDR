import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventScopePage } from "@/components/EventScopePage";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORY_IDS, getCategoryMeta } from "@/lib/categories";
import { getCategorySeo } from "@/lib/category-seo";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import {
  buildCategoryMetadata,
  buildListingPageJsonLd,
  localePath,
} from "@/lib/seo";
import type { EventCategory } from "@/lib/types";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    CATEGORY_IDS.map((id) => ({ locale, id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) return {};
  if (!CATEGORY_IDS.includes(id as EventCategory)) return {};

  return buildCategoryMetadata(locale, id as EventCategory);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) notFound();
  if (!CATEGORY_IDS.includes(id as EventCategory)) notFound();

  const dict = getDictionary(locale);
  const category = getCategoryMeta(id, dict.categories);
  const categorySeo = getCategorySeo(locale, id as EventCategory);
  const categoryPath = localePath(locale, `/category/${id}`);
  const events = await getPublicEvents({ locale, category: id as EventCategory });

  return (
    <>
      {category ? (
        <JsonLd
          data={buildListingPageJsonLd(
            locale,
            categoryPath,
            categorySeo,
            category.label,
            events,
            [
              { name: dict.seo.siteName, path: localePath(locale) },
              { name: category.label, path: categoryPath },
            ],
          )}
        />
      ) : null}
      <EventScopePage
        locale={locale}
        dict={dict}
        initialEvents={events}
        fetchUrl={`/api/events?locale=${locale}&category=${id}`}
        returnTo={categoryPath}
        title={category?.label ?? id}
        intro={categorySeo.intro}
        sectionTitle={dict.browse.eventsIn}
        emoji={category?.emoji}
        emojiClassName={`bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}`}
        addEventLabel={dict.submit.addCategoryEvent}
        submitDefaults={{ category: id as EventCategory }}
      />
    </>
  );
}
