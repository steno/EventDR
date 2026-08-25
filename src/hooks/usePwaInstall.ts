"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    __POP_BIP__?: BeforeInstallPromptEvent | null;
    __POP_BIP_BOUND__?: 1;
  }
}

export function detectIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function readDeferred(): BeforeInstallPromptEvent | null {
  if (typeof window === "undefined") return null;
  return window.__POP_BIP__ ?? null;
}

function subscribeDeferred(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  // Backup if the beforeInteractive capture script did not run.
  if (!window.__POP_BIP_BOUND__) {
    window.__POP_BIP_BOUND__ = 1;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      window.__POP_BIP__ = e as BeforeInstallPromptEvent;
      window.dispatchEvent(new Event("pop:beforeinstallprompt"));
    });
    window.addEventListener("appinstalled", () => {
      window.__POP_BIP__ = null;
      window.dispatchEvent(new Event("pop:appinstalled"));
    });
  }

  const onChange = () => onStoreChange();
  window.addEventListener("pop:beforeinstallprompt", onChange);
  window.addEventListener("pop:appinstalled", onChange);
  return () => {
    window.removeEventListener("pop:beforeinstallprompt", onChange);
    window.removeEventListener("pop:appinstalled", onChange);
  };
}

function getServerDeferred() {
  return null;
}

export function usePwaInstall() {
  const deferred = useSyncExternalStore(
    subscribeDeferred,
    readDeferred,
    getServerDeferred,
  );
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        (navigator as Navigator & { standalone?: boolean }).standalone === true);

    setIsStandalone(standalone);
    setIsIOS(detectIOS());

    const mq = window.matchMedia("(display-mode: standalone)");
    const onDisplayMode = () => {
      setIsStandalone(
        mq.matches ||
          ("standalone" in navigator &&
            (navigator as Navigator & { standalone?: boolean }).standalone ===
              true),
      );
    };
    mq.addEventListener("change", onDisplayMode);

    const onInstalled = () => setIsStandalone(true);
    window.addEventListener("pop:appinstalled", onInstalled);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      mq.removeEventListener("change", onDisplayMode);
      window.removeEventListener("pop:appinstalled", onInstalled);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const canShowInstall = !isStandalone;

  const promptInstall = useCallback(async () => {
    const event = readDeferred();
    if (!event) return false;
    try {
      await event.prompt();
      const { outcome } = await event.userChoice;
      // Event is single-use either way.
      window.__POP_BIP__ = null;
      window.dispatchEvent(new Event("pop:beforeinstallprompt"));
      return outcome === "accepted";
    } catch {
      window.__POP_BIP__ = null;
      window.dispatchEvent(new Event("pop:beforeinstallprompt"));
      return false;
    }
  }, []);

  return {
    deferred,
    isStandalone,
    isIOS,
    canShowInstall,
    canNativePrompt: Boolean(deferred),
    promptInstall,
  };
}
