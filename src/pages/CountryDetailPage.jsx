import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * CountryDetailPage Placeholder
 * 
 * URL params:
 * - :countryName (e.g., /country/Netherlands)
 * 
 * Future implementation (Commit 6):
 * - Country name + overall score + star rating
 * - Score breakdown by reviewer status (residents/former/visitors/outside)
 * - Category panels with subcategory breakdown
 * - Recent reviews list
 * - Write review CTA button
 * 
 * Data hooks to use:
 * - useCountryAggregate(countryName) for aggregated data
 * - useCountryReviews(countryName) for recent reviews
 * - calculateStatusBreakdown() for status scores
 */
function CountryDetailPage() {
  const { countryName } = useParams();

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Country Header */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-semibold text-navy-500 mb-2">
            {countryName || 'Country Detail'}
          </h1>
          <p className="text-gray-600">
            Detailed reviews, scores, and insights for {countryName}
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border border-border p-8 text-center">
          <h2 className="text-2xl font-semibold text-navy-500 mb-2">
            CountryDetailPage
          </h2>
          <p className="text-gray-600 mb-2">
            Showing details for: <strong>{countryName}</strong>
          </p>
          <p className="text-gray-500 mb-6">
            This is a placeholder. Actual content will be built in Commit 6.
          </p>
          <div className="text-sm text-gray-500">
            Features coming: Overall score, status breakdown, categories, reviews, write review button
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryDetailPage;
