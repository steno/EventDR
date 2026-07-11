import Link from "next/link";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { defaultLocale, isValidLocale } from "@/i18n/config";
import { resolveBackLabel } from "@/lib/event-navigation";
import { getDictionary } from "@/i18n/dictionaries";

async function resolveLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("eventdr-locale")?.value;
  return cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const dict = getDictionary(locale);
  return {
    title: dict.seo.notFoundTitle,
    description: dict.seo.notFoundDescription,
    robots: { index: false, follow: true },
  };
}

export default async function NotFound() {
  const locale = await resolveLocale();
  const dict = getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 dark:bg-transparent px-4 text-center">
      <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">{dict.seo.notFoundTitle}</h1>
      <p className="mt-3 max-w-md text-sm text-neutral-600 dark:text-neutral-400">{dict.seo.notFoundDescription}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex rounded-full bg-neutral-900 dark:bg-neutral-100 px-5 py-2.5 text-sm font-semibold text-white dark:text-neutral-900"
      >
        {resolveBackLabel(locale, `/${locale}`, dict)}
      </Link>
    </main>
  );
}
