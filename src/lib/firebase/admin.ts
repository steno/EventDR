import { createHash } from "crypto";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

export function firebaseProjectId(): string | undefined {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    ) as { project_id?: string };
    return serviceAccount.project_id;
  }
  return process.env.FIREBASE_PROJECT_ID;
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

export function isFirebaseConfigured(): boolean {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return true;
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export function getFirestoreDb(): Firestore | null {
  if (!isFirebaseConfigured()) return null;

  if (!getApps().length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
      ) as {
        project_id: string;
        client_email: string;
        private_key: string;
      };
      initializeApp({
        credential: cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key,
        }),
        storageBucket: firebaseStorageBucket(),
      });
    } else {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        }),
        storageBucket: firebaseStorageBucket(),
      });
    }
  }

  return getFirestore(getApps()[0]!);
}

export function getFirebaseStorage(): Storage | null {
  if (!isFirebaseConfigured()) return null;
  getFirestoreDb();
  return getStorage(getApps()[0]!);
}

export function subscriptionDocId(endpoint: string): string {
  return createHash("sha256").update(endpoint).digest("hex");
}
