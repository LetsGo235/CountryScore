import React from 'react';

/**
 * InsightsPage Placeholder
 * 
 * Future implementation (Commit 9):
 * - Trending countries (most reviewed recently)
 * - Category highlights (highest and lowest rated)
 * - Recent activity feed
 * - Charts with Recharts (trending over time, etc.)
 * 
 * Data hooks to use:
 * - useAllReviews() for recent activity
 * - useCountriesAggregate() for trending
 * - useCategorySummary() for highlights
 */
function InsightsPage() {
  return (
    <div className="min-h-screen bg-page-bg">
      {/* Page Header */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-semibold text-navy-500 mb-2">
            Insights
          </h1>
          <p className="text-gray-600">
            Trending countries, category highlights, and recent activity.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trending */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-navy-500 mb-4">
              Trending Countries
            </h2>
            <p className="text-gray-600 text-sm">
              Most reviewed countries this week
            </p>
            <div className="mt-4 text-gray-500 text-sm">
              Placeholder for trending list
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-navy-500 mb-4">
              Category Highlights
            </h2>
            <p className="text-gray-600 text-sm">
              Highest and lowest rated categories
            </p>
            <div className="mt-4 text-gray-500 text-sm">
              Placeholder for highlights
            </div>
          </div>

          {/* Recent */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-navy-500 mb-4">
              Recent Activity
            </h2>
            <p className="text-gray-600 text-sm">
              Latest reviews added
            </p>
            <div className="mt-4 text-gray-500 text-sm">
              Placeholder for activity feed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsightsPage;
