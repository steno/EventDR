# Category Scroll Fix - Manual Testing Guide

## What was fixed
When clicking on category pills from the home page, the events list page now automatically scrolls to show the category pills section (labeled "What's on in [Area]"). This behavior now works consistently on both desktop and mobile devices.

## Changes Made
- Modified `src/components/CityCategoryLinks.tsx` to add automatic scroll-to-section behavior when the component mounts with an active category
- The scroll accounts for sticky header height and includes a small delay for layout stability
- Respects user's `prefers-reduced-motion` setting

## How to Test

### Prerequisites
1. Start the dev server: `npm run dev`
2. Open the app in a browser at `http://localhost:3000/en`

### Desktop Testing
1. Navigate to the home page (`/en`)
2. Scroll down to see the category pills (🎵 Music, 🎨 Art, etc.)
3. Click on any category pill (e.g., "Music")
4. **Expected**: The category page loads and automatically scrolls to show the "What's on in North Coast" section with the category pills
5. **Verify**: The selected category pill is highlighted in orange
6. **Verify**: The page scroll position shows the category pills section near the top of the viewport

### Mobile Testing
1. Open browser DevTools and toggle device toolbar (responsive design mode)
2. Select a mobile device preset (e.g., iPhone 12 Pro, Galaxy S20)
3. Navigate to the home page (`/en`)
4. Scroll down to see the category pills
5. Tap on any category pill
6. **Expected**: Same behavior as desktop - page loads and scrolls to show category pills section
7. **Verify**: On mobile, the hero image and intro text may be visible above, but the category section should be scrolled into view
8. **Verify**: The active category pill is visible and highlighted

### Additional Test Cases

#### Browser Back/Forward
1. From a category page, use browser back button to return to home
2. Click a different category
3. **Expected**: Scroll behavior works correctly for the new category

#### Direct URL Navigation
1. Navigate directly to a category URL: `http://localhost:3000/en/category/music`
2. **Expected**: Page loads with category section visible (scrolled into view)

#### Reduced Motion
1. Enable "Reduce motion" in your OS accessibility settings
2. Repeat the main tests
3. **Expected**: Scroll happens instantly without animation (auto behavior)

## Success Criteria
- ✅ Clicking category pill from home scrolls to category section on desktop
- ✅ Clicking category pill from home scrolls to category section on mobile
- ✅ Active category is highlighted in the pills
- ✅ Scroll accounts for sticky header (category section not hidden behind header)
- ✅ Smooth scroll animation (unless reduced motion is preferred)
- ✅ No console errors or warnings
- ✅ TypeScript compilation passes
- ✅ ESLint passes (with existing warnings only)
