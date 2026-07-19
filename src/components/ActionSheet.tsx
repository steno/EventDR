"use client";

import type { ReactNode } from "react";

/** Signature orange→rose brand wash — ties share/calendar to the footer CTA. */
export const detailActionPanelClass =
  "relative z-10 mb-4 overflow-hidden rounded-2xl px-4 py-4 " +
  "bg-gradient-to-br from-orange-50 to-rose-50 ring-1 ring-orange-200/70 " +
  "dark:from-orange-950/40 dark:to-rose-950/25 dark:ring-orange-500/15";

interface ActionSheetProps {
  title: string;
  children: ReactNode;
}

/** Inline share / calendar content for the detail action panel (no floating chrome). */
export function ActionSheet({ title, children }: ActionSheetProps) {
  return (
    <div>
      <p className="text-base font-black text-orange-950 dark:text-orange-100">
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

interface ActionSheetTileProps {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  /** Icon well background / text color classes. */
  wellClassName: string;
}

export function ActionSheetTile({
  label,
  onClick,
  icon,
  wellClassName,
}: ActionSheetTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group flex w-full min-w-0 flex-col items-center justify-start gap-1.5
        rounded-xl px-0.5 py-1 text-center touch-manipulation
        transition-transform active:scale-[0.96]
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
      "
      aria-label={label}
    >
      <span
        className={`
          flex h-11 w-11 shrink-0 items-center justify-center rounded-full
          shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]
          transition-transform duration-200 ease-out
          group-hover:scale-[1.06] group-active:scale-95
          ${wellClassName}
        `}
      >
        {icon}
      </span>
      <span className="w-full truncate px-0.5 text-[13px] font-semibold leading-tight text-orange-950 dark:text-orange-100">
        {label}
      </span>
    </button>
  );
}
