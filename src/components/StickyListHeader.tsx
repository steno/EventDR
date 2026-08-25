"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, House } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useScrollChromeVisible } from "@/hooks/useScrollChrome";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { clearHomeArea } from "@/lib/cities";
import { signalNavPending } from "@/lib/nav-feedback";
import { fillTemplate } from "@/lib/seo";
import { PAGE_GUTTER_BLEED_CLASS } from "@/lib/page-shell";
import { SCROLL_CHROME_TRANSITION_CLASS } from "@/lib/scroll-chrome";

const STICKY_HEADER_HEIGHT_VAR = "--sticky-list-header-height";

const listBackControlClassName =
  "inline-flex max-w-full min-h-11 min-w-0 items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 active:bg-neutral-200/60 dark:active:bg-neutral-800/60 touch-manipulation";

/** Edge-aligned back (home saved tab, desktop list under the logo). */
export const stickyBackControlClassName = `${listBackControlClassName} -ml-2`;

const detailBackControlClassName =
  "inline-flex max-w-full min-h-9 min-w-0 items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 active:bg-neutral-200/60 dark:active:bg-neutral-800/60 touch-manipulation";

const backPendingClassName =
  "text-orange-700 dark:text-orange-300 bg-orange-500/12 dark:bg-orange-400/15";

const backLabelClassName = "min-w-0 truncate";

type StickyListHeaderProps = {
  locale: Locale;
  dict: Dictionary;
  backLabel: string;
  /** Drop bottom margin when the next block should sit flush (e.g. city photo hero). */
  flushBottom?: boolean;
  /**
   * - default: list pages — home + slim back + theme/lang on mobile; logo/weather on `lg+`
   * - detail: event/venue — always slim (home + back, no logo/weather)
   *
   * Height is published via ResizeObserver into `--sticky-list-header-height`
   * so scroll-to-list and sticky filters stay aligned when chrome shrinks.
   */
  variant?: "default" | "detail";
} & (
  | { backHref: string; onBack?: never }
  | { backHref?: never; onBack: () => void }
);

const homeControlClassName =
  "inline-flex shrink-0 items-center justify-center rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 active:bg-neutral-200/60 dark:active:bg-neutral-800/60 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";

function CompactChromeRow({
  homeControl,
  backControl,
  locale,
  dict,
  className = "",
}: {
  homeControl: ReactNode;
  backControl: ReactNode;
  locale: Locale;
  dict: Dictionary;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <div className="flex min-w-0 flex-1 items-center gap-0.5">
        {homeControl}
        <span
          className="mx-0.5 h-4 w-px shrink-0 bg-neutral-300 dark:bg-neutral-700"
          aria-hidden
        />
        <div className="min-w-0 flex-1">{backControl}</div>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle dict={dict} />
        <LanguageSwitcher locale={locale} dict={dict} />
      </div>
    </div>
  );
}

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
  const [pending, setPending] = useState(false);
  const [homePending, setHomePending] = useState(false);
  const homeHref = `/${locale}`;

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

  const backIconClassName = isDetail
    ? "h-4 w-4 shrink-0"
    : "h-[1.125rem] w-[1.125rem] shrink-0";

  function backControlClassName(edgeAligned: boolean) {
    const base = isDetail
      ? detailBackControlClassName
      : listBackControlClassName;
    return `${base}${edgeAligned ? " -ml-2" : ""}${
      pending ? ` ${backPendingClassName}` : ""
    }`;
  }

  function beginBack() {
    setPending(true);
    // Detail/list backs are often `router.back()` (no <a>) — ping the soft bar.
    signalNavPending("soft");
  }

  const backAriaLabel = fillTemplate(dict.browse.backTo, { title: backLabel });

  function renderHomeControl() {
    return (
      <Link
        href={homeHref}
        aria-label={dict.nav.home}
        title={dict.nav.home}
        aria-busy={homePending || undefined}
        onClick={() => {
          // Same as the logo: a true home, not the last remembered city.
          clearHomeArea();
          setHomePending(true);
          signalNavPending("soft");
        }}
        className={`${homeControlClassName} ${
          isDetail ? "h-9 w-9 -ml-1.5" : "h-11 w-11 -ml-2"
        }${homePending ? ` ${backPendingClassName}` : ""}`}
      >
        <House className={backIconClassName} aria-hidden />
      </Link>
    );
  }

  function renderBackControl(edgeAligned = false) {
    const className = backControlClassName(edgeAligned);
    if (onBack) {
      return (
        <button
          type="button"
          aria-label={backAriaLabel}
          aria-busy={pending || undefined}
          onClick={() => {
            beginBack();
            onBack();
          }}
          className={className}
        >
          <ArrowLeft className={backIconClassName} aria-hidden />
          <span className={backLabelClassName}>{backLabel}</span>
        </button>
      );
    }
    return (
      <Link
        href={backHref}
        aria-label={backAriaLabel}
        aria-busy={pending || undefined}
        onClick={beginBack}
        className={className}
      >
        <ArrowLeft className={backIconClassName} aria-hidden />
        <span className={backLabelClassName}>{backLabel}</span>
      </Link>
    );
  }

  return (
    <div
      ref={rootRef}
      data-sticky-list-header
      className={`sticky top-0 z-20 ${PAGE_GUTTER_BLEED_CLASS} bg-neutral-50/95 backdrop-blur-sm dark:bg-neutral-950/95 border-b border-neutral-200/60 dark:border-neutral-800/60 ${SCROLL_CHROME_TRANSITION_CLASS} ${
        chromeVisible
          ? ""
          : "-translate-y-full border-transparent pointer-events-none"
      } ${
        isDetail
          ? "py-2 mb-2"
          : // Mobile list chrome is compact (no logo); keep a little top pad.
            `pt-2 pb-2 lg:pt-0 ${flushBottom ? "mb-0" : "mb-6"}`
      }`}
    >
      {isDetail ? (
        <CompactChromeRow
          homeControl={renderHomeControl()}
          backControl={renderBackControl()}
          locale={locale}
          dict={dict}
        />
      ) : (
        <>
          {/* Mobile: logo/weather are redundant under sticky list chrome. */}
          <CompactChromeRow
            homeControl={renderHomeControl()}
            backControl={renderBackControl()}
            locale={locale}
            dict={dict}
            className="lg:hidden"
          />
          {/* Desktop: keep brand + weather above the back link. */}
          <div className="hidden lg:block">
            <AppHeader locale={locale} dict={dict} />
            {renderBackControl(true)}
          </div>
        </>
      )}
    </div>
  );
}
