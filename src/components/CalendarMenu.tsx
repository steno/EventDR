"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { Download } from "lucide-react";
import { ActionSheet, ActionSheetTile } from "@/components/ActionSheet";
import {
  AppleIcon,
  GoogleIcon,
  OutlookIcon,
} from "@/components/ShareBrandIcons";
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
  well: string;
  icon: ReactNode;
}[] = [
  {
    id: "google",
    labelKey: "calendarGoogle",
    well: "bg-white text-neutral-800 ring-1 ring-neutral-200/90 dark:bg-neutral-900 dark:ring-neutral-700",
    icon: <GoogleIcon className="h-5 w-5" />,
  },
  {
    id: "apple",
    labelKey: "calendarApple",
    well: "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950",
    icon: <AppleIcon className="h-5 w-5" />,
  },
  {
    id: "outlook",
    labelKey: "calendarOutlook",
    well: "bg-[#0078D4] text-white",
    icon: <OutlookIcon className="h-5 w-5" />,
  },
  {
    id: "download",
    labelKey: "calendarDownload",
    well: "bg-white text-neutral-700 ring-1 ring-neutral-200/90 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700",
    icon: <Download className="h-5 w-5" strokeWidth={2} />,
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
    <ActionSheet title={dict.detail.calendarVia}>
      <div
        className={`grid gap-1 ${
          visibleProviders.length === 4 ? "grid-cols-4" : "grid-cols-3"
        }`}
      >
        {visibleProviders.map((provider) => (
          <ActionSheetTile
            key={provider.id}
            label={dict.detail[provider.labelKey]}
            onClick={() => handleProvider(provider.id)}
            wellClassName={provider.well}
            icon={provider.icon}
          />
        ))}
      </div>
    </ActionSheet>
  );
}
