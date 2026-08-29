import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { unsubscribeByToken } from "@/lib/newsletter";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: dict.newsletter.unsubscribeTitle,
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ t?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const sp = await searchParams;
  const tokenRaw = sp.t;
  const token = typeof tokenRaw === "string" ? tokenRaw : tokenRaw?.[0] ?? "";
  const ok = token ? await unsubscribeByToken(token) : false;

  return (
    <main className="relative bg-neutral-50 pb-16 dark:bg-transparent">
      <div className={`${PAGE_SHELL_CLASS} max-w-3xl`}>
        <header className="pb-2 pt-4">
          <Link
            href={`/${locale}`}
            className="text-sm font-semibold text-orange-600 transition-colors hover:text-orange-500"
          >
            ← POP Events
          </Link>
          <h1 className="mt-6 text-display font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {dict.newsletter.unsubscribeTitle}
          </h1>
        </header>
        <p className="mt-4 max-w-xl text-copy text-neutral-700 dark:text-neutral-300">
          {ok
            ? dict.newsletter.unsubscribeBody
            : dict.newsletter.unsubscribeMissing}
        </p>
        <p className="mt-8">
          <Link
            href={`/${locale}`}
            className="inline-flex min-h-12 items-center rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white hover:bg-orange-600"
          >
            {dict.newsletter.home}
          </Link>
        </p>
      </div>
    </main>
  );
}
