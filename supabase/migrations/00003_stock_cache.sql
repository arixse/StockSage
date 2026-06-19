-- Stock cache expansion: adds quote + fundamental columns to stocks table
-- The stocks table becomes the single-row-per-ticker cache for both quotes and fundamentals.
-- stock_prices table (UNIQUE ticker,trade_date) handles historical OHLCV separately.

-- Quote fields (latest price snapshot)
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS price NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS change_val NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS change_percent NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS high NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS low NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS open NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS prev_close NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS volume BIGINT;
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS exchange_name TEXT;
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS short_name TEXT;
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS quote_timestamp TIMESTAMPTZ;
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS quotes_updated_at TIMESTAMPTZ;

-- Fundamental fields
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS pe_ratio NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS forward_pe NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS eps_ttm NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS pb_ratio NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS dividend_yield NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS beta NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS revenue_ttm BIGINT;
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS net_income_ttm BIGINT;
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS roe NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS roa NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS gross_margin NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS operating_margin NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS net_margin NUMERIC(15,4);
ALTER TABLE public.stocks ADD COLUMN IF NOT EXISTS fundamentals_updated_at TIMESTAMPTZ;

-- Auto-update updated_at trigger (preserves existing last_updated column on stocks)
CREATE OR REPLACE FUNCTION public.update_stocks_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_stocks_updated_at ON public.stocks;
CREATE TRIGGER trg_stocks_updated_at
  BEFORE UPDATE ON public.stocks
  FOR EACH ROW EXECUTE FUNCTION public.update_stocks_updated_at();
