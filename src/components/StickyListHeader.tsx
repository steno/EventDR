"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useScrollChromeVisible } from "@/hooks/useScrollChrome";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { SCROLL_CHROME_TRANSITION_CLASS } from "@/lib/scroll-chrome";

const STICKY_HEADER_HEIGHT_VAR = "--sticky-list-header-height";

export const stickyBackControlClassName =
  "inline-flex max-w-full min-h-11 min-w-0 items-center gap-2 -ml-2 rounded-xl px-2 py-2.5 text-[15px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 active:bg-neutral-200/60 dark:active:bg-neutral-800/60 touch-manipulation";

const detailBackControlClassName =
  "inline-flex max-w-full min-h-9 min-w-0 items-center gap-1.5 -ml-2 rounded-lg px-1.5 py-1.5 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 active:bg-neutral-200/60 dark:active:bg-neutral-800/60 touch-manipulation";

const backLabelClassName = "min-w-0 truncate";

type StickyListHeaderProps = {
  locale: Locale;
  dict: Dictionary;
  backLabel: string;
  /** Drop bottom margin when the next block should sit flush (e.g. city photo hero). */
  flushBottom?: boolean;
  /** Slim chrome for event/venue detail: back + theme/lang, no logo/weather. */
  variant?: "default" | "detail";
} & (
  | { backHref: string; onBack?: never }
  | { backHref?: never; onBack: () => void }
);

export function StickyListHeader({
  locale,
  dict,
  backHref,
  backLabel,
  onBack,
  flushBottom = false,
  variant = "default",
}: StickyListHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chromeVisible = useScrollChromeVisible();
  const isDetail = variant === "detail";

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const publishHeight = () => {
      if (!chromeVisible) {
        document.documentElement.style.setProperty(
          STICKY_HEADER_HEIGHT_VAR,
          "0px",
        );
        return;
      }
      // Ceil so subpixel heights never leave a gap under the sticky header.
      const height = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty(
        STICKY_HEADER_HEIGHT_VAR,
        `${height}px`,
      );
    };

    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(el);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty(STICKY_HEADER_HEIGHT_VAR);
    };
  }, [chromeVisible]);

  const backControlClassName = isDetail
    ? detailBackControlClassName
    : stickyBackControlClassName;

  const backControl = onBack ? (
    <button type="button" onClick={onBack} className={backControlClassName}>
      <ArrowLeft
        className={
          isDetail
            ? "h-4 w-4 shrink-0"
            : "h-[1.125rem] w-[1.125rem] shrink-0"
        }
        aria-hidden
      />
      <span className={backLabelClassName}>{backLabel}</span>
    </button>
  ) : (
    <Link href={backHref} className={backControlClassName}>
      <ArrowLeft
        className={
          isDetail
            ? "h-4 w-4 shrink-0"
            : "h-[1.125rem] w-[1.125rem] shrink-0"
        }
        aria-hidden
      />
      <span className={backLabelClassName}>{backLabel}</span>
    </Link>
  );

  return (
    <div
      ref={rootRef}
      className={`sticky top-0 z-20 -mx-4 px-4 bg-neutral-50/95 backdrop-blur-sm dark:bg-neutral-950/95 border-b border-neutral-200/60 dark:border-neutral-800/60 ${SCROLL_CHROME_TRANSITION_CLASS} ${
        chromeVisible
          ? ""
          : "-translate-y-full border-transparent pointer-events-none"
      } ${
        isDetail
          ? "py-2 mb-2"
          : `pb-2 ${flushBottom ? "mb-0" : "mb-6"}`
      }`}
    >
      {isDetail ? (
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">{backControl}</div>
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle dict={dict} />
            <LanguageSwitcher locale={locale} dict={dict} />
          </div>
        </div>
      ) : (
        <>
          <AppHeader locale={locale} dict={dict} />
          {backControl}
        </>
      )}
    </div>
  );
}
