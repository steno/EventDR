"use client";

import { useEffect, type RefObject } from "react";

/** Matches Tailwind `sm` — auto-nudge is mobile-only. */
const MOBILE_QUERY = "(max-width: 639px)";
const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const EDGE_PX = 2;
/** Tiny horizontal reveal — enough to hint overflow, not a carousel jump. */
const STEP_PX = 14;
/** Quiet between nudges (after the ease finishes). */
const STEP_GAP_MS = 1100;
/** Soft ease-in-out duration for each nudge. */
const EASE_MS = 700;
/** After finger-up / fling / mouseleave, wait for native scroll to settle. */
const RESUME_AFTER_MS = 450;
/** Let layout + active-pill scrollIntoView settle before the first nudge. */
const BOOT_MS = 900;

/** Ease in-out cubic — soft start and settle. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Mobile category rail: gentle ping-pong auto-nudges with eased steps.
 * Pauses on press or hover (cancels any in-flight ease so native slide stays free);
 * resumes after release / mouseleave; reverses at ends.
 */
export function useCategoryAutoStepScroll(
  scrollRef: RefObject<HTMLElement | null>,
  itemCount: number,
) {
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || itemCount <= 0) return;

    const mobileMq = window.matchMedia(MOBILE_QUERY);
    const reduceMq = window.matchMedia(REDUCE_MOTION_QUERY);

    let direction = 1;
    let held = false;
    let hovered = false;
    let gapTimer: number | null = null;
    let resumeTimer: number | null = null;
    let rafId: number | null = null;
    let disposed = false;
    let release: (() => void) | null = null;

    const overflowAmount = () => el.scrollWidth - el.clientWidth;

    const blocked = () => held || hovered;

    const canRun = () =>
      !disposed &&
      !blocked() &&
      !document.hidden &&
      mobileMq.matches &&
      !reduceMq.matches &&
      overflowAmount() > EDGE_PX;

    const cancelEase = () => {
      if (rafId == null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    };

    const clearGap = () => {
      if (gapTimer == null) return;
      window.clearTimeout(gapTimer);
      gapTimer = null;
    };

    const clearResume = () => {
      if (resumeTimer == null) return;
      window.clearTimeout(resumeTimer);
      resumeTimer = null;
    };

    const stop = () => {
      clearGap();
      clearResume();
      cancelEase();
    };

    /** Leave scroll where it is — drops any in-flight ease / smooth scroll. */
    const freezeScroll = () => {
      el.scrollLeft = el.scrollLeft;
    };

    const detachRelease = () => {
      if (!release) return;
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      release = null;
    };

    const scheduleNext = () => {
      clearGap();
      if (!canRun()) return;
      gapTimer = window.setTimeout(step, STEP_GAP_MS);
    };

    const animateTo = (target: number, onDone: () => void) => {
      cancelEase();
      const from = el.scrollLeft;
      const delta = target - from;
      if (Math.abs(delta) < 0.5) {
        el.scrollLeft = target;
        onDone();
        return;
      }

      const started = performance.now();
      const tick = (now: number) => {
        // Hand control back instantly — never fight a pan / hover.
        if (disposed || blocked()) {
          rafId = null;
          return;
        }
        const t = Math.min(1, (now - started) / EASE_MS);
        el.scrollLeft = from + delta * easeInOutCubic(t);
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        rafId = null;
        el.scrollLeft = target;
        onDone();
      };
      rafId = requestAnimationFrame(tick);
    };

    const step = () => {
      if (!canRun()) return;
      const max = overflowAmount();
      let next = el.scrollLeft + direction * STEP_PX;
      if (next <= EDGE_PX) {
        next = 0;
        direction = 1;
      } else if (next >= max - EDGE_PX) {
        next = max;
        direction = -1;
      }
      animateTo(next, scheduleNext);
    };

    const start = () => {
      stop();
      if (!canRun()) return;
      scheduleNext();
    };

    const scheduleResume = () => {
      clearResume();
      if (blocked()) return;
      resumeTimer = window.setTimeout(() => {
        resumeTimer = null;
        start();
      }, RESUME_AFTER_MS);
    };

    const onPointerDown = () => {
      held = true;
      stop();
      freezeScroll();
      detachRelease();
      release = () => {
        detachRelease();
        held = false;
        scheduleResume();
      };
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
    };

    const onMouseEnter = () => {
      hovered = true;
      stop();
      freezeScroll();
    };

    const onMouseLeave = () => {
      hovered = false;
      scheduleResume();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!blocked()) start();
    };

    const onEnvChange = () => {
      if (blocked()) return;
      start();
    };

    el.addEventListener("pointerdown", onPointerDown, { passive: true });
    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);
    mobileMq.addEventListener("change", onEnvChange);
    reduceMq.addEventListener("change", onEnvChange);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => onEnvChange())
        : null;
    ro?.observe(el);

    const boot = window.setTimeout(start, BOOT_MS);

    return () => {
      disposed = true;
      window.clearTimeout(boot);
      stop();
      detachRelease();
      ro?.disconnect();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      mobileMq.removeEventListener("change", onEnvChange);
      reduceMq.removeEventListener("change", onEnvChange);
    };
  }, [scrollRef, itemCount]);
}
