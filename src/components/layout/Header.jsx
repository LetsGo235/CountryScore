import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe2, Menu, Search, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const closeMenu = () => setMobileMenuOpen(false);
  const nav = [
    { href: '/', title: 'Explore' },
    { href: '/categories', title: 'Categories', future: true },
    { href: '/insights', title: 'Insights', future: true },
    { href: '/submit-review', title: 'Write Review' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-3">
          <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2" aria-label="CountryScore home">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white"><Globe2 className="h-6 w-6" aria-hidden="true" /></span>
            <span className="text-lg font-bold tracking-tight text-blue-600 sm:text-xl">CountryScore</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Main navigation">
            {nav.map((item) => (
              <Link key={item.href} to={item.href} className={`flex items-center gap-1.5 text-sm font-medium transition hover:text-blue-600 ${location.pathname === item.href ? 'text-blue-600' : 'text-slate-700'}`}>
                {item.title}{item.future && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">Soon</span>}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/?focus=search" title="Search countries" aria-label="Search countries" className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"><Search className="h-5 w-5" /></Link>
            <Link to="/submit-review" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">Share your experience</Link>
          </div>
          <button type="button" onClick={() => setMobileMenuOpen((value) => !value)} className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav id="mobile-navigation" className="space-y-1 border-t border-slate-100 py-3 md:hidden" aria-label="Mobile navigation">
            {nav.map((item) => (
              <Link key={item.href} to={item.href} onClick={closeMenu} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600">
                {item.title}{item.future && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Soon</span>}
              </Link>
            ))}
            <Link to="/?focus=search" onClick={closeMenu} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50"><Search className="h-4 w-4" /> Search countries</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
