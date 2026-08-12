"use client";

import type { RefObject } from "react";
import {
  CalendarPlus,
  Forward,
  Heart,
  Sparkles,
  Bell,
} from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { detailActionPanelClass } from "@/components/ActionSheet";
import { ShareMenu } from "@/components/ShareMenu";
import { CalendarMenu } from "@/components/CalendarMenu";
import {
  getOnboardingCopy,
  markOnboardingSeen,
} from "@/lib/onboarding";
import { usePushSubscription } from "@/hooks/usePushSubscription";

type ActionMenu = "share" | "calendar";

export interface EventDetailActionsProps {
  event: Event;
  dict: Dictionary;
  locale: Locale;
  standalone: boolean;
  actionsRef: RefObject<HTMLDivElement | null>;
  isSaved: boolean;
  shareMsg: string | null;
  shareOpen: boolean;
  calendarOpen: boolean;
  showSaveCelebration: boolean;
  showPushPrompt: boolean;
  showActionsCoach: boolean;
  showCalendarAction: boolean;
  actionCols: number;
  pushAfterCalendar: boolean;
  onboardingCopy: ReturnType<typeof getOnboardingCopy>;
  pushSubscription: ReturnType<typeof usePushSubscription>;
  iconActionClass: string;
  iconActionIdleClass: string;
  iconActionActiveClass: string;
  onToggleAction: (action: ActionMenu) => void;
  onShareFeedback: (message: string, durationMs?: number) => void;
  onDismissActionsCoach: () => void;
  onSave: () => void;
  onOfferPushPrompt: () => void;
  onSetOpenAction: (action: ActionMenu | null) => void;
  onSetShowSaveCelebration: (show: boolean) => void;
  onSetShowPushPrompt: (show: boolean) => void;
  onSetPushAfterCalendar: (value: boolean) => void;
}

export function EventDetailActions({
  event,
  dict,
  locale,
  standalone,
  actionsRef,
  isSaved,
  shareMsg,
  shareOpen,
  calendarOpen,
  showSaveCelebration,
  showPushPrompt,
  showActionsCoach,
  showCalendarAction,
  actionCols,
  pushAfterCalendar,
  onboardingCopy,
  pushSubscription,
  iconActionClass,
  iconActionIdleClass,
  iconActionActiveClass,
  onToggleAction,
  onShareFeedback,
  onDismissActionsCoach,
  onSave,
  onOfferPushPrompt,
  onSetOpenAction,
  onSetShowSaveCelebration,
  onSetShowPushPrompt,
  onSetPushAfterCalendar,
}: EventDetailActionsProps) {
  return (
    <>
      <div
        ref={actionsRef}
        className={
          standalone
            ? "relative isolate border-t border-neutral-100 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-neutral-800 dark:bg-neutral-900 sm:px-5 lg:px-5 lg:pb-4"
            : "relative isolate border-t border-neutral-100 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 lg:px-7 lg:pb-6"
        }
      >
        {shareMsg && (
          <p
            className="relative z-0 mb-2 text-center text-xs font-semibold text-orange-600 dark:text-orange-400"
            role="status"
            aria-live="polite"
          >
            {shareMsg}
          </p>
        )}
        {showSaveCelebration ? (
          <div
            className="relative z-10 mb-4 rounded-2xl bg-emerald-50 px-4 py-4 dark:bg-emerald-950/40"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <Sparkles
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-base font-black text-emerald-950 dark:text-emerald-100">
                  {onboardingCopy.saved.title}
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-emerald-800/80 dark:text-emerald-200/80">
                  {onboardingCopy.saved.body}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      markOnboardingSeen("calendar-prompt-seen");
                      onSetShowSaveCelebration(false);
                      onSetPushAfterCalendar(true);
                      onSetOpenAction("calendar");
                    }}
                    className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white dark:bg-emerald-500 dark:text-emerald-950"
                  >
                    {onboardingCopy.saved.calendar}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      markOnboardingSeen("calendar-prompt-seen");
                      onSetShowSaveCelebration(false);
                      onOfferPushPrompt();
                    }}
                    className="rounded-full px-3 py-2 text-sm font-bold text-emerald-800/80 dark:text-emerald-200/80"
                  >
                    {onboardingCopy.saved.keepBrowsing}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : showPushPrompt ? (
          <div className="relative z-10 mb-4 rounded-2xl bg-sky-50 px-4 py-4 dark:bg-sky-950/40">
            <div className="flex items-start gap-3">
              <Bell
                className="mt-0.5 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-base font-black text-sky-950 dark:text-sky-100">
                  {dict.push.title}
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-sky-900/75 dark:text-sky-200/80">
                  {pushSubscription.enabled
                    ? dict.push.enabledHint
                    : dict.push.subtitle}
                </p>
                {pushSubscription.error ? (
                  <p className="mt-1 text-sm font-bold text-red-600 dark:text-red-400">
                    {onboardingCopy.saved.pushError}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={pushSubscription.loading}
                    onClick={async () => {
                      const subscribed = await pushSubscription.subscribe();
                      if (subscribed) {
                        markOnboardingSeen("push-prompt-seen");
                        onSetShowPushPrompt(false);
                      }
                    }}
                    className="rounded-full bg-sky-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60 dark:bg-sky-500 dark:text-sky-950"
                  >
                    {pushSubscription.loading
                      ? "…"
                      : onboardingCopy.saved.pushEnable}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      markOnboardingSeen("push-prompt-seen");
                      onSetShowPushPrompt(false);
                    }}
                    className="rounded-full px-3 py-2 text-sm font-bold text-sky-800/80 dark:text-sky-200/80"
                  >
                    {onboardingCopy.saved.pushNotNow}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : shareOpen ? (
          <div className={detailActionPanelClass}>
            <ShareMenu
              event={event}
              locale={locale}
              dict={dict}
              onClose={() => onSetOpenAction(null)}
              onFeedback={onShareFeedback}
            />
          </div>
        ) : calendarOpen ? (
          <div className={detailActionPanelClass}>
            <CalendarMenu
              event={event}
              dict={dict}
              onClose={() => {
                onSetOpenAction(null);
                if (pushAfterCalendar) {
                  onSetPushAfterCalendar(false);
                  onOfferPushPrompt();
                }
              }}
            />
          </div>
        ) : showActionsCoach ? (
          <div className={detailActionPanelClass}>
            <p className="text-base font-black text-orange-950 dark:text-orange-100">
              {onboardingCopy.actions.title}
            </p>
            <p className="mt-1 text-sm font-medium leading-snug text-orange-900/75 dark:text-orange-200/80">
              {onboardingCopy.actions.body}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onDismissActionsCoach();
                  onSetOpenAction("share");
                }}
                className="rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white"
              >
                {onboardingCopy.actions.share}
              </button>
              <button
                type="button"
                onClick={onSave}
                className="rounded-full bg-orange-100/90 px-4 py-2 text-sm font-bold text-orange-900 dark:bg-orange-900/50 dark:text-orange-100"
              >
                {onboardingCopy.actions.save}
              </button>
              <button
                type="button"
                onClick={onDismissActionsCoach}
                className="rounded-full px-3 py-2 text-sm font-bold text-orange-800/70 dark:text-orange-300/70"
              >
                {onboardingCopy.actions.dismiss}
              </button>
            </div>
          </div>
        ) : null}
        <div
          className={`relative z-10 grid gap-2 ${
            actionCols === 3 ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          {showCalendarAction ? (
            <button
              type="button"
              onClick={() => onToggleAction("calendar")}
              className={`${iconActionClass} ${
                calendarOpen ? iconActionActiveClass : iconActionIdleClass
              }`}
              aria-label={dict.detail.calendar}
              title={dict.detail.calendar}
              aria-expanded={calendarOpen}
              aria-pressed={calendarOpen}
            >
              <CalendarPlus className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              onDismissActionsCoach();
              onToggleAction("share");
            }}
            className={`${iconActionClass} ${
              shareOpen || shareMsg ? iconActionActiveClass : iconActionIdleClass
            }`}
            aria-label={shareMsg ?? dict.detail.share}
            title={shareMsg ?? dict.detail.share}
            aria-expanded={shareOpen}
            aria-pressed={shareOpen}
          >
            <Forward className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onSave}
            className={`${iconActionClass} ${
              isSaved ? iconActionActiveClass : iconActionIdleClass
            }`}
            aria-label={isSaved ? dict.detail.saved : dict.detail.save}
            title={isSaved ? dict.detail.saved : dict.detail.save}
            aria-pressed={isSaved}
          >
            <Heart
              className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </>
  );
}
