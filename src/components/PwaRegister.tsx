"use client";

import { useEffect } from "react";
import {
  expectBootPart,
  readyBootPart,
  showBootSplashForReload,
} from "@/lib/boot-splash";

// Keep in sync with CACHE_NAME in public/sw.js (eventdr-v17 → "17").
const PWA_VERSION = "17";

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
    expectBootPart("sw");

    if (!("serviceWorker" in navigator)) {
      readyBootPart("sw");
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      const cleanupDevPwa = async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map((registration) => registration.unregister()),
        );
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        }
      };

      cleanupDevPwa()
        .catch(() => {})
        .finally(() => readyBootPart("sw"));
      return;
    }

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
      if (!hadControllerOnLoad) return;
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
      let awaitingReload = false;
      try {
        const reg = await navigator.serviceWorker.register(
          `/sw.js?v=${PWA_VERSION}`,
        );
        await reg.update().catch(() => {});

        // Activate a waiting update while splash can still cover, then reload.
        if (reg.waiting && hadControllerOnLoad) {
          awaitingReload = true;
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
          return;
        }

        if (reg.installing) {
          await waitForWorkerState(reg.installing, [
            "activated",
            "redundant",
          ]);
        }

        interval = setInterval(() => {
          reg.update().catch(() => {});
        }, 15 * 60 * 1000);
      } catch (error) {
        console.error("SW registration failed:", error);
      } finally {
        // Keep splash up when an update reload is about to fire.
        if (!refreshing && !awaitingReload) readyBootPart("sw");
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
