import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ModeratePanel } from "@/components/ModeratePanel";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-black text-neutral-900 mb-6">
          {dict.moderate.title}
        </h1>
        <Suspense fallback={<p className="text-neutral-400">{dict.events.loading}</p>}>
          <ModeratePanel dict={dict} />
        </Suspense>
      </div>
    </main>
  );
}
