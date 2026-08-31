"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { canUseNativeShare } from "@/lib/share";

async function copyText(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand on mobile HTTP dev URLs.
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

export function CruiseLoopShare({
  title,
  url,
  shareLabel,
  copyLabel,
  copiedLabel,
}: {
  title: string;
  url: string;
  shareLabel: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const native = canUseNativeShare();

  async function onShare() {
    if (native) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    const ok = await copyText(url);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={() => void onShare()}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 text-sm font-bold text-neutral-800 shadow-sm touch-manipulation transition hover:bg-neutral-50 active:scale-[0.98] dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden />
      )}
      {copied ? copiedLabel : native ? shareLabel : copyLabel}
    </button>
  );
}
