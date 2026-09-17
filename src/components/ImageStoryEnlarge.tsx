"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
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
}

const TAP_MOVE_PX = 10;

type CoverSize = { width: number; height: number };

function coverSizeForViewport(
  naturalWidth: number,
  naturalHeight: number,
): CoverSize {
  const vw = window.visualViewport?.width ?? window.innerWidth;
  const vh = window.visualViewport?.height ?? window.innerHeight;
  const scale = Math.max(vw / naturalWidth, vh / naturalHeight);
  return {
    width: Math.ceil(naturalWidth * scale),
    height: Math.ceil(naturalHeight * scale),
  };
}

/**
 * Mobile-only square control → full-bleed story viewer.
 * Image fills the screen; slide/pan to see the rest. Light tap (or Escape) closes.
 */
export function ImageStoryEnlarge({
  src,
  alt,
  enlargeLabel,
  closeLabel,
  className = "",
}: ImageStoryEnlargeProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cover, setCover] = useState<CoverSize | null>(null);
  const titleId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tapRef = useRef({ x: 0, y: 0, moved: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal needs document
    setMounted(true);
  }, []);

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
      return;
    }

    const img = new window.Image();
    img.src = src;
    const apply = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      setCover(coverSizeForViewport(img.naturalWidth, img.naturalHeight));
    };
    if (img.complete) apply();
    else img.addEventListener("load", apply, { once: true });

    const onResize = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      setCover(coverSizeForViewport(img.naturalWidth, img.naturalHeight));
    };
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    return () => {
      img.removeEventListener("load", apply);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [open, src]);

  useEffect(() => {
    if (!open || !cover) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollLeft = Math.max(
      0,
      (scroller.scrollWidth - scroller.clientWidth) / 2,
    );
    scroller.scrollTop = Math.max(
      0,
      (scroller.scrollHeight - scroller.clientHeight) / 2,
    );
  }, [open, cover]);

  function openViewer(event: MouseEvent | PointerEvent) {
    event.preventDefault();
    event.stopPropagation();
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
            className="fixed inset-0 z-[100] bg-black"
          >
            <span id={titleId} className="sr-only">
              {alt}
            </span>
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
                style={
                  cover
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
        type="button"
        onClick={openViewer}
        onPointerDown={(event) => event.stopPropagation()}
        className={`
          pointer-events-auto absolute bottom-2.5 right-2.5 z-[2]
          flex h-8 w-8 items-center justify-center rounded-md
          bg-black/55 text-white shadow-sm backdrop-blur-sm
          touch-manipulation transition-colors active:bg-black/75
          lg:hidden
          ${className}
        `}
        aria-label={enlargeLabel}
      >
        <Maximize2 className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
      </button>
      {viewer}
    </>
  );
}
