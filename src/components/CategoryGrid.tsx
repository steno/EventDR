"use client";

import { getCategoryDefs } from "@/lib/categories";
import type { EventCategory } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { CategoryIcon } from "./CategoryIcon";

interface CategoryGridProps {
  selected?: EventCategory | null;
  onSelect: (category: EventCategory | null) => void;
  dict: Dictionary;
}

export function CategoryGrid({ selected, onSelect, dict }: CategoryGridProps) {
  const categories = getCategoryDefs().map((def) => ({
    ...def,
    label: dict.categories[def.id],
  }));

  return (
    <section aria-label={dict.browse.ariaLabel}>
      <div className="flex items-baseline justify-between mb-4 px-1">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">
          {dict.browse.title}
        </h2>
        {selected && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            {dict.browse.clear}
          </button>
        )}
      </div>
      <div
        className="
          flex gap-4 overflow-x-auto pb-2 -mx-4 px-4
          snap-x snap-mandatory scrollbar-hide
          sm:grid sm:grid-cols-5 sm:gap-x-2 sm:gap-y-6 sm:overflow-visible sm:mx-0 sm:px-0
        "
      >
        {categories.map((cat) => (
          <CategoryIcon
            key={cat.id}
            category={cat}
            selected={selected === cat.id}
            onClick={() => onSelect(selected === cat.id ? null : cat.id)}
          />
        ))}
      </div>
    </section>
  );
}
