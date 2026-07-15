# StockSage

AI-powered US stock analysis and scoring platform. Free for 5 stocks. Covering NYSE & NASDAQ.

**🔗 [stocksage.xyz](https://stocksage.xyz)**

---

## What It Does

StockSage reads hundreds of financial news articles every day so you don't have to. For any US stock, you get:

- **AI News Summary** — one-paragraph digest of the latest news and its market impact
- **Composite Score (0-100)** — combining technical indicators, fundamentals, and news sentiment
- **Buy / Hold / Sell Signal** — data-driven, not financial advice
- **Market Heatmap** — S&P 500 treemap colored by daily performance, sized by market cap
- **Personalized Watchlist** — track your stocks, get daily email briefings
- **Learning Center** — free educational articles on portfolio building, value investing, ETFs, and more

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org) (App Router) |
| Hosting | [Vercel](https://vercel.com) |
| Database | [Supabase](https://supabase.com) (PostgreSQL + Auth) |
| ORM | [Prisma](https://prisma.io) |
| Market Data | [Finnhub](https://finnhub.io) (primary) + Alpha Vantage / Twelve Data (fallbacks) |
| AI / LLM | OpenAI-compatible API |
| Email | [Resend](https://resend.com) |
| Styling | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- [Finnhub](https://finnhub.io) API key (free tier works)
- An OpenAI-compatible API key for AI features (DeepSeek, OpenAI, Groq, etc.)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/arixse/StockSage.git
cd StockSage

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Fill in `.env.local`:

```env
# Supabase   
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Market Data (Finnhub primary, Alpha Vantage fallback)
FINNHUB_API_KEY=your-key
ALPHA_VANTAGE_API_KEY=demo

# LLM (OpenAI-compatible — DeepSeek, OpenAI, Groq, Ollama, etc.)
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=sk-...
LLM_MODEL=gpt-4o-mini

# Email (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=newsletter@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=StockSage

# Cron Secret (protect cron endpoints)
CRON_SECRET=change-me-in-production

# Payments (Creem — optional)
CREEM_API_KEY=creem_test_...
CREEM_WEBHOOK_SECRET=whsec_...
CREEM_PRODUCT_ID=prod_...
```

### Database

```bash
# Push Prisma schema to Supabase (no migration files needed)
npx prisma db push
```

### Run

```bash
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/              # Login / Register
│   ├── (dashboard)/         # Dashboard, Watchlist, Heatmap, Settings
│   ├── api/                 # API routes (stocks, watchlists, cron, etc.)
│   ├── about/               # About page
│   ├── learn/               # Learning Center + articles
│   ├── legal/               # Terms, Privacy, Cookies, Disclaimer
│   ├── pricing/             # Pricing page
│   └── stock/[ticker]/      # Individual stock analysis pages
├── components/              # React components
│   ├── layout/              # Header, Footer, Sidebar, Providers
│   ├── stock/               # StockLogo, TickerSearch, AddToWatchlist
│   ├── news/                # AI news analysis tab
│   ├── dashboard/           # Dashboard components
│   ├── charts/              # Chart components (lightweight-charts)
│   ├── auth/                # Auth UI components
│   ├── payment/             # Subscription / billing UI
│   ├── seo/                 # JsonLd schema component
│   ├── shared/              # PageHeader, DataTable
│   └── ui/                  # shadcn/ui primitives
├── data/                    # Static data (learn articles, legal content, ticker lists)
├── lib/                     # Business logic
│   ├── ai.ts                # LLM calls (summaries, scoring)
│   ├── ai-pipeline.ts       # AI analysis pipeline orchestration
│   ├── stock-api.ts         # Market data (Finnhub + Alpha Vantage + Twelve Data)
│   ├── stock-cache.ts       # Supabase cache layer for stock data
│   ├── technicals.ts        # Technical indicator calculations
│   ├── market-status.ts     # Market open/close detection
│   ├── daily-digest.ts      # Daily email digest logic
│   ├── email.ts             # Email sending (Resend)
│   ├── dashboard.ts         # Dashboard data aggregation
│   ├── ticker-sync.ts       # Tracked ticker synchronization
│   └── supabase/            # Supabase client (server + browser)
└── prisma/                  # Prisma schema
```

---


## Links

- **Website:** [stocksage.xyz](https://stocksage.xyz)
- **GitHub:** [github.com/arixse/StockSage](https://github.com/arixse/StockSage)

---

Built by [@arixse](https://github.com/arixse). Feedback and contributions welcome.
