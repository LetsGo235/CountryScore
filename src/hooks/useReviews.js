import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../utils/supabase';
import { DEFAULT_CATEGORIES } from '../utils/constants';
import {
  calculateCountryScore,
  calculateStatusBreakdown,
  calculateCategoryScores,
  aggregateCountries,
  aggregateCountry,
  getCountriesFromReviews,
} from '../utils/calculations';

/**
 * Hook to fetch all approved reviews from Supabase
 * @returns {{ reviews: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export function useAllReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
  };
}

/**
 * Hook to fetch reviews for a specific country
 * @param {string} countryName - Country name to fetch reviews for
 * @returns {{ reviews: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export function useCountryReviews(countryName) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(!!countryName);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!countryName) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('reviews')
        .select('*')
        .eq('country', countryName)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setReviews(data || []);
    } catch (err) {
      console.error(`Error fetching reviews for "${countryName}":`, err);
      setError(err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [countryName]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
  };
}

/**
 * Hook to fetch reviews filtered by category and/or country
 * @param {string} category - Category key to filter by (optional)
 * @param {string} countryName - Country to filter by (optional)
 * @returns {{ reviews: Array, loading: boolean, error: Error|null }}
 */
export function useFilteredReviews(category = null, countryName = null) {
  const { reviews, loading, error } = useAllReviews();

  const filtered = useMemo(() => {
    let result = reviews;

    if (countryName) {
      result = result.filter((r) => r.country === countryName);
    }

    if (category) {
      result = result.filter((r) => r.category === category);
    }

    return result;
  }, [reviews, category, countryName]);

  return {
    reviews: filtered,
    loading,
    error,
  };
}

/**
 * Hook to search reviews by text (searches title, comment, country)
 * @param {string} query - Search query
 * @param {Array} reviews - Reviews to search in (uses all if not provided)
 * @returns {{ results: Array, loading: boolean, error: Error|null }}
 */
export function useSearchReviews(query = '', reviews = null) {
  const { reviews: allReviews, loading, error } = useAllReviews();
  const [results, setResults] = useState([]);

  const searchableReviews = reviews || allReviews;

  useEffect(() => {
    if (!query.trim()) {
      setResults(searchableReviews);
      return;
    }

    const q = query.toLowerCase();
    const filtered = searchableReviews.filter(
      (review) =>
        review.title?.toLowerCase().includes(q) ||
        review.comment?.toLowerCase().includes(q) ||
        review.country?.toLowerCase().includes(q) ||
        review.display_name?.toLowerCase().includes(q)
    );

    setResults(filtered);
  }, [query, searchableReviews]);

  return {
    results,
    loading,
    error,
  };
}

/**
 * Hook to get aggregated country data
 * @param {string} countryName - Country to aggregate
 * @returns {{ country: Object|null, loading: boolean, error: Error|null }}
 */
export function useCountryAggregate(countryName) {
  const { reviews, loading, error } = useCountryReviews(countryName);
  const [aggregated, setAggregated] = useState(null);

  useEffect(() => {
    if (!countryName || reviews.length === 0) {
      setAggregated(null);
      return;
    }

    const data = aggregateCountry(countryName, reviews, DEFAULT_CATEGORIES);
    setAggregated(data);
  }, [countryName, reviews]);

  return {
    country: aggregated,
    loading,
    error,
  };
}

/**
 * Hook to get all countries aggregated from reviews
 * @returns {{ countries: Array, loading: boolean, error: Error|null }}
 */
export function useCountriesAggregate() {
  const { reviews, loading, error } = useAllReviews();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (reviews.length === 0) {
      setCountries([]);
      return;
    }

    const aggregated = aggregateCountries(reviews, DEFAULT_CATEGORIES);
    setCountries(aggregated);
  }, [reviews]);

  return {
    countries,
    loading,
    error,
  };
}

/**
 * Hook to sort countries by various criteria
 * @param {Array} countries - Countries to sort
 * @param {string} sortBy - Sort criteria: 'score_desc', 'score_asc', 'name_asc', 'reviews_desc'
 * @returns {Array} Sorted countries
 */
export function useSortedCountries(countries = [], sortBy = 'score_desc') {
  return useMemo(() => {
    const sorted = [...countries];

    switch (sortBy) {
      case 'score_asc':
        sorted.sort((a, b) => a.score - b.score);
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.country.localeCompare(b.country));
        break;
      case 'reviews_desc':
        sorted.sort((a, b) => b.count - a.count);
        break;
      case 'score_desc':
      default:
        sorted.sort((a, b) => b.score - a.score);
        break;
    }

    return sorted;
  }, [countries, sortBy]);
}

/**
 * Hook to get category summary across all reviews
 * @returns {{ categories: Array, loading: boolean, error: Error|null }}
 */
export function useCategorySummary() {
  const { reviews, loading, error } = useAllReviews();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (reviews.length === 0) {
      setCategories(DEFAULT_CATEGORIES.map((cat) => ({ ...cat, count: 0, score: 0 })));
      return;
    }

    const categoryData = DEFAULT_CATEGORIES.map((category) => {
      const categoryReviews = reviews.filter((r) => r.category === category.key);
      const score =
        categoryReviews.length > 0
          ? categoryReviews.reduce((sum, r) => sum + r.score, 0) / categoryReviews.length
          : 0;

      return {
        ...category,
        count: categoryReviews.length,
        score,
        topCountries: aggregateCountries(categoryReviews, DEFAULT_CATEGORIES)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5),
      };
    });

    setCategories(categoryData);
  }, [reviews]);

  return {
    categories,
    loading,
    error,
  };
}
