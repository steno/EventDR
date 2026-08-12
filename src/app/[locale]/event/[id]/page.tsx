import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventPage } from "@/components/EventPage";
import { JsonLd } from "@/components/JsonLd";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getEventById } from "@/lib/get-event";
import { getNearbyTonightForEvent } from "@/lib/get-nearby-tonight";
import { getCanonicalEventShareUrl } from "@/lib/share";
import { formatEventDateRange } from "@/lib/format-date";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import {
  areEventOpinionsEnabled,
  getEventOpinion,
  googleRatingFromAssessment,
  withGoogleRating,
} from "@/lib/event-opinions";
import { getVenueAssessment } from "@/lib/venue-assessments";
import { matchVenueSlug } from "@/lib/venues-seed";
import {
  buildBreadcrumbJsonLd,
  buildEventJsonLd,
  buildEventMetadata,
  localePath,
} from "@/lib/seo";

// ISR: cache event detail HTML; back-nav uses sessionStorage, not ?from=.
export const revalidate = 180;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) return {};

  const event = await getEventById(id, locale);
  if (!event) return {};

  return buildEventMetadata(locale, event, getCanonicalEventShareUrl(event, locale));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) notFound();

  const event = await getEventById(id, locale);
  if (!event) notFound();

  const dict = getDictionary(locale);
  const shareUrl = getCanonicalEventShareUrl(event, locale);
  const formattedDateRange = formatEventDateRange(event.date, locale, {
    endDate: event.endDate,
  });
  const recurrenceLabel = formatRecurrenceLabel(event, locale, dict);

  const venueSlug =
    event.venueSlug ??
    matchVenueSlug(event.venue) ??
    matchVenueSlug(event.location);

  const [nearbyTonight, assessment] = await Promise.all([
    getNearbyTonightForEvent(event, locale),
    areEventOpinionsEnabled() && venueSlug
      ? getVenueAssessment(venueSlug)
      : Promise.resolve(null),
  ]);

  const seedOpinion = areEventOpinionsEnabled()
    ? getEventOpinion(event)
    : null;
  const venueRating = googleRatingFromAssessment(assessment);
  const opinionOverride =
    seedOpinion && venueRating
      ? withGoogleRating(seedOpinion, venueRating)
      : seedOpinion;

  return (
    <>
      <JsonLd
        data={[
          buildEventJsonLd(event, locale, shareUrl),
          buildBreadcrumbJsonLd([
            { name: dict.seo.siteName, path: localePath(locale) },
            { name: event.title, path: localePath(locale, `/event/${event.id}`) },
          ]),
        ]}
      />
      <EventPage
        event={event}
        locale={locale}
        dict={dict}
        formattedDateRange={formattedDateRange}
        recurrenceLabel={recurrenceLabel}
        nearbyTonight={nearbyTonight}
        opinionOverride={opinionOverride}
        initialVenueRating={venueRating}
      />
    </>
  );
}
