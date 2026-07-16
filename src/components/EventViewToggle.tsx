"use client";

import { LayoutGrid, List } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { EventListView } from "@/lib/event-list-view";

interface EventViewToggleProps {
  value: EventListView;
  onChange: (view: EventListView) => void;
  dict: Dictionary;
  className?: string;
}

const OPTIONS: {
  id: EventListView;
  icon: typeof List;
  labelKey: "viewList" | "viewCards";
}[] = [
  { id: "list", icon: List, labelKey: "viewList" },
  { id: "cards", icon: LayoutGrid, labelKey: "viewCards" },
];

export function EventViewToggle({
  value,
  onChange,
  dict,
  className = "",
}: EventViewToggleProps) {
  return (
    <div
      className={`inline-flex shrink-0 rounded-lg border border-neutral-200 bg-white p-0.5 dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
      role="group"
      aria-label={dict.events.viewMode}
    >
      {OPTIONS.map(({ id, icon: Icon, labelKey }) => {
        const selected = value === id;
        const label = dict.events[labelKey];
        return (
          <button
            key={id}
            type="button"
            aria-pressed={selected}
            aria-label={label}
            title={label}
            onClick={() => {
              if (id === value) return;
              onChange(id);
            }}
            className={`
              inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors touch-manipulation
              ${
                selected
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              }
            `}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
