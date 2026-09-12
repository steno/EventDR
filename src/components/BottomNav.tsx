"use client";

import { Heart, Plus } from "lucide-react";
import { useScrollChromeVisible } from "@/hooks/useScrollChrome";
import type { AppTab, Dictionary } from "@/i18n/dictionaries";
import { PAGE_WIDTH_CLASS } from "@/lib/page-shell";
import { SCROLL_CHROME_TRANSITION_CLASS } from "@/lib/scroll-chrome";

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
  const chromeVisible = useScrollChromeVisible();
  const items: {
    id: Extract<AppTab, "saved" | "submit">;
    label: string;
    badge?: number;
  }[] = [
    {
      id: "saved",
      label: dict.nav.saved,
      badge: savedCount || undefined,
    },
    { id: "submit", label: dict.nav.submit },
  ];

  return (
    <nav
      className={`
        fixed bottom-0 inset-x-0 z-40 lg:hidden
        border-t border-neutral-200/80 bg-white/95 backdrop-blur-xl
        dark:border-neutral-800 dark:bg-neutral-950/95
        pb-[max(env(safe-area-inset-bottom),0.25rem)]
        ${SCROLL_CHROME_TRANSITION_CLASS}
        ${chromeVisible ? "" : "translate-y-full pointer-events-none"}
      `}
      aria-label="Main navigation"
      aria-hidden={chromeVisible ? undefined : true}
    >
      <div
        className={`${PAGE_WIDTH_CLASS} grid grid-cols-2 items-center px-6 pt-1 pb-1`}
      >
        {items.map(({ id, label, badge }) => {
          const isActive = active === id;
          const isSubmit = id === "submit";

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? "page" : undefined}
              className="
                group relative flex flex-col items-center gap-0.5 py-0.5
                touch-manipulation transition-colors
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-orange-500
              "
            >
              <span className="relative flex h-9 w-9 items-center justify-center">
                {isSubmit ? (
                  <span
                    className={`
                      flex h-5 w-5 items-center justify-center rounded-full
                      transition-[background-color,box-shadow,transform] duration-200
                      group-active:scale-95
                      ${
                        isActive
                          ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                          : "bg-orange-500 text-white shadow-sm shadow-orange-500/25"
                      }
                    `}
                  >
                    <Plus className="h-3 w-3 stroke-[2.5]" aria-hidden />
                  </span>
                ) : (
                  <Heart
                    className={`
                      h-4 w-4 transition-colors duration-200
                      ${
                        isActive
                          ? "fill-rose-500 stroke-rose-500 text-rose-500 dark:fill-rose-400 dark:stroke-rose-400"
                          : "fill-none stroke-neutral-400 stroke-2 dark:stroke-neutral-500"
                      }
                    `}
                    aria-hidden
                  />
                )}

                {badge !== undefined && badge > 0 ? (
                  <span className="absolute -right-1 -top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white dark:ring-neutral-950">
                    {badge}
                  </span>
                ) : null}
              </span>

              <span
                className={`
                  text-[11px] font-bold leading-none tracking-wide
                  transition-colors duration-200
                  ${
                    isSubmit
                      ? "text-orange-600 dark:text-orange-400"
                      : isActive
                        ? "text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-500 dark:text-neutral-400"
                  }
                `}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
