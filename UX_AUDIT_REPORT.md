# UX/UI Audit Report - POP Events
**Date:** July 16, 2026  
**Auditor:** UX/UI Analysis Agent  
**App:** EventDR - Puerto Plata Region Events Platform

---

## Executive Summary

Overall, POP Events demonstrates **strong UX fundamentals** with a modern, mobile-first design. The app shows careful attention to progressive web app features, dark mode, and touch-optimized interactions. However, there are several opportunities for improvement across typography, visual hierarchy, and interaction patterns.

**Overall Score: 7.5/10**

---

## 🎯 Critical Issues (Fix First)

### 1. **Search Bar Text Size - Accessibility Concern**
**Location:** `SearchBar.tsx` (line 19)
```tsx
text-[11px]
```
**Issue:** Search input uses 11px font size, which is below WCAG minimum readable size (16px) and can cause mobile browsers to auto-zoom on focus, disrupting UX.

**Impact:** High - Affects all mobile users  
**Recommendation:** Increase to minimum 16px (text-base)
```tsx
// Change from:
className="... text-[11px] ..."
// To:
className="... text-base ..." // 16px
```

---

### 2. **Small Touch Targets Throughout**
**Locations:** Multiple components
- Category chips: 11px text
- Status badges: 10-11px text  
- Navigation labels: 11px text
- Meta information: Various small sizes

**Issue:** Many interactive elements use font sizes below 11px, making them harder to read and interact with, especially for users 40+.

**Impact:** High - Readability & accessibility  
**Recommendation:** 
- Minimum 12px for body text
- Minimum 14px for interactive elements
- Minimum 44×44px touch targets (currently some buttons are smaller)

---

### 3. **Empty State for Location Picker Could Be Clearer**
**Location:** `CityLocationPicker.tsx`
**Issue:** On first visit, showing "Choose area" in an interactive-looking button might not be immediately obvious as a required action.

**Impact:** Medium - User onboarding  
**Recommendation:** Add visual cue (e.g., pulsing border, or "👆 Start here" label on first visit)

---

## 💡 High Priority Improvements

### 4. **Event Card Truncation Anxiety**
**Location:** `EventCard.tsx` (line 80)
```tsx
line-clamp-2
```
**Issue:** Event titles can be cut off at 2 lines, potentially hiding important information. No visual indicator that there's more text.

**Impact:** Medium - Information loss  
**Recommendation:** 
- Consider 3 lines for title on mobile
- Add subtle fade gradient on truncated text
- Or show "..." ellipsis more prominently

---

### 5. **Inconsistent Gradient Usage**
**Locations:** Multiple files
**Issue:** Brand gradient (`from-orange-500 via-rose-500 to-fuchsia-500`) appears in:
- Buttons (good ✓)
- Text (good ✓)
- Backgrounds (good ✓)

But color values vary (300, 400, 500, 600 levels) without clear semantic meaning.

**Impact:** Medium - Brand consistency  
**Recommendation:** Create design tokens:
```tsx
// In Tailwind config or CSS variables
--brand-gradient-primary: from-orange-500 via-rose-500 to-fuchsia-500
--brand-gradient-light: from-orange-400 via-rose-400 to-fuchsia-400
--brand-gradient-text: from-orange-600 via-rose-600 to-fuchsia-600
```

---

### 6. **Bottom Navigation Spacing on Notched Devices**
**Location:** `BottomNav.tsx` (line 35)
```tsx
pb-[env(safe-area-inset-bottom)]
```
**Issue:** Good use of safe-area-inset! However, on devices with large bottom notches, the icons might feel cramped.

**Impact:** Medium - Mobile UX  
**Recommendation:** Add minimum padding:
```tsx
pb-[max(env(safe-area-inset-bottom),0.5rem)]
```

---

### 7. **Hero Image Loading State**
**Location:** `PhotoHero.tsx`
**Issue:** When `imageUrl` exists but image is loading, users see a flash of gradient before image loads.

**Impact:** Medium - Visual polish  
**Recommendation:** Add skeleton loader or blur-up placeholder
```tsx
<EventImage
  src={imageUrl}
  placeholder="blur"
  blurDataURL={event.blurDataURL} // Add to Event type
/>
```

---

## 🔧 Medium Priority Improvements

### 8. **Search Results Empty State**
**Location:** `SearchEmptyState.tsx`
**Issue:** Empty state is good, but doesn't offer spelling suggestions or partial matches.

**Impact:** Medium - Search UX  
**Recommendation:** 
- Add fuzzy search hints: "Did you mean...?"
- Show popular searches
- Suggest clearing filters

---

### 9. **Event Card Hover States on Desktop**
**Location:** `EventCard.tsx` (line 46)
**Issue:** Shadow change on hover is subtle. Desktop users might not realize cards are clickable.

**Impact:** Medium - Desktop UX  
**Recommendation:** Add more obvious hover states:
```tsx
// Add cursor-pointer and border highlight
className="... cursor-pointer hover:border-orange-300 dark:hover:border-orange-700 ..."
```

---

### 10. **Date/Time Formatting Could Be More Scannable**
**Location:** `EventCardMeta.tsx`
**Issue:** Dates shown as full text (e.g., "Monday, July 16") takes up space and is harder to scan quickly.

**Impact:** Medium - Scannability  
**Recommendation:** For compact mode, use shorter format:
- Today's events: "Today, 8:00 PM"
- This week: "Mon Jul 16"
- Later: "Jul 16 - 18"

---

### 11. **Category Pills Visual Weight**
**Location:** `EventCardMeta.tsx`, `EventCard.tsx`
**Issue:** Orange category pills compete visually with "LIVE NOW" badges.

**Impact:** Medium - Visual hierarchy  
**Recommendation:** Reduce category pill prominence:
- Use neutral colors (gray) for regular categories
- Reserve orange for time-sensitive info (Live, Trending, etc.)

---

### 12. **Saved Events Counter Badge**
**Location:** `BottomNav.tsx` (line 77)
**Issue:** Badge appears in top-right of nav item, but overlaps with icon on small screens.

**Impact:** Low-Medium - Visual polish  
**Recommendation:** Position more carefully or show count in label instead:
```tsx
{dict.nav.saved} {badge > 0 && `(${badge})`}
```

---

## ✨ Polish & Nice-to-Have

### 13. **Install Banner Dismissal Could Be Persistent**
**Location:** `InstallBanner.tsx` (line 18)
**Issue:** Uses localStorage, but if cleared, banner returns. Also no "remind me later" option.

**Impact:** Low - User control  
**Recommendation:**
- Add timestamp to localStorage
- Show again after 7 days
- Add "Remind me later" button

---

### 14. **Theme Toggle Lacks Animation**
**Location:** `ThemeToggle.tsx` (not shown but inferred)
**Issue:** Instant theme switch can be jarring.

**Impact:** Low - Polish  
**Recommendation:** Add smooth transition:
```css
* {
  transition: background-color 200ms ease-out, color 200ms ease-out;
}
```

---

### 15. **Weather Widget Could Show More Info**
**Location:** `WeatherWidget.tsx`
**Issue:** Good to have weather, but could be more useful with hourly forecast or "feels like" temp.

**Impact:** Low - Feature enhancement  
**Recommendation:** Add popover with extended forecast on click

---

### 16. **Loading States Are Missing**
**Locations:** `EventList.tsx`, `Home.tsx`
**Issue:** When events are loading, no skeleton or spinner visible.

**Impact:** Medium - Perceived performance  
**Recommendation:** Add skeleton cards:
```tsx
{isLoading && (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => <EventCardSkeleton key={i} />)}
  </div>
)}
```

---

### 17. **No Error States for Failed Event Loads**
**Issue:** If event fetch fails, users see empty list with no explanation.

**Impact:** Medium - Error handling  
**Recommendation:** Add error boundary with retry option

---

### 18. **City Location Picker Opens Upward Logic**
**Location:** `CityLocationPicker.tsx` (line 105-111)
**Issue:** Good logic for dropdown direction, but on very small screens, the list might still overflow.

**Impact:** Low - Edge case  
**Recommendation:** Consider modal on mobile instead of dropdown

---

### 19. **Trending Badge Competes with Status Badge**
**Location:** `EventCard.tsx` (line 83-88)
**Issue:** Can't show both "LIVE NOW" and "🔥 HOT" badges simultaneously.

**Impact:** Low - Information loss  
**Recommendation:** Stack badges or combine into one when both apply

---

### 20. **Photo Hero Lacks Keyboard Navigation Hint**
**Location:** `PhotoHero.tsx`
**Issue:** Featured event link has no visible focus indicator for keyboard users.

**Impact:** Medium - Accessibility  
**Recommendation:** Add visible focus ring:
```tsx
className="... focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ..."
```

---

## 📱 Mobile-Specific Observations

### Strengths ✅
1. **Excellent touch target sizing** for primary actions (submit button, nav items)
2. **Safe area insets** properly handled
3. **Swipe gestures** implemented (event detail sheet)
4. **PWA install prompt** well-designed
5. **Bottom navigation** follows platform conventions

### Areas for Improvement ⚠️
1. **Horizontal scrolling** (TodayHighlights, VenueStrip) could show scroll hint
2. **Pull-to-refresh** not implemented - users might expect it
3. **Haptic feedback** not implemented for interactions
4. **Share menu** could use native share API more prominently

---

## 🎨 Design System Consistency

### Typography Scale Issues
Current font sizes found: 9px, 10px, 11px, 13px, 15px, 17px (1.0625rem), 28px, 32px, 40px, 48px...

**Issue:** Non-systematic scale makes maintenance harder and creates visual inconsistency.

**Recommendation:** Adopt a modular scale (e.g., 1.25 ratio):
```
12px (xs) → 14px (sm) → 16px (base) → 20px (lg) → 24px (xl) → 32px (2xl) → 40px (3xl)
```

---

## ♿ Accessibility Audit

### WCAG 2.1 Level AA Compliance

#### Passes ✅
- Color contrast (most areas meet 4.5:1 ratio)
- Focus indicators present
- Semantic HTML usage
- ARIA labels on icons
- Alt text on images

#### Fails ❌
1. **Search input text size** (11px < 16px minimum)
2. **Some touch targets < 44×44px** (WCAG 2.5.5)
3. **No skip-to-content link**
4. **Missing ARIA live regions** for dynamic content

#### Recommendations
```tsx
// Add skip link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Add live region for search results
<div role="status" aria-live="polite" aria-atomic="true">
  {searchResults.length} events found
</div>
```

---

## 🚀 Performance Observations

### Good Practices ✅
1. **Image optimization** with Next.js Image component
2. **Code splitting** via dynamic imports
3. **Deferred values** for search (useDeferredValue)
4. **Memoization** on list components

### Potential Issues ⚠️
1. **Large bundle size** (need to verify)
2. **No virtualization** for long event lists
3. **Weather widget** might block render

**Recommendation:** Add react-window or TanStack Virtual for lists with 50+ items

---

## 📊 Information Architecture

### Navigation Structure: **Good** ✅
- Clear 3-tab structure (Discover, Saved, Submit)
- Location picker prominently placed
- Categories collapsible (doesn't overwhelm)

### Content Hierarchy: **Needs Work** ⚠️
1. **Hero event** → Featured placement ✓
2. **Today's highlights** → Good visibility ✓
3. **Our picks** → Could use clearer label (users might not understand "Our picks" vs "All events")
4. **Venue strip** → Feels tacked on at bottom, consider moving up

---

## 🎯 User Flow Issues

### First-Time User Experience
1. **Landing:** Hero image + location picker - **Good** ✓
2. **Prompt to pick location:** Subtle - **Could improve**
3. **Browse events:** Intuitive - **Good** ✓
4. **View details:** Smooth sheet animation - **Excellent** ✓
5. **Save event:** Clear save button - **Good** ✓

### Returning User Experience
1. **Remembers location** - **Excellent** ✓
2. **Shows saved events count** - **Good** ✓
3. **No personalization** based on past views - **Opportunity**

---

## 🔬 A/B Test Recommendations

Consider testing:

1. **Location picker prominence:**
   - A: Current subtle placement
   - B: Full-screen modal on first visit

2. **Event card image ratio:**
   - A: Current square-ish (4.25rem)
   - B: Wider landscape (16:9)

3. **CTA button text:**
   - A: "Add event"
   - B: "Submit event" (current)
   - C: "Share your event"

4. **Today's highlights layout:**
   - A: Current 2-column grid
   - B: Horizontal scroll
   - C: Single column with larger images

---

## 📝 Summary of Action Items

### Immediate (Do This Week)
- [ ] Increase search bar font size to 16px
- [ ] Fix touch target sizes (minimum 44×44px)
- [ ] Add loading skeletons for event lists
- [ ] Improve focus indicators for keyboard navigation
- [ ] Add error states for failed API calls

### Short-term (Do This Month)
- [ ] Implement design token system for gradients
- [ ] Add blur-up placeholders for hero images
- [ ] Improve empty states with suggestions
- [ ] Add pull-to-refresh on mobile
- [ ] Audit and fix remaining small font sizes

### Long-term (Future Roadmap)
- [ ] Implement personalized event recommendations
- [ ] Add haptic feedback on mobile interactions
- [ ] Virtualize long event lists
- [ ] Consider dark mode image adjustments
- [ ] Add advanced filters (price, distance, etc.)

---

## 🌟 What's Working Really Well

1. **Progressive Web App implementation** - Best-in-class
2. **Dark mode** - Thoughtfully implemented with proper contrast
3. **Touch-optimized interactions** - Feels native
4. **Photo hero** - Beautiful and engaging
5. **Bottom sheet pattern** - Smooth and intuitive
6. **Bilingual support** - Well-integrated
7. **Live status badges** - Clear and useful
8. **Category organization** - Logical and scannable

---

## 📞 Questions for Product Team

1. What's the primary user demographic age? (Will inform font size decisions)
2. What are the most common user complaints in support? (Might reveal UX issues)
3. What's the mobile vs desktop split? (Should prioritize accordingly)
4. Are there any planned features that might affect layout? (Navigation, etc.)
5. What metrics are you tracking? (Can A/B test recommendations)

---

## 🎨 Design System Recommendation

Consider creating a formal design system document covering:
- Color palette (with semantic naming)
- Typography scale
- Spacing system
- Component library
- Animation guidelines
- Accessibility standards

This will make future development faster and more consistent.

---

**End of Report**

*Generated by UX/UI Analysis Agent*  
*Next audit recommended: 3 months or after major feature release*
