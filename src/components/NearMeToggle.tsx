"use client";

import { MapPin, Loader2 } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface NearMeToggleProps {
  active: boolean;
  loading: boolean;
  error: boolean;
  onToggle: () => void;
  dict: Dictionary;
}

export function NearMeToggle({
  active,
  loading,
  error,
  onToggle,
  dict,
}: NearMeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading}
      className={`
        inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold
        transition-all border
        ${
          active
            ? "bg-orange-500 text-white border-orange-500 shadow-md"
            : "bg-white text-neutral-700 border-neutral-200 hover:border-orange-200"
        }
        disabled:opacity-60
      `}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4" />
      )}
      {active ? dict.events.nearMeOn : dict.events.nearMe}
      {error && !active && (
        <span className="text-[10px] font-medium opacity-70">
          ({dict.events.nearMeDenied})
        </span>
      )}
    </button>
  );
}
