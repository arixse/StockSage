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
    title: "Technical Analysis: A Beginner's Guide",
    description: "Learn how to read stock charts, understand key indicators like RSI and MACD, and use technical analysis to time your entries and exits. No prior experience needed.",
    readTime: "8 min",
    icon: "CandlestickChart",
    date: "2026-07-14",
    lastUpdated: "2026-07-14",
    tags: ["Beginner", "Technical Analysis", "Charts"],
    sections: [
      {
        heading: "What is Technical Analysis?",
        content: "Technical analysis is the study of price movements and trading volume to forecast future price direction. Unlike fundamental analysis, which examines a company's financials and business model, technical analysis focuses purely on what the market is doing — price action, trends, and patterns. The core belief: all known information is already reflected in the price.",
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
        heading: "Moving Averages: The Trend's Compass",
        content: "A moving average (MA) smooths out price data to reveal the underlying trend. The two most common are the 50-day MA (short-term trend) and the 200-day MA (long-term trend). When the 50-day crosses above the 200-day, it's called a 'Golden Cross' — a bullish signal. The opposite is a 'Death Cross' — a bearish signal. StockSage calculates these automatically for every stock you track.",
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
        heading: "How StockSage Helps",
        content: "StockSage computes moving averages, RSI, MACD, volume ratios, and Bollinger Bands for every stock on your watchlist. The dashboard shows you at a glance whether each stock is bullish or bearish, overbought or oversold, and whether a Golden Cross or Death Cross is forming. Visit the Dashboard to see your stocks' technical health in one view.",
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
