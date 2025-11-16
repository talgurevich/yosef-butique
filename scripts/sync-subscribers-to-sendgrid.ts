/**
 * Script to sync existing newsletter subscribers from Supabase to SendGrid Marketing Contacts
 *
 * This is a one-time script to migrate existing subscribers who were added before
 * the SendGrid Marketing Contacts integration was implemented.
 *
 * Run with: npx ts-node scripts/sync-subscribers-to-sendgrid.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sendgridApiKey = process.env.SENDGRID_API_KEY!;

if (!supabaseUrl || !supabaseServiceKey || !sendgridApiKey) {
  console.error('❌ Missing required environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SENDGRID_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncSubscribersToSendGrid() {
  console.log('🚀 Starting sync of newsletter subscribers to SendGrid...\n');

  try {
    // Fetch all active subscribers from database
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'active')
      .order('subscribed_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log('ℹ️  No active subscribers found in database');
      return;
    }

    console.log(`📊 Found ${subscribers.length} active subscribers to sync\n`);

    // SendGrid allows up to 30,000 contacts per request, but we'll batch in chunks of 1000
    const batchSize = 1000;
    const batches = [];

    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }

    console.log(`📦 Processing ${batches.length} batch(es)...\n`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} contacts)...`);

      // Format contacts for SendGrid
      const contacts = batch.map(sub => ({
        email: sub.email.toLowerCase(),
        first_name: sub.full_name?.split(' ')[0] || '',
        last_name: sub.full_name?.split(' ').slice(1).join(' ') || '',
        custom_fields: {
          // Add custom fields here if you create them in SendGrid
          // For example:
          // e1_T: sub.source || 'website',
        },
      }));

      // Add contacts to SendGrid
      try {
        const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${sendgridApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contacts }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log(`✅ Batch ${i + 1} synced successfully`);
          console.log(`   New contacts: ${result.new_count || 0}`);
          console.log(`   Updated contacts: ${result.updated_count || 0}`);
          console.log(`   Errors: ${result.error_count || 0}\n`);

          if (result.errors && result.errors.length > 0) {
            console.log('   Errors:', result.errors.slice(0, 3));
            console.log('');
          }
        } else {
          console.error(`❌ Failed to sync batch ${i + 1}`);
          console.error('   Status:', response.status);
          console.error('   Response:', result);
          console.log('');
        }
      } catch (batchError) {
        console.error(`❌ Error syncing batch ${i + 1}:`, batchError);
        console.log('');
      }

      // Add a small delay between batches to avoid rate limiting
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n✅ Sync completed!');
    console.log(`\n📊 Summary:`);
    console.log(`   Total subscribers processed: ${subscribers.length}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Log in to SendGrid: https://app.sendgrid.com/`);
    console.log(`   2. Go to Marketing → Contacts → All Contacts`);
    console.log(`   3. Verify your contacts are there`);
    console.log(`   4. Start creating campaigns!`);

  } catch (error) {
    console.error('\n❌ Error syncing subscribers:', error);
    process.exit(1);
  }
}

// Run the sync
syncSubscribersToSendGrid();
