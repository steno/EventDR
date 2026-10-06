import Link from "next/link";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import type { Locale } from "@/i18n/config";
import type { SponsorsCopy } from "@/lib/sponsors-copy";
import {
  getSponsors,
  instagramProfileUrl,
  sponsorTier,
  type Sponsor,
} from "@/lib/sponsors";

interface SponsorsPageProps {
  locale: Locale;
  copy: SponsorsCopy;
}

function SponsorRow({
  sponsor,
  copy,
}: {
  sponsor: Sponsor;
  copy: SponsorsCopy;
}) {
  const tier = sponsorTier(sponsor.amountUsd);
  const handle = sponsor.instagram?.replace(/^@/, "").trim();

  return (
    <li className="border-t border-neutral-200/80 py-5 dark:border-neutral-800">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-sans text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {sponsor.name}
        </p>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-600 dark:text-orange-400">
          {copy.tiers[tier]}
        </p>
      </div>
      {handle ? (
        <a
          href={instagramProfileUrl(handle)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-orange-600 dark:text-neutral-400 dark:hover:text-orange-300"
        >
          <span aria-hidden className="text-neutral-400 dark:text-neutral-500">
            @{handle}
          </span>
          <span className="sr-only">
            {copy.onInstagram}: @{handle}
          </span>
        </a>
      ) : null}
    </li>
  );
}

export function SponsorsPage({ locale, copy }: SponsorsPageProps) {
  const sponsors = getSponsors();

  return (
    <main className="relative bg-background pb-10 dark:bg-transparent">
      <div className={PAGE_SHELL_CLASS}>
        <header className="pb-2 pt-4">
          <Link
            href={`/${locale}`}
            className="text-sm font-semibold text-orange-600 transition-colors hover:text-orange-500"
          >
            ← POP Events
          </Link>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-orange-600/90 dark:text-orange-400/90">
            {copy.eyebrow}
          </p>
          <h1 className="mt-2 text-display font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-display-lg">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-copy-lead text-neutral-600 dark:text-neutral-300">
            {copy.lead}
          </p>
        </header>

        <section className="mt-8" aria-label={copy.listAria}>
          {sponsors.length === 0 ? (
            <p className="border-t border-neutral-200/80 pt-5 text-copy text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
              {copy.empty}
            </p>
          ) : (
            <ul>
              {sponsors.map((sponsor) => (
                <SponsorRow key={sponsor.id} sponsor={sponsor} copy={copy} />
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12 mb-2 rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50/90 via-rose-50/40 to-white p-5 dark:border-orange-500/20 dark:from-orange-950/40 dark:via-rose-950/20 dark:to-neutral-950 sm:p-6">
          <h2 className="text-section font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
            {copy.ctaTitle}
          </h2>
          <p className="mt-2 max-w-xl text-copy text-neutral-600 dark:text-neutral-300">
            {copy.ctaLead}
          </p>
          <Link
            href={`/${locale}/support`}
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition-transform active:scale-[0.98]"
          >
            {copy.ctaButton}
          </Link>
        </section>
      </div>
    </main>
  );
}
