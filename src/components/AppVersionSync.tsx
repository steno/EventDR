"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
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
  /** True when this boot is waiting on a version check before dismissing splash. */
  const bootBlocked = useRef(false);

  // If a prior stamp exists, hold the P splash until we know we won't reload —
  // otherwise content paints, then splash returns (feels like a double load).
  useLayoutEffect(() => {
    try {
      if (!localStorage.getItem(VERSION_KEY)) return;
    } catch {
      return;
    }
    bootBlocked.current = true;
    expectBootPart("version");
  }, []);

  const finishBootVersion = useCallback(() => {
    if (!bootBlocked.current) return;
    bootBlocked.current = false;
    readyBootPart("version");
  }, []);

  const checkVersion = useCallback(async () => {
    if (reloading.current) return;

    const remote = await fetchRemoteVersion();
    if (!remote) {
      finishBootVersion();
      return;
    }

    const stored = localStorage.getItem(VERSION_KEY);

    if (appVersionNeedsRefresh(stored, remote)) {
      reloading.current = true;
      // Stay on splash through reload; do not mark version ready.
      await purgeCachesAndReload(remote);
      return;
    }

    if (!stored) {
      localStorage.setItem(VERSION_KEY, remote);
    }
    finishBootVersion();
  }, [finishBootVersion]);

  useEffect(() => {
    void checkVersion();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void checkVersion();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        void checkVersion();
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
