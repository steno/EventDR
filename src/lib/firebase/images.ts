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

  try {
    const bucket = storage.bucket();
    const fileName = `event-images/${eventId}.${parsed.extension}`;
    const file = bucket.file(fileName);

    await file.save(Buffer.from(parsed.base64, "base64"), {
      contentType: parsed.contentType,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
      public: true,
    });

    await file.makePublic();

    const projectId = bucket.name.replace(".appspot.com", "");
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return publicUrl;
  } catch (error) {
    console.error("Failed to upload event image:", error);
    return null;
  }
}

