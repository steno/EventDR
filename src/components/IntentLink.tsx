"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type ComponentProps,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { rememberReturnPath } from "@/lib/event-navigation";

/** Session-scoped; avoids repeat prefetch work for the same href. */
const warmed = new Set<string>();
const WARMED_CAP = 80;

/**
 * Same push as home rail cards: scale + orange ring on the way down,
 * then hold that chrome until navigation finishes.
 * `scale-[0.985]` matches the card pending class so the utility is shared.
 */
export const INTENT_LINK_PENDING_CLASS =
  "scale-[0.985] ring-2 ring-orange-500/80 shadow-[0_12px_32px_-16px_rgba(251,146,60,0.45)] dark:ring-orange-400/70";

/** Finger-down frame, before React paints the held state. */
const INTENT_LINK_PRESS_CLASS =
  "active:scale-[0.985] active:ring-2 active:ring-orange-500/80 active:shadow-[0_12px_32px_-16px_rgba(251,146,60,0.45)] dark:active:ring-orange-400/70";

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

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

type IntentLinkProps = Omit<ComponentProps<typeof Link>, "prefetch"> & {
  /**
   * Warm this href after first paint (for above-the-fold cards like
   * Happening today). Default stays intent-only to avoid network storms.
   */
  eagerWarm?: boolean;
  /** Store back-nav context before following this link (cruise → event, etc.). */
  returnTo?: string | null;
  returnTitle?: string | null;
  /**
   * Show press + busy chrome on this anchor while RSC navigation settles.
   * Opt-in — overlay card links keep parent-owned pending on the article.
   */
  pendingFeedback?: boolean;
  /** Override the default orange ring/scale busy classes. */
  pendingClassName?: string;
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
      className,
      onPointerEnter,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onClick,
      onFocus,
      eagerWarm = false,
      returnTo,
      returnTitle,
      pendingFeedback = false,
      pendingClassName,
      "aria-busy": ariaBusy,
      ...rest
    },
    ref,
  ) {
    const router = useRouter();
    const hrefStr = hrefToString(href);
    const [pending, setPending] = useState(false);
    /** True from pointer-down until click commits or the gesture is cancelled. */
    const [pressed, setPressed] = useState(false);

    const warm = useCallback(() => {
      warmRoute(router, hrefStr);
    }, [hrefStr, router]);

    const remember = useCallback(() => {
      if (returnTo) rememberReturnPath(returnTo, returnTitle);
    }, [returnTo, returnTitle]);

    useEffect(() => {
      if (!eagerWarm || !hrefStr) return;
      return warmRoutesIdle(router, [hrefStr], 1);
    }, [eagerWarm, hrefStr, router]);

    const busy = pending || pressed || Boolean(ariaBusy);
    const showPress = pendingFeedback && (pressed || pending);
    const mergedClassName = [
      className,
      pendingFeedback ? INTENT_LINK_PRESS_CLASS : "",
      showPress ? (pendingClassName ?? INTENT_LINK_PENDING_CLASS).trim() : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Link
        ref={ref}
        href={href}
        prefetch={false}
        className={mergedClassName || undefined}
        aria-busy={busy || undefined}
        onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
          warm();
          onPointerEnter?.(event);
        }}
        onPointerDown={(event: PointerEvent<HTMLAnchorElement>) => {
          // Touch has no hover — start warm on press so navigation overlaps fetch.
          remember();
          warm();
          if (
            pendingFeedback &&
            event.button === 0 &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey
          ) {
            setPressed(true);
          }
          onPointerDown?.(event);
        }}
        onPointerCancel={(event: PointerEvent<HTMLAnchorElement>) => {
          setPressed(false);
          onPointerCancel?.(event);
        }}
        onPointerUp={(event: PointerEvent<HTMLAnchorElement>) => {
          // Click follows pointerup. If it never comes (scroll, cancelled tap),
          // drop the press on the next frame. A real click sets pending first.
          requestAnimationFrame(() => setPressed(false));
          onPointerUp?.(event);
        }}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          remember();
          onClick?.(event);
          if (
            pendingFeedback &&
            !pending &&
            !event.defaultPrevented &&
            !isModifiedClick(event)
          ) {
            setPending(true);
          } else {
            setPressed(false);
          }
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
