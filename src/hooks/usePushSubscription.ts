"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";

function decodeVapidKey(value: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }
  return bytes;
}

export function usePushSubscription(locale: Locale) {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const canSubscribe =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    const frame = window.requestAnimationFrame(() => setSupported(canSubscribe));
    if (!canSubscribe) return;

    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setEnabled(Boolean(subscription)))
      .catch(() => {});
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const subscribe = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("permission-denied");

      const keyResponse = await fetch("/api/push/vapid-key");
      const keyData = (await keyResponse.json()) as {
        configured?: boolean;
        publicKey?: string;
      };
      if (!keyResponse.ok || !keyData.configured || !keyData.publicKey) {
        throw new Error("push-unavailable");
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: decodeVapidKey(keyData.publicKey),
        }));

      const serialized = subscription.toJSON();
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: {
            endpoint: serialized.endpoint,
            keys: serialized.keys,
          },
          locale,
        }),
      });
      if (!response.ok) throw new Error("subscribe-failed");
      setEnabled(true);
      return true;
    } catch {
      setError(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, [locale]);

  return { supported, enabled, loading, error, subscribe };
}
