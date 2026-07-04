export const MAX_IMAGE_BYTES = 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export interface ParsedImageDataUrl {
  base64: string;
  byteLength: number;
  contentType: string;
  extension: string;
}

function extensionForContentType(contentType: string): string | null {
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return null;
}

export function parseImageDataUrl(dataUrl: unknown): ParsedImageDataUrl | null {
  if (typeof dataUrl !== "string" || !dataUrl) return null;

  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return null;

  const [, contentType, base64] = match;
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) return null;

  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  const byteLength = Math.floor((base64.length * 3) / 4) - padding;
  if (byteLength <= 0 || byteLength > MAX_IMAGE_BYTES) return null;

  const extension = extensionForContentType(contentType);
  if (!extension) return null;

  return { base64, byteLength, contentType, extension };
}
