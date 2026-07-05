import { randomUUID } from "crypto";
import type { Bucket } from "@google-cloud/storage";
import { getFirebaseStorage } from "./admin";
import { firebaseProjectId, storageBucketCandidates } from "./admin";
import { parseImageDataUrl } from "@/lib/image-data-url";

export type UploadEventImageResult =
  | { ok: true; url: string }
  | { ok: false; reason: "invalid" | "storage_unavailable" | "upload_failed" };

function firebaseDownloadUrl(bucket: string, fileName: string, token: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(fileName)}?alt=media&token=${token}`;
}

async function resolveBucket(): Promise<Bucket | null> {
  const storage = getFirebaseStorage();
  if (!storage) return null;

  for (const name of storageBucketCandidates()) {
    const bucket = storage.bucket(name);
    try {
      const [exists] = await bucket.exists();
      if (exists) return bucket;
    } catch {
      continue;
    }
  }
  return null;
}

export async function uploadEventImage(
  eventId: string,
  dataUrl: unknown,
): Promise<UploadEventImageResult> {
  const parsed = parseImageDataUrl(dataUrl);
  if (!parsed) return { ok: false, reason: "invalid" };

  const bucket = await resolveBucket();
  if (!bucket) {
    console.error(
      "uploadEventImage: no Firebase Storage bucket found for project",
      firebaseProjectId(),
      "— enable Storage in Firebase Console.",
    );
    return { ok: false, reason: "storage_unavailable" };
  }

  const fileName = `event-images/${eventId}.${parsed.extension}`;
  const file = bucket.file(fileName);
  const token = randomUUID();

  try {
    await file.save(Buffer.from(parsed.base64, "base64"), {
      contentType: parsed.contentType,
      metadata: {
        cacheControl: "public, max-age=31536000",
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    return {
      ok: true,
      url: firebaseDownloadUrl(bucket.name, fileName, token),
    };
  } catch (error) {
    console.error("Failed to upload event image:", error);
    return { ok: false, reason: "upload_failed" };
  }
}
