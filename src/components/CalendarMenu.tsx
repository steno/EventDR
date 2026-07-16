"use client";

import { useSyncExternalStore } from "react";
import { Download } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  addToCalendarProvider,
  isAppleCalendarAvailable,
  type CalendarProvider,
} from "@/lib/calendar";

interface CalendarMenuProps {
  event: Event;
  dict: Dictionary;
  onClose: () => void;
}

const PROVIDERS: {
  id: CalendarProvider;
  labelKey: keyof Dictionary["detail"];
  className: string;
}[] = [
  {
    id: "google",
    labelKey: "calendarGoogle",
    className:
      "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 shadow-sm hover:text-neutral-900 dark:hover:text-neutral-100",
  },
  {
    id: "apple",
    labelKey: "calendarApple",
    className: "bg-neutral-900 text-white shadow-sm",
  },
  {
    id: "outlook",
    labelKey: "calendarOutlook",
    className: "bg-[#0078D4] text-white shadow-sm",
  },
  {
    id: "download",
    labelKey: "calendarDownload",
    className:
      "bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 shadow-sm hover:text-neutral-800 dark:hover:text-neutral-200",
  },
];

export function CalendarMenu({ event, dict, onClose }: CalendarMenuProps) {
  const appleAvailable = useSyncExternalStore(
    () => () => {},
    () => isAppleCalendarAvailable(),
    () => false,
  );

  async function handleProvider(provider: CalendarProvider) {
    await addToCalendarProvider(event, provider);
    onClose();
  }

  const visibleProviders = PROVIDERS.filter(
    (provider) => provider.id !== "apple" || appleAvailable,
  );

  return (
    <div className="rounded-3xl bg-white/85 dark:bg-neutral-800/85 p-3 shadow-sm ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 backdrop-blur">
      <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {dict.detail.calendarVia}
      </p>
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {visibleProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => handleProvider(provider.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2.5 text-[13px] font-bold touch-manipulation transition-all active:scale-[0.98] ${provider.className}`}
          >
            {provider.id === "download" && <Download className="h-4 w-4" />}
            {dict.detail[provider.labelKey]}
          </button>
        ))}
        </div>
        {/* Scroll hint gradient */}
        <div 
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/85 dark:from-neutral-800/85 to-transparent"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
