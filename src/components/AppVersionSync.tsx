"use client";

import { useCallback, useEffect, useRef } from "react";
import { appVersionNeedsRefresh } from "@/lib/app-version-shared";
import {
  expectBootPart,
  readyBootPart,
  showBootSplashForReload,
} from "@/lib/boot-splash";

const VERSION_KEY = "popevents-app-version";

async function fetchRemoteVersion(): Promise<string | null> {
  const sources = ["/app-version.json", "/api/app-version"];
  for (const url of sources) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) continue;
      const data = (await response.json()) as { version?: string };
      if (data.version) return data.version;
    } catch {
      /* try next source */
    }
  }
  return null;
}

async function purgeCachesAndReload(version: string) {
  showBootSplashForReload();
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }
  localStorage.setItem(VERSION_KEY, version);
  window.location.reload();
}

/** Silently refreshes when a new deploy stamp is detected (stuck PWA tabs). */
export function AppVersionSync() {
  const reloading = useRef(false);

  const checkVersion = useCallback(async () => {
    if (reloading.current) return;

    const remote = await fetchRemoteVersion();
    if (!remote) return;

    const stored = localStorage.getItem(VERSION_KEY);

    if (appVersionNeedsRefresh(stored, remote)) {
      reloading.current = true;
      await purgeCachesAndReload(remote);
      return;
    }

    if (!stored) {
      localStorage.setItem(VERSION_KEY, remote);
    }
  }, []);

  useEffect(() => {
    expectBootPart("version");

    const runBootCheck = async () => {
      await checkVersion();
      // If a reload was triggered, stay on the splash until navigation unloads.
      if (!reloading.current) readyBootPart("version");
    };

    void runBootCheck();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        checkVersion();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        checkVersion();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [checkVersion]);

  return null;
}
