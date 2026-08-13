"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { PageLoading } from "@/components/PageLoading";
import { isDetailNavPath, isListingSoftPath } from "@/lib/scope-listing";
import {
  NAV_DONE_EVENT,
  NAV_PENDING_EVENT,
  type NavFeedbackMode,
} from "@/lib/nav-feedback";

const SHOW_DELAY_MS = 120;
const FAILSAFE_MS = 10_000;

type NavFeedback = "none" | "soft" | "full";

function isHomePath(pathname: string): boolean {
  return /^\/(en|es|fr)\/?$/.test(pathname);
}

function classifyNav(pathname: string): NavFeedback {
  // Instant client soft-nav chips mark data-soft-nav and skip capture.
  // Hard RSC into listing/home/detail keeps a slim bar instead of a blank spinner.
  if (
    isListingSoftPath(pathname) ||
    isDetailNavPath(pathname) ||
    isHomePath(pathname)
  ) {
    return "soft";
  }
  return "full";
}

function readNavTarget(anchor: HTMLAnchorElement): {
  feedback: NavFeedback;
} | null {
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;
  // Client soft-nav (no RSC) — don't flash progress for instant filters.
  if (anchor.dataset.softNav === "1") return null;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return null;
  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("sms:")
  ) {
    return null;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return null;
    }
    return { feedback: classifyNav(url.pathname) };
  } catch {
    return null;
  }
}

/**
 * Navigation feedback without blanking the screen for common taps:
 * - soft: slim top progress (home stays up)
 * - full: page spinner after a short delay (partners/support/etc.)
 * - programmatic backs / pushes: `pop-nav-pending` / `pop-nav-done`
 */
export function NavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [mode, setMode] = useState<"idle" | "soft" | "full">("idle");
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failsafeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef(false);

  const clearTimers = () => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    if (failsafeTimer.current) {
      clearTimeout(failsafeTimer.current);
      failsafeTimer.current = null;
    }
  };

  const endPending = () => {
    pendingRef.current = false;
    clearTimers();
    setMode("idle");
  };

  const beginPending = (feedback: NavFeedback) => {
    if (feedback === "none") return;
    if (pendingRef.current) return;
    pendingRef.current = true;
    clearTimers();

    if (feedback === "soft") {
      setMode("soft");
    } else {
      showTimer.current = setTimeout(() => {
        if (pendingRef.current) setMode("full");
      }, SHOW_DELAY_MS);
    }

    failsafeTimer.current = setTimeout(endPending, FAILSAFE_MS);
  };

  useEffect(() => {
    endPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on URL change
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const nav = readNavTarget(anchor);
      if (!nav) return;

      beginPending(nav.feedback);
    };

    const onProgrammatic = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: NavFeedbackMode }>).detail;
      const next = detail?.mode === "full" ? "full" : "soft";
      beginPending(next);
    };

    const onDone = () => endPending();

    document.addEventListener("click", onClick, true);
    window.addEventListener(NAV_PENDING_EVENT, onProgrammatic);
    window.addEventListener(NAV_DONE_EVENT, onDone);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(NAV_PENDING_EVENT, onProgrammatic);
      window.removeEventListener(NAV_DONE_EVENT, onDone);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, []);

  if (mode === "idle") return null;

  if (mode === "soft") {
    return (
      <div
        className="nav-progress"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="sr-only">Loading</span>
        <div className="nav-progress__bar" aria-hidden />
      </div>
    );
  }

  return (
    <div className="page-loading-portal">
      <PageLoading />
    </div>
  );
}
