"use client";

import { Bell, BellRing, Loader2 } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface PushNotifyButtonProps {
  dict: Dictionary;
  subscribed: boolean;
  supported: boolean;
  loading: boolean;
  onSubscribe: () => void;
}

export function PushNotifyButton({
  dict,
  subscribed,
  supported,
  loading,
  onSubscribe,
}: PushNotifyButtonProps) {
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={onSubscribe}
      disabled={loading || subscribed}
      className={`
        w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left
        border transition-colors
        ${
          subscribed
            ? "bg-green-50 border-green-100 text-green-800"
            : "bg-white border-neutral-100 hover:border-orange-200"
        }
        disabled:opacity-80
      `}
    >
      <div
        className={`
          flex h-10 w-10 items-center justify-center rounded-xl
          ${subscribed ? "bg-green-100" : "bg-orange-50"}
        `}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
        ) : subscribed ? (
          <BellRing className="h-5 w-5 text-green-600" />
        ) : (
          <Bell className="h-5 w-5 text-orange-500" />
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-neutral-900">
          {subscribed ? dict.push.enabled : dict.push.title}
        </p>
        <p className="text-xs text-neutral-500">
          {subscribed ? dict.push.enabledHint : dict.push.subtitle}
        </p>
      </div>
    </button>
  );
}
