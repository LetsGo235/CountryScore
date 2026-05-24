import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-navy-500 to-navy-600 border-b-4 border-success-500 text-white sticky top-0 z-40 shadow-lg">
      {/* Main nav bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-success-500 rounded-lg flex items-center justify-center font-bold text-sm text-white">
            CS
          </div>
          <span className="font-bold text-lg hidden sm:inline">CountryScore</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold hover:text-success-400 transition-colors">
            Countries
          </Link>
          <Link to="/insights" className="text-sm font-semibold hover:text-success-400 transition-colors">
            Insights
          </Link>
          <Link to="/categories" className="text-sm font-semibold hover:text-success-400 transition-colors">
            Categories
          </Link>
          <Link
            to="/submit-review"
            className="px-4 py-2 bg-gradient-to-b from-success-400 to-success-500 border border-success-600 text-gray-900 font-semibold rounded hover:from-success-300 hover:to-success-600 transition-all shadow-md hover:shadow-lg"
          >
            Write Review
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-navy-600 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-navy-600 bg-navy-600">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded hover:bg-navy-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Countries
            </Link>
            <Link
              to="/insights"
              className="block px-3 py-2 rounded hover:bg-navy-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Insights
            </Link>
            <Link
              to="/categories"
              className="block px-3 py-2 rounded hover:bg-navy-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/submit-review"
              className="block px-4 py-2 bg-gradient-to-b from-success-400 to-success-500 border border-success-600 text-gray-900 font-semibold rounded hover:from-success-300 hover:to-success-600 transition-all text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Write Review
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
