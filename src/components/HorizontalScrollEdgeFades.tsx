interface HorizontalScrollEdgeFadesProps {
  canScrollRight: boolean;
  /**
   * `page` — fades into the page background (default).
   * `bar` — fades into a solid capsule scroller (Eventbrite-style).
   */
  tone?: "page" | "bar";
}

const TONES = {
  page: {
    // Match page shell (`--background`: cream / near-black), not neutral-50.
    right: "from-[var(--background)] to-transparent",
  },
  bar: {
    right: "from-white to-transparent dark:from-neutral-900 dark:to-transparent",
  },
} as const;

/** Trailing-edge fade only — left is redundant with card peek. */
export function HorizontalScrollEdgeFades({
  canScrollRight,
  tone = "page",
}: HorizontalScrollEdgeFadesProps) {
  const { right } = TONES[tone];

  if (!canScrollRight) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l ${right} sm:w-16`}
      aria-hidden
    />
  );
}
