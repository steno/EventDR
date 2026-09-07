"use client";

import { Bell, BellOff, Clock3, Sunrise, CalendarClock } from "lucide-react";
import { ActionSheet } from "@/components/ActionSheet";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  availableReminderTimings,
  formatRemindAtLabel,
  recommendedReminderOffset,
  type ReminderOffset,
} from "@/lib/event-reminders";
import type { StoredReminder } from "@/hooks/useEventReminders";

interface ReminderMenuProps {
  event: Event;
  dict: Dictionary;
  locale: Locale;
  active: StoredReminder | null;
  loading: boolean;
  onSelect: (offset: ReminderOffset) => void;
  onCancel: () => void;
}

const OFFSET_META: Record<
  ReminderOffset,
  {
    labelKey: "remindDayBefore" | "remindMorningOf" | "remindTwoHours";
    hintKey: "remindDayBeforeHint" | "remindMorningOfHint" | "remindTwoHoursHint";
    icon: typeof Bell;
  }
> = {
  day_before: {
    labelKey: "remindDayBefore",
    hintKey: "remindDayBeforeHint",
    icon: CalendarClock,
  },
  morning_of: {
    labelKey: "remindMorningOf",
    hintKey: "remindMorningOfHint",
    icon: Sunrise,
  },
  hours_before_2: {
    labelKey: "remindTwoHours",
    hintKey: "remindTwoHoursHint",
    icon: Clock3,
  },
};

export function ReminderMenu({
  event,
  dict,
  locale,
  active,
  loading,
  onSelect,
  onCancel,
}: ReminderMenuProps) {
  const timings = availableReminderTimings(event);
  const recommended = recommendedReminderOffset(timings);
  const dateLocale = locale === "es" ? "es-DO" : locale === "fr" ? "fr-FR" : "en-US";

  return (
    <ActionSheet title={dict.detail.remindVia}>
      {active ? (
        <div className="mb-3 rounded-xl bg-white/70 px-3 py-2.5 ring-1 ring-orange-200/60 dark:bg-white/5 dark:ring-white/10">
          <p className="text-sm font-bold text-orange-950 dark:text-orange-100">
            {dict.detail.remindOn}
          </p>
          <p className="mt-0.5 text-xs font-medium text-orange-900/70 dark:text-orange-200/70">
            {formatRemindAtLabel(new Date(active.remindAt), dateLocale)}
          </p>
        </div>
      ) : null}

      {timings.length === 0 ? (
        <p className="text-sm font-medium text-orange-900/75 dark:text-orange-200/80">
          {dict.detail.remindTooLate}
        </p>
      ) : (
        <ul className="space-y-1.5">
          {timings.map(({ offset, remindAt }) => {
            const meta = OFFSET_META[offset];
            const Icon = meta.icon;
            const isActive = active?.offset === offset;
            const isRecommended = !active && offset === recommended;
            return (
              <li key={offset}>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onSelect(offset)}
                  className={`
                    flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left
                    touch-manipulation transition-colors
                    ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : "bg-white/70 text-orange-950 ring-1 ring-orange-200/60 hover:bg-white dark:bg-white/5 dark:text-orange-50 dark:ring-white/10 dark:hover:bg-white/10"
                    }
                    disabled:opacity-60
                  `}
                >
                  <span
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                      ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-200"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {dict.detail[meta.labelKey]}
                      </span>
                      {isRecommended ? (
                        <span
                          className={`
                            rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide
                            ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-orange-200/80 text-orange-900 dark:bg-orange-800/60 dark:text-orange-100"
                            }
                          `}
                        >
                          {dict.detail.remindRecommended}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs font-medium ${
                        isActive
                          ? "text-white/80"
                          : "text-orange-900/65 dark:text-orange-200/65"
                      }`}
                    >
                      {dict.detail[meta.hintKey]} ·{" "}
                      {formatRemindAtLabel(remindAt, dateLocale)}
                    </span>
                  </span>
                  {isActive ? (
                    <Bell className="h-4 w-4 shrink-0 fill-current" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {active ? (
        <button
          type="button"
          disabled={loading}
          onClick={onCancel}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-orange-800/80 touch-manipulation hover:text-orange-950 disabled:opacity-60 dark:text-orange-200/80 dark:hover:text-orange-100"
        >
          <BellOff className="h-4 w-4" aria-hidden />
          {dict.detail.remindCancel}
        </button>
      ) : null}
    </ActionSheet>
  );
}
