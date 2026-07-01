"use client";

import type { CategoryMeta } from "@/lib/types";

interface CategoryIconProps {
  category: CategoryMeta;
}

export function CategoryIcon({ category }: CategoryIconProps) {
  return (
    <div
      className="
        group flex flex-col items-center gap-2.5 min-w-[72px]
        transition-transform active:scale-95
        opacity-90 hover:opacity-100
      "
      aria-label={category.label}
    >
      <div
        className={`
          relative flex h-[60px] w-[60px] items-center justify-center rounded-2xl
          bg-gradient-to-br ${category.gradient}
          shadow-[0_8px_24px_-6px_rgba(0,0,0,0.25)]
          transition-all duration-200 group-hover:scale-105
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
      <span className="text-[11px] font-bold tracking-tight text-center leading-tight max-w-[76px] text-neutral-600 group-hover:text-neutral-900">
        {category.label}
      </span>
    </div>
  );
}
