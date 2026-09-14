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
        className={`${PAGE_WIDTH_CLASS} grid grid-cols-2 items-center px-6 py-1.5`}
      >
        {items.map(({ id, label, badge }) => {
          const isActive = active === id;
          const isSubmit = id === "submit";

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className="
                group relative flex items-center justify-center py-1
                touch-manipulation transition-colors
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-orange-500
              "
            >
              <span className="relative flex h-10 w-10 items-center justify-center">
                {isSubmit ? (
                  <Plus
                    className={`
                      h-6 w-6 stroke-[2] transition-colors duration-200
                      group-active:scale-95
                      ${
                        isActive
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-orange-500 dark:text-orange-400"
                      }
                    `}
                    aria-hidden
                  />
                ) : (
                  <Heart
                    className={`
                      h-6 w-6 stroke-[2] transition-colors duration-200
                      group-active:scale-95
                      ${
                        isActive
                          ? "fill-rose-500 stroke-rose-500 text-rose-500 dark:fill-rose-400 dark:stroke-rose-400"
                          : "fill-none stroke-neutral-400 dark:stroke-neutral-500"
                      }
                    `}
                    aria-hidden
                  />
                )}

                {badge !== undefined && badge > 0 ? (
                  <span className="absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white dark:ring-neutral-950">
                    {badge}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
