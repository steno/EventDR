/**
 * Coordinates the root-layout boot splash: child trees register what they need
 * before expectations close, then mark each part ready when settled.
 *
 * Expectation window: closes shortly after the last expect() (so Suspense-delayed
 * Home can still register), with a hard max so static pages never hang.
 */

export type BootPart = "events" | "weather" | "version";

const expected = new Set<BootPart>();
const readyParts = new Set<BootPart>();
let expectationsClosed = false;
let quietTimer: ReturnType<typeof setTimeout> | undefined;
let maxTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

/** Quiet period after the latest expect before freezing the set. */
const EXPECT_QUIET_MS = 150;
/** Hard cap from when the boot window opens. */
const EXPECT_MAX_MS = 2500;

function notify() {
  for (const listener of listeners) listener();
}

function scheduleQuietClose() {
  if (expectationsClosed) return;
  if (quietTimer) clearTimeout(quietTimer);
  quietTimer = setTimeout(() => {
    closeBootExpectations();
  }, EXPECT_QUIET_MS);
}

/** Call once from BootSplashDismiss to open the expectation window. */
export function openBootExpectationWindow() {
  if (typeof window === "undefined" || expectationsClosed) return;
  if (maxTimer) return;
  maxTimer = setTimeout(() => {
    closeBootExpectations();
  }, EXPECT_MAX_MS);
}

/** Call from a component mount before the first fetch starts. */
export function expectBootPart(part: BootPart) {
  if (typeof window === "undefined") return;
  if (expectationsClosed) return;
  expected.add(part);
  scheduleQuietClose();
  notify();
}

/** Call when that part's first load has settled (success or failure). */
export function readyBootPart(part: BootPart) {
  if (typeof window === "undefined") return;
  readyParts.add(part);
  notify();
}

/** Stop accepting new expects (late mounts must not re-block the splash). */
export function closeBootExpectations() {
  if (expectationsClosed) return;
  expectationsClosed = true;
  if (quietTimer) clearTimeout(quietTimer);
  if (maxTimer) clearTimeout(maxTimer);
  quietTimer = undefined;
  maxTimer = undefined;
  notify();
}

export function isBootReady() {
  if (!expectationsClosed) return false;
  for (const part of expected) {
    if (!readyParts.has(part)) return false;
  }
  return true;
}

export function subscribeBootReady(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
