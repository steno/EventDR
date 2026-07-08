"use client";

import { useEffect, useState } from "react";

export function PwaRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

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

    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    const registerSw = async () => {
      try {
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(
            keys.filter((key) => key.startsWith("eventdr-")).map((key) => caches.delete(key)),
          );
        }

        const reg = await navigator.serviceWorker.register("/sw.js");
        setRegistration(reg);

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            // iOS/Android can report `navigator.serviceWorker.controller` as null sometimes,
            // so base the prompt on the SW registration state instead.
            if (newWorker.state === "installed" && reg.active) {
              setUpdateAvailable(true);
            }
          });
        });

        const checkForUpdates = () => {
          reg.update().catch(() => {});
        };

        checkForUpdates();
        const interval = setInterval(checkForUpdates, 60 * 60 * 1000);

        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") {
            checkForUpdates();
          }
        });

        return () => {
          clearInterval(interval);
        };
      } catch (error) {
        console.error("SW registration failed:", error);
      }
    };

    registerSw();

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  const handleUpdate = () => {
    if (!registration?.waiting) return;
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
    // iOS can be slow to trigger `controllerchange`; reload immediately after skipping waiting.
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up">
      <div className="bg-neutral-900 text-white rounded-lg shadow-lg p-4 flex items-center justify-between gap-3">
        <div className="flex-1">
          <p className="font-semibold text-sm">Update Available</p>
          <p className="text-xs text-neutral-300">A new version is ready to install</p>
        </div>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-white text-neutral-900 rounded-md text-sm font-semibold hover:bg-neutral-100 transition-colors whitespace-nowrap"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
