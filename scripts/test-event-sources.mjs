#!/usr/bin/env node

/**
 * Test script for expanded Instagram event sources
 * 
 * Usage:
 *   node scripts/test-event-sources.mjs
 */

import { INSTAGRAM_ACCOUNTS, instagramSearchQueries } from '../src/lib/instagram-sources.ts';
import { FACEBOOK_GROUPS, FACEBOOK_EVENT_PAGES, facebookGroupSearchQueries } from '../src/lib/facebook-groups.ts';

console.log('\n🔍 Testing Expanded Event Sources\n');
console.log('='.repeat(50));

// Test Instagram Accounts
console.log('\n📱 INSTAGRAM ACCOUNTS');
console.log('-'.repeat(50));
console.log(`Total accounts: ${INSTAGRAM_ACCOUNTS.length}`);
console.log(`Expected: 48 (was 12 before expansion)`);

if (INSTAGRAM_ACCOUNTS.length >= 48) {
  console.log('✅ PASS - Instagram accounts expanded correctly');
} else {
  console.log('❌ FAIL - Expected at least 48 accounts');
}

// Show breakdown by area
const accountsByArea = {};
INSTAGRAM_ACCOUNTS.forEach(account => {
  account.areas.forEach(area => {
    if (!accountsByArea[area]) accountsByArea[area] = [];
    accountsByArea[area].push(account.handle);
  });
});

console.log('\nBreakdown by area:');
Object.entries(accountsByArea).forEach(([area, accounts]) => {
  console.log(`  ${area}: ${accounts.length} accounts`);
});

// Show new local accounts
const newLocalAccounts = [
  'onnosbar', 'classicocabarete', 'shakabardr', 'bahiabeachclub',
  'kahunas_restaurant', 'lachabola.cabarete', 'driftercabarete',
  'rolfsbarandrestaurant', 'blueice_pianobar', 'groundzero_disco',
  'captainbaileyssosua', 'jollyrogerbargrill', 'baileys.restaurant',
  'laroca.sosua', 'rumbabargrill', 'anfiteatropuertoplata'
];

console.log('\n📍 New local venue accounts:');
const foundAccounts = INSTAGRAM_ACCOUNTS.filter(acc => 
  newLocalAccounts.includes(acc.handle)
);
foundAccounts.forEach(acc => {
  console.log(`  ✓ @${acc.handle} - ${acc.label}`);
});

if (foundAccounts.length >= 15) {
  console.log(`✅ PASS - Found ${foundAccounts.length}/${newLocalAccounts.length} new local accounts`);
} else {
  console.log(`❌ FAIL - Only found ${foundAccounts.length}/${newLocalAccounts.length} new local accounts`);
}

// Test Instagram Search Queries
console.log('\n\n🔎 INSTAGRAM SEARCH QUERIES');
console.log('-'.repeat(50));
const igQueries = instagramSearchQueries();
console.log(`Total search patterns: ${igQueries.length}`);
console.log(`Expected: 28 (was 7 before expansion)`);

if (igQueries.length >= 28) {
  console.log('✅ PASS - Instagram search queries expanded correctly');
} else {
  console.log('❌ FAIL - Expected at least 28 search patterns');
}

// Check for key search patterns
const keyPatterns = [
  'música en vivo',
  'merengue bachata típico',
  'fiesta discoteca',
  'anfiteatro Puerto Plata',
  'open mic karaoke',
  '#somosfiesterosrd'
];

console.log('\n📝 Key search patterns:');
keyPatterns.forEach(pattern => {
  const found = igQueries.some(q => q.includes(pattern));
  if (found) {
    console.log(`  ✓ "${pattern}"`);
  } else {
    console.log(`  ✗ "${pattern}" - NOT FOUND`);
  }
});

// Test Facebook Pages
console.log('\n\n📘 FACEBOOK EVENT PAGES');
console.log('-'.repeat(50));
console.log(`Total pages: ${FACEBOOK_EVENT_PAGES.length}`);
console.log(`Expected: 12 (was 6 before expansion)`);

if (FACEBOOK_EVENT_PAGES.length >= 12) {
  console.log('✅ PASS - Facebook pages expanded correctly');
} else {
  console.log('❌ FAIL - Expected at least 12 pages');
}

// Show new pages
const newPages = [
  'onnosbar', 'driftercabarete', 'lachabola.cabarete',
  'anfiteatro-puerto-plata', 'festival-merengue-pp', 'cluster-turistico-pp'
];

console.log('\n📄 New Facebook pages:');
const foundPages = FACEBOOK_EVENT_PAGES.filter(page => 
  newPages.includes(page.slug)
);
foundPages.forEach(page => {
  console.log(`  ✓ ${page.label}`);
});

// Test Facebook Search Queries
console.log('\n\n🔎 FACEBOOK SEARCH QUERIES');
console.log('-'.repeat(50));
const fbQueries = facebookGroupSearchQueries();
console.log(`Total search patterns: ${fbQueries.length}`);
console.log(`Expected: 40+ patterns`);

if (fbQueries.length >= 40) {
  console.log('✅ PASS - Facebook search queries expanded');
} else {
  console.log('⚠️  WARNING - Lower than expected search patterns');
}

// Check for Dominican search terms
const dominicanTerms = [
  'evento local dominicano',
  'fiesta discoteca bar',
  'karaoke open mic',
  'carnaval comparsa'
];

console.log('\n🇩🇴 Dominican search terms:');
dominicanTerms.forEach(term => {
  const found = fbQueries.some(q => q.toLowerCase().includes(term.toLowerCase()));
  if (found) {
    console.log(`  ✓ "${term}"`);
  } else {
    console.log(`  ✗ "${term}" - NOT FOUND`);
  }
});

// Summary
console.log('\n\n📊 SUMMARY');
console.log('='.repeat(50));

const totalInstagramAccounts = INSTAGRAM_ACCOUNTS.length;
const totalInstagramQueries = igQueries.length;
const totalFacebookPages = FACEBOOK_EVENT_PAGES.length;
const totalFacebookGroups = FACEBOOK_GROUPS.length;

console.log(`Instagram Accounts:    ${totalInstagramAccounts} (target: 48)`);
console.log(`Instagram Queries:     ${totalInstagramQueries} (target: 28)`);
console.log(`Facebook Pages:        ${totalFacebookPages} (target: 12)`);
console.log(`Facebook Groups:       ${totalFacebookGroups} (unchanged: 5)`);

console.log('\n📈 Growth Metrics:');
console.log(`Instagram accounts:    +${Math.round((totalInstagramAccounts - 12) / 12 * 100)}% growth`);
console.log(`Instagram queries:     +${Math.round((totalInstagramQueries - 7) / 7 * 100)}% growth`);
console.log(`Facebook pages:        +${Math.round((totalFacebookPages - 6) / 6 * 100)}% growth`);

// Overall verdict
console.log('\n🎯 OVERALL VERDICT:');
const allPassed = 
  totalInstagramAccounts >= 48 &&
  totalInstagramQueries >= 28 &&
  totalFacebookPages >= 12;

if (allPassed) {
  console.log('✅ ALL TESTS PASSED - Ready to deploy!\n');
  process.exit(0);
} else {
  console.log('⚠️  SOME TESTS FAILED - Review changes before deploying\n');
  process.exit(1);
}
