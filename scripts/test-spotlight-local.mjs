#!/usr/bin/env node

/**
 * Test spotlight selection locally using the public events API
 * This doesn't require CRON_SECRET and shows what would be selected
 */

const SITE_URL = 'https://pop-event.com';

async function testSpotlight() {
  console.log('🔍 Testing spotlight selection for today...\n');

  try {
    // Fetch today's events from the public API
    const response = await fetch(`${SITE_URL}/api/events?when=today&locale=en`);
    
    if (!response.ok) {
      console.error(`❌ Failed to fetch events: HTTP ${response.status}`);
      return;
    }

    const data = await response.json();
    const events = data.events || [];

    if (events.length === 0) {
      console.log('ℹ️  No events found for today\n');
      return;
    }

    console.log(`📅 Found ${events.length} event(s) happening today:\n`);

    // Show all events
    events.forEach((event, i) => {
      const time = event.time ? ` at ${event.time}` : '';
      const location = event.location || 'Location TBD';
      const trending = event.trending ? ' 🔥' : '';
      const recurrence = event.recurrence ? ` (${event.recurrence})` : '';
      
      console.log(`${i + 1}. ${event.title}${trending}${recurrence}`);
      console.log(`   📍 ${location}${time}`);
      console.log(`   🔗 ${SITE_URL}/en/event/${event.id}`);
      console.log();
    });

    // Note about spotlight selection
    if (events.length > 3) {
      console.log('💡 The spotlight algorithm will pick the top 3 based on:');
      console.log('   • Trending events get priority');
      console.log('   • One-time events preferred over recurring');
      console.log('   • Variety in categories and cities');
      console.log('   • Currently live or upcoming events\n');
    }

    console.log('✅ The workflow would generate a post with these events');
    console.log('\n📱 To run the actual spotlight workflow:');
    console.log('   1. Go to: https://github.com/steno/EventDR/actions/workflows/daily-today-spotlight.yml');
    console.log('   2. Click "Run workflow"');
    console.log('   3. Choose "Dry run" to test, or leave unchecked to post\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSpotlight();
