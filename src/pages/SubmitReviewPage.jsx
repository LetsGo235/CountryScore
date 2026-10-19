import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ChevronRight,
  Upload,
} from 'lucide-react';

import { supabase } from '../utils/supabase';
import { useCountries } from '../hooks/useCountries';
import { REVIEW_COOLDOWN_MS } from '../utils/constants';

const FALLBACK_COUNTRIES = [
  { name: 'Japan', flag_emoji: '🇯🇵', region: 'Asia' },
  { name: 'Canada', flag_emoji: '🇨🇦', region: 'North America' },
  { name: 'Netherlands', flag_emoji: '🇳🇱', region: 'Europe' },
  { name: 'Singapore', flag_emoji: '🇸🇬', region: 'Asia' },
  { name: 'Portugal', flag_emoji: '🇵🇹', region: 'Europe' },
  { name: 'Germany', flag_emoji: '🇩🇪', region: 'Europe' },
  { name: 'United States', flag_emoji: '🇺🇸', region: 'North America' },
  { name: 'United Kingdom', flag_emoji: '🇬🇧', region: 'Europe' },
  { name: 'Australia', flag_emoji: '🇦🇺', region: 'Oceania' },
  { name: 'New Zealand', flag_emoji: '🇳🇿', region: 'Oceania' },
  { name: 'France', flag_emoji: '🇫🇷', region: 'Europe' },
  { name: 'Spain', flag_emoji: '🇪🇸', region: 'Europe' },
  { name: 'South Korea', flag_emoji: '🇰🇷', region: 'Asia' },
  { name: 'Thailand', flag_emoji: '🇹🇭', region: 'Asia' },
  { name: 'Mexico', flag_emoji: '🇲🇽', region: 'North America' },
];

const CONNECTION_TYPES = [
  {
    id: 'current_resident',
    status: 'current_resident',
    label: 'Resident',
    subtext: 'I live here',
    icon: '🏠',
  },
  {
    id: 'expat',
    status: 'current_resident',
    label: 'Expat',
    subtext: 'I live here temporarily',
    icon: '🌍',
  },
  {
    id: 'student',
    status: 'current_resident',
    label: 'Student',
    subtext: 'I study here',
    icon: '🎓',
  },
  {
    id: 'visited',
    status: 'visited',
    label: 'Traveler',
    subtext: 'I visited',
    icon: '✈️',
  },
  {
    id: 'former_resident',
    status: 'former_resident',
    label: 'Former Resident',
    subtext: 'I used to live here',
    icon: '📌',
  },
];

const UI_CATEGORIES = [
  { uiKey: 'safety', dbKey: 'safety', subcategory: 'General', label: 'Safety', icon: '🛡️', defaultScore: 4 },
  { uiKey: 'costOfLiving', dbKey: 'costOfLiving', subcategory: 'General', label: 'Cost of Living', icon: '💰', defaultScore: 2 },
  { uiKey: 'healthcare', dbKey: 'healthcare', subcategory: 'General', label: 'Healthcare', icon: '❤️', defaultScore: 4 },
  { uiKey: 'publicTransport', dbKey: 'infrastructure', subcategory: 'Public Transport', label: 'Public Transport', icon: '🚆', defaultScore: 5 },
  { uiKey: 'workLifeBalance', dbKey: 'lifestyle', subcategory: 'Work-Life Balance', label: 'Work-Life Balance', icon: '👥', defaultScore: 4 },
  { uiKey: 'education', dbKey: 'education', subcategory: 'General', label: 'Education', icon: '🎓', defaultScore: 4 },
  { uiKey: 'internetQuality', dbKey: 'infrastructure', subcategory: 'Internet Quality', label: 'Internet Quality', icon: '📡', defaultScore: 4 },
  { uiKey: 'friendliness', dbKey: 'lifestyle', subcategory: 'Friendliness', label: 'Friendliness', icon: '😊', defaultScore: 4 },
  { uiKey: 'cleanliness', dbKey: 'lifestyle', subcategory: 'Cleanliness', label: 'Cleanliness', icon: '✨', defaultScore: 4 },
  { uiKey: 'opportunities', dbKey: 'jobs', subcategory: 'Opportunities', label: 'Opportunities', icon: '💼', defaultScore: 3 },
];

const DURATION_OPTIONS = [
  'Less than 3 months',
  '3-6 months',
  '6-12 months',
  '1-2 years',
  '2-5 years',
  '5+ years',
];

const AGE_RANGES = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'];

const TIME_PERIODS = ['Spring', 'Summer', 'Fall', 'Winter', 'Year-round'];

const makeInitialRatings = () =>
  UI_CATEGORIES.reduce((acc, cat) => {
    acc[cat.uiKey] = cat.defaultScore;
    return acc;
  }, {});

const normalizeText = (value) => String(value || '').trim();

const getCountryName = (country) =>
  typeof country === 'string' ? country : country?.name || '';

const getCountryFlag = (country) =>
  typeof country === 'string' ? '🌍' : country?.flag_emoji || '🌍';

const buildComment = ({ reviewText, reviewPros, reviewCons, duration, ageRange, timePeriod }) => {
  const parts = [normalizeText(reviewText)];

  if (normalizeText(reviewPros)) {
    parts.push(`\n\nPros:\n${normalizeText(reviewPros)}`);
  }

  if (normalizeText(reviewCons)) {
    parts.push(`\n\nCons:\n${normalizeText(reviewCons)}`);
  }

  const details = [
    duration ? `Duration: ${duration}` : null,
    ageRange ? `Age range: ${ageRange}` : null,
    timePeriod ? `Time period: ${timePeriod}` : null,
  ].filter(Boolean);

  if (details.length > 0) {
    parts.push(`\n\nAdditional details:\n${details.join('\n')}`);
  }

  return parts.join('');
};

export default function SubmitReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { countries: supabaseCountries, loading: countriesLoading } = useCountries();

  const countryOptions = useMemo(() => {
    const liveCountries = Array.isArray(supabaseCountries) && supabaseCountries.length > 0
      ? supabaseCountries
      : FALLBACK_COUNTRIES;

    return [...liveCountries].sort((a, b) =>
      getCountryName(a).localeCompare(getCountryName(b))
    );
  }, [supabaseCountries]);

  const initialCountryFromUrl = searchParams.get('country') || 'Japan';

  const [selectedCountry, setSelectedCountry] = useState(initialCountryFromUrl);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [connectionType, setConnectionType] = useState('current_resident');
  const [categoryRatings, setCategoryRatings] = useState(makeInitialRatings);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewPros, setReviewPros] = useState('');
  const [reviewCons, setReviewCons] = useState('');
  const [duration, setDuration] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [displayPublicly, setDisplayPublicly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const selectedCountryRow = useMemo(() => {
    return countryOptions.find((country) => getCountryName(country) === selectedCountry) || {
      name: selectedCountry,
      flag_emoji: '🌍',
    };
  }, [countryOptions, selectedCountry]);

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();

    if (!q) return countryOptions;

    return countryOptions.filter((country) => {
      const countryName = getCountryName(country).toLowerCase();
      const code = typeof country === 'string' ? '' : String(country?.code || '').toLowerCase();
      const region = typeof country === 'string' ? '' : String(country?.region || '').toLowerCase();

      return countryName.includes(q) || code.includes(q) || region.includes(q);
    });
  }, [countryOptions, countrySearch]);

  const currentConnection = CONNECTION_TYPES.find((type) => type.id === connectionType) || CONNECTION_TYPES[0];

  const handleSelectCountry = (country) => {
    setSelectedCountry(getCountryName(country));
    setCountrySearch('');
    setShowCountryDropdown(false);
  };

  const handleCategoryRating = (categoryKey, stars) => {
    setCategoryRatings((prev) => ({
      ...prev,
      [categoryKey]: stars,
    }));
  };

  const validateForm = () => {
    const title = normalizeText(reviewTitle);
    const comment = normalizeText(reviewText);

    if (!selectedCountry) return 'Please select a country.';
    if (!connectionType) return 'Please select your connection type.';
    if (title.length < 6) return 'Review title must be at least 6 characters.';
    if (title.length > 100) return 'Review title must be 100 characters or fewer.';
    if (comment.length < 40) return 'Review text must be at least 40 characters.';
    if (comment.length > 2000) return 'Review text must be 2000 characters or fewer.';

    const hasRating = UI_CATEGORIES.some((cat) => Number(categoryRatings[cat.uiKey] || 0) > 0);
    if (!hasRating) return 'Please rate at least one category.';

    return null;
  };

  const getCooldownMessage = () => {
    const cooldownKey = `review_cooldown_${selectedCountry}`;
    const lastSubmittedAt = Number(localStorage.getItem(cooldownKey) || 0);

    if (!lastSubmittedAt) return null;

    const elapsed = Date.now() - lastSubmittedAt;
    if (elapsed >= REVIEW_COOLDOWN_MS) return null;

    const remainingMinutes = Math.ceil((REVIEW_COOLDOWN_MS - elapsed) / 60000);
    return `Please wait ${remainingMinutes} more minute${remainingMinutes === 1 ? '' : 's'} before submitting another review for ${selectedCountry}.`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      setSubmitMessage('');
      return;
    }

    const cooldownError = getCooldownMessage();
    if (cooldownError) {
      setSubmitError(cooldownError);
      setSubmitMessage('');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitMessage('');

    const comment = buildComment({
      reviewText,
      reviewPros,
      reviewCons,
      duration,
      ageRange,
      timePeriod,
    });

    const rows = UI_CATEGORIES
      .filter((cat) => Number(categoryRatings[cat.uiKey] || 0) > 0)
      .map((cat) => ({
        country: selectedCountry,
        status: currentConnection.status,
        category: cat.dbKey,
        subcategory: cat.subcategory || cat.label,
        score: Number(categoryRatings[cat.uiKey]) * 2,
        title: normalizeText(reviewTitle),
        comment,
        display_name: 'Anonymous',
        approved: false,
      }));

    try {
      const { error } = await supabase.from('reviews').insert(rows);

      if (error) {
        throw new Error(error.message);
      }

      localStorage.setItem(`review_cooldown_${selectedCountry}`, Date.now().toString());

      setSubmitMessage(
        'Review submitted! Thanks for sharing your experience. Your review will be moderated before it goes live.'
      );

      setReviewTitle('');
      setReviewText('');
      setReviewPros('');
      setReviewCons('');
      setDuration('');
      setAgeRange('');
      setTimePeriod('');
      setDisplayPublicly(false);
      setCategoryRatings(makeInitialRatings());
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
            <ChevronRight size={16} className="text-slate-400" />
            <span className="text-slate-900 font-medium">Submit Review</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Submit a Review</h1>
              <p className="text-slate-600">
                Share your experience and help others understand what life is really like in this country.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Select a Country */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm">1</div>
                  <h2 className="text-lg font-bold text-slate-900">Select a Country</h2>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-white">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder={countriesLoading ? 'Loading countries...' : 'Search for a country...'}
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setShowCountryDropdown(true);
                      }}
                      onFocus={() => setShowCountryDropdown(true)}
                      className="flex-1 outline-none text-sm text-slate-900 placeholder-slate-500 bg-white"
                    />
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>

                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 border border-slate-200 rounded-lg bg-white shadow-lg z-20 max-h-56 overflow-y-auto">
                      {filteredCountries.map((country) => (
                        <button
                          key={getCountryName(country)}
                          type="button"
                          onClick={() => handleSelectCountry(country)}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0 text-sm text-slate-900 flex items-center gap-2"
                        >
                          <span>{getCountryFlag(country)}</span>
                          <span>{getCountryName(country)}</span>
                          {typeof country !== 'string' && country.region && (
                            <span className="ml-auto text-xs text-slate-500">{country.region}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedCountry && (
                  <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg w-fit">
                    <span className="text-2xl">{selectedCountryRow?.flag_emoji || '🌍'}</span>
                    <span className="text-sm font-medium text-slate-900">{selectedCountry}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCountry('')}
                      className="ml-2 text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Section 2: Connection Type */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm">2</div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">What is your connection to this country?</h2>
                    <p className="text-xs text-slate-600 mt-1">This helps others understand your perspective.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CONNECTION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setConnectionType(type.id)}
                      className={`p-4 rounded-lg border-2 transition ${
                        connectionType === type.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <p className="text-sm font-semibold text-slate-900">{type.label}</p>
                      <p className="text-xs text-slate-600 mt-1">{type.subtext}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 3: Rate Your Experience */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm">3</div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Rate Your Experience</h2>
                    <p className="text-xs text-slate-600 mt-1">How would you rate this country in the following categories?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {UI_CATEGORIES.map((cat) => (
                    <div key={cat.uiKey} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-sm font-medium text-slate-900">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleCategoryRating(cat.uiKey, star)}
                              className={`transition ${
                                Number(categoryRatings[cat.uiKey] || 0) >= star
                                  ? 'text-amber-400 text-lg'
                                  : 'text-slate-300 text-lg hover:text-amber-200'
                              }`}
                              aria-label={`${cat.label}: ${star} stars`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <span className="text-xs text-slate-600 w-16 text-right">
                          {Number(categoryRatings[cat.uiKey] || 0) <= 1
                            ? 'Poor'
                            : Number(categoryRatings[cat.uiKey] || 0) >= 5
                              ? 'Excellent'
                              : `${categoryRatings[cat.uiKey]}/5`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Write Your Review */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm">4</div>
                  <h2 className="text-lg font-bold text-slate-900">Write Your Review</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Review title</label>
                    <div className="flex items-end gap-2">
                      <input
                        type="text"
                        placeholder="Give your review a short title"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value.slice(0, 100))}
                        maxLength={100}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <span className="text-xs text-slate-600 whitespace-nowrap">{reviewTitle.length} / 100</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Your review</label>
                    <div className="flex flex-col">
                      <textarea
                        placeholder="Share your experience, both the good and the bad. What do you like? What could be better? Any tips for others?"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value.slice(0, 2000))}
                        maxLength={2000}
                        rows={5}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-vertical"
                      />
                      <div className="text-right mt-2 text-xs text-slate-600">
                        {reviewText.length} / 2000
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">Pros (optional)</label>
                      <textarea
                        placeholder="What are the best things about living/visiting here?"
                        value={reviewPros}
                        onChange={(e) => setReviewPros(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-vertical"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">Cons (optional)</label>
                      <textarea
                        placeholder="What are the main downsides?"
                        value={reviewCons}
                        onChange={(e) => setReviewCons(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-vertical"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">Add photos (optional)</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50 cursor-not-allowed opacity-50">
                      <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600 mb-1">Photo uploads are coming in Phase 3</p>
                      <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Additional Details */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-sm">5</div>
                  <h2 className="text-lg font-bold text-slate-900">Additional Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">How long have you been here?</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value="">Select duration</option>
                      {DURATION_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Age range</label>
                    <select
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value="">Select age range</option>
                      {AGE_RANGES.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Time of year visited/lived</label>
                    <select
                      value={timePeriod}
                      onChange={(e) => setTimePeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value="">Select time period</option>
                      {TIME_PERIODS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="displayPublic"
                    checked={displayPublicly}
                    onChange={(e) => setDisplayPublicly(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="displayPublic" className="text-sm text-slate-700">
                    You can display my review publicly
                  </label>
                </div>
              </div>

              {submitError && (
                <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              {submitMessage && (
                <div className="flex gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="text-lg">✓</div>
                  <p className="text-sm text-emerald-700">{submitMessage}</p>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Your review will be moderated before it goes live.
              </p>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200 rounded-xl p-8 flex items-center justify-center relative h-64">
              <div className="text-center relative z-10">
                <div className="text-6xl mb-2">🌍</div>
                <div className="absolute top-4 right-4 text-lg">⭐</div>
                <div className="absolute top-12 left-4 text-lg">❤️</div>
                <div className="absolute bottom-8 right-8 text-lg">💬</div>
              </div>
              <div className="absolute inset-0 rounded-xl border-2 border-dashed border-blue-200 opacity-40" />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">🛡️</div>
                <h3 className="font-bold text-slate-900">Your opinion matters</h3>
              </div>
              <div className="text-sm text-slate-700 space-y-2">
                {[
                  'Real experiences from people like you help others.',
                  'Build a more accurate picture of countries.',
                  'Be honest and respectful.',
                  'Reviews are moderated for quality.',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>💡</span> Review tips
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="flex-shrink-0">→</span>
                  <span><strong>Be specific</strong> — Share examples and details about your experience.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0">→</span>
                  <span><strong>Keep it helpful</strong> — Think about what others would want to know.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0">→</span>
                  <span><strong>Stay respectful</strong> — Different experiences are okay! Let&apos;s keep it friendly.</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>⏱️</span> What happens next?
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">1. Review submitted</p>
                  <p className="text-xs text-slate-600">We&apos;ll review your submission.</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">2. Under moderation</p>
                  <p className="text-xs text-slate-600">Our team checks for quality and safety.</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">3. Goes live</p>
                  <p className="text-xs text-slate-600">Your review is published and helps others!</p>
                </div>
              </div>
              <p className="text-xs text-amber-700 mt-4">This usually takes less than 24 hours. 🎉</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              ['👥', 'Real people', 'Reviews come from real users with real experiences.'],
              ['🛡️', 'Safe & respectful', 'We moderate every review to keep our community safe.'],
              ['🌍', 'Global community', 'Join people sharing insights about countries.'],
              ['⭐', 'Make an impact', 'Your review helps others make better decisions.'],
            ].map(([icon, title, text]) => (
              <div key={title} className="text-center">
                <div className="text-3xl mb-3">{icon}</div>
                <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
                <p className="text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
