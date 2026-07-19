export interface LearnArticle {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  icon: string; // lucide-react icon name
  tags: string[];
  date: string; // ISO date for schema.org datePublished
  lastUpdated?: string;
  sections: LearnSection[];
}

export interface LearnSection {
  heading: string;
  content: string;
  type?: "text" | "callout" | "list";
  items?: string[];
}

export const learnArticles: LearnArticle[] = [
  {
    slug: "building-your-first-portfolio",
    title: "Building Your First Portfolio",
    description: "A step-by-step guide to constructing a diversified investment portfolio from scratch. Learn about asset allocation, risk management, and getting started with your first investments.",
    readTime: "8 min",
    icon: "Briefcase",
    date: "2026-06-01",
    lastUpdated: "2026-06-01",
    tags: ["Beginner", "Portfolio", "Strategy"],
    sections: [
      {
        heading: "Why Build a Portfolio?",
        content: "A well-constructed portfolio is the foundation of successful investing. Rather than betting on individual stocks, a portfolio spreads your risk across multiple assets, sectors, and investment types. This diversification helps protect your wealth during market downturns while capturing gains during rallies.",
        type: "text",
      },
      {
        heading: "The 3 Pillars of Portfolio Construction",
        content: "Every solid portfolio balances three key elements: (1) Growth — assets with high return potential like stocks; (2) Income — dividend-paying stocks and bonds that generate cash flow; (3) Safety — cash reserves and government bonds that preserve capital during downturns. The mix depends on your age, goals, and risk tolerance.",
        type: "callout",
      },
      {
        heading: "Step 1: Define Your Goals",
        content: "Before buying a single share, ask yourself: What am I investing for? Retirement in 30 years requires a different strategy than saving for a house in 3 years. Your time horizon is the single most important factor in determining your asset allocation.",
        type: "text",
      },
      {
        heading: "Step 2: Determine Your Asset Allocation",
        content: "The classic 60/40 portfolio (60% stocks, 40% bonds) is a good starting point. Younger investors might prefer 80/20 or even 90/10 for maximum growth. The rule of thumb: subtract your age from 110 — that's the percentage to allocate to stocks.",
        type: "text",
      },
      {
        heading: "Step 3: Pick Your Investments",
        content: "You don't need to pick individual stocks. Low-cost ETFs and index funds give you instant diversification. Start with a broad market ETF like SPY or VOO for U.S. stocks, add an international ETF for global exposure, and include a bond ETF for stability.",
        type: "list",
        items: [
          "U.S. Total Market ETF (e.g., VTI) — 40-50%",
          "International Stocks ETF (e.g., VXUS) — 20-30%",
          "Bond ETF (e.g., BND) — 20-30%",
          "Optional: Sector or thematic ETFs — 5-10%",
        ],
      },
      {
        heading: "Step 4: Rebalance Regularly",
        content: "Markets move, and your allocation will drift. Rebalancing — selling winners and buying underweight assets — keeps your risk in check. Do this quarterly or annually. Many brokerages offer automatic rebalancing.",
        type: "text",
      },
      {
        heading: "Common Mistakes to Avoid",
        content: "New investors often fall into these traps: chasing hot stocks based on hype, selling in panic during corrections, overtrading (which generates fees and taxes), and neglecting to diversify across sectors and geographies.",
        type: "callout",
      },
    ],
  },
  {
    slug: "bull-vs-bear-markets",
    title: "Bull vs Bear Markets Explained",
    description: "Understanding market cycles is crucial for every investor. Learn what defines bull and bear markets, how to identify them, and strategies for navigating each phase.",
    readTime: "7 min",
    icon: "TrendingUp",
    date: "2026-06-01",
    lastUpdated: "2026-06-01",
    tags: ["Intermediate", "Market Cycles", "Strategy"],
    sections: [
      {
        heading: "What Defines a Bull Market?",
        content: "A bull market is a sustained period of rising stock prices, typically defined as a 20% or more increase from recent lows. Bull markets are driven by strong economic growth, low unemployment, rising corporate profits, and investor optimism. The average bull market lasts about 5 years.",
        type: "text",
      },
      {
        heading: "What Defines a Bear Market?",
        content: "A bear market is a sustained decline of 20% or more from recent highs. They're triggered by economic recessions, high inflation, geopolitical crises, or bursting asset bubbles. Bear markets typically last 9-15 months — much shorter than bulls — but can be psychologically brutal.",
        type: "text",
      },
      {
        heading: "How to Spot Market Transitions",
        content: "No one can predict tops and bottoms perfectly, but key signals include: deteriorating economic data (rising unemployment, falling consumer confidence), inverted yield curves, declining breadth (fewer stocks participating in rallies), and extreme sentiment readings (excessive bullishness or bearishness).",
        type: "callout",
      },
      {
        heading: "Investing in a Bull Market",
        content: "During bulls, the trend is your friend. Growth stocks and cyclicals tend to outperform. Strategies: buy on dips, let winners run, and increase exposure to equities. But don't get complacent — valuations can stretch to unsustainable levels.",
        type: "text",
      },
      {
        heading: "Investing in a Bear Market",
        content: "Bears are when fortunes are made by the patient. Strategies include: dollar-cost averaging (buying fixed amounts on schedule), rotating into defensive sectors (utilities, consumer staples, healthcare), and building a watchlist of quality stocks at discounted prices.",
        type: "list",
        items: [
          "Stay calm — panic selling locks in losses",
          "Keep buying systematically (dollar-cost averaging)",
          "Focus on quality companies with strong balance sheets",
          "Consider adding bonds or cash for stability",
          "Remember: every past bear market has ended in new highs",
        ],
      },
      {
        heading: "The Psychological Trap",
        content: "The biggest risk isn't the market — it's your own behavior. In bulls, FOMO drives investors to buy at peaks. In bears, fear drives them to sell at bottoms. The most successful investors are those who can control their emotions and stick to a disciplined plan.",
        type: "callout",
      },
    ],
  },
  {
    slug: "power-of-compound-interest",
    title: "The Power of Compound Interest",
    description: "Albert Einstein allegedly called compound interest the eighth wonder of the world. Discover how time and reinvestment can turn modest savings into substantial wealth.",
    readTime: "6 min",
    icon: "TrendingUp",
    date: "2026-06-01",
    lastUpdated: "2026-06-01",
    tags: ["Beginner", "Fundamentals", "Wealth Building"],
    sections: [
      {
        heading: "What is Compound Interest?",
        content: "Compound interest is interest earned on interest. Unlike simple interest, which only pays on the original principal, compounding means your returns generate their own returns. Over long periods, this snowball effect creates exponential growth.",
        type: "text",
      },
      {
        heading: "The Math Behind the Magic",
        content: "The compound interest formula: A = P(1 + r/n)^(nt). Where A is the final amount, P is principal, r is annual rate, n is compounding frequency, and t is years. The key insight: time (t) is in the exponent — that's what creates the hockey-stick curve.",
        type: "text",
      },
      {
        heading: "A Real-World Example",
        content: "Invest $10,000 at age 25 with an 8% average annual return, adding $500 monthly. By age 65, you'd have approximately $1.7 million. If you wait until age 35 to start, you'd end up with about $745,000. That 10-year delay costs you nearly $1 million!",
        type: "callout",
      },
      {
        heading: "The Three Levers",
        content: "You control three variables: (1) Amount invested — the more you save, the faster you compound; (2) Rate of return — even a 1% difference compounds dramatically over decades; (3) Time — the most powerful lever, and the one you can't get back.",
        type: "text",
      },
      {
        heading: "How to Maximize Compounding",
        content: "Start early, even with small amounts. Reinvest all dividends — don't spend them. Minimize fees (a 1% fee can cost you six figures over a lifetime). Use tax-advantaged accounts like IRAs and 401(k)s where compounding happens tax-free or tax-deferred.",
        type: "list",
        items: [
          "Start today — every year of delay costs you exponentially",
          "Reinvest all dividends and capital gains",
          "Choose low-cost index funds (0.03-0.10% expense ratios)",
          "Max out tax-advantaged accounts (IRA, 401k, HSA)",
          "Increase contributions as your income grows",
        ],
      },
      {
        heading: "The Rule of 72",
        content: "A quick mental shortcut: divide 72 by your annual return to estimate how many years it takes to double your money. At 8% return, money doubles every 9 years. At 10%, every 7.2 years. This simple rule shows why every percentage point matters.",
        type: "text",
      },
    ],
  },
  {
    slug: "value-investing-principles",
    title: "Value Investing Fundamentals",
    description: "Learn the timeless principles of value investing pioneered by Benjamin Graham and Warren Buffett. Discover how to identify undervalued companies and build wealth through disciplined analysis.",
    readTime: "9 min",
    icon: "Search",
    date: "2026-06-01",
    lastUpdated: "2026-06-01",
    tags: ["Advanced", "Fundamental Analysis", "Strategy"],
    sections: [
      {
        heading: "What is Value Investing?",
        content: "Value investing is buying stocks that trade below their intrinsic value — in other words, buying dollar bills for 50 cents. Pioneered by Benjamin Graham in the 1930s and perfected by Warren Buffett, it focuses on fundamentals rather than market sentiment.",
        type: "text",
      },
      {
        heading: "The Margin of Safety",
        content: "The most important concept in value investing: always buy at a significant discount to your estimate of intrinsic value. This 'margin of safety' protects you when your analysis is wrong or when the unexpected happens. A 30-50% margin is a common target.",
        type: "callout",
      },
      {
        heading: "Key Valuation Metrics",
        content: "Value investors use several tools to assess whether a stock is cheap. No single metric tells the whole story — use them together to build a complete picture.",
        type: "list",
        items: [
          "P/E Ratio: Price divided by earnings. Lower is cheaper, but context matters",
          "P/B Ratio: Price to book value. Below 1.0 can indicate undervaluation",
          "PEG Ratio: P/E divided by growth rate. Below 1.0 suggests growth at a reasonable price",
          "Dividend Yield: Higher yields can signal value in mature companies",
          "Free Cash Flow Yield: FCF / Market Cap. How much cash the business generates relative to price",
          "Debt-to-Equity: Important safety check — value traps often have crushing debt loads",
        ],
      },
      {
        heading: "Red Flags to Watch For",
        content: "Not every cheap stock is a bargain. 'Value traps' are stocks that look cheap but deserve to be cheap because the business is deteriorating. Watch for: declining revenues, shrinking margins, management turnover, industry disruption, and excessive debt.",
        type: "text",
      },
      {
        heading: "The Moat Advantage",
        content: "Buffett popularized the concept of economic moats — durable competitive advantages that protect a company's profits. Look for: strong brands (Apple, Coca-Cola), network effects (Meta, Visa), switching costs (Microsoft, Salesforce), and cost advantages (Costco, Walmart).",
        type: "callout",
      },
      {
        heading: "Patience is the Edge",
        content: "Value investing requires patience. Markets can stay irrational longer than you can stay solvent, as Keynes observed. It may take years for a stock's price to converge with its intrinsic value. The key is to do thorough research, buy at a discount, and wait.",
        type: "text",
      },
    ],
  },
  {
    slug: "what-are-etfs",
    title: "ETFs: Diversification Made Simple",
    description: "Exchange-Traded Funds (ETFs) have revolutionized investing. Understand how ETFs work, their advantages over mutual funds and individual stocks, and how to choose the right ones for your portfolio.",
    readTime: "7 min",
    icon: "Layers",
    date: "2026-06-01",
    lastUpdated: "2026-06-01",
    tags: ["Beginner", "ETFs", "Diversification"],
    sections: [
      {
        heading: "What is an ETF?",
        content: "An Exchange-Traded Fund (ETF) is a basket of securities (stocks, bonds, commodities, etc.) that trades on an exchange like a single stock. When you buy a share of SPY, you're buying a tiny slice of all 500 companies in the S&P 500.",
        type: "text",
      },
      {
        heading: "ETFs vs Mutual Funds vs Individual Stocks",
        content: "ETFs combine the best of both worlds: the diversification of mutual funds with the trading flexibility of stocks. Unlike mutual funds, ETFs trade throughout the day, have lower fees, and are more tax-efficient. Unlike individual stocks, they spread risk across many companies.",
        type: "callout",
      },
      {
        heading: "Types of ETFs",
        content: "The ETF universe has expanded dramatically. Here are the main categories every investor should know.",
        type: "list",
        items: [
          "Broad Market ETFs: Track major indexes like S&P 500 (SPY), Total Market (VTI), Nasdaq-100 (QQQ)",
          "Sector ETFs: Focus on specific sectors like Technology (XLK), Healthcare (XLV), Financials (XLF)",
          "Bond ETFs: Government (TLT), Corporate (LQD), Aggregate (AGG) — income and stability",
          "International ETFs: Developed Markets (VEA), Emerging Markets (VWO) — global exposure",
          "Thematic ETFs: AI, clean energy, robotics — targeted themes but higher risk",
          "Factor ETFs: Value, momentum, low volatility — systematic strategies in an ETF wrapper",
        ],
      },
      {
        heading: "What to Look For When Choosing an ETF",
        content: "Focus on three things: (1) Expense ratio — the annual fee as a percentage of assets, look for under 0.10% for index ETFs; (2) Assets under management (AUM) — larger funds are more liquid and less likely to close; (3) Tracking error — how closely the ETF follows its benchmark.",
        type: "text",
      },
      {
        heading: "The Perfect Starter Portfolio",
        content: "You can build a complete, globally diversified portfolio with just 3-4 ETFs. A simple allocation: 50% U.S. Total Market (VTI), 30% International Stocks (VXUS), 20% Total Bond Market (BND). This gives you exposure to thousands of companies across the globe.",
        type: "text",
      },
    ],
  },
  {
    slug: "why-diversification-matters",
    title: "Why Diversification Matters",
    description: "Don't put all your eggs in one basket. Learn the science behind diversification, how it reduces risk without sacrificing returns, and practical strategies for building a diversified portfolio.",
    readTime: "6 min",
    icon: "Grid3X3",
    date: "2026-06-01",
    lastUpdated: "2026-06-01",
    tags: ["Beginner", "Risk Management", "Portfolio"],
    sections: [
      {
        heading: "The Free Lunch of Investing",
        content: "Diversification is often called the only free lunch in finance. By spreading investments across uncorrelated assets, you can reduce portfolio volatility without reducing expected returns. It's the mathematical foundation of modern portfolio theory.",
        type: "text",
      },
      {
        heading: "The Math of Risk Reduction",
        content: "When you hold a single stock, you bear 100% of its company-specific risk. Add a second stock, and the risk from each partially cancels out. By the time you hold 20-30 stocks across different sectors, most company-specific risk is eliminated. What remains is market risk — which you can't diversify away.",
        type: "callout",
      },
      {
        heading: "Dimensions of Diversification",
        content: "True diversification goes beyond just owning many stocks. Consider diversifying across multiple dimensions.",
        type: "list",
        items: [
          "Across Sectors: Technology, healthcare, financials, energy, consumer — sectors rotate, and you want exposure to all",
          "Across Geographies: U.S., developed international, and emerging markets — different economies grow at different times",
          "Across Asset Classes: Stocks, bonds, real estate, commodities — bonds often rally when stocks fall",
          "Across Market Caps: Large-cap for stability, mid-cap and small-cap for growth potential",
          "Across Investment Styles: Blend growth and value — different styles lead in different market environments",
        ],
      },
      {
        heading: "The Correlation Key",
        content: "Diversification works best when assets don't move in lockstep. Correlation ranges from -1 (perfect opposite) to +1 (perfect tandem). U.S. and international stocks: ~0.7 correlation. Stocks and bonds: historically ~0.2. Stocks and gold: ~0.0. The lower the correlation, the better the diversification benefit.",
        type: "text",
      },
      {
        heading: "Over-Diversification is Real",
        content: "While diversification is essential, there is such a thing as too much. Owning 500 stocks in a total market ETF is fine — you're paying near-zero fees. But owning 100 individual stocks you don't have time to research properly is 'diworsification.' Know what you own and why.",
        type: "text",
      },
      {
        heading: "The Bottom Line",
        content: "Diversification won't make you rich overnight, but it will prevent you from being wiped out by a single bad pick. As Buffett says: Rule #1 — Don't lose money. Rule #2 — Don't forget Rule #1. Diversification is your best defense against permanent capital loss.",
        type: "callout",
      },
    ],
  },
  {
    slug: "technical-analysis-beginners-guide",
    title: "How to Read Stock Charts: Technical Analysis for Beginners",
    description: "Learn how to read stock charts and master stock market basics including RSI, MACD, and moving averages. Discover how to pick the best stocks using technical analysis — a complete guide for beginner investors who want to time their entries and exits with confidence.",
    readTime: "8 min",
    icon: "CandlestickChart",
    date: "2026-07-14",
    lastUpdated: "2026-07-14",
    tags: ["Beginner", "Technical Analysis", "Charts", "How to Read Stock Charts", "Stock Market Basics", "How to Invest in Stocks"],
    sections: [
      {
        heading: "What is Technical Analysis?",
        content: "If you're learning how to invest in stocks, understanding stock market basics starts with two approaches: fundamental analysis and technical analysis. Technical analysis is the study of price movements and trading volume to forecast future price direction. Unlike fundamental analysis, which examines a company's financials and business model, technical analysis focuses purely on what the market is doing — price action, trends, and patterns. The core belief: all known information is already reflected in the price.",
        type: "text",
      },
      {
        heading: "Price Tells a Story — Fundamental vs Technical",
        content: "Fundamental analysis answers 'what to buy'; technical analysis answers 'when to buy it.' A company might have stellar financials, but entering at the wrong time can mean months of drawdown. Smart investors combine both: use fundamentals to find quality companies, use technicals to time their entry points.",
        type: "callout",
      },
      {
        heading: "The Building Blocks: Candlesticks",
        content: "The most common way to visualize price is the candlestick chart. Each candle represents a time period (1 day, 1 hour, etc.) and shows four data points: open, high, low, and close. A green candle means the price closed higher than it opened (bullish); a red candle means it closed lower (bearish). The 'body' is the range between open and close, and the 'wicks' show the high and low.",
        type: "text",
      },
      {
        heading: "Support and Resistance",
        content: "Support is a price level where buying pressure tends to overcome selling pressure, creating a 'floor' that prices bounce off. Resistance is the opposite — a 'ceiling' where selling overcomes buying. These levels form because investors remember past prices and act on them. Once resistance is broken, it often becomes new support — and vice versa.",
        type: "text",
      },
      {
        heading: "Moving Average Explained: The Trend's Compass",
        content: "A moving average (MA) smooths out price data to reveal the underlying trend — it's one of the most important stock market basics every investor should know. The two most common are the 50-day MA (short-term trend) and the 200-day MA (long-term trend). When the 50-day crosses above the 200-day, it's called a 'Golden Cross' — a bullish signal. The opposite is a 'Death Cross' — a bearish signal. Learning to read these crossovers is essential for anyone who wants to know how to pick the best stocks with good timing.",
        type: "callout",
      },
      {
        heading: "RSI: Measuring Overbought and Oversold",
        content: "The Relative Strength Index (RSI) oscillates between 0 and 100, measuring the speed and magnitude of recent price changes. RSI above 70 suggests a stock may be overbought (due for a pullback); below 30 suggests it may be oversold (due for a bounce). However, strong trends can keep RSI in overbought or oversold territory for extended periods — never trade on RSI alone.",
        type: "text",
      },
      {
        heading: "MACD: Momentum in Motion",
        content: "The Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator. It consists of the MACD line (difference between 12-day and 26-day EMAs), the signal line (9-day EMA of the MACD line), and the histogram (difference between the two). When the MACD line crosses above the signal line, it's a bullish signal. The histogram flipping from negative to positive (or vice versa) is often an early warning of a trend change.",
        type: "text",
      },
      {
        heading: "Volume: The Forgotten Indicator",
        content: "Volume confirms price movements. A price rise on high volume is more significant than one on low volume — it shows conviction. Similarly, a breakdown on high volume is more concerning. The volume ratio (current volume ÷ 20-day average) helps spot unusual activity. A ratio above 1.5 often signals an event-driven move worth investigating.",
        type: "text",
      },
      {
        heading: "Putting It All Together",
        content: "No single indicator is perfect. The best approach is confluence — when multiple signals point in the same direction. For example: price above the 50-day MA (uptrend) + RSI recovering from 35 (not overbought) + MACD histogram turning positive (momentum shifting) + rising volume (confirmation) = a high-probability setup.",
        type: "list",
        items: [
          "Trend: Is price above or below key moving averages?",
          "Momentum: What are RSI and MACD telling you?",
          "Volume: Is the move being confirmed by participation?",
          "Support/Resistance: Where is the next likely turning point?",
          "Confluence: Do at least 2-3 indicators agree?",
        ],
      },
      {
        heading: "Common Beginner Mistakes",
        content: "New technical traders often overtrade (every wiggle is not a signal), ignore the bigger picture (daily noise vs. weekly trends), and fall prey to indicator overload (10 indicators on a chart creates analysis paralysis). Start simple: price, volume, one trend indicator (MA), and one momentum indicator (RSI or MACD). Add complexity only when these become second nature.",
        type: "callout",
      },
      {
        heading: "StockSage: Your Technical Analysis Toolkit",
        content: "If you want to learn how to invest in the stock market for beginners without memorizing every formula, StockSage does the heavy lifting. It computes moving averages, RSI, MACD, volume ratios, and Bollinger Bands for every stock on your watchlist. The dashboard shows at a glance whether each stock is bullish or bearish, overbought or oversold, and whether a Golden Cross or Death Cross is forming — helping you understand how to read stock charts and how to pick the best stocks backed by data, not hype.",
        type: "text",
      },
    ],
  },
  {
    slug: "dividend-investing-passive-income",
    title: "Dividend Investing: How to Build Passive Income with Stocks",
    description: "Learn how to invest in dividend stocks and build passive income — from dividend yield explained to how much you need invested to make $1,000 per month. Covers dividend aristocrats, best dividend ETFs, DRIP investing, and tax tips for beginners.",
    readTime: "8 min",
    icon: "Banknote",
    date: "2026-07-15",
    lastUpdated: "2026-07-15",
    tags: ["Beginner", "Dividend Investing", "Passive Income", "Dividend Stocks", "How to Invest in Dividend Stocks"],
    sections: [
      {
        heading: "What is Dividend Investing?",
        content: "Dividend investing is a strategy focused on buying stocks that pay regular cash distributions to shareholders — essentially getting paid just for owning shares. For beginners wondering how to invest in dividend stocks, think of it as being a part-owner of a profitable business that shares its earnings with you every quarter. It's one of the most popular ways to build passive income without selling your holdings.",
        type: "text",
      },
      {
        heading: "Dividend Yield Explained: The Key Metric",
        content: "The dividend yield is the annual dividend per share divided by the stock price, expressed as a percentage. A $100 stock paying $4 per year has a 4% yield. But here's the catch: an unusually high yield (above 6-8%) can be a red flag — the stock price may have fallen because the business is struggling, and the dividend might be cut. A sustainable 2-5% yield from a growing company beats an unsustainable 10% yield from a company in decline.",
        type: "callout",
      },
      {
        heading: "How Much Do I Need to Invest to Make $1,000 Per Month?",
        content: "This is one of the most searched investing questions — and the math is straightforward. At a 3% dividend yield, you'd need about $400,000 invested. At 4%, it drops to $300,000. At 5%, about $240,000. The exact number depends on the yield, but the real insight is this: passive income through dividends is a marathon, not a sprint. Start early, reinvest dividends, and let compounding do the heavy lifting over decades.",
        type: "text",
      },
      {
        heading: "Dividend Aristocrats and Kings",
        content: "Not all dividend stocks are created equal. Dividend Aristocrats are S&P 500 companies that have increased their dividend every year for at least 25 consecutive years — names like Coca-Cola, Johnson & Johnson, and Procter & Gamble. Dividend Kings go further: 50+ years of annual increases. These companies have survived recessions, wars, and market crashes while still growing their payouts — making them the gold standard for dividend investors seeking reliable passive income.",
        type: "text",
      },
      {
        heading: "DRIP: The Secret Weapon of Dividend Investors",
        content: "DRIP stands for Dividend ReInvestment Plan. Instead of taking dividends as cash, a DRIP automatically uses them to buy more shares. Over time, this creates a compounding snowball: you own more shares, which pay more dividends, which buy more shares. A $10,000 investment in dividend stocks with a 4% yield, reinvested over 30 years, can grow to over $32,000 — without adding a single extra dollar. That's the power of DRIP investing.",
        type: "callout",
      },
      {
        heading: "Best Dividend ETFs for Beginners",
        content: "If picking individual dividend stocks feels overwhelming, dividend ETFs offer instant diversification. Here are some of the most popular dividend ETFs to consider.",
        type: "list",
        items: [
          "VYM (Vanguard High Dividend Yield ETF) — broad market, low 0.06% expense ratio",
          "SCHD (Schwab U.S. Dividend Equity ETF) — focuses on quality, sustainable dividends",
          "VIG (Vanguard Dividend Appreciation ETF) — companies with 10+ years of dividend growth",
          "DGRO (iShares Core Dividend Growth ETF) — dividend growth at a low cost",
          "SPHD (Invesco S&P 500 High Dividend Low Volatility ETF) — monthly payouts",
        ],
      },
      {
        heading: "Individual Dividend Stocks vs Dividend ETFs",
        content: "Individual stocks let you target higher yields and cherry-pick your favorite companies, but they concentrate risk — if one company cuts its dividend, your income drops. ETFs spread risk across dozens or hundreds of companies. For most investors, the best approach is a core position in a dividend ETF, supplemented by a handful of individual stocks you've researched thoroughly.",
        type: "text",
      },
      {
        heading: "Tax-Smart Dividend Investing",
        content: "Not all dividends are taxed equally. Qualified dividends (from most U.S. companies held for 60+ days) are taxed at the lower long-term capital gains rate — 0%, 15%, or 20% depending on your income. Ordinary dividends (from REITs, BDCs, and some foreign companies) are taxed as regular income. For maximum tax efficiency, hold dividend-paying stocks in tax-advantaged accounts like IRAs and 401(k)s where dividends grow tax-free or tax-deferred.",
        type: "text",
      },
      {
        heading: "Common Dividend Investing Mistakes",
        content: "New dividend investors often fall into these traps: chasing the highest yield without checking if the dividend is sustainable, ignoring payout ratios (above 80% is a warning sign), forgetting to diversify across sectors (don't put everything in utilities and REITs), and overlooking dividend growth — a 2% yield growing 15% per year will overtake a static 5% yield faster than you'd expect.",
        type: "callout",
      },
      {
        heading: "Getting Started with Dividend Investing",
        content: "You don't need a fortune to start building passive income with dividend stocks. Open a brokerage account, start with a low-cost dividend ETF like SCHD or VYM, and enable DRIP so every dividend buys more shares. Add money consistently each month — even $100 adds up. Track your passive income over time and watch the snowball grow. The best time to start was 20 years ago. The second best time is today.",
        type: "text",
      },
    ],
  },
  {
    slug: "sector-rotation-strategy",
    title: "Sector Rotation Strategy: How to Navigate the Great Rotation of 2026",
    description: "Money is rotating out of AI and tech stocks into financials, banks, and undervalued sectors. Learn what sector rotation is, why the Great Rotation is happening now, and how to position your portfolio for the IPO boom, higher-for-longer interest rates, and shifting market leadership.",
    readTime: "9 min",
    icon: "RefreshCw",
    date: "2026-07-17",
    lastUpdated: "2026-07-17",
    tags: ["Intermediate", "Sector Rotation", "Market Strategy", "Financial Stocks", "AI Bubble"],
    sections: [
      {
        heading: "What Is Sector Rotation?",
        content: "Sector rotation is the movement of capital from one industry group to another as the economic cycle evolves. Different sectors perform differently depending on where we are in the cycle — early expansion favors cyclicals and tech, while late-cycle environments often benefit financials, energy, and defensive names. Smart investors don't just pick good stocks; they pay attention to which sectors the smart money is rotating into.",
        type: "text",
      },
      {
        heading: "The Great Rotation of 2026: What's Happening Right Now",
        content: "Since June 2026, we've witnessed one of the most significant sector rotations in recent memory. The Financial Select Sector SPDR ETF (XLF) has surged more than 8%, while the Roundhill Magnificent Seven ETF (MAGS), tracking mega-cap tech, has fallen nearly 4%. Bank stocks like JPMorgan Chase, Bank of America, Goldman Sachs, and Morgan Stanley are hitting new highs, while AI darlings that dominated the first half of 2026 are cooling off. This isn't just a blip — it's a structural shift in market leadership driven by fundamental changes in the economic landscape.",
        type: "callout",
      },
      {
        heading: "Why Is Money Rotating Out of Tech?",
        content: "Three forces are driving capital away from AI and tech names. First, AI fatigue — enormous capex approaching 1.5% of U.S. GDP lacks a clear path to returns, and 45% of fund managers now name 'AI bubble' as the biggest tail risk. Second, valuations — after a blistering rally, many tech stocks trade at stretched multiples that leave little room for error. Third, the higher-for-longer interest rate environment (Fed Funds Rate around 3.5%) makes future earnings worth less today, disproportionately hurting high-growth tech names whose profits lie far in the future.",
        type: "text",
      },
      {
        heading: "Why Financial Stocks Are Winning",
        content: "Financial stocks are the primary beneficiaries of this rotation for several converging reasons. Higher interest rates widen banks' net interest margins — Bank of America reported net interest income up 9% year-over-year. Meanwhile, a record-breaking IPO market (global IPO proceeds up over 200% in H1 2026, headlined by SpaceX's historic public debut) is generating billions in investment banking fees. Combined equity and debt trading revenue at the top four U.S. banks hit $38 billion last quarter, up over a third from a year ago. And remarkably, despite the rally, the sector remains relatively cheap — JPMorgan trades at ~15x forward earnings, Bank of America at ~13x.",
        type: "callout",
      },
      {
        heading: "The IPO Boom: A Tailwind for Financials",
        content: "The 2026 IPO market is the hottest in years, and it's not just SpaceX. The pipeline includes anticipated public debuts from OpenAI, Anthropic, Databricks, Canva, and Shein — household names that could each raise tens of billions. Investment banks earn substantial fees from underwriting these offerings, creating a direct revenue tailwind for the financial sector that could persist well into 2027.",
        type: "text",
      },
      {
        heading: "The AI Bubble Debate: Is Tech Down for the Count?",
        content: "Despite the rotation, the AI story isn't over. The Bank of America July Global Fund Manager Survey revealed a split: while 45% of managers call AI a bubble, 48% say it's not, and 61% don't expect hyperscalers to cut AI spending in 2026. Long semiconductors remains the most crowded trade for the third straight month. The takeaway? This is a rotation, not a crash. Quality tech names with real earnings will likely stabilize and recover — but the days of everything AI-related going up indiscriminately may be behind us.",
        type: "text",
      },
      {
        heading: "Sentiment Check: Too Bullish?",
        content: "The BofA Bull & Bear Indicator has reached 9.4 — described as 'extremely bullish.' Cash allocations among fund managers fell to an uber-low 3.6%, triggering a contrarian sell signal. A record 54% of managers expect a 'no landing' economic scenario. When everyone is this bullish, it pays to be cautious. The New York Fed estimates only a 16% recession probability, but extreme sentiment readings often precede corrections.",
        type: "callout",
      },
      {
        heading: "How to Position Your Portfolio for the Rotation",
        content: "Navigating sector rotation requires balance — you want exposure to the winning sectors without abandoning long-term positions in quality tech. Here's a practical framework.",
        type: "list",
        items: [
          "Add financial sector exposure: Consider XLF (broad financials ETF) or individual bank stocks like JPMorgan and Goldman Sachs — still reasonably valued despite the rally",
          "Trim, don't abandon, tech winners: Reduce positions in overbought AI names with no earnings, but hold quality tech with real cash flows",
          "Watch the IPO calendar: Upcoming IPOs from OpenAI and Databricks could reignite tech enthusiasm — be ready to rotate back",
          "Monitor the Fed: If rate cut expectations rise, growth stocks could catch a bid. The July FOMC meeting is a key catalyst",
          "Check correlations: Financials are surging partly because of AI-driven trading and IPO activity — they're not a perfect hedge against a tech downturn",
          "Keep cash ready: With sentiment at extreme bullish levels, a 5-10% correction would create buying opportunities in both sectors",
        ],
      },
      {
        heading: "The Hidden Risk: Banks Are an AI Bet Too",
        content: "Here's the paradox most investors miss: the financial sector's current surge is itself a byproduct of the AI boom. Record trading revenues come from AI-driven market volatility. Record IPO fees come from AI companies going public. If the AI trade truly unwinds, bank earnings would suffer too. The rotation offers less diversification than it appears on the surface — financials and tech are more correlated today than in previous cycles.",
        type: "callout",
      },
      {
        heading: "Key Indicators to Watch",
        content: "Sector rotations can last months or years. To gauge whether this one has legs, track these signals: the 10-year Treasury yield (rising yields favor financials), the IPO pipeline (more deals = more bank revenue), quarterly bank earnings reports (JPM, BAC, GS, MS), and the relative strength of XLF vs QQQ. A sustained trend of XLF outperforming the Nasdaq is the clearest confirmation that the rotation has further to run.",
        type: "text",
      },
      {
        heading: "The Bottom Line",
        content: "The Great Rotation of 2026 is a reminder that market leadership never stays static. The AI trade that dominated the first half of the year is giving way to financials, value stocks, and IPO-driven themes. Rather than chasing every shift, build a portfolio that can withstand rotation: own both growth and value, tech and financials, and keep enough dry powder to capitalize when sentiment inevitably swings too far in either direction. The best investors don't predict rotations — they prepare for them.",
        type: "text",
      },
    ],
  },
  {
    slug: "how-to-invest-in-semiconductor-stocks",
    title: "How to Invest in Semiconductor Stocks: Understanding the AI Chip Cycle",
    description: "Semiconductor stocks like TSMC, NVIDIA, and AMD have become the most watched names in the market — but they're also the most volatile. Learn how the AI chip cycle works, why semiconductor stocks sell off on good news, which chip ETFs to consider, and how to invest in the semiconductor industry without getting burned by the boom-bust cycle.",
    readTime: "10 min",
    icon: "Cpu",
    date: "2026-07-17",
    lastUpdated: "2026-07-17",
    tags: ["Intermediate", "Semiconductor Stocks", "AI Investing", "Chip Stocks", "How to Invest"],
    sections: [
      {
        heading: "Why Semiconductor Stocks Dominate Headlines in 2026",
        content: "Semiconductor stocks have become the most important group in the global stock market. The MSCI ACWI Semiconductor Index returned over 110% in the past year, driven by insatiable demand for AI chips. The four biggest US AI operators are expected to spend over $725 billion on infrastructure this year alone — and nearly all of it flows through chipmakers. But with great returns comes great volatility: on July 16, 2026, the Philadelphia Semiconductor Index (SOX) dropped 4.3% in a single day, with memory chip stocks falling as much as 12.6%. If you want to invest in chip stocks, understanding the cycle is essential.",
        type: "text",
      },
      {
        heading: "The AI Chip Landscape: Who Does What",
        content: "The semiconductor industry isn't a monolith — it's a complex supply chain where different companies dominate different niches. Knowing who does what is the first step to investing intelligently in the sector.",
        type: "list",
        items: [
          "GPU / AI Accelerators: NVIDIA (market leader), AMD — design the chips that train and run AI models",
          "Foundry / Manufacturing: TSMC (Taiwan Semiconductor) — manufactures chips designed by NVIDIA, AMD, Apple, and nearly everyone else. TSMC controls over 60% of the global foundry market",
          "Memory / HBM: Samsung, SK Hynix, Micron — produce High Bandwidth Memory (HBM), the ultra-fast memory essential for AI training. HBM demand is expected to grow 3x in 2026",
          "Chip Design Tools (EDA): Cadence, Synopsys — the 'pick and shovel' play; every chip designer needs their software",
          "Manufacturing Equipment: ASML (lithography machines), Applied Materials, Lam Research — ASML is the only company in the world that makes extreme ultraviolet (EUV) lithography machines, without which advanced chips can't be made",
        ],
      },
      {
        heading: "Why Do Chip Stocks Sell Off on Good News?",
        content: "On July 16, 2026, TSMC reported a 77% jump in quarterly profit and raised its full-year revenue growth guidance to 40% — and the stock still fell. This 'sell the news' phenomenon is one of the most confusing aspects of semiconductor investing. It happens because: (1) the market prices in expectations months in advance — great results are already reflected in the stock price; (2) rising capex (TSMC boosted spending to $64 billion) raises concerns about overbuilding; (3) investors worry that the AI spending cycle may be peaking. Understanding this dynamic is critical: in semiconductors, you buy the rumor and sell the news.",
        type: "callout",
      },
      {
        heading: "The Semiconductor Boom-Bust Cycle",
        content: "Semiconductors are historically one of the most cyclical industries. Periods of chip shortages lead to over-ordering and inventory buildup, which leads to gluts and price crashes, which leads to under-investment, which starts the cycle all over again. The current AI-driven boom is different in scale — AI capex is unlike anything the industry has seen — but the cyclical DNA remains. Memory chips (DRAM, NAND) are especially volatile. The key question for 2026: is AI demand structural enough to smooth out the traditional cycle, or are we building toward a painful correction?",
        type: "text",
      },
      {
        heading: "Key Metrics for Evaluating Semiconductor Stocks",
        content: "Chip stocks require different metrics than traditional value stocks. Here's what to watch: Capital expenditure (capex) as a percentage of revenue — rising capex means confidence in future demand, but too much can signal overbuilding. Gross margin trend — a declining margin suggests pricing pressure or rising costs. Book-to-bill ratio — orders received vs. orders shipped; above 1.0 means demand is growing. Inventory days — rising inventory can signal an impending glut. And for memory stocks specifically, track DRAM and NAND spot prices — they're the canary in the coal mine.",
        type: "list",
        items: [
          "Capex / Revenue ratio: Under 30% is healthy; above 40% warrants caution",
          "Gross margin trend: Expanding margins = pricing power; contracting = trouble ahead",
          "Book-to-bill ratio: Above 1.0 = demand exceeds supply (bullish)",
          "Inventory days: Rising faster than revenue growth = potential glut",
          "DRAM / NAND spot prices: Falling prices = memory cycle turning down",
        ],
      },
      {
        heading: "Semiconductor ETFs: The Easiest Way to Invest",
        content: "If analyzing individual chip stocks feels overwhelming, semiconductor ETFs offer diversified exposure. The most popular options give you different slices of the industry without requiring you to pick winners.",
        type: "list",
        items: [
          "SMH (VanEck Semiconductor ETF) — the most popular chip ETF; heavy weight on NVIDIA and TSMC; 0.35% expense ratio",
          "SOXX (iShares Semiconductor ETF) — broader exposure including equipment makers like ASML and Applied Materials; 0.35% expense ratio",
          "FTXL (First Trust Nasdaq Semiconductor ETF) — factor-based, tilts toward value-oriented semiconductor names; 0.60% expense ratio",
          "PSI (Invesco Dynamic Semiconductors ETF) — uses momentum and valuation screens to select and weight holdings",
          "USD (ProShares Ultra Semiconductors) — leveraged 2x ETF; ONLY for experienced traders; magnifies both gains AND losses",
        ],
      },
      {
        heading: "The Geopolitical Risk in Chip Investing",
        content: "Semiconductors are at the center of US-China tensions. TSMC's dominance means the global chip supply runs through Taiwan — a geopolitical flashpoint. The US is spending tens of billions via the CHIPS Act to onshore manufacturing (Intel, TSMC Arizona, Samsung Texas), but building fabs takes years. Any disruption in the Taiwan Strait would have catastrophic effects on the global chip supply. Diversifying across US, European (ASML), and Korean (Samsung, SK Hynix) semiconductor companies helps mitigate single-point-of-failure risk.",
        type: "callout",
      },
      {
        heading: "Current State of Play: Q2 2026 Earnings Season",
        content: "As of mid-July 2026, the semiconductor sector is at a critical juncture. TSMC delivered blowout earnings but the stock sold off — raising the question: has peak AI hype been priced in? Memory stocks (SanDisk down 12.6%, Western Digital and Seagate down 5-8%) are under pressure as investors question whether memory pricing has peaked. Alphabet's Gemini 3.5 Pro AI model is reportedly months behind schedule, which could slow demand for the highest-end AI accelerators. Yet the long-term thesis remains intact: AI is real, it requires enormous compute, and semiconductors are the foundation. The current selloff may be a buying opportunity — or the start of a deeper reset. Disciplined, phased entry is wiser than going all-in.",
        type: "text",
      },
      {
        heading: "How to Build a Semiconductor Position Responsibly",
        content: "Given the sector's volatility, here's a practical framework for adding chip stocks to your portfolio.",
        type: "list",
        items: [
          "Start with an ETF: SMH or SOXX gives you diversified exposure without single-stock risk",
          "Core holdings: Focus on wide-moat leaders (TSMC for manufacturing, ASML for equipment) that have near-monopolies",
          "Size appropriately: Limit semiconductor exposure to 10-15% of your total equity portfolio — the sector's volatility demands position discipline",
          "Buy in tranches: Instead of going all-in, split your intended investment into 3-4 purchases over 2-3 months to average out entry price",
          "Watch the capex cycle: When every chip company is raising capex simultaneously, history suggests caution",
          "Have an exit plan: Decide in advance what would make you sell — whether it's a 20% stop-loss, deteriorating margins, or a macro shock",
        ],
      },
      {
        heading: "The Bottom Line",
        content: "Semiconductor stocks are not for the faint of heart — they're capable of delivering both triple-digit returns and double-digit single-day crashes. But for investors willing to do the homework, they represent exposure to what may be the most important technological shift since the internet. The key is to respect the cycle, diversify across the supply chain, keep position sizes manageable, and never forget that in semiconductors, good news doesn't always mean the stock goes up. The AI revolution is real — but the road will be bumpy.",
        type: "text",
      },
    ],
  },
  {
    slug: "ai-trade-rotation-infrastructure-to-platforms",
    title: "AI Trade Rotation: Why Apple Just Passed Nvidia and What It Means for Investors",
    description: "The Philadelphia Semiconductor Index just entered a bear market while Apple briefly reclaimed the market cap crown. Learn what's driving the rotation from AI infrastructure to AI platforms, why chip stocks are selling off despite record earnings, and how to position your portfolio as the AI trade enters its next phase.",
    readTime: "9 min",
    icon: "ArrowLeftRight",
    date: "2026-07-18",
    lastUpdated: "2026-07-18",
    tags: ["Intermediate", "AI Investing", "Market Rotation", "Semiconductor Stocks", "Tech Stocks"],
    sections: [
      {
        heading: "A Seismic Shift in the AI Trade",
        content: "For the first time since April 2025, Apple's market cap ($4.91 trillion) briefly surpassed Nvidia's ($4.9 trillion) during the July 18 trading session. This wasn't just a random blip — it's the most visible sign of a major rotation happening within the AI trade. The Philadelphia Semiconductor Index has tumbled ~20% from its June record, officially entering a bear market, while platform companies with stable cash flows and clear AI monetization paths are attracting capital. The AI rally isn't over — it's evolving.",
        type: "text",
      },
      {
        heading: "The Numbers: How Bad Is the Chip Selloff?",
        content: "The Philadelphia Semiconductor Index (SOX) logged its steepest weekly loss in over a year, down nearly 18% in July alone — though it remains up ~65% year-to-date. Key names have been hit hard: Applied Materials dropped 5.6%, Intel fell 2%, and even Nvidia shed over 2% in a single session. The selloff comes despite TSMC reporting blowout Q2 earnings — a 77% profit jump — signaling that the market's logic has shifted: great earnings are no longer enough when expectations were priced for perfection.",
        type: "callout",
      },
      {
        heading: "Infrastructure vs. Platforms: Two Sides of the AI Trade",
        content: "To understand this rotation, you need to understand the two layers of the AI investment landscape. AI infrastructure companies — chipmakers like Nvidia, equipment makers like ASML, and memory suppliers like Micron — are the 'picks and shovels' of the AI gold rush. They benefit from massive capex spending but face cyclical demand and pricing pressure. AI platform companies — Apple, Microsoft, Meta, Google — build the products and services that actually monetize AI. They have recurring revenue, massive user bases, and multiple paths to AI profitability. As the AI buildout matures, capital is rotating from the builders to the beneficiaries.",
        type: "text",
      },
      {
        heading: "Three Forces Driving the Rotation",
        content: "Three converging forces are accelerating this shift. First, AI spending fatigue — investors are questioning whether the nearly trillion-dollar infrastructure boom justifies its cost, especially as China's Moonshot AI released a free open-weight model (Kimi K3) rivaling frontier systems, reminiscent of the DeepSeek shock of early 2025. Second, crowding risk — Bank of America's July survey shows 82% of fund managers call long semiconductors the most crowded trade, a record high. When everyone is on the same side of the boat, it doesn't take much to tip it. Third, Apple's AI monetization story — with an AI-powered Siri, a locked-in ecosystem of 2 billion devices, and services revenue growing double digits, Apple represents the 'show me the money' phase of AI that infrastructure plays can't match.",
        type: "callout",
      },
      {
        heading: "Oil Shock Adds Fuel to the Rotation",
        content: "Adding to the pressure on tech, oil prices surged to their highest in over a month as US-Iran hostilities escalated in the Strait of Hormuz. WTI crude settled at $82.49/bbl (+4.5% on the day, +14% for the week), while Brent hit $88.10/bbl (+16% weekly). Energy was the only S&P 500 sector to gain on July 18. Higher oil prices mean higher inflation, which means higher-for-longer interest rates — and high-growth tech stocks are the most sensitive to rate expectations. The rotation out of chips and into value-oriented sectors like energy and financials is being amplified by geopolitics.",
        type: "text",
      },
      {
        heading: "Is This a Buying Opportunity or the Start of Something Bigger?",
        content: "Semiconductors are historically cyclical, and the current correction may prove to be a healthy reset rather than a structural collapse. The SOX index is still up ~65% year-to-date, and the fundamental demand story — AI needs chips, and lots of them — hasn't changed. But the easy money has been made. The next phase of the AI trade rewards selectivity: which chip companies have pricing power beyond the current capex cycle? Which platform companies are actually converting AI investment into revenue growth? These are the questions that will separate winners from losers in the second half of 2026.",
        type: "text",
      },
      {
        heading: "How to Position Your Portfolio for the AI Rotation",
        content: "Rather than picking sides in the infrastructure-vs-platforms debate, the smartest approach is to own both — but rebalance toward quality and away from pure momentum. Here's a practical framework for navigating the rotation.",
        type: "list",
        items: [
          "Diversify across the AI stack: Own chip ETFs (SMH, SOXX) for infrastructure exposure AND mega-cap tech (Apple, Microsoft) for platform exposure",
          "Trim crowded positions: If semiconductors are 82% of fund managers' most crowded trade, check whether your portfolio is similarly overweight",
          "Watch energy as a hedge: With oil surging on geopolitical risk, a 5-10% energy allocation (XLE) can offset tech drawdowns",
          "Track the Apple-Nvidia market cap ratio: A sustained shift would confirm the rotation has legs — make it a weekly check",
          "Keep cash ready: Q2 earnings season is just getting started (90% of companies beating so far), and volatility creates entry points",
          "Don't abandon chips entirely: The AI infrastructure story is multi-year — a 20% correction in a sector up 65% YTD is a pullback, not a collapse",
        ],
      },
      {
        heading: "The Bottom Line",
        content: "The AI trade isn't dying — it's differentiating. The first phase rewarded anyone selling AI hardware. The second phase will reward companies that can prove AI generates actual profits. Apple briefly passing Nvidia in market cap is a symbolic moment, not a permanent shift — but it captures something real: the market is getting more discerning about where in the AI value chain it places its bets. As an investor, your job isn't to predict which company wins the market cap race. It's to own both the builders and the beneficiaries, stay diversified, and resist the urge to chase whichever narrative is loudest this week.",
        type: "text",
      },
    ],
  },
  {
    slug: "goldilocks-is-dead-new-market-regime",
    title: "Goldilocks Is Dead: How to Invest in the New Market Regime of 2026",
    description: "Wall Street declares the end of the 'Goldilocks' market. Higher-for-longer interest rates, stubborn inflation, a commodities boom, and geopolitical turmoil have reshaped the investing landscape. Learn what killed Goldilocks, why lithium is up 82%, how to invest in commodities, and how to build a portfolio built for the new regime.",
    readTime: "9 min",
    icon: "Zap",
    date: "2026-07-19",
    lastUpdated: "2026-07-19",
    tags: ["Intermediate", "Market Regime", "Commodities", "Interest Rates", "Portfolio Strategy"],
    sections: [
      {
        heading: "What Was the Goldilocks Market — and Why Is It Dead?",
        content: "For much of the 2023-2025 period, markets enjoyed a 'Goldilocks' environment: inflation falling, growth steady, and the Fed signaling rate cuts. It was 'not too hot, not too cold' — perfect conditions for both stocks and bonds to rally. BMO Capital Markets officially declared this era over in July 2026. The new regime features sticky inflation above central bank targets, interest rates locked at elevated levels, tight liquidity, and a US dollar that refuses to weaken. Understanding what killed Goldilocks is the first step to investing successfully in what comes next.",
        type: "text",
      },
      {
        heading: "The Four Horsemen of the New Regime",
        content: "Four structural forces have permanently shifted the investing landscape. First, higher-for-longer rates — the Fed Funds Rate sits near 3.5%, and markets now price the next rate hike for December, not September. Second, geopolitical energy shocks — US-Iran military exchanges have driven Brent crude up 16% in a single week to near $89/barrel, threatening to reignite inflation. Third, fiscal dominance — government deficits remain historically large, absorbing capital that once flowed to private markets. Fourth, deglobalization — supply chains are being reshored, raising costs and reducing the efficiency gains that kept inflation low for decades.",
        type: "callout",
      },
      {
        heading: "The Commodities Super-Cycle: Lithium +82%, Iridium +58%",
        content: "One of the clearest signals that Goldilocks is dead is the commodities boom. Lithium hydroxide has surged 82% year-to-date, driven by insatiable demand for EV batteries and grid-scale energy storage. Iridium — essential for clean-tech electrolysis — is up 58%. Natural gas has gained 43% on energy security concerns. Even WTI crude is up 23% YTD before the latest Middle East escalation. Commodities thrive in the new regime because they offer: (1) inflation protection, (2) supply constraints from years of underinvestment, and (3) structural demand from electrification and the energy transition.",
        type: "text",
      },
      {
        heading: "Safe Havens Aren't Safe Anymore",
        content: "Traditional safe-haven assets have been crushed in the new regime. Gold is down 23% from its January peak — higher real yields make non-yielding assets unattractive, and the strong dollar adds downward pressure. Bitcoin has fallen 29% year-to-date. Even bonds, the classic safety trade, have been volatile as the 10-year Treasury yield climbed to 4.46%. When the 'risk-free' asset delivers price losses, investors need to rethink what 'safe' means. In the new regime, commodities and cash have replaced gold and bonds as portfolio stabilizers.",
        type: "callout",
      },
      {
        heading: "The 'No Landing' Consensus: What Could Go Wrong?",
        content: "A record 54% of fund managers expect a 'no landing' scenario — the economy keeps growing, rates stay elevated, and inflation never quite returns to 2%. Cash allocations have fallen to an uber-low 3.6%, triggering BofA's contrarian sell signal. When consensus is this lopsided, the biggest risk is that everyone is wrong. If inflation re-accelerates (watch oil prices), the Fed could hike into an election year — a historically rare move that would shock markets. If growth slows faster than expected, corporate earnings — currently forecast to grow 26% YoY — could disappoint dramatically.",
        type: "text",
      },
      {
        heading: "How to Build a New-Regime Portfolio",
        content: "The playbook that worked in the Goldilocks era — own growth stocks, buy the dip, expect rates to fall — needs a rewrite. Here's a framework for the new regime.",
        type: "list",
        items: [
          "Commodities allocation (10-15%): Lithium ETFs (LIT), broad commodity funds (DBC), or energy sector (XLE) for inflation protection",
          "Short-duration bonds: With the 10-year at 4.46%, short-term Treasuries and floating-rate notes offer yield without duration risk",
          "Value over growth: In higher-rate environments, companies with current cash flows outperform those promising future profits — financials (XLF) and energy lead",
          "Cash as a position: With cash yielding competitive returns and a contrarian sell signal flashing, 5-10% cash provides both optionality and defense",
          "International diversification: A strong dollar makes ex-US assets cheaper — consider developed Europe and Japan (up 34% YTD) for non-US growth",
          "Reduce gold and Bitcoin exposure: Both have proven poor hedges in the current rate environment — treat them as speculative positions, not portfolio anchors",
        ],
      },
      {
        heading: "Commodities for Beginners: How to Get Started",
        content: "If you've never invested in commodities, the easiest entry point is through ETFs. The LIT ETF (Global X Lithium & Battery Tech) gives exposure to the lithium boom. DBC (Invesco DB Commodity Index) tracks a diversified basket of energy, metals, and agriculture. XLE (Energy Select Sector SPDR) focuses on oil and gas majors. For more targeted exposure, copper ETFs (COPX) and uranium ETFs (URA) tap into electrification and nuclear energy themes. Start small — commodities are volatile — and treat them as portfolio diversifiers, not get-rich-quick bets.",
        type: "text",
      },
      {
        heading: "The Bottom Line",
        content: "The end of Goldilocks doesn't mean the end of investing opportunities — it means the end of the easy ones. When rates were zero and inflation was absent, everything went up. In the new regime, asset selection matters again. Commodities are outperforming, value is beating growth, and cash is no longer trash. The investors who adapt to the new regime — by adding inflation hedges, reducing duration exposure, and staying globally diversified — will be the ones who thrive in the second half of the 2020s. The Goldilocks era was comfortable. The new regime rewards preparation.",
        type: "text",
      },
    ],
  },
];

export function getLearnArticle(slug: string): LearnArticle | undefined {
  return learnArticles.find((a) => a.slug === slug);
}

export function getLearnSlugs(): string[] {
  return learnArticles.map((a) => a.slug);
}
