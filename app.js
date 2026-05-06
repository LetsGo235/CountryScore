let reviews = [];
let lastLoadedAt = null;
let refreshTimer = null;

const qs = new URLSearchParams(location.search);
const pageCountry = qs.get("country");

document.addEventListener("DOMContentLoaded", async () => {
  renderSharedLayout();
  await loadReviews();
  startLiveRefresh();

  if (document.body.dataset.page === "home") initHome();
  if (document.body.dataset.page === "country") initCountryPage();
  if (document.body.dataset.page === "review") initReviewPage();
  if (document.body.dataset.page === "categories") initCategoriesPage();
  if (document.body.dataset.page === "setup") initSetupPage();
});

function getAppsScriptUrl() {
  return localStorage.getItem("cs_apps_script_url") || window.COUNTRYSCORE_CONFIG.APPS_SCRIPT_URL || "";
}

function getRefreshSeconds() {
  return Number(localStorage.getItem("cs_refresh_seconds") || window.COUNTRYSCORE_CONFIG.REFRESH_SECONDS || 20);
}

async function loadReviews() {
  const localReviews = JSON.parse(localStorage.getItem("cs_local_reviews") || "[]");
  const url = getAppsScriptUrl();

  let remoteReviews = [];
  if (url) {
    try {
      const response = await fetch(`${url}?action=list&t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      remoteReviews = Array.isArray(data.reviews) ? data.reviews : [];
      setConnectionStatus("Live sheet connected");
    } catch (error) {
      console.warn("Live sheet load failed:", error);
      setConnectionStatus("Sheet offline - showing sample/local data");
    }
  } else {
    setConnectionStatus("Demo mode - add Apps Script URL");
  }

  reviews = [...SAMPLE_REVIEWS, ...remoteReviews, ...localReviews].map(normalizeReview).filter(Boolean);
  lastLoadedAt = new Date();
  updateLastUpdated();
}

function startLiveRefresh() {
  const seconds = getRefreshSeconds();
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(async () => {
    await loadReviews();
    rerenderCurrentPage();
  }, Math.max(seconds, 10) * 1000);
}

function rerenderCurrentPage() {
  if (document.body.dataset.page === "home") renderHome();
  if (document.body.dataset.page === "country") renderCountryPage();
  if (document.body.dataset.page === "categories") renderCategoriesPage();
}

function renderSharedLayout() {
  const navHost = document.querySelector("#topNav");
  if (!navHost) return;

  navHost.innerHTML = `
    <div class="nav-main">
      <a class="brand" href="index.html"><span class="brand-box">CS</span><strong>CountryScore</strong></a>
      <form class="nav-search" action="country.html">
        <select id="navCountrySelect" name="country"></select>
        <input id="navSearchInput" placeholder="Search countries, categories, reviews..." />
        <button type="submit">Search</button>
      </form>
      <a class="nav-link" href="review.html">Write a review</a>
      <a class="nav-link" href="setup.html">Setup</a>
    </div>
    <div class="nav-sub">
      <a href="index.html">Countries</a>
      <a href="categories.html">Categories</a>
      <span id="connectionStatus">Loading...</span>
      <span id="lastUpdated"></span>
    </div>
  `;
}

function fillCountrySelects() {
  const countries = getCountries();
  document.querySelectorAll("select[data-country-select], #navCountrySelect").forEach(select => {
    const current = select.value || pageCountry || "";
    select.innerHTML = `<option value="">Select country</option>` + countries
      .map(country => `<option value="${escapeHtml(country)}">${escapeHtml(country)}</option>`)
      .join("");
    if (countries.includes(current)) select.value = current;
  });
}

function setConnectionStatus(text) {
  const el = document.querySelector("#connectionStatus");
  if (el) el.textContent = text;
}

function updateLastUpdated() {
  const el = document.querySelector("#lastUpdated");
  if (el && lastLoadedAt) el.textContent = `Updated ${lastLoadedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
}

function initHome() {
  const search = document.querySelector("#homeSearch");
  const countrySelect = document.querySelector("#countrySelect");
  const sortSelect = document.querySelector("#sortSelect");

  fillCountrySelects();
  [search, countrySelect, sortSelect].forEach(el => el && el.addEventListener("input", renderHome));
  renderHome();
}

function renderHome() {
  fillCountrySelects();

  const grid = document.querySelector("#countryGrid");
  const count = document.querySelector("#totalReviewCount");
  if (!grid) return;

  const search = (document.querySelector("#homeSearch")?.value || "").toLowerCase();
  const selected = document.querySelector("#countrySelect")?.value || "";
  const sort = document.querySelector("#sortSelect")?.value || "score_desc";

  let countries = aggregateCountries(reviews);

  if (selected) countries = countries.filter(c => c.country === selected);
  if (search) {
    countries = countries.filter(c => {
      const text = `${c.country} ${c.topComments} ${c.categoriesText}`.toLowerCase();
      return text.includes(search);
    });
  }

  countries.sort((a, b) => {
    if (sort === "country_asc") return a.country.localeCompare(b.country);
    if (sort === "reviews_desc") return b.count - a.count;
    if (sort === "score_asc") return a.score - b.score;
    return b.score - a.score;
  });

  if (count) count.textContent = reviews.length;

  grid.innerHTML = countries.length ? countries.map(renderCountryCard).join("") :
    `<div class="notice">No countries found yet. Add the first review.</div>`;
}

function renderCountryCard(country) {
  return `
    <article class="product-card">
      <a href="country.html?country=${encodeURIComponent(country.country)}">
        <h3>${escapeHtml(country.country)}</h3>
      </a>
      <div class="rating-line">${stars(country.score)} <span>${country.score.toFixed(1)}/10</span></div>
      <p class="muted">${country.count} review${country.count === 1 ? "" : "s"} · ${country.categoryCount} categor${country.categoryCount === 1 ? "y" : "ies"}</p>
      <table class="mini-table">
        ${country.topCategories.slice(0, 4).map(row => `
          <tr><td>${escapeHtml(row.label)}</td><td>${row.score.toFixed(1)}/10</td></tr>
        `).join("")}
      </table>
      <a class="small-btn" href="country.html?country=${encodeURIComponent(country.country)}">View country</a>
    </article>
  `;
}

function initCountryPage() {
  fillCountrySelects();

  const selector = document.querySelector("#countryPageSelect");
  if (selector) {
    selector.value = pageCountry || "";
    selector.addEventListener("change", () => {
      if (selector.value) location.href = `country.html?country=${encodeURIComponent(selector.value)}`;
    });
  }

  renderCountryPage();
}

function renderCountryPage() {
  fillCountrySelects();

  const host = document.querySelector("#countryPageContent");
  const countryName = pageCountry || document.querySelector("#countryPageSelect")?.value;
  if (!host) return;

  if (!countryName) {
    host.innerHTML = `<div class="notice">Choose a country above to view its full score page.</div>`;
    return;
  }

  const countryReviews = reviews.filter(r => r.country === countryName);
  if (!countryReviews.length) {
    host.innerHTML = `
      <div class="notice">
        <h2>${escapeHtml(countryName)}</h2>
        <p>No reviews yet.</p>
        <a class="small-btn" href="review.html?country=${encodeURIComponent(countryName)}">Be the first to review</a>
      </div>`;
    return;
  }

  const summary = aggregateCountry(countryName, countryReviews);

  host.innerHTML = `
    <section class="country-header">
      <div>
        <h1>${escapeHtml(countryName)}</h1>
        <div class="big-rating">${stars(summary.score)} <strong>${summary.score.toFixed(1)}/10</strong></div>
        <p class="muted">${summary.count} total review${summary.count === 1 ? "" : "s"} · ratings update automatically from your connected Sheet</p>
      </div>
      <a class="yellow-btn" href="review.html?country=${encodeURIComponent(countryName)}">Write review for ${escapeHtml(countryName)}</a>
    </section>

    <section class="score-boxes">
      ${summary.statusBreakdown.map(row => `
        <div class="score-box">
          <strong>${row.count ? row.score.toFixed(1) : "—"}</strong>
          <span>${STATUS_LABELS[row.status]}</span>
          <small>${row.count} review${row.count === 1 ? "" : "s"}</small>
        </div>
      `).join("")}
    </section>

    <section class="department-list">
      <h2>Categories</h2>
      ${summary.categories.map(renderCategoryPanel).join("")}
    </section>

    <section class="reviews-list">
      <h2>Recent reviews</h2>
      ${countryReviews.slice().reverse().slice(0, 12).map(renderReviewItem).join("")}
    </section>
  `;
}

function renderCategoryPanel(cat) {
  return `
    <article class="department-card">
      <div class="department-head">
        <div>
          <h3>${escapeHtml(cat.label)}</h3>
          <div class="rating-line">${stars(cat.score)} <span>${cat.score.toFixed(1)}/10</span></div>
        </div>
        <a class="small-btn" href="review.html?country=${encodeURIComponent(pageCountry || "")}&category=${encodeURIComponent(cat.key)}">Review this</a>
      </div>
      <div class="subcategory-grid">
        ${cat.subcategories.length ? cat.subcategories.map(sub => `
          <div class="subcategory">
            <strong>${escapeHtml(sub.name || "General")}</strong>
            <div>${stars(sub.score)} <span>${sub.score.toFixed(1)}/10</span></div>
            <small>${sub.count} review${sub.count === 1 ? "" : "s"}</small>
          </div>
        `).join("") : `<p class="muted">No subcategories yet. Reviews can be general or specific.</p>`}
      </div>
    </article>
  `;
}

function renderReviewItem(review) {
  return `
    <article class="review-item">
      <div>
        <strong>${escapeHtml(review.title || "Review")}</strong>
        <div class="rating-line small">${stars(review.score)} <span>${review.score.toFixed(1)}/10</span></div>
        <p>${escapeHtml(review.comment)}</p>
        <small>
          ${escapeHtml(review.displayName || "Anonymous")} · ${STATUS_LABELS[review.status]} ·
          ${getCategoryLabel(review.category)}${review.subcategory ? " > " + escapeHtml(review.subcategory) : ""}
        </small>
      </div>
    </article>
  `;
}

function initReviewPage() {
  fillCountrySelects();

  const countryInput = document.querySelector("#reviewCountry");
  const categorySelect = document.querySelector("#reviewCategory");
  const subcategorySelect = document.querySelector("#reviewSubcategory");
  const scoreInput = document.querySelector("#reviewScore");
  const scorePreview = document.querySelector("#scorePreview");

  if (countryInput && qs.get("country")) countryInput.value = qs.get("country");
  if (categorySelect) {
    categorySelect.innerHTML = DEFAULT_CATEGORIES.map(c => `<option value="${c.key}">${c.label}</option>`).join("");
    if (qs.get("category")) categorySelect.value = qs.get("category");
    categorySelect.addEventListener("change", updateSubcategoryOptions);
  }

  if (scoreInput && scorePreview) {
    scoreInput.addEventListener("input", () => {
      const score = clamp(Number(scoreInput.value), 1, 10);
      scorePreview.innerHTML = `${stars(score)} <strong>${score.toFixed(1)}/10</strong>`;
    });
    scorePreview.innerHTML = `${stars(Number(scoreInput.value || 8))} <strong>${Number(scoreInput.value || 8).toFixed(1)}/10</strong>`;
  }

  updateSubcategoryOptions();

  const form = document.querySelector("#reviewForm");
  form.addEventListener("submit", submitReview);

  function updateSubcategoryOptions() {
    const cat = DEFAULT_CATEGORIES.find(c => c.key === categorySelect.value);
    subcategorySelect.innerHTML = `<option value="">No subcategory / general review</option>` +
      (cat?.subcategories || []).map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
  }
}

async function submitReview(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const review = normalizeReview({
    ...data,
    id: `local-${Date.now()}`,
    timestamp: new Date().toISOString()
  });

  const msg = document.querySelector("#formMessage");
  const url = getAppsScriptUrl();

  if (url) {
    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(review)
      });
      msg.textContent = "Review sent to the live Google Sheet. It will appear after the next refresh.";
      msg.className = "success";
    } catch (error) {
      saveLocalReview(review);
      msg.textContent = "Live submission failed, so it was saved locally for testing.";
      msg.className = "warning";
    }
  } else {
    saveLocalReview(review);
    msg.textContent = "Saved locally for testing. Add an Apps Script URL on Setup to write live.";
    msg.className = "success";
  }

  reviews.push(review);
  form.reset();
  document.querySelector("#scorePreview").innerHTML = `${stars(8)} <strong>8.0/10</strong>`;
}

function saveLocalReview(review) {
  const local = JSON.parse(localStorage.getItem("cs_local_reviews") || "[]");
  local.push(review);
  localStorage.setItem("cs_local_reviews", JSON.stringify(local));
}

function initCategoriesPage() {
  fillCountrySelects();
  renderCategoriesPage();
}

function renderCategoriesPage() {
  const host = document.querySelector("#categoriesContent");
  if (!host) return;

  const summaries = DEFAULT_CATEGORIES.map(cat => {
    const items = reviews.filter(r => r.category === cat.key);
    return {
      ...cat,
      count: items.length,
      score: weightedAverage(items, r => r.score, r => STATUS_WEIGHT[r.status] || 0.4),
      countries: aggregateCountries(items).slice(0, 5)
    };
  });

  host.innerHTML = summaries.map(cat => `
    <article class="department-card">
      <h2>${escapeHtml(cat.label)}</h2>
      <div class="rating-line">${cat.count ? stars(cat.score) : "No ratings yet"} ${cat.count ? `<span>${cat.score.toFixed(1)}/10</span>` : ""}</div>
      <p class="muted">${cat.count} review${cat.count === 1 ? "" : "s"}</p>
      <table class="mini-table full">
        ${cat.countries.map(c => `<tr><td><a href="country.html?country=${encodeURIComponent(c.country)}">${escapeHtml(c.country)}</a></td><td>${c.score.toFixed(1)}/10</td></tr>`).join("") || `<tr><td>No data yet</td><td></td></tr>`}
      </table>
    </article>
  `).join("");
}

function initSetupPage() {
  const urlInput = document.querySelector("#appsScriptUrl");
  const refreshInput = document.querySelector("#refreshSeconds");
  const msg = document.querySelector("#setupMessage");

  urlInput.value = getAppsScriptUrl();
  refreshInput.value = getRefreshSeconds();

  document.querySelector("#setupForm").addEventListener("submit", async event => {
    event.preventDefault();
    localStorage.setItem("cs_apps_script_url", urlInput.value.trim());
    localStorage.setItem("cs_refresh_seconds", refreshInput.value || "20");
    msg.textContent = "Saved. The site will now use this live hook.";
    await loadReviews();
    startLiveRefresh();
  });

  document.querySelector("#clearLocalBtn").addEventListener("click", () => {
    localStorage.removeItem("cs_local_reviews");
    msg.textContent = "Local test reviews cleared.";
  });
}

function aggregateCountries(source) {
  const grouped = groupBy(source, r => r.country);
  return Object.entries(grouped).map(([country, items]) => aggregateCountry(country, items));
}

function aggregateCountry(country, items) {
  const categoryRows = DEFAULT_CATEGORIES.map(cat => {
    const catReviews = items.filter(r => r.category === cat.key);
    const subGrouped = groupBy(catReviews.filter(r => r.subcategory), r => r.subcategory);
    const general = catReviews.filter(r => !r.subcategory);

    let subcategories = Object.entries(subGrouped).map(([name, subItems]) => ({
      name,
      count: subItems.length,
      score: weightedAverage(subItems, r => r.score, r => STATUS_WEIGHT[r.status] || 0.4)
    }));

    if (general.length) {
      subcategories.unshift({
        name: "General",
        count: general.length,
        score: weightedAverage(general, r => r.score, r => STATUS_WEIGHT[r.status] || 0.4)
      });
    }

    return {
      key: cat.key,
      label: cat.label,
      count: catReviews.length,
      score: catReviews.length ? weightedAverage(catReviews, r => r.score, r => STATUS_WEIGHT[r.status] || 0.4) : 0,
      subcategories
    };
  });

  const activeCategories = categoryRows.filter(c => c.count > 0);
  const score = weightedAverage(items, r => r.score, r => STATUS_WEIGHT[r.status] || 0.4);

  return {
    country,
    reviews: items,
    count: items.length,
    score,
    categoryCount: activeCategories.length,
    categories: categoryRows,
    topCategories: activeCategories.slice().sort((a, b) => b.score - a.score),
    statusBreakdown: Object.keys(STATUS_LABELS).map(status => {
      const statusItems = items.filter(r => r.status === status);
      return {
        status,
        count: statusItems.length,
        score: statusItems.length ? average(statusItems.map(r => r.score)) : null
      };
    }),
    topComments: items.map(r => r.comment).join(" "),
    categoriesText: activeCategories.map(c => c.label).join(" ")
  };
}

function normalizeReview(raw) {
  if (!raw || !raw.country) return null;
  const category = raw.category || "lifestyle";
  const knownCategory = DEFAULT_CATEGORIES.some(c => c.key === category) ? category : "lifestyle";

  return {
    id: raw.id || raw.ID || `r-${Math.random().toString(16).slice(2)}`,
    timestamp: raw.timestamp || raw.Timestamp || new Date().toISOString(),
    country: titleCase(String(raw.country || raw.Country || "").trim()),
    status: raw.status || raw.Status || "current_resident",
    category: knownCategory,
    subcategory: String(raw.subcategory || raw.Subcategory || "").trim(),
    score: clamp(Number(raw.score || raw.Score || 8), 1, 10),
    displayName: String(raw.displayName || raw["Display Name"] || raw.display_name || "Anonymous").trim(),
    title: String(raw.title || raw.Title || "Review").trim(),
    comment: String(raw.comment || raw.Comment || "").trim()
  };
}

function getCountries() {
  return [...new Set(reviews.map(r => r.country).filter(Boolean))].sort();
}

function getCategoryLabel(key) {
  return DEFAULT_CATEGORIES.find(c => c.key === key)?.label || key;
}

function stars(score) {
  const rating = clamp(score / 2, 0, 5);
  let html = `<span class="stars" aria-label="${rating.toFixed(1)} out of 5 stars">`;
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) html += "★";
    else if (rating >= i - 0.5) html += "★";
    else html += "☆";
  }
  return html + "</span>";
}

function weightedAverage(items, valueFn, weightFn) {
  if (!items.length) return 0;
  const totalWeight = items.reduce((sum, item) => sum + weightFn(item), 0);
  return totalWeight ? items.reduce((sum, item) => sum + valueFn(item) * weightFn(item), 0) / totalWeight : 0;
}

function average(values) {
  const clean = values.map(Number).filter(v => Number.isFinite(v));
  return clean.length ? clean.reduce((a, b) => a + b, 0) / clean.length : 0;
}

function groupBy(items, fn) {
  return items.reduce((acc, item) => {
    const key = fn(item);
    acc[key] ||= [];
    acc[key].push(item);
    return acc;
  }, {});
}

function clamp(value, min, max) {
  value = Number(value);
  if (!Number.isFinite(value)) value = min;
  return Math.max(min, Math.min(max, value));
}

function titleCase(value) {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .split(" ")
    .map(word => word ? word[0].toUpperCase() + word.slice(1) : "")
    .join(" ");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, match => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[match]));
}
