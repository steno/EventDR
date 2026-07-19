"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const STICKY_HEADER_HEIGHT_VAR = "--sticky-list-header-height";

export const stickyBackControlClassName =
  "inline-flex max-w-full min-h-11 min-w-0 items-center gap-2 -ml-2 rounded-xl px-2 py-2.5 text-[15px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 active:bg-neutral-200/60 dark:active:bg-neutral-800/60 touch-manipulation";

const backControlClassName = stickyBackControlClassName;

const backLabelClassName = "min-w-0 truncate";

type StickyListHeaderProps = {
  locale: Locale;
  dict: Dictionary;
  backLabel: string;
  /** Drop bottom margin when the next block should sit flush (e.g. city photo hero). */
  flushBottom?: boolean;
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
}: StickyListHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const publishHeight = () => {
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
  }, []);

  return (
    <div
      ref={rootRef}
      className={`sticky top-0 z-20 -mx-4 px-4 pb-2 bg-neutral-50/95 backdrop-blur-sm dark:bg-neutral-950/95 border-b border-neutral-200/60 dark:border-neutral-800/60 ${
        flushBottom ? "mb-0" : "mb-6"
      }`}
    >
      <AppHeader locale={locale} dict={dict} />
      {onBack ? (
        <button type="button" onClick={onBack} className={backControlClassName}>
          <ArrowLeft className="h-[1.125rem] w-[1.125rem] shrink-0" aria-hidden />
          <span className={backLabelClassName}>{backLabel}</span>
        </button>
      ) : (
        <Link href={backHref} className={backControlClassName}>
          <ArrowLeft className="h-[1.125rem] w-[1.125rem] shrink-0" aria-hidden />
          <span className={backLabelClassName}>{backLabel}</span>
        </Link>
      )}
    </div>
  );
}
