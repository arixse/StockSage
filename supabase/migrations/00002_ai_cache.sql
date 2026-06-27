-- AI Analysis cache table for daily cron-based analysis
CREATE TABLE IF NOT EXISTS public.ai_daily_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL,
  analysis_date DATE NOT NULL,
  -- AI summary fields
  summary_text TEXT,
  key_points JSONB DEFAULT '[]',
  sentiment TEXT,          -- bullish | bearish | neutral
  confidence REAL DEFAULT 0,
  -- AI score fields
  overall_score INTEGER,
  technical_score INTEGER,
  fundamental_score INTEGER,
  sentiment_score INTEGER,
  recommendation TEXT,     -- strong_buy | buy | hold | sell | strong_sell
  score_summary TEXT,
  -- Meta
  articles_count INTEGER DEFAULT 0,
  model_used TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(ticker, analysis_date)
);

CREATE INDEX IF NOT EXISTS idx_ai_daily_ticker_date ON ai_daily_analysis(ticker, analysis_date DESC);

-- Public read access
ALTER TABLE public.ai_daily_analysis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "AI analysis publicly readable" ON ai_daily_analysis;
CREATE POLICY "AI analysis publicly readable" ON ai_daily_analysis FOR SELECT USING (true);

-- Ticker tracking table for cron job
CREATE TABLE IF NOT EXISTS public.tracked_tickers (
  ticker TEXT PRIMARY KEY,
  added_at TIMESTAMPTZ DEFAULT now()
);

-- Populate from existing watchlists
INSERT INTO public.tracked_tickers (ticker)
SELECT DISTINCT wi.ticker
FROM public.watchlist_items wi
ON CONFLICT (ticker) DO NOTHING;

ALTER TABLE public.tracked_tickers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tracked tickers publicly readable" ON tracked_tickers;
CREATE POLICY "Tracked tickers publicly readable" ON tracked_tickers FOR SELECT USING (true);
