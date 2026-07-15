"use client";

import { useEffect } from "react";

// Keep in sync with CACHE_NAME in public/sw.js (eventdr-v17 → "17").
const PWA_VERSION = "17";

/** Registers the service worker; new builds auto-activate and reload. */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
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

      cleanupDevPwa().catch(() => {});
      return;
    }

    let refreshing = false;
    let interval: ReturnType<typeof setInterval> | undefined;

    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        navigator.serviceWorker.getRegistration().then((reg) => {
          reg?.update().catch(() => {});
        });
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    document.addEventListener("visibilitychange", onVisible);

    navigator.serviceWorker
      .register(`/sw.js?v=${PWA_VERSION}`)
      .then((reg) => {
        reg.update().catch(() => {});
        interval = setInterval(() => {
          reg.update().catch(() => {});
        }, 15 * 60 * 1000);
      })
      .catch((error) => {
        console.error("SW registration failed:", error);
      });

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
