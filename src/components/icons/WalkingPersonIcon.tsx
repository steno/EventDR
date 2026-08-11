import type { SVGProps } from "react";

/** Lucide-style walking person — Lucide ships PersonStanding, not a walk glyph. */
export function WalkingPersonIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      <circle cx="14" cy="4" r="2" />
      <path d="M12 21v-5l-2.5-3 4-4" />
      <path d="m14 13 3 2.5L19.5 21" />
      <path d="M8 13.5 12.5 11l2.5 1" />
    </svg>
  );
}
