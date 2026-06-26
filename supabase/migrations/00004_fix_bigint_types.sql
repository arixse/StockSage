-- Fix BIGINT columns that receive decimal values from financial APIs.
-- Yahoo Finance returns market_cap, revenue, etc. as floats; BIGINT rejects them.

-- stocks table: market_cap, revenue_ttm, net_income_ttm → NUMERIC
ALTER TABLE public.stocks
  ALTER COLUMN market_cap TYPE NUMERIC(20,2);

ALTER TABLE public.stocks
  ALTER COLUMN revenue_ttm TYPE NUMERIC(20,2);

ALTER TABLE public.stocks
  ALTER COLUMN net_income_ttm TYPE NUMERIC(20,2);

-- stocks table: volume (should be integer but NUMERIC is safer against API quirks)
ALTER TABLE public.stocks
  ALTER COLUMN volume TYPE NUMERIC(20,0);

-- stock_prices table: volume
ALTER TABLE public.stock_prices
  ALTER COLUMN volume TYPE NUMERIC(20,0);
