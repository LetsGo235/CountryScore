import React from 'react';

/**
 * AdminDashboard Placeholder
 * 
 * Future implementation (Commit 10):
 * - Stats cards: pending reviews count, total reviews, total countries
 * - Table of pending reviews with:
 *   - Country, category, score, title, comment
 *   - Reviewer status, display name
 *   - Approve / Reject buttons
 * - Supabase update: set approved=true or delete
 * 
 * Security note:
 * - Phase 3: Add authentication check to protect this route
 * - For now: No protection (assumes admin access is secured at deployment level)
 * 
 * Data hooks to use:
 * - Custom hook to fetch pending reviews (not approved)
 * - useCountriesAggregate() for stats
 * - Supabase admin operations for approve/reject
 */
function AdminDashboard() {
  return (
    <div className="min-h-screen bg-page-bg">
      {/* Page Header */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-semibold text-navy-500 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Review and moderate pending submissions.
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-1">
              Pending Reviews
            </h3>
            <p className="text-3xl font-bold text-navy-500">—</p>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-1">
              Total Reviews
            </h3>
            <p className="text-3xl font-bold text-navy-500">—</p>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-1">
              Total Countries
            </h3>
            <p className="text-3xl font-bold text-navy-500">—</p>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-navy-500 mb-4">
            Pending Reviews
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Reviews waiting for approval or rejection
          </p>
          <div className="text-gray-500 text-sm text-center py-8">
            Placeholder for pending reviews table
          </div>
          <div className="text-gray-500 text-sm">
            <p className="font-semibold mb-2">Features coming:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Country, category, score display</li>
              <li>Title and comment preview</li>
              <li>Reviewer status and name</li>
              <li>Approve / Reject / Delete buttons</li>
              <li>Bulk actions</li>
              <li>Real-time pending count</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
