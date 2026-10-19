import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  BookmarkIcon,
  ChevronRight,
  MapPin,
  TrendingUp,
  Users,
} from 'lucide-react';

import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StarRating from '../components/common/StarRating';

import { useCountry } from '../hooks/useCountries';
import { useCountryAggregate, useCountryReviews } from '../hooks/useReviews';
import { calculateCountryScore } from '../utils/calculations';

const safeDecode = (value) => {
  try {
    return decodeURIComponent(value || '');
  } catch {
    return value || '';
  }
};

// Visual fallback data keeps the page polished when Supabase has sparse rows.
// Real Supabase rows always win when they exist.
const FALLBACK_COUNTRIES = {
  Japan: {
    flag: '🇯🇵',
    region: 'Asia',
    continent: 'Asia',
    description:
      'Japan is an island country in East Asia known for its rich culture, advanced technology, and high quality of life.',
    overallScore: 8.9,
    ranking: { region: '#2 in Asia', world: '#6 in the World' },
    trendPercent: 0.3,
    reviewCount: 4604,
    image:
      'https://images.unsplash.com/photo-1540959375944-7049f642e9ab?auto=format&fit=crop&w=1600&h=700&q=80',
    population: '125.1M',
    capital: 'Tokyo',
    language: 'Japanese',
    currency: 'Yen (¥)',
    timeZone: 'GMT +9',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Japan',
  },
  Canada: {
    flag: '🇨🇦',
    region: 'North America',
    continent: 'North America',
    description:
      'Canada is known for its natural beauty, multicultural cities, and high quality of life.',
    overallScore: 8.4,
    ranking: { region: '#1 in North America', world: '#4 in the World' },
    trendPercent: 0.2,
    reviewCount: 3200,
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&h=700&q=80',
    population: '38.9M',
    capital: 'Ottawa',
    language: 'English, French',
    currency: 'Canadian Dollar ($)',
    timeZone: 'GMT -3.5 to -8',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Canada',
  },
  Netherlands: {
    flag: '🇳🇱',
    region: 'Europe',
    continent: 'Europe',
    description:
      'The Netherlands is a compact country with excellent infrastructure, progressive policies, and high living standards.',
    overallScore: 8.2,
    ranking: { region: '#2 in Europe', world: '#5 in the World' },
    trendPercent: 0.1,
    reviewCount: 2890,
    image:
      'https://images.unsplash.com/photo-1504584049109-b8365059e0eb?auto=format&fit=crop&w=1600&h=700&q=80',
    population: '17.5M',
    capital: 'Amsterdam',
    language: 'Dutch',
    currency: 'Euro (€)',
    timeZone: 'GMT +1',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Netherlands',
  },
};

const GENERIC_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&h=700&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&h=700&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&h=700&q=80',
];

const UI_CATEGORY_CARDS = [
  { key: 'safety', dbKey: 'safety', label: 'Safety', icon: '🛡️', color: 'blue', fallbackScore: 9.2, fallbackReviews: '4.2K' },
  { key: 'costOfLiving', dbKey: 'costOfLiving', label: 'Cost of Living', icon: '💰', color: 'amber', fallbackScore: 6.4, fallbackReviews: '4.1K' },
  { key: 'healthcare', dbKey: 'healthcare', label: 'Healthcare', icon: '❤️', color: 'rose', fallbackScore: 8.6, fallbackReviews: '3.8K' },
  { key: 'publicTransport', dbKey: 'infrastructure', subcategory: 'Public Transport', label: 'Public Transport', icon: '🚆', color: 'emerald', fallbackScore: 9.6, fallbackReviews: '4.3K' },
  { key: 'workLife', dbKey: 'lifestyle', subcategory: 'Work-Life Balance', label: 'Work-Life Balance', icon: '👥', color: 'indigo', fallbackScore: 7.8, fallbackReviews: '3.9K' },
  { key: 'education', dbKey: 'education', label: 'Education', icon: '🎓', color: 'purple', fallbackScore: 8.3, fallbackReviews: '2.7K' },
  { key: 'internet', dbKey: 'infrastructure', subcategory: 'Internet Quality', label: 'Internet Quality', icon: '📡', color: 'cyan', fallbackScore: 9.1, fallbackReviews: '3.6K' },
  { key: 'friendliness', dbKey: 'lifestyle', subcategory: 'Friendliness', label: 'Friendliness', icon: '😊', color: 'yellow', fallbackScore: 7.6, fallbackReviews: '3.7K' },
];

const FALLBACK_REVIEWS = [
  {
    id: 'fallback-1',
    displayName: 'Sakura 🌸',
    location: 'Tokyo, Japan',
    status: 'current_resident',
    date: 'May 12, 2024',
    title: 'Clean, safe, and incredibly convenient.',
    comment:
      "I've lived in Tokyo for 8 years and overall I'm very happy here. Public transport is amazing and I always feel safe, even at night. The biggest downsides are the high cost of living and long working hours. It can be very hard to find time for yourself.",
    overallScore: 8.5,
    categoryScores: {
      Safety: 10,
      'Cost of Living': 6,
      Healthcare: 8,
      'Public Transport': 10,
      'Work-Life Balance': 6,
    },
    pros: ['Safe', 'Clean', 'Great public transport', 'Convenient'],
    cons: ['Expensive', 'Long work hours', 'Hard to make close friends'],
    helpfulYes: 128,
    helpfulNo: 12,
  },
  {
    id: 'fallback-2',
    displayName: 'Alex M.',
    location: 'Osaka, Japan',
    status: 'former_resident',
    date: 'May 8, 2024',
    title: 'A fascinating place with some challenges.',
    comment:
      'Japan is a wonderful country with rich culture and delicious food. People are polite and everything works perfectly. However, it can be isolating as an expat and apartment prices are very high.',
    overallScore: 7.9,
    categoryScores: {
      Safety: 9,
      'Cost of Living': 5,
      Healthcare: 8,
      'Public Transport': 9,
      Lifestyle: 7,
    },
    pros: ['Amazing food', 'Polite people', 'Clean'],
    cons: ['Isolating as expat', 'High housing costs', 'Language barrier'],
    helpfulYes: 95,
    helpfulNo: 8,
  },
];

const COMMUNITY_PHOTOS = [
  'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1522383165280-3cad6af0d150?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1500856056257-94b2779ba8a1?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=300&h=300&q=80',
  'https://images.unsplash.com/photo-1504674900967-77cdfb1b4e7c?auto=format&fit=crop&w=300&h=300&q=80',
];

const TRENDING_TOPICS = [
  { topic: 'Cost of living', change: 34 },
  { topic: 'Work-life balance', change: 18 },
  { topic: 'Public transport', change: -5 },
  { topic: 'Housing', change: 27 },
  { topic: 'Tourism impact', change: -8 },
];

const statusLabel = (status) => {
  if (status === 'current_resident') return 'Resident';
  if (status === 'former_resident') return 'Former Resident';
  if (status === 'visited') return 'Traveler';
  return 'Outside Opinion';
};

const shortDate = (value) => {
  if (!value) return 'recently';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return value;
  }
};

const formatNumber = (value) => {
  const num = Number(value || 0);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}K`;
  return String(num);
};

const readableCategory = (key = '') =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());

function getFallbackCountry(routeCountry) {
  return FALLBACK_COUNTRIES[routeCountry] || {
    flag: '🌍',
    region: 'Countries',
    continent: 'World',
    description: `${routeCountry} is part of the CountryScore community. Scores update as people share real reviews.`,
    overallScore: 0,
    ranking: { region: 'Unranked', world: 'Unranked' },
    trendPercent: 0,
    reviewCount: 0,
    image: GENERIC_HERO_IMAGES[routeCountry.length % GENERIC_HERO_IMAGES.length],
    population: '—',
    capital: '—',
    language: '—',
    currency: '—',
    timeZone: '—',
    wikipediaUrl: '#',
  };
}

function buildCountryDisplay(routeCountry, countryRow, aggregate, reviews) {
  const fallback = getFallbackCountry(routeCountry);
  const realReviewCount = Array.isArray(reviews) ? reviews.length : 0;
  const hasRealReviews = realReviewCount > 0;

  const languages = Array.isArray(countryRow?.languages)
    ? countryRow.languages.join(', ')
    : countryRow?.languages || fallback.language;

  return {
    name: countryRow?.name || aggregate?.country || routeCountry || 'Japan',
    flag: countryRow?.flag_emoji || fallback.flag,
    region: countryRow?.region || countryRow?.continent || fallback.region,
    continent: countryRow?.continent || fallback.continent,
    description:
      countryRow?.description ||
      fallback.description ||
      `${routeCountry} is part of the CountryScore review database.`,
    overallScore: hasRealReviews ? Number(aggregate?.score || 0) : fallback.overallScore,
    reviewCount: hasRealReviews ? realReviewCount : fallback.reviewCount,
    ranking: fallback.ranking,
    trendPercent: fallback.trendPercent,
    image: countryRow?.hero_image_url || fallback.image,
    population: countryRow?.population ? formatNumber(countryRow.population) : fallback.population,
    capital: countryRow?.capital || fallback.capital,
    language: languages || '—',
    currency: countryRow?.currency || fallback.currency,
    timeZone: countryRow?.timezone || fallback.timeZone,
    wikipediaUrl: countryRow?.wikipedia_url || fallback.wikipediaUrl,
    hasRealReviews,
  };
}

function getCategoryStats(uiCategory, reviews, fallbackScore, fallbackReviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return {
      score: fallbackScore,
      countLabel: `${fallbackReviews} reviews`,
      count: 0,
      isFallback: true,
    };
  }

  const exactSubcategoryMatches = reviews.filter(
    (review) =>
      review.category === uiCategory.dbKey &&
      uiCategory.subcategory &&
      String(review.subcategory || '').toLowerCase() === uiCategory.subcategory.toLowerCase()
  );

  const categoryMatches = reviews.filter((review) => review.category === uiCategory.dbKey);
  const source = exactSubcategoryMatches.length > 0 ? exactSubcategoryMatches : categoryMatches;

  if (source.length === 0) {
    return {
      score: 0,
      countLabel: '0 reviews',
      count: 0,
      isFallback: false,
    };
  }

  return {
    score: calculateCountryScore(source),
    countLabel: `${source.length} review${source.length === 1 ? '' : 's'}`,
    count: source.length,
    isFallback: false,
  };
}

function buildStatusBreakdown(reviews) {
  const total = reviews.length;
  if (!total) {
    return [
      ['Residents', 55, 'bg-blue-500'],
      ['Expats', 25, 'bg-purple-500'],
      ['Students', 10, 'bg-pink-500'],
      ['Former Residents', 5, 'bg-orange-500'],
      ['Travelers', 5, 'bg-cyan-500'],
    ];
  }

  const rows = [
    ['Residents', reviews.filter((r) => r.status === 'current_resident').length, 'bg-blue-500'],
    ['Former Residents', reviews.filter((r) => r.status === 'former_resident').length, 'bg-orange-500'],
    ['Travelers', reviews.filter((r) => r.status === 'visited').length, 'bg-cyan-500'],
    ['Outside Opinion', reviews.filter((r) => r.status === 'never_been').length, 'bg-purple-500'],
  ];

  return rows.map(([label, count, color]) => [
    label,
    Math.round((count / total) * 100),
    color,
  ]);
}

function buildReviewCards(reviews, fallbackCountry) {
  if (!Array.isArray(reviews) || reviews.length === 0) return FALLBACK_REVIEWS;

  const groups = new Map();

  reviews.forEach((review) => {
    const timeBucket = review.created_at ? review.created_at.slice(0, 16) : 'no-date';
    const key = [
      review.display_name || 'Anonymous',
      review.title || 'Review',
      review.comment || '',
      timeBucket,
    ].join('|');

    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        displayName: review.display_name || 'Anonymous',
        location: review.country || fallbackCountry,
        status: review.status,
        date: shortDate(review.created_at),
        title: review.title || 'Country review',
        comment: review.comment || '',
        rawReviews: [],
        categoryScores: {},
        pros: ['Helpful perspective'],
        cons: ['Individual experience'],
        helpfulYes: 0,
        helpfulNo: 0,
      });
    }

    const group = groups.get(key);
    group.rawReviews.push(review);
    group.categoryScores[review.subcategory || readableCategory(review.category)] = Number(review.score || 0);
  });

  return Array.from(groups.values()).map((group) => ({
    ...group,
    overallScore: calculateCountryScore(group.rawReviews),
  }));
}

export default function CountryDetailPage() {
  const { countryName } = useParams();
  const navigate = useNavigate();

  const decodedCountry = safeDecode(countryName) || 'Japan';

  const {
    country: countryRow,
    loading: countryLoading,
    error: countryError,
  } = useCountry(decodedCountry);

  const {
    country: aggregate,
    loading: aggregateLoading,
    error: aggregateError,
  } = useCountryAggregate(decodedCountry);

  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    refetch,
  } = useCountryReviews(decodedCountry);

  const [activeTab, setActiveTab] = useState('overview');
  const [filterReviewers, setFilterReviewers] = useState('all');
  const [filterRatings, setFilterRatings] = useState('all');
  const [filterCategories, setFilterCategories] = useState('all');
  const [searchReviews, setSearchReviews] = useState('');

  const loading = countryLoading || aggregateLoading || reviewsLoading;
  const fatalError = countryError || aggregateError || reviewsError;

  const country = useMemo(
    () => buildCountryDisplay(decodedCountry, countryRow, aggregate, reviews),
    [decodedCountry, countryRow, aggregate, reviews]
  );

  const categoryCards = useMemo(
    () =>
      UI_CATEGORY_CARDS.map((cat) => {
        const stats = getCategoryStats(cat, reviews, cat.fallbackScore, cat.fallbackReviews);
        return { ...cat, ...stats };
      }),
    [reviews]
  );

  const reviewCards = useMemo(
    () => buildReviewCards(reviews, decodedCountry),
    [reviews, decodedCountry]
  );

  const filteredReviewCards = useMemo(() => {
    const q = searchReviews.trim().toLowerCase();

    return reviewCards.filter((review) => {
      const matchesSearch =
        !q ||
        review.title.toLowerCase().includes(q) ||
        review.comment.toLowerCase().includes(q) ||
        review.displayName.toLowerCase().includes(q);

      const matchesReviewer =
        filterReviewers === 'all' ||
        (filterReviewers === 'residents' && review.status === 'current_resident') ||
        (filterReviewers === 'expats' && review.status === 'former_resident');

      const matchesRating =
        filterRatings === 'all' ||
        (filterRatings === '5' && review.overallScore >= 9) ||
        (filterRatings === '4' && review.overallScore >= 8);

      const matchesCategory =
        filterCategories === 'all' ||
        Object.keys(review.categoryScores).some((key) =>
          key.toLowerCase().includes(filterCategories.toLowerCase())
        );

      return matchesSearch && matchesReviewer && matchesRating && matchesCategory;
    });
  }, [reviewCards, searchReviews, filterReviewers, filterRatings, filterCategories]);

  const reviewerBreakdown = useMemo(
    () => buildStatusBreakdown(reviews || []),
    [reviews]
  );

  const handleWriteReview = () => {
    navigate(`/submit-review?country=${encodeURIComponent(country.name)}`);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <LoadingSpinner size="lg" label={`Loading ${decodedCountry}...`} />
      </div>
    );
  }

  if (fatalError && !countryRow && (!reviews || reviews.length === 0)) {
    return (
      <div className="min-h-[70vh] max-w-2xl mx-auto px-4 py-16">
        <ErrorMessage
          title="Could not load country data"
          message={fatalError.message || 'CountryScore could not connect to Supabase.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <ChevronRight size={16} className="text-slate-400" />
            <span className="text-slate-600">{country.region || 'Countries'}</span>
            <ChevronRight size={16} className="text-slate-400" />
            <span className="text-slate-900 font-medium">{country.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 sm:h-[430px] overflow-hidden">
        <img
          src={country.image}
          alt={country.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-transparent" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end justify-between w-full">
            <div className="text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{country.flag}</div>
                <h1 className="text-5xl sm:text-6xl font-bold">{country.name}</h1>
              </div>
              <p className="text-white/90 max-w-md text-sm sm:text-base leading-relaxed">
                {country.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <button
                onClick={handleWriteReview}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write a review
              </button>
              <button className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-semibold py-2 px-4 rounded-lg border border-slate-200 transition">
                <BookmarkIcon size={18} />
                Save country
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-4 sm:left-8 bg-white/95 backdrop-blur rounded-lg p-4 shadow-lg max-w-xs">
          <p className="text-xs text-slate-600 mb-2">Overall CountryScore</p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-bold text-slate-900">
              {Number(country.overallScore || 0).toFixed(1)}
            </span>
            <span className="text-slate-600">/10</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <StarRating score={country.overallScore} />
            <span className="text-sm text-slate-600">
              {formatNumber(country.reviewCount)} reviews
            </span>
          </div>
          <div className="border-t border-slate-200 pt-3">
            <div className="text-xs text-slate-600 mb-2">
              <div className="flex justify-between mb-1">
                <span>{country.ranking.region}</span>
                <span>{country.ranking.world}</span>
              </div>
              <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${Math.min(100, (country.overallScore / 10) * 100)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
              <TrendingUp size={16} />
              ↑ {country.trendPercent} from last month
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="border-b border-slate-200 bg-white sticky top-[80px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {['overview', 'reviews', 'insights', 'compare', 'photos', 'guides'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 font-medium text-sm whitespace-nowrap border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section className="mb-12">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                  Category Ratings
                  <button className="p-1 hover:bg-slate-100 rounded-full">
                    <AlertCircle size={20} className="text-slate-400" />
                  </button>
                </h2>
                <p className="text-slate-600 text-sm">
                  Scores are based on reviews from residents, expats, and long-term travelers.
                </p>
              </div>
              <a href="#scores" className="text-blue-600 hover:underline text-sm font-medium whitespace-nowrap">
                How are scores calculated?
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryCards.map((cat) => (
                <div key={cat.key} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-2">{cat.label}</h3>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-slate-900">
                      {Number(cat.score || 0).toFixed(1)}
                    </span>
                    <span className="text-slate-600 text-sm">/10</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{cat.countLabel}</p>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${Math.min(100, (Number(cat.score || 0) / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Key Insights</h3>
              <div className="space-y-3">
                {(country.hasRealReviews
                  ? [
                      `${country.name} has ${reviews.length} approved review${reviews.length === 1 ? '' : 's'} contributing to its score.`,
                      `The strongest category is ${
                        categoryCards.filter((c) => c.count > 0).sort((a, b) => b.score - a.score)[0]?.label || 'still emerging'
                      }.`,
                      `Scores are weighted by reviewer status, so current residents have the strongest influence.`,
                      `More reviews will make these insights sharper over time.`,
                    ]
                  : [
                      'Residents love the clean environment, safety, and efficient public transport.',
                      'High cost of living and long working hours are common concerns.',
                      'Expats find it trustworthy and convenient, but report difficulty making close friends.',
                      'Students appreciate the quality of education but mention high academic pressure.',
                    ]
                ).map((text, index) => (
                  <div key={text} className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
                      {['💡', '⚠️', '👥', '🎓'][index] || '•'}
                    </div>
                    <p className="text-sm text-slate-700">{text}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className="text-blue-600 hover:underline text-sm font-medium mt-4 inline-block"
              >
                See all insights →
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Who's Reviewing?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Based on {formatNumber(country.reviewCount)} reviews
              </p>

              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="103.67 418.08" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="52.4 418.08" strokeDashoffset="-103.67" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="20" strokeDasharray="20.96 418.08" strokeDashoffset="-156.07" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="20" strokeDasharray="20.96 418.08" strokeDashoffset="-177.03" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#06b6d4" strokeWidth="20" strokeDasharray="20.96 418.08" strokeDashoffset="-197.99" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full w-20 h-20" />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {reviewerBreakdown.map(([label, percent, color]) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="text-slate-700">{label} — {percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                {[
                  ['Region', country.region, <MapPin size={16} />],
                  ['Capital', country.capital, <Users size={16} />],
                  ['Population', country.population, null],
                  ['Language', country.language, null],
                  ['Currency', country.currency, null],
                  ['Time Zone', country.timeZone, null],
                ].map(([label, value, icon]) => (
                  <div key={label} className="flex justify-between gap-4 pb-3 border-b border-slate-200 last:border-b-0 last:pb-0">
                    <span className="flex items-center gap-2 text-slate-600 text-sm">
                      {icon}
                      {label}
                    </span>
                    <span className="font-semibold text-slate-900 text-right">{value || '—'}</span>
                  </div>
                ))}
              </div>
              {country.wikipediaUrl && country.wikipediaUrl !== '#' && (
                <a
                  href={country.wikipediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-sm font-medium mt-4 inline-block"
                >
                  Learn more on Wikipedia →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Reviews ({formatNumber(country.reviewCount)})
                </h2>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterReviewers}
                    onChange={(e) => setFilterReviewers(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Reviewers</option>
                    <option value="residents">Residents</option>
                    <option value="expats">Former Residents</option>
                  </select>

                  <select
                    value={filterRatings}
                    onChange={(e) => setFilterRatings(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 stars</option>
                    <option value="4">4+ stars</option>
                  </select>

                  <select
                    value={filterCategories}
                    onChange={(e) => setFilterCategories(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Safety">Safety</option>
                    <option value="Cost">Cost of Living</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Transport">Public Transport</option>
                  </select>

                  <div className="flex-1 flex items-center border border-slate-300 rounded-lg px-3 bg-white min-w-0">
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search reviews..."
                      value={searchReviews}
                      onChange={(e) => setSearchReviews(e.target.value)}
                      className="flex-1 px-3 py-2 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {filteredReviewCards.map((review) => (
                  <div key={review.id} className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {review.displayName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900">{review.displayName}</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {statusLabel(review.status)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {review.location} • Reviewed {review.date}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{review.title}</h3>
                    <p className="text-slate-700 mb-4 text-sm leading-relaxed">{review.comment}</p>

                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <p className="text-xs font-semibold text-slate-600 mb-3">BREAKDOWN</p>
                      <div className="space-y-2">
                        {Object.entries(review.categoryScores).slice(0, 5).map(([cat, score]) => (
                          <div key={cat} className="flex justify-between text-xs">
                            <span className="text-slate-600">{cat}</span>
                            <span className="font-semibold text-slate-900">{Number(score || 0).toFixed(1)}</span>
                          </div>
                        ))}
                        <div className="border-t border-slate-200 pt-2 flex justify-between">
                          <span className="font-semibold text-slate-900">Overall</span>
                          <span className="font-semibold text-slate-900 text-base">
                            {Number(review.overallScore || 0).toFixed(1)} /10
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-emerald-700 mb-2">PROS</p>
                        <div className="flex flex-wrap gap-1">
                          {review.pros.map((pro) => (
                            <span key={pro} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              {pro}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-red-700 mb-2">CONS</p>
                        <div className="flex flex-wrap gap-1">
                          {review.cons.map((con) => (
                            <span key={con} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              {con}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <span className="text-xs text-slate-600">Was this review helpful?</span>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 transition">
                          👍 Yes ({review.helpfulYes})
                        </button>
                        <button className="flex items-center gap-1 text-xs text-slate-600 hover:text-red-600 transition">
                          👎 No ({review.helpfulNo})
                        </button>
                        <button className="text-xs text-slate-600 hover:text-red-600 transition">Report</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Trending Topics</h3>
                  <a href="#topics" className="text-blue-600 hover:underline text-sm font-medium">See all</a>
                </div>
                <div className="space-y-3">
                  {TRENDING_TOPICS.map((item) => (
                    <div key={item.topic} className="pb-3 border-b border-slate-200 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-700">{item.topic}</span>
                        <span className={`text-sm font-semibold ${item.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                        </span>
                      </div>
                      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-slate-300 to-slate-400" style={{ width: '70%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Photos from the community</h3>
                  <a href="#photos" className="text-blue-600 hover:underline text-sm font-medium">See all</a>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {COMMUNITY_PHOTOS.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt="Community"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {['insights', 'compare', 'photos', 'guides'].includes(activeTab) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-slate-600 font-medium">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
