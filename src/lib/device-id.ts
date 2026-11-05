/** Anonymous device id for interest + engagement — one key across features. */
const DEVICE_KEY = "eventdr-device-id";

const DEVICE_ID_PATTERN = /^[A-Za-z0-9-]{16,64}$/;

export function isValidDeviceId(id: unknown): id is string {
  return typeof id === "string" && DEVICE_ID_PATTERN.test(id);
}

/** Browser-only; returns null when storage is unavailable. */
export function getDeviceId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return isValidDeviceId(id) ? id : null;
  } catch {
    return null;
  }
}
