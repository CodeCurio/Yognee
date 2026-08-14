-- ========================================================
-- PRODUCTION E-COMMERCE SUPABASE DATABASE SCHEMA
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE product_status AS ENUM ('draft', 'active');
CREATE TYPE payment_status_type AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE fulfillment_status_type AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL DEFAULT 'AURA Atelier',
  tagline TEXT DEFAULT 'Curated Modern Luxury & High-End Crafts',
  logo_url TEXT DEFAULT 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80',
  logo_inverted_url TEXT DEFAULT 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80',
  favicon_url TEXT DEFAULT '/favicon.ico',
  contact_email TEXT DEFAULT 'concierge@aura-atelier.com',
  contact_phone TEXT DEFAULT '+1 (800) 555-AURA',
  business_address TEXT DEFAULT '740 Madison Avenue, New York, NY 10065',
  currency_code TEXT DEFAULT 'USD',
  currency_symbol TEXT DEFAULT '$',
  tax_rate NUMERIC DEFAULT 8.5,
  tax_inclusive BOOLEAN DEFAULT false,
  announcement_bar_active BOOLEAN DEFAULT true,
  announcement_bar_text TEXT DEFAULT 'Complimentary Worldwide Express Shipping on Orders Over $250',
  announcement_bar_link TEXT DEFAULT '/products',
  announcement_bar_color TEXT DEFAULT '#1A1A1A',
  social_instagram TEXT DEFAULT 'https://instagram.com',
  social_facebook TEXT DEFAULT 'https://facebook.com',
  social_twitter TEXT DEFAULT 'https://twitter.com',
  social_tiktok TEXT DEFAULT 'https://tiktok.com',
  social_youtube TEXT DEFAULT 'https://youtube.com',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SEO SETTINGS
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meta_title_template TEXT DEFAULT '{Page Title} | AURA Atelier',
  default_meta_description TEXT DEFAULT 'Discover luxury fashion, timepieces, leather goods, and refined essentials.',
  og_default_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
  ga_tracking_id TEXT DEFAULT 'G-XXXXXXXXXX',
  fb_pixel_id TEXT DEFAULT '1234567890',
  search_console_meta TEXT DEFAULT 'google-site-verification=dummy_code',
  robots_txt TEXT DEFAULT 'User-agent: *' || E'\n' || 'Allow: /' || E'\n' || 'Disallow: /admin/' || E'\n' || 'Sitemap: https://aura-atelier.com/sitemap.xml',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PAGE SEO OVERRIDES
CREATE TABLE IF NOT EXISTS public.page_seo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug TEXT UNIQUE NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  og_image_url TEXT
);

-- 5. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  price NUMERIC NOT NULL,
  sale_price NUMERIC,
  sale_start TIMESTAMPTZ,
  sale_end TIMESTAMPTZ,
  sku TEXT UNIQUE NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,
  allow_backorders BOOLEAN DEFAULT false,
  status product_status NOT NULL DEFAULT 'active',
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  alt_text TEXT
);

-- 8. PRODUCT OPTIONS
CREATE TABLE IF NOT EXISTS public.product_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 9. PRODUCT OPTION VALUES
CREATE TABLE IF NOT EXISTS public.product_option_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  option_id UUID NOT NULL REFERENCES public.product_options(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 10. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  price NUMERIC,
  stock_quantity INT NOT NULL DEFAULT 0,
  option_values JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United States',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ORDERS
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 10001;

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL DEFAULT ('ORD-' || nextval('order_number_seq')),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  shipping_method TEXT NOT NULL,
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  subtotal NUMERIC NOT NULL,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL,
  coupon_code TEXT,
  payment_status payment_status_type NOT NULL DEFAULT 'pending',
  fulfillment_status fulfillment_status_type NOT NULL DEFAULT 'pending',
  Razorpay_payment_id TEXT,
  tracking_number TEXT,
  tracking_carrier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  variant_info JSONB,
  quantity INT NOT NULL,
  unit_price NUMERIC NOT NULL,
  line_total NUMERIC NOT NULL
);

-- 14. ORDER TIMELINE
CREATE TABLE IF NOT EXISTS public.order_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type coupon_type NOT NULL DEFAULT 'percentage',
  value NUMERIC NOT NULL,
  min_order_amount NUMERIC DEFAULT 0,
  usage_limit INT,
  per_customer_limit INT DEFAULT 1,
  times_used INT NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  applicable_products UUID[],
  applicable_categories UUID[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. HERO SLIDES
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  heading TEXT NOT NULL,
  subheading TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 19. WISHLIST
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_product_wishlist UNIQUE (user_id, product_id)
);

-- 20. MEDIA
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  size INT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Read Policies
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public site_settings read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin update site_settings" ON public.site_settings FOR ALL USING (public.is_admin());

CREATE POLICY "Public seo_settings read" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "Admin update seo_settings" ON public.seo_settings FOR ALL USING (public.is_admin());

CREATE POLICY "Public page_seo read" ON public.page_seo FOR SELECT USING (true);
CREATE POLICY "Admin update page_seo" ON public.page_seo FOR ALL USING (public.is_admin());

CREATE POLICY "Public categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (public.is_admin());

CREATE POLICY "Public products read" ON public.products FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (public.is_admin());

CREATE POLICY "Public product_images read" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admin write product_images" ON public.product_images FOR ALL USING (public.is_admin());

CREATE POLICY "Public product_options read" ON public.product_options FOR SELECT USING (true);
CREATE POLICY "Admin write product_options" ON public.product_options FOR ALL USING (public.is_admin());

CREATE POLICY "Public option values read" ON public.product_option_values FOR SELECT USING (true);
CREATE POLICY "Admin write option values" ON public.product_option_values FOR ALL USING (public.is_admin());

CREATE POLICY "Public variants read" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admin write variants" ON public.product_variants FOR ALL USING (public.is_admin());

CREATE POLICY "Users access own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users access own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE USING (public.is_admin());

CREATE POLICY "Users read order_items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND (user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Users insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Users read order_timeline" ON public.order_timeline FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_timeline.order_id AND (user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Admin write order_timeline" ON public.order_timeline FOR ALL USING (public.is_admin());

CREATE POLICY "Public reviews read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin delete reviews" ON public.reviews FOR DELETE USING (public.is_admin());

CREATE POLICY "Public coupons read" ON public.coupons FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin write coupons" ON public.coupons FOR ALL USING (public.is_admin());

CREATE POLICY "Subscribers insert" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read subscribers" ON public.subscribers FOR SELECT USING (public.is_admin());

CREATE POLICY "Public hero_slides read" ON public.hero_slides FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admin write hero_slides" ON public.hero_slides FOR ALL USING (public.is_admin());

CREATE POLICY "Users access own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public media read" ON public.media FOR SELECT USING (true);
CREATE POLICY "Admin write media" ON public.media FOR ALL USING (public.is_admin());

-- ========================================================
-- STORAGE BUCKETS SETUP
-- ========================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('brand-assets', 'brand-assets', true),
  ('media-library', 'media-library', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Read Product Images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin Upload Product Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public Read Brand Assets" ON storage.objects FOR SELECT USING (bucket_id = 'brand-assets');
CREATE POLICY "Admin Upload Brand Assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'brand-assets');

CREATE POLICY "Public Read Media Library" ON storage.objects FOR SELECT USING (bucket_id = 'media-library');
CREATE POLICY "Admin Upload Media Library" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media-library');

CREATE POLICY "Public Read Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users Upload Avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');

-- ========================================================
-- SEED DATA FOR IMMEDIATE DEMO FUNCTIONALITY
-- ========================================================

-- Seed Site Settings
INSERT INTO public.site_settings (id, site_name, tagline, currency_code, currency_symbol)
VALUES ('00000000-0000-0000-0000-000000000001', 'AURA Atelier', 'Curated Modern Luxury & Fine Crafts', 'USD', '$')
ON CONFLICT (id) DO NOTHING;

-- Seed Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Timepieces', 'timepieces', 'Mastercraft horology and iconic mechanical luxury watches.', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80', 1),
('c1000000-0000-0000-0000-000000000002', 'Leather Goods', 'leather-goods', 'Hand-stitched Tuscan leather bags, wallets, and travel trunks.', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80', 2),
('c1000000-0000-0000-0000-000000000003', 'Apparel & Outerwear', 'apparel', 'Tailored cashmere coats, silk shirts, and modern minimalist silhouettes.', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80', 3),
('c1000000-0000-0000-0000-000000000004', 'Eyewear & Accessories', 'accessories', 'Japanese titanium sunglasses and artisan jewelry pieces.', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80', 4)
ON CONFLICT (slug) DO NOTHING;

-- Seed Hero Slides
INSERT INTO public.hero_slides (id, image_url, heading, subheading, cta_text, cta_link, sort_order, is_active) VALUES
('h1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80', 'Architectural Luxury for Modern Living', 'Explore the Autumn/Winter collection defined by precise tailoring and rare materials.', 'Shop Autumn Collection', '/products', 1, true),
('h1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80', 'The Atelier Horology Series', 'Hand-assembled mechanical movements finished in rose gold and Grade 5 titanium.', 'Discover Timepieces', '/products?category=timepieces', 2, true),
('h1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80', 'Tuscan Leather Craftsmanship', 'Vegetable-tanned weekender duffels designed for timeless global travel.', 'Explore Leather Goods', '/products?category=leather-goods', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO public.products (id, title, slug, description, category_id, price, sale_price, sku, stock_quantity, status, tags) VALUES
('p1000000-0000-0000-0000-000000000001', 'Chronograph No. 01 Obsidian Edition', 'chronograph-no-01-obsidian', 'Precision automatic chronograph featuring a 41mm matte black ceramic case, sapphire crystal exhibition caseback, and a hand-stitched alligator strap.', 'c1000000-0000-0000-0000-000000000001', 3450.00, 3100.00, 'WAT-CHRONO-OBS', 15, 'active', ARRAY['New Arrival', 'Best Seller', 'Watch', 'Luxury']),
('p1000000-0000-0000-0000-000000000002', 'The Florentine Leather Weekender', 'florentine-leather-weekender', 'Handcrafted from full-grain Tuscan calfskin with solid brass hardware, suede lining, and a detachable padded shoulder strap.', 'c1000000-0000-0000-0000-000000000002', 1280.00, NULL, 'LEA-WEEK-FLO', 24, 'active', ARRAY['Best Seller', 'Travel', 'Leather']),
('p1000000-0000-0000-0000-000000000003', 'Double-Breasted Cashmere Overcoat', 'double-breasted-cashmere-overcoat', 'Unstructured luxury coat tailored in Milan from 100% Loro Piana cashmere. Features horn buttons and deep lapels.', 'c1000000-0000-0000-0000-000000000003', 2490.00, 2190.00, 'APP-COAT-CASH', 8, 'active', ARRAY['New Arrival', 'Outerwear', 'Cashmere']),
('p1000000-0000-0000-0000-000000000004', 'Titanium Sculpted Aviator Sunglasses', 'titanium-sculpted-aviator', 'Forged from ultra-lightweight Japanese beta-titanium with 24k gold-plated accents and polarized Zeiss lenses.', 'c1000000-0000-0000-0000-000000000004', 590.00, NULL, 'ACC-SUN-TIT', 42, 'active', ARRAY['Eyewear', 'Titanium']),
('p1000000-0000-0000-0000-000000000005', 'Monaco Automatic Skeleton Watch', 'monaco-automatic-skeleton', 'Exposed skeletonized caliber with 72-hour power reserve, housed in polished Grade 5 titanium with an integrated mesh bracelet.', 'c1000000-0000-0000-0000-000000000001', 4800.00, NULL, 'WAT-MON-SKEL', 5, 'active', ARRAY['Limited Edition', 'Watch']),
('p1000000-0000-0000-0000-000000000006', 'Minimalist Calfskin Slim Briefcase', 'minimalist-calfskin-slim-briefcase', 'Architectural slim laptop briefcase featuring magnetic closures, micro-suede interior, and waterproof coated zippers.', 'c1000000-0000-0000-0000-000000000002', 890.00, 750.00, 'LEA-BRIEF-SLIM', 19, 'active', ARRAY['Leather', 'Workwear']),
('p1000000-0000-0000-0000-000000000007', 'Silk Habotai Pleated Evening Shirt', 'silk-habotai-pleated-shirt', 'Pure mulberry silk shirt crafted with concealed mother-of-pearl buttons and refined hand-pleated bib.', 'c1000000-0000-0000-0000-000000000003', 460.00, NULL, 'APP-SHIRT-SILK', 30, 'active', ARRAY['Apparel', 'Silk']),
('p1000000-0000-0000-0000-000000000008', 'Artisan Brass Signet Ring', 'artisan-brass-signet-ring', 'Hand-hammered solid brass signet ring sealed with protective obsidian enamel coating.', 'c1000000-0000-0000-0000-000000000004', 280.00, NULL, 'ACC-RING-BRASS', 50, 'active', ARRAY['Jewelry', 'Accessories'])
ON CONFLICT (slug) DO NOTHING;

-- Seed Product Images
INSERT INTO public.product_images (product_id, image_url, sort_order, alt_text) VALUES
('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&q=80', 1, 'Chronograph Front View'),
('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&q=80', 2, 'Chronograph Wrist View'),
('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&q=80', 1, 'Florentine Leather Weekender Main'),
('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80', 2, 'Leather Weekender Detail'),
('p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1000&q=80', 1, 'Cashmere Overcoat Front'),
('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1000&q=80', 1, 'Titanium Aviator Sunglasses'),
('p1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80', 1, 'Skeleton Watch Front'),
('p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1000&q=80', 1, 'Slim Briefcase Main'),
('p1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1000&q=80', 1, 'Silk Shirt Main'),
('p1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&q=80', 1, 'Signet Ring Main')
ON CONFLICT DO NOTHING;

-- Seed Coupons
INSERT INTO public.coupons (code, type, value, min_order_amount, is_active) VALUES
('WELCOME10', 'percentage', 10, 100, true),
('AURA20', 'percentage', 20, 500, true),
('LUXURY50', 'fixed', 50, 300, true)
ON CONFLICT (code) DO NOTHING;

-- Seed Reviews
INSERT INTO public.reviews (product_id, rating, title, body, is_verified) VALUES
('p1000000-0000-0000-0000-000000000001', 5, 'Exquisite Craftsmanship', 'The matte ceramic finish and automatic sweep are breathtaking. Worth every penny.', true),
('p1000000-0000-0000-0000-000000000001', 5, 'Timeless Horology', 'Delivered in a lacquered wooden presentation box. Exceptional accuracy and weight.', true),
('p1000000-0000-0000-0000-000000000002', 5, 'The Ultimate Travel Companion', 'The Tuscan leather smell is amazing. Holds everything needed for a 4-day weekend trip.', true)
ON CONFLICT DO NOTHING;
