# Firebase setup for POP Events

1. Create a project at https://console.firebase.google.com (Spark/free tier is fine).
2. Enable **Firestore** (production mode).
3. Deploy rules from `firebase/firestore.rules` (Firebase console → Firestore → Rules).
4. Create a **service account** key:
   - Project settings → Service accounts → Generate new private key
5. Add env vars to Netlify (either style works):

**Option A — single JSON blob (easiest on Netlify):**
```
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...",...}
```

**Option B — separate fields:**
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Collections (auto-created on first write)

| Collection | Doc ID | Purpose |
|------------|--------|---------|
| `events` | event id | Community + ingested events (`pending` / `approved` / `rejected`) |
| `venues` | venue slug | LAX, Malecón, Kite Beach, etc. (auto-seeded on first fetch) |
| `pushSubscriptions` | SHA-256 of endpoint | Web push subscribers |

Venues seed automatically from `src/lib/venues-seed.ts` when the collection is empty.

## Firestore indexes

If queries fail, Firebase will log a link to create composite indexes for:
- `events`: `status` + `date`
- `events`: `status` + `date` (range queries for weekend count)
