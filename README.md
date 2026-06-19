实施阶段

 Phase 1: 项目初始化 + 基础架构 (1-3天)

1. 创建 Next.js 项目 — npx create-next-app@latest
2. 安装依赖 — Tailwind, shadcn/ui, Supabase client, Prisma, TanStack Query
3. Supabase 项目创建 — 创建项目，获取 API keys
4. Prisma schema — 定义所有表结构，执行迁移
5. Supabase Auth 集成 — 中间件保护路由，登录/注册页面
6. 基础布局 — Sidebar + Header + Dashboard Shell

 Phase 2: 股票数据 (3-5天)

1. 初始化美股列表 — 脚本获取所有 NYSE/NASDAQ 股票
2. 股票搜索 API — /api/stocks?q=AAPL
3. K线数据 — Alpha Vantage API 获取 OHLCV → /api/stocks/[ticker]/chart
4. K线图组件 — TradingView Lightweight Charts 封装
5. 技术指标计算 — 服务端计算 MA/MACD/RSI/布林带
6. 个股详情页 — SSR + ISR 渲染

 Phase 3: AI 分析 (2-3天)

1. 新闻抓取 — Alpha Vantage News API 或 NewsAPI
2. AI 摘要 — OpenAI/Claude 批量总结新闻
3. AI 评分 — 综合技术面+基本面+情绪面评分
4. Vercel Cron — 定时触发数据更新和 AI 分析
5. 前端展示 — AI 摘要面板 + 评分徽章

 Phase 4: 用户功能 + 支付 (2-3天)

1. 自选股 — 增删改查 + 拖拽排序
2. 投资组合 — 持仓管理 + 盈亏计算
3. Stripe 支付 — Checkout + Webhook + 套餐升级/降级
4. 套餐权限控制 — TierGuard 组件 + API 限流

 Phase 5: 邮件简报 (1-2天)

1. Resend 集成 — API client + 域名验证
2. React Email 模板 — 每日摘要 + 周报
3. 邮件偏好设置 — 用户开关控制
4. 定时发送 — Vercel Cron → 生成摘要 → 发送邮件

 Phase 6: 筛选器 + 打磨 (2-3天)

1. 股票筛选器 — 按行业/市值/技术指标/AI评分筛选
2. 价格预警 — 用户设置阈值，触发邮件通知
3. 响应式优化 — 移动端适配
4. SEO — metadata, sitemap, og-image

 验证方案

1. 本地开发 — pnpm dev 启动，访问 localhost:3000
2. Auth 测试 — 注册 → 登录 → 访问受保护页面
3. 数据测试 — 搜索 AAPL → 查看K线图 → 查看 AI 分析
4. 支付测试 — Stripe 测试模式 → 订阅升级 → 验证权限
5. 邮件测试 — Resend 测试模式 → 验证邮件模板渲染
6. 部署验证 — vercel deploy → 生产环境冒烟测试
7. Cron 验证 — 手动触发 cron 端点 → 检查数据更新

 定价策略

 ┌─────────────┬────────┬─────────────────┬────────────────┐
  │ 部署        │ Vercel (Git 推送自动部署 + Cron Jobs)     │
  ├─────────────┼───────────────────────────────────────────┤
  │ 图表        │ TradingView Lightweight Charts (免费商用) │
  ├─────────────┼───────────────────────────────────────────┤
  │ AI          │ OpenAI/Claude API (新闻摘要 + 股票评分)   │
  ├─────────────┼───────────────────────────────────────────┤
  │ 支付        │ Stripe (Checkout + Webhook)               │
  ├─────────────┼───────────────────────────────────────────┤
  │ 邮件        │ Resend + React Email                      │
  └─────────────┴───────────────────────────────────────────┘

  实施节奏（约 2-3 周 MVP）

1. Phase 1 → 项目初始化 + Supabase Auth + 基础布局
2. Phase 2 → 股票搜索 + K线图 + 技术指标
3. Phase 3 → AI 新闻摘要 + AI 股票评分 + 定时任务
4. Phase 4 → 自选股 + 投资组合 + Stripe 付费
5. Phase 5 → 邮件简报自动推送
6. Phase 6 → 筛选器 + 打磨上线

  全部在一个 Next.js 项目中完成，不需要 Python 服务，架构足够简洁，Vercel 一键部署。
