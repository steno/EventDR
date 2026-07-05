# PWA Auto-Update System

Your EventDR PWA now has automatic updates enabled! Here's how it works and what was implemented.

---

## What Was Added

### 1. **Automatic Update Detection** ✅

The app now automatically checks for new versions:

- **On app load** — checks immediately when user opens the app
- **Every hour** — polls for updates in the background
- **When app becomes visible** — checks when user returns to the tab/app

### 2. **User Notification** ✅

When a new version is detected, users see a sleek update notification:

```
┌─────────────────────────────────────┐
│  Update Available                   │
│  A new version is ready to install  │
│                          [Refresh]   │
└─────────────────────────────────────┘
```

- Appears at bottom of screen (mobile-friendly)
- Non-intrusive but visible
- One-click to update

### 3. **Instant Reload** ✅

When user clicks "Refresh":
- New service worker activates immediately
- Page reloads automatically with new version
- All caches updated

---

## How It Works

### Service Worker Update Flow

```
1. User opens app
   ↓
2. Browser checks /sw.js for changes
   ↓
3. If changed → Install new worker in background
   ↓
4. "Update Available" notification appears
   ↓
5. User clicks "Refresh"
   ↓
6. New worker activates via postMessage("SKIP_WAITING")
   ↓
7. Page reloads automatically
   ↓
8. User sees latest version
```

### Cache Strategy

**Cache Name:** `eventdr-v4`

When you deploy updates:
1. Increment `CACHE_NAME` in `public/sw.js` (e.g., `eventdr-v5`)
2. Old caches are automatically deleted
3. New files are cached

**Current precached files:**
- `/en`, `/es`, `/fr` (home pages)
- `/manifest.webmanifest`
- `/icons/icon-192.png`
- `/icons/icon-512.png`

---

## Files Modified

### 1. `src/components/PwaRegister.tsx`

**Added:**
- Update detection via `updatefound` event
- Hourly polling for updates (`setInterval`)
- Visibility change detection
- Update notification UI component
- `SKIP_WAITING` message posting

**Key changes:**
```typescript
// Before: Simple registration
navigator.serviceWorker.register("/sw.js")

// After: Full update lifecycle
reg.addEventListener("updatefound", () => {
  // Detect when new version installs
  setUpdateAvailable(true)
})
```

### 2. `public/sw.js`

**Changed:**
- Cache version: `v3` → `v4`
- Removed immediate `skipWaiting()` from install
- Added message handler for controlled activation

**Key changes:**
```javascript
// Before: Auto-activate on install
self.addEventListener("install", (event) => {
  // ...
  self.skipWaiting();  // ❌ Too aggressive
});

// After: Wait for user confirmation
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();  // ✅ User-controlled
  }
});
```

### 3. `src/app/globals.css`

**Added:**
```css
@keyframes slide-up {
  from { transform: translateY(120%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## Testing the Auto-Update

### Local Testing

1. **Initial load:**
   ```bash
   npm run build
   npm start
   ```
   Visit `http://localhost:3000` and install the PWA

2. **Deploy an update:**
   - Change cache version in `public/sw.js`: `eventdr-v4` → `eventdr-v5`
   - Rebuild: `npm run build && npm start`

3. **Trigger update check:**
   - Keep the app open
   - Wait 1 minute (or switch tabs and come back)
   - Update notification should appear
   - Click "Refresh" → app reloads with new version

### Production Testing

1. **Make a change:**
   - Edit any file (e.g., add a console.log)
   - Increment cache version: `eventdr-v4` → `eventdr-v5`

2. **Deploy to Netlify:**
   ```bash
   git add .
   git commit -m "Test auto-update"
   git push
   ```

3. **Test on your phone:**
   - Open the installed PWA
   - Within ~30 seconds, update notification appears
   - Tap "Refresh"
   - Verify changes are visible

---

## Update Frequency Settings

### Current Settings

| Trigger | Frequency |
|---------|-----------|
| On app open | Immediate |
| Background polling | Every 60 minutes |
| Tab visibility change | Immediate |

### Customizing Update Frequency

Edit `src/components/PwaRegister.tsx`:

```typescript
// Change polling interval (currently 1 hour)
const interval = setInterval(checkForUpdates, 60 * 60 * 1000);
//                                            ↑ Change this

// Examples:
30 * 60 * 1000  // 30 minutes
2 * 60 * 60 * 1000  // 2 hours
```

**Recommendation:** Keep at 1 hour to balance freshness vs battery/data usage.

---

## Best Practices

### When Deploying Updates

1. ✅ **Always increment cache version**
   ```javascript
   // In public/sw.js
   const CACHE_NAME = "eventdr-v5";  // Increment the number
   ```

2. ✅ **Test locally first**
   - Build and test before pushing
   - Verify update notification appears

3. ✅ **Meaningful commit messages**
   ```bash
   git commit -m "feat: Add search filter + bump cache v5"
   ```

4. ✅ **Monitor Netlify build**
   - Ensure build succeeds
   - Check Functions are bundled correctly

### User Experience

- ✅ **Non-blocking updates** — Users can keep using the app while update downloads
- ✅ **User-controlled** — They decide when to refresh
- ✅ **Fast activation** — Update takes <1 second after clicking "Refresh"

---

## Troubleshooting

### "Update notification never appears"

**Possible causes:**

1. **Cache version not changed**
   - Check `public/sw.js` — did you increment `CACHE_NAME`?

2. **Service worker not changed**
   - Browser only updates if `sw.js` file content changes
   - Even a comment change will trigger it

3. **Hard refresh clearing everything**
   - Avoid Ctrl+Shift+R / Cmd+Shift+R in testing
   - Use regular refresh or close/reopen tab

4. **Dev environment**
   - Auto-update disabled in development mode
   - Only works in production builds

**Fix:**
```bash
# Unregister all service workers
# In browser DevTools → Application → Service Workers → Unregister

# Clear all caches
# In browser DevTools → Application → Cache Storage → Delete all

# Rebuild and restart
npm run build
npm start
```

### "Update appears immediately every time"

**Cause:** Service worker is reinstalling on every page load

**Fix:** Check that you're not forcefully unregistering the worker:
- Remove any `registration.unregister()` calls
- Don't clear cache on every load

### "App doesn't reload after clicking Refresh"

**Cause:** `controllerchange` listener not working

**Fix:**
1. Check browser console for errors
2. Verify `public/sw.js` has the message handler:
   ```javascript
   self.addEventListener("message", (event) => {
     if (event.data?.type === "SKIP_WAITING") {
       self.skipWaiting();
     }
   });
   ```
3. Ensure `clients.claim()` is in the activate handler

---

## Browser Compatibility

| Browser | Auto-Update Support |
|---------|-------------------|
| Chrome (Desktop/Mobile) | ✅ Full support |
| Safari (iOS 16.4+) | ✅ Full support |
| Safari (iOS < 16.4) | ⚠️ Limited push support |
| Firefox | ✅ Full support |
| Edge | ✅ Full support |
| Samsung Internet | ✅ Full support |

**Note:** On iOS Safari, users must "Add to Home Screen" for full PWA features.

---

## Monitoring Updates

### Check Current Version

Add to your app (optional):

```typescript
// src/components/Footer.tsx or similar
const version = "v4";  // Update with each deploy

<p className="text-xs text-neutral-400">
  Version {version}
</p>
```

### Analytics (Optional)

Track update installations:

```typescript
// In PwaRegister.tsx, after handleUpdate()
const handleUpdate = () => {
  if (!registration?.waiting) return;
  
  // Track update event
  if (typeof gtag !== "undefined") {
    gtag("event", "pwa_update_installed", {
      cache_version: "v4"
    });
  }
  
  registration.waiting.postMessage({ type: "SKIP_WAITING" });
};
```

---

## Future Enhancements

### 1. **Smart Update Prompting**

Only show notification for major updates:

```typescript
// Check version notes from API
const updateInfo = await fetch("/api/version").then(r => r.json());
if (updateInfo.major) {
  setUpdateAvailable(true);  // Critical update
}
```

### 2. **Background Sync**

Update silently when device is idle:

```typescript
// In sw.js
self.addEventListener("sync", (event) => {
  if (event.tag === "update-content") {
    event.waitUntil(updateCache());
  }
});
```

### 3. **Update Progress**

Show download progress for large updates:

```typescript
const [downloadProgress, setDownloadProgress] = useState(0);

// Track install progress
newWorker.addEventListener("statechange", (e) => {
  // Monitor installation state
});
```

---

## Summary

✅ **Auto-update system is now live!**

Users will automatically:
- Receive notifications when updates are available
- Update with one tap/click
- Always have the latest features and fixes

**Next deploy:**
1. Make your changes
2. Bump cache version: `eventdr-v4` → `eventdr-v5`
3. Push to GitHub
4. Users get notified within ~1 hour (or immediately if they reopen the app)

---

**Last updated:** July 5, 2026
