type AnalyticsParam = string | number | boolean;

const MAX_STRING = 100;
const DEDUPE_MS = 800;
const recent = new Map<string, number>();

function isDuplicate(key: string): boolean {
  const now = Date.now();
  const prev = recent.get(key);
  recent.set(key, now);
  if (recent.size > 40) {
    for (const [entry, at] of recent) {
      if (now - at > DEDUPE_MS) recent.delete(entry);
    }
  }
  return prev != null && now - prev < DEDUPE_MS;
}

/**
 * GA4 custom events. Page views stay in Analytics.tsx.
 * Mark the action events (not browse events) as key events in
 * Admin → Data display → Events so the Home card counts them.
 *
 * Actions: save_event, unsave_event, share, add_to_calendar, set_reminder,
 * get_directions, open_street_view, click_ticket, click_source, click_call,
 * click_outbound, newsletter_signup, partner_signup, submit_event, install_app
 * Browse: view_event, view_venue, search, select_city, select_cruise,
 * select_category, select_time
 */
export function trackEvent(
  name: string,
  params?: Record<string, AnalyticsParam | null | undefined>,
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const payload: Record<string, AnalyticsParam> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value == null || value === "") continue;
      if (typeof value === "string") {
        const trimmed = value.trim().slice(0, MAX_STRING);
        if (!trimmed) continue;
        payload[key] = trimmed;
      } else {
        payload[key] = value;
      }
    }
  }

  const key = `${name}:${JSON.stringify(payload)}`;
  if (isDuplicate(key)) return;

  window.gtag("event", name, payload);
}
