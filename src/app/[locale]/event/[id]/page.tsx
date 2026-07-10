import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventPage } from "@/components/EventPage";
import { JsonLd } from "@/components/JsonLd";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getEventById } from "@/lib/get-event";
import { getEventShareUrl } from "@/lib/share";
import {
  buildBreadcrumbJsonLd,
  buildEventJsonLd,
  buildEventMetadata,
  localePath,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) return {};

  const event = await getEventById(id, locale);
  if (!event) return {};

  return buildEventMetadata(locale, event, getEventShareUrl(event, locale));
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { locale, id } = await params;
  const { from } = await searchParams;
  if (!isValidLocale(locale)) notFound();

  const event = await getEventById(id, locale);
  if (!event) notFound();

  const dict = getDictionary(locale);
  const shareUrl = getEventShareUrl(event, locale);

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
      <EventPage event={event} locale={locale} dict={dict} returnTo={from} />
    </>
  );
}
