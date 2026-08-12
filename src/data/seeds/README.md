# Event seed packs

Locale JSON arrays loaded by thin TypeScript helpers:

| Pack | Files | Loader |
|------|-------|--------|
| Recurring schedules | `recurring.{en,es,fr}.json` | `src/lib/recurring-events.ts` |
| Curated one-offs | `fallback.{en,es,fr}.json` | `src/lib/fallback-events.ts` |

Seasonal packs that still live as TypeScript (merged in the fallback loader):

- `src/lib/world-cup-2026-events.ts`
- `src/lib/atleticos-summer-league-2026.ts` / `asa-survival-series-2026.ts` (already flattened into `fallback.*.json`; keep TS only if regenerating)

**Ingest rule:** add new North Coast one-offs to all three `fallback.*.json` files with the same `id`. Put recurring schedules in `recurring.*.json`. Do not grow the loaders with inline event literals.
