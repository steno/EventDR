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

/** Normalize browser/OS-specific image MIME labels. */
export function normalizeImageMime(mime: string): string | null {
  const lower = mime.toLowerCase().trim();
  if (lower === "image/jpg" || lower === "image/pjpeg") return "image/jpeg";
  if (lower === "image/x-png") return "image/png";
  if (ALLOWED_IMAGE_TYPES.has(lower)) return lower;
  return null;
}

function extensionFromFileName(name: string): string | null {
  const ext = name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
  if (ext === "jpg" || ext === "jpeg") return "jpg";
  if (ext === "png") return "png";
  if (ext === "webp") return "webp";
  return null;
}

export function isAcceptedImageFile(file: File): boolean {
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) return false;
  if (normalizeImageMime(file.type)) return true;
  return extensionFromFileName(file.name) !== null;
}

function base64ByteLength(base64: string): number {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

export function parseImageDataUrl(dataUrl: unknown): ParsedImageDataUrl | null {
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) return null;

  const comma = dataUrl.indexOf(",");
  if (comma < 0) return null;

  const header = dataUrl.slice(5, comma);
  const base64Marker = ";base64";
  if (!header.endsWith(base64Marker)) return null;

  const mimeRaw = header.slice(0, -base64Marker.length).split(";")[0] ?? "";
  const contentType = normalizeImageMime(mimeRaw);
  if (!contentType) return null;

  const base64 = dataUrl.slice(comma + 1).replace(/\s/g, "");
  if (!base64 || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) return null;

  const byteLength = base64ByteLength(base64);
  if (byteLength <= 0 || byteLength > MAX_IMAGE_BYTES) return null;

  const extension = extensionForContentType(contentType);
  if (!extension) return null;

  return { base64, byteLength, contentType, extension };
}
