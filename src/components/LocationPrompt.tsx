"use client";

import { Loader2, MapPin } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface LocationPromptProps {
  dict: Dictionary;
  loading: boolean;
  denied: boolean;
  lowAccuracy: boolean;
  hasLocation: boolean;
  onRequest: () => void;
}

export function LocationPrompt({
  dict,
  loading,
  denied,
  lowAccuracy,
  hasLocation,
  onRequest,
}: LocationPromptProps) {
  if (hasLocation && !lowAccuracy) return null;

  const message = loading
    ? dict.events.nearMeLoading
    : denied
      ? dict.events.nearMeBlocked
      : lowAccuracy
        ? dict.events.nearMeLowAccuracy
        : dict.events.nearMePrompt;

  return (
    <div className="mb-4 flex items-start justify-between gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
      <p className="text-sm font-medium leading-snug text-orange-950">{message}</p>
      <button
        type="button"
        onClick={onRequest}
        disabled={loading}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-orange-600 px-3.5 py-2 text-xs font-black text-white touch-manipulation active:scale-95 transition-transform disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <MapPin className="h-3.5 w-3.5" />
        )}
        {dict.events.nearMe}
      </button>
    </div>
  );
}
