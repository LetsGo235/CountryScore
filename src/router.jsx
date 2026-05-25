import {
  createBrowserRouter,
  Outlet,
  useRouteError,
} from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import CountryDetailPage from './pages/CountryDetailPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import CategoriesPage from './pages/CategoriesPage';
import InsightsPage from './pages/InsightsPage';
import AdminDashboard from './pages/AdminDashboard';

function RootLayout() {
  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-white border border-border rounded-lg shadow-card p-8 text-center">
          <p className="text-sm font-semibold text-primary-600 mb-2">
            CountryScore
          </p>

          <h1 className="text-3xl font-bold text-navy-500 mb-4">
            Page not found
          </h1>

          <p className="text-gray-600 mb-6">
            The page you are looking for does not exist or could not be loaded.
          </p>

          {error?.statusText && (
            <p className="text-sm text-gray-500 mb-6">
              {error.statusText}
            </p>
          )}

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-b from-success-400 to-success-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-success-500 hover:to-success-600"
          >
            Back to homepage
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'country/:countryName',
        element: <CountryDetailPage />,
      },
      {
        path: 'submit-review',
        element: <SubmitReviewPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'insights',
        element: <InsightsPage />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;