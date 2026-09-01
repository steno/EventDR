"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Search, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { clearHomeArea } from "@/lib/cities";
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
  const onHome = pathname === homeHref;

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
          src="/pop-home-logo.png"
          alt={dict.seo.siteName}
          width={184}
          height={184}
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
            className={`
              flex h-9 w-9 shrink-0 items-center justify-center rounded-full
              bg-white/85 shadow-sm ring-1 backdrop-blur dark:bg-neutral-800/85
              transition-colors active:scale-95 touch-manipulation lg:hidden
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
              ${
                searchToggle.open
                  ? "text-orange-600 ring-orange-300/80 hover:text-orange-700 dark:text-orange-400 dark:ring-orange-700/70 dark:hover:text-orange-300"
                  : "text-neutral-600 ring-neutral-200/70 hover:text-neutral-900 dark:text-neutral-300 dark:ring-neutral-700/70 dark:hover:text-neutral-100"
              }
            `}
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
        <WeatherWidget locale={locale} dict={dict} />
        <ThemeToggle dict={dict} />
        <LanguageSwitcher locale={locale} dict={dict} />
      </div>
    </div>
  );
}
