# Loading & Asset Performance Analysis

## Current State Assessment

### ✅ **State of the Art** Implementations

#### 1. **Next.js Image Optimization**
- ✅ Using `next/image` for automatic optimization
- ✅ Responsive `sizes` attributes for proper image selection
- ✅ Priority loading for above-the-fold hero images
- ✅ Proper fallback to native `<img>` for data URIs and external images with query params

**Examples:**
```tsx
// EventImage.tsx - Smart image handling with Next.js optimization
<Image
  src={src}
  alt={alt}
  fill
  sizes={sizes}
  priority={priority}
  className={className}
/>

// PhotoHero.tsx - LCP hero gets priority
<EventImage
  src={imageUrl}
  alt=""
  priority  // ← Critical for LCP
  sizes="(max-width: 768px) 100vw, 768px"
/>
```

#### 2. **Incremental Static Regeneration (ISR)**
- ✅ Pages revalidate every 2 minutes (`revalidate = 120`)
- ✅ Balance between fresh content and performance
- ✅ Applied to all event listing pages

```typescript
// All listing pages use ISR
export const revalidate = 120;
```

#### 3. **Loading Skeletons**
- ✅ Professional skeleton UI during data fetch
- ✅ Matches actual content layout
- ✅ Uses CSS `animate-pulse` for visual feedback

```tsx
// EventCardSkeleton.tsx
<div className="animate-pulse">
  <div className="h-[4.25rem] w-[4.25rem] rounded-xl bg-neutral-200 dark:bg-neutral-800" />
  <div className="h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
</div>
```

#### 4. **Boot Splash Coordination**
- ✅ Custom boot splash system that waits for critical resources
- ✅ Prevents flash of empty content (FOUC)
- ✅ Graceful fallback if resources take too long (2.5s max)

```typescript
// boot-splash.ts
expectBootPart("events");  // Register critical resource
readyBootPart("events");   // Mark as loaded
```

#### 5. **Smart Caching Strategy**
```typescript
// next.config.ts
const assetCache = "public, max-age=3600, stale-while-revalidate=86400";
const noStore = "no-store, max-age=0, must-revalidate";

// Assets can cache for 1 hour, stale for 24h
"/events/:path*" → assetCache
// Dynamic content always fresh
"/api/events" → noStore
```

#### 6. **React Suspense Boundaries**
- ✅ Strategic Suspense boundaries in layout
- ✅ Non-blocking analytics loading
- ✅ Prevents cascade waterfalls

```tsx
<Suspense fallback={null}>
  <Analytics />
</Suspense>
```

#### 7. **Progressive Pagination**
- ✅ Initial page shows limited results (SCOPE_LIST_LIMIT)
- ✅ "More events" button loads additional pages
- ✅ Prevents overwhelming initial render

#### 8. **Memoization**
- ✅ EventImage is memoized to prevent re-renders
- ✅ Extensive use of `useMemo` for filtered/sorted data
- ✅ `useCallback` for stable function references

---

## ⚠️ **Areas for Improvement**

### 1. **Missing Loading States on Navigation**
**Issue:** No loading indicator when navigating between pages

**Current:**
```tsx
// CityCategoryLinks.tsx
<Link href={categoryPath(locale, cat.id, citySlug)}>
  {/* No loading state on click */}
</Link>
```

**Recommendation:** Add `useTransition` or loading indicator
```tsx
const [isPending, startTransition] = useTransition();

<Link 
  href={href}
  onClick={(e) => {
    e.preventDefault();
    startTransition(() => router.push(href));
  }}
>
  {isPending && <Spinner />}
  {label}
</Link>
```

### 2. **No Image Lazy Loading Strategy**
**Issue:** All images default to eager loading except hero

**Current:**
```tsx
// EventImage.tsx - No loading="lazy"
<Image
  src={src}
  alt={alt}
  fill
  sizes={sizes}
  // loading prop not specified → defaults to eager
/>
```

**Recommendation:** Add lazy loading for below-the-fold images
```tsx
<Image
  src={src}
  alt={alt}
  fill
  sizes={sizes}
  loading={priority ? "eager" : "lazy"}
  priority={priority}
/>
```

### 3. **No Bundle Splitting**
**Issue:** No dynamic imports for heavy components

**Recommendation:** Lazy load heavy features
```tsx
// Instead of:
import { SubmitEventSheet } from "@/components/SubmitEventSheet";

// Use:
const SubmitEventSheet = dynamic(() => 
  import("@/components/SubmitEventSheet").then(mod => ({ default: mod.SubmitEventSheet }))
);
```

**Candidates for lazy loading:**
- `SubmitEventSheet` (complex form, not always needed)
- `EventDetailSheet` (heavy component, only needed on click)
- `WeatherWidget` (optional feature)
- `MapPin` / Leaflet components (large library)

### 4. **No Prefetching Strategy**
**Issue:** No proactive prefetching of likely next pages

**Recommendation:** Add link prefetching
```tsx
// EventCard.tsx
<Link
  href={eventDetailPath(locale, event.id, returnTo)}
  prefetch={true}  // ← Add this
  onMouseEnter={() => {
    // Additional prefetch on hover
    router.prefetch(href);
  }}
>
```

### 5. **Skeleton Count Not Adaptive**
**Issue:** Shows exactly 3 skeletons regardless of viewport

**Current:**
```tsx
{[...Array(3)].map((_, i) => (
  <EventCardSkeleton key={i} />
))}
```

**Recommendation:** Match expected content count
```tsx
const skeletonCount = isMobile ? 3 : 6;
{[...Array(skeletonCount)].map((_, i) => (
  <EventCardSkeleton key={i} />
))}
```

### 6. **No Optimistic UI Updates**
**Issue:** User must wait for server confirmation after actions

**Recommendation:** Add optimistic updates for saves/likes
```tsx
const [isSaved, setIsSaved] = useOptimistic(false);

const handleSave = () => {
  setIsSaved(true);  // Instant feedback
  saveEvent(eventId).catch(() => setIsSaved(false));
};
```

### 7. **Missing Resource Hints**
**Issue:** No preconnect/dns-prefetch for external resources

**Recommendation:** Add resource hints to layout
```tsx
<head>
  <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
</head>
```

### 8. **No Service Worker Asset Precaching**
**Issue:** PWA service worker exists but no precaching strategy visible

**Recommendation:** Use Workbox for asset precaching
```js
// sw.js
workbox.precaching.precacheAndRoute([
  { url: '/icons/icon-192.png', revision: '1' },
  { url: '/pop-home-logo.png', revision: '1' },
]);
```

### 9. **Fetch Error Handling Could Be Better**
**Issue:** Generic error state without retry strategies

**Current:**
```tsx
catch (err) {
  console.error("Failed to load events:", err);
  setError(true);
}
```

**Recommendation:** Add retry with exponential backoff
```tsx
const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * 2 ** i));
    }
  }
};
```

### 10. **No Loading Priority System**
**Issue:** All content treated equally

**Recommendation:** Implement loading priority tiers
```typescript
enum LoadPriority {
  CRITICAL = 0,  // Hero, initial events
  HIGH = 1,      // Above-fold content
  MEDIUM = 2,    // Below-fold content
  LOW = 3,       // Optional features (weather, etc.)
}
```

---

## 🎯 **Recommended Action Plan**

### Phase 1: Quick Wins (1-2 hours)
1. ✅ Add `loading="lazy"` to EventImage for non-priority images
2. ✅ Add prefetch to high-traffic links (category pills, event cards)
3. ✅ Add resource hints for external domains
4. ✅ Increase skeleton count for desktop viewports

### Phase 2: Medium Effort (4-6 hours)
1. ✅ Implement dynamic imports for heavy components
2. ✅ Add useTransition for navigation loading states
3. ✅ Implement optimistic UI for save/favorite actions
4. ✅ Add retry logic with exponential backoff

### Phase 3: Advanced (1-2 days)
1. ✅ Implement proper service worker precaching
2. ✅ Add loading priority system
3. ✅ Implement route-based code splitting
4. ✅ Add performance monitoring (Web Vitals)

---

## 📊 **Performance Metrics to Track**

### Core Web Vitals
- **LCP** (Largest Contentful Paint): Hero image load
  - Target: < 2.5s
  - Current: Likely good (priority image + ISR)

- **FID** (First Input Delay): Button/link responsiveness
  - Target: < 100ms
  - Concern: No loading feedback during navigation

- **CLS** (Cumulative Layout Shift): Layout stability
  - Target: < 0.1
  - Current: Good (skeleton matching + aspect ratios)

### Custom Metrics
- **TTI** (Time to Interactive): When page is fully interactive
- **FCP** (First Contentful Paint): First DOM content
- **Boot splash dismiss time**: Custom metric from boot-splash.ts

---

## 🏆 **Overall Grade: B+**

### Strengths
- Excellent image optimization with Next.js
- Professional skeleton loading states
- Smart ISR caching strategy
- Custom boot splash prevents FOUC
- Proper responsive image sizing

### Weaknesses
- Missing lazy loading for images
- No dynamic imports (bundle splitting)
- No prefetching strategy
- Limited loading feedback during navigation
- No optimistic UI updates

### Verdict
**The foundation is solid and follows modern best practices.** The image optimization, ISR, and skeleton states are exemplary. However, adding lazy loading, code splitting, and better navigation feedback would elevate this to "state of the art."

**Is it production-ready?** Yes, absolutely.
**Could it be better?** Yes, with the improvements listed above.

The app is well-architected for performance, but there's room for optimization that would significantly improve perceived performance, especially on slower networks and mobile devices.
