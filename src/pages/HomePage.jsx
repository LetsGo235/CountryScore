import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Globe2,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useCountries } from '../hooks/useCountries';
import { useCountriesAggregate } from '../hooks/useReviews';
import { DEFAULT_CATEGORIES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const COUNTRY_PLACEHOLDER = '/images/country-placeholder.svg';
const HERO_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=960&fit=crop&auto=format';
const number = (value) => new Intl.NumberFormat('en-US').format(value);
const scoreText = (value) => Number.isFinite(value) && value > 0 ? value.toFixed(1) : '—';
const countryHref = (countryName) => `/country/${encodeURIComponent(countryName)}`;

function CountryFlag({ code, name }) {
  const [failed, setFailed] = useState(false);
  const normalizedCode = typeof code === 'string' && /^[a-z]{2}$/i.test(code) ? code.toLowerCase() : null;

  if (!normalizedCode || failed) {
    return (
      <span className="inline-flex h-5 w-7 items-center justify-center rounded border border-gray-200 bg-blue-50 text-blue-600" aria-label={`${name} flag unavailable`}>
        <Globe2 size={14} aria-hidden="true" />
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${normalizedCode}.png`}
      alt={`${name} flag`}
      width="28"
      height="19"
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-5 w-7 rounded-sm border border-gray-200 object-cover"
    />
  );
}

function CountryPhoto({ url, name, className = '' }) {
  const [failed, setFailed] = useState(false);
  // Never show a photo from the wrong country just to fill a card.
  return (
    <img
      src={!failed && url ? url : COUNTRY_PLACEHOLDER}
      alt={url && !failed ? `Scenery from ${name}` : `Image placeholder for ${name}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

function Stat({ icon: Icon, title, value }) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 border-b border-white/15 last:border-0">
      <Icon className="h-5 w-5 shrink-0 text-blue-300" aria-hidden="true" />
      <div>
        <div className="text-xl font-bold leading-tight text-white">{value == null ? '—' : number(value)}</div>
        <div className="mt-0.5 text-xs text-slate-200">{title}</div>
      </div>
    </div>
  );
}

function CountryCard({ country, rank }) {
  const hasRating = country.ratingCount > 0;
  const mostRatedCategory = country.topCategory;
  return (
    <Link
      to={countryHref(country.name)}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      aria-label={`Explore ${country.name}${hasRating ? `, rated ${scoreText(country.score)} out of ten` : ', not yet rated'}`}
    >
      <div className="relative h-36 overflow-hidden bg-slate-100 sm:h-40">
        <CountryPhoto url={country.hero_image_url} name={country.name} className="transition-transform duration-300 group-hover:scale-[1.04]" />
        {rank != null && (
          <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-slate-900/85 text-sm font-bold text-white shadow-sm">
            {rank}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <CountryFlag code={country.code} name={country.name} />
          <h3 className="min-w-0 truncate font-semibold text-slate-900">{country.name}</h3>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-bold tracking-tight text-slate-900">{scoreText(country.score)}</span>
          {hasRating && <span className="text-sm text-slate-500">/10</span>}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          {hasRating ? <Star className="h-4 w-4 text-amber-500" aria-hidden="true" /> : <MessageSquare className="h-4 w-4" aria-hidden="true" />}
          {hasRating ? `${number(country.ratingCount)} category rating${country.ratingCount === 1 ? '' : 's'}` : 'Awaiting first rating'}
        </div>
        <div className="mt-3 min-h-6">
          {mostRatedCategory ? (
            <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {mostRatedCategory.label}: {scoreText(mostRatedCategory.score)}
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">Explore country</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ScoreBar({ score, side }) {
  if (!(score > 0)) return <span className="text-xs text-slate-400">Not rated</span>;
  return (
    <div className={`flex min-w-0 items-center gap-2 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
      <span className="w-7 shrink-0 text-xs font-semibold text-slate-700">{scoreText(score)}</span>
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${side === 'right' ? 'bg-sky-400' : 'bg-blue-600'}`} style={{ width: `${Math.min(score * 10, 100)}%` }} />
      </div>
    </div>
  );
}

export default function HomePage() {
  // The hook returns `countries`, NOT `data`. This was the original homepage bug.
  const { countries: aggregatedCountries, loading: ratingsLoading, error: ratingsError } = useCountriesAggregate();
  const { countries: catalogCountries, loading: catalogLoading, error: catalogError } = useCountries();
  const [searchParams] = useSearchParams();
  const searchInputRef = useRef(null);
  const countriesSectionRef = useRef(null);
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [compareLeft, setCompareLeft] = useState('');
  const [compareRight, setCompareRight] = useState('');
  const [heroImageFailed, setHeroImageFailed] = useState(false);

  useEffect(() => {
    if (searchParams.get('focus') === 'search') searchInputRef.current?.focus();
  }, [searchParams]);

  const { countryList, ranking } = useMemo(() => {
    const ratedByName = new Map(aggregatedCountries.map((country) => [country.country, country]));
    const rows = catalogCountries.map((country) => {
      const summary = ratedByName.get(country.name);
      // Existing schema stores a rating per row. Never label this as unique reviews/users.
      const topCategory = summary?.topCategories?.find((category) => category.count > 0) ?? null;
      return {
        name: country.name,
        code: country.code,
        region: country.region || '',
        hero_image_url: country.hero_image_url,
        score: summary?.score ?? 0,
        ratingCount: summary?.count ?? 0,
        categories: summary?.categories ?? [],
        topCategory,
      };
    });
    return {
      countryList: rows,
      ranking: [...rows]
        .filter((country) => country.ratingCount > 0)
        .sort((a, b) => b.score - a.score || b.ratingCount - a.ratingCount || a.name.localeCompare(b.name)),
    };
  }, [catalogCountries, aggregatedCountries]);

  const filteredCountries = useMemo(() => {
    const trimmed = query.trim().toLocaleLowerCase();
    if (trimmed) {
      return countryList
        .filter((country) => [country.name, country.code, country.region].some((field) => (field || '').toLocaleLowerCase().includes(trimmed)))
        .sort((a, b) => b.ratingCount - a.ratingCount || b.score - a.score || a.name.localeCompare(b.name));
    }
    if (showAll) return [...countryList].sort((a, b) => a.name.localeCompare(b.name));
    return ranking.length ? ranking.slice(0, 5) : countryList.slice(0, 5);
  }, [countryList, ranking, query, showAll]);

  const publishedRatingCount = aggregatedCountries.reduce((sum, country) => sum + country.count, 0);
  const ratedCountryCount = ranking.length;
  const busy = ratingsLoading || catalogLoading;
  const error = ratingsError || catalogError;
  const firstCountry = countryList.some((country) => country.name === compareLeft)
    ? compareLeft : (ranking[0]?.name || countryList[0]?.name || '');
  const secondCountry = countryList.some((country) => country.name === compareRight) && compareRight !== firstCountry
    ? compareRight : (ranking.find((country) => country.name !== firstCountry)?.name || countryList.find((country) => country.name !== firstCountry)?.name || '');
  const firstData = countryList.find((country) => country.name === firstCountry);
  const secondData = countryList.find((country) => country.name === secondCountry);

  const highlights = useMemo(() => {
    const candidates = [];
    DEFAULT_CATEGORIES.forEach((category) => {
      const best = ranking
        .map((country) => ({ country, summary: country.categories.find((row) => row.key === category.key) }))
        .filter(({ summary }) => summary && summary.count > 0)
        .sort((a, b) => b.summary.score - a.summary.score || b.summary.count - a.summary.count)[0];
      if (best) candidates.push({ category: category.label, name: best.country.name, score: best.summary.score, count: best.summary.count });
    });
    return candidates.slice(0, 5);
  }, [ranking]);

  const scrollToCountries = (event) => {
    event.preventDefault();
    countriesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem]">
              Discover what people <span className="border-b-4 border-blue-500 text-blue-600">really</span> think about countries.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              Explore country ratings and experiences shared by residents, former residents, and travelers.
            </p>
            <form onSubmit={scrollToCountries} role="search" className="mt-7">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="sr-only">Search countries</span>
                  <input ref={searchInputRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for a country..." className="min-w-0 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
                </label>
                <button type="submit" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                  Explore countries
                </button>
              </div>
            </form>
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
              {busy ? 'Loading the CountryScore catalog…' : error ? 'Live country data is temporarily unavailable' : `${number(countryList.length)} countries in the catalog · ${number(ratedCountryCount)} with published ratings`}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-lg">
            <img
              src={heroImageFailed ? COUNTRY_PLACEHOLDER : HERO_IMAGE}
              alt={heroImageFailed ? 'Landscape placeholder' : 'Mountain landscape'}
              className="h-[340px] w-full object-cover sm:h-[420px]"
              onError={() => setHeroImageFailed(true)}
            />
            <div className="absolute bottom-4 right-4 w-44 rounded-xl border border-white/15 bg-slate-950/80 p-4 text-white shadow-xl backdrop-blur-md sm:bottom-6 sm:right-6 sm:w-48">
              <Stat icon={Globe2} title="Countries listed" value={busy || error ? null : countryList.length} />
              <Stat icon={Star} title="Published category ratings" value={busy || error ? null : publishedRatingCount} />
              <Stat icon={BarChart3} title="Countries rated" value={busy || error ? null : ratedCountryCount} />
            </div>
          </div>
        </div>
      </section>

      <section ref={countriesSectionRef} id="countries" className="scroll-mt-24 border-y border-slate-100 bg-slate-50/80 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-600" aria-hidden="true" />
                <h2 className="text-2xl font-bold sm:text-3xl">{query.trim() ? 'Search results' : showAll ? 'Explore all countries' : ranking.length ? 'Highest-rated countries' : 'Explore countries'}</h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {query.trim() ? `${number(filteredCountries.length)} matching countries` : ranking.length && !showAll ? 'Sorted by scores from approved category ratings, not monthly trends' : 'Browse countries, including those awaiting their first rating'}
              </p>
            </div>
            <button type="button" onClick={() => { setQuery(''); setShowAll((value) => !value); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 hover:border-blue-200 hover:bg-blue-50">
              {showAll && !query ? 'Show top rated' : 'View all countries'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          {busy ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8"><LoadingSpinner size="lg" label="Loading country rankings..." /></div>
          ) : error ? (
            <ErrorMessage title="Unable to load live country data" message={error.message || 'Please try again later.'} />
          ) : filteredCountries.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {filteredCountries.map((country, index) => <CountryCard key={country.name} country={country} rank={!query && !showAll && ranking.length ? index + 1 : null} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <MapPin className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
              <h3 className="mt-3 font-semibold text-slate-900">No countries found</h3>
              <p className="mt-1 text-sm text-slate-500">Try another name, country code, or region.</p>
              <button type="button" className="mt-4 text-sm font-semibold text-blue-600 hover:underline" onClick={() => { setQuery(''); setShowAll(true); }}>Show all countries</button>
            </div>
          )}
          {!busy && !error && (
            <p className="mt-5 text-xs leading-relaxed text-slate-500">
              Early preview: the database may include demonstration ratings. Scores are based on currently approved category entries; they are not representative national surveys. Rankings and scoring will be refined as we improve the review model.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-bold"><BarChart3 className="h-5 w-5 text-blue-600" aria-hidden="true" />CountryScore Insights</h2>
                <p className="mt-1 text-sm text-slate-500">Highlights from approved category ratings</p>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">Preview</span>
            </div>
            {busy ? <LoadingSpinner size="sm" label="Loading highlights..." /> : error ? <p className="text-sm text-red-600">Insights are unavailable right now.</p> : highlights.length ? (
              <div className="divide-y divide-slate-100">
                {highlights.map((item) => (
                  <div key={item.category} className="flex items-center gap-3 py-3 first:pt-0">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><BarChart3 className="h-5 w-5" aria-hidden="true" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{item.name} · {item.category}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.count} approved category rating{item.count === 1 ? '' : 's'}</p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{scoreText(item.score)}/10</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                <ImageIcon className="mx-auto mb-3 h-7 w-7 text-slate-300" aria-hidden="true" />
                Category highlights will appear once approved ratings are available.
              </div>
            )}
            <p className="mt-5 text-xs text-slate-500">These are current category leaders, not time-based trends. Historical insights are coming in a later phase.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Compare Countries</h2>
              <p className="mt-1 text-sm text-slate-500">A live preview of the categories each country has been rated in</p>
            </div>
            {busy ? <LoadingSpinner size="sm" label="Loading comparison..." /> : error ? <p className="text-sm text-red-600">Comparison is unavailable right now.</p> : countryList.length < 2 ? (
              <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">Add at least two countries to enable comparison.</p>
            ) : (
              <>
                <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <label className="min-w-0">
                    <span className="sr-only">First country</span>
                    <select value={firstCountry} onChange={(event) => setCompareLeft(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                      {countryList.map((country) => <option key={country.name} value={country.name}>{country.name}</option>)}
                    </select>
                  </label>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">vs</span>
                  <label className="min-w-0">
                    <span className="sr-only">Second country</span>
                    <select value={secondCountry} onChange={(event) => setCompareRight(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                      {countryList.filter((country) => country.name !== firstCountry).map((country) => <option key={country.name} value={country.name}>{country.name}</option>)}
                    </select>
                  </label>
                </div>
                <div className="space-y-4">
                  {DEFAULT_CATEGORIES.map((category) => {
                    const left = firstData?.categories.find((row) => row.key === category.key && row.count > 0);
                    const right = secondData?.categories.find((row) => row.key === category.key && row.count > 0);
                    return (
                      <div key={category.key}>
                        <div className="mb-1.5 text-xs font-semibold text-slate-700">{category.label}</div>
                        <div className="grid grid-cols-2 gap-4">
                          <ScoreBar score={left?.score} side="left" />
                          <ScoreBar score={right?.score} side="right" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-6 text-xs leading-relaxed text-slate-500">An unrated category shows “Not rated” rather than an invented score. Comparison is preliminary while ratings are limited.</p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 to-white p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="flex items-center gap-5">
            <span className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-sm sm:flex"><Globe2 className="h-11 w-11" aria-hidden="true" /></span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your experience matters.</h2>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-600">Share your experience to help others understand what life and travel are really like.</p>
            </div>
          </div>
          <Link to="/submit-review" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Write a review <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:grid-cols-3 sm:px-6 lg:px-8">
        {[
          { Icon: Users, title: 'Real experiences', description: 'Ratings reflect submissions from people with different relationships to a country.' },
          { Icon: ShieldCheck, title: 'Reviews are moderated', description: 'Submissions require approval before becoming visible. More trust features are in development.' },
          { Icon: Globe2, title: 'A global perspective', description: 'Browse countries across regions and compare the categories that matter to you.' },
        ].map(({ Icon, title, description }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm"><Icon className="h-6 w-6" aria-hidden="true" /></span>
            <div><h3 className="font-semibold text-slate-900">{title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p></div>
          </div>
        ))}
      </section>
    </div>
  );
}
