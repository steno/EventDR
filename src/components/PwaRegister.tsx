"use client";

import { useEffect } from "react";
import {
  showBootSplashForReload,
} from "@/lib/boot-splash";

// Keep in sync with CACHE_NAME in public/sw.js (eventdr-v19 → "19").
const PWA_VERSION = "19";

function waitForWorkerState(
  worker: ServiceWorker,
  states: ServiceWorkerState[],
): Promise<void> {
  if (states.includes(worker.state)) return Promise.resolve();
  return new Promise((resolve) => {
    const onChange = () => {
      if (states.includes(worker.state)) {
        worker.removeEventListener("statechange", onChange);
        resolve();
      }
    };
    worker.addEventListener("statechange", onChange);
  });
}

/** Registers the service worker; updates reload under the boot splash when needed. */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const isDev = process.env.NODE_ENV !== "production";

    // Capture at load: first SW claim must not reload (that caused P → page → P).
    const hadControllerOnLoad = Boolean(navigator.serviceWorker.controller);
    let refreshing = false;
    let interval: ReturnType<typeof setInterval> | undefined;

    const reloadForUpdate = () => {
      if (refreshing) return;
      refreshing = true;
      showBootSplashForReload();
      window.location.reload();
    };

    const onControllerChange = () => {
      // Fresh install / post-purge claim: HTML is already network-fresh.
      // Skip reload thrash in local development.
      if (!hadControllerOnLoad || isDev) return;
      reloadForUpdate();
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        navigator.serviceWorker.getRegistration().then((reg) => {
          reg?.update().catch(() => {});
        });
      }
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );
    document.addEventListener("visibilitychange", onVisible);

    const settle = async () => {
      try {
        // Needed for web push reminders in both prod and `next dev`.
        // SW fetch handler already bypasses caching for HTML/JS.
        const reg = await navigator.serviceWorker.register(
          `/sw.js?v=${PWA_VERSION}`,
        );
        await reg.update().catch(() => {});

        // Activate a waiting update, then reload under the splash (prod only).
        if (!isDev && reg.waiting && hadControllerOnLoad) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
          return;
        }

        if (reg.installing) {
          await waitForWorkerState(reg.installing, [
            "activated",
            "redundant",
          ]);
        }

        if (!isDev) {
          interval = setInterval(() => {
            reg.update().catch(() => {});
          }, 15 * 60 * 1000);
        }
      } catch (error) {
        console.error("SW registration failed:", error);
      }
    };

    void settle();

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      document.removeEventListener("visibilitychange", onVisible);
      if (interval) clearInterval(interval);
    };
  }, []);

  return null;
}
