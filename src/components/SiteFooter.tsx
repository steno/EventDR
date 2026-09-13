import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { FooterInstallLink } from "@/components/FooterInstallLink";
import { BRAND_SOCIAL_LINKS } from "@/lib/brand-social";
import { CITIES, getCityName } from "@/lib/cities";
import { cruisePath } from "@/lib/cruise";
import { PAGE_GUTTER_CLASS, PAGE_WIDTH_CLASS } from "@/lib/page-shell";

interface SiteFooterProps {
  dict: Dictionary;
  locale: Locale;
  className?: string;
  /** Hide when the guest is already on a cruise-day page. */
  showCruiseLink?: boolean;
}

const linkClass =
  "text-sm leading-snug text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-400 dark:hover:text-orange-300";

const columnTitleClass =
  "font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500";

function SocialIcon({ id }: { id: (typeof BRAND_SOCIAL_LINKS)[number]["id"] }) {
  const common = "h-4 w-4 sm:h-[18px] sm:w-[18px]";
  if (id === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  if (id === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden>
        <path d="M14.5 8.5V6.8c0-.7.5-1.3 1.2-1.3H17V3h-2.1C12.4 3 11 4.5 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.3l.5-2.7h-2.8z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden>
      <path d="M14.2 3.2c.2 1.9 1.1 3.6 2.5 4.8 1.2 1 2.7 1.6 4.3 1.7v3.1c-1.7 0-3.3-.4-4.7-1.2v5.9c0 3.4-2.7 6.2-6.2 6.2S4 20.9 4 17.5c0-3.3 2.6-6 5.8-6.2v3.2c-1.5.2-2.6 1.4-2.6 3 0 1.7 1.3 3 3 3s3-1.3 3-3V3.2h1z" />
    </svg>
  );
}

export function SiteFooter({
  dict,
  locale,
  className = "pb-6",
  showCruiseLink = true,
}: SiteFooterProps) {
  const homeHref = `/${locale}`;

  return (
    <footer
      className={`border-t border-orange-200/50 bg-gradient-to-b from-orange-50/80 via-rose-50/30 to-white pt-6 sm:pt-8 lg:pt-10 dark:border-orange-500/15 dark:from-orange-950/40 dark:via-rose-950/20 dark:to-neutral-950 ${className}`}
    >
      <div className={`${PAGE_WIDTH_CLASS} ${PAGE_GUTTER_CLASS}`}>
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          {/* Brand — logo + social share a row on phones */}
          <div className="grid max-w-sm grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2.5 sm:block sm:shrink-0">
            <Link
              href={homeHref}
              prefetch={false}
              aria-label={dict.seo.siteName}
              className="inline-block shrink-0 justify-self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              <Image
                src="/pop-home-logo.png"
                alt={dict.seo.siteName}
                width={148}
                height={148}
                className="h-10 w-auto object-contain no-photo-filter sm:h-11 lg:h-12"
              />
            </Link>
            <p className="col-span-2 text-sm leading-relaxed text-neutral-600 sm:mt-3.5 dark:text-neutral-400">
              {dict.footer.blurb}
            </p>
            <nav
              aria-label={dict.footer.follow}
              className="row-start-1 col-start-2 flex items-center gap-1.5 sm:mt-3.5 sm:gap-2"
            >
              {BRAND_SOCIAL_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="
                    inline-flex h-8 w-8 items-center justify-center rounded-full
                    text-neutral-500 ring-1 ring-neutral-200/80
                    transition-[transform,color,background-color,box-shadow]
                    hover:bg-orange-50 hover:text-orange-600 hover:ring-orange-300/70
                    sm:h-10 sm:w-10 sm:hover:scale-[1.04]
                    dark:text-neutral-400 dark:ring-white/12
                    dark:hover:bg-orange-500/10 dark:hover:text-orange-300 dark:hover:ring-orange-400/40
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
                  "
                >
                  <SocialIcon id={link.id} />
                </a>
              ))}
            </nav>
          </div>

          {/* Always 3 columns — avoids a wasted full-width “More” row on phones */}
          <div className="grid grid-cols-3 gap-x-4 gap-y-0 sm:gap-x-10 lg:gap-x-14">
            <nav aria-label={dict.footer.navPlaces}>
              <p className={columnTitleClass}>{dict.footer.navPlaces}</p>
              <ul className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2.5">
                {CITIES.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/${locale}/city/${city.slug}`}
                      prefetch={false}
                      className={linkClass}
                    >
                      {getCityName(city, locale)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/${locale}/venues`}
                    prefetch={false}
                    className={linkClass}
                  >
                    {dict.footer.venues}
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label={dict.footer.navWhen}>
              <p className={columnTitleClass}>{dict.footer.navWhen}</p>
              <ul className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2.5">
                <li>
                  <Link
                    href={`/${locale}/when/today`}
                    prefetch={false}
                    className={linkClass}
                  >
                    {dict.time.today}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/when/tomorrow`}
                    prefetch={false}
                    className={linkClass}
                  >
                    {dict.time.tomorrow}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/when/weekend`}
                    prefetch={false}
                    className={linkClass}
                  >
                    {dict.time.weekend}
                  </Link>
                </li>
                {showCruiseLink ? (
                  <li>
                    <Link
                      href={cruisePath(locale, "taino-bay")}
                      prefetch={false}
                      className={linkClass}
                    >
                      {dict.footer.cruise}
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>

            <nav aria-label={dict.footer.navMore}>
              <p className={columnTitleClass}>{dict.footer.navMore}</p>
              <div className="mt-2 flex flex-col items-start gap-1.5 sm:mt-3 sm:gap-2.5">
                <Link
                  href={`/${locale}/for-partners`}
                  prefetch={false}
                  className={linkClass}
                >
                  {dict.footer.partners}
                </Link>
                <Link
                  href={`/${locale}/support`}
                  prefetch={false}
                  className={linkClass}
                >
                  {dict.footer.support}
                </Link>
                <FooterInstallLink dict={dict} className={linkClass} />
              </div>
            </nav>
          </div>
        </div>

        <div className="mt-6 border-t border-neutral-200/80 pt-3.5 sm:mt-8 sm:pt-5 lg:mt-10 dark:border-white/10">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <nav
              aria-label={dict.footer.legal}
              className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-neutral-400 sm:gap-x-4 sm:text-xs dark:text-neutral-500"
            >
              <Link
                href={`/${locale}/privacy`}
                prefetch={false}
                className="transition-colors hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                {dict.footer.privacy}
              </Link>
              <Link
                href={`/${locale}/data-disclaimer`}
                prefetch={false}
                className="transition-colors hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                {dict.footer.dataDisclaimer}
              </Link>
              <Link
                href={`/${locale}/data-sources`}
                prefetch={false}
                className="transition-colors hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                {dict.footer.dataSources}
              </Link>
              <Link
                href={`/${locale}/data-deletion`}
                prefetch={false}
                className="transition-colors hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                {dict.footer.dataDeletion}
              </Link>
            </nav>

            <div className="space-y-0.5 text-[11px] text-neutral-400 sm:space-y-1 sm:text-right sm:text-xs dark:text-neutral-500">
              <p className="font-medium text-neutral-500 dark:text-neutral-400">
                {dict.footer.tagline}
              </p>
              <p>
                {dict.footer.builtWith}{" "}
                <a
                  href="https://www.asemota.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-neutral-500 transition-colors hover:text-orange-600 dark:text-neutral-400 dark:hover:text-orange-300"
                >
                  asemota
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
