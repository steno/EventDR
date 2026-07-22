/** Soft support nudge — visit cadence + dismiss cooldown in localStorage. */

const STORAGE_KEY = "pop-support-nudge-v1";
const DISMISS_DAYS = 21;
const MIN_VISITS = 3;

type SupportNudgeState = {
  visits: number;
  lastVisitDay: string;
  dismissedUntil: number;
  donatedAt: number | null;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyState(): SupportNudgeState {
  return {
    visits: 0,
    lastVisitDay: "",
    dismissedUntil: 0,
    donatedAt: null,
  };
}

function readState(): SupportNudgeState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<SupportNudgeState>;
    return {
      visits: typeof parsed.visits === "number" ? parsed.visits : 0,
      lastVisitDay:
        typeof parsed.lastVisitDay === "string" ? parsed.lastVisitDay : "",
      dismissedUntil:
        typeof parsed.dismissedUntil === "number" ? parsed.dismissedUntil : 0,
      donatedAt: typeof parsed.donatedAt === "number" ? parsed.donatedAt : null,
    };
  } catch {
    return emptyState();
  }
}

function writeState(state: SupportNudgeState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private browsing */
  }
}

/** Call once per page mount — counts at most one visit per calendar day. */
export function recordSupportVisit(): SupportNudgeState {
  const state = readState();
  const today = todayKey();
  if (state.lastVisitDay !== today) {
    state.lastVisitDay = today;
    state.visits += 1;
    writeState(state);
  }
  return state;
}

export function shouldShowSupportNudge(): boolean {
  const state = readState();
  if (state.donatedAt) return false;
  if (Date.now() < state.dismissedUntil) return false;
  return state.visits >= MIN_VISITS;
}

export function dismissSupportNudge(): void {
  const state = readState();
  state.dismissedUntil = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
  writeState(state);
}

export function markSupportDonated(): void {
  const state = readState();
  state.donatedAt = Date.now();
  state.dismissedUntil = Date.now() + 365 * 24 * 60 * 60 * 1000;
  writeState(state);
}
