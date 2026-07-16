# Event Audience Curation Guide

## Overview

The home page now features two audience-specific event sections:
- **Local favorites**: Events that appeal to residents and locals of the North Coast DR
- **Visitor faves**: Events that appeal to tourists and visitors

These sections display a randomly selected subset of curated events from predefined pools, with the selection rotating daily.

## How It Works

1. **Event Pools**: Located in `src/lib/home-layout.ts` as `EVENT_AUDIENCE_POOLS`
2. **Daily Rotation**: Events are shuffled using a daily seed, so the same events appear throughout the day but rotate the next day
3. **Automatic Filtering**: Only active/upcoming events are displayed (past events are automatically filtered out)
4. **Display Limit**: By default, shows up to 4 events per audience section (configurable via `HOME_EVENT_AUDIENCE_LIMIT`)

## Adding Events to Pools

To curate events for each audience:

1. Open `src/lib/home-layout.ts`
2. Find the `EVENT_AUDIENCE_POOLS` constant
3. Add event IDs to the appropriate pool:

```typescript
export const EVENT_AUDIENCE_POOLS: Record<
  VenueAudienceFilter,
  readonly string[]
> = {
  local: [
    "event-id-1",  // Add local favorite event IDs here
    "event-id-2",
    "event-id-3",
    // ...
  ],
  visitor: [
    "event-id-4",  // Add visitor favorite event IDs here
    "event-id-5",
    "event-id-6",
    // ...
  ],
};
```

### Finding Event IDs

Event IDs can be found in:
- The database/CMS where events are stored
- The event detail page URL (e.g., `/event/[id]`)
- The API response from `/api/events`

### Curation Guidelines

#### Local Favorites
Events that appeal to residents and locals:
- Community gatherings and local festivals
- Weekly recurring events at neighborhood spots
- Dominican cultural events and traditions
- Local sports and recreational activities
- Events primarily in Spanish or with local context
- Affordable or free community events

#### Visitor Faves
Events that appeal to tourists and visitors:
- International music and performances
- Beach parties and resort events
- Tourist-oriented activities and tours
- Special experiences unique to the region
- Events with English/multilingual support
- Popular nightlife and entertainment

### Mixed Audience
Some events appeal to both audiences and can be added to both pools:
- Major festivals and celebrations
- Popular nightlife venues
- Well-known cultural events
- Live music with broad appeal

## Maintenance

### Regular Updates
- Review and update pools monthly or when new signature events are added
- Remove event IDs for one-time events that have passed
- Keep recurring events in the pools (they auto-filter when not active)

### Pool Size
- Aim for 10-20 event IDs per pool minimum for good variety
- Larger pools (30-50 events) provide better daily rotation
- Balance between recurring events and one-time special events

### Testing Changes
After updating the pools:
1. Restart the dev server to see changes
2. Check that both audience sections appear on the home page
3. Verify events are relevant to the intended audience
4. Test on different days (or change the seed) to see rotation

## Technical Details

### Customization

**Limit per section:**
```typescript
// In src/lib/home-layout.ts
export const HOME_EVENT_AUDIENCE_LIMIT = 4; // Change this value
```

**Layout:**
The component uses a two-column grid on desktop (1 column on mobile). Events are displayed as EventCards in a vertical stack.

**Seed customization:**
```typescript
// In component usage
<EventAudienceCards
  events={events}
  seed="custom-seed-string" // Override daily seed
  limit={6} // Override default limit
/>
```

### API

**Function signature:**
```typescript
getFeaturedEvents(
  events: Event[],
  audience: "local" | "visitor",
  limit?: number,
  options?: {
    seed?: string;
    now?: Date;
  }
): Event[]
```

## Translations

Section titles and hints are localized in:
- English: `src/i18n/dictionaries/en.ts`
- Spanish: `src/i18n/dictionaries/es.ts`
- French: `src/i18n/dictionaries/fr.ts`

Update the following keys to customize labels:
```typescript
events: {
  audienceTitle: "Featured events",
  local: "Local favorites",
  visitor: "Visitor faves",
  localHint: "Events locals love on the North Coast",
  visitorHint: "Must-experience events for tourists and visitors",
}
```
