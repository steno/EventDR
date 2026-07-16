#!/bin/bash

# Test script for expanded Instagram event sources
# Usage: bash scripts/validate-sources.sh

echo ""
echo "🔍 Validating Expanded Event Sources"
echo "=================================================="
echo ""

# Count Instagram accounts
echo "📱 INSTAGRAM ACCOUNTS"
echo "--------------------------------------------------"
INSTAGRAM_COUNT=$(grep -c "handle:" src/lib/instagram-sources.ts)
echo "Total accounts: $INSTAGRAM_COUNT"
echo "Expected: 40 (was 12 before expansion = +233% growth)"

if [ "$INSTAGRAM_COUNT" -ge 40 ]; then
  echo "✅ PASS - Instagram accounts expanded correctly"
else
  echo "❌ FAIL - Expected at least 40 accounts"
fi

# Show some new accounts
echo ""
echo "📍 Sample new local accounts:"
grep -A 1 "onnosbar\|lachabola\|groundzero_disco\|anfiteatropuertoplata" src/lib/instagram-sources.ts | grep -E "handle:|label:" | head -8

# Count search patterns
echo ""
echo ""
echo "🔎 INSTAGRAM SEARCH QUERIES"
echo "--------------------------------------------------"
# Count returns in the instagramSearchQueries function
QUERY_COUNT=$(sed -n '/export function instagramSearchQueries/,/^}/p' src/lib/instagram-sources.ts | grep "site:instagram.com\|instagram.com" | wc -l)
echo "Approximate search patterns: $QUERY_COUNT"
echo "Expected: 28+ (was 7 before expansion)"

if [ "$QUERY_COUNT" -ge 25 ]; then
  echo "✅ PASS - Instagram queries expanded"
else
  echo "⚠️  WARNING - Lower than expected"
fi

# Check for key patterns
echo ""
echo "🔑 Key search terms present:"
grep -q "música en vivo" src/lib/instagram-sources.ts && echo "  ✓ 'música en vivo'" || echo "  ✗ 'música en vivo' NOT FOUND"
grep -q "merengue bachata típico" src/lib/instagram-sources.ts && echo "  ✓ 'merengue bachata típico'" || echo "  ✗ 'merengue bachata típico' NOT FOUND"
grep -q "fiesta discoteca" src/lib/instagram-sources.ts && echo "  ✓ 'fiesta discoteca'" || echo "  ✗ 'fiesta discoteca' NOT FOUND"
grep -q "anfiteatro Puerto Plata" src/lib/instagram-sources.ts && echo "  ✓ 'anfiteatro Puerto Plata'" || echo "  ✗ 'anfiteatro Puerto Plata' NOT FOUND"
grep -q "open mic karaoke" src/lib/instagram-sources.ts && echo "  ✓ 'open mic karaoke'" || echo "  ✗ 'open mic karaoke' NOT FOUND"
grep -q "#somosfiesterosrd" src/lib/instagram-sources.ts && echo "  ✓ '#somosfiesterosrd'" || echo "  ✗ '#somosfiesterosrd' NOT FOUND"

# Count Facebook pages
echo ""
echo ""
echo "📘 FACEBOOK EVENT PAGES"
echo "--------------------------------------------------"
FACEBOOK_COUNT=$(grep -c "slug:" src/lib/facebook-groups.ts | head -1)
FB_PAGES=$(sed -n '/export const FACEBOOK_EVENT_PAGES/,/^] as const/p' src/lib/facebook-groups.ts | grep -c "slug:")
echo "Total pages: $FB_PAGES"
echo "Expected: 12 (was 6 before expansion)"

if [ "$FB_PAGES" -ge 12 ]; then
  echo "✅ PASS - Facebook pages expanded correctly"
else
  echo "❌ FAIL - Expected at least 12 pages"
fi

# Show some new pages
echo ""
echo "📄 Sample new Facebook pages:"
grep -A 1 "onnosbar\|driftercabarete\|anfiteatro-puerto-plata\|festival-merengue" src/lib/facebook-groups.ts | grep -E "slug:|label:" | head -6

# Check for Dominican search terms
echo ""
echo ""
echo "🇩🇴 DOMINICAN SEARCH TERMS"
echo "--------------------------------------------------"
echo "Checking for new Dominican-focused queries:"
grep -q "evento local dominicano" src/lib/facebook-groups.ts && echo "  ✓ 'evento local dominicano'" || echo "  ✗ NOT FOUND"
grep -q "fiesta discoteca bar" src/lib/facebook-groups.ts && echo "  ✓ 'fiesta discoteca bar'" || echo "  ✗ NOT FOUND"
grep -q "karaoke open mic" src/lib/facebook-groups.ts && echo "  ✓ 'karaoke open mic'" || echo "  ✗ NOT FOUND"
grep -q "carnaval comparsa" src/lib/facebook-groups.ts && echo "  ✓ 'carnaval comparsa'" || echo "  ✗ NOT FOUND"

# Summary
echo ""
echo ""
echo "📊 SUMMARY"
echo "=================================================="
echo "Instagram Accounts:    $INSTAGRAM_COUNT (target: 40)"
echo "Instagram Queries:     ~$QUERY_COUNT (target: 28)"
echo "Facebook Pages:        $FB_PAGES (target: 12)"

echo ""
echo "📈 Growth Metrics:"
INSTAGRAM_GROWTH=$(( ($INSTAGRAM_COUNT - 12) * 100 / 12 ))
FB_GROWTH=$(( ($FB_PAGES - 6) * 100 / 6 ))
echo "Instagram accounts:    +${INSTAGRAM_GROWTH}% growth"
echo "Facebook pages:        +${FB_GROWTH}% growth"

# Overall verdict
echo ""
echo "🎯 OVERALL VERDICT:"
if [ "$INSTAGRAM_COUNT" -ge 40 ] && [ "$QUERY_COUNT" -ge 25 ] && [ "$FB_PAGES" -ge 12 ]; then
  echo "✅ ALL CHECKS PASSED - Ready to deploy!"
  echo ""
  exit 0
else
  echo "⚠️  SOME CHECKS FAILED - Review changes before deploying"
  echo ""
  exit 1
fi
