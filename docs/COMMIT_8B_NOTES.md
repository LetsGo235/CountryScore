# Commit 8B — Submit Review visual fidelity and honesty pass

## Scope
Only `src/pages/SubmitReviewPage.jsx` and two locally bundled image placeholders are replaced/added.

## Changes
- Rebuilt the page around the **second user reference image** (the intended mockup, not the first/current screenshot).
- Hero gets a purpose-built, neutral SVG artwork placeholder instead of an emoji globe or arbitrary photograph.
- All page emoji icons are removed. Built-in Lucide React icons are used for everyday UI; bespoke artwork stays explicitly placeholder.
- Single unified white form panel; five visual steps; five connection tiles; responsive two-column rating grid; right sidebar cards; bottom benefit strip.
- Supabase country list replaces hardcoded fake options; ISO-2 flag image fetched via FlagCDN, with blank image-placeholder treatment when code is missing.
- Stars start **unrated** (0), not pre-filled. Only explicitly rated categories are inserted. Clicking a selected star again clears that category.
- Pros, cons, age range, time period, and duration are written to existing corresponding DB fields; no extra text appended to the 2,000-character comment field.
- The old, misleading 'You can display my review publicly' switch is replaced by a **required acknowledgement** that an approved review may be public. This is not claimed to be a hidden/private publishing option.
- No fake 24-hour moderation turnaround guarantee; photo uploads remain explicitly unavailable.
- Existing `approved: false` insertion, country query, validation, and client-side cooldown preserved.

## Known deliberate limitations
- **Legacy data model remains intact**. Each chosen category is still a separate `reviews` row; counts may represent category ratings rather than distinct people. Structural correction is scheduled separately to avoid risky schema changes in a visual-design commit.
- Expat and Student choices map to `current_resident` status because these roles have no distinct DB field today.
- Review submit cooldown uses localStorage, **not** server-enforced anti-spam. Before public launch introduce server throttling/auth controls.
- Consent acknowledgement is a frontend gate; storing verifiable consent records and handling withdrawals should be designed as a proper feature before production.
- Country flag images require an internet connection to `flagcdn.com`; network failure falls back to a neutral locally bundled flag placeholder. A locally bundled real flag library is a future improvement.
- No false claims that users are verified or that moderation is completed within any particular SLA.
- This does not implement country details or other placeholder tabs.

## Install
1. Commit current local changes or create a clean working branch from Commit 8A.
2. Merge the two provided files into your project, preserving their relative paths.
3. Run `npm run dev`, then inspect `/submit-review` at mobile and desktop widths.
4. Run `npm run build` and optionally `npm run lint`.
5. Test submission only against a **test Supabase database**. The form inserts unapproved records and must not be tested by spamming production.

## Recommended next commit
Commit 8C — Country Detail visual parity with **fifth reference screenshot** and removal of fabricated scores, trends, count labels, reviews, and photos. Follow with review schema normalization so aggregate counts are trustworthy.
