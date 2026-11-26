"use client";

import { memo, useEffect, useRef } from "react";
import Image, { type ImageLoaderProps } from "next/image";
import { getAppVersion } from "@/lib/app-version";
import { isOptimizableImageSrc } from "@/lib/optimizable-image";

interface EventImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  variant?: "thumb" | "hero";
}

/**
 * Local `/_next/image` URLs must include the deploy stamp. EventImage used to
 * strip `?v=` so the optimizer would accept the path — that left a 24h disk
 * cache keyed only on the file path, so swapped flyers stayed stale on cards
 * while a hard-refreshed detail hero looked updated.
 */
function versionedLocalLoader({ src, width, quality }: ImageLoaderProps): string {
  const path = src.includes("?") ? src.slice(0, src.indexOf("?")) : src;
  const params = new URLSearchParams({
    url: path,
    w: String(width),
    q: String(quality ?? 75),
    v: getAppVersion(),
  });
  return `/_next/image?${params.toString()}`;
}

/** Strip query for a stable public path (`/events/foo.jpg`). */
function bareLocalPath(src: string): string {
  return src.includes("?") ? src.slice(0, src.indexOf("?")) : src;
}

/**
 * Retry only after a finished decode that produced no bitmap (discard / error).
 * Never interrupt an in-flight load — that blanked dense Fri–Sat All-tab rows
 * on Chrome/PWA when IntersectionObserver fired mid-fetch.
 */
function useKickFailedImg(src: string, enabled: boolean) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const img = imgRef.current;
    if (!img || typeof IntersectionObserver === "undefined") return;

    let kicks = 0;
    const maybeKick = () => {
      // Still downloading — leave it alone.
      if (!img.complete) return;
      if (img.naturalWidth > 0) return;
      if (kicks >= 2) return;
      kicks += 1;
      const next = bareLocalPath(src);
      img.src = `${next}${next.includes("?") ? "&" : "?"}r=${kicks}`;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        maybeKick();
      },
      { rootMargin: "240px 0px 160px 0px", threshold: 0.01 },
    );
    io.observe(img);
    img.addEventListener("error", maybeKick);
    return () => {
      io.disconnect();
      img.removeEventListener("error", maybeKick);
    };
  }, [enabled, src]);

  return imgRef;
}

const EventImageComponent = ({
  src,
  alt,
  className = "object-cover",
  sizes = "96px",
  priority = false,
  variant = "thumb",
}: EventImageProps) => {
  const optimize = isOptimizableImageSrc(src);
  const isLocal = src.startsWith("/");
  const imageSrc =
    optimize && isLocal && src.includes("?")
      ? bareLocalPath(src)
      : src;
  const loader =
    optimize && isLocal ? versionedLocalLoader : undefined;
  const isThumb = variant === "thumb";
  const fetchPriority = priority ? "high" : "low";
  const thumbSrc = isLocal ? bareLocalPath(src) : src;
  const imgRef = useKickFailedImg(thumbSrc, isThumb);

  // List / poster thumbs: plain public JPEG (already ~1200px). Avoids
  // `/_next/image` queue pressure on long All-tab day grids.
  if (isThumb) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={imgRef}
        src={thumbSrc}
        alt={alt}
        className={`h-full w-full ${className}`}
        loading="eager"
        decoding={priority ? "sync" : "async"}
        fetchPriority={fetchPriority}
        draggable={false}
      />
    );
  }

  if (!optimize) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`block w-full h-auto ${className}`}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={fetchPriority}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={1200}
      height={800}
      sizes={sizes}
      quality={75}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={fetchPriority}
      loader={loader}
      className={`block w-full h-auto ${className}`}
    />
  );
};

export const EventImage = memo(EventImageComponent);
