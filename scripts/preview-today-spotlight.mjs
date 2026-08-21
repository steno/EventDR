#!/usr/bin/env node

/**
 * Preview today's spotlight without posting to social media
 * Usage: node scripts/preview-today-spotlight.mjs
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = process.env.SITE_URL || 'https://pop-event.com';

async function previewSpotlight() {
  console.log('🔍 Previewing today\'s spotlight...\n');

  try {
    // Call the API in dry-run mode (no auth needed for preview)
    const response = await fetch(`${SITE_URL}/api/cron/meta-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET || 'preview'}`,
      },
      body: JSON.stringify({
        source: 'today',
        locale: 'en',
        dryRun: true,
      }),
    });

    const data = await response.json();

    if (response.status === 401) {
      console.error('❌ Unauthorized - need CRON_SECRET environment variable');
      console.error('Set it in your shell or run from Netlify deployment context\n');
      return;
    }

    if (response.status === 422) {
      console.log('ℹ️  No events happening today to spotlight\n');
      return;
    }

    if (response.status === 503) {
      console.error('❌ Meta posting not configured');
      console.error('Missing environment variables:', data.missing?.join(', '));
      console.error('\nAdd these in Netlify environment settings:\n');
      return;
    }

    if (!response.ok) {
      console.error(`❌ API error (HTTP ${response.status}):`, data);
      return;
    }

    console.log('✅ Spotlight preview generated successfully!\n');
    console.log('📱 Caption:');
    console.log('─'.repeat(60));
    console.log(data.caption);
    console.log('─'.repeat(60));
    console.log();

    if (data.eventIds && data.eventIds.length > 0) {
      console.log(`📅 Events (${data.eventIds.length}):`);
      data.eventIds.forEach((id, i) => {
        console.log(`  ${i + 1}. ${id}`);
      });
      console.log();
    }

    if (data.imageUrl) {
      console.log('🖼️  Primary image:', data.imageUrl);
    }
    if (data.imageUrls && data.imageUrls.length > 1) {
      console.log('🎠 Carousel images:', data.imageUrls.length);
      data.imageUrls.forEach((url, i) => {
        console.log(`  ${i + 1}. ${url}`);
      });
    }
    if (data.link) {
      console.log('🔗 Link:', data.link);
    }

    console.log('\n✨ This was a dry run - nothing was posted to social media');
    console.log('💡 To post for real, run the GitHub Actions workflow:\n');
    console.log('   Actions → Daily today spotlight → Run workflow\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

previewSpotlight();
