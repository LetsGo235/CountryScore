-- CountryScore v2 - Migration 002: Seed Data
-- Executed in Supabase project: cusvsgnpxlvkwrgslnis
-- Applied via apply_migration (Commit 2)

-- ─────────────────────────────────────────────
-- COUNTRIES (40 rows)
-- ─────────────────────────────────────────────
INSERT INTO countries (name, code, region, continent, flag_emoji, capital) VALUES
('United States',        'US', 'North America',   'North America', '🇺🇸', 'Washington, D.C.'),
('United Kingdom',       'GB', 'Western Europe',  'Europe',        '🇬🇧', 'London'),
('Canada',               'CA', 'North America',   'North America', '🇨🇦', 'Ottawa'),
('Australia',            'AU', 'Oceania',          'Oceania',       '🇦🇺', 'Canberra'),
('Germany',              'DE', 'Western Europe',  'Europe',        '🇩🇪', 'Berlin'),
('France',               'FR', 'Western Europe',  'Europe',        '🇫🇷', 'Paris'),
('Japan',                'JP', 'East Asia',        'Asia',          '🇯🇵', 'Tokyo'),
('Netherlands',          'NL', 'Western Europe',  'Europe',        '🇳🇱', 'Amsterdam'),
('Spain',                'ES', 'Southern Europe', 'Europe',        '🇪🇸', 'Madrid'),
('Italy',                'IT', 'Southern Europe', 'Europe',        '🇮🇹', 'Rome'),
('Switzerland',          'CH', 'Western Europe',  'Europe',        '🇨🇭', 'Bern'),
('Sweden',               'SE', 'Northern Europe', 'Europe',        '🇸🇪', 'Stockholm'),
('Norway',               'NO', 'Northern Europe', 'Europe',        '🇳🇴', 'Oslo'),
('Denmark',              'DK', 'Northern Europe', 'Europe',        '🇩🇰', 'Copenhagen'),
('Singapore',            'SG', 'Southeast Asia',  'Asia',          '🇸🇬', 'Singapore'),
('New Zealand',          'NZ', 'Oceania',          'Oceania',       '🇳🇿', 'Wellington'),
('Ireland',              'IE', 'Western Europe',  'Europe',        '🇮🇪', 'Dublin'),
('Belgium',              'BE', 'Western Europe',  'Europe',        '🇧🇪', 'Brussels'),
('Austria',              'AT', 'Western Europe',  'Europe',        '🇦🇹', 'Vienna'),
('Portugal',             'PT', 'Southern Europe', 'Europe',        '🇵🇹', 'Lisbon'),
('Finland',              'FI', 'Northern Europe', 'Europe',        '🇫🇮', 'Helsinki'),
('South Korea',          'KR', 'East Asia',        'Asia',          '🇰🇷', 'Seoul'),
('Brazil',               'BR', 'South America',   'South America', '🇧🇷', 'Brasília'),
('Mexico',               'MX', 'North America',   'North America', '🇲🇽', 'Mexico City'),
('Poland',               'PL', 'Eastern Europe',  'Europe',        '🇵🇱', 'Warsaw'),
('Czech Republic',       'CZ', 'Eastern Europe',  'Europe',        '🇨🇿', 'Prague'),
('Thailand',             'TH', 'Southeast Asia',  'Asia',          '🇹🇭', 'Bangkok'),
('Vietnam',              'VN', 'Southeast Asia',  'Asia',          '🇻🇳', 'Hanoi'),
('Indonesia',            'ID', 'Southeast Asia',  'Asia',          '🇮🇩', 'Jakarta'),
('India',                'IN', 'South Asia',       'Asia',          '🇮🇳', 'New Delhi'),
('China',                'CN', 'East Asia',        'Asia',          '🇨🇳', 'Beijing'),
('South Africa',         'ZA', 'Southern Africa', 'Africa',        '🇿🇦', 'Pretoria'),
('Argentina',            'AR', 'South America',   'South America', '🇦🇷', 'Buenos Aires'),
('Colombia',             'CO', 'South America',   'South America', '🇨🇴', 'Bogotá'),
('Chile',                'CL', 'South America',   'South America', '🇨🇱', 'Santiago'),
('Greece',               'GR', 'Southern Europe', 'Europe',        '🇬🇷', 'Athens'),
('Hungary',              'HU', 'Eastern Europe',  'Europe',        '🇭🇺', 'Budapest'),
('Romania',              'RO', 'Eastern Europe',  'Europe',        '🇷🇴', 'Bucharest'),
('Turkey',               'TR', 'Western Asia',    'Asia',          '🇹🇷', 'Ankara'),
('United Arab Emirates', 'AE', 'Western Asia',    'Asia',          '🇦🇪', 'Abu Dhabi')
ON CONFLICT (code) DO NOTHING;

-- ─────────────────────────────────────────────
-- SAMPLE REVIEWS (10 rows, approved = true)
-- ─────────────────────────────────────────────
INSERT INTO reviews (country, status, category, subcategory, score, title, comment, display_name, approved) VALUES
(
  'Netherlands', 'current_resident', 'infrastructure', 'Public Transport', 9.0,
  'Excellent public transport system',
  'The trains, trams, and buses are incredibly reliable and well-connected. Biking infrastructure is world-class. A bit expensive, but the system works and makes car ownership unnecessary for most.',
  'Amsterdam Local', true
),
(
  'Netherlands', 'current_resident', 'costOfLiving', 'Rent', 5.0,
  'Housing is the main pain point',
  'Quality of life is strong across the board, but rent and housing availability pull the overall score down significantly. Prices have risen sharply and availability in major cities is very limited.',
  'Local Reviewer', true
),
(
  'Japan', 'visited', 'safety', 'Night Safety', 10.0,
  'Felt extremely safe everywhere',
  'As a solo traveler, I felt completely safe walking around Tokyo and Kyoto even late at night. The cities are incredibly clean and orderly. Public transport is safe and comfortable at all hours.',
  'Travel Enthusiast', true
),
(
  'United States', 'former_resident', 'jobs', 'Career Growth', 8.5,
  'High opportunity but uneven life quality',
  'Career upside is real and the job market rewards ambition and skills. But healthcare costs and safety concerns vary heavily depending on where you live. The inequality is striking.',
  'Former NYC Resident', true
),
(
  'United States', 'former_resident', 'healthcare', 'Affordability', 4.0,
  'Healthcare costs are astronomical',
  'The quality of care can be excellent, but the cost and insurance complexity makes it extremely stressful. Medical bills can bankrupt families. This was one of the main reasons I left.',
  'Former NYC Resident', true
),
(
  'Germany', 'current_resident', 'healthcare', 'Access', 8.0,
  'Reliable but bureaucratic',
  'The system is stable and practical and covers most needs well. Waiting times for specialists can be long and the paperwork is extensive, but you know youre covered when you need it.',
  'Berlin Resident', true
),
(
  'United Kingdom', 'visited', 'lifestyle', NULL, 8.0,
  'Great culture and energy',
  'The cities have strong culture, history and creative energy. London especially has an incredible food scene and arts culture. The cost in major areas is very noticeable though.',
  'Visitor', true
),
(
  'Singapore', 'current_resident', 'safety', 'Crime', 9.5,
  'One of the safest places on earth',
  'Crime is virtually non-existent in day-to-day life. You can leave your laptop on a cafe table and walk away. The safety and cleanliness of the city is genuinely remarkable and consistent.',
  'Singapore Expat', true
),
(
  'Portugal', 'current_resident', 'costOfLiving', 'Rent', 7.5,
  'Still affordable compared to Western Europe',
  'Prices have gone up but Lisbon and Porto are still cheaper than Paris, London or Amsterdam for a comparable quality of life. The food, weather, and pace of life add a lot of value.',
  'Lisbon Resident', true
),
(
  'Canada', 'current_resident', 'healthcare', 'Waiting Times', 6.0,
  'Universal but slow',
  'You are covered and will not go bankrupt from medical bills, which is the most important thing. But wait times for specialists and non-emergency procedures can be extremely long.',
  'Toronto Resident', true
);
