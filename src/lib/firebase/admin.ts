import { createHash } from "crypto";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

type ServiceAccountFields = {
  project_id: string;
  client_email: string;
  private_key: string;
};

let initFailed = false;

function normalizePrivateKey(key: string): string {
  return key.replace(/\\n/g, "\n");
}

/** Parse Netlify-style service account JSON (handles double-encoding). */
function parseServiceAccountJson(
  raw: string,
): ServiceAccountFields | null {
  try {
    let parsed: unknown = JSON.parse(raw);
    // Some hosts store the JSON as a quoted/escaped string.
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
    if (!parsed || typeof parsed !== "object") return null;

    const record = parsed as Record<string, unknown>;
    const projectId = record.project_id;
    const clientEmail = record.client_email;
    const privateKey = record.private_key;
    if (
      typeof projectId !== "string" ||
      typeof clientEmail !== "string" ||
      typeof privateKey !== "string" ||
      !projectId ||
      !clientEmail ||
      !privateKey
    ) {
      return null;
    }

    return {
      project_id: projectId,
      client_email: clientEmail,
      private_key: normalizePrivateKey(privateKey),
    };
  } catch {
    return null;
  }
}

function getSplitCredentials(): ServiceAccountFields | null {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
  if (!projectId || !clientEmail || !privateKey) return null;
  return {
    project_id: projectId,
    client_email: clientEmail,
    private_key: normalizePrivateKey(privateKey),
  };
}

function getServiceAccountCredentials(): ServiceAccountFields | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (raw) {
    const fromJson = parseServiceAccountJson(raw);
    if (fromJson) return fromJson;
  }
  return getSplitCredentials();
}

export function firebaseProjectId(): string | undefined {
  return getServiceAccountCredentials()?.project_id;
}

function firebaseStorageBucket(): string | undefined {
  return storageBucketCandidates()[0];
}

export function storageBucketCandidates(): string[] {
  const projectId = firebaseProjectId();
  const fromEnv = process.env.FIREBASE_STORAGE_BUCKET?.trim();
  const defaults = projectId
    ? [`${projectId}.firebasestorage.app`, `${projectId}.appspot.com`]
    : [];
  return [...new Set([fromEnv, ...defaults].filter(Boolean))] as string[];
}

/** True when Firebase credentials are present and parseable (not necessarily usable yet). */
export function isFirebaseConfigured(): boolean {
  return getServiceAccountCredentials() != null;
}

export function getFirestoreDb(): Firestore | null {
  if (initFailed) return null;

  const credentials = getServiceAccountCredentials();
  if (!credentials) return null;

  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: credentials.project_id,
          clientEmail: credentials.client_email,
          privateKey: credentials.private_key,
        }),
        storageBucket: firebaseStorageBucket(),
      });
    }

    return getFirestore(getApps()[0]!);
  } catch (error) {
    initFailed = true;
    console.error("Firebase Admin init failed:", error);
    return null;
  }
}

export function getFirebaseStorage(): Storage | null {
  const db = getFirestoreDb();
  if (!db || !getApps().length) return null;
  try {
    return getStorage(getApps()[0]!);
  } catch (error) {
    console.error("Firebase Storage init failed:", error);
    return null;
  }
}

export function subscriptionDocId(endpoint: string): string {
  return createHash("sha256").update(endpoint).digest("hex");
}
