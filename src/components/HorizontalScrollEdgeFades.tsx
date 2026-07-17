interface HorizontalScrollEdgeFadesProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

/** Light: page-bg fade. Dark: darken blend over colorful pills. */
const EDGE_FADE_LEFT =
  "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-neutral-50 to-transparent dark:from-black/70 dark:mix-blend-darken sm:hidden";
const EDGE_FADE_RIGHT =
  "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-neutral-50 to-transparent dark:from-black/70 dark:mix-blend-darken sm:hidden";

export function HorizontalScrollEdgeFades({
  canScrollLeft,
  canScrollRight,
}: HorizontalScrollEdgeFadesProps) {
  return (
    <>
      {canScrollLeft ? (
        <div className={EDGE_FADE_LEFT} aria-hidden />
      ) : null}
      {canScrollRight ? (
        <div className={EDGE_FADE_RIGHT} aria-hidden />
      ) : null}
    </>
  );
}
