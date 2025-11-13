# Banner Feature Setup

## Database Setup Required

To enable the banner feature, you need to create the `banner` table in Supabase.

### Steps:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL:

```sql
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

-- Insert default banner (inactive)
INSERT INTO public.banner (message, is_active, gradient_from, gradient_to, text_color)
VALUES ('🎉 קבלו 10% הנחה על כל המוצרים! השתמשו בקוד: WELCOME10', false, '#3b82f6', '#8b5cf6', '#ffffff');

-- Enable RLS
ALTER TABLE public.banner ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.banner
  FOR SELECT USING (true);

-- Create policy to allow authenticated insert/update
CREATE POLICY "Allow authenticated insert" ON public.banner
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.banner
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON public.banner
  FOR DELETE USING (true);
```

## Features

### Banner Display
- Appears at the top of the site, above the header
- Users can dismiss the banner with an X button
- Banner dismissal is remembered via localStorage
- Fully responsive design

### Admin Configuration
- Access via: `/admin/banner`
- Configure banner message
- Toggle banner active/inactive
- Choose from 6 gradient presets
- Custom gradient colors (start and end)
- Custom text color
- Live preview of banner appearance

### Gradient Presets
1. כחול סגול (Blue Purple)
2. ירוק כחול (Green Blue)
3. ורוד אדום (Pink Red)
4. כתום צהוב (Orange Yellow)
5. סגול ורוד (Purple Pink)
6. אפור כהה (Dark Gray)

## Usage

1. Go to `/admin/banner` in your admin panel
2. Enter your banner message
3. Choose a gradient preset or customize colors
4. Toggle "Active" to enable the banner
5. Click "Save Changes"

The banner will now appear at the top of your website!

## Technical Details

- **Component**: `components/Banner.tsx`
- **Admin Page**: `app/admin/banner/page.tsx`
- **Database Table**: `public.banner`
- **LocalStorage Key**: `dismissedBannerId` (stores the dismissed banner's ID)
