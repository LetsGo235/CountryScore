import React from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * SubmitReviewPage Placeholder
 * 
 * URL params (optional):
 * - ?country=Netherlands (pre-fill country)
 * - ?category=safety (pre-fill category)
 * 
 * Future implementation (Commit 7):
 * - Country input with datalist
 * - Status selector (lives there/used to live/visited/outside opinion)
 * - Category selector with dynamic subcategories
 * - Score slider (1-10, 0.5 steps) with star preview
 * - Title input (min 6 chars, max 80 chars)
 * - Comment textarea (min 40 chars, max 700 chars)
 * - Real words validation
 * - 10-minute cooldown per country+category
 * - Supabase submit with local fallback
 * 
 * Data hooks to use:
 * - useCountries() for country datalist
 * - DEFAULT_CATEGORIES from constants
 * - Form state management with useState
 */
function SubmitReviewPage() {
  const [searchParams] = useSearchParams();
  const prefilledCountry = searchParams.get('country');
  const prefilledCategory = searchParams.get('category');

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Page Header */}
      <section className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-semibold text-navy-500 mb-2">
            Write a Country Review
          </h1>
          <p className="text-gray-600">
            Share your experience living in, visiting, or learning about a country.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border border-border p-8">
          <h2 className="text-2xl font-semibold text-navy-500 mb-2">
            SubmitReviewPage
          </h2>
          <p className="text-gray-600 mb-2">
            Review form placeholder
          </p>
          {prefilledCountry && (
            <p className="text-gray-500 mb-2">
              Pre-filled country: <strong>{prefilledCountry}</strong>
            </p>
          )}
          {prefilledCategory && (
            <p className="text-gray-500 mb-4">
              Pre-filled category: <strong>{prefilledCategory}</strong>
            </p>
          )}
          <p className="text-gray-500">
            This is a placeholder. Actual content will be built in Commit 7.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <p className="font-semibold mb-2">Features coming:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Country input with autocomplete</li>
              <li>Status selector (resident/former/visited/outside)</li>
              <li>Category selector with subcategories</li>
              <li>Score slider (1-10) with star preview</li>
              <li>Title &amp; comment inputs with validation</li>
              <li>Real words check</li>
              <li>10-minute cooldown per country+category</li>
              <li>Supabase submit with local fallback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitReviewPage;
