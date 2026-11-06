# Firebase + moderation — POP Events

Project: **popevents-3264b**  
Console: https://console.firebase.google.com/project/popevents-3264b

## 1. Firestore (one-time)

1. Enable **Firestore** → production mode  
2. **Rules** tab → paste contents of `firebase/firestore.rules` → Publish  
3. Service account key → Netlify env `FIREBASE_SERVICE_ACCOUNT_JSON`

Verify live:

```bash
curl https://popevent.netlify.app/api/venues
# → "source": "firebase", 6 venues
```

```bash
curl -H "Authorization: Bearer $MODERATOR_SECRET" https://popevent.netlify.app/api/status
# → ok/firebase + pendingCount when authenticated; public body is {ok, firebase} only
```

## 2. Moderation secret (Netlify)

1. Generate a long random string (password manager or `openssl rand -hex 32`)
2. Netlify → **Site configuration → Environment variables**
3. Add:

| Key | Value |
|-----|--------|
| `MODERATOR_SECRET` | your random string (mark as secret) |

4. **Trigger deploy** (clear cache)

## 3. Your moderation URL

Bookmark this (replace `YOUR_SECRET`):

```
https://popevent.netlify.app/en/moderate?key=YOUR_SECRET
```

Spanish: `/es/moderate?key=YOUR_SECRET`

**Do not share publicly** — anyone with the key can approve/reject events.

## 4. Daily workflow

```
User taps "Add event" → POST /api/submit → Firestore status: pending
  (+ Resend email to MODERATOR_NOTIFY_EMAIL when configured)
You open https://pop-event.com/en/moderate → Unlock once with MODERATOR_SECRET
  (httpOnly cookie, 90 days) → Pending / Live / Unpublished tabs
Approve → live; Reject/Unpublish → rejected (recoverable); Delete forever → hard delete
```

Bookmark `/en/moderate` after the first unlock — no `?key=` needed.

Test the queue depth (Bearer header; query `?secret=` is rejected):

```bash
curl -H "Authorization: Bearer YOUR_SECRET" "https://pop-event.com/api/status"
# → pendingCount, pendingIds
```

## 5. Firestore collections

| Collection | Doc ID | Purpose |
|------------|--------|---------|
| `events` | event id | `pending` → `approved` / `rejected` |
| `venues` | venue slug | Auto-seeded (LAX, Malecón, …) |
| `pushSubscriptions` | hash | Web push (optional) |

## 6. Firestore indexes

If the events API errors, Firebase console will show a link to create:

- `events`: `status` + `date` (composite)

## 7. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Submit says "Published" instantly | Firebase env missing — submissions stay in-memory only |
| Submit fails with image error / photo missing | Create a GCS bucket in the Firebase project (or Firebase Console → Storage → Get started). Set `FIREBASE_STORAGE_BUCKET` (e.g. `popevents-3264b-media`) in `.env.local` + Netlify, then restart/redeploy. |
| Moderate page: "Invalid moderator key" | Wrong `?key=` or `MODERATOR_SECRET` not set / redeploy |
| Moderate page: "Firebase not connected" | `FIREBASE_SERVICE_ACCOUNT_JSON` missing or invalid JSON |
| Approved event not visible | Hard refresh discover; check Firestore `events` doc has `status: approved` |
