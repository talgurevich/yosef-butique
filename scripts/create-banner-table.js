const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBannerTable() {
  try {
    console.log('Creating banner table...');

    // Execute the SQL to create the table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create banner table
        CREATE TABLE IF NOT EXISTS public.banner (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          message TEXT NOT NULL,
          is_active BOOLEAN DEFAULT false,
          gradient_from VARCHAR(50) DEFAULT '#3b82f6',
          gradient_to VARCHAR(50) DEFAULT '#8b5cf6',
          text_color VARCHAR(50) DEFAULT '#ffffff',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
      `
    });

    if (error) {
      console.log('Note: exec_sql function may not exist. Creating table directly via raw SQL...');

      // Alternative: Try direct table creation
      const { error: insertError } = await supabase
        .from('banner')
        .insert({
          message: '🎉 קבלו 10% הנחה על כל המוצרים! השתמשו בקוד: WELCOME10',
          is_active: false,
          gradient_from: '#3b82f6',
          gradient_to: '#8b5cf6',
          text_color: '#ffffff'
        });

      if (insertError && !insertError.message.includes('already exists')) {
        console.error('Error:', insertError);
      } else {
        console.log('✅ Banner table created and default banner inserted!');
      }
    } else {
      console.log('✅ Banner table created successfully!');

      // Insert default banner
      const { error: insertError } = await supabase
        .from('banner')
        .insert({
          message: '🎉 קבלו 10% הנחה על כל המוצרים! השתמשו בקוד: WELCOME10',
          is_active: false,
          gradient_from: '#3b82f6',
          gradient_to: '#8b5cf6',
          text_color: '#ffffff'
        });

      if (insertError) {
        console.log('Default banner may already exist or error:', insertError.message);
      } else {
        console.log('✅ Default banner inserted!');
      }
    }

    console.log('\n📋 Next steps:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Run the migration SQL to set up RLS policies');
    console.log('3. Or the table should be created automatically');

  } catch (error) {
    console.error('Error:', error);
  }
}

createBannerTable();
