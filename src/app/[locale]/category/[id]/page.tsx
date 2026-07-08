import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORY_IDS, getCategoryMeta } from "@/lib/categories";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  buildBreadcrumbJsonLd,
  buildCategoryMetadata,
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

  const dict = getDictionary(locale);
  const category = getCategoryMeta(id, dict.categories);
  if (!category) return {};

  return buildCategoryMetadata(locale, dict, category.label, id);
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

  return (
    <>
      {category ? (
        <JsonLd
          data={buildBreadcrumbJsonLd([
            { name: dict.seo.siteName, path: localePath(locale) },
            {
              name: category.label,
              path: localePath(locale, `/category/${id}`),
            },
          ])}
        />
      ) : null}
      <CategoryPage
        categoryId={id as EventCategory}
        locale={locale}
        dict={dict}
      />
    </>
  );
}
