"use client";

import type { ReactNode } from "react";

interface ActionSheetProps {
  title: string;
  children: ReactNode;
}

/** Shared surface for share / calendar flyouts on the event detail sheet. */
export function ActionSheet({ title, children }: ActionSheetProps) {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/95 px-4 py-3.5 shadow-lg backdrop-blur-sm dark:border-neutral-700/80 dark:bg-neutral-950/90">
      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
        {title}
      </p>
      {children}
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
      className="group flex w-full min-w-0 flex-col items-center justify-start gap-2 rounded-xl px-1 py-2 text-center touch-manipulation transition-all hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 active:scale-[0.97] dark:hover:bg-neutral-900/80"
      aria-label={label}
    >
      <span
        className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform group-hover:scale-[1.05] group-active:scale-95 ${wellClassName}`}
      >
        {icon}
      </span>
      <span className="w-full px-0.5 text-[10.5px] font-semibold leading-[1.15] text-neutral-700 dark:text-neutral-200">
        {label}
      </span>
    </button>
  );
}
