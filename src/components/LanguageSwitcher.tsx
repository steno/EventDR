"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { warmRoute, warmRoutesIdle } from "@/components/IntentLink";
import { locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { signalNavPending } from "@/lib/nav-feedback";

interface LanguageSwitcherProps {
  locale: Locale;
  dict: Dictionary;
  /**
   * `responsive` — compact pill on mobile, full strip from `lg` (header chrome).
   * `expanded` — always show EN · ES · FR (modals / roomy surfaces).
   */
  variant?: "responsive" | "expanded";
  /** Runs before cookie + replace — e.g. hold city-priming overlay across remount. */
  beforeNavigate?: (target: Locale) => void;
}

const triggerClassName = `
  flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full
  bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500
  px-2.5 text-xs font-bold tracking-wide text-white shadow-sm
  transition-[transform,opacity] duration-200 ease-out
  active:scale-[0.96] touch-manipulation
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
`;

const optionClassName = (active: boolean, pending: boolean, dimmed: boolean) => `
  rounded-full px-2.5 py-1 text-xs font-bold tracking-wide
  touch-manipulation
  transition-[color,background-color,box-shadow,opacity,transform]
  duration-200 ease-out
  active:scale-[0.96]
  ${
    pending
      ? "scale-[0.96] bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 text-white shadow-sm ring-2 ring-orange-500/70 dark:ring-orange-400/60"
      : active
        ? "bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 text-white shadow-sm"
        : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
  }
  ${dimmed ? "opacity-45" : ""}
`;

/** Address-bar path + query with the locale segment swapped (soft-nav safe). */
function localeHref(
  target: Locale,
  fallbackPath: string,
  fallbackLocale: Locale,
): string {
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : fallbackPath;
  const pathSeg = currentPath.split("/")[1];
  const pathLocale = locales.includes(pathSeg as Locale)
    ? (pathSeg as Locale)
    : fallbackLocale;
  const newPath = currentPath.replace(`/${pathLocale}`, `/${target}`);
  const qs =
    typeof window !== "undefined"
      ? window.location.search.replace(/^\?/, "")
      : "";
  return qs ? `${newPath}?${qs}` : newPath;
}

function LocaleButtons({
  locale,
  dict,
  pendingLang,
  onSelect,
  onWarm,
}: {
  locale: Locale;
  dict: Dictionary;
  pendingLang: Locale | null;
  onSelect: (lang: Locale) => void;
  onWarm: (lang: Locale) => void;
}) {
  return (
    <>
      {locales.map((lang) => {
        const active = locale === lang;
        const pending = pendingLang === lang;
        const dimmed = pendingLang != null && pendingLang !== lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => onSelect(lang)}
            onPointerEnter={() => onWarm(lang)}
            onPointerDown={() => onWarm(lang)}
            onFocus={() => onWarm(lang)}
            aria-busy={pending || undefined}
            className={optionClassName(active, pending, dimmed)}
            aria-current={active ? "true" : undefined}
          >
            {dict.lang[lang]}
          </button>
        );
      })}
    </>
  );
}

const stripClassName = `
  flex items-center gap-0.5 rounded-full bg-white/85 p-1 shadow-sm
  ring-1 ring-neutral-200/70 backdrop-blur
  dark:bg-neutral-800/85 dark:ring-neutral-700/70
`;

export function LanguageSwitcher({
  locale,
  dict,
  variant = "responsive",
  beforeNavigate,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingLang, setPendingLang] = useState<Locale | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const expanded = variant === "expanded";

  function warmLocale(target: Locale) {
    if (target === locale) return;
    warmRoute(router, localeHref(target, pathname, locale));
  }

  function switchLocale(target: Locale) {
    if (target === locale) {
      setOpen(false);
      return;
    }
    // Prefer the address bar — soft city/category swaps update history without
    // notifying the App Router, so usePathname can lag behind.
    // Path locale may differ from the display `locale` prop when a parent
    // optimistically flips language (city priming sheet) before navigation.
    const href = localeHref(target, pathname, locale);
    beforeNavigate?.(target);
    document.cookie = `eventdr-locale=${target};path=/;max-age=31536000`;
    setPendingLang(target);
    setOpen(false);
    signalNavPending("soft");
    // Prefetch overlap + replace (no history stack of EN→ES→FR flips).
    warmRoute(router, href);
    router.replace(href);
  }

  // Warm the other two locales for this URL so the first tap is already cached.
  useEffect(() => {
    const others = locales.filter((lang) => lang !== locale);
    return warmRoutesIdle(
      router,
      others.map((lang) => localeHref(lang, pathname, locale)),
      others.length,
    );
  }, [locale, pathname, router]);

  useEffect(() => {
    if (pendingLang && pendingLang === locale) setPendingLang(null);
  }, [locale, pendingLang]);

  useEffect(() => {
    if (!open || expanded) return;

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, expanded]);

  // Opening the mobile popover: warm both targets while the strip is visible.
  useEffect(() => {
    if (!open || expanded) return;
    for (const lang of locales) {
      if (lang !== locale) warmLocale(lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- warm on open only
  }, [open, expanded, locale]);

  const localeButtons = (
    <LocaleButtons
      locale={locale}
      dict={dict}
      pendingLang={pendingLang}
      onSelect={switchLocale}
      onWarm={warmLocale}
    />
  );

  if (expanded) {
    return (
      <div
        className={stripClassName}
        role="group"
        aria-label={dict.lang.switchTo}
      >
        {localeButtons}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      {/* Mobile: one pill — expands into a popover so the row width stays stable */}
      <button
        type="button"
        className={`lg:hidden ${triggerClassName}`}
        aria-label={dict.lang.switchTo}
        aria-expanded={open}
        aria-haspopup="listbox"
        onPointerEnter={() => {
          for (const lang of locales) {
            if (lang !== locale) warmLocale(lang);
          }
        }}
        onClick={() => setOpen((value) => !value)}
      >
        {dict.lang[locale]}
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={dict.lang.switchTo}
          className="
            absolute right-0 top-full z-30 mt-1.5 flex items-center gap-0.5
            rounded-full bg-white/95 p-1 shadow-lg ring-1 ring-neutral-200/80 backdrop-blur
            dark:bg-neutral-800/95 dark:ring-neutral-700/80
            lg:hidden
          "
        >
          {localeButtons}
        </div>
      ) : null}

      {/* Desktop: enough room for the full EN · ES · FR strip */}
      <div
        className={`hidden lg:flex ${stripClassName}`}
        role="group"
        aria-label={dict.lang.switchTo}
      >
        {localeButtons}
      </div>
    </div>
  );
}
