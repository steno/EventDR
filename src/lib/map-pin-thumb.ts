import { isOptimizableImageSrc } from "@/lib/optimizable-image";

/** Display size of pin face (CSS px). */
export const MAP_PIN_THUMB_DISPLAY_PX = 36;

/**
 * Widths must exist in `next.config.ts` → `images.imageSizes`.
 * 64 ≈ 1× / light 2×, 96 ≈ dense 2× for a 36px face.
 */
const PIN_THUMB_W = 64;
const PIN_THUMB_W_2X = 96;
/** Must exist in `next.config.ts` → `images.qualities`. */
const PIN_THUMB_QUALITY = 65;

export type MapPinThumbProps = {
  src: string;
  srcSet?: string;
  sizes: string;
};

function nextImageUrl(src: string, width: number): string {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(PIN_THUMB_QUALITY),
  });
  return `/_next/image?${params.toString()}`;
}

/**
 * Tiny WebP (via `/_next/image`) for map pin faces — not the full hero JPEG.
 * Falls back to the original URL when Next cannot optimize the source.
 */
export function resolveMapPinThumb(
  src: string | undefined | null,
): MapPinThumbProps | null {
  const raw = src?.trim();
  if (!raw) return null;

  if (!isOptimizableImageSrc(raw)) {
    return { src: raw, sizes: `${MAP_PIN_THUMB_DISPLAY_PX}px` };
  }

  // Strip ?v= cache-busters so next/image can optimize local assets.
  const imageSrc =
    raw.startsWith("/") && raw.includes("?")
      ? raw.slice(0, raw.indexOf("?"))
      : raw;

  const src1x = nextImageUrl(imageSrc, PIN_THUMB_W);
  const src2x = nextImageUrl(imageSrc, PIN_THUMB_W_2X);

  return {
    src: src1x,
    srcSet: `${src1x} 1x, ${src2x} 2x`,
    sizes: `${MAP_PIN_THUMB_DISPLAY_PX}px`,
  };
}
