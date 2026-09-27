import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventScopePage } from "@/components/EventScopePage";
import { JsonLd } from "@/components/JsonLd";
import { categoryNavLinks } from "@/lib/event-navigation";
import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicEvents } from "@/lib/public-events";
import {
  buildListingPageJsonLd,
  buildWhenMetadata,
  localePath,
} from "@/lib/seo";
import { sortEventsForDisplay } from "@/lib/event-sort";
import { eventsInWeekendOrder } from "@/lib/list-day-groups";
import { buildWhenSearchCopy } from "@/lib/search-snippets";
import { pinSpecialEvents } from "@/lib/special-events";
import { getWhenSeo, isWhenSlug, WHEN_SLUGS, type WhenSlug } from "@/lib/time-seo";

/** Same order the weekend/today list renders, so the snippet names the first cards. */
async function listedWhenEvents(locale: Locale, range: WhenSlug) {
  const events = await getPublicEvents({ locale, when: range });
  const sorted = sortEventsForDisplay(events, {
    recurringLast: true,
    oneTimeFirst: true,
    pinTodayOneOffs: true,
  });
  const pinned =
    range === "weekend"
      ? pinSpecialEvents(sorted, { placement: "weekend-list" })
      : sorted;
  return range === "weekend" ? eventsInWeekendOrder(pinned) : pinned;
}

export const revalidate = 120;

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    WHEN_SLUGS.map((range) => ({ locale, range })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; range: string }>;
}): Promise<Metadata> {
  const { locale, range } = await params;
  if (!isValidLocale(locale)) return {};
  if (!isWhenSlug(range)) return {};

  const events = await listedWhenEvents(locale, range);
  return buildWhenMetadata(locale, range, events);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; range: string }>;
}) {
  const { locale, range } = await params;
  if (!isValidLocale(locale)) notFound();
  if (!isWhenSlug(range)) notFound();

  const dict = getDictionary(locale);
  const whenSeo = getWhenSeo(locale, range);
  const whenPath = localePath(locale, `/when/${range}`);
  const events = await listedWhenEvents(locale, range);
  const liveSeo = buildWhenSearchCopy(locale, range, events);
  const pageSeo = liveSeo
    ? {
        ...whenSeo,
        title: liveSeo.title,
        description: liveSeo.description,
        h1: liveSeo.h1,
        intro: liveSeo.intro,
      }
    : whenSeo;
  const relatedCategoryLinks = categoryNavLinks(
    locale,
    dict.categories,
    null,
    events,
  );
  const relatedCategoryLinksLabel = dict.cities.browseTopCategories;

  return (
    <>
      <JsonLd
        data={buildListingPageJsonLd(
          locale,
          whenPath,
          pageSeo,
          pageSeo.h1,
          events,
          [
            { name: dict.seo.siteName, path: localePath(locale) },
            { name: pageSeo.h1, path: whenPath },
          ],
        )}
      />
      <EventScopePage
        locale={locale}
        dict={dict}
        initialEvents={events}
        fetchUrl={`/api/events?locale=${locale}&when=${range}`}
        returnTo={whenPath}
        title={pageSeo.h1}
        intro={pageSeo.intro}
        fixedTimeRange={range}
        relatedCategoryLinks={relatedCategoryLinks}
        relatedCategoryLinksLabel={relatedCategoryLinksLabel}
      />
    </>
  );
}
