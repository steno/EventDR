"use client";

import {
  Compass,
  Heart,
  PlusCircle,
  Search,
} from "lucide-react";
import type { AppTab, Dictionary } from "@/i18n/dictionaries";

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
    { id: "search", icon: Search, label: dict.nav.search },
    { id: "saved", icon: Heart, label: dict.nav.saved, badge: savedCount || undefined },
    { id: "submit", icon: PlusCircle, label: dict.nav.submit },
  ];

  return (
    <nav
      className="
        fixed bottom-0 inset-x-0 z-40
        bg-white/90 backdrop-blur-lg border-t border-neutral-100
        pb-[env(safe-area-inset-bottom)]
      "
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-lg sm:max-w-2xl flex justify-around px-1 pt-2 pb-2">
        {items.map(({ id, icon: Icon, label, badge }) => {
          const isActive = active === id;
          const isSubmit = id === "submit";
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`
                relative flex flex-col items-center gap-0.5 px-2 py-1.5 min-w-[64px] flex-1 max-w-[88px]
                transition-colors
                ${
                  isSubmit
                    ? "text-orange-600"
                    : isActive
                      ? "text-neutral-900"
                      : "text-neutral-400"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {isSubmit ? (
                <span
                  className={`
                    flex h-9 w-9 items-center justify-center rounded-full shadow-md
                    ${isActive ? "bg-orange-600 text-white" : "bg-orange-500 text-white shadow-orange-500/35"}
                  `}
                >
                  <Icon className="h-5 w-5 stroke-[2.5]" />
                </span>
              ) : (
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              )}
              <span className={`text-[10px] font-bold tracking-wide ${isSubmit ? "text-orange-600" : ""}`}>
                {label}
              </span>
              {badge !== undefined && badge > 0 && (
                <span className="absolute top-0 right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
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
