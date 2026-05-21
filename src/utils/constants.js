// Review statuses
export const STATUSES = {
  CURRENT_RESIDENT: 'current_resident',
  FORMER_RESIDENT: 'former_resident',
  VISITED: 'visited',
  NEVER_BEEN: 'never_been',
};

export const STATUS_LABELS = {
  [STATUSES.CURRENT_RESIDENT]: 'Lives there',
  [STATUSES.FORMER_RESIDENT]: 'Used to live there',
  [STATUSES.VISITED]: 'Visited',
  [STATUSES.NEVER_BEEN]: 'Outside opinion',
};

export const STATUS_WEIGHTS = {
  [STATUSES.CURRENT_RESIDENT]: 1.0,
  [STATUSES.FORMER_RESIDENT]: 0.82,
  [STATUSES.VISITED]: 0.55,
  [STATUSES.NEVER_BEEN]: 0.25,
};

// Review categories
export const CATEGORIES = [
  {
    key: 'costOfLiving',
    label: 'Cost of Living',
    icon: 'DollarSign',
    subcategories: ['Rent', 'Groceries', 'Bills', 'Transport Costs'],
  },
  {
    key: 'safety',
    label: 'Safety',
    icon: 'Shield',
    subcategories: ['Crime', 'Police', 'Night Safety', 'Family Safety'],
  },
  {
    key: 'jobs',
    label: 'Jobs',
    icon: 'Briefcase',
    subcategories: ['Job Availability', 'Salary', 'Career Growth', 'Work Culture'],
  },
  {
    key: 'healthcare',
    label: 'Healthcare',
    icon: 'Heart',
    subcategories: ['Access', 'Quality', 'Waiting Times', 'Affordability'],
  },
  {
    key: 'education',
    label: 'Education',
    icon: 'GraduationCap',
    subcategories: ['Schools', 'Universities', 'Affordability', 'Quality'],
  },
  {
    key: 'freedom',
    label: 'Freedom',
    icon: 'Users',
    subcategories: ['Speech', 'Politics', 'Personal Freedom', 'Internet Access'],
  },
  {
    key: 'lifestyle',
    label: 'Lifestyle',
    icon: 'Coffee',
    subcategories: ['Happiness', 'Food', 'Culture', 'Things To Do'],
  },
  {
    key: 'infrastructure',
    label: 'Infrastructure',
    icon: 'Train',
    subcategories: ['Public Transport', 'Roads', 'Internet', 'Public Services'],
  },
];

// Get category by key
export const getCategoryByKey = (key) => {
  return CATEGORIES.find((cat) => cat.key === key);
};

// Get category label
export const getCategoryLabel = (key) => {
  const category = getCategoryByKey(key);
  return category ? category.label : key;
};

// Validation constants
export const VALIDATION = {
  MIN_TITLE_LENGTH: 6,
  MAX_TITLE_LENGTH: 100,
  MIN_COMMENT_LENGTH: 40,
  MAX_COMMENT_LENGTH: 2000,
  MIN_SCORE: 1,
  MAX_SCORE: 10,
};

// Review cooldown (10 minutes)
export const REVIEW_COOLDOWN_MS = 10 * 60 * 1000;

// Age ranges for review submission
export const AGE_RANGES = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
  'Prefer not to say',
];

// Duration options
export const DURATION_OPTIONS = [
  'Less than 1 month',
  '1-3 months',
  '4-6 months',
  '7-12 months',
  '1-2 years',
  '3-5 years',
  '5+ years',
  'Currently living there',
];

// Time period options
export const TIME_PERIOD_OPTIONS = [
  '2024-Present',
  '2023-2024',
  '2022-2023',
  '2021-2022',
  '2020-2021',
  'Before 2020',
];

// Report reasons
export const REPORT_REASONS = {
  SPAM: 'spam',
  HATE_SPEECH: 'hate_speech',
  MISINFORMATION: 'misinformation',
  INAPPROPRIATE: 'inappropriate',
  DUPLICATE: 'duplicate',
  OTHER: 'other',
};

export const REPORT_REASON_LABELS = {
  [REPORT_REASONS.SPAM]: 'Spam or advertising',
  [REPORT_REASONS.HATE_SPEECH]: 'Hate speech or harassment',
  [REPORT_REASONS.MISINFORMATION]: 'Misinformation or false claims',
  [REPORT_REASONS.INAPPROPRIATE]: 'Inappropriate content',
  [REPORT_REASONS.DUPLICATE]: 'Duplicate review',
  [REPORT_REASONS.OTHER]: 'Other',
};

// Regions for country grouping
export const REGIONS = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Middle East',
  'Caribbean',
  'Central America',
];

// Sort options
export const SORT_OPTIONS = {
  SCORE_DESC: 'score_desc',
  SCORE_ASC: 'score_asc',
  REVIEWS_DESC: 'reviews_desc',
  COUNTRY_ASC: 'country_asc',
  RECENT: 'recent',
};

export const SORT_LABELS = {
  [SORT_OPTIONS.SCORE_DESC]: 'Highest rated',
  [SORT_OPTIONS.SCORE_ASC]: 'Lowest rated',
  [SORT_OPTIONS.REVIEWS_DESC]: 'Most reviewed',
  [SORT_OPTIONS.COUNTRY_ASC]: 'Country A-Z',
  [SORT_OPTIONS.RECENT]: 'Most recent',
};