"use client";

import { CheckCircle, Copy, Share2 } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { getOnboardingCopy } from "@/lib/onboarding";

type SubmitOnboardingCopy = ReturnType<typeof getOnboardingCopy>["submit"];

export interface SubmitEventSuccessProps {
  onboardingCopy: SubmitOnboardingCopy;
  successMessage: string;
  dict: Dictionary;
  submittedPending: boolean;
  submittedPath: string | null;
  copied: boolean;
  onShare: () => void;
  onCopy: () => void;
  onDone: () => void;
}

export function SubmitEventSuccess({
  onboardingCopy,
  successMessage,
  dict,
  submittedPending,
  submittedPath,
  copied,
  onShare,
  onCopy,
  onDone,
}: SubmitEventSuccessProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-12 text-center">
      <CheckCircle className="mb-4 h-14 w-14 text-emerald-500" />
      <h3 className="text-title font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
        {onboardingCopy.statusTitle}
      </h3>
      <p className="mt-2 max-w-sm text-copy font-medium text-neutral-500 dark:text-neutral-400">
        {successMessage || dict.submit.success}
      </p>
      <p className="mt-2 max-w-sm text-sm font-bold text-neutral-700 dark:text-neutral-200">
        {submittedPending
          ? onboardingCopy.pendingBody
          : onboardingCopy.liveBody}
      </p>
      {!submittedPending && submittedPath ? (
        <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onShare}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 px-4 text-sm font-bold text-white"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            {onboardingCopy.shareListing}
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 text-sm font-bold text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
          >
            <Copy className="h-4 w-4" aria-hidden />
            {copied ? onboardingCopy.copied : onboardingCopy.copyLink}
          </button>
        </div>
      ) : null}
      <button
        type="button"
        onClick={onDone}
        className="mt-4 min-h-11 rounded-full px-5 text-sm font-bold text-neutral-600 dark:text-neutral-300"
      >
        {onboardingCopy.done}
      </button>
    </div>
  );
}
