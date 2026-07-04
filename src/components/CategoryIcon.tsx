"use client";

import type { CategoryMeta } from "@/lib/types";

interface CategoryIconProps {
  category: CategoryMeta;
}

export function CategoryIcon({ category }: CategoryIconProps) {
  return (
    <div
      className="
        group flex min-w-[78px] flex-col items-center gap-2
        transition-transform active:scale-95
      "
      aria-label={category.label}
    >
      <div
        className={`
          relative flex h-[58px] w-[58px] items-center justify-center rounded-2xl
          bg-gradient-to-br ${category.gradient}
          shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)]
          transition-all duration-200 group-hover:scale-105
          ring-1 ring-white group-hover:ring-rose-200
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
      <span className="text-[12px] font-extrabold tracking-tight text-center leading-tight max-w-[82px] text-neutral-700 group-hover:text-neutral-950">
        {category.label}
      </span>
    </div>
  );
}
