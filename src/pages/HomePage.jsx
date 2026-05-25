import React from 'react';

/**
 * HomePage Placeholder
 * 
 * Future implementation (Commit 6):
 * - Hero section with tagline
 * - Search bar (country/category/review text)
 * - Sort selector (highest/lowest rated, most reviewed, A-Z)
 * - Country grid cards with scores
 * - Stats (total countries, total reviews)
 * 
 * Data hooks to use:
 * - useCountriesAggregate() for all countries
 * - useSearchReviews() for search
 * - useSortedCountries() for sorting
 */
function HomePage() {
  return (
    <div className="min-h-screen bg-page-bg">
      {/* Hero Section */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-semibold text-navy-500 mb-4">
            CountryScore
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Read structured country reviews from people who live there, used to live there, 
            visited, or are judging from outside. Scores are organized by category instead 
            of random comments.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border border-border p-8 text-center">
          <h2 className="text-2xl font-semibold text-navy-500 mb-2">HomePage</h2>
          <p className="text-gray-600 mb-6">
            This is the homepage placeholder. Actual content will be built in Commit 6.
          </p>
          <div className="text-sm text-gray-500">
            Features coming: Country grid, search bar, sort selector, stats
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
