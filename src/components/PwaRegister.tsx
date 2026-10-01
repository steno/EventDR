"use client";

import { useEffect } from "react";
import { pwaScriptUrl, stripPwaReloadParamFromLocation } from "@/lib/pwa-refresh";

/** Registers the service worker. Updates apply on the next cold open. */
export function PwaRegister() {
  useEffect(() => {
    stripPwaReloadParamFromLocation();
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const isDev = process.env.NODE_ENV !== "production";
    let interval: ReturnType<typeof setInterval> | undefined;

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        navigator.serviceWorker.getRegistration().then((reg) => {
          reg?.update().catch(() => {});
        });
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    const settle = async () => {
      try {
        // Needed for web push reminders in both prod and `next dev`.
        // register() already checks for an update. Do not call skipWaiting
        // or reload here — that claimed the page mid-boot and loaded it again.
        await navigator.serviceWorker.register(pwaScriptUrl());

        if (!isDev) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (!reg) return;
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
      document.removeEventListener("visibilitychange", onVisible);
      if (interval) clearInterval(interval);
    };
  }, []);

  return null;
}
