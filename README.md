实施步骤

     阶段 1：A + C（纯复用，服务端渲染）

     1.1 新增批量数据聚合层 src/lib/dashboard.ts

     集中 Dashboard 的数据获取，避免 page.tsx 膨胀。导出 getWatchlistInsights(userId)，并行拉取并组装每只股票的洞察：

     - watchlist tickers（沿用现有查询）
     - getCachedQuotes(tickers) + 盘中 stale 刷新（沿用 page.tsx:33-58 逻辑，迁移到此）
     - Promise.all(tickers.map(t => getCachedChart(t, "1y"))) → 每只跑 latestTechnicals(bars) 得 ma/rsi/macd/volumeMA20
     - 批量查 ai_daily_analysis：.from("ai_daily_analysis").select("*").in("ticker", tickers).order("analysis_date",{ascending:false}) → 内存里每个 ticker 取最新一行（overall_score / recommendation / sentiment）
     - 新增 getCachedCompanyOverviewsBatch(tickers)（stock-cache.ts，镜像 getCachedQuotes，复用 rowToOverview）取 sector 等基本面

     返回结构：{ watchlistId, stocks: Array<StockInsight>, signals, portfolioHealth }，其中每条 StockInsight = 报价 + 技术指标 + AI 评分 + sector。

     1.2 新增信号/健康度纯计算（同文件或 src/lib/dashboard-signals.ts）

     全部基于已获取数据，零外部调用：

     - 每只股票的信号标签（用于表格列 + 「今日值得关注」清单）：
       - 趋势：price vs ma20/ma60/ma200 → 多头排列 / 均线下方
       - RSI：>70 超买 / <30 超卖 / 中性
       - MACD：histogram 正→「多头」、负→「空头」（可选检测金叉：当前 hist>0 且前一根<0）
       - 量能异常：volume > 1.5 × volumeMA20
       - 临近支撑/压力：price 接近布林下轨/上轨（±2%）
     - portfolioHealth（基于 watchlist）：
       - 平均 AI overall_score（等权）
       - bullish/bearish/neutral 分布（计数）
       - 板块集中度：按 sector 聚合，提示占比 >50% 的板块（"科技股占比 70%，分散度不足"）
       - 整体趋势分布（多少只站上 MA20）

     1.3 改造 src/app/(dashboard)/dashboard/page.tsx

     - 改为调用 getWatchlistInsights(user.id)
     - 顶部 stats 卡片区（现有 3 张）下方新增 2 张卡：
       - Portfolio Health：平均 AI 评分 + 情绪分布（小条形/badge）+ 板块集中度提示
       - Today's Signals：「今日值得关注」清单——列出有显著信号的标的（量能异动 / RSI 超买卖 / MACD 金叉死叉 / 临近布林边界），每条带 ticker 链接 + 信号 badge
     - 改造 watchlist 表格新增列（保留现有 Ticker/Price/Change/Change%/Volume）：
       - AI Score：overall_score 数字 + recommendation badge（复用 NewsTab 配色）
       - Trend：相对 MA20/MA60 位置（↑ 多头 / ↓ 空头 badge）
       - RSI：数值 + 超买/超卖着色
       - MACD：多头/空头小标
       - Vol：量比（当日量 / volumeMA20），>1.5 标红
     - 表格保持 overflow-x-auto（列变多，横向滚动可接受）

     ▎ 全部服务端渲染，无新客户端依赖。AI 评分/技术指标为空时优雅降级显示 "—"。

     阶段 2：D — AI 组合简报（新增 LLM，日级缓存）

     2.1 新增 migration supabase/migrations/00004_portfolio_briefs.sql

     CREATE TABLE IF NOT EXISTS public.portfolio_briefs (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
       brief_date DATE NOT NULL,
       content JSONB NOT NULL,        -- { summary, highlights:[], risks:[], actionItems:[] }
       tickers_snapshot TEXT[] NOT NULL,  -- 生成时所基于的 watchlist，便于判断是否过期
       model_used TEXT,
       generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
       UNIQUE(user_id, brief_date)
     );
     CREATE INDEX idx_portfolio_briefs_user_date ON portfolio_briefs(user_id, brief_date);
     ALTER TABLE public.portfolio_briefs ENABLE ROW LEVEL SECURITY;
     CREATE POLICY "Users read own briefs" ON portfolio_briefs FOR SELECT USING (auth.uid() = user_id);
     CREATE POLICY "Users insert own briefs" ON portfolio_briefs FOR INSERT WITH CHECK (auth.uid() = user_id);
     CREATE POLICY "Users update own briefs" ON portfolio_briefs FOR UPDATE USING (auth.uid() = user_id);

     2.2 src/lib/ai.ts 新增 generatePortfolioBrief(input)

     - 同文件内复用私有 jsonChat（JSON 解析容错已内置）
     - 入参：watchlist 标的的汇总（ticker / price / change% / AI overall_score / recommendation / sentiment / RSI / 趋势 / 量比 / sector）
     - 出参：{ summary: string, highlights: string[], risks: string[], actionItems: string[] }
     - prompt 指示：3-5 句组合级洞察，聚焦异动、风险、可执行项；不重复单股罗列

     2.3 新增 API src/app/api/dashboard/portfolio-brief/route.ts

     - GET：查 portfolio_briefs 当天记录；若 tickers_snapshot 与当前 watchlist 不一致或无记录，返回 { hasBrief: false }
     - POST：用 getWatchlistInsights(user.id) 聚合数据 → generatePortfolioBrief() → upsert 到 portfolio_briefs（用 server admin client 写自己的行，或用 RLS server client）。返回 brief
     - 鉴权：createClient().auth.getUser() 校验（沿用现有 API 模式）

     2.4 新增客户端组件 src/components/dashboard/PortfolioBriefCard.tsx

     - 复用 NewsTab.tsx 的交互范式：mount 时 GET；无缓存时显示「生成今日组合简报」按钮 → POST；loading 显示 spinner
     - 渲染 summary + highlights/risks/actionItems 列表
     - 在 page.tsx 顶部插入此卡（客户端组件，不阻塞服务端渲染）

     阶段 3：B — 迷你 Sparkline

     3.1 新增 src/components/dashboard/Sparkline.tsx（服务端组件，纯 SVG）

     - 入参：closes: number[]、width、height、positive: boolean（涨绿跌红）
     - 输出 inline SVG polyline，归一化到画布；无新依赖（不引入 lightweight-charts，表格内 sparkline 用 SVG 更轻）
     - 数据源：阶段 1 已为每只股票拉取的 1y chart closes，截取最近 30/60 根

     3.2 在 watchlist 表格末尾加 Trend (30d) 列，渲染 <Sparkline closes={...} positive={change>=0} />

     - closes 来自 getWatchlistInsights 已缓存的 chart 数据，零额外查询

     ---
     关键文件清单

     新增
     - src/lib/dashboard.ts — 数据聚合 + 信号/健康度计算
     - src/lib/dashboard-signals.ts（或并入 dashboard.ts）— 纯信号计算
     - supabase/migrations/00004_portfolio_briefs.sql
     - src/app/api/dashboard/portfolio-brief/route.ts
     - src/components/dashboard/PortfolioBriefCard.tsx
     - src/components/dashboard/Sparkline.tsx

     修改
     - src/app/(dashboard)/dashboard/page.tsx — 调用聚合层，新增卡片 + 表格列
     - src/lib/stock-cache.ts — 新增 getCachedCompanyOverviewsBatch(tickers)
     - src/lib/ai.ts — 新增 generatePortfolioBrief()

     ---
     性能与降级

     - 阶段 1 对每只 watchlist 股票并行取 chart + 算技术指标（Promise.all）；watchlist ~10-20 只，单次请求可接受。page.tsx 保持 force-dynamic。
     - 所有增强字段（AI 评分 / 技术指标 / sector）为空时显示 "—"，不阻塞主表格。
     - D 的 LLM 调用仅在用户点击或当天无缓存时触发，日级 TTL + tickers_snapshot 变化检测避免过期简报。
     - 若 LLM_API_KEY 未配置，generatePortfolioBrief 返回 null，卡片显示降级提示（沿用 ai-pipeline.ts 的 getLLMClient 检测模式）。

     ---
     验证

     1. migration：本地 Supabase 执行 00004_portfolio_briefs.sql，确认表与 RLS policy 创建成功。
     2. A+C：npm run dev → 登录 → /dashboard，确认：
       - 表格新增列正确显示 AI score / Trend / RSI / MACD / Vol 量比
       - Portfolio Health 卡显示平均评分、情绪分布、板块集中度
       - Today's Signals 卡列出有异动的标的
       - AI/技术数据为空的股票显示 "—" 不报错
     3. D：点击「生成今日组合简报」→ 确认 loading → 简报文本出现；刷新页面确认读缓存（不再调 LLM）；修改 watchlist 后确认提示重新生成。
     4. B：确认每行 sparkline 正确渲染、涨绿跌红、缩放到 30 天。
     5. 端到端：在 watchlist 为空、单只股票、AI 分析缺失等边界下页面不崩溃。