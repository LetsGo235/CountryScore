import React from 'react';

/**
 * CategoriesPage Placeholder
 * 
 * Future implementation (Commit 8):
 * - List all 8 categories (Cost of Living, Safety, Jobs, etc.)
 * - For each category:
 *   - Overall score
 *   - Top 5 countries by weighted score
 *   - Total review count
 * - Links to individual category detail pages (future)
 * 
 * Data hooks to use:
 * - useCategorySummary() for category rankings
 * - DEFAULT_CATEGORIES from constants
 * - aggregateCountries() filtered by category
 */
function CategoriesPage() {
  return (
    <div className="min-h-screen bg-page-bg">
      {/* Page Header */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-semibold text-navy-500 mb-2">
            Categories
          </h1>
          <p className="text-gray-600">
            See which countries rank best by each category across all reviews.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold text-navy-500 mb-2">
                Category {i + 1}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Placeholder for category rankings
              </p>
              <div className="text-gray-500 text-sm">
                Top 5 countries will appear here
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
