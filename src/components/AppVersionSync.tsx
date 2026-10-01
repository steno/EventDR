"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  appVersionNeedsRefresh,
  shouldHardReloadForVersion,
  type NavigationLoadTiming,
} from "@/lib/app-version-shared";
import {
  PWA_RELOAD_PARAM,
  cacheBustingReloadHref,
  purgeClientCaches,
} from "@/lib/pwa-refresh";
import { showBootSplashForReload } from "@/lib/boot-splash";

const VERSION_KEY = "popevents-app-version";

async function fetchRemoteVersion(): Promise<string | null> {
  // Prefer /api — older SWs intercepted /app-version.json and could freeze the stamp.
  const sources = ["/api/app-version", "/app-version.json"];
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

function readNavigationTiming(): NavigationLoadTiming | null {
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (!nav) return null;
  return {
    transferSize: nav.transferSize,
    encodedBodySize: nav.encodedBodySize,
    alreadyReloaded: nav.name.includes(`${PWA_RELOAD_PARAM}=`),
  };
}

async function purgeCachesAndReload(version: string) {
  showBootSplashForReload();
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
  await purgeClientCaches();
  localStorage.setItem(VERSION_KEY, version);
  window.location.replace(cacheBustingReloadHref(window.location.href));
}

/** Silently refreshes when a new deploy stamp is detected (stuck PWA tabs). */
export function AppVersionSync() {
  const reloading = useRef(false);

  const checkVersion = useCallback(async (persisted = false) => {
    if (reloading.current) return;

    const remote = await fetchRemoteVersion();
    if (!remote) return;

    const stored = localStorage.getItem(VERSION_KEY);
    const restoredStalePage =
      persisted && appVersionNeedsRefresh(stored, remote);

    if (
      restoredStalePage ||
      shouldHardReloadForVersion(stored, remote, readNavigationTiming())
    ) {
      reloading.current = true;
      // Cached or bfcache-restored document only. A network-fresh load
      // already has this deploy; navigating again loads the page twice.
      await purgeCachesAndReload(remote);
      return;
    }

    if (stored !== remote) {
      if (stored) void purgeClientCaches();
      localStorage.setItem(VERSION_KEY, remote);
    }
  }, []);

  useEffect(() => {
    // Don't block the boot splash on this fetch — on Slow 3G it stretches the
    // logo screen for every returning visitor. Mismatch reloads are rare.
    void checkVersion();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void checkVersion();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        void checkVersion(true);
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
