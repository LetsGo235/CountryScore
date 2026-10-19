import { Link } from 'react-router-dom';
import { Globe2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold text-blue-600">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white"><Globe2 className="h-5 w-5" aria-hidden="true" /></span>
              CountryScore
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">Explore countries through community-submitted experiences and ratings.</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Explore</h3>
            <nav className="mt-3 flex flex-col items-start gap-2 text-sm text-slate-600" aria-label="Footer navigation">
              <Link className="hover:text-blue-600" to="/">Countries</Link>
              <Link className="hover:text-blue-600" to="/submit-review">Share your experience</Link>
              <Link className="hover:text-blue-600" to="/categories">Categories (in development)</Link>
              <Link className="hover:text-blue-600" to="/insights">Insights (in development)</Link>
            </nav>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Platform status</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">CountryScore is in early development. Community policies, user accounts, and additional reporting tools are being prepared.</p>
          </div>
        </div>
        <div className="mt-9 flex flex-col justify-between gap-2 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} CountryScore.</span>
          <span>Built for curious global citizens.</span>
        </div>
      </div>
    </footer>
  );
}
