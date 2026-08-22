# Meta API Token Troubleshooting

## Error: "API access blocked" (HTTP 502)

This error means your Facebook/Instagram access token is invalid, expired, or lacks permissions.

## Quick Fix Steps

### 1. Check Token Expiration

Facebook Page Access Tokens expire. Even "long-lived" tokens expire after 60 days.

**To refresh your token:**

1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click "Generate Access Token"
4. Grant permissions:
   - `pages_show_list`
   - `pages_manage_posts`
   - `instagram_basic`
   - `instagram_content_publish`

   Skip `pages_read_engagement` and any ads/insights permission. Publishing does not need them, and they put the app on Meta's Insights call-load limit.
5. Copy the short-lived User Access Token

### 2. Convert to Long-Lived Token

```bash
curl -i -X GET "https://graph.facebook.com/v22.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

Response will contain a `access_token` that lasts 60 days.

### 3. Get Page Access Token

```bash
curl -i -X GET "https://graph.facebook.com/v22.0/me/accounts?access_token=LONG_LIVED_USER_TOKEN"
```

Find your page in the response and copy its `access_token`. **This is your `META_PAGE_ACCESS_TOKEN`**.

### 4. Update Netlify Environment Variables

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Settings → Environment variables
4. Update `META_PAGE_ACCESS_TOKEN` with the new Page token
5. Trigger a new deploy (or wait for next deploy)

### 5. Verify Configuration

Run the workflow again:
1. Go to [Actions](https://github.com/steno/EventDR/actions/workflows/daily-today-spotlight.yml)
2. Click "Run workflow"
3. Check "Dry run" to test without posting
4. Click "Run workflow"

The "Check Meta configuration" step should now show valid account info.

---

## Common Issues

### "API access blocked" specifically

This can also mean:
- **App is in Development Mode**: Only app admins/testers can post
  - Solution: Submit app for review or add your page as a test account
- **Missing App Review**: Some permissions require Facebook App Review
  - For testing: Add your Facebook user as an "App Admin" or "App Tester"
- **Page role issues**: Token user must have admin/editor role on the Page
  - Solution: Add yourself as Page admin in Page Settings

### Token appears valid but still fails

Try regenerating from scratch:
1. Remove the app from your Facebook account
2. Revoke all tokens in Developer Console
3. Generate new tokens following steps 1-3 above

### Instagram not posting (Facebook works)

1. Verify `META_INSTAGRAM_ACCOUNT_ID` is correct:
   ```bash
   curl "https://graph.facebook.com/v22.0/{PAGE_ID}?fields=instagram_business_account&access_token={PAGE_TOKEN}"
   ```
2. Ensure Instagram account is a Business/Creator account (not Personal)
3. Ensure Instagram account is linked to your Facebook Page

---

## Rate limit: "Too many API requests"

Meta shows this dialog (Insights call-load) when the **same app** bursts Graph calls. Daily spotlight retries after a Netlify 504 are the usual cause: each run inspects tokens, uploads 3 photos, then polls Instagram carousel containers.

What the app now does:
- Same-day spotlight is locked — a retry will reuse the existing post instead of publishing again
- GET `/api/cron/meta-post` no longer calls Graph unless you add `?inspect=1`
- Graph writes are paced, Instagram status is polled less often, and rate-limit errors (code 4 / 17 / 32) retry with backoff

If you still see the dialog: wait 15–30 minutes, do not re-run **Daily today spotlight**, and stay out of Ads Manager / Page Insights until it clears.

---

## Testing Your Token

You can test tokens directly:

```bash
# Test Page token
curl "https://graph.facebook.com/v22.0/{PAGE_ID}?access_token={PAGE_TOKEN}"

# Test Instagram connection
curl "https://graph.facebook.com/v22.0/{PAGE_ID}?fields=instagram_business_account{id,username}&access_token={PAGE_TOKEN}"
```

If these return valid data, the token works. If you get errors, the token needs to be refreshed.

---

## Prevention

Facebook tokens expire regularly. Consider:
1. Setting a calendar reminder to refresh tokens every 50 days
2. Monitoring workflow failures (now easier with improved error messages!)
3. Using a System User token (advanced, but doesn't expire)

---

## Still Having Issues?

Check the workflow logs for the specific error message. The improved workflow now shows:
- ✓ Whether Meta configuration is valid
- ✗ Specific API error messages
- → Individual Facebook/Instagram results

This makes it much easier to diagnose token vs. API vs. content issues.
