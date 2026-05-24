# CountryScore v2 - Current State

## Environment

- I am using Claude Web Free, not Claude Code.
- I cannot access `/home/claude/countryscore-v2/`.
- The real project is being built locally and/or in GitHub.
- Claude must give exact file paths and full code when creating files.
- Do not reference local Claude paths. All file contents must be provided in full.

---

## Completed

- Commit 1: React + Vite + Tailwind project initialized, constants.js, globals.css, PLAN.md created.
- Commit 1.5: Actual source files recovered and provided as copy-pasteable code.
- Commit 2: Database migration executed in Supabase. ✅

### Commit 2 details (executed in Supabase project `cusvsgnpxlvkwrgslnis`):

**Migration 001_initial_schema** — applied via `apply_migration`:
- Dropped old tables (reviews, countries, etc.)
- Created: `reviews`, `countries`, `review_votes`, `review_reports`, `insights_snapshots`
- `reviews` has correct CHECK constraints: status IN (current_resident, former_resident, visited, never_been), category IN (costOfLiving, safety, jobs, healthcare, education, freedom, lifestyle, infrastructure)
- `approved` defaults to `false` (manual moderation required)
- All RLS policies applied

**Migration 002_seed_data** — applied via `apply_migration`:
- 40 countries seeded into `countries` table
- 10 approved sample reviews inserted (Netherlands, Japan, USA, Germany, UK, Singapore, Portugal, Canada)

**Verified:**
- `countries` table: 40 rows
- `reviews` table: 10 rows, all approved = true
- Live Supabase query (`approved = true`) returns correct data

---

## Current Status

**Ready for Commit 3: Core React Components.**

---

## Next Task

Build core reusable React components:

### Layout Components
- `src/components/layout/Header.jsx`
- `src/components/layout/Footer.jsx`

### Common Components
- `src/components/common/Button.jsx`
- `src/components/common/Card.jsx`
- `src/components/common/LoadingSpinner.jsx`
- `src/components/common/ErrorMessage.jsx`
- `src/components/common/StarRating.jsx`

All components must use Tailwind CSS and match the CountryScore design system (navy header, green buttons, blue accents). See PLAN.md for color palette and design references.

---

## Rules

- Do not move to pages until core components are built.
- Do not add authentication (Phase 3).
- Do not add image uploads (Phase 3).
- Always provide full file contents — never reference paths the user cannot access.
