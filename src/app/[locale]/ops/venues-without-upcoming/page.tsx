import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppHeader } from "@/components/AppHeader";
import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { venueDetailPath } from "@/lib/event-navigation";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import { getPublicEvents } from "@/lib/public-events";
import { getVenues } from "@/lib/venues";
import {
  listVenuesWithoutUpcoming,
  type VenueDirectoryEntry,
} from "@/lib/venues-directory";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Venues without upcoming — POP Events ops",
};

export const revalidate = 120;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function groupByCity(
  entries: VenueDirectoryEntry[],
): { city: string; entries: VenueDirectoryEntry[] }[] {
  const order: string[] = [];
  const byCity = new Map<string, VenueDirectoryEntry[]>();
  for (const entry of entries) {
    const city = entry.venue.city.trim() || "Unknown";
    if (!byCity.has(city)) {
      order.push(city);
      byCity.set(city, []);
    }
    byCity.get(city)!.push(entry);
  }
  return order.map((city) => ({ city, entries: byCity.get(city)! }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  const dict = getDictionary(locale);
  const [venues, events] = await Promise.all([
    getVenues(locale),
    getPublicEvents({ locale }),
  ]);
  const empty = listVenuesWithoutUpcoming(venues, events);
  const groups = groupByCity(empty);

  return (
    <main className="relative min-h-screen bg-background pb-8 dark:bg-transparent">
      <div className={PAGE_SHELL_CLASS}>
        <AppHeader locale={locale} dict={dict} />
        <h1 className="mt-4 text-title font-extrabold text-neutral-900 dark:text-neutral-100">
          Venues without upcoming
        </h1>
        <p className="mt-1.5 max-w-2xl text-base text-neutral-500 dark:text-neutral-400">
          Editorial targeting list — same upcoming set visitors see on the
          public site. {empty.length} of {venues.length} venues have no
          upcoming events.
        </p>

        {empty.length === 0 ? (
          <p className="mt-8 text-base font-medium text-neutral-700 dark:text-neutral-300">
            Every venue has at least one upcoming listing.
          </p>
        ) : (
          <div className="mt-8 space-y-8">
            {groups.map(({ city, entries }) => (
              <section key={city}>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {city}{" "}
                  <span className="font-medium text-neutral-400">
                    ({entries.length})
                  </span>
                </h2>
                <ul className="mt-2 divide-y divide-neutral-200 dark:divide-neutral-800">
                  {entries.map(({ venue }) => (
                    <li key={venue.slug}>
                      <Link
                        href={venueDetailPath(locale, venue.slug)}
                        className="flex items-baseline justify-between gap-3 py-2.5 text-base touch-manipulation hover:text-orange-600 dark:hover:text-orange-400"
                      >
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {venue.name}
                        </span>
                        <span className="shrink-0 font-mono text-sm text-neutral-400">
                          {venue.slug}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
