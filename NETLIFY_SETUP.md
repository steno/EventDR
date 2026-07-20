# Netlify Setup Guide

This guide will help you configure environment variables and scheduled functions for your EventDR deployment on Netlify.

## 🔐 Environment Variables Setup

Go to your Netlify site: **Site settings → Environment variables → Add a variable**

### Required for Database & Events

```bash
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project",...}
```

Or alternatively, set these separately:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
```

**Optional: Custom Storage Bucket**

By default, the app uses `{project-id}.appspot.com`. If you need a custom bucket:

```bash
FIREBASE_STORAGE_BUCKET=your-custom-bucket.appspot.com
```

### Optional: Web Crawling & AI Enrichment

```bash
BRAVE_SEARCH_API_KEY=your-brave-key
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o-mini
```

### Optional: Venue tips (Google Places sentiment)

```bash
GOOGLE_PLACES_API_KEY=your-places-api-key
NEXT_PUBLIC_VENUE_ASSESSMENTS_ENABLED=true
```

Used server-side to blend POP editorial tips with Google **ratings** (Place Details Enterprise). Review texts (Atmosphere SKU) are only fetched when drafting opinions. Restrict the key to **Places API** only; leave application restriction as **None** (Netlify server calls). Set a daily quota and budget alert — Atmosphere calls are ~$25/1k after the free cap.

### Optional: Push Notifications

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-public-key
VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
VAPID_SUBJECT=mailto:you@example.com
```

### Optional: Manual Cron Triggers

```bash
CRON_SECRET=5d5e309d65e8788001f176a545533d69f83efe0d564665c6856febbb722bafae
```

**Note:** A secure CRON_SECRET has been generated for you above. This is only needed if you want to manually trigger cleanup/notify endpoints via HTTP requests. The automatic scheduled functions don't require this.

### Optional: Moderation

```bash
MODERATOR_SECRET=your-moderator-secret
```

## ⏰ Scheduled Functions

Your site includes two **Netlify Scheduled Functions** that run automatically:

### 1. Daily Cleanup (`scheduled-cleanup.mts`)
- **Schedule:** Every day at midnight UTC (`@daily`)
- **Purpose:** Removes expired one-time events from the database
- **Requirements:** Firebase configured
- **Location:** `netlify/functions/scheduled-cleanup.mts`

### 2. Weekend Digest (`scheduled-notify.mts`)
- **Schedule:** Every Friday at 9:00 AM UTC (`0 9 * * 5`)
- **Purpose:** Sends push notifications for weekend events
- **Requirements:** Firebase + Web Push (VAPID) configured
- **Location:** `netlify/functions/scheduled-notify.mts`

### How They Work

1. **Automatic Deployment:** These functions deploy automatically when you push to your main branch
2. **Production Only:** Scheduled functions only run on published production deploys (not branch previews)
3. **No Configuration Needed:** The schedules are defined in the function code itself
4. **Monitoring:** Check function logs in Netlify dashboard → Functions tab
5. **Manual Testing:** Use the "Run now" button in Netlify UI for testing

### Viewing Scheduled Functions

After deployment:
1. Go to your Netlify site dashboard
2. Click **Functions** in the left sidebar
3. You'll see `scheduled-cleanup` and `scheduled-notify` listed
4. Click on each to view logs and execution history
5. Use **Run now** button to test immediately

## 🚀 Quick Setup Steps

1. **Set Firebase credentials** (required for database access)
   ```bash
   # Copy your Firebase service account JSON
   # Go to Netlify: Site settings → Environment variables
   # Add FIREBASE_SERVICE_ACCOUNT_JSON with the full JSON
   ```

2. **Deploy to production**
   ```bash
   git push origin main
   ```

3. **Verify scheduled functions**
   - Go to Netlify dashboard → Functions
   - Confirm `scheduled-cleanup` and `scheduled-notify` appear
   - Click "Run now" on `scheduled-cleanup` to test

4. **Check logs**
   - After running, check the function logs
   - Should see: "Cleanup complete: X deleted, 0 errors"

## 📋 Environment Variables Checklist

- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` (or individual Firebase keys)
- [ ] Firebase Storage enabled in Firebase Console
- [ ] `BRAVE_SEARCH_API_KEY` (optional, for web search during ingest)
- [ ] `OPENAI_API_KEY` (optional, for AI event enrichment)
- [ ] Web Push VAPID keys (optional, for notifications)
- [ ] `CRON_SECRET` (optional, for manual API triggers)
- [ ] `MODERATOR_SECRET` (optional, for moderation panel)

## 🗄️ Firebase Storage Setup

For image uploads to work, you need to enable Firebase Storage:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **Get Started**
5. Choose **Start in production mode** or **Start in test mode**
6. Your default bucket will be `{project-id}.appspot.com`

**Storage Rules (optional):**

By default, images are made public after upload. If you want to customize permissions:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /event-images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🧪 Testing

### Test Scheduled Cleanup Manually

1. In Netlify dashboard: Functions → scheduled-cleanup → Run now
2. Check logs for output
3. Verify expired events were deleted from Firebase

### Test Weekend Notifications Manually

1. In Netlify dashboard: Functions → scheduled-notify → Run now
2. Check logs for notification count
3. Verify push notifications were sent to subscribers

### Test via API Endpoints (requires CRON_SECRET)

```bash
# Manual cleanup trigger
curl -X POST "https://your-site.netlify.app/api/cron/cleanup?secret=YOUR_CRON_SECRET"

# Manual notification trigger
curl -X POST "https://your-site.netlify.app/api/cron/notify?secret=YOUR_CRON_SECRET"
```

## 🔍 Troubleshooting

### Scheduled functions not appearing?
- Make sure you deployed to the main/production branch
- Check that `netlify/functions/*.mts` files exist in your repo
- Verify `@netlify/functions` is installed (check `package.json`)

### Functions failing?
- Check Firebase credentials are set correctly
- View function logs in Netlify dashboard
- Verify your Firebase service account has proper permissions

### Image upload failing?
- Check that Firebase Storage is enabled in your Firebase project
- Go to Firebase Console → Storage → Get Started
- The default storage bucket (`{project-id}.appspot.com`) should work automatically
- Images are stored as public URLs in the `event-images/` folder
- If you see "Failed to upload event image" in logs, check Firebase Storage rules

### No events being cleaned up?
- Check if you have any expired events in your database
- Run the function manually to see detailed logs
- Verify the function is using correct date logic (UTC timezone)

## 📚 Resources

- [Netlify Scheduled Functions Docs](https://docs.netlify.com/build/functions/scheduled-functions/)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Web Push VAPID Keys](https://developers.google.com/web/fundamentals/push-notifications/web-push-protocol)
