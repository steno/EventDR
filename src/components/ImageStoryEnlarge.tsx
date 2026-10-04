"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Maximize2 } from "lucide-react";

interface ImageStoryEnlargeProps {
  src: string;
  alt: string;
  enlargeLabel: string;
  closeLabel: string;
  /** Extra classes for the trigger (positioning overrides). */
  className?: string;
  /**
   * Custom trigger contents (all breakpoints). When set, replaces the
   * mobile-only maximize icon — use for CTAs like “Guarda el programa”.
   */
  trigger?: ReactNode;
  /**
   * Show the maximize icon on desktop too (default: mobile-only via `lg:hidden`).
   * Used on venue/event detail heroes where enlarge remains useful on large screens.
   */
  showOnDesktop?: boolean;
  /**
   * `cover` fills the viewport (default hero enlarge).
   * `width` fits image width so tall schedule flyers scroll vertically.
   */
  fit?: "cover" | "width";
}

const TAP_MOVE_PX = 10;
/** Skip a flash of the spinner when the full image is already cached. */
const SPINNER_DELAY_MS = 180;
/** Wait until a card has actually stayed on screen before fetching its full file. */
const PRELOAD_DWELL_MS = 400;

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

const warmedEnlargeSrcs = new Set<string>();
const queuedEnlargeSrcs = new Set<string>();
const enlargePreloadQueue: string[] = [];
let enlargePreloadsActive = 0;

function shouldSkipEnlargePreload(): boolean {
  const connection = (
    navigator as Navigator & { connection?: NetworkInfo }
  ).connection;
  if (!connection) return false;
  if (connection.saveData) return true;
  return (
    connection.effectiveType === "slow-2g" || connection.effectiveType === "2g"
  );
}

function pumpEnlargePreload() {
  if (enlargePreloadsActive > 0) return;
  const src = enlargePreloadQueue.shift();
  if (!src) return;
  queuedEnlargeSrcs.delete(src);
  if (warmedEnlargeSrcs.has(src)) {
    pumpEnlargePreload();
    return;
  }
  enlargePreloadsActive += 1;
  const img = new window.Image();
  const finish = () => {
    warmedEnlargeSrcs.add(src);
    enlargePreloadsActive -= 1;
    pumpEnlargePreload();
  };
  img.onload = finish;
  img.onerror = finish;
  img.src = src;
}

/** One full image at a time, only for sources still waiting. */
function warmEnlargeImage(src: string) {
  if (!src || warmedEnlargeSrcs.has(src) || queuedEnlargeSrcs.has(src)) return;
  if (shouldSkipEnlargePreload()) return;
  queuedEnlargeSrcs.add(src);
  enlargePreloadQueue.push(src);
  pumpEnlargePreload();
}

function cancelEnlargeWarm(src: string) {
  if (!queuedEnlargeSrcs.has(src)) return;
  queuedEnlargeSrcs.delete(src);
  const index = enlargePreloadQueue.indexOf(src);
  if (index >= 0) enlargePreloadQueue.splice(index, 1);
}

type CoverSize = { width: number; height: number };

function EnlargeSpinner() {
  return (
    <div
      className="page-loading-spinner"
      style={{ color: "#fff" }}
      aria-hidden
    >
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="page-loading-spinner__bar"
          style={{
            transform: `rotate(${i * 30}deg)`,
            animationDelay: `${(-1.1 + i * 0.1).toFixed(1)}s`,
          }}
        />
      ))}
    </div>
  );
}

function sizeForViewport(
  naturalWidth: number,
  naturalHeight: number,
  fit: "cover" | "width",
): CoverSize {
  const vw = window.visualViewport?.width ?? window.innerWidth;
  const vh = window.visualViewport?.height ?? window.innerHeight;
  const scale =
    fit === "width"
      ? vw / naturalWidth
      : Math.max(vw / naturalWidth, vh / naturalHeight);
  return {
    width: Math.ceil(naturalWidth * scale),
    height: Math.ceil(naturalHeight * scale),
  };
}

/**
 * Full-bleed story viewer for event images.
 * Default: mobile-only square maximize control (unless `showOnDesktop`).
 * With `trigger`: inline CTA (all breakpoints) — e.g. save/view program flyer.
 */
export function ImageStoryEnlarge({
  src,
  alt,
  enlargeLabel,
  closeLabel,
  className = "",
  trigger,
  showOnDesktop = false,
  fit = "cover",
}: ImageStoryEnlargeProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cover, setCover] = useState<CoverSize | null>(null);
  const [decoded, setDecoded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tapRef = useRef({ x: 0, y: 0, moved: false });
  const inlineTrigger = Boolean(trigger);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal needs document
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    let dwell = 0;
    let idle = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(dwell);
        if (idle) window.cancelIdleCallback?.(idle);
        idle = 0;
        if (!entry?.isIntersecting) {
          cancelEnlargeWarm(src);
          return;
        }
        // Flick-past cards never start a download. One file at a time so
        // thumbnails keep the connection.
        dwell = window.setTimeout(() => {
          const start = () => warmEnlargeImage(src);
          if (typeof window.requestIdleCallback === "function") {
            idle = window.requestIdleCallback(start, { timeout: 1500 });
          } else {
            start();
          }
        }, PRELOAD_DWELL_MS);
      },
      { rootMargin: "80px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(dwell);
      if (idle) window.cancelIdleCallback?.(idle);
      cancelEnlargeWarm(src);
    };
  }, [src]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset between opens
      setCover(null);
      setDecoded(false);
      setFailed(false);
      return;
    }

    setDecoded(false);
    setFailed(false);

    const img = new window.Image();
    img.src = src;
    const apply = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      setCover(sizeForViewport(img.naturalWidth, img.naturalHeight, fit));
      setDecoded(true);
    };
    const onError = () => setFailed(true);
    if (img.complete) {
      if (img.naturalWidth) apply();
      else onError();
    } else {
      img.addEventListener("load", apply, { once: true });
      img.addEventListener("error", onError, { once: true });
    }

    const onResize = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      setCover(sizeForViewport(img.naturalWidth, img.naturalHeight, fit));
    };
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      img.removeEventListener("load", apply);
      img.removeEventListener("error", onError);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [open, src, fit]);

  useEffect(() => {
    if (!open || !cover) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (fit === "width") {
      scroller.scrollLeft = 0;
      scroller.scrollTop = 0;
      return;
    }
    scroller.scrollLeft = Math.max(
      0,
      (scroller.scrollWidth - scroller.clientWidth) / 2,
    );
    scroller.scrollTop = Math.max(
      0,
      (scroller.scrollHeight - scroller.clientHeight) / 2,
    );
  }, [open, cover, fit]);

  const waiting = open && !decoded && !failed;
  useEffect(() => {
    if (!waiting) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hide as soon as the image is ready
      setShowSpinner(false);
      return;
    }
    const timer = window.setTimeout(() => setShowSpinner(true), SPINNER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [waiting]);

  function openViewer(event: MouseEvent | PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    setCover(null);
    setDecoded(false);
    setFailed(false);
    setOpen(true);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    tapRef.current = {
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (tapRef.current.moved) return;
    const dx = Math.abs(event.clientX - tapRef.current.x);
    const dy = Math.abs(event.clientY - tapRef.current.y);
    if (dx > TAP_MOVE_PX || dy > TAP_MOVE_PX) {
      tapRef.current.moved = true;
    }
  }

  function onTapClose() {
    if (!tapRef.current.moved) setOpen(false);
  }

  const viewer =
    open && mounted
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-busy={waiting || undefined}
            className="fixed inset-0 z-[100] bg-black"
          >
            <span id={titleId} className="sr-only">
              {alt}
            </span>
            {showSpinner ? (
              <div
                className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
                role="status"
              >
                <span className="sr-only">Loading</span>
                <EnlargeSpinner />
              </div>
            ) : null}
            <button
              type="button"
              className="sr-only"
              onClick={() => setOpen(false)}
            >
              {closeLabel}
            </button>
            <div
              ref={scrollerRef}
              className="h-dvh w-dvw overflow-auto overscroll-contain touch-pan-x touch-pan-y"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onClick={onTapClose}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                draggable={false}
                width={cover?.width}
                height={cover?.height}
                className="pointer-events-none block max-w-none select-none"
                onLoad={() => setDecoded(true)}
                onError={() => setFailed(true)}
                style={
                  cover && decoded
                    ? { width: cover.width, height: cover.height }
                    : { minWidth: "100%", minHeight: "100%", opacity: 0 }
                }
              />
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openViewer}
        onPointerDown={(event) => event.stopPropagation()}
        className={
          inlineTrigger
            ? className
            : `
          pointer-events-auto absolute bottom-2.5 right-2.5 z-[2]
          flex h-8 w-8 items-center justify-center rounded-md
          bg-black/55 text-white shadow-sm backdrop-blur-sm
          touch-manipulation transition-colors hover:bg-black/70 active:bg-black/75
          ${showOnDesktop ? "" : "lg:hidden"}
          ${className}
        `
        }
        aria-label={enlargeLabel}
      >
        {trigger ?? (
          <Maximize2 className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
        )}
      </button>
      {viewer}
    </>
  );
}
