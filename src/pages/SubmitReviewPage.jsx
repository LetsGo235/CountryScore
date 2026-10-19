import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CloudUpload,
  GraduationCap,
  Heart,
  HeartPulse,
  House,
  Image as ImageIcon,
  Leaf,
  Lightbulb,
  MapPin,
  MessageCircle,
  Plane,
  Search,
  ShieldCheck,
  Smile,
  Star,
  TrainFront,
  UsersRound,
  Wallet,
  Wifi,
  X,
} from 'lucide-react';

import { useCountries } from '../hooks/useCountries';
import { supabase } from '../utils/supabase';
import { REVIEW_COOLDOWN_MS } from '../utils/constants';

// These are visual roles, not five distinct database statuses. In the current
// schema, Expat and Student share the current_resident status with Resident.
const CONNECTION_TYPES = [
  { id: 'resident', status: 'current_resident', label: 'Resident', subtitle: 'I live here', Icon: House },
  { id: 'expat', status: 'current_resident', label: 'Expat', subtitle: 'I live here temporarily', Icon: MapPin },
  { id: 'student', status: 'current_resident', label: 'Student', subtitle: 'I study here', Icon: GraduationCap },
  { id: 'traveler', status: 'visited', label: 'Traveler', subtitle: 'I visited', Icon: Plane },
  { id: 'former', status: 'former_resident', label: 'Former Resident', subtitle: 'I used to live here', Icon: UsersRound },
];

// Do not prepopulate ratings. An unanswered category is not a 4/5 rating.
// The legacy data model stores one reviews row per selected category. Commit 8C
// will introduce a parent review + review_ratings structure for accurate counts.
const RATING_CATEGORIES = [
  { id: 'safety', dbKey: 'safety', subcategory: 'General', label: 'Safety', Icon: ShieldCheck, color: 'text-blue-600 bg-blue-50' },
  { id: 'costOfLiving', dbKey: 'costOfLiving', subcategory: 'General', label: 'Cost of Living', Icon: Wallet, color: 'text-amber-600 bg-amber-50' },
  { id: 'healthcare', dbKey: 'healthcare', subcategory: 'General', label: 'Healthcare', Icon: HeartPulse, color: 'text-rose-600 bg-rose-50' },
  { id: 'publicTransport', dbKey: 'infrastructure', subcategory: 'Public Transport', label: 'Public Transport', Icon: TrainFront, color: 'text-cyan-600 bg-cyan-50' },
  { id: 'workLife', dbKey: 'lifestyle', subcategory: 'Work-Life Balance', label: 'Work-Life Balance', Icon: UsersRound, color: 'text-violet-600 bg-violet-50' },
  { id: 'education', dbKey: 'education', subcategory: 'General', label: 'Education', Icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50' },
  { id: 'internet', dbKey: 'infrastructure', subcategory: 'Internet Quality', label: 'Internet Quality', Icon: Wifi, color: 'text-sky-600 bg-sky-50' },
  { id: 'friendliness', dbKey: 'lifestyle', subcategory: 'Friendliness', label: 'Friendliness', Icon: Smile, color: 'text-orange-600 bg-orange-50' },
  { id: 'cleanliness', dbKey: 'lifestyle', subcategory: 'Cleanliness', label: 'Cleanliness', Icon: Leaf, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'opportunities', dbKey: 'jobs', subcategory: 'Opportunities', label: 'Opportunities', Icon: BriefcaseBusiness, color: 'text-slate-600 bg-slate-100' },
];

const DURATION_OPTIONS = [
  'Less than 3 months', '3–6 months', '6–12 months', '1–2 years', '2–5 years', '5+ years',
];
const AGE_OPTIONS = ['18–25', '26–35', '36–45', '46–55', '56–65', '65+', 'Prefer not to say'];
const TIME_OPTIONS = ['Spring', 'Summer', 'Autumn', 'Winter', 'Year-round'];

const inputClass = 'w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15';
const trim = (value) => String(value || '').trim();

function SectionHeading({ number, title, subtitle }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{number}</span>
      <div className="pt-0.5">
        <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function CountryFlag({ code, name, size = 'md' }) {
  const validCode = /^[A-Za-z]{2}$/.test(String(code || ''));
  const baseSize = size === 'sm' ? 'h-5 w-7' : 'h-7 w-10';
  if (!validCode) {
    return (
      <span aria-label="Flag unavailable" className={`${baseSize} inline-flex shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-100 text-slate-400`}>
        <ImageIcon size={14} aria-hidden="true" />
      </span>
    );
  }
  return (
    <img
      src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
      alt={`${name} flag`}
      loading="lazy"
      onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/flag-placeholder.svg"; }}
      className={`${baseSize} shrink-0 rounded border border-slate-200 object-cover`}
    />
  );
}

function RatingInput({ category, value, onChange }) {
  const { Icon } = category;
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${category.color}`}>
          <Icon size={17} strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="text-xs font-semibold text-slate-800 sm:text-sm">{category.label}</span>
      </div>
      <div role="group" aria-label={`${category.label} rating`} className="flex shrink-0 flex-col items-end">
        <div className="flex items-center gap-0.5 sm:gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(value === star ? 0 : star)}
              aria-label={`${category.label}: ${star} out of 5; click again to clear`}
              aria-pressed={value === star}
              className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Star
                size={17}
                strokeWidth={1.4}
                className={star <= value ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 hover:fill-amber-200 hover:text-amber-200'}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
        <span className="mt-0.5 text-[10px] text-slate-400">
          {value === 0 ? 'Not rated' : value === 1 ? 'Poor' : value === 5 ? 'Excellent' : `${value} / 5`}
        </span>
      </div>
    </div>
  );
}

function SidebarCard({ icon: Icon, title, tone, children }) {
  const toneClass = tone === 'green'
    ? 'border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white'
    : tone === 'warm'
      ? 'border-amber-100 bg-gradient-to-br from-amber-50/80 to-white'
      : 'border-blue-100 bg-gradient-to-br from-blue-50/80 to-white';
  const iconColor = tone === 'green' ? 'text-emerald-600' : tone === 'warm' ? 'text-amber-600' : 'text-blue-600';
  return (
    <div className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${toneClass}`}>
      <div className="mb-4 flex items-center gap-3">
        <Icon size={23} strokeWidth={1.8} className={iconColor} aria-hidden="true" />
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

const FEATURE_ITEMS = [
  { Icon: UsersRound, title: 'Real perspectives', description: 'Experiences shared by people around the world.' },
  { Icon: ShieldCheck, title: 'Thoughtful community', description: 'Submissions are reviewed before appearing publicly.' },
  { Icon: MessageCircle, title: 'Global conversation', description: 'Discover what life is like across different countries.' },
  { Icon: Star, title: 'Make an impact', description: 'Your experience can help someone make a decision.' },
];

export default function SubmitReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { countries = [], loading: countriesLoading, error: countriesError } = useCountries();

  const countryOptions = useMemo(
    () => [...countries].sort((a, b) => String(a.name).localeCompare(String(b.name))),
    [countries]
  );
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [countryQuery, setCountryQuery] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const [connectionId, setConnectionId] = useState('resident');
  const [ratings, setRatings] = useState({});
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [duration, setDuration] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [publicationConsent, setPublicationConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedRow = countryOptions.find((country) => country.name === selectedCountry);
  const connection = CONNECTION_TYPES.find((item) => item.id === connectionId) || CONNECTION_TYPES[0];
  const filteredCountries = countryOptions.filter((country) => {
    const query = countryQuery.toLowerCase().trim();
    return !query || [country.name, country.code, country.region].some((value) => String(value || '').toLowerCase().includes(query));
  });
  const ratedCount = RATING_CATEGORIES.filter((category) => (ratings[category.id] || 0) > 0).length;

  function validate() {
    if (!selectedRow) return 'Select a country from the list.';
    if (!ratedCount) return 'Rate at least one category before submitting.';
    if (trim(reviewTitle).length < 6) return 'Your title needs at least 6 characters.';
    if (trim(reviewTitle).length > 100) return 'Your title must be 100 characters or fewer.';
    if (trim(reviewText).length < 40) return 'Your review needs at least 40 characters.';
    if (trim(reviewText).length > 2000) return 'Your review must be 2,000 characters or fewer.';
    if (!publicationConsent) return 'Please acknowledge that approved reviews may appear publicly.';

    const lastSubmit = Number(localStorage.getItem(`review_cooldown_${selectedCountry}`) || 0);
    const remaining = REVIEW_COOLDOWN_MS - (Date.now() - lastSubmit);
    if (lastSubmit && remaining > 0) return `Please wait ${Math.ceil(remaining / 60000)} minute(s) before reviewing ${selectedCountry} again.`;
    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    const problem = validate();
    if (problem) {
      setErrorMessage(problem);
      setSuccessMessage('');
      return;
    }
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const rows = RATING_CATEGORIES
      .filter((category) => (ratings[category.id] || 0) > 0)
      .map((category) => ({
        country: selectedRow.name,
        status: connection.status,
        category: category.dbKey,
        subcategory: category.subcategory,
        score: (ratings[category.id] || 0) * 2,
        title: trim(reviewTitle),
        comment: trim(reviewText),
        pros: trim(pros) || null,
        cons: trim(cons) || null,
        age_range: ageRange || null,
        duration_stayed: duration || null,
        time_period: timePeriod || null,
        display_name: 'Anonymous',
        approved: false,
      }));

    try {
      const { error } = await supabase.from('reviews').insert(rows);
      if (error) throw new Error(error.message);
      localStorage.setItem(`review_cooldown_${selectedCountry}`, String(Date.now()));
      setReviewTitle('');
      setReviewText('');
      setPros('');
      setCons('');
      setDuration('');
      setAgeRange('');
      setTimePeriod('');
      setRatings({});
      setPublicationConsent(false);
      setSuccessMessage('Review submitted. Thank you! Your submission will remain pending until moderation.');
    } catch (error) {
      setErrorMessage(error?.message || 'Your review could not be submitted. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfcff] pb-12">
      <div className="border-b border-slate-100 bg-white">
        <nav aria-label="Breadcrumb" className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-xs sm:px-6 lg:px-8">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <ChevronRight size={14} className="text-slate-400" aria-hidden="true" />
          <span className="font-medium text-slate-700">Submit Review</span>
        </nav>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-center justify-between gap-8 pt-7 sm:pt-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-[40px]">Submit a Review</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Share your experience and help others understand what life is really like in this country.
            </p>
          </div>
          {/* Intentional placeholder: no emoji globe or unrelated stock image. */}
          <img
            src="/images/review-hero-placeholder.svg"
            alt="Illustration placeholder for CountryScore community artwork"
            className="hidden h-[136px] w-[310px] shrink-0 object-contain lg:block"
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_310px] xl:gap-7 xl:grid-cols-[minmax(0,1fr)_335px]">
          <form onSubmit={handleSubmit} noValidate className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_35px_-25px_rgba(15,23,42,0.26)]">
            <section className="px-4 py-5 sm:px-6 sm:py-6">
              <SectionHeading number="1" title="Select a Country" />
              <div className="relative">
                <label htmlFor="country-search" className="sr-only">Search for a country</label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15">
                  <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
                  <input
                    id="country-search"
                    type="search"
                    autoComplete="off"
                    placeholder={countriesLoading ? 'Loading countries...' : 'Search for a country...'}
                    value={countryQuery}
                    onChange={(event) => { setCountryQuery(event.target.value); setCountryOpen(true); }}
                    onFocus={() => setCountryOpen(true)}
                    className="w-full min-w-0 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    disabled={countriesLoading || !!countriesError}
                    aria-expanded={countryOpen}
                    aria-controls="country-options"
                  />
                  <ChevronDown size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
                </div>
                {countryOpen && !countriesLoading && !countriesError && (
                  <div id="country-options" className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                    {filteredCountries.length ? filteredCountries.map((country) => (
                      <button
                        key={country.code || country.name}
                        type="button"
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                        onClick={() => { setSelectedCountry(country.name); setCountryQuery(''); setCountryOpen(false); }}
                      >
                        <CountryFlag code={country.code} name={country.name} size="sm" />
                        <span className="font-medium">{country.name}</span>
                        <span className="ml-auto text-xs text-slate-400">{country.region}</span>
                      </button>
                    )) : <div className="px-3 py-3 text-sm text-slate-500">No matching countries.</div>}
                  </div>
                )}
              </div>
              {countriesError && <p className="mt-2 text-xs text-red-600">Couldn't load countries. Please reload the page.</p>}
              {selectedCountry && (
                <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5">
                  <CountryFlag code={selectedRow?.code} name={selectedCountry} size="sm" />
                  <span className="flex-1 text-sm font-semibold text-slate-900">{selectedCountry}</span>
                  <button type="button" onClick={() => setSelectedCountry('')} className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700" aria-label="Remove selected country">
                    <X size={17} aria-hidden="true" />
                  </button>
                </div>
              )}
            </section>

            <section className="border-t border-slate-100 px-4 py-5 sm:px-6 sm:py-6">
              <SectionHeading number="2" title="What is your connection to this country?" subtitle="This helps others understand your perspective." />
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                {CONNECTION_TYPES.map(({ id, Icon, label, subtitle }) => (
                  <button
                    type="button"
                    key={id}
                    aria-pressed={id === connectionId}
                    onClick={() => setConnectionId(id)}
                    className={`flex min-h-[113px] min-w-0 flex-col items-center justify-center rounded-xl border px-2 py-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${id === connectionId ? 'border-blue-600 bg-blue-50/80 shadow-[0_0_0_1px_rgba(37,99,235,.3)]' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'}`}
                  >
                    <Icon size={24} className={id === connectionId ? 'text-blue-600' : 'text-slate-500'} aria-hidden="true" strokeWidth={1.8} />
                    <span className={`mt-2 text-xs font-semibold ${id === connectionId ? 'text-blue-700' : 'text-slate-900'}`}>{label}</span>
                    <span className="mt-0.5 text-[10px] leading-4 text-slate-500">{subtitle}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="border-t border-slate-100 px-4 py-5 sm:px-6 sm:py-6">
              <div className="flex items-start justify-between gap-3">
                <SectionHeading number="3" title="Rate your experience" subtitle="Rate only the categories you have experience with." />
                <span className="pt-2 text-xs text-slate-500">{ratedCount} of {RATING_CATEGORIES.length} rated</span>
              </div>
              <div className="grid grid-cols-1 gap-x-7 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-5">
                {RATING_CATEGORIES.map((category) => (
                  <RatingInput key={category.id} category={category} value={ratings[category.id] || 0} onChange={(value) => setRatings((prev) => ({ ...prev, [category.id]: value }))} />
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">Click a selected star again to clear a rating. Unrated categories aren't submitted.</p>
            </section>

            <section className="border-t border-slate-100 px-4 py-5 sm:px-6 sm:py-6">
              <SectionHeading number="4" title="Write your review" />
              <div className="space-y-4">
                <div>
                  <label htmlFor="review-title" className="mb-1.5 block text-xs font-semibold text-slate-800">Review title</label>
                  <div className="relative">
                    <input id="review-title" value={reviewTitle} onChange={(event) => setReviewTitle(event.target.value.slice(0, 100))} maxLength={100} placeholder="Give your review a short title" className={`${inputClass} pr-16`} />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-slate-400">{reviewTitle.length} / 100</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="review-text" className="mb-1.5 block text-xs font-semibold text-slate-800">Your review</label>
                  <div className="relative">
                    <textarea id="review-text" rows={4} value={reviewText} onChange={(event) => setReviewText(event.target.value.slice(0, 2000))} maxLength={2000} placeholder="Share your experience, both the good and the bad. What did you like? What could be better? Any tips for others?" className={`${inputClass} min-h-[125px] resize-y pb-7`} />
                    <span className="pointer-events-none absolute bottom-3 right-3 text-[11px] text-slate-400">{reviewText.length} / 2000</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="review-pros" className="mb-1.5 block text-xs font-semibold text-slate-800">Pros <span className="font-normal text-slate-400">(optional)</span></label>
                    <textarea id="review-pros" rows={3} value={pros} onChange={(event) => setPros(event.target.value)} placeholder="What were the best things?" className={`${inputClass} resize-y`} />
                  </div>
                  <div>
                    <label htmlFor="review-cons" className="mb-1.5 block text-xs font-semibold text-slate-800">Cons <span className="font-normal text-slate-400">(optional)</span></label>
                    <textarea id="review-cons" rows={3} value={cons} onChange={(event) => setCons(event.target.value)} placeholder="What were the biggest downsides?" className={`${inputClass} resize-y`} />
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-slate-800">Add photos <span className="font-normal text-slate-400">(coming later)</span></p>
                  <div aria-disabled="true" className="flex min-h-[95px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-center">
                    <CloudUpload size={22} className="text-slate-400" aria-hidden="true" />
                    <p className="text-xs font-medium text-slate-500">Photo uploads aren't available yet</p>
                    <p className="text-[11px] text-slate-400">This area is reserved for the future image uploader.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t border-slate-100 px-4 py-5 sm:px-6 sm:py-6">
              <SectionHeading number="5" title="Additional details" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { id: 'duration', label: 'How long have you been here?', value: duration, onChange: setDuration, options: DURATION_OPTIONS, placeholder: 'Select duration' },
                  { id: 'age', label: 'Age range', value: ageRange, onChange: setAgeRange, options: AGE_OPTIONS, placeholder: 'Select age range' },
                  { id: 'time', label: 'Time of year visited/lived', value: timePeriod, onChange: setTimePeriod, options: TIME_OPTIONS, placeholder: 'Select time period' },
                ].map(({ id, label, value, onChange, options, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={`review-${id}`} className="mb-1.5 block text-xs font-semibold text-slate-800">{label}</label>
                    <select id={`review-${id}`} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
                      <option value="">{placeholder}</option>
                      {options.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg p-1 text-xs text-slate-700">
                <input type="checkbox" checked={publicationConsent} onChange={(event) => setPublicationConsent(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />
                <span><span className="font-semibold text-slate-900">I understand my review may be displayed publicly if approved.</span><br />Please avoid sharing personal or identifying information. You can only submit after acknowledging this.</span>
              </label>
            </section>

            <div className="border-t border-slate-100 px-4 py-5 sm:px-6">
              {errorMessage && <div role="alert" className="mb-4 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0" aria-hidden="true" />{errorMessage}</div>}
              {successMessage && <div role="status" className="mb-4 flex gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 size={18} className="shrink-0" aria-hidden="true" />{successMessage}</div>}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button type="button" onClick={() => navigate('/')} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={submitting || countriesLoading || !!countriesError} className="rounded-lg bg-blue-600 px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </div>
              <p className="mt-2 text-right text-xs text-slate-500">Submissions are reviewed before publication.</p>
            </div>
          </form>

          <aside className="space-y-5">
            <SidebarCard icon={ShieldCheck} title="Your opinion matters">
              <p className="mb-5 text-sm leading-6 text-slate-700">Real experiences help others build a more informed understanding of countries around the world.</p>
              <div className="space-y-3 text-xs text-slate-700">
                {['Be honest about your experience', 'Focus on first-hand observations', 'Be respectful of other perspectives', 'Reviews are subject to moderation'].map((item) => (
                  <div key={item} className="flex items-start gap-2.5"><CheckCircle2 size={16} className="shrink-0 text-emerald-600" aria-hidden="true" />{item}</div>
                ))}
              </div>
            </SidebarCard>
            <SidebarCard icon={Lightbulb} title="Review tips" tone="green">
              <div className="space-y-5">
                {[
                  { Icon: MessageCircle, title: 'Be specific', text: 'Share examples and helpful details from your experience.' },
                  { Icon: Heart, title: 'Keep it helpful', text: 'Consider what others would want to know.' },
                  { Icon: UsersRound, title: 'Stay respectful', text: 'Different experiences are valid. Keep it constructive.' },
                ].map(({ Icon, title, text }) => (
                  <div key={title} className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"><Icon size={20} aria-hidden="true" /></span><div><p className="text-xs font-semibold text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{text}</p></div></div>
                ))}
              </div>
            </SidebarCard>
            <SidebarCard icon={Clock3} title="What happens next?" tone="warm">
              <ol className="space-y-5">
                {[
                  ['Review submitted', 'Your submission is recorded.'],
                  ['Under moderation', 'The submission is checked before publication.'],
                  ['Published if approved', 'Approved submissions become visible to others.'],
                ].map(([title, text], index) => (
                  <li key={title} className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">{index + 1}</span><div><p className="text-xs font-semibold text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{text}</p></div></li>
                ))}
              </ol>
              <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Moderation timing can vary.</p>
            </SidebarCard>
          </aside>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
          {FEATURE_ITEMS.map(({ Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={21} aria-hidden="true" /></span><div><p className="text-xs font-semibold text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div></div>
          ))}
        </div>
      </main>
    </div>
  );
}
