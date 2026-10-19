import { useState, useMemo } from 'react';
import { useCountriesAggregate, useSortedCountries } from '../hooks/useReviews';
import { Globe, MessageSquare, Users, TrendingUp, Lock, Shield } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StarRating from '../components/common/StarRating';
import { Link } from 'react-router-dom';

// Demo country data with images
const DEMO_COUNTRIES = [
  {
    country: 'Japan',
    score: 8.9,
    count: 4600,
    image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a9?w=500&h=300&fit=crop',
    tags: ['High safety', 'Great public transport'],
  },
  {
    country: 'Canada',
    score: 8.4,
    count: 5100,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    tags: ['Friendly people', 'High living cost'],
  },
  {
    country: 'Netherlands',
    score: 8.3,
    count: 3200,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=300&fit=crop',
    tags: ['Work-life balance', 'Biking culture'],
  },
  {
    country: 'Singapore',
    score: 8.2,
    count: 2700,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop',
    tags: ['Very safe', 'Expensive'],
  },
  {
    country: 'Portugal',
    score: 8.1,
    count: 2300,
    image: 'https://images.unsplash.com/photo-1509395062169-d4e38aadcaaf?w=500&h=300&fit=crop',
    tags: ['Great weather', 'Relaxed lifestyle'],
  },
];

export default function HomePage() {
  const { data: countriesData, loading, error } = useCountriesAggregate();
  const [searchQuery, setSearchQuery] = useState('');

  // Use real data if available, fallback to demo
  const countries = useMemo(() => {
    if (countriesData && countriesData.length > 0) {
      return countriesData.slice(0, 5).map((c) => ({
        country: c.country,
        score: c.score,
        count: c.count,
        image: DEMO_COUNTRIES.find((d) => d.country === c.country)?.image || DEMO_COUNTRIES[0].image,
        tags: DEMO_COUNTRIES.find((d) => d.country === c.country)?.tags || ['Popular', 'Reviewed'],
      }));
    }
    return DEMO_COUNTRIES;
  }, [countriesData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Scroll to countries section or filter
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Discover what people{' '}
              <span className="text-blue-600 border-b-4 border-blue-600 inline-block">really</span>{' '}
              think about countries.
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md">
              Real reviews and ratings from residents, expats, students, and travelers around the world.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search for a country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition text-base"
                >
                  Explore countries
                </button>
              </div>
            </form>

            {/* Avatar + Text */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-sm">
                Join <span className="font-semibold">25,000+</span> people sharing their experiences
              </p>
            </div>
          </div>

          {/* Right Column - Image with Stat Card */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop"
                alt="Mountain landscape with hiker"
                className="w-full h-auto object-cover rounded-2xl"
              />

              {/* Floating Stat Card */}
              <div className="absolute bottom-6 right-6 bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-xl p-6 text-white max-w-xs border border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
                    <Globe className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Countries</p>
                      <p className="text-2xl font-bold">197</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
                    <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Reviews</p>
                      <p className="text-2xl font-bold">582K+</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Active users</p>
                      <p className="text-2xl font-bold">32K+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Countries Section */}
      <section id="trending" className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Trending Countries</h2>
              </div>
              <p className="text-gray-600">Top countries by overall score this month</p>
            </div>
            <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
              View all countries →
            </a>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" label="Loading countries..." />
          ) : error ? (
            <ErrorMessage title="Error loading countries" message={error.message} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {countries.map((country, idx) => (
                <div
                  key={country.country}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={country.image}
                      alt={country.country}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 bg-blue-600 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">
                        {['🇯🇵', '🇨🇦', '🇳🇱', '🇸🇬', '🇵🇹'][idx] || '🌍'}
                      </span>
                      <h3 className="font-bold text-gray-900">{country.country}</h3>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{country.score.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm">/10</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                        <span>★</span>
                        <span className="text-gray-600 text-xs">
                          {(country.count / 1000).toFixed(1)}K reviews
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {country.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Insights + Compare Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Insights Card */}
          <div id="insights" className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">CountryScore Insights</h3>
              <p className="text-gray-600">Real-time insights from our community</p>
              <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-3 inline-block">
                View all insights →
              </a>
            </div>

            <div className="space-y-4">
              {[
                { icon: '📈', text: 'Housing complaints in Canada rose 22% this month.', badge: '↗ 22%', time: '2h ago' },
                { icon: '🚗', text: 'Japan remains the highest-rated country for public transport.', badge: 'Top rated', time: '5h ago' },
                { icon: '⚖️', text: 'Netherlands ranks highest for work-life balance by residents.', badge: '#1', time: '1d ago' },
                { icon: '💰', text: 'Cost of living concerns are trending in 12 countries this month.', badge: '12 countries', time: '1d ago' },
                { icon: '✈️', text: 'Tourists love Thailand, but residents rate it lower on cost of living.', badge: 'View more', time: '2d ago' },
              ].map((item, idx) => (
                <div key={idx} className="pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 text-sm">{item.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-blue-600 font-semibold text-xs">{item.badge}</span>
                        <span className="text-gray-500 text-xs">{item.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compare Card */}
          <div id="compare" className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Compare Countries</h3>
              <p className="text-gray-600">See how countries stack up</p>
              <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-3 inline-block">
                Compare →
              </a>
            </div>

            {/* Comparison Selectors */}
            <div className="flex items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="flex-1">
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option>🇯🇵 Japan</option>
                </select>
              </div>
              <span className="text-gray-500 font-semibold">vs</span>
              <div className="flex-1">
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option>🇩🇪 Germany</option>
                </select>
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="space-y-6">
              {[
                { icon: '🛡️', label: 'Safety', left: 9.2, right: 8.1 },
                { icon: '💵', label: 'Cost of Living', left: 6.4, right: 7.0 },
                { icon: '⚕️', label: 'Healthcare', left: 8.6, right: 8.0 },
                { icon: '⚖️', label: 'Work-Life Balance', left: 7.8, right: 7.6 },
                { icon: '🚌', label: 'Public Transport', left: 9.6, right: 8.8 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-blue-500 rounded-full flex-1" style={{ maxWidth: `${(item.left / 10) * 100}%` }} />
                        <span className="text-blue-600 font-bold text-sm w-8">{item.left}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-gray-600 font-bold text-sm w-8 text-left">{item.right}</span>
                        <div className="h-2 bg-gray-400 rounded-full flex-1" style={{ maxWidth: `${(item.right / 10) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-8 inline-block">
              View full comparison →
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-12 flex items-center gap-12">
            <div className="w-32 h-32 flex-shrink-0 hidden lg:block">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center text-6xl">
                🌍
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Your experience matters.</h3>
              <p className="text-lg text-gray-600 mb-6">
                Help others by sharing your experience and make CountryScore even better.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition">
                  Log in
                </button>
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
                  Sign up free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Real people. Real opinions.</h4>
            <p className="text-gray-600">
              All reviews come from verified users with real experiences and verified travel history.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <Lock className="w-7 h-7 text-green-600" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Safe & respectful community</h4>
            <p className="text-gray-600">
              Our moderators work 24/7 to keep conversations helpful and respectful for everyone.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <Globe className="w-7 h-7 text-purple-600" />
              </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Global perspective</h4>
            <p className="text-gray-600">
              Reviews from people in every country and all walks of life sharing their insights.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
