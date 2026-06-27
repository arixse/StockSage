-- Initial schema for StockSage
-- Run this in Supabase SQL Editor to set up the database

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  tier TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  tier TEXT NOT NULL DEFAULT 'free',
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Watchlists
CREATE TABLE IF NOT EXISTS public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Watchlist',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(watchlist_id, ticker)
);

-- Portfolios
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  shares NUMERIC(15,6) NOT NULL DEFAULT 0,
  avg_cost NUMERIC(15,4),
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, ticker)
);

-- Stocks cache
CREATE TABLE IF NOT EXISTS public.stocks (
  ticker TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  sector TEXT,
  industry TEXT,
  exchange TEXT,
  market_cap BIGINT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stock prices (daily OHLCV)
CREATE TABLE IF NOT EXISTS public.stock_prices (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ticker TEXT NOT NULL REFERENCES stocks(ticker) ON DELETE CASCADE,
  trade_date DATE NOT NULL,
  open NUMERIC(15,4),
  high NUMERIC(15,4),
  low NUMERIC(15,4),
  close NUMERIC(15,4),
  adj_close NUMERIC(15,4),
  volume BIGINT,
  UNIQUE(ticker, trade_date)
);

CREATE INDEX IF NOT EXISTS idx_stock_prices_ticker_date ON stock_prices(ticker, trade_date);

-- AI analyses cache
CREATE TABLE IF NOT EXISTS public.ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL REFERENCES stocks(ticker) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  content JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_analyses_ticker_type ON ai_analyses(ticker, analysis_type);

-- News articles
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL REFERENCES stocks(ticker) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT,
  published_at TIMESTAMPTZ,
  summary TEXT,
  sentiment TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_articles_ticker_date ON news_articles(ticker, published_at);

-- Email preferences
CREATE TABLE IF NOT EXISTS public.email_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_digest BOOLEAN NOT NULL DEFAULT true,
  weekly_summary BOOLEAN NOT NULL DEFAULT false,
  price_alerts BOOLEAN NOT NULL DEFAULT false,
  delivery_hour_utc INT NOT NULL DEFAULT 13
);

-- Email logs
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  resend_id TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  error_message TEXT
);

---- RLS Policies ----

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can read own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Watchlists
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can CRUD own watchlists" ON watchlists FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can CRUD own watchlist items" ON watchlist_items
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM watchlists WHERE id = watchlist_id)
  );

-- Portfolios
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can CRUD own portfolios" ON portfolios FOR ALL USING (auth.uid() = user_id);

-- Email preferences
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can manage own email prefs" ON email_preferences FOR ALL USING (auth.uid() = user_id);

-- Email logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can read own email logs" ON email_logs FOR SELECT USING (auth.uid() = user_id);

-- Stocks are public read
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Stocks are publicly readable" ON stocks FOR SELECT USING (true);

ALTER TABLE public.stock_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Stock prices are publicly readable" ON stock_prices FOR SELECT USING (true);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "News articles are publicly readable" ON news_articles FOR SELECT USING (true);

ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "AI analyses are publicly readable" ON ai_analyses FOR SELECT USING (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, tier)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    'free'
  );
  INSERT INTO public.email_preferences (user_id) VALUES (NEW.id);
  INSERT INTO public.watchlists (user_id, name) VALUES (NEW.id, 'My Watchlist');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
