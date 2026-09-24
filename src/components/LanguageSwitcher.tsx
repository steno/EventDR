"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { signalNavPending } from "@/lib/nav-feedback";

interface LanguageSwitcherProps {
  locale: Locale;
  dict: Dictionary;
}

export function LanguageSwitcher({ locale, dict }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingLang, setPendingLang] = useState<Locale | null>(null);

  function switchLocale(target: Locale) {
    if (target === locale) return;
    // Prefer the address bar — soft city/category swaps update history without
    // notifying the App Router, so usePathname can lag behind.
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${target}`);
    const qs =
      typeof window !== "undefined" ? window.location.search.replace(/^\?/, "") : "";
    document.cookie = `eventdr-locale=${target};path=/;max-age=31536000`;
    setPendingLang(target);
    signalNavPending("soft");
    router.push(qs ? `${newPath}?${qs}` : newPath);
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full bg-white/85 p-1 shadow-sm ring-1 ring-neutral-200/70 backdrop-blur dark:bg-neutral-800/85 dark:ring-neutral-700/70"
      role="group"
      aria-label={dict.lang.switchTo}
    >
      {locales.map((lang) => {
        const active = locale === lang;
        const pending = pendingLang === lang;
        const dimmed = pendingLang != null && pendingLang !== lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => switchLocale(lang)}
            aria-busy={pending || undefined}
            className={`
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
            `}
            aria-current={active ? "true" : undefined}
          >
            {dict.lang[lang]}
          </button>
        );
      })}
    </div>
  );
}
