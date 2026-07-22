"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  dismissSupportNudge,
  recordSupportVisit,
  shouldShowSupportNudge,
} from "@/lib/support-nudge";

interface SupportNudgeProps {
  locale: Locale;
  dict: Dictionary;
}

const SHOW_DELAY_MS = 4500;

export function SupportNudge({ locale, dict }: SupportNudgeProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const homePath = `/${locale}`;
  const onHome = pathname === homePath || pathname === `${homePath}/`;
  const onSupport = pathname?.includes("/support") ?? false;

  useEffect(() => {
    if (onSupport) return;
    recordSupportVisit();
    if (!shouldShowSupportNudge()) return;

    const timer = window.setTimeout(() => {
      if (shouldShowSupportNudge()) setVisible(true);
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [onSupport, pathname]);

  if (!visible || onSupport) return null;

  function dismiss() {
    dismissSupportNudge();
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label={dict.supportNudge.title}
      className={[
        "pointer-events-none fixed inset-x-0 z-30 flex justify-center px-3",
        onHome
          ? "bottom-[calc(4.25rem+env(safe-area-inset-bottom))] lg:bottom-6"
          : "bottom-[max(1rem,env(safe-area-inset-bottom))]",
      ].join(" ")}
    >
      <div
        className="pointer-events-auto flex w-full max-w-lg items-start gap-3 rounded-2xl border border-orange-200/80 bg-white/95 p-3.5 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.55)] backdrop-blur-md animate-in slide-in-from-bottom duration-300 dark:border-orange-900/50 dark:bg-neutral-950/95 sm:max-w-md"
      >
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-500 text-white"
          aria-hidden
        >
          <Heart className="h-4 w-4 fill-current" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black tracking-tight text-neutral-950 dark:text-neutral-50">
            {dict.supportNudge.title}
          </p>
          <p className="mt-0.5 text-xs font-medium leading-relaxed text-neutral-600 dark:text-neutral-300">
            {dict.supportNudge.body}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Link
              href={`/${locale}/support`}
              onClick={dismiss}
              className="inline-flex min-h-9 items-center rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-3.5 text-xs font-black text-white transition-transform active:scale-[0.98]"
            >
              {dict.supportNudge.cta}
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex min-h-9 items-center rounded-full px-2.5 text-xs font-bold text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              {dict.supportNudge.dismiss}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={dict.supportNudge.dismiss}
          className="shrink-0 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
