import { memo } from "react";
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
  // Path without ?v= for next/image `src`; version rides on the loader query.
  const imageSrc =
    optimize && isLocal && src.includes("?")
      ? src.slice(0, src.indexOf("?"))
      : src;
  const loader =
    optimize && isLocal ? versionedLocalLoader : undefined;

  if (!optimize) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={
          variant === "hero"
            ? `block w-full h-auto ${className}`
            : `h-full w-full ${className}`
        }
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "low"}
      />
    );
  }

  if (variant === "hero") {
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
        fetchPriority={priority ? "high" : "low"}
        loader={loader}
        className={`block w-full h-auto ${className}`}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      quality={65}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "low"}
      loader={loader}
      className={className}
    />
  );
};

export const EventImage = memo(EventImageComponent);
