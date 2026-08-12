"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { PageLoading } from "@/components/PageLoading";
import { isListingSoftPath } from "@/lib/scope-listing";

const SHOW_DELAY_MS = 120;
const FAILSAFE_MS = 10_000;

function isInternalNavAnchor(anchor: HTMLAnchorElement): boolean {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("sms:")
  ) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return false;
    }
    // Category / city / when chips soft-nav or stay on listing shells — a
    // full-screen overlay makes those taps feel slower than they are.
    if (isListingSoftPath(url.pathname)) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Shows the page loading overlay as soon as an in-app navigation starts,
 * bridging the gap before the destination route paints. Listing chip routes
 * are excluded so category/city swaps stay instant.
 */
export function NavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [visible, setVisible] = useState(false);
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
    setVisible(false);
  };

  const beginPending = () => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    clearTimers();
    showTimer.current = setTimeout(() => {
      if (pendingRef.current) setVisible(true);
    }, SHOW_DELAY_MS);
    failsafeTimer.current = setTimeout(endPending, FAILSAFE_MS);
  };

  useEffect(() => {
    endPending();
    // Route settled — hide overlay.
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
      if (!isInternalNavAnchor(anchor)) return;

      beginPending();
    };

    // Capture so we see the intent before Next.js / handlers run.
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, []);

  if (!visible) return null;

  return (
    <div className="page-loading-portal">
      <PageLoading />
    </div>
  );
}
