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
   - `pages_read_engagement`
   - `instagram_basic`
   - `instagram_content_publish`
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
- **App is restricted or disabled** in [Meta App Dashboard](https://developers.facebook.com/apps/) → check Alerts / App Review / Settings
- **App is in Development Mode**: Only app admins/testers can post
  - Solution: Add yourself as App Admin/Developer, or switch app to Live (for your own Page, Standard Access is enough)
- **Missing App Review**: Some permissions require Facebook App Review
  - For testing: Add your Facebook user as an "App Admin" or "App Tester"
- **Page role issues**: Token user must have admin/editor role on the Page
  - Solution: Add yourself as Page admin in Page Settings

### Graph API Explorer: "Sorry, something went wrong" on Generate Access Token

Console lines like `ERR_NAME_NOT_RESOLVED` / CSP blocks to `*.run.app` / `*.on.aws` are **Facebook Pixel noise** — ignore them.

The OAuth popup failure usually means:

1. **Check the app first** (most important with "API access blocked"):
   - Open [developers.facebook.com/apps](https://developers.facebook.com/apps/) → **Events Poster**
   - Look for red banners: restricted, disabled, or policy alerts
   - Settings → Basic: App must have a display name; save settings
   - Roles → Roles: your Facebook user must be **Admin** or **Developer**

2. **Bypass Explorer popups** (often more reliable):
   - Use an **incognito window** with ad blockers off
   - Or use Meta Business Suite → Business Settings → **Users → System users** → generate a token with `pages_manage_posts` + `instagram_content_publish` assigned to your Page (does not expire)

3. **Permissions for POP spotlight**:
   - Required: `pages_show_list`, `pages_manage_posts`, `pages_read_engagement`
   - For Instagram: `instagram_basic`, `instagram_content_publish`
   - `business_management` is optional; drop it if Explorer keeps failing

4. **After you get a user token**, still exchange for a **Page** token (`GET /me/accounts`) and put *that* in Netlify as `META_PAGE_ACCESS_TOKEN`

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
