import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-500 text-white border-t border-navy-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-success-500 rounded-lg flex items-center justify-center font-bold text-xs text-white">
                CS
              </div>
              <span className="font-bold">CountryScore</span>
            </div>
            <p className="text-sm text-gray-300">
              Real country reviews from people who live there.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/" className="text-gray-300 hover:text-success-400 transition-colors block">
                Countries
              </Link>
              <Link to="/insights" className="text-gray-300 hover:text-success-400 transition-colors block">
                Insights
              </Link>
              <Link to="/categories" className="text-gray-300 hover:text-success-400 transition-colors block">
                Categories
              </Link>
              <Link to="/submit-review" className="text-gray-300 hover:text-success-400 transition-colors block">
                Submit Review
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <nav className="space-y-2 text-sm">
              <a href="#privacy" className="text-gray-300 hover:text-success-400 transition-colors block">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-300 hover:text-success-400 transition-colors block">
                Terms of Service
              </a>
              <a href="#conduct" className="text-gray-300 hover:text-success-400 transition-colors block">
                Code of Conduct
              </a>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Follow</h3>
            <div className="flex gap-4">
              <a
                href="#twitter"
                className="text-gray-300 hover:text-success-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#github"
                className="text-gray-300 hover:text-success-400 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="#linkedin"
                className="text-gray-300 hover:text-success-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-navy-400 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
            <p>&copy; {currentYear} CountryScore. All rights reserved.</p>
            <p>
              Built with <span className="text-success-400">❤</span> for travelers and global citizens.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
