"use client";

import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import type { AppTab, Dictionary } from "@/i18n/dictionaries";
import { PAGE_WIDTH_CLASS } from "@/lib/page-shell";

interface BottomNavProps {
  active: AppTab;
  onChange: (tab: AppTab) => void;
  dict: Dictionary;
  savedCount: number;
}

/** Shared icon well — top-aligns logo, heart, and + on one row. */
const ICON_WELL = "relative flex h-12 w-12 items-start justify-center";

function PopNavLogo({ active }: { active: boolean }) {
  return (
    <Image
      src="/pop-home-logo.png"
      alt=""
      width={48}
      height={48}
      unoptimized
      className={`h-12 w-12 object-contain object-top transition-opacity duration-200 ${
        active ? "opacity-100" : "opacity-40"
      }`}
    />
  );
}

export function BottomNav({
  active,
  onChange,
  dict,
  savedCount,
}: BottomNavProps) {
  const items: {
    id: AppTab;
    label: string;
    badge?: number;
    brand?: boolean;
  }[] = [
    { id: "discover", label: dict.seo.siteName, brand: true },
    {
      id: "saved",
      label: dict.nav.saved,
      badge: savedCount || undefined,
    },
    { id: "submit", label: dict.nav.submit },
  ];

  return (
    <nav
      className="
        fixed bottom-0 inset-x-0 z-40 lg:hidden
        border-t border-neutral-200/80 bg-white/95 backdrop-blur-xl
        dark:border-neutral-800 dark:bg-neutral-950/95
        pb-[max(env(safe-area-inset-bottom),0.375rem)]
      "
      aria-label="Main navigation"
    >
      <div
        className={`${PAGE_WIDTH_CLASS} grid grid-cols-[1fr_auto_1fr] items-start px-4 pt-2 pb-2`}
      >
        {items.map(({ id, label, badge, brand }) => {
          const isActive = active === id;
          const isSubmit = id === "submit";

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-label={brand ? label : undefined}
              aria-current={isActive ? "page" : undefined}
              className={`
                group relative flex flex-col gap-0.5 py-1 touch-manipulation transition-colors
                focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-2 focus-visible:outline-orange-500
                ${brand ? "items-start justify-self-start" : isSubmit ? "items-end justify-self-end" : "items-center justify-self-center"}
              `}
            >
              <span className={`relative ${ICON_WELL}`}>
                {brand ? (
                  <PopNavLogo active={isActive} />
                ) : isSubmit ? (
                  <span
                    className={`
                      flex h-9 w-9 items-center justify-center rounded-full
                      transition-[background-color,box-shadow,transform] duration-200
                      group-active:scale-95
                      ${
                        isActive
                          ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                          : "bg-orange-500 text-white shadow-sm shadow-orange-500/25"
                      }
                    `}
                  >
                    <Plus className="h-5 w-5 stroke-[2.5]" aria-hidden />
                  </span>
                ) : (
                  <Heart
                    className={`
                      h-6 w-6 transition-colors duration-200
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
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-neutral-950">
                    {badge}
                  </span>
                ) : null}
              </span>

              {brand ? null : (
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
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
