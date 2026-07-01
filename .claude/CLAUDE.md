# StockSage 项目文档

## 分支策略
- **dev** — 活跃开发分支，Free + Pro ($9.99/月) 双 tier
- **main** — 保持 "Pricing Coming Soon" 屏蔽状态，不暴露定价

## 技术栈
| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| 图表 | lightweight-charts (candlestick + indicators) |
| 数据库 | PostgreSQL (Supabase) + Prisma ORM |
| Auth | Supabase Auth — **仅 Google OAuth**，无邮箱/密码登录 |
| 支付 | **Creem** (MoR), 测试环境用 test-api.creem.io |
| AI/LLM | OpenAI SDK (支持任意兼容 API), 模型通过 `LLM_MODEL` 环境变量配置 |
| 邮件 | Resend + @react-email/components |
| 数据源 | Yahoo Finance (行情/K线), Finnhub (新闻) |
| 部署 | Vercel |

## Tier 系统（重要）

### 只有 Free 和 Pro 两个 tier
- **Free**: watchlist 上限 **3 只股票**，其余功能与 Pro 完全一致
- **Pro**: $9.99/月，watchlist **无限**，功能与 Free 一致

### Tier 定义位置
- `src/lib/tiers.ts` — 配置数据（`TIERS` 对象 + `getTierConfig()`）
- `src/types/stock.ts` — `TierConfig` 类型定义
- `src/types/user.ts` — `UserProfile.tier` 类型

### Tier 限制实际执行情况
- **watchlist 数量限制**: `src/app/api/watchlists/[id]/stocks/route.ts` POST 时硬编码检查，超限返回 HTTP 402
- **其他 limits 字段**（dataDelayMinutes, aiSummariesPerWeek 等）：目前**未在 API 层实际执行**，仅作配置声明

## 功能清单：真实存在 vs 占位/死代码

### ✅ 真实可用的功能
1. **Watchlist** — 添加/删除股票，dashboard 展示行情+技术指标+AI 评分
2. **AI 新闻摘要** — `NewsTab` 组件，调用 `/api/stocks/[ticker]/ai-analysis`、`/api/stocks/[ticker]/summarize`
3. **AI 股票评分 (0-100)** — `/api/stocks/[ticker]/score`（规则评分）+ AI pipeline
4. **AI Pipeline** — `src/lib/ai-pipeline.ts`，cron 每日运行，拉新闻 → LLM 摘要 → LLM 评分 → 存入 `ai_daily_analysis`
5. **Market Heatmap** — `/heat` 页面，S&P 500 热力图，按 sector/market cap 分组
6. **Daily Email Digest** — cron 触发，`src/lib/daily-digest.ts`，读取 `email_preferences` 表
7. **Stock 详情页** — `/stock/[ticker]`，行情数据 + AI 分析（NewsTab）
8. **Dashboard** — `/dashboard`，watchlist 总览 + 技术信号 + AI 摘要
9. **Learning Center** — `/learn`，投资教育文章
10. **Newsletter 偏好设置** — `/newsletter`，开关 daily_digest / weekly_summary / price_alerts
11. **Position Size Calculator** — `/position-size-calculator`
12. **Settings** — `/settings`，显示当前 tier 和 Pro 到期时间
13. **Pricing 页面** — `/pricing`

### 🚧 占位页面（只有 UI 骨架，无实际功能）
- **Portfolio** (`/portfolio`) — 数据库有 `portfolio` 表，但页面只是 "No holdings yet" 空壳
- **Stock Screener** (`/screener`) — 页面显示 "Coming Soon"

### 💀 死代码（已实现但未渲染到任何页面）
- `src/components/charts/KLineChart.tsx` — candlestick + 成交量图，使用 lightweight-charts，但**没有被任何页面 import**
- `src/components/charts/TechnicalCharts.tsx` — MACD/RSI/Bollinger 等指标图，同样**未被使用**

### ⚠️ 切勿编造不存在的功能
编写 pricing 页面、文档、SEO 描述时，只能列出上述 ✅ 真实存在的功能。严禁添加 "Priority support"、"Price alerts"、"Advanced stock screener"、"Real-time data" 等未实现的功能。**"Popular" 标签等虚假营销元素禁止使用。**

## 支付系统 (Creem)

### 关键文件
- `src/lib/creem.ts` — API 封装（createCheckout, verifyWebhookSignature, getCustomerPortalUrl）
- `src/app/api/creem/checkout/route.ts` — 创建 checkout session
- `src/app/api/creem/webhook/route.ts` — 处理 webhook 事件
- `src/components/payment/CheckoutButton.tsx` — 前端升级按钮

### Webhook 关键细节（容易出错！）
Creem webhook payload 是**嵌套结构**，注意正确的字段路径：

| 事件 | 正确路径 | 错误（旧代码） |
|------|---------|--------------|
| customer ID | `object.customer.id` | ~~`object.customer_id`~~ |
| product ID | `object.product.id` | ~~`object.product_id`~~ |
| subscription ID | `object.subscription.id` 或 `object.id` | ~~`object.subscription_id`~~ |
| metadata.userId | `object.metadata.userId`（仅 checkout.completed 有） | — |
| billing_period | `object.product.billing_period` | — |

**Creem 不发送 `current_period_end` 字段**，需要根据 `billing_period` + `created_at` 自行计算：
- `"every-month"` → +1 month
- `"every-year"` → +1 year
- `"every-week"` → +7 days

Webhook 事件类型：
- `checkout.completed` — object 是 checkout session（包含 metadata.userId、subscription、product）
- `subscription.active` — object 是 subscription 本身（**无 metadata**，需通过 customer.id 反查 userId）
- `subscription.paid` — 同上，用于续费时刷新 current_period_end
- `subscription.canceled` / `subscription.expired` — downgrade 到 free

### 修复历史订阅
一次性脚本 `src/app/api/admin/fix-subscriptions/route.ts`：补填缺失的 `current_period_end`（created_at + 30 天）。通过 `?secret=<CRON_SECRET>` 鉴权，用完删除。

## 数据库

### 关键表（Prisma schema: `prisma/schema.prisma`）
- `profiles` — 用户扩展信息，`tier` 字段（"free" | "pro"）
- `subscriptions` — 订阅记录，关联 userId，字段含 `stripe_customer_id`(实际存 Creem customer id)、`current_period_end`
- `watchlists` / `watchlist_items` — 用户 watchlist
- `stocks` — 股票缓存（行情 + 基本面）
- `stock_prices` — K 线历史数据
- `ai_daily_analysis` — 每日 AI 分析结果（summary + score）
- `email_preferences` — 邮件偏好（daily_digest, weekly_summary, price_alerts, delivery_hour_utc）
- `email_logs` — 邮件发送日志
- `portfolio_briefs` — 每日 portfolio 级 AI 简报
- `tracked_tickers` — 全站被追踪的 ticker（由 ticker-sync 维护）

### Supabase 客户端
- `src/lib/supabase/server.ts` — 服务端（RSC/API routes），用 cookies 鉴权
- `src/lib/supabase/client.ts` — 浏览器端
- `src/lib/supabase/admin.ts` — service_role 绕过 RLS，仅用于 cron/webhook

## 项目结构

```
src/
├── app/
│   ├── (auth)/          # login, register, callback
│   ├── (dashboard)/     # 需登录的页面（dashboard, watchlist, heat, settings, portfolio, screener, newsletter, position-size-calculator）
│   ├── api/
│   │   ├── creem/       # 支付 API
│   │   ├── cron/        # Vercel Cron jobs
│   │   ├── stocks/      # 股票数据 API
│   │   ├── watchlists/  # watchlist CRUD
│   │   ├── dashboard/   # portfolio-brief
│   │   ├── heat/        # 热力图数据
│   │   ├── og/          # OG 图片生成
│   │   ├── debug/       # email-status
│   │   └── admin/       # 一次性管理脚本
│   ├── stock/[ticker]/  # 股票详情页（公开）
│   ├── learn/           # 学习中心
│   ├── pricing/         # 定价页
│   ├── about/           # 关于页
│   └── legal/           # 法律文档
├── components/
│   ├── charts/          # KLineChart, TechnicalCharts（⚠️ 死代码）
│   ├── dashboard/       # Sparkline, PortfolioBriefCard
│   ├── layout/          # Header, Footer, Sidebar, Providers
│   ├── news/            # NewsTab（AI 分析展示）
│   ├── payment/         # CheckoutButton
│   ├── stock/           # StockLogo, AddToWatchlistButton, TickerSearch
│   ├── shared/          # DataTable, MetricBadge, MetricSlider, PageHeader, SparklineChart
│   ├── seo/             # JsonLd
│   └── ui/              # shadcn/ui 组件
├── lib/
│   ├── ai.ts            # LLM 调用（summarizeNews, scoreStock, generatePortfolioBrief）
│   ├── ai-pipeline.ts   # 每日 AI pipeline（拉新闻 → 摘要 → 评分 → 存 DB）
│   ├── creem.ts         # Creem API 封装
│   ├── daily-digest.ts  # 邮件摘要生成+发送
│   ├── dashboard.ts     # Dashboard 数据聚合
│   ├── email.ts         # Resend 邮件发送
│   ├── logger.ts        # 日志工具
│   ├── market-status.ts # 美股市场开盘/收盘状态
│   ├── stock-api.ts     # Yahoo Finance + Finnhub API 调用
│   ├── stock-cache.ts   # Supabase 缓存读写
│   ├── technicals.ts    # 技术指标计算（MA/RSI/MACD/Bollinger）
│   ├── ticker-sync.ts   # 同步 tracked_tickers 表
│   └── supabase/        # Supabase 客户端
├── types/               # TypeScript 类型定义
├── data/                # 静态数据（S&P 500 tickers, learn articles, legal content）
└── emails/              # React Email 模板
```

## 环境变量（关键）
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase
- `DATABASE_URL` — PostgreSQL 直连
- `LLM_API_KEY` / `LLM_BASE_URL` / `LLM_MODEL` — AI 模型配置
- `FINNHUB_API_KEY` — 新闻数据
- `CRON_SECRET` — Cron job + 管理 API 鉴权
- `CREEM_API_KEY` / `CREEM_WEBHOOK_SECRET` / `CREEM_PRODUCT_ID` — 支付
- `RESEND_API_KEY` — 邮件发送
- `NEXT_PUBLIC_APP_URL` — 应用 URL

## 开发注意事项
1. **问题改完后再重新检查一遍**，确保无遗漏
2. 修改 tier 相关逻辑时，需同步更新 `tiers.ts`、`pricing/page.tsx`、`settings/page.tsx`、`WatchlistClient.tsx`
3. **禁止编造不存在的功能**到任何用户可见的文案中
4. `middleware.ts` 目前只做 Supabase cookie 刷新，**不做 auth check**（auth 在 page layout 和 API route 各自处理）
5. K 线图表组件虽然已实现，但需要接入到股票详情页才能真正上线
6. Newsletter 页面的 `price_alerts` 开关只是 UI，后端无实际 alert 逻辑
7. 影响网站核心功能的重要决策需要征得开发者同意才能执行，不要擅自决定
8. Cron使用github action,不要用vercel cron