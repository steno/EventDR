"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  useCallback,
  type ComponentProps,
  type FocusEvent,
  type PointerEvent,
} from "react";

/** Session-scoped; avoids repeat prefetch work for the same href. */
const warmed = new Set<string>();
const WARMED_CAP = 80;

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

type IntentLinkProps = Omit<ComponentProps<typeof Link>, "prefetch">;

/**
 * Same as Next `Link` with `prefetch={false}`, but warms the route on
 * pointer-enter / focus so the next tap feels instant without flooding
 * the network on first paint.
 */
export const IntentLink = forwardRef<HTMLAnchorElement, IntentLinkProps>(
  function IntentLink(
    { href, onPointerEnter, onPointerDown, onFocus, ...rest },
    ref,
  ) {
    const router = useRouter();
    const hrefStr = hrefToString(href);

    const warm = useCallback(() => {
      if (!hrefStr || !markWarmed(hrefStr)) return;
      void router.prefetch(hrefStr);
    }, [hrefStr, router]);

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
