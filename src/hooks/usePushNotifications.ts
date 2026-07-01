"use client";

import { useCallback, useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function usePushNotifications(locale: string) {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window,
    );
    if (localStorage.getItem("popevents-push") === "1") {
      setSubscribed(true);
    }
  }, []);

  const subscribe = useCallback(
    async (lat?: number, lng?: number) => {
      if (!supported) return false;
      setLoading(true);
      try {
        const perm = await Notification.requestPermission();
        if (perm !== "granted") return false;

        const keyRes = await fetch("/api/push/vapid-key");
        const keyData = (await keyRes.json()) as {
          configured?: boolean;
          publicKey?: string;
        };
        if (!keyData.configured || !keyData.publicKey) return false;

        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            keyData.publicKey,
          ) as BufferSource,
        });

        const json = sub.toJSON();
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription: json,
            locale,
            lat,
            lng,
          }),
        });

        localStorage.setItem("popevents-push", "1");
        setSubscribed(true);
        return true;
      } catch {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [supported, locale],
  );

  return { supported, subscribed, loading, subscribe };
}
