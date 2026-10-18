# Site SEO

Local search is how new people find pop-event.com. Social only reaches people who already follow. Do the job they named. Do not invent landing pages or rewrite titles across the site.

## Where it lives

- `src/lib/seo.ts` — metadata, `BreadcrumbList`, Event `offers` (`validFrom`, `price`)
- `src/app/sitemap.ts` and `src/lib/sitemap-urls.ts`
- `generateMetadata` on `src/app/[locale]/**/page.tsx`

## Jobs that have actually come up

- Search Console: breadcrumb structured data, Event offers missing `validFrom` or `price`
- Whether a page’s title or H1 should say “events in”, “happening in”, or “things to do in” for a North Coast town. Change copy only for the page they name.
- Permalink shape (`/en/event/{id}`, `/en/category/{id}`). Do not add area segments or rename routes unless they ask.
- Hiding a hero or header for looks. Keep the text in the document for crawlers. Do not position it off-screen.

## Check

Send the localhost URL. Ask them to confirm the title and the visible H1. Do not open the browser. Wait. Search Console stays in their account.
