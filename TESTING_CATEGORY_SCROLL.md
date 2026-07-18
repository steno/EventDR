# Category Scroll Fix - Manual Testing Guide

## What was fixed
When clicking on category pills from the home page, the events list page now automatically scrolls to show the **time filter tabs** (All, Today, Tomorrow, Weekend). This behavior now works consistently on both desktop and mobile devices.

## Changes Made
- Modified `src/components/CityCategoryLinks.tsx` to automatically scroll to the time filter tabs when navigating from the home page
- The scroll targets the `[data-list-scroll-anchor]` element which is positioned at the time filter section
- Scroll behavior accounts for sticky header height to prevent content from being hidden
- Respects user's `prefers-reduced-motion` setting

## How to Test

### Prerequisites
1. Start the dev server: `npm run dev`
2. Open the app in a browser at `http://localhost:3000/en`

### Desktop Testing
1. Navigate to the home page (`/en`)
2. Scroll down to see the category pills (🎵 Music, 🎨 Art, etc.)
3. Click on any category pill (e.g., "Music")
4. **Expected**: The category page loads and automatically scrolls to show the **time filter tabs** (All, Today, Tomorrow, Weekend)
5. **Verify**: The tabs are visible near the top of the viewport
6. **Verify**: The selected category pill in the horizontal scroller is highlighted in orange

### Mobile Testing
1. Open browser DevTools and toggle device toolbar (responsive design mode)
2. Select a mobile device preset (e.g., iPhone 12 Pro, Galaxy S20)
3. Navigate to the home page (`/en`)
4. Scroll down to see the category pills
5. Tap on any category pill
6. **Expected**: Same behavior as desktop - page loads and scrolls to show time filter tabs
7. **Verify**: The time tabs (All, Today, Tomorrow, Weekend) are visible
8. **Verify**: The hero image and category pills may be visible above, but tabs should be scrolled into view
9. **Verify**: The active category pill is visible and highlighted

### Additional Test Cases

#### Browser Back/Forward
1. From a category page, use browser back button to return to home
2. Click a different category
3. **Expected**: Scroll behavior works correctly for the new category

#### Direct URL Navigation
1. Navigate directly to a category URL: `http://localhost:3000/en/category/music`
2. **Expected**: Page loads with time tabs scrolled into view (not at the very top)

#### Reduced Motion
1. Enable "Reduce motion" in your OS accessibility settings
2. Repeat the main tests
3. **Expected**: Scroll happens instantly without animation (auto behavior)

## Success Criteria
- ✅ Clicking category pill from home scrolls to **time filter tabs** on desktop
- ✅ Clicking category pill from home scrolls to **time filter tabs** on mobile
- ✅ Active category is highlighted in the pills
- ✅ Tabs (All, Today, Tomorrow, Weekend) are visible after scroll
- ✅ Scroll accounts for sticky header (tabs not hidden behind header)
- ✅ Smooth scroll animation (unless reduced motion is preferred)
- ✅ No console errors or warnings
- ✅ TypeScript compilation passes
- ✅ ESLint passes (with existing warnings only)
