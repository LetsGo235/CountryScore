# CountryScore v3 Secure Public API

## Changes

- Removed public setup.html
- Removed Setup link from navigation
- Frontend now reads only from ?action=publicReviews
- Apps Script returns sanitized public review data only
- Apps Script separates raw submitted reviews from public reviews

## Configure the hook

Edit:

assets/config.js

Set:

window.COUNTRYSCORE_CONFIG = {
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  REFRESH_SECONDS: 20
};

Then commit and push to GitHub Pages.

## Update Apps Script

Replace your old Apps Script code with:

google-apps-script/Code.gs

Then deploy a new Web App version.

## Important

The Apps Script URL is still visible. That is normal.

The secure part is that the endpoint no longer reveals private/raw sheet data.

Never store passwords in Google Sheets.


## v4 color update

The Amazon-style yellow/orange accents were replaced with a CountryScore palette:

- Navy header
- Blue links and score accents
- Green buttons and star accents
- Light blue/green panels

Main color variables are at the top of:

assets/styles.css
