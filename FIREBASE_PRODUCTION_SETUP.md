# Firebase Production Setup Guide

Complete guide to configure Firebase for production deployment on Netlify.

---

## Overview

Your EventDR app uses **Firebase Admin SDK** (server-side) to:
- Store events and venues in Firestore
- Handle moderation workflow (pending → approved/rejected)
- Save push notification subscriptions
- Store event images in Cloud Storage

**Without this setup**, events will only exist in-memory and disappear on each deploy.

---

## Part 1: Enable Firestore Database

### Step 1: Open Firebase Console

1. Go to: https://console.firebase.google.com/project/popevents-3264b
2. Sign in with your Google account

### Step 2: Enable Firestore

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** → **Next**
4. Select a Cloud Firestore location:
   - Choose **`us-east1`** or closest to Dominican Republic
   - ⚠️ **Cannot be changed later**
5. Click **"Enable"**

### Step 3: Deploy Security Rules

1. Once Firestore is created, click the **"Rules"** tab
2. Delete the default rules
3. Open your local file: `firebase/firestore.rules`
4. Copy **all contents** from that file
5. Paste into the Firebase Console Rules editor
6. Click **"Publish"**

✅ **Firestore is now ready**

---

## Part 2: Get Service Account Credentials

### Step 1: Navigate to Service Accounts

1. In Firebase Console, click the **⚙️ gear icon** (top-left) → **"Project settings"**
2. Click the **"Service accounts"** tab at the top

### Step 2: Generate Private Key

1. You'll see: `Firebase Admin SDK` section
2. Click the **"Generate new private key"** button
3. Confirm the popup: **"Generate key"**
4. A JSON file will download (e.g., `popevents-3264b-firebase-adminsdk-xxxxx.json`)
5. **Keep this file secure** — it has full admin access to your Firebase project

### Step 3: Open and Copy the JSON

1. Open the downloaded JSON file in a text editor
2. It looks like this:

```json
{
  "type": "service_account",
  "project_id": "popevents-3264b",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@popevents-3264b.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

3. **Select all and copy** the entire JSON content

---

## Part 3: Add Credentials to Netlify

### Step 1: Open Netlify Site Settings

1. Go to: https://app.netlify.com
2. Select your **EventDR site** (e.g., `popevent.netlify.app`)
3. Click **"Site configuration"** in the left sidebar
4. Click **"Environment variables"**

### Step 2: Add the Service Account Variable

1. Click **"Add a variable"** or **"Add environment variable"**
2. Fill in:
   - **Key**: `FIREBASE_SERVICE_ACCOUNT_JSON`
   - **Value**: Paste the entire JSON you copied (all lines, including braces)
   - **Scopes**: Select all deploy contexts (Production, Deploy previews, Branch deploys)
3. Click **"Create variable"**
4. ⚠️ Mark it as **"Secret"** or **"Sensitive"** if the option appears

### Step 3: Add Other Required Variables

While you're here, add these if not already set:

| Variable | Value | Description |
|----------|-------|-------------|
| `MODERATOR_SECRET` | Generate with: `openssl rand -hex 32` | Secret key for moderation page |
| `CRON_SECRET` | Generate with: `openssl rand -hex 32` | Secret for manual cron triggers |
| `JINA_API_KEY` | Get from https://jina.ai/?sui=apikey | Higher crawl rate limits (optional) |
| `OPENAI_API_KEY` | Get from https://platform.openai.com | AI event enrichment (optional) |

### Step 4: Trigger a New Deploy

1. In Netlify, go to **"Deploys"**
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
3. Wait for the deploy to complete (~2-3 minutes)

---

## Part 4: Verify It's Working

### Test 1: Check Status Endpoint

```bash
curl https://popevent.netlify.app/api/status
```

**Expected response:**
```json
{
  "ok": true,
  "firebase": true,
  "venueCount": 6,
  ...
}
```

✅ If `"firebase": true` → **Success!**  
❌ If `"firebase": false` → Check environment variables and redeploy

### Test 2: Check Venues API

```bash
curl https://popevent.netlify.app/api/venues
```

**Expected response:**
```json
{
  "source": "firebase",
  "venues": [...]
}
```

✅ If `"source": "firebase"` → **Working!**

### Test 3: Submit a Test Event

1. Open your live site: https://popevent.netlify.app
2. Tap **"+"** (Add event button)
3. Fill in event details
4. Submit
5. Check Firebase Console → Firestore Database → `events` collection
6. You should see a new document with `status: "pending"`

### Test 4: Moderation Page

1. Get your `MODERATOR_SECRET` from Netlify environment variables
2. Open: `https://popevent.netlify.app/en/moderate?key=YOUR_SECRET`
3. You should see pending events (not "Invalid moderator key")

---

## Part 5: Enable Cloud Storage (for Event Images)

### Step 1: Enable Storage

1. In Firebase Console, click **"Storage"** in left sidebar
2. Click **"Get started"**
3. Choose **"Start in production mode"** → **Next**
4. Use the **same location** as Firestore → **Done**

### Step 2: Update Storage Rules (Optional)

For public read access to event images:

1. Go to **Storage → Rules** tab
2. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

✅ **Storage ready for event images**

---

## Troubleshooting

### "Firebase not connected" in moderation page

**Cause:** Service account JSON not set or invalid

**Fix:**
1. Verify `FIREBASE_SERVICE_ACCOUNT_JSON` is set in Netlify
2. Check it's valid JSON (copy again if needed)
3. Redeploy with cache cleared

### "Submit says 'Published' instantly"

**Cause:** Firebase environment missing

**Fix:**
1. Events are staying in-memory only
2. Follow Part 3 above to add credentials
3. Redeploy

### "Permission denied" in Firestore

**Cause:** Security rules not deployed

**Fix:**
1. Go to Firestore → Rules tab
2. Paste contents of `firebase/firestore.rules`
3. Click Publish

### API returns 500 errors

**Cause:** Invalid private key formatting

**Fix:**
1. Service account JSON must be valid
2. Don't manually edit the private key
3. Regenerate if corrupted

---

## Security Notes

### ⚠️ Keep Service Account Secret

- **Never commit** the JSON file to git
- **Never share** the JSON publicly
- **Rotate keys** if exposed (Firebase Console → Service Accounts → Delete + Generate new)

### ✅ Safe to Share

- Project ID (`popevents-3264b`)
- Public site URL
- Client-side Firebase config (if you add it later)

---

## What's Next?

After Firebase is working:

1. ✅ **Seed venues**: Your app auto-creates initial venues on first run
2. ✅ **Set up moderation**: Bookmark `/en/moderate?key=YOUR_SECRET`
3. ✅ **Enable web push** (optional): Generate VAPID keys for weekend digests
4. ✅ **Monitor usage**: Firebase Console → Usage tab (you're on free Spark tier)

---

## Free Tier Limits (Spark Plan)

Your app is designed to fit within Firebase's free tier:

| Resource | Free Limit | EventDR Usage |
|----------|------------|---------------|
| Firestore reads | 50K/day | ~10K/day typical |
| Firestore writes | 20K/day | ~500/day typical |
| Storage | 5 GB | ~100 MB for images |
| Bandwidth | 1 GB/month | Minimal (server-side) |

You'll get email warnings before hitting limits.

---

## Need Help?

- **Firebase Console**: https://console.firebase.google.com/project/popevents-3264b
- **Netlify Dashboard**: https://app.netlify.com
- **Firebase Docs**: https://firebase.google.com/docs/admin/setup

---

**Last updated**: July 4, 2026
