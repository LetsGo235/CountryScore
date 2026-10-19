import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌍</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">CountryScore</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Real country reviews from people who live there.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">Navigation</h4>
            <ul className="space-y-2">
  <li>
    <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm transition">
      Explore
    </Link>
  </li>
  <li>
    <Link to="/categories" className="text-gray-600 hover:text-gray-900 text-sm transition">
      Categories
    </Link>
  </li>
  <li>
    <Link to="/insights" className="text-gray-600 hover:text-gray-900 text-sm transition">
      Insights
    </Link>
  </li>
  <li>
    <Link to="/submit-review" className="text-gray-600 hover:text-gray-900 text-sm transition">
      Submit Review
    </Link>
  </li>
</ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 text-sm transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 text-sm transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 text-sm transition">
                  Code of Conduct
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 text-sm transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 text-sm transition">
                  Community
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 text-sm transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2026 CountryScore. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm">
              Built with ♥ for travelers and global citizens.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
