# CountryScore v2.0 Rebuild - Project Plan

## 🎯 Project Overview

**What we're building:** A complete redesign of CountryScore - a platform where people review and rate countries based on real experience. Think TripAdvisor meets Reddit for country living experiences.

**Tech Stack:**
- Frontend: React 18 + Vite + Tailwind CSS + React Router
- Backend: Supabase (PostgreSQL + Row Level Security)
- Deployment: Vercel
- Icons: Lucide React
- Charts: Recharts

**Scope:** Phase 1 (Bug Fixes) + Phase 2 (Mockup Implementation)
- Phase 3 (Auth, Images, Advanced Features) is postponed for later

---

## 📁 Project Locations

### Repository
- **GitHub:** https://github.com/LetsGo235/CountryScore
- **Old Project Files:** Vanilla JS version in repo (will be replaced)

### Supabase
- **Organization:** User has Supabase connector enabled
- **Project:** CountryScore (ID: `cusvsgnpxlvkwrgslnis`)
- **Region:** eu-west-1
- **Connection:** Use Supabase connector tools to interact with database

### Assets
- **Design Mockups:** 4 PNG images uploaded to `/mnt/user-data/uploads/`
  - `67f84b2c-4291-48e6-8275-69f5638df7cf.png` - Insights Page
  - `e8df1177-7e92-4e2b-9f67-d5db12a1a60c.png` - Review Submission Page
  - `01937392-2836-4dc6-8275-69f5638df7cf.png` - Country Detail Page
  - `2c7b611f-1801-499c-9aa9-a871cb972626.png` - Homepage ✅ IMPLEMENTED

---

## 🏗️ Implementation Progress

### ✅ COMPLETED — Commit 1: Project Setup

**React/Vite/Tailwind Project Initialized**

Files created:
- `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
- `index.html`, `src/main.jsx`, `src/App.jsx`
- `src/styles/globals.css`
- `src/utils/constants.js`

---

### ✅ COMPLETED — Commit 2: Database Migration

**Supabase Schema + Data**

- 5 tables: `reviews`, `countries`, `review_votes`, `review_reports`, `insights_snapshots`
- 40 countries seeded
- 10 approved sample reviews
- RLS policies applied
- Status & category constraints

---

### ✅ COMPLETED — Commit 3: Core React Components

**7 Reusable Components:**
- Header (dark navy)
- Footer (dark navy)
- Button
- Card
- LoadingSpinner
- ErrorMessage
- StarRating

---

### ✅ COMPLETED — Commit 4: Supabase Integration

**Utilities + Hooks:**
- `src/utils/supabase.js` — Supabase client
- `src/utils/calculations.js` — Scoring & aggregation
- `src/hooks/useCountries.js` — Country data hooks
- `src/hooks/useReviews.js` — Review data hooks (8 hooks total)

---

### ✅ COMPLETED — Commit 5: React Router Setup

**6 Routes Configured:**
- `/` — HomePage (placeholder)
- `/country/:countryName` — CountryDetailPage (placeholder)
- `/submit-review` — SubmitReviewPage (placeholder)
- `/insights` — InsightsPage (placeholder)
- `/categories` — CategoriesPage (placeholder)
- `/admin` — AdminDashboard (placeholder)

ErrorPage for invalid routes.

---

### ✅ COMPLETED — Commit 6: HomePage + Header + Footer Redesign

**Complete Visual Overhaul to Match PNG #1:**

#### 1. Header Component Redesigned
- ✅ Light white background (no dark navy)
- ✅ Clean, minimal design
- ✅ Logo with blue gradient circle
- ✅ Nav links: Explore, Compare, Insights (with "New" pill), About
- ✅ Search icon button
- ✅ Log in + Sign up buttons (right side)
- ✅ Mobile hamburger menu with responsive nav
- ✅ Height: 80px (h-20)
- ✅ Subtle gray border bottom

#### 2. HomePage Complete Redesign
- ✅ Hero Section (2-column layout)
  - Large bold heading with "really" in blue with underline
  - Subtitle about real reviews
  - Search input + "Explore countries" button
  - Avatar row with "Join 25,000+ people" text
  - Mountain/lake image with floating stat card overlay (dark glass effect)
  - Stats: 197 Countries, 582K+ Reviews, 32K+ Active Users

- ✅ Trending Countries Section
  - Header with TrendingUp icon
  - 5 country cards (responsive grid: 1 col mobile, 5 col desktop)
  - Each card has:
    - Image with rank badge (numbered 1-5)
    - Country flag emoji
    - Country name
    - Large score (e.g., 8.9/10)
    - Review count with star
    - 2 tag pills
  - "View all countries" link

- ✅ Insights + Compare Section (2-column)
  - Left: CountryScore Insights card
    - 5 insight rows with icons, text, badges, timestamps
    - Dividers between rows
  - Right: Compare Countries card
    - Country selectors (dropdowns)
    - 5 comparison metrics with:
      - Icons
      - Labels
      - Left/right scores
      - Visual bars
    - "View full comparison" link

- ✅ CTA Section
  - Dark card with globe icon
  - "Your experience matters" heading
  - Subtitle
  - Log in + Sign up free buttons

- ✅ Features Row (3 columns)
  - Real people. Real opinions.
  - Safe & respectful community
  - Global perspective
  - Each with icon circle and description

#### 3. Footer Component Redesigned
- ✅ Light white background (no dark navy)
- ✅ Top border only (subtle)
- ✅ 4-column grid: Brand, Navigation, Legal, Connect
- ✅ Brand column with logo + tagline
- ✅ Clean typography and spacing
- ✅ Copyright + built with ♥ line at bottom
- ✅ Hover states on links

**Design Features Implemented:**
- ✅ Responsive mobile-first layout
- ✅ All Tailwind CSS (no inline styles)
- ✅ Blue accent colors (primary-500/600)
- ✅ Demo data fallback for trending countries
- ✅ Live Supabase data integration where available
- ✅ Professional SaaS-style aesthetic
- ✅ Smooth hover effects and transitions
- ✅ Proper spacing and typography
- ✅ Accessibility considerations (semantic HTML, proper headings)

**Data Integration:**
- Uses `useCountriesAggregate()` for real country data
- Falls back to demo country data with images from Unsplash
- Maps demo countries to real Supabase data when available
- Loading and error states handled gracefully

---

## 🎨 Visual Design Summary

### Color Scheme (Post Commit 6)
- **Background:** White (#ffffff)
- **Text:** Gray-900 (#111827) for headings, Gray-600 for body
- **Primary Blue:** #1d4ed8, #2563eb, #3b82f6 (Tailwind blue-600, blue-500, blue-400)
- **Accents:** Yellow-500 for stars, Green for positive, Purple for features
- **Borders:** Gray-200 (#e5e7eb)
- **Shadows:** Subtle soft shadows (hover effects)

### Typography
- Headings: Bold, navy-900, larger sizes
- Body: Regular weight, gray-600, readable line-height
- Buttons: Semibold, clear contrast
- Links: Blue-600, underline on hover

### Component Patterns
- Cards: White bg, rounded-xl, gray-200 border, hover:shadow-lg
- Buttons: Blue gradient (from blue-600 to blue-700), white text, rounded-lg
- Inputs: Gray border, rounded-lg, blue focus ring
- Mobile-first: Responsive grid, hidden/flex breakpoints

---

## 📊 Database Schema Reference

### reviews columns (key fields)
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK, auto |
| created_at | TIMESTAMPTZ | auto |
| country | TEXT | required |
| status | TEXT | CHECK: current_resident / former_resident / visited / never_been |
| category | TEXT | CHECK: costOfLiving / safety / jobs / healthcare / education / freedom / lifestyle / infrastructure |
| subcategory | TEXT | nullable |
| score | NUMERIC | 1–10 |
| title | TEXT | min 6 chars |
| comment | TEXT | min 40 chars |
| display_name | TEXT | default 'Anonymous' |
| approved | BOOLEAN | default false |

---

## 🟡 NEXT — Commit 7: CountryDetailPage + SubmitReviewPage

### CountryDetailPage
Build the country detail page using PNG #3 as reference:
- Hero section with country name, flag, banner image
- Overall score + star rating + review count
- Status breakdown (residents, expats, visitors, outside)
- Category ratings grid (8 categories)
- Key insights panel
- Recent reviews list (scrollable)
- Trending topics in country
- Photo gallery section
- Write a review CTA button

### SubmitReviewPage
Build review submission form using PNG #2 as reference:
- Multi-step form (5 sections)
- Country selector with search
- Connection type selector (5 options with icons)
- Category rating system (star interface)
- Text inputs for title + review
- Pros/cons optional fields
- Photo upload (optional, Phase 3)
- Additional details (duration, age range, time period)
- Submit button with loading state
- Review tips sidebar

---

## 🟢 UPCOMING — Commits 8–12: More Pages

Order of priority:
1. CategoriesPage (Commit 8)
2. InsightsPage (Commit 9)
3. AdminDashboard (Commit 10)
4. Advanced features (Phase 3)

---

## ⚠️ What NOT to Do

- ❌ No user authentication (Phase 3)
- ❌ No image uploads (Phase 3)
- ❌ No email notifications (Phase 3)
- ❌ No advanced search/filtering (Phase 3)

---

## ✅ Testing Checklist (Post Commit 6)

- [x] Header is light, clean, matches PNG #1
- [x] HomePage hero section displays correctly
- [x] Trending countries grid renders with images
- [x] Insights + Compare sections visible
- [x] CTA section displays
- [x] Features row at bottom
- [x] Footer is light and clean
- [x] Mobile layout responsive
- [x] No console errors
- [x] Data loads from Supabase
- [x] Demo data fallback works
- [x] Search bar functional
- [x] All links properly styled

---

**Last Updated:** 2026-05-25
**Current Phase:** Commit 6 Complete ✅
**Next Action:** Commit 7 — CountryDetailPage + SubmitReviewPage Implementation
