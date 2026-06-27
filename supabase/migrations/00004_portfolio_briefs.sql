-- AI portfolio briefs — daily, per-user LLM-generated summary of the user's watchlist.
-- Cached to avoid repeated LLM calls; tickers_snapshot lets us detect when the
-- brief is stale relative to the current watchlist.
CREATE TABLE IF NOT EXISTS public.portfolio_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brief_date DATE NOT NULL,
  content JSONB NOT NULL,
  tickers_snapshot TEXT[] NOT NULL DEFAULT '{}',
  model_used TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, brief_date)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_briefs_user_date
  ON portfolio_briefs(user_id, brief_date);

ALTER TABLE public.portfolio_briefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own briefs" ON public.portfolio_briefs;
CREATE POLICY "Users read own briefs" ON public.portfolio_briefs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own briefs" ON public.portfolio_briefs;
CREATE POLICY "Users insert own briefs" ON public.portfolio_briefs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own briefs" ON public.portfolio_briefs;
CREATE POLICY "Users update own briefs" ON public.portfolio_briefs
  FOR UPDATE USING (auth.uid() = user_id);
