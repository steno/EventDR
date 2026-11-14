"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Play } from "lucide-react";

/** MCHNY (instrumental) — Steno Music — site-wide ambient trial. */
const TRACK_API_URL = "https://api.soundcloud.com/tracks/2399064840";
const TRACK_PAGE_URL =
  "https://soundcloud.com/stefan-asemota/mchny-instrumental";

const WIDGET_API_SRC = "https://w.soundcloud.com/player/api.js";
const IFRAME_ID = "pop-global-soundcloud";

type SoundCloudWidget = {
  bind: (event: string, listener: () => void) => void;
  play: () => void;
  pause: () => void;
  isPaused: (cb: (paused: boolean) => void) => void;
  getDuration: (cb: (ms: number) => void) => void;
};

type SoundCloudWidgetFactory = {
  (iframe: HTMLIFrameElement | string): SoundCloudWidget;
  Events: {
    READY: string;
    PLAY: string;
    PAUSE: string;
    FINISH: string;
  };
};

declare global {
  interface Window {
    SC?: { Widget: SoundCloudWidgetFactory };
  }
}

type GlobalSoundCloudValue = {
  ready: boolean;
  playing: boolean;
  toggle: () => void;
  trackUrl: string;
};

const GlobalSoundCloudContext = createContext<GlobalSoundCloudValue | null>(
  null,
);

function buildPlayerSrc(): string {
  const params = new URLSearchParams({
    url: TRACK_API_URL,
    color: "#e11d48",
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "false",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
    buying: "false",
    sharing: "false",
    download: "false",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

function loadWidgetApi(): Promise<SoundCloudWidgetFactory> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("no window"));
  }
  if (window.SC?.Widget) return Promise.resolve(window.SC.Widget);

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${WIDGET_API_SRC}"]`,
  );

  return new Promise((resolve, reject) => {
    const done = () => {
      if (window.SC?.Widget) resolve(window.SC.Widget);
      else reject(new Error("SoundCloud Widget missing after load"));
    };

    if (existing) {
      if (window.SC?.Widget) {
        done();
        return;
      }
      existing.addEventListener("load", done, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("SoundCloud Widget script failed")),
        { once: true },
      );
      // Cached script: load may never fire again.
      window.setTimeout(() => {
        if (window.SC?.Widget) done();
      }, 50);
      window.setTimeout(() => {
        if (!window.SC?.Widget) {
          reject(new Error("SoundCloud Widget script timed out"));
        }
      }, 8000);
      return;
    }

    const script = document.createElement("script");
    script.src = WIDGET_API_SRC;
    script.async = true;
    script.onload = done;
    script.onerror = () => reject(new Error("SoundCloud Widget script failed"));
    document.body.appendChild(script);
  });
}

export function useGlobalSoundCloud(): GlobalSoundCloudValue | null {
  return useContext(GlobalSoundCloudContext);
}

/**
 * Persistent SoundCloud transport for the whole locale shell. Mount once in
 * the locale layout so audio keeps playing across page navigations.
 */
export function GlobalSoundCloudProvider({ children }: { children: ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const playingRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let cancelled = false;
    let gestureBound = false;

    function setPlayingState(next: boolean) {
      playingRef.current = next;
      setPlaying(next);
    }

    function markReady(widget: SoundCloudWidget) {
      if (cancelled) return;
      setReady(true);
      if (pendingPlayRef.current) {
        pendingPlayRef.current = false;
        widget.play();
      } else {
        // Soft autoplay attempt — browsers may still require a gesture.
        widget.play();
      }
      window.setTimeout(() => {
        if (cancelled) return;
        widget.isPaused((paused) => {
          setPlayingState(!paused);
          if (paused) bindGestureFallback(widget);
        });
      }, 500);
    }

    function bindGestureFallback(widget: SoundCloudWidget) {
      if (gestureBound || cancelled) return;
      gestureBound = true;
      const opts: AddEventListenerOptions = { once: true, capture: true };
      const kick = () => widget.play();
      window.addEventListener("pointerdown", kick, opts);
      window.addEventListener("keydown", kick, opts);
      window.addEventListener("touchstart", kick, opts);
    }

    void (async () => {
      try {
        const Widget = await loadWidgetApi();
        if (cancelled || !iframeRef.current) return;

        // Bind against the element — more reliable than id lookup while React mounts.
        const widget = Widget(iframeRef.current);
        widgetRef.current = widget;

        let readyFired = false;
        widget.bind(Widget.Events.READY, () => {
          readyFired = true;
          markReady(widget);
        });
        widget.bind(Widget.Events.PLAY, () => {
          if (!cancelled) setPlayingState(true);
        });
        widget.bind(Widget.Events.PAUSE, () => {
          if (!cancelled) setPlayingState(false);
        });
        widget.bind(Widget.Events.FINISH, () => {
          if (!cancelled) setPlayingState(false);
        });

        // READY can fire before bind if the iframe was already warm — probe.
        const probe = () => {
          if (cancelled || readyFired) return;
          widget.getDuration((ms) => {
            if (cancelled || readyFired) return;
            if (typeof ms === "number" && ms > 0) {
              readyFired = true;
              markReady(widget);
            }
          });
        };
        window.setTimeout(probe, 400);
        window.setTimeout(probe, 1200);
        window.setTimeout(probe, 2500);
      } catch {
        /* Header stays clickable; toggle no-ops until a later reload. */
      }
    })();

    return () => {
      cancelled = true;
      widgetRef.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    const widget = widgetRef.current;
    if (!widget) {
      // Widget still booting — remember intent for markReady.
      pendingPlayRef.current = !playingRef.current;
      return;
    }
    if (playingRef.current) {
      widget.pause();
      playingRef.current = false;
      setPlaying(false);
    } else {
      widget.play();
      playingRef.current = true;
      setPlaying(true);
    }
  }, []);

  const value = useMemo(
    () => ({ ready, playing, toggle, trackUrl: TRACK_PAGE_URL }),
    [ready, playing, toggle],
  );

  return (
    <GlobalSoundCloudContext.Provider value={value}>
      {/*
        Real size + tiny opacity (not display:none / 1×1 / hard clip). SoundCloud
        needs measurable layout for Widget READY; off-screen left:-9999 can break play().
      */}
      <iframe
        ref={iframeRef}
        id={IFRAME_ID}
        title="MCHNY (instrumental) — Steno Music"
        width={300}
        height={166}
        scrolling="no"
        frameBorder="no"
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 z-[-1] h-[166px] w-[300px] opacity-[0.01]"
        src={buildPlayerSrc()}
      />
      {children}
    </GlobalSoundCloudContext.Provider>
  );
}

/** Header control — same chrome language as ThemeToggle. */
export function SoundCloudHeaderToggle() {
  const player = useGlobalSoundCloud();
  if (!player) return null;

  return (
    <button
      type="button"
      onClick={player.toggle}
      aria-label={
        player.playing
          ? "Pause MCHNY instrumental"
          : "Play MCHNY instrumental"
      }
      title={
        player.playing
          ? "Pause MCHNY instrumental"
          : "Play MCHNY instrumental"
      }
      aria-pressed={player.playing}
      aria-busy={!player.ready || undefined}
      className={`
        flex h-9 w-9 items-center justify-center rounded-full
        bg-white/85 shadow-sm ring-1 backdrop-blur
        transition-[color,box-shadow,ring-color] active:scale-95
        dark:bg-neutral-800/85
        ${
          player.playing
            ? "text-rose-600 ring-rose-400/70 hover:text-rose-700 dark:text-rose-300 dark:ring-rose-300/50 dark:hover:text-rose-200"
            : "text-neutral-600 ring-neutral-200/70 hover:text-neutral-900 dark:text-neutral-300 dark:ring-neutral-700/70 dark:hover:text-neutral-100"
        }
      `}
    >
      {player.playing ? (
        <span className="sc-eq" aria-hidden>
          <span className="sc-eq__bar" />
          <span className="sc-eq__bar" />
          <span className="sc-eq__bar" />
        </span>
      ) : (
        <Play className="h-4 w-4 translate-x-px" aria-hidden />
      )}
    </button>
  );
}
