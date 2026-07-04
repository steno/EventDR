import { getFirebaseStorage } from "./admin";
import { parseImageDataUrl } from "@/lib/image-data-url";

export async function uploadEventImage(
  eventId: string,
  dataUrl: unknown,
): Promise<string | null> {
  const parsed = parseImageDataUrl(dataUrl);
  if (!parsed) return null;

  const storage = getFirebaseStorage();
  if (!storage) return null;

  const bucket = storage.bucket();
  const file = bucket.file(`event-images/${eventId}.${parsed.extension}`);

  await file.save(Buffer.from(parsed.base64, "base64"), {
    contentType: parsed.contentType,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: "2100-01-01",
  });

  return url;
}

