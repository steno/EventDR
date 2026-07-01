import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/CategoryPage";
import { CATEGORY_IDS } from "@/lib/categories";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { EventCategory } from "@/lib/types";

export async function generateStaticParams() {
  const locales = ["en", "es", "fr"] as const;
  return locales.flatMap((locale) =>
    CATEGORY_IDS.map((id) => ({ locale, id })),
  );
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
  return (
    <CategoryPage
      categoryId={id as EventCategory}
      locale={locale}
      dict={dict}
    />
  );
}
