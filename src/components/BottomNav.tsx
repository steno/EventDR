"use client";

import {
  Compass,
  Heart,
  PlusCircle,
} from "lucide-react";
import type { AppTab, Dictionary } from "@/i18n/dictionaries";
import { PAGE_WIDTH_CLASS } from "@/lib/page-shell";

interface BottomNavProps {
  active: AppTab;
  onChange: (tab: AppTab) => void;
  dict: Dictionary;
  savedCount: number;
}

export function BottomNav({
  active,
  onChange,
  dict,
  savedCount,
}: BottomNavProps) {
  const items: { id: AppTab; icon: typeof Compass; label: string; badge?: number }[] = [
    { id: "discover", icon: Compass, label: dict.nav.discover },
    { id: "saved", icon: Heart, label: dict.nav.saved, badge: savedCount || undefined },
    { id: "submit", icon: PlusCircle, label: dict.nav.submit },
  ];

  return (
    <nav
      className="
        fixed bottom-0 inset-x-0 z-40 lg:hidden
        bg-white/90 backdrop-blur-lg border-t border-neutral-100 dark:bg-neutral-900/90 dark:border-neutral-800
        pb-[env(safe-area-inset-bottom)]
      "
      aria-label="Main navigation"
    >
      <div className={`${PAGE_WIDTH_CLASS} flex justify-around px-1 pt-2.5 pb-2.5`}>
        {items.map(({ id, icon: Icon, label, badge }) => {
          const isActive = active === id;
          const isSubmit = id === "submit";
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`
                relative flex flex-col items-center gap-1 px-3 py-2 min-w-[68px] flex-1 max-w-[96px]
                transition-colors touch-manipulation
                ${
                  isSubmit
                    ? "text-orange-600"
                    : isActive
                      ? "text-neutral-900 dark:text-neutral-100"
                      : "text-neutral-500 dark:text-neutral-400"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {isSubmit ? (
                <span
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-full shadow-md
                    ${isActive ? "bg-orange-600 text-white" : "bg-orange-500 text-white shadow-orange-500/35"}
                  `}
                >
                  <Icon className="h-5 w-5 stroke-[2.5]" />
                </span>
              ) : (
                <Icon className={`h-6 w-6 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
              )}
              <span className={`text-[11px] font-bold tracking-wide leading-tight ${isSubmit ? "text-orange-600" : ""}`}>
                {label}
              </span>
              {badge !== undefined && badge > 0 && (
                <span className="absolute top-1 right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[11px] font-bold text-white shadow-sm">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
