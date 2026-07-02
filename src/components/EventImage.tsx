import Image from "next/image";

interface EventImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function EventImage({
  src,
  alt,
  className = "object-cover",
  sizes = "96px",
  priority = false,
}: EventImageProps) {
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
