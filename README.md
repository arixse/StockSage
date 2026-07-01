# StockSage

AI-powered US stock analysis and scoring platform. Free for 5 stocks. Covering NYSE & NASDAQ.

![StockSage](https://www.stocksage.xyz/api/og)

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
| Market Data | [Finnhub](https://finnhub.io) |
| AI / LLM | DeepSeek (via OpenAI-compatible API) |
| Email | [Resend](https://resend.com) |
| Styling | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Payments | [Creem](https://creem.io) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- [Finnhub](https://finnhub.io) API key (free tier works)
- A DeepSeek or OpenAI-compatible API key for AI features

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
DATABASE_URL=postgresql://...

# Finnhub
FINNHUB_API_KEY=your-key

# AI (OpenAI-compatible)
DEEPSEEK_API_KEY=your-key
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
LLM_MODEL=deepseek-chat

# Email (Resend)
RESEND_API_KEY=your-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CREEM_API_KEY=your-key  # optional — payments
```

### Database

```bash
# Push Prisma schema to Supabase
npx prisma db push

# Or run migrations
npx prisma migrate dev
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
│   ├── seo/                 # JsonLd schema component
│   ├── shared/              # PageHeader, DataTable
│   └── ui/                  # shadcn/ui primitives
├── data/                    # Static data (learn articles, etc.)
├── lib/                     # Business logic
│   ├── ai.ts                # LLM calls (summaries, scoring, portfolio brief)
│   ├── stock-api.ts         # Finnhub API client
│   ├── stock-cache.ts       # Supabase cache layer
│   ├── market-status.ts     # Market open/close detection
│   └── supabase/            # Supabase client (server + browser)
└── hooks/                   # React hooks
```

---

## API Routes

| Endpoint | Description |
|----------|-------------|
| `GET /api/stocks` | List/search stocks |
| `GET /api/stocks/[ticker]` | Stock quote + overview |
| `GET /api/stocks/[ticker]/chart` | Historical price data |
| `GET /api/stocks/[ticker]/news` | Recent news articles |
| `GET /api/stocks/[ticker]/score` | AI composite score |
| `GET /api/stocks/[ticker]/ai-analysis` | Cached AI summary |
| `POST /api/stocks/[ticker]/summarize` | Generate new AI summary |
| `GET /api/heat` | S&P 500 heatmap data |
| `GET /api/watchlists` | User watchlists |
| `POST /api/cron/*` | Scheduled tasks (news fetch, stock data refresh, daily digest) |
| `POST /api/creem/webhook` | Payment webhook |

---

## Cron Jobs (Vercel Cron)

| Job | Schedule | Description |
|-----|----------|-------------|
| `cron-fetch-news` | Every 60 min (market hours) | Fetch latest news for tracked stocks |
| `cron-fetch-stock-data` | Every 15 min (market hours) | Refresh stock quotes for watchlists |
| `cron-daily-digest` | Daily 22:30 UTC | Send daily email briefing to subscribers |

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Links

- **Website:** [stocksage.xyz](https://stocksage.xyz)
- **GitHub:** [github.com/arixse/StockSage](https://github.com/arixse/StockSage)

---

Built by [@arixse](https://github.com/arixse). Feedback and contributions welcome.
