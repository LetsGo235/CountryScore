import { STATUS_WEIGHTS } from '../utils/constants';

/**
 * Calculate weighted average from a list of items
 * @param {Array} items - Items to average
 * @param {Function} valueFn - Function to extract score from item
 * @param {Function} weightFn - Function to extract weight from item (default: 1)
 * @returns {number} Weighted average
 */
export function weightedAverage(items, valueFn, weightFn = () => 1) {
  if (!items || items.length === 0) return 0;

  const totalWeight = items.reduce((sum, item) => sum + weightFn(item), 0);
  if (totalWeight === 0) return 0;

  const weightedSum = items.reduce((sum, item) => {
    const value = valueFn(item);
    const weight = weightFn(item);
    return sum + value * weight;
  }, 0);

  return weightedSum / totalWeight;
}

/**
 * Calculate simple average from a list of values
 * @param {Array<number>} values - Numbers to average
 * @returns {number} Simple average
 */
export function simpleAverage(values) {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

/**
 * Get weight for a review status
 * @param {string} status - Review status (current_resident, former_resident, visited, never_been)
 * @returns {number} Weight multiplier
 */
export function getStatusWeight(status) {
  return STATUS_WEIGHTS[status] || 0.25;
}

/**
 * Calculate overall score for a country from its reviews
 * Uses weighted average based on reviewer status
 * @param {Array} reviews - Reviews for the country
 * @returns {number} Overall score 1-10
 */
export function calculateCountryScore(reviews) {
  if (!reviews || reviews.length === 0) return 0;

  return weightedAverage(
    reviews,
    (review) => review.score,
    (review) => getStatusWeight(review.status)
  );
}

/**
 * Calculate score breakdown by reviewer status
 * @param {Array} reviews - Reviews for the country
 * @returns {Object} { status: { count, score } }
 */
export function calculateStatusBreakdown(reviews) {
  if (!reviews || reviews.length === 0) return {};

  const breakdown = {};

  Object.keys(STATUS_WEIGHTS).forEach((status) => {
    const statusReviews = reviews.filter((r) => r.status === status);
    breakdown[status] = {
      count: statusReviews.length,
      score: statusReviews.length > 0 ? simpleAverage(statusReviews.map((r) => r.score)) : 0,
    };
  });

  return breakdown;
}

/**
 * Calculate scores by category for a country
 * @param {Array} reviews - Reviews for the country
 * @param {Array} categories - Category definitions from constants
 * @returns {Array} Category scores with breakdowns
 */
export function calculateCategoryScores(reviews, categories) {
  if (!reviews || reviews.length === 0) return [];

  return categories.map((category) => {
    const categoryReviews = reviews.filter((r) => r.category === category.key);
    const score = calculateCountryScore(categoryReviews);

    // Group by subcategory
    const subcategoryMap = {};
    categoryReviews.forEach((review) => {
      const subName = review.subcategory || 'General';
      if (!subcategoryMap[subName]) {
        subcategoryMap[subName] = [];
      }
      subcategoryMap[subName].push(review);
    });

    const subcategories = Object.entries(subcategoryMap).map(([name, subReviews]) => ({
      name,
      count: subReviews.length,
      score: calculateCountryScore(subReviews),
    }));

    return {
      key: category.key,
      label: category.label,
      count: categoryReviews.length,
      score,
      subcategories,
    };
  });
}

/**
 * Aggregate all countries from a list of reviews
 * @param {Array} reviews - All reviews
 * @param {Array} categories - Category definitions
 * @returns {Array} Country summaries with scores
 */
export function aggregateCountries(reviews, categories) {
  if (!reviews || reviews.length === 0) return [];

  // Group reviews by country
  const countryMap = {};
  reviews.forEach((review) => {
    if (!countryMap[review.country]) {
      countryMap[review.country] = [];
    }
    countryMap[review.country].push(review);
  });

  // Calculate scores for each country
  return Object.entries(countryMap).map(([country, countryReviews]) => {
    const score = calculateCountryScore(countryReviews);
    const statusBreakdown = calculateStatusBreakdown(countryReviews);
    const categoryScores = calculateCategoryScores(countryReviews, categories);

    return {
      country,
      score,
      count: countryReviews.length,
      statusBreakdown,
      categories: categoryScores,
      topCategories: categoryScores
        .filter((c) => c.count > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
    };
  });
}

/**
 * Aggregate a single country
 * @param {string} countryName - Country name
 * @param {Array} reviews - Reviews for the country
 * @param {Array} categories - Category definitions
 * @returns {Object} Country summary
 */
export function aggregateCountry(countryName, reviews, categories) {
  const score = calculateCountryScore(reviews);
  const statusBreakdown = calculateStatusBreakdown(reviews);
  const categoryScores = calculateCategoryScores(reviews, categories);

  return {
    country: countryName,
    score,
    count: reviews.length,
    statusBreakdown,
    categories: categoryScores,
    topCategories: categoryScores
      .filter((c) => c.count > 0)
      .sort((a, b) => b.score - a.score),
  };
}

/**
 * Get unique countries from reviews
 * @param {Array} reviews - All reviews
 * @returns {Array} Sorted country names
 */
export function getCountriesFromReviews(reviews) {
  if (!reviews || reviews.length === 0) return [];
  const countries = new Set(reviews.map((r) => r.country).filter(Boolean));
  return Array.from(countries).sort();
}
