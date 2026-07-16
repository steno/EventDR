# Next Steps - Deploy Expanded Event Sources

**Current Status**: ✅ All changes committed and ready to deploy

---

## Quick Deploy (Choose One)

### Option 1: Deploy Now (5 minutes)

```bash
# 1. Merge the PR
gh pr merge 18 --merge  # or use GitHub UI

# 2. Checkout main and pull
git checkout main
git pull origin main

# 3. Your deployment will auto-trigger (if configured)
# OR manually deploy if needed
```

### Option 2: Test Locally First (10 minutes)

```bash
# 1. Run validation
bash scripts/validate-sources.sh

# 2. Test locally (optional - requires Firebase setup)
npm run dev
# In another terminal:
curl -X POST "http://localhost:3000/api/ingest?secret=YOUR_CRON_SECRET"

# 3. If all looks good, merge and deploy (see Option 1)
```

---

## After Deployment

### Step 1: Trigger Manual Ingest (1 minute)

```bash
curl -X POST "https://pop-event.com/api/ingest?secret=YOUR_CRON_SECRET"
```

**Expected response:**
```json
{
  "success": true,
  "discovered": 35-50,  // Was 10-15 before
  "upserted": 30-45,
  "message": "XX ingested events synced for moderation"
}
```

### Step 2: Check Moderation Queue (5 minutes)

Visit your moderation interface and look for:

- [ ] **Spanish language events** - "Noche de Bachata", "Música en Vivo"
- [ ] **Local venues** - La Chabola, Onno's, Ground Zero, Anfiteatro
- [ ] **Weekly recurring** - Tuesday jams, Wednesday open mic, Thursday BBQ
- [ ] **Dominican artists** - Leonardo Paniagua, El Chaval de la Bachata
- [ ] **Local hashtags** - #somosfiesterosrd, #costanorterd
- [ ] **Peso pricing** - RD$700, RD$250-400

### Step 3: Monitor Categories (5 minutes)

Check if these categories have more events:

- [ ] **Music** 🎶 - Should see big increase from local bars
- [ ] **Concerts** 🎸 - Should see Anfiteatro events
- [ ] **Parties** 🎉 - Should see local discotecas
- [ ] **Culture** 🥁 - Should see festivals and municipal events
- [ ] **Dance** 💃 - Should see bachata socials

---

## What You've Deployed

### Growth Summary
- **Instagram accounts**: 12 → 40 (+233%)
- **Instagram searches**: 7 → 31 (+343%)
- **Facebook pages**: 6 → 12 (+100%)
- **Expected weekly events**: 10-15 → 35-50 (+200-250%)

### New Local Coverage
- **8 Cabarete bars**: Onno's, La Chabola, Classico, Shaka, Bahía, Kahuna's, Drifter, Rolf's
- **7 Sosúa venues**: Blue Ice, Ground Zero, Captain Baileys, Jolly Roger, Bailey's, La Roca, Rumba
- **5 Puerto Plata cultural**: Anfiteatro PP, Festival del Merengue, Disco Club Brugal, Luciano Vásquez
- **8 event aggregators**: Tourism boards, municipal, regional pages

---

## Complete Documentation

All details in:
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Full deployment and testing guide
- **[docs/IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)** - Overview and metrics
- **[docs/NEW_EVENT_SOURCES.md](./docs/NEW_EVENT_SOURCES.md)** - All 40 accounts cataloged
- **[docs/EVENT_DISCOVERY_EXAMPLES.md](./docs/EVENT_DISCOVERY_EXAMPLES.md)** - Real event examples

---

## Quick Validation

Before deploying, run:
```bash
bash scripts/validate-sources.sh
```

You should see:
```
✅ PASS - Instagram accounts expanded correctly
✅ PASS - Instagram queries expanded
✅ PASS - Facebook pages expanded correctly
✅ ALL CHECKS PASSED - Ready to deploy!
```

---

## PR Link

**Pull Request #18**: https://github.com/steno/EventDR/pull/18

Review and merge when ready!

---

## Questions?

1. **How do I merge?** - Click "Merge pull request" on PR #18 in GitHub
2. **How do I test the ingest?** - `curl -X POST "https://pop-event.com/api/ingest?secret=YOUR_CRON_SECRET"`
3. **Where do I find the secret?** - Check your environment variables (`CRON_SECRET`)
4. **What if I get errors?** - Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) troubleshooting section

---

**Ready to discover local gems?** 🎉

Merge PR #18 and run your next ingest!
