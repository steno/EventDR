"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, House } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { warmRoute, warmRoutesIdle } from "@/components/IntentLink";
import { useScrollChromeVisible } from "@/hooks/useScrollChrome";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { clearHomeArea } from "@/lib/cities";
import { NAV_DONE_EVENT, signalNavPending } from "@/lib/nav-feedback";
import { fillTemplate } from "@/lib/seo";
import {
  PAGE_GUTTER_BLEED_CLASS,
  STICKY_CHROME_SURFACE_CLASS,
} from "@/lib/page-shell";
import {
  SCROLL_CHROME_TRANSITION_CLASS,
  syncScrollChromeDom,
} from "@/lib/scroll-chrome";

const STICKY_HEADER_HEIGHT_VAR = "--sticky-list-header-height";

/**
 * Sticky top chrome that publishes `--sticky-list-header-height` so
 * StickyListFilters can park underneath (home AppHeader, list headers).
 */
export function StickyPageChrome({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const chromeVisible = useScrollChromeVisible();

  useLayoutEffect(() => {
    syncScrollChromeDom();
  }, []);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const publishHeight = () => {
      document.documentElement.style.setProperty(
        STICKY_HEADER_HEIGHT_VAR,
        `${el.offsetHeight}px`,
      );
    };

    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(el);
    const rafId = requestAnimationFrame(publishHeight);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      requestAnimationFrame(() => {
        if (!document.querySelector("[data-sticky-list-header]")) {
          document.documentElement.style.removeProperty(
            STICKY_HEADER_HEIGHT_VAR,
          );
        }
      });
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-sticky-list-header
      className={`sticky top-0 z-20 ${PAGE_GUTTER_BLEED_CLASS} ${STICKY_CHROME_SURFACE_CLASS} ${SCROLL_CHROME_TRANSITION_CLASS} ${className}`}
      aria-hidden={chromeVisible ? undefined : true}
    >
      {children}
    </div>
  );
}

/** Shared press wash — matches pending orange so hold → navigate feels continuous. */
const backPressClassName =
  "active:scale-[0.98] active:text-orange-700 active:bg-orange-500/12 dark:active:text-orange-300 dark:active:bg-orange-400/15";

const listBackControlClassName =
  `inline-flex max-w-full min-h-11 min-w-0 items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 ${backPressClassName} touch-manipulation transition-[transform,color,background-color]`;

/** Edge-aligned back (home saved tab, desktop list under the logo). */
export const stickyBackControlClassName = `${listBackControlClassName} -ml-2`;

const detailBackControlClassName =
  `inline-flex max-w-full min-h-9 min-w-0 items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 ${backPressClassName} touch-manipulation transition-[transform,color,background-color]`;

const backPendingClassName =
  "scale-[0.98] text-orange-700 dark:text-orange-300 bg-orange-500/12 dark:bg-orange-400/15";

const backLabelClassName = "min-w-0 truncate";

type StickyListHeaderProps = {
  locale: Locale;
  dict: Dictionary;
  backLabel: string;
  /**
   * No bottom margin. Sticky margin stays as an empty band once the list
   * is scrolled (category pills, city hero). Spacing belongs on the next block.
   */
  flushBottom?: boolean;
  /**
   * - default: list pages — home + slim back + theme/lang on mobile; logo/weather on `lg+`
   * - compact: list pages without brand — same chrome at every breakpoint
   *   (events, when, city, category, browse)
   * - detail: event/venue — always slim (home + back, no logo/weather)
   *
   * Height is always published via ResizeObserver into `--sticky-list-header-height`
   * (even while hide-on-scroll translates the bar away) so sticky filters keep a
   * stable `top` — only the header slides; the filter stack does not teleport.
   */
  variant?: "default" | "compact" | "detail";
  /**
   * Client exit (e.g. leave cruise shore-day) — avoids a slow RSC remount of Home.
   * When set, home is a button instead of a Link.
   */
  onHome?: () => void;
} & (
  | { backHref: string; onBack?: never }
  | { backHref?: never; onBack: () => void }
);

const homeControlClassName =
  `inline-flex shrink-0 items-center justify-center rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 ${backPressClassName} touch-manipulation transition-[transform,color,background-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500`;

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
  onHome,
  flushBottom = false,
  variant = "default",
}: StickyListHeaderProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const chromeVisible = useScrollChromeVisible();
  const isDetail = variant === "detail";
  const hideBrand = isDetail || variant === "compact";
  const [pending, setPending] = useState(false);
  const [homePending, setHomePending] = useState(false);
  const homeHref = `/${locale}`;

  useLayoutEffect(() => {
    syncScrollChromeDom();
  }, []);

  // Soft exits (cruise leaveCruise) call signalNavDone without unmounting —
  // clear the orange busy chrome then. Real RSC backs keep pending until unmount.
  useEffect(() => {
    const onDone = () => {
      setPending(false);
      setHomePending(false);
    };
    window.addEventListener(NAV_DONE_EVENT, onDone);
    return () => window.removeEventListener(NAV_DONE_EVENT, onDone);
  }, []);

  // Detail chrome: idle-warm home + back so house/back are not cold RSC hits.
  useEffect(() => {
    if (!isDetail) return;
    return warmRoutesIdle(
      router,
      [homeHref, typeof backHref === "string" ? backHref : ""],
      2,
    );
  }, [backHref, homeHref, isDetail, router]);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // Always publish the real height — even while hide-on-scroll translates the
    // bar off-screen. Snapping this var to 0 made sticky filters (top: var)
    // teleport. Keep filters parked; only the header slides with transform.
    const publishHeight = () => {
      // Layout size — ignores translate, so mid-slide ResizeObserver noise
      // cannot nudge sticky filter `top`.
      const height = el.offsetHeight;
      document.documentElement.style.setProperty(
        STICKY_HEADER_HEIGHT_VAR,
        `${height}px`,
      );
    };

    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(el);
    // Fresh navigations / Fast Refresh can miss the first layout pass.
    const rafId = requestAnimationFrame(publishHeight);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      // Defer clear so Strict Mode / HMR remount can republish first.
      // Only remove when no sticky list header remains mounted.
      requestAnimationFrame(() => {
        if (!document.querySelector("[data-sticky-list-header]")) {
          document.documentElement.style.removeProperty(
            STICKY_HEADER_HEIGHT_VAR,
          );
        }
      });
    };
  }, []);

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
    const className = `${homeControlClassName} ${
      isDetail ? "h-9 w-9 -ml-1.5" : "h-11 w-11 -ml-2"
    }${homePending ? ` ${backPendingClassName}` : ""}`;

    if (onHome) {
      return (
        <button
          type="button"
          aria-label={dict.nav.home}
          title={dict.nav.home}
          aria-busy={homePending || undefined}
          onClick={() => {
            clearHomeArea();
            setHomePending(true);
            signalNavPending("soft");
            onHome();
          }}
          className={className}
        >
          <House className={backIconClassName} aria-hidden />
        </button>
      );
    }

    return (
      <Link
        href={homeHref}
        prefetch={false}
        aria-label={dict.nav.home}
        title={dict.nav.home}
        aria-busy={homePending || undefined}
        onPointerEnter={() => warmRoute(router, homeHref)}
        onPointerDown={() => warmRoute(router, homeHref)}
        onFocus={() => warmRoute(router, homeHref)}
        onClick={() => {
          // Same as the logo: a true home, not the last remembered city.
          clearHomeArea();
          setHomePending(true);
          signalNavPending("soft");
          warmRoute(router, homeHref);
        }}
        className={className}
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
          onPointerEnter={() => {
            if (typeof backHref === "string") warmRoute(router, backHref);
          }}
          onPointerDown={() => {
            if (typeof backHref === "string") warmRoute(router, backHref);
          }}
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
        prefetch={false}
        aria-label={backAriaLabel}
        aria-busy={pending || undefined}
        onPointerEnter={() => warmRoute(router, backHref)}
        onPointerDown={() => warmRoute(router, backHref)}
        onFocus={() => warmRoute(router, backHref)}
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
      className={`sticky top-0 z-20 ${PAGE_GUTTER_BLEED_CLASS} ${STICKY_CHROME_SURFACE_CLASS} ${SCROLL_CHROME_TRANSITION_CLASS} ${
        isDetail
          ? "py-2 mb-2"
          : hideBrand
            ? `pt-2 ${flushBottom ? "pb-1.5 mb-0" : "pb-2 mb-6 md:mb-4"} md:py-1.5`
            : // Mobile list chrome is compact (no logo); keep a little top pad.
              `pt-2 lg:pt-0 ${flushBottom ? "pb-1.5 mb-0" : "pb-2 mb-6 md:mb-4"}`
      }`}
      aria-hidden={chromeVisible ? undefined : true}
    >
      {hideBrand ? (
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
