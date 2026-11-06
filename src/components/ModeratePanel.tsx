"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  RefreshCw,
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { formatEventDateRange } from "@/lib/format-date";
import { formatEventPlace } from "@/lib/event-location";

type PendingModerateEvent = Event & {
  duplicateOf?: {
    id: string;
    title: string;
    status: string;
    score: number;
  } | null;
};

type ModerateTab = "pending" | "live" | "rejected";

interface ModeratePanelProps {
  dict: Dictionary;
  locale: Locale;
}

function EventThumb({ event }: { event: Event }) {
  if (!event.imageUrl) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote Storage URLs from submissions
    <img
      src={event.imageUrl}
      alt=""
      className="h-20 w-20 shrink-0 rounded-xl object-cover bg-neutral-100"
    />
  );
}

export function ModeratePanel({ dict, locale }: ModeratePanelProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const bootstrapKey =
    searchParams.get("key")?.trim() ||
    searchParams.get("secret")?.trim() ||
    "";

  const [tab, setTab] = useState<ModerateTab>("pending");
  const [pending, setPending] = useState<PendingModerateEvent[]>([]);
  const [live, setLive] = useState<Event[]>([]);
  const [rejected, setRejected] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsKey, setNeedsKey] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [firebaseDown, setFirebaseDown] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [keyDraft, setKeyDraft] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [lastApprovedId, setLastApprovedId] = useState<string | null>(null);

  const stripBootstrapQuery = useCallback(() => {
    if (!bootstrapKey) return;
    router.replace(pathname, { scroll: false });
  }, [bootstrapKey, pathname, router]);

  const flash = useCallback((message: string) => {
    setActionMsg(message);
    window.setTimeout(() => setActionMsg(null), 2500);
  }, []);

  const handleUnauthorized = useCallback(
    (code: string) => {
      setPending([]);
      setLive([]);
      setRejected([]);
      setNeedsKey(false);
      if (code === "not_configured") {
        setNotConfigured(true);
        setUnauthorized(false);
      } else {
        setUnauthorized(true);
        setNotConfigured(false);
        setNeedsKey(true);
      }
      stripBootstrapQuery();
    },
    [stripBootstrapQuery],
  );

  const unlockWithSecret = useCallback(
    async (secret: string): Promise<boolean> => {
      const res = await fetch("/api/moderate/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ secret }),
      });
      if (res.status === 401) {
        let code = "unauthorized";
        try {
          const body = (await res.json()) as { code?: string };
          code = body.code ?? "unauthorized";
        } catch {
          /* ignore */
        }
        handleUnauthorized(code);
        return false;
      }
      if (!res.ok) return false;
      setUnauthorized(false);
      setNeedsKey(false);
      setNotConfigured(false);
      return true;
    },
    [handleUnauthorized],
  );

  const loadQueue = useCallback(async () => {
    setLoading(true);
    setFirebaseDown(false);
    try {
      const res = await fetch("/api/moderate", { credentials: "include" });
      if (res.status === 401) {
        let code = "unauthorized";
        try {
          const body = (await res.json()) as { code?: string };
          code = body.code ?? "unauthorized";
        } catch {
          /* ignore */
        }
        if (code === "not_configured") {
          handleUnauthorized(code);
        } else {
          setPending([]);
          setLive([]);
          setRejected([]);
          setNeedsKey(true);
          setUnauthorized(false);
          setNotConfigured(false);
        }
        return;
      }
      if (res.status === 503) {
        setFirebaseDown(true);
        setPending([]);
        setLive([]);
        setRejected([]);
        return;
      }
      const data = (await res.json()) as {
        pending?: PendingModerateEvent[];
        events?: PendingModerateEvent[];
        live?: Event[];
        rejected?: Event[];
      };
      setPending(data.pending ?? data.events ?? []);
      setLive(data.live ?? []);
      setRejected(data.rejected ?? []);
      setUnauthorized(false);
      setNeedsKey(false);
      setNotConfigured(false);
    } catch {
      setPending([]);
      setLive([]);
      setRejected([]);
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (bootstrapKey) {
        setUnlocking(true);
        const ok = await unlockWithSecret(bootstrapKey);
        if (cancelled) return;
        setUnlocking(false);
        stripBootstrapQuery();
        if (ok) await loadQueue();
        else setLoading(false);
        return;
      }
      await loadQueue();
    }

    void boot();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bootstrap exchange is one-shot
  }, [bootstrapKey]);

  async function submitKey(e: FormEvent) {
    e.preventDefault();
    const value = keyDraft.trim();
    if (!value) return;
    setUnlocking(true);
    setUnauthorized(false);
    const ok = await unlockWithSecret(value);
    setUnlocking(false);
    if (!ok) return;
    setKeyDraft("");
    await loadQueue();
  }

  async function signOut() {
    await fetch("/api/moderate/session", {
      method: "DELETE",
      credentials: "include",
    });
    setPending([]);
    setLive([]);
    setRejected([]);
    setNeedsKey(true);
    setUnauthorized(false);
  }

  async function postAction(
    action: "approve" | "reject" | "delete" | "reject-all-pending",
    id?: string,
  ): Promise<Record<string, unknown> | null> {
    const res = await fetch("/api/moderate", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(id ? { id, action } : { action }),
    });
    if (res.status === 401) {
      handleUnauthorized("unauthorized");
      return null;
    }
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  }

  async function approve(id: string, fromRejected = false) {
    setBusyId(id);
    const ok = await postAction("approve", id);
    setBusyId(null);
    if (!ok) return;
    setPending((prev) => prev.filter((e) => e.id !== id));
    setRejected((prev) => prev.filter((e) => e.id !== id));
    setLastApprovedId(id);
    setTab("live");
    flash(fromRejected ? dict.moderate.restored : dict.moderate.approved);
    await loadQueue();
  }

  async function rejectOrUnpublish(id: string, asUnpublish: boolean) {
    const confirmed = window.confirm(
      asUnpublish
        ? dict.moderate.unpublishConfirm
        : dict.moderate.rejectConfirm,
    );
    if (!confirmed) return;
    setBusyId(id);
    const ok = await postAction("reject", id);
    setBusyId(null);
    if (!ok) return;
    setPending((prev) => prev.filter((e) => e.id !== id));
    setLive((prev) => prev.filter((e) => e.id !== id));
    flash(asUnpublish ? dict.moderate.unpublished : dict.moderate.rejected);
    await loadQueue();
  }

  async function deleteForever(id: string) {
    if (!window.confirm(dict.moderate.deleteForeverConfirm)) return;
    setBusyId(id);
    const ok = await postAction("delete", id);
    setBusyId(null);
    if (!ok) return;
    setPending((prev) => prev.filter((e) => e.id !== id));
    setLive((prev) => prev.filter((e) => e.id !== id));
    setRejected((prev) => prev.filter((e) => e.id !== id));
    flash(dict.moderate.deletedForever);
  }

  async function rejectAllPending() {
    if (pending.length === 0) return;
    if (!window.confirm(dict.moderate.rejectAllConfirm)) return;
    setBusyId("__all__");
    const result = await postAction("reject-all-pending");
    setBusyId(null);
    if (!result) return;
    const count = typeof result.rejected === "number" ? result.rejected : pending.length;
    flash(dict.moderate.rejectAllDone.replace("{count}", String(count)));
    await loadQueue();
    setTab("rejected");
  }

  if (notConfigured) {
    return (
      <div className="text-center py-16 space-y-2">
        <p className="text-red-500 font-medium">{dict.moderate.notConfigured}</p>
        <p className="text-sm text-neutral-400">{dict.moderate.notConfiguredHint}</p>
      </div>
    );
  }

  if (unauthorized || needsKey) {
    return (
      <div className="py-12 space-y-6 max-w-sm mx-auto">
        <div className="text-center space-y-2">
          <p
            className={`font-medium ${unauthorized ? "text-red-500" : "text-neutral-800 dark:text-neutral-100"}`}
          >
            {unauthorized
              ? dict.moderate.unauthorized
              : dict.moderate.keyRequired}
          </p>
          <p className="text-sm text-neutral-400">
            {unauthorized
              ? dict.moderate.unauthorizedHint
              : dict.moderate.keyRequiredHint}
          </p>
        </div>
        <form onSubmit={submitKey} className="space-y-3">
          <label className="block text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {dict.moderate.keyLabel}
            <input
              type="password"
              name="moderator-key"
              autoComplete="current-password"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-100"
              placeholder={dict.moderate.keyPlaceholder}
            />
          </label>
          <button
            type="submit"
            disabled={unlocking}
            className="w-full rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-2.5 text-sm font-bold disabled:opacity-60"
          >
            {unlocking ? dict.events.loading : dict.moderate.keySubmit}
          </button>
        </form>
      </div>
    );
  }

  if (firebaseDown) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-red-500 font-medium">{dict.moderate.firebaseRequired}</p>
        <p className="text-sm text-neutral-500">{dict.moderate.firebaseHint}</p>
      </div>
    );
  }

  const tabs: { id: ModerateTab; label: string; count: number }[] = [
    { id: "pending", label: dict.moderate.tabPending, count: pending.length },
    { id: "live", label: dict.moderate.tabLive, count: live.length },
    { id: "rejected", label: dict.moderate.tabRejected, count: rejected.length },
  ];

  function renderMeta(event: Event) {
    return (
      <>
        <p className="text-xs text-neutral-400 mt-2">
          {formatEventDateRange(event.date, locale, {
            endDate: event.endDate,
            short: true,
          })}
          {event.time ? ` · ${event.time}` : ""} · {formatEventPlace(event)}
        </p>
        {event.sourceType && (
          <p className="text-xs text-violet-600 font-medium mt-1">
            {dict.moderate.source}: {event.sourceType}
          </p>
        )}
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                tab === item.id
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-50"
                  : "text-neutral-500"
              }`}
            >
              {item.label}
              <span className="ml-1 tabular-nums opacity-60">{item.count}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void loadQueue()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {dict.moderate.refresh}
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800"
          >
            <LogOut className="h-4 w-4" />
            {dict.moderate.signOut}
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="flex flex-col gap-2 rounded-xl bg-green-50 text-green-800 px-4 py-3 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            {actionMsg}
          </div>
          {lastApprovedId ? (
            <Link
              href={`/${locale}/event/${lastApprovedId}`}
              className="inline-flex items-center gap-1 text-green-900 underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {dict.moderate.approvedOpen}
            </Link>
          ) : null}
        </div>
      )}

      {tab === "pending" && pending.length > 0 && (
        <button
          type="button"
          onClick={() => void rejectAllPending()}
          disabled={busyId === "__all__"}
          className="w-full rounded-xl border border-neutral-200 py-2.5 text-sm font-bold text-neutral-600 dark:border-neutral-700 dark:text-neutral-300 disabled:opacity-60"
        >
          {dict.moderate.rejectAllPending}
        </button>
      )}

      {loading ? (
        <p className="text-center text-neutral-400 py-8">{dict.events.loading}</p>
      ) : tab === "pending" ? (
        pending.length === 0 ? (
          <div className="text-center py-10 space-y-1">
            <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
              {dict.moderate.empty}
            </p>
            <p className="text-sm text-neutral-400">{dict.moderate.emptyPendingHint}</p>
          </div>
        ) : (
          pending.map((event) => {
            const dup = event.duplicateOf;
            const dupLive = dup?.status === "approved";
            return (
              <article
                key={event.id}
                className={`rounded-2xl bg-white border p-4 shadow-sm dark:bg-neutral-900 ${
                  dup
                    ? "border-amber-300"
                    : "border-neutral-100 dark:border-neutral-800"
                }`}
              >
                <div className="flex gap-3">
                  <EventThumb event={event} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-50">
                      {event.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-3">
                      {event.description}
                    </p>
                    {renderMeta(event)}
                  </div>
                </div>
                {dup && (
                  <div className="mt-3 flex gap-2 rounded-xl bg-amber-50 text-amber-950 px-3 py-2.5 text-xs leading-snug">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <p className="font-bold">{dict.moderate.duplicateWarning}</p>
                      <p className="mt-0.5">
                        {(dupLive
                          ? dict.moderate.duplicateLive
                          : dict.moderate.duplicatePending
                        ).replace("{title}", dup.title)}
                      </p>
                      {dupLive && (
                        <Link
                          href={`/${locale}/event/${dup.id}`}
                          className="inline-flex items-center gap-1 mt-1 font-semibold text-amber-800 underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {dup.id}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-3">
                  <Link
                    href={`/${locale}/moderate/preview/${event.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {dict.moderate.preview}
                  </Link>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    disabled={busyId === event.id}
                    onClick={() => void approve(event.id)}
                    className="flex-1 rounded-xl bg-green-600 text-white py-2.5 text-sm font-bold disabled:opacity-60"
                  >
                    {dict.moderate.approve}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === event.id}
                    onClick={() => void rejectOrUnpublish(event.id, false)}
                    className="flex-1 rounded-xl bg-neutral-100 text-neutral-700 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-neutral-200 disabled:opacity-60"
                  >
                    {dict.moderate.reject}
                  </button>
                </div>
              </article>
            );
          })
        )
      ) : tab === "live" ? (
        live.length === 0 ? (
          <p className="text-center text-neutral-400 py-10 text-sm">
            {dict.moderate.emptyLive}
          </p>
        ) : (
          live.map((event) => (
            <article
              key={event.id}
              className="rounded-2xl bg-white border border-neutral-100 p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800"
            >
              <div className="flex gap-3">
                <EventThumb event={event} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-50">
                    {event.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-2">
                    {event.description}
                  </p>
                  {renderMeta(event)}
                </div>
              </div>
              <div className="mt-3">
                <Link
                  href={`/${locale}/event/${event.id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {dict.moderate.viewListing}
                </Link>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  disabled={busyId === event.id}
                  onClick={() => void rejectOrUnpublish(event.id, true)}
                  className="flex-1 rounded-xl bg-neutral-100 text-neutral-700 py-2.5 text-sm font-bold dark:bg-neutral-800 dark:text-neutral-200 disabled:opacity-60"
                >
                  {dict.moderate.unpublish}
                </button>
                <button
                  type="button"
                  disabled={busyId === event.id}
                  onClick={() => void deleteForever(event.id)}
                  className="flex-1 rounded-xl bg-red-50 text-red-700 py-2.5 text-sm font-bold dark:bg-red-950/40 dark:text-red-300 disabled:opacity-60"
                >
                  {dict.moderate.deleteForever}
                </button>
              </div>
            </article>
          ))
        )
      ) : rejected.length === 0 ? (
        <p className="text-center text-neutral-400 py-10 text-sm">
          {dict.moderate.emptyRejected}
        </p>
      ) : (
        rejected.map((event) => (
          <article
            key={event.id}
            className="rounded-2xl bg-white border border-neutral-100 p-4 shadow-sm dark:bg-neutral-900 dark:border-neutral-800"
          >
            <div className="flex gap-3">
              <EventThumb event={event} />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-neutral-900 dark:text-neutral-50">
                  {event.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-2">
                  {event.description}
                </p>
                {renderMeta(event)}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                disabled={busyId === event.id}
                onClick={() => void approve(event.id, true)}
                className="flex-1 rounded-xl bg-green-600 text-white py-2.5 text-sm font-bold disabled:opacity-60"
              >
                {dict.moderate.restore}
              </button>
              <button
                type="button"
                disabled={busyId === event.id}
                onClick={() => void deleteForever(event.id)}
                className="flex-1 rounded-xl bg-red-50 text-red-700 py-2.5 text-sm font-bold dark:bg-red-950/40 dark:text-red-300 disabled:opacity-60"
              >
                {dict.moderate.deleteForever}
              </button>
            </div>
          </article>
        ))
      )}

      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 mt-6"
      >
        <ExternalLink className="h-4 w-4" />
        {dict.moderate.viewLive}
      </Link>
    </div>
  );
}
