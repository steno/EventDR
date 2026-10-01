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

/** Match VenuePage: handle, @handle, or full URL. */
function venueInstagramUrl(instagram: string | undefined): string | null {
  if (!instagram?.trim()) return null;
  const raw = instagram.trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  const handle = raw.replace(/^@/, "").replace(/^instagram\.com\//i, "");
  return `https://instagram.com/${handle}`;
}

function venueInstagramHandle(instagram: string | undefined): string | null {
  if (!instagram?.trim()) return null;
  return instagram
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/\/$/, "");
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
                  {entries.map(({ venue }) => {
                    const igUrl = venueInstagramUrl(venue.instagram);
                    const igHandle = venueInstagramHandle(venue.instagram);
                    return (
                      <li
                        key={venue.slug}
                        className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 py-2.5"
                      >
                        <Link
                          href={venueDetailPath(locale, venue.slug)}
                          className="min-w-0 text-base font-semibold text-neutral-900 touch-manipulation hover:text-orange-600 dark:text-neutral-100 dark:hover:text-orange-400"
                        >
                          {venue.name}
                        </Link>
                        <span className="flex shrink-0 items-baseline gap-3 font-mono text-sm text-neutral-400">
                          {igUrl && igHandle ? (
                            <a
                              href={igUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-500 underline-offset-2 hover:text-orange-600 hover:underline dark:text-neutral-400 dark:hover:text-orange-400"
                            >
                              @{igHandle}
                            </a>
                          ) : null}
                          <span>{venue.slug}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
