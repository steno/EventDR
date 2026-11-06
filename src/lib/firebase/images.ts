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

function gcsPublicUrl(bucket: string, fileName: string): string {
  return `https://storage.googleapis.com/${bucket}/${fileName}`;
}

function isNativeFirebaseBucket(bucket: string): boolean {
  return (
    bucket.endsWith(".appspot.com") || bucket.endsWith(".firebasestorage.app")
  );
}

/** Public URL for a saved object — Firebase token URL or GCS + makePublic. */
async function publicUrlForUploadedFile(
  bucket: Bucket,
  fileName: string,
  token: string,
): Promise<string> {
  if (isNativeFirebaseBucket(bucket.name)) {
    return firebaseDownloadUrl(bucket.name, fileName, token);
  }
  const file = bucket.file(fileName);
  try {
    await file.makePublic();
  } catch (error) {
    console.error("uploadEventImage: makePublic failed:", error);
  }
  return gcsPublicUrl(bucket.name, fileName);
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

export async function uploadEventImageBytes(
  eventId: string,
  bytes: Buffer,
  contentType: string,
  extension: string,
): Promise<UploadEventImageResult> {
  if (!bytes.length || !contentType || !extension) {
    return { ok: false, reason: "invalid" };
  }

  const bucket = await resolveBucket();
  if (!bucket) {
    console.error(
      "uploadEventImage: no Firebase Storage bucket found for project",
      firebaseProjectId(),
      "— enable Storage in Firebase Console.",
    );
    return { ok: false, reason: "storage_unavailable" };
  }

  const fileName = `event-images/${eventId}.${extension}`;
  const file = bucket.file(fileName);
  const token = randomUUID();

  try {
    await file.save(bytes, {
      contentType,
      predefinedAcl: isNativeFirebaseBucket(bucket.name) ? undefined : "publicRead",
      metadata: {
        cacheControl: "public, max-age=31536000",
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    return {
      ok: true,
      url: await publicUrlForUploadedFile(bucket, fileName, token),
    };
  } catch (error) {
    console.error("Failed to upload event image:", error);
    return { ok: false, reason: "upload_failed" };
  }
}

export async function uploadEventImage(
  eventId: string,
  dataUrl: unknown,
): Promise<UploadEventImageResult> {
  const parsed = parseImageDataUrl(dataUrl);
  if (!parsed) return { ok: false, reason: "invalid" };

  return uploadEventImageBytes(
    eventId,
    Buffer.from(parsed.base64, "base64"),
    parsed.contentType,
    parsed.extension,
  );
}

/** Temporary public MP4 for Instagram Reels (Meta fetches the URL). */
export async function uploadSpotlightReelBytes(
  eventId: string,
  bytes: Buffer,
  dateISO: string,
): Promise<UploadEventImageResult> {
  return uploadSpotlightAssetBytes(
    eventId,
    bytes,
    dateISO,
    "mp4",
    "video/mp4",
  );
}

/** Temporary public still (styled story card) used as the Reel source frame. */
export async function uploadSpotlightStoryCardBytes(
  eventId: string,
  bytes: Buffer,
  dateISO: string,
): Promise<UploadEventImageResult> {
  return uploadSpotlightAssetBytes(
    eventId,
    bytes,
    dateISO,
    "jpg",
    "image/jpeg",
  );
}

async function uploadSpotlightAssetBytes(
  eventId: string,
  bytes: Buffer,
  dateISO: string,
  extension: string,
  contentType: string,
): Promise<UploadEventImageResult> {
  if (!bytes.length || !eventId.trim()) {
    return { ok: false, reason: "invalid" };
  }

  const bucket = await resolveBucket();
  if (!bucket) {
    console.error(
      "uploadSpotlightAsset: no Firebase Storage bucket found for project",
      firebaseProjectId(),
    );
    return { ok: false, reason: "storage_unavailable" };
  }

  const safeId = eventId.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 120);
  const fileName = `spotlight-reels/${dateISO}/${safeId}-${randomUUID().slice(0, 8)}.${extension}`;
  const file = bucket.file(fileName);
  const token = randomUUID();

  try {
    await file.save(bytes, {
      contentType,
      predefinedAcl: isNativeFirebaseBucket(bucket.name) ? undefined : "publicRead",
      metadata: {
        cacheControl: "public, max-age=86400",
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    return {
      ok: true,
      url: await publicUrlForUploadedFile(bucket, fileName, token),
    };
  } catch (error) {
    console.error("Failed to upload spotlight asset:", error);
    return { ok: false, reason: "upload_failed" };
  }
}
