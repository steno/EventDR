interface HorizontalScrollEdgeFadesProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  /**
   * `page` — fades into the page background (default).
   * `bar` — fades into a solid capsule scroller (Eventbrite-style).
   */
  tone?: "page" | "bar";
}

const TONES = {
  page: {
    left: "from-neutral-50 to-transparent dark:from-black/70 dark:mix-blend-darken",
    right:
      "from-neutral-50 to-transparent dark:from-black/70 dark:mix-blend-darken",
  },
  bar: {
    left: "from-white to-transparent dark:from-neutral-900 dark:to-transparent",
    right: "from-white to-transparent dark:from-neutral-900 dark:to-transparent",
  },
} as const;

export function HorizontalScrollEdgeFades({
  canScrollLeft,
  canScrollRight,
  tone = "page",
}: HorizontalScrollEdgeFadesProps) {
  const { left, right } = TONES[tone];

  return (
    <>
      {canScrollLeft ? (
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r ${left}`}
          aria-hidden
        />
      ) : null}
      {canScrollRight ? (
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l ${right}`}
          aria-hidden
        />
      ) : null}
    </>
  );
}
