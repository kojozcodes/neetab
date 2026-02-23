# Neetab — Neat tools. One tab.

Free online calculators, converters, design tools & file converters. Fast, private, beautifully simple.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
neetab/
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Router setup
│   ├── index.css                   # Tailwind + global styles
│   ├── components/
│   │   ├── Header.tsx              # Sticky nav with theme toggle
│   │   ├── Footer.tsx              # SEO internal links
│   │   ├── ToolCard.tsx            # Home grid card
│   │   ├── SEO.tsx                 # React Helmet per-page meta
│   │   ├── AdSlot.tsx              # Google AdSense component
│   │   └── ui/                     # Reusable UI primitives
│   │       ├── Icons.tsx
│   │       ├── Input.tsx
│   │       ├── FormControls.tsx    # Select, Slider, Toggle, Button
│   │       ├── ResultBox.tsx
│   │       └── FileComponents.tsx  # FileUpload, PrivacyBadge, DownloadBtn
│   ├── pages/
│   │   ├── Home.tsx                # Landing with search & categories
│   │   └── ToolPage.tsx            # Dynamic tool renderer
│   ├── tools/
│   │   ├── registry.ts             # Central tool registry (routes, SEO, lazy imports)
│   │   ├── calculators/            # 6 calculators
│   │   ├── design/                 # 3 design tools
│   │   ├── file/                   # 5 file converters
│   │   ├── converters/             # 1 unit converter
│   │   ├── text/                   # 3 text tools
│   │   └── generators/             # 1 password generator
│   ├── hooks/
│   │   └── useTheme.ts             # Dark/light with localStorage
│   └── utils/
│       └── color.ts                # Color conversion utilities
├── backend/
│   ├── server.py                   # FastAPI conversion API
│   ├── requirements.txt
│   └── Dockerfile
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── index.html                      # Entry with structured data
├── vite.config.ts                  # Vite + PWA + code splitting
├── tailwind.config.js              # Custom design tokens
├── docker-compose.yml
└── package.json
```

## 🛠️ Tools (19 total)

| Category | Tools |
|----------|-------|
| 🧮 Calculators (6) | Tip, Percentage, Discount, BMI, Age, Loan |
| 🎨 Design Tools (3) | Color Palette Generator, Gradient Maker, Color Converter |
| 📄 File Tools (5) | PDF→Image, Image→PDF, Image Compressor, PDF→Word, Word→PDF |
| 🔄 Converters (1) | Unit Converter (7 categories) |
| 📝 Text Tools (3) | Word Counter, Case Converter, Lorem Ipsum |
| ⚡ Generators (1) | Password Generator |

## 🔍 SEO Architecture

Every tool has its own URL for Google indexing:

```
neetab.com/tools/tip-calculator
neetab.com/tools/pdf-to-word
neetab.com/tools/color-palette-generator
neetab.com/tools/image-compressor
...
```

Each page includes:
- Unique `<title>` optimized for search intent
- Meta description with primary keywords
- JSON-LD WebApplication structured data
- Open Graph + Twitter Card meta
- Breadcrumb navigation
- Internal linking via footer
- Canonical URLs

## 💰 Revenue Setup

### Google AdSense

1. Sign up at [adsense.google.com](https://adsense.google.com)
2. Replace `ca-pub-XXXXXXXXXX` in `index.html` and `AdSlot.tsx`
3. Create ad units and update slot IDs

**Ad placement strategy (non-intrusive):**
- 1 ad below hero on home page
- 1 ad between tool categories
- 1 ad below tool results on each tool page
- Never mid-tool or blocking user workflow

### Google Analytics 4

1. Create property at [analytics.google.com](https://analytics.google.com)
2. Replace `G-XXXXXXXXXX` in `index.html`
3. Track: which tools get most traffic, conversion rates, user retention

### Premium Tier (Future)

- Ad-free experience
- Batch file processing
- Higher file size limits
- Premium themes

## 🐳 Backend Deployment (File Conversion)

The backend uses `pdf2docx` + LibreOffice for production-quality file conversions.

### Option A: Railway / Fly.io (Recommended)

```bash
# Railway
cd backend
railway init
railway up

# Fly.io
cd backend
fly launch
fly deploy
```

### Option B: Docker

```bash
# Build and run
docker-compose up -d

# Or just the backend
cd backend
docker build -t neetab-api .
docker run -p 8000:8000 neetab-api
```

### Option C: Manual

```bash
cd backend
pip install -r requirements.txt
# Install LibreOffice: sudo apt install libreoffice
python server.py
```

## 📱 PWA Features

- Installable on mobile & desktop
- Works offline (all client-side tools)
- Cached fonts and assets
- Auto-updates via service worker

## 🎨 Design System

- **Typography:** DM Sans (body) + DM Serif Display (headings) + JetBrains Mono (code)
- **Colors:** Warm neutrals with orange (#FF6B35) accent
- **Dark mode:** Full dark theme with localStorage persistence
- **Animations:** Staggered fade-in, slide-up, hover effects
- **Shadows:** Layered soft shadows, elevation on hover

## 📈 Growth Roadmap

### Phase 1 ✅ (Current)
- 19 tools across 6 categories
- SEO-optimized routing
- PWA support
- Dark/light mode
- Client-side file processing

### Phase 2 (Next)
- Server-side PDF/Word conversion (backend)
- Google AdSense integration
- Google Analytics
- Sitemap submission to Google Search Console

### Phase 3 (Growth)
- 30+ tools (QR Code, JSON Formatter, Base64, Regex Tester...)
- Premium tier with Stripe
- User accounts (optional, for syncing preferences)
- Blog for SEO content marketing
- Social sharing features

## License

MIT
