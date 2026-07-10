# Google Search Console Setup

Get [pop-events.com](https://pop-events.com) indexed in Google Search. The app already ships `robots.txt`, a dynamic `sitemap.xml`, and SEO metadata — this guide covers verification and submitting URLs to Google.

## 1. Add your property

1. Open [Google Search Console](https://search.google.com/search-console)
2. Click **Add property**
3. Choose **URL prefix** (not Domain) and enter:
   ```
   https://pop-events.com
   ```
4. Click **Continue**

Use the exact production URL (`https://pop-events.com`). The Netlify alias `popevent.netlify.app` is a separate property if you want to index it too.

## 2. Verify ownership (HTML meta tag — recommended)

1. On the verification screen, choose **HTML tag**
2. Google shows something like:
   ```html
   <meta name="google-site-verification" content="AbCdEf123..." />
   ```
3. Copy **only** the `content` value (`AbCdEf123...`), not the whole tag

### Local / Netlify

Add to `.env.local` (local) or **Netlify → Site settings → Environment variables** (production):

```bash
GOOGLE_SITE_VERIFICATION=AbCdEf123...
```

Redeploy on Netlify after adding the variable (**Deploys → Trigger deploy → Deploy site**).

### Confirm the tag is live

```bash
curl -s https://pop-events.com/en | grep google-site-verification
```

You should see the meta tag in the HTML.

4. Back in Search Console, click **Verify**

## Alternative verification methods

| Method | When to use |
|--------|-------------|
| **DNS TXT record** | You manage DNS for `pop-events.com` and prefer no deploy. Add the TXT record at your registrar or Netlify DNS, then verify. |
| **HTML file** | Drop Google's file in `public/` (e.g. `public/google123.html`) and deploy. |
| **Google Analytics** | Only if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is already live on production and you use the same Google account. |

## 3. Submit your sitemap

After verification:

1. In Search Console, open **Sitemaps** (left sidebar)
2. Enter:
   ```
   sitemap.xml
   ```
3. Click **Submit**

The sitemap is generated from your events, venues, categories, and locale homepages. Google will recrawl it periodically.

## 4. Request indexing for key pages

For a new property, manually request indexing for a few important URLs:

1. Go to **URL inspection** (top search bar)
2. Paste a URL, e.g. `https://pop-events.com/en`
3. Click **Request indexing**
4. Repeat for `/es`, `/fr`, and a couple of high-value event or venue pages

Google usually crawls the rest via the sitemap within a few days.

## 5. Link Search Console to Analytics (optional)

If GA4 is set up ([ANALYTICS_SETUP.md](ANALYTICS_SETUP.md)):

1. In Google Analytics → **Admin** → **Product links** → **Search Console links**
2. Click **Link** and select your Search Console property

This surfaces search queries, impressions, and CTR inside Analytics.

## What's already configured in the app

- **`robots.txt`** — allows crawling, points to `sitemap.xml`, blocks `/api/` and moderator routes
- **`sitemap.xml`** — all locale homepages, categories, venues, and events
- **Page metadata** — titles, descriptions, Open Graph, canonical URLs, `hreflang` alternates
- **Structured data** — JSON-LD for events, venues, and the site on relevant pages

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| Verification fails | Env var set? Redeployed? Tag visible in page source at `https://pop-events.com/en`? |
| Sitemap "Couldn't fetch" | Open `https://pop-events.com/sitemap.xml` in a browser; fix any 5xx errors |
| Pages not indexed yet | Normal for new sites — allow 3–14 days; use URL Inspection for status |
| Wrong locale indexed | Home `/` redirects by `Accept-Language`; canonical URLs use `/en`, `/es`, `/fr` |

## Checklist

- [ ] Property added: `https://pop-events.com`
- [ ] `GOOGLE_SITE_VERIFICATION` set in Netlify and site redeployed
- [ ] Ownership verified in Search Console
- [ ] `sitemap.xml` submitted
- [ ] URL Inspection → Request indexing for `/en` (and optionally `/es`, `/fr`)
- [ ] (Optional) Search Console linked to GA4
