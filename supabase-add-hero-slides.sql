-- Hero slides table for the rotating homepage banner
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  badge TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  highlight TEXT,
  link TEXT DEFAULT '/products',
  link_text TEXT DEFAULT 'צפה במוצרים',
  gradient_from TEXT DEFAULT 'from-yellow-400',
  gradient_via TEXT DEFAULT 'via-yellow-300',
  gradient_to TEXT DEFAULT 'to-yellow-500',
  accent_color TEXT DEFAULT 'text-yellow-400',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: public read
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON hero_slides FOR SELECT USING (true);

-- Insert current slides as initial data
INSERT INTO hero_slides (image_url, badge, title, subtitle, description, highlight, link, link_text, gradient_from, gradient_via, gradient_to, accent_color, sort_order) VALUES
('https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1920&q=80', 'איכות פרימיום מאז 2010', 'שטיחים איכותיים', 'לכל בית', 'מבחר רחב של שטיחים מעוצבים, מודרניים וקלאסיים', 'באיכות פרימיום', '/products?type=carpets', 'צפה בשטיחים', 'from-yellow-400', 'via-yellow-300', 'to-yellow-500', 'text-yellow-400', 0),
('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80', 'ירוק בריא לבית', 'עציצים מרהיבים', 'לכל חלל', 'מגוון עציצים מדהים שיהפכו את הבית שלך', 'לירוק', '/products?type=plants', 'צפה בעציצים', 'from-green-400', 'via-green-300', 'to-green-500', 'text-green-400', 1);
