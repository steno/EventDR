"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  useCallback,
  useEffect,
  type ComponentProps,
  type FocusEvent,
  type PointerEvent,
} from "react";

/** Session-scoped; avoids repeat prefetch work for the same href. */
const warmed = new Set<string>();
const WARMED_CAP = 80;

type RouterPrefetch = { prefetch: (href: string) => void };

function hrefToString(href: ComponentProps<typeof Link>["href"]): string {
  if (typeof href === "string") return href;
  const path = href.pathname ?? "";
  if (!path) return "";
  const search =
    typeof href.search === "string"
      ? href.search.startsWith("?")
        ? href.search
        : `?${href.search}`
      : "";
  const hash =
    typeof href.hash === "string"
      ? href.hash.startsWith("#")
        ? href.hash
        : `#${href.hash}`
      : "";
  return `${path}${search}${hash}`;
}

function markWarmed(href: string) {
  if (warmed.has(href)) return false;
  if (warmed.size >= WARMED_CAP) warmed.clear();
  warmed.add(href);
  return true;
}

/** Prefetch a route once per session (idle home rails, intent taps, etc.). */
export function warmRoute(router: RouterPrefetch, href: string): void {
  if (!href || !markWarmed(href)) return;
  void router.prefetch(href);
}

/** Idle-prefetch a short list of hrefs without blocking first paint. */
export function warmRoutesIdle(
  router: RouterPrefetch,
  hrefs: string[],
  limit = 8,
): () => void {
  const targets = hrefs.filter(Boolean).slice(0, limit);
  if (targets.length === 0) return () => {};

  const run = () => {
    for (const href of targets) warmRoute(router, href);
  };

  const w = window as Window & {
    requestIdleCallback?: (
      cb: () => void,
      opts?: { timeout: number },
    ) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (typeof w.requestIdleCallback === "function") {
    const id = w.requestIdleCallback(run, { timeout: 1800 });
    return () => w.cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(run, 280);
  return () => window.clearTimeout(id);
}

type IntentLinkProps = Omit<ComponentProps<typeof Link>, "prefetch"> & {
  /**
   * Warm this href after first paint (for above-the-fold cards like
   * Happening today). Default stays intent-only to avoid network storms.
   */
  eagerWarm?: boolean;
};

/**
 * Same as Next `Link` with `prefetch={false}`, but warms the route on
 * pointer-enter / focus so the next tap feels instant without flooding
 * the network on first paint.
 */
export const IntentLink = forwardRef<HTMLAnchorElement, IntentLinkProps>(
  function IntentLink(
    {
      href,
      onPointerEnter,
      onPointerDown,
      onFocus,
      eagerWarm = false,
      ...rest
    },
    ref,
  ) {
    const router = useRouter();
    const hrefStr = hrefToString(href);

    const warm = useCallback(() => {
      warmRoute(router, hrefStr);
    }, [hrefStr, router]);

    useEffect(() => {
      if (!eagerWarm || !hrefStr) return;
      return warmRoutesIdle(router, [hrefStr], 1);
    }, [eagerWarm, hrefStr, router]);

    return (
      <Link
        ref={ref}
        href={href}
        prefetch={false}
        onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
          warm();
          onPointerEnter?.(event);
        }}
        onPointerDown={(event: PointerEvent<HTMLAnchorElement>) => {
          // Touch has no hover — start warm on press so navigation overlaps fetch.
          warm();
          onPointerDown?.(event);
        }}
        onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
          warm();
          onFocus?.(event);
        }}
        {...rest}
      />
    );
  },
);
