# Testing Guide: Expanded Instagram Event Sources

**Branch**: `cursor/expand-instagram-event-sources-d304`  
**PR**: [#18](https://github.com/steno/EventDR/pull/18)  
**Status**: Ready to test and deploy

---

## Quick Start (5 Minutes)

### Option A: Deploy Now (Fastest)

If you're confident and want to deploy immediately:

1. **Merge the PR**
   ```bash
   # Via GitHub UI - click "Merge pull request" on PR #18
   # OR via command line:
   git checkout main
   git merge cursor/expand-instagram-event-sources-d304
   git push origin main
   ```

2. **Wait for deployment** (if you have auto-deploy set up)

3. **Run manual ingest to test**
   ```bash
   curl -X POST "https://pop-event.com/api/ingest?secret=YOUR_CRON_SECRET"
   ```

4. **Check moderation queue** in your app for new events

---

## Option B: Test Locally First (Recommended)

### Step 1: Verify Code Quality

We're already on the feature branch, so let's verify the changes:

```bash
# Check what was changed
git diff main..HEAD --stat

# View the actual changes
git diff main..HEAD src/lib/instagram-sources.ts
git diff main..HEAD src/lib/facebook-groups.ts
```

**Expected output:**
- `src/lib/instagram-sources.ts` - Added 36 accounts, 21 search patterns
- `src/lib/facebook-groups.ts` - Added 6 pages, 7 search terms

### Step 2: Check the New Accounts

Review the accounts that will now be monitored:

```bash
# View all new Instagram accounts
grep -A 3 "handle:" src/lib/instagram-sources.ts | head -50

# Count total accounts
grep "handle:" src/lib/instagram-sources.ts | wc -l
# Should output: 48 (up from 12)
```

### Step 3: Test the Ingest Function Locally (Optional)

If you want to test before deploying:

```bash
# Make sure environment is set up
# You'll need CRON_SECRET and Firebase credentials

# Start development server
npm run dev

# In another terminal, trigger the ingest
curl -X POST "http://localhost:3000/api/ingest?secret=YOUR_CRON_SECRET"
```

**Expected response:**
```json
{
  "success": true,
  "discovered": 35-50,
  "upserted": 30-45,
  "message": "XX ingested events synced for moderation"
}
```

---

## Step-by-Step Deployment

### 1. Review PR #18

**Link**: https://github.com/steno/EventDR/pull/18

**What to check:**
- [ ] Code changes look correct (48 Instagram accounts, 12 Facebook pages)
- [ ] No breaking changes to existing code
- [ ] Documentation is comprehensive
- [ ] All tests pass (if you have CI/CD)

### 2. Merge to Main

**Via GitHub UI:**
1. Go to PR #18
2. Click "Merge pull request"
3. Confirm merge
4. Delete branch (optional but recommended)

**Via command line:**
```bash
git checkout main
git pull origin main
git merge cursor/expand-instagram-event-sources-d304
git push origin main

# Optional: Delete the feature branch
git branch -d cursor/expand-instagram-event-sources-d304
git push origin --delete cursor/expand-instagram-event-sources-d304
```

### 3. Deploy to Production

If you have **automatic deployment** (Vercel, Netlify, etc.):
- Push to main triggers auto-deploy
- Wait 2-5 minutes for deployment to complete
- Check deployment logs for any issues

If you have **manual deployment**:
```bash
# Example for Vercel
vercel --prod

# Example for custom server
npm run build
# Copy build to server
# Restart server
```

### 4. Verify Deployment

Check that your production site is running the new code:

```bash
# Visit your site
open https://pop-event.com

# Or check via curl
curl -I https://pop-event.com
```

---

## Testing the New Event Sources

### Trigger Manual Ingest

Once deployed, run the ingest endpoint:

```bash
# Replace YOUR_CRON_SECRET with actual value from environment
curl -X POST "https://pop-event.com/api/ingest?secret=YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -v
```

**Expected response:**
```json
{
  "success": true,
  "discovered": 42,
  "upserted": 38,
  "message": "38 ingested events synced for moderation"
}
```

**Key metrics:**
- `discovered`: Should be **35-50** (vs 10-15 before)
- `upserted`: Most discovered events should be inserted
- Time: May take 30-60 seconds (within `maxDuration: 60`)

### Check Moderation Queue

Visit your moderation interface and look for:

#### ✅ Spanish Language Events
Look for event titles/descriptions like:
- "Noche de Bachata en el Anfiteatro"
- "Sábado de Seguidilla"
- "Música en Vivo - Merengue Típico"
- "Micrófono Abierto"

#### ✅ Local Venues
Should see events from:
- La Chabola Cabarete
- Onno's Bar
- Ground Zero Discoteca
- Blue Ice Piano Bar
- Anfiteatro Puerto Plata
- Festival del Merengue

#### ✅ Recurring Weekly Events
Look for patterns:
- Tuesday jam sessions (VOYVOY)
- Wednesday open mic (La Chabola)
- Thursday BBQ (Onno's)
- Saturday parties (Ground Zero)

#### ✅ Dominican Artists
Should see names like:
- Leonardo Paniagua
- El Chaval de la Bachata
- Marino Castellanos
- Luis Miguel del Amargue
- Krisspy

#### ✅ Local Hashtags
Check event descriptions for:
- #somosfiesterosrd
- #eventosdominicanos
- #costanorterd
- #puertoplata #sosua #cabarete

#### ✅ Dominican Pricing
Look for prices in pesos:
- RD$250-400 (drinks)
- RD$700 (Onno's BBQ)
- "Entrada Libre" (free entry)

---

## Monitoring Results

### Week 1: Initial Discovery

**Metrics to track:**

| Metric | Before | Target After | Actual |
|--------|--------|--------------|--------|
| Events discovered per week | 10-15 | 35-50 | ___ |
| Spanish language % | 30% | 50% | ___ |
| Local (vs tourist) % | 20% | 60% | ___ |
| Events per category (Music) | ___ | +200% | ___ |
| Events per category (Concerts) | ___ | +150% | ___ |
| Events per category (Culture) | ___ | +300% | ___ |

### Week 2-4: Quality Assessment

**Track which sources provide best events:**

| Source Type | Events Discovered | Approval Rate | Notes |
|-------------|-------------------|---------------|-------|
| Local Cabarete bars | ___ | ___% | ___ |
| Sosúa nightlife | ___ | ___% | ___ |
| Puerto Plata cultural | ___ | ___% | ___ |
| Tourism boards | ___ | ___% | ___ |
| Event aggregators | ___ | ___% | ___ |

### Category Distribution

Check if gaps are being filled:

**Before expansion:**
```
Music: ████░░░░░░ (40%)
Concerts: ██░░░░░░░░ (20%)
Parties: ███░░░░░░░ (30%)
Food & Drinks: ██░░░░░░░░ (20%)
Culture: █░░░░░░░░░ (10%)
Dance: █░░░░░░░░░ (10%)
Sports: ███░░░░░░░ (30%)
Wellness: ░░░░░░░░░░ (5%)
```

**Target after expansion:**
```
Music: ████████░░ (80%)
Concerts: ██████░░░░ (60%)
Parties: ███████░░░ (70%)
Food & Drinks: █████░░░░░ (50%)
Culture: ██████░░░░ (60%)
Dance: ████░░░░░░ (40%)
Sports: ████░░░░░░ (40%)
Wellness: ███░░░░░░░ (30%)
```

---

## Troubleshooting

### Issue: Low Event Count (< 20 discovered)

**Possible causes:**
1. Instagram/Facebook rate limiting
2. Login walls blocking scraping
3. Search queries not returning results

**Solutions:**
- Wait 24 hours and retry
- Check scraping logs for errors
- Run with `facebook-groups-weekly` rule while logged into Facebook for richer results

### Issue: Many Rejected Events

**If approval rate < 50%:**

**Check for:**
- Duplicate events from multiple sources
- Non-event posts (general bar/restaurant posts)
- Old events (past dates)

**Solutions:**
- Review categorization logic
- Add filters for date validation
- Deduplicate by title + date + venue

### Issue: Missing Spanish Events

**If < 40% Spanish:**

**Check:**
- Are Dominican search terms being used?
- Are local venue accounts active?
- Check if `instagramSearchQueries()` is being called

**Debug:**
```javascript
// In src/lib/ingest-social.ts, add logging
const queries = instagramSearchQueries();
console.log('Instagram queries:', queries.length); // Should be 28
```

### Issue: No Weekly Recurring Events

**If no Tuesday/Wednesday/Thursday events:**

**Possible causes:**
- Venues may not post every week
- Need to look at venue's Instagram Stories (not captured by web scrape)

**Solutions:**
- Run Facebook ingest with login (sees more group posts)
- Manually add seed events for known recurring events
- Check venue websites for event calendars

---

## Success Indicators

After 1-2 weeks, you should see:

✅ **High Volume**
- 35-50 events discovered per weekly ingest
- Moderation queue has consistent flow

✅ **Language Balance**
- 40-60% of events in Spanish
- Dominican slang and phrases present

✅ **Local Coverage**
- Events from neighborhood bars (not just tourist spots)
- Community events from Ayuntamiento
- Municipal festivals and carnaval

✅ **Category Balance**
- Music, Concerts, Culture categories well-populated
- Weekly recurring events appearing regularly
- Mix of large festivals and intimate venues

✅ **Quality Indicators**
- Approval rate > 60%
- Events have Dominican artist names
- Prices in Dominican pesos (RD$)
- Local hashtags present

---

## Next Steps After Testing

### If Results Are Good (Metrics Hit Targets)

1. **Document actual metrics** - Update monitoring spreadsheet
2. **Share wins** - Tell team about new event coverage
3. **Iterate** - Find more similar venues that work well
4. **Automate** - Ensure weekly cron is running smoothly

### If Results Need Improvement

1. **Identify gaps** - Which categories still low?
2. **Review sources** - Which accounts aren't providing events?
3. **Refine searches** - Adjust search patterns based on what works
4. **Add more sources** - Use successful patterns to find similar venues

### Ongoing Monitoring

**Weekly:**
- Check event discovery count
- Review approval rate
- Monitor category distribution

**Monthly:**
- Analyze which sources provide best events
- Remove inactive or low-quality sources
- Add new sources based on successful patterns
- Update search queries based on trending hashtags

---

## Quick Commands Reference

```bash
# Check current branch
git branch

# View changes
git diff main..HEAD --stat

# Merge to main
git checkout main
git merge cursor/expand-instagram-event-sources-d304
git push origin main

# Run manual ingest
curl -X POST "https://pop-event.com/api/ingest?secret=YOUR_CRON_SECRET"

# Check production deployment
curl -I https://pop-event.com

# View ingest logs (if available)
vercel logs  # or your hosting platform's log command
```

---

## Support Resources

- **[IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)** - Complete overview
- **[NEW_EVENT_SOURCES.md](./docs/NEW_EVENT_SOURCES.md)** - All 48 accounts documented
- **[EVENT_DISCOVERY_EXAMPLES.md](./docs/EVENT_DISCOVERY_EXAMPLES.md)** - Real event examples
- **PR #18**: https://github.com/steno/EventDR/pull/18

---

**Ready to deploy?** Start with Step 1 above! 🚀
