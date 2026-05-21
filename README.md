# CountryScore v2.0

> A modern platform for real country reviews from residents, expats, students, and travelers.

## 🌍 About

CountryScore allows people to review and rate countries based on real-world experience across 8 key categories:
- Cost of Living
- Safety
- Jobs
- Healthcare
- Education
- Freedom
- Lifestyle
- Infrastructure

Reviews are weighted by the reviewer's connection to the country (residents > former residents > visitors > outside opinions).

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Row Level Security)
- **Routing:** React Router v6
- **Charts:** Recharts
- **Icons:** Lucide React
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/LetsGo235/CountryScore.git
cd CountryScore
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set up the database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration scripts from `PLAN.md` (Database Migration SQL section)

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure
countryscore-v2/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/            # Page-level components (routes)
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions, constants
│   ├── styles/           # Global CSS
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
├── public/               # Static assets
├── .env.example         # Example environment variables
└── PLAN.md              # Detailed project plan and progress

## 🎨 Design System

### Colors
- **Primary Blue:** `#1579b8`
- **Success Green:** `#28a86b`
- **Navy:** `#0b2638`

### Components
All components use Tailwind CSS utility classes. Custom theme extensions are defined in `tailwind.config.js`.

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 📦 Deployment

See PLAN.md for full deployment instructions.

## 📄 License

MIT

---

**Built with ❤️ for travelers, expats, and global citizens.**