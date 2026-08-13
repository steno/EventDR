import { memo } from "react";
import Image from "next/image";
import { isOptimizableImageSrc } from "@/lib/optimizable-image";

interface EventImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  variant?: "thumb" | "hero";
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
  // Strip ?v= cache-busters so next/image can optimize local assets.
  // Remote URLs keep their query string (Firebase download tokens).
  const imageSrc =
    optimize && src.startsWith("/") && src.includes("?")
      ? src.slice(0, src.indexOf("?"))
      : src;

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
      className={className}
    />
  );
};

export const EventImage = memo(EventImageComponent);
