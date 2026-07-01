import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Home } from "@/components/Home";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
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
  return <Home locale={locale} dict={dict} />;
}
