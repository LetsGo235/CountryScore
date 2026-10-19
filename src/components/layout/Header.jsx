import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header row */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌍</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              CountryScore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Explore
            </Link>

            <Link
              to="/categories"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Categories
            </Link>

            <Link
              to="/insights"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Insights
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                New
              </span>
            </Link>

            <Link
              to="/submit-review"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Write Review
            </Link>
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Search countries"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </Link>

            <Link
              to="/submit-review"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm px-4 py-2"
            >
              Log in
            </Link>

            <Link
              to="/submit-review"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition text-sm"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
            >
              Explore
            </Link>

            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
            >
              Categories
            </Link>

            <Link
              to="/insights"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
            >
              Insights
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                New
              </span>
            </Link>

            <Link
              to="/submit-review"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
            >
              Write Review
            </Link>

            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
              <Link
                to="/submit-review"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 font-medium text-sm px-4 py-2 hover:bg-gray-50 rounded-lg w-full text-left"
              >
                Log in
              </Link>

              <Link
                to="/submit-review"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm w-full text-center"
              >
                Sign up
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}