# AURA Atelier — Production-Grade Next.js 14 E-Commerce Platform

A production-grade e-commerce platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Supabase (Auth + Database + Storage)**, and **Razorpay for payments**.

Designed following high-end luxury retail design systems (Apple Store, Aesop, Mr Porter).

---

## 🌟 Key Features

### Storefront Experience
- **Micro-Interactions**: Dynamic flying add-to-cart ghost thumbnail animation, spring bounce cart badge, slide-over cart drawer, and crossfade PDP gallery.
- **Storefront Home**: Auto-rotating hero carousel with word-by-word stagger typography, category marquee, New Arrivals pulse grid, Best Sellers, and promotional countdown timer.
- **Product Listing Page (PLP)**: Real-time search parameters filtering (categories, dual-thumb price slider, tags), sort dropdown, active filter chips, quick view modal.
- **Product Detail Page (PDP)**: Crossfade gallery with thumbnail strip, image zoom, color swatches, size selector pills, accordion specification tables, client review submission with star rating breakdown.
- **Multi-Step Checkout**: Shipping address form with floating labels, shipping method selection, Razorpay Elements payment integration, order receipt creation with SVG checkmark path draw animation.
- **User Account Dashboard**: Order history with color-coded status badges, order timeline modal, address book CRUD, saved wishlist grid, and profile settings.
- **Instant Search**: Full-screen debounced search overlay querying Supabase products, with recent search history stored in `localStorage`.

### Admin Control Panel (`/admin`)
- **Dashboard & Telemetry**: KPI count-up cards (Revenue, Orders, Customers, Avg Order Value), Recharts sales area chart, recent order log, top selling products bar chart, low stock alerts (< 10).
- **Product Management**: Catalog table, add/edit form with auto-generated slug, image drag-and-drop upload zone to Supabase Storage `product-images` bucket, and dynamic variant matrix creator.
- **Category Hierarchy**: Category tree CRUD with banner image uploads.
- **Order & Shipping Center**: Filterable order log, line item breakdown, shipping tracking number/carrier logger, order timeline auditor, CSV export, and printable packing slip/invoice generator.
- **Brand & Site Settings**: Customize brand logos (primary & inverted), tagline, announcement bar, currency, contact details, and social links without touching code.
- **SEO Telemetry**: Meta title template editor, default OG image, GA4 & FB Pixel trackers, dynamic `/sitemap.xml` and `/robots.txt` endpoints.
- **Media Library**: Browser for Supabase `media-library` storage bucket with URL copy and upload zone.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Animations**: Framer Motion 11
- **Database & Auth**: Supabase JS (`@supabase/supabase-js`, `@supabase/ssr`)
- **Payments**: Razorpay Node SDK & Client Elements
- **Analytics Charts**: Recharts
- **Icons**: Lucide React

---

## 🚀 Setup & Installation Instructions

### 1. Prerequisites
- Node.js v18+ or v20+
- npm / pnpm / yarn

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Migration
Open `supabase/schema.sql` and run the complete SQL script in your Supabase SQL Editor. This will:
- Create all 20 tables with indexes and foreign keys
- Set up RLS (Row Level Security) policies and helper functions
- Create storage buckets (`product-images`, `brand-assets`, `media-library`, `avatars`)
- Seed demo categories, products, hero slides, reviews, and site settings

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Verification & Build

To test production build:
```bash
npm run build
```
