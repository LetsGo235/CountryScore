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
  - `2c7b611f-1801-499c-9aa9-a871cb972626.png` - Homepage

---

## 🏗️ Implementation Progress

### ✅ COMPLETED — Commit 1: Project Setup

**React/Vite/Tailwind Project Initialized**

Files created and delivered to user:
- `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
- `index.html`, `src/main.jsx`, `src/App.jsx`
- `src/styles/globals.css` (Google Fonts import above Tailwind directives)
- `src/utils/constants.js` (categories, statuses, validation rules)
- `.env.example`, `.gitignore`, `README.md`

Dependencies: react, react-dom, react-router-dom, @supabase/supabase-js, recharts, lucide-react, vite, tailwindcss, postcss, autoprefixer

---

### ✅ COMPLETED — Commit 1.5: Real File Export

- All source files provided as copy-pasteable code in chat
- `globals.css` font import fixed
- `CURRENT_STATE.md` created

---

### ✅ COMPLETED — Commit 2: Database Migration

**Executed in Supabase project `cusvsgnpxlvkwrgslnis`**

**Migration files (saved to local project):**
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_seed_countries.sql`

**What was done:**
- Dropped old `reviews` table (had wrong/mismatched schema)
- Created 5 tables: `reviews`, `countries`, `review_votes`, `review_reports`, `insights_snapshots`
- `reviews.status` CHECK constraint: `current_resident`, `former_resident`, `visited`, `never_been`
- `reviews.category` CHECK constraint: `costOfLiving`, `safety`, `jobs`, `healthcare`, `education`, `freedom`, `lifestyle`, `infrastructure`
- `approved` defaults to `false` — new submissions require manual moderation
- All RLS policies applied (public read approved reviews, public insert as unapproved, etc.)
- 40 countries seeded into `countries` table
- 10 approved sample reviews inserted

**Verified:**
- `countries`: 40 rows ✅
- `reviews`: 10 rows, all `approved = true` ✅
- Supabase query with `approved = true` returns correct shaped data ✅

---

### ✅ COMPLETED — Commit 3: Core React Components

**All 7 reusable core components built and delivered:**

#### Layout Components
- `src/components/layout/Header.jsx` ✅
  - Navy gradient background with green accent border
  - Logo + brand on left
  - Desktop nav links (Countries, Insights, Categories, Write Review)
  - Mobile hamburger menu with collapsible nav
  - Sticky positioning with z-index control
  - Responsive design (hidden nav links on mobile, hamburger appears)

- `src/components/layout/Footer.jsx` ✅
  - Dark navy background with border
  - 4-column layout: Brand + tagline, Navigation links, Legal links, Social icons
  - Responsive grid (1 col on mobile, 4 on desktop)
  - Social media icons (Twitter, GitHub, LinkedIn) from lucide-react
  - Copyright and footer text
  - Hover effects on all links

#### Common Components
- `src/components/common/Button.jsx` ✅
  - 5 variants: `primary` (green gradient), `secondary`, `outline`, `ghost`, `danger`
  - 3 sizes: `sm`, `md`, `lg`
  - Loading state with spinner animation
  - Disabled state handling
  - Focus rings for accessibility
  - Supports `loading` prop for async actions
  - Full Tailwind styling, no inline styles

- `src/components/common/Card.jsx` ✅
  - White background, rounded corners, subtle border
  - Hoverable mode with shadow lift and slight translate
  - Optional padding (can be disabled)
  - Responsive padding (p-4 sm:p-6)
  - Smooth transitions

- `src/components/common/LoadingSpinner.jsx` ✅
  - Centered animated spinner
  - 3 sizes: `sm`, `md`, `lg`
  - Optional label text below spinner
  - Green color (success-500) to match theme
  - Accessibility role support

- `src/components/common/ErrorMessage.jsx` ✅
  - Red-tinted error card with icon
  - Customizable title and message
  - Optional retry button (calls `onRetry` callback)
  - Dismissible with close button
  - Accessibility: role="alert" for screen readers
  - Smooth dismiss animation

- `src/components/common/StarRating.jsx` ✅
  - Converts 1-10 score to 1-5 stars
  - Full stars (★), half stars, empty stars (☆)
  - Green color (success-500) for filled stars, gray for empty
  - 3 sizes: `sm`, `md`, `lg`
  - Optional numeric score display (1-5 format)
  - Accessibility labels for screen readers
  - Formula: rating = score / 2

**Design System Compliance:**
- ✅ All components use Tailwind utility classes only
- ✅ Custom colors from tailwind.config.js (primary-500/600, success-500/600, navy-500/600, border)
- ✅ No inline styles
- ✅ Mobile-first responsive design
- ✅ Consistent spacing, typography, and interactions
- ✅ Accessible (ARIA labels, focus rings, semantic HTML)

---

### ✅ COMPLETED — Commit 4: Supabase Integration

**4 files created + environment configuration:**

#### Utility Files
- `src/utils/supabase.js` ✅
  - Initializes Supabase client from `import.meta.env` variables
  - Exports singleton `supabase` instance
  - Helper functions for response handling
  - Configuration validation

- `src/utils/calculations.js` ✅
  - `weightedAverage()` — Calculates weighted scores using STATUS_WEIGHTS
  - `simpleAverage()` — Basic average calculation
  - `getStatusWeight()` — Retrieves weight for a review status
  - `calculateCountryScore()` — Overall country score from reviews
  - `calculateStatusBreakdown()` — Score breakdown by reviewer status
  - `calculateCategoryScores()` — Scores by category with subcategories
  - `aggregateCountries()` — Aggregate all countries from reviews
  - `aggregateCountry()` — Aggregate single country with full breakdown
  - `getCountriesFromReviews()` — Extract unique sorted countries

#### Custom Hooks (React)
- `src/hooks/useCountries.js` ✅
  - `useCountries()` — Fetch all countries from DB, supports refetch
  - `useCountriesSearch()` — Search countries by name/code/region
  - `useCountry()` — Fetch single country by name

- `src/hooks/useReviews.js` ✅
  - `useAllReviews()` — Fetch all approved reviews from DB
  - `useCountryReviews()` — Fetch reviews for a specific country
  - `useFilteredReviews()` — Filter reviews by category and/or country
  - `useSearchReviews()` — Full-text search in reviews
  - `useCountryAggregate()` — Get aggregated country data with scores
  - `useCountriesAggregate()` — Get all countries with aggregated scores
  - `useSortedCountries()` — Sort countries by various criteria (score, name, reviews)
  - `useCategorySummary()` — Get category summary with top countries

#### Environment Configuration
- `.env.local` ✅
  - `VITE_SUPABASE_URL=https://cusvsgnpxlvkwrgslnis.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=sb_publishable_TUir54Uq1sZ2wipqkaH-DA_fLXOMLfa`
  - Ready to use, already gitignored

**Features Implemented:**
- ✅ Full Supabase client setup with env variables
- ✅ 8 calculation utilities covering all aggregation needs
- ✅ 3 country hooks (fetch, search, single)
- ✅ 8 review hooks covering all data patterns
- ✅ Weighted average scoring using STATUS_WEIGHTS
- ✅ Category and subcategory calculations
- ✅ Status breakdown calculations
- ✅ Sorting and search capabilities
- ✅ Error handling in all hooks
- ✅ Loading states on all data fetches

---

### ✅ COMPLETED — Commit 5: Router Setup

**React Router v6 configuration with 6 routes:**

#### Main Router File
- `src/router.jsx` ✅
  - Configured with `createBrowserRouter` from react-router-dom
  - 6 main routes + error handling
  - ErrorPage component for invalid routes (404)
  - Proper error boundaries on all routes
  - URL parameters support (e.g., `:countryName`)

#### Updated App Component
- `src/App.jsx` (updated) ✅
  - Uses `RouterProvider` with router from `src/router.jsx`
  - Global Header component (sticky at top)
  - Main content area for page routes
  - Global Footer component (at bottom)
  - Flexbox layout ensures footer stays at bottom
  - All pages automatically wrapped with Header + Footer

#### Route Definitions
- `GET /` → `HomePage.jsx` (country grid, search, sort)
- `GET /country/:countryName` → `CountryDetailPage.jsx` (scores, categories, reviews)
- `GET /submit-review` → `SubmitReviewPage.jsx` (review form with optional params)
- `GET /insights` → `InsightsPage.jsx` (trending, highlights, activity)
- `GET /categories` → `CategoriesPage.jsx` (category rankings)
- `GET /admin` → `AdminDashboard.jsx` (moderation panel)

#### Page Placeholders (6 files)
- `src/pages/HomePage.jsx` ✅
  - Hero section with tagline
  - Placeholder content
  - Comment block noting Commit 6 implementation

- `src/pages/CountryDetailPage.jsx` ✅
  - Accepts `:countryName` URL param
  - Displays country name in header
  - Placeholder content
  - Comment block noting Commit 6 implementation

- `src/pages/SubmitReviewPage.jsx` ✅
  - Accepts optional ?country and ?category query params
  - Displays pre-filled values
  - Form placeholder
  - Comment block noting Commit 7 implementation

- `src/pages/CategoriesPage.jsx` ✅
  - Grid layout with 8 category cards
  - Placeholder content
  - Comment block noting Commit 8 implementation

- `src/pages/InsightsPage.jsx` ✅
  - 3-column layout (Trending, Highlights, Activity)
  - Placeholder cards
  - Comment block noting Commit 9 implementation

- `src/pages/AdminDashboard.jsx` ✅
  - Stats cards (pending, total reviews, total countries)
  - Placeholder table for pending reviews
  - Comment block noting Commit 10 implementation

**Features Implemented:**
- ✅ Full React Router v6 setup
- ✅ 6 routes correctly configured
- ✅ URL parameter support (`:countryName`)
- ✅ Query parameter support (`?country`, `?category`)
- ✅ Error page for invalid routes (404)
- ✅ All pages render with Header + Footer
- ✅ No console errors or warnings
- ✅ Mobile-first responsive design
- ✅ Tailwind CSS styling only
- ✅ Ready for page implementation in Commits 6-10

---

### 🟡 NEXT — Commit 6: HomePage Implementation

Build actual HomePage with:
- Hero section with stats
- Search bar (text search)
- Sort selector
- Country grid with cards (score, categories, review count)
- Uses: `useCountriesAggregate()`, `useSearchReviews()`, `useSortedCountries()`

---

### 🟢 UPCOMING — Commits 7–12: Pages

Build incrementally (see Page Specifications section below).

Order of priority:
1. HomePage (Commit 6)
2. CountryDetailPage (Commit 6 or 7)
3. SubmitReviewPage (Commit 7)
4. AdminDashboard (Commit 10)
5. CategoriesPage (Commit 8)
6. InsightsPage (Commit 9)

---

## 🎨 Design System

### Color Palette (tailwind.config.js custom values)
```
primary-500:  #1579b8   (links, score accents, focus rings)
primary-600:  #0f5d8e   (hover state for primary)
success-500:  #28a86b   (buttons, stars, positive states)
success-600:  #1f8656   (hover state for success)
navy-500:     #0b2638   (header, dark elements)
navy-600:     #091e2d   (deeper navy for gradients)
navy-2:       #12384f   (subnav background)
page-bg:      #f9fafb   (page background, light gray)
card-bg:      #ffffff   (card background)
border:       #c9dce7   (default border color)
```

### Typography
- Font: Inter (Google Fonts, imported in globals.css)
- Headings: font-semibold or font-bold, color navy-500
- Body: font-normal, text-sm (14px)

### Component Patterns
- Cards: `bg-white rounded-lg border border-border shadow-sm hover:shadow-md transition`
- Buttons (primary): `bg-gradient-to-b from-success-400 to-success-500 border border-success-600 text-gray-900 rounded px-4 py-2 hover:from-success-300 hover:to-success-600`
- Input focus: `focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`
- Stars: `text-success-500`
- Score accent: `text-primary-600 font-bold`

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
| approved | BOOLEAN | default false — must be set true by admin |

### Status weights (from constants.js / old data.js)
```
current_resident:  1.00
former_resident:   0.82
visited:           0.55
never_been:        0.25
```

---

## 📋 Page Specifications

### HomePage
- Hero section with tagline and search bar
- Stats (countries count, reviews count)
- Country grid cards (name, overall score, top categories, review count)
- Sort: highest rated / lowest rated / most reviewed / A–Z

### CountryDetailPage
- Country name, overall score, star rating
- Score breakdown by reviewer status (residents / former / visitors / outside)
- Category panels (each with subcategory breakdown)
- Recent reviews list
- Write review CTA

### SubmitReviewPage
- Country input (with datalist)
- Status selector
- Category selector → subcategory selector (dynamic)
- Score input (1–10, 0.5 steps) with live star preview
- Title + comment text fields
- Validation: title ≥ 6 chars, comment ≥ 40 chars, real words check
- Cooldown: 10 minutes per country+category combo (localStorage)

### AdminDashboard
- Stats: pending reviews count, total reviews, total countries
- Table of pending reviews with approve / reject actions
- Supabase admin update: `approved = true` or delete

### CategoriesPage
- List all 8 categories
- For each: top 5 countries by weighted score, total review count

### InsightsPage
- Trending countries
- Category highlights
- Recent activity

---

## ⚠️ What NOT to Do

- ❌ No user authentication (Phase 3)
- ❌ No image uploads (Phase 3)
- ❌ No email notifications (Phase 3)
- ❌ No advanced search/filtering (Phase 3)
- ❌ Don't refactor the old vanilla JS code — building from scratch in React
- ❌ Don't hardcode Supabase keys in source files — use `.env.local`

---

## ✅ Testing Checklist (after each commit)

- [ ] No console errors
- [ ] No ESLint warnings
- [ ] Components render correctly
- [ ] Responsive on mobile (< 768px)
- [ ] Data fetches from Supabase successfully
- [ ] Loading states render
- [ ] Error states render

---

## 🚀 Deployment (final step)

### Vercel
1. Connect GitHub repo
2. Set env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
3. Build command: `npm run build`
4. Output directory: `dist`

---

## 🆘 Key References

- **GitHub:** https://github.com/LetsGo235/CountryScore
- **Supabase Project ID:** cusvsgnpxlvkwrgslnis
- **Supabase Region:** eu-west-1
- **Design mockups:** 4 PNGs in `/mnt/user-data/uploads/` (see filenames above)

---

## 📝 How to Continue in a New Chat

1. Read this entire PLAN.md
2. Read CURRENT_STATE.md
3. Check what commit is next
4. Provide all file contents in full — never reference local Claude paths
5. Update PLAN.md and CURRENT_STATE.md after each commit and provide them as downloadable files

---

**Last Updated:** 2026-05-25
**Current Phase:** Commit 5 Complete ✅
**Next Action:** Commit 6 — HomePage Implementation
