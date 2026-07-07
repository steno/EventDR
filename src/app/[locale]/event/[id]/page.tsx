import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventPage } from "@/components/EventPage";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getEventById } from "@/lib/get-event";
import { getEventShareUrl } from "@/lib/share";
import { SITE_URL } from "@/lib/site-url";

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

  const url = getEventShareUrl(event, locale);
  const image = event.imageUrl
    ? event.imageUrl.startsWith("http")
      ? event.imageUrl
      : `${SITE_URL}${event.imageUrl}`
    : undefined;

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      url,
      type: "website",
      images: image ? [{ url: image, alt: event.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: event.title,
      description: event.description,
      images: image ? [image] : undefined,
    },
  };
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
  return <EventPage event={event} locale={locale} dict={dict} />;
}
