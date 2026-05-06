# CountryScore v2

Bright, multi-page, marketplace-style CountryScore prototype.

## What changed

- Bright 2015-style marketplace design
- Amazon-like top navigation bar
- Multiple pages:
  - `index.html` country browse page
  - `country.html` country detail page
  - `review.html` review submission page
  - `categories.html` category rankings page
  - `setup.html` live Google Sheets setup page
- Country pages show:
  - star rating
  - numeric 10-point score
  - reviewer-type breakdown
  - categories
  - optional subcategories
  - recent reviews
- Review form uses number input fields, not sliders
- Subcategory is optional
- Live refresh from Google Sheets through Apps Script JSON endpoint

## Run locally

```bash
cd CountryScore_v2
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Live Google Sheets hook

This version does not depend on published CSV.

It uses Apps Script as a real JSON endpoint:

```text
GET  ?action=list
POST review JSON
```

The website polls the endpoint every 20 seconds by default.

## Google Sheet setup

Create a Google Sheet. Then:

1. Go to `Extensions > Apps Script`
2. Paste `google-apps-script/Code.gs`
3. Save
4. Deploy > New deployment
5. Type: Web app
6. Execute as: Me
7. Who has access: Anyone
8. Copy the Web App URL
9. Open `setup.html`
10. Paste the URL and save

The script will automatically create a `Reviews` sheet with these headers:

```text
id,timestamp,country,status,category,subcategory,score,displayName,title,comment
```

## Important Google Sites note

New Google Sites is not a normal static hosting platform for multiple HTML/CSS/JS files.

Best testing options:

1. Host this folder on GitHub Pages, Netlify, Vercel, or similar.
2. Embed that hosted site into Google Sites using an iframe/embed block.
3. Or use Google Apps Script HTML service as the host, but that requires adapting file loading.

For local testing, the included Python server method is easiest.

## Production upgrades

Before public launch:

- accounts/login
- moderation dashboard
- country whitelist
- spam/rate-limit protection
- duplicate review detection
- admin approval for new countries/categories
- abuse reporting
