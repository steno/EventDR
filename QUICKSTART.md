# 🚀 Quick Start - What You Need to Do in Netlify

## Step 1: Set Environment Variables

Go to your Netlify site: **https://app.netlify.com/sites/popevent/settings/env**

Click **Add a variable** and add these one by one:

### ✅ Required: Firebase (for database access)

```
Variable name: FIREBASE_SERVICE_ACCOUNT_JSON
Value: [Paste your entire Firebase service account JSON here]
```

**How to get Firebase credentials:**
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project (or create one if you don't have it)
3. Go to Project settings (gear icon) → Service accounts
4. Click "Generate new private key"
5. Copy the entire JSON content and paste it as the value

**Enable Firebase Storage (for image uploads):**
1. In Firebase Console, click **Storage** in the left sidebar
2. Click **Get Started**
3. Choose **Start in production mode**
4. Your storage bucket will be `{project-id}.appspot.com`

---

### Optional: Generated CRON_SECRET (for manual API triggers)

```
Variable name: CRON_SECRET
Value: 5d5e309d65e8788001f176a545533d69f83efe0d564665c6856febbb722bafae
```

**Note:** This is only needed if you want to manually trigger cleanup via HTTP requests. The automatic scheduled functions don't need this.

---

### Optional: Web Crawling & AI

If you want enhanced event discovery:

```
Variable name: JINA_API_KEY
Value: [Get free key at https://jina.ai/?sui=apikey]

Variable name: OPENAI_API_KEY
Value: sk-[your-openai-key]

Variable name: OPENAI_MODEL
Value: gpt-4o-mini
```

---

### Optional: Push Notifications

If you want weekend digest notifications:

```
Variable name: NEXT_PUBLIC_VAPID_PUBLIC_KEY
Value: [Your VAPID public key]

Variable name: VAPID_PUBLIC_KEY
Value: [Your VAPID public key - same as above]

Variable name: VAPID_PRIVATE_KEY
Value: [Your VAPID private key]

Variable name: VAPID_SUBJECT
Value: mailto:your-email@example.com
```

**Generate VAPID keys:** Run `npx web-push generate-vapid-keys` in your terminal

---

## Step 2: Deploy

Once you merge the PR or push to main:

```bash
git checkout main
git merge cursor/cleanup-expired-events-3802
git push origin main
```

Netlify will automatically:
- Build your site
- Deploy the scheduled functions
- Start running cleanup daily at midnight UTC
- Start sending weekend digests on Fridays at 9 AM UTC

---

## Step 3: Verify It's Working

1. Go to: **https://app.netlify.com/sites/popevent/functions**
2. You should see:
   - `scheduled-cleanup`
   - `scheduled-notify`
3. Click on `scheduled-cleanup`
4. Click **Run now** button (to test immediately)
5. Check the logs - you should see:
   ```
   Running scheduled cleanup of expired events...
   Cleanup complete: X deleted, 0 errors
   ```

---

## 🎉 That's It!

Your site will now automatically clean up expired events every day at midnight UTC. No more outdated events like the Sosúa rumble staying around after they're done!

---

## 📊 Monitoring

To see what the cleanup is doing:
- Go to Netlify → Functions → `scheduled-cleanup`
- View execution history
- Each day you'll see a log entry showing how many events were cleaned up

---

## 🧪 Testing

Want to test it right now?

1. **Via Netlify UI:**
   - Functions → `scheduled-cleanup` → Run now

2. **Via API (if you set CRON_SECRET):**
   ```bash
   curl -X POST "https://popevent.netlify.app/api/cron/cleanup?secret=5d5e309d65e8788001f176a545533d69f83efe0d564665c6856febbb722bafae"
   ```

---

## ❓ Need Help?

See the full setup guide: `NETLIFY_SETUP.md`
