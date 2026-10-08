"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Map as MapIcon, Search, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { clearHomeArea } from "@/lib/cities";
import {
  hasSeenOnboarding,
  markOnboardingSeen,
} from "@/lib/onboarding";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const WeatherWidget = dynamic(
  () => import("@/components/WeatherWidget").then((m) => m.WeatherWidget),
  { ssr: false, loading: () => <span className="h-9 w-9 shrink-0" aria-hidden /> },
);

interface AppHeaderProps {
  locale: Locale;
  dict: Dictionary;
  /** Reset in-page home state (search, area URL) when already on `/[locale]`. */
  onLogoClick?: () => void;
  /** Extra actions for wide screens (Saved, Add, etc.). Hidden below `lg`. */
  desktopActions?: ReactNode;
  /** Desktop search between logo and actions (`lg+`). Hidden on smaller screens. */
  search?: ReactNode;
  /** Mobile search icon (`<lg`). Panel lives beside the header in the caller. */
  searchToggle?: {
    open: boolean;
    onToggle: () => void;
    controlsId: string;
  };
}

export function AppHeader({
  locale,
  dict,
  onLogoClick,
  desktopActions,
  search,
  searchToggle,
}: AppHeaderProps) {
  const pathname = usePathname();
  const homeHref = `/${locale}`;
  const mapHref = `/${locale}/map`;
  const onHome = pathname === homeHref;
  const onMap = pathname === mapHref;
  const [showMapNew, setShowMapNew] = useState(false);

  useEffect(() => {
    if (onMap) {
      markOnboardingSeen("map-feature-seen");
      setShowMapNew(false);
      return;
    }
    setShowMapNew(!hasSeenOnboarding("map-feature-seen"));
  }, [onMap]);

  const headerIconClass = `
    flex h-9 w-9 shrink-0 items-center justify-center rounded-full
    bg-white/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] ring-1 backdrop-blur-xl
    dark:bg-white/[0.07] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
    transition-colors active:scale-95 touch-manipulation
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
  `;

  return (
    <div className="flex items-center gap-3 pt-3 pb-4 lg:pb-5">
      <Link
        href={homeHref}
        aria-label={dict.seo.siteName}
        className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        onClick={(e) => {
          // Logo always means a fresh home — drop remembered city/area.
          clearHomeArea();
          if (onHome) {
            e.preventDefault();
            onLogoClick?.();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        <Image
          src="/pop-home-logo.webp"
          alt={dict.seo.siteName}
          width={192}
          height={192}
          // Splash already preloads + fetchPriority=high this asset; skip competing priority.
          className="h-14 w-auto object-contain sm:h-20 no-photo-filter"
        />
      </Link>
      {search ? (
        <div className="hidden min-w-0 flex-1 px-2 lg:block">
          <div className="w-full max-w-md lg:max-w-xl xl:max-w-2xl">{search}</div>
        </div>
      ) : null}
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        {searchToggle ? (
          <button
            type="button"
            className={`${headerIconClass} ${
              searchToggle.open
                ? "text-orange-600 ring-orange-400/70 hover:text-orange-700 dark:text-orange-300 dark:ring-orange-300/50 dark:hover:text-orange-200"
                : "text-neutral-500 ring-neutral-200/70 hover:text-neutral-900 dark:text-neutral-300 dark:ring-white/12 dark:hover:text-neutral-100"
            }`}
            aria-label={searchToggle.open ? dict.search.close : dict.search.open}
            title={searchToggle.open ? dict.search.close : dict.search.open}
            aria-expanded={searchToggle.open}
            aria-controls={searchToggle.controlsId}
            onClick={searchToggle.onToggle}
          >
            {searchToggle.open ? (
              <X className="h-4 w-4" aria-hidden />
            ) : (
              <Search className="h-4 w-4" aria-hidden />
            )}
          </button>
        ) : null}
        {desktopActions ? (
          <div className="mr-1 hidden items-center gap-1.5 lg:flex">
            {desktopActions}
          </div>
        ) : null}
        <Link
          href={mapHref}
          prefetch={false}
          aria-label={
            showMapNew
              ? `${dict.footer.map} — ${dict.map.newBadge}`
              : dict.footer.map
          }
          title={dict.footer.map}
          aria-current={onMap ? "page" : undefined}
          className={`relative ${headerIconClass} ${
            onMap
              ? "text-orange-600 ring-orange-400/70 dark:text-orange-300 dark:ring-orange-300/50"
              : "text-neutral-500 ring-neutral-200/70 hover:text-neutral-900 dark:text-neutral-300 dark:ring-white/12 dark:hover:text-neutral-100"
          }`}
        >
          <MapIcon className="h-4 w-4" aria-hidden />
          {showMapNew ? (
            <span
              className="pointer-events-none absolute left-1/2 top-full z-[1] mt-0.5 -translate-x-1/2 whitespace-nowrap rounded bg-orange-500 px-1 py-px text-[9px] font-black uppercase leading-none tracking-wide text-white shadow-sm dark:bg-orange-500"
              aria-hidden
            >
              {/* Fixed “NEW” — keep under the icon; localized words + iOS min font blew past it when overlaid. */}
              NEW
            </span>
          ) : null}
        </Link>
        <WeatherWidget locale={locale} dict={dict} />
        <ThemeToggle dict={dict} />
        <LanguageSwitcher locale={locale} dict={dict} />
      </div>
    </div>
  );
}
