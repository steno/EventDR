import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { EventPage } from "@/components/EventPage";
import { AppHeader } from "@/components/AppHeader";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getModeratorEventById } from "@/lib/get-event";
import { formatEventDateRange } from "@/lib/format-date";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import {
  MODERATOR_SESSION_COOKIE,
  verifyModeratorSessionToken,
} from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ModeratorPreviewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const token = (await cookies()).get(MODERATOR_SESSION_COOKIE)?.value;
  if (!verifyModeratorSessionToken(token)) {
    redirect(`/${locale}/moderate`);
  }

  const event = await getModeratorEventById(id, locale);
  if (!event) notFound();

  const formattedDateRange = formatEventDateRange(event.date, locale, {
    endDate: event.endDate,
  });
  const recurrenceLabel = formatRecurrenceLabel(event, locale, dict);
  const isPending = event.status === "pending" || event.status === "rejected";

  return (
    <main className="min-h-screen bg-background dark:bg-transparent">
      <div className="mx-auto max-w-lg px-4">
        <AppHeader locale={locale} dict={dict} />
        {isPending ? (
          <div className="mb-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">
            {dict.moderate.previewBanner}
            <Link
              href={`/${locale}/moderate`}
              className="mt-1 block text-xs font-semibold text-amber-800 underline dark:text-amber-200"
            >
              ← {dict.moderate.title}
            </Link>
          </div>
        ) : null}
      </div>
      <EventPage
        event={event}
        locale={locale}
        dict={dict}
        formattedDateRange={formattedDateRange}
        recurrenceLabel={recurrenceLabel}
        returnTo={`/${locale}/moderate`}
      />
    </main>
  );
}
