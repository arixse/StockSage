-- AI portfolio allocations — daily, per-user LLM-generated allocation recommendations.
-- Cached to avoid repeated LLM calls; tickers_snapshot lets us detect when the
-- allocation is stale relative to the current watchlist.
CREATE TABLE IF NOT EXISTS public.portfolio_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  allocation_date DATE NOT NULL,
  content JSONB NOT NULL,
  tickers_snapshot TEXT[] NOT NULL DEFAULT '{}',
  model_used TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, allocation_date)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_allocations_user_date
  ON portfolio_allocations(user_id, allocation_date);

ALTER TABLE public.portfolio_allocations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own allocations" ON public.portfolio_allocations;
CREATE POLICY "Users read own allocations" ON public.portfolio_allocations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own allocations" ON public.portfolio_allocations;
CREATE POLICY "Users insert own allocations" ON public.portfolio_allocations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own allocations" ON public.portfolio_allocations;
CREATE POLICY "Users update own allocations" ON public.portfolio_allocations
  FOR UPDATE USING (auth.uid() = user_id);
