import Image from "next/image";

interface EventImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  variant?: "thumb" | "hero";
}

export function EventImage({
  src,
  alt,
  className = "object-cover",
  sizes = "96px",
  priority = false,
  variant = "thumb",
}: EventImageProps) {
  const rawImage = src.startsWith("data:") || src.startsWith("http");

  if (rawImage) {
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
      />
    );
  }

  if (variant === "hero") {
    return (
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        sizes={sizes}
        priority={priority}
        className={`block w-full h-auto ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
