"use client";

import type { CategoryMeta } from "@/lib/types";

interface CategoryIconProps {
  category: CategoryMeta;
  selected?: boolean;
  onClick?: () => void;
}

export function CategoryIcon({ category, selected, onClick }: CategoryIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group flex flex-col items-center gap-2.5 min-w-[72px] snap-start
        transition-transform active:scale-95
        ${selected ? "opacity-100" : "opacity-90 hover:opacity-100"}
      `}
      aria-pressed={selected}
      aria-label={category.label}
    >
      <div
        className={`
          relative flex h-[60px] w-[60px] items-center justify-center rounded-2xl
          bg-gradient-to-br ${category.gradient}
          shadow-[0_8px_24px_-6px_rgba(0,0,0,0.25)]
          transition-all duration-200
          ${selected ? "ring-2 ring-neutral-900 ring-offset-2 scale-105" : "group-hover:scale-105"}
        `}
      >
        <span
          className="text-[28px] drop-shadow-md select-none"
          role="img"
          aria-hidden
        >
          {category.emoji}
        </span>
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <span
        className={`
          text-[11px] font-bold tracking-tight text-center leading-tight max-w-[76px]
          ${selected ? "text-neutral-900" : "text-neutral-600"}
        `}
      >
        {category.label}
      </span>
    </button>
  );
}
