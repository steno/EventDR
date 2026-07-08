# Google Analytics Setup

This guide will help you set up Google Analytics (GA4) for POP Events to track page views, user behavior, and SEO performance.

## Why Google Analytics?

- **Free and comprehensive** tracking
- **Integration with Google Search Console** for SEO insights
- **Track user behavior** (page views, engagement, conversions)
- **Understand your audience** (location, devices, traffic sources)
- **Privacy-friendly** with proper configuration

## Setup Steps

### 1. Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **Admin** (gear icon in bottom left)
4. Click **Create Property**
5. Enter property details:
   - **Property name**: POP Events
   - **Time zone**: Atlantic/Santo_Domingo (or your timezone)
   - **Currency**: USD (or your preference)
6. Click **Next**
7. Fill in business information and click **Create**
8. Accept the Terms of Service

### 2. Set Up Data Stream

1. You'll automatically be prompted to set up a data stream
2. Click **Web**
3. Enter your website details:
   - **Website URL**: https://pop-events.com
   - **Stream name**: POP Events Website
4. Click **Create stream**
5. **Copy the Measurement ID** (format: `G-XXXXXXXXXX`)
   - You'll see it at the top right under "Measurement ID"

### 3. Add Measurement ID to Your Environment

#### For Local Development

1. Create `.env.local` if it doesn't exist:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Measurement ID:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

#### For Netlify Production

1. Go to your [Netlify Dashboard](https://app.netlify.com/)
2. Select your site (POP Events)
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add:
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (your actual Measurement ID)
6. Click **Create variable**
7. Redeploy your site:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

### 4. Verify Analytics is Working

After deploying:

1. Visit your live site: https://pop-events.com
2. Go back to Google Analytics
3. Click **Reports** → **Realtime**
4. You should see your visit showing up in real-time!
5. Browse a few pages to confirm tracking works across the site

### 5. Link Google Search Console (Recommended)

This gives you SEO insights directly in Analytics:

1. In Google Analytics, go to **Admin**
2. Under **Product links**, click **Search Console links**
3. Click **Link**
4. Follow the prompts to link your Search Console property
5. This enables:
   - Search queries that led to your site
   - Click-through rates (CTR)
   - Average position in search results
   - Pages with the most impressions

### 6. Set Up Enhanced Measurement (Optional)

GA4 automatically tracks many events, but you can customize:

1. In your data stream, scroll to **Enhanced measurement**
2. Click the gear icon
3. Enable/disable specific tracking:
   - ✅ Page views (already enabled)
   - ✅ Scrolls
   - ✅ Outbound clicks
   - ✅ Site search (if you add search)
   - ✅ Video engagement
   - ✅ File downloads

### 7. Configure Privacy Settings (Recommended)

For GDPR/privacy compliance:

1. Go to **Admin** → **Data Settings** → **Data Collection**
2. Consider enabling:
   - **Google signals** (for cross-device tracking) - optional
   - **IP anonymization** is automatic in GA4
3. Update your privacy policy to mention Google Analytics

### 8. Create Useful Reports

Some helpful custom reports to set up:

#### Most Popular Events
1. **Exploration** → Create new exploration
2. Add dimension: **Page path and screen class**
3. Add metric: **Views**
4. Filter: Pages containing `/event/`

#### Traffic Sources
1. **Reports** → **Acquisition** → **Traffic acquisition**
2. See which channels drive the most traffic (organic, social, direct, referral)

#### User Location
1. **Reports** → **User** → **Demographics**
2. See where your users are located (should be mostly Dominican Republic + expats)

## Troubleshooting

### Not seeing data?

1. **Check environment variable**: Make sure `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in Netlify
2. **Redeploy**: Trigger a new deploy after adding the env variable
3. **Clear cache**: Hard refresh your browser (Cmd+Shift+R / Ctrl+Shift+R)
4. **Check browser console**: Open DevTools → Console, look for any errors
5. **Ad blockers**: Some extensions block Google Analytics

### Data looks wrong?

- **Developer traffic**: Your own visits count too. Consider setting up a filter to exclude your IP
- **Bot traffic**: GA4 automatically filters most bot traffic
- **24-48 hour delay**: Some reports take time to process

## What's Tracked

The implementation automatically tracks:

- ✅ **Page views** on every page (including locale routes)
- ✅ **Navigation** between pages (client-side routing)
- ✅ **User engagement** (time on page, scroll depth)
- ✅ **Traffic sources** (where users come from)
- ✅ **User location** (country, city)
- ✅ **Device info** (mobile, desktop, OS, browser)
- ✅ **Performance** (page load times)

## Privacy & Performance

- Analytics loads **after interactive** - doesn't block page rendering
- **No personal data** is collected (no emails, names, etc.)
- **IP addresses** are automatically anonymized in GA4
- **Cookie-based** tracking (users can disable via browser settings)
- Scripts are loaded from Google's CDN (cached globally)

## Next Steps

1. **Set up goals/conversions**: Track important actions (e.g., event submissions)
2. **Create a dashboard**: Pin your most important metrics
3. **Set up alerts**: Get notified of traffic spikes or drops
4. **Weekly reports**: Schedule email reports to stay informed

## Support

- [Google Analytics Help Center](https://support.google.com/analytics/)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4) for custom events
