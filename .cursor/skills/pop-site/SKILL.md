---
name: pop-site
description: >-
  POP Events site desk for UI, bugs, and SEO. Use when the user says site, fix
  this page, or SEO. SEO covers Search Console, local ranking phrases, and
  keeping visible text crawlable. Asks which page or SEO job before editing.
---

# Site

Layout, bugs, and SEO. SEO lives here: ranking work in this app is pages, URLs, and structured data in `src/lib/seo.ts`, not social posts.

## Open

If they only said “site”, ask and stop:

1. Which page is wrong? Paste the localhost or live URL.
2. A bug to fix?
3. SEO — a Search Console issue, a phrase a page should rank for, or a visual change that must stay crawlable?

If they already named the page, the bug, or SEO, skip the menu.

A flyer or “correct this event image” is Catalog. Say so and wait. Do not swap the image from this desk.

## UI or bug

Change that page. Leave unrelated screens alone. Send the localhost URL and ask them to confirm. Do not open the browser. Wait. Do not commit until asked.

## Category list order (do not regress)

On category hubs (`discoveryMode` + `All`), **dated one-offs beat recurring** — including today’s scarce weeklies (“Every Sat”, “Every Thu”).

Concrete check: tomorrow’s brunch and next week’s dinner sit above today’s Vivonté-style Saturday tour. Same-day one-offs still beat same-day weeklies.

Implementation: `src/lib/event-sort.ts` (`discoveryBand`, `pinTodayOneOffs` with `oneOffsOnly` when `discoveryMode`). Wired from `FilteredEventList`, `public-events`, `scope-listing`. Tests in `event-sort.test.ts` (“tomorrow one-off above today’s Every Sat”).

Do not “fix” category order by pinning scarce weeklies after discovery sort — that floats Every Sat above future one-offs again.

## Listing photo heroes

Category hubs and region `/events` hide the photo banner; keep title/intro in `sr-only` for SEO (see `EventScopePage` `hideScopePhotoHero`). City and when hubs keep the photo hero.

## Home Today’s specials

Show 4 story cards (`HOME_SPECIALS_LIMIT`) + “See all specials”. Shuffle the **full** pool on a 30‑minute seed in `getTodaySpecialEvents` — do not shuffle only the visible 4.

## Weekend chip = Fri–Sun (Sunday counts)

`getWeekendRangeISO` in `src/lib/filters.ts`: Fri / Sat / **Sun** all mean *this* weekend. Only Mon–Thu look ahead to the next Sat–Sun. Never treat Sunday as “next weekend” — that drops Sunday brunch and Domingos series from Weekend.

## SEO

Read [seo.md](seo.md) and do only the job they named. Do not audit the whole site.
