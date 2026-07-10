/**
 * Financial glossary terms for the /glossary pages.
 * Each term targets a specific long-tail search query.
 */
export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  category: "fundamental-analysis" | "technical-analysis" | "valuation" | "market-concepts" | "strategies";
  relatedTerms?: string[];
  examples?: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  // ── Fundamental Analysis ──
  {
    slug: "pe-ratio",
    term: "P/E Ratio (Price-to-Earnings)",
    definition:
      "The P/E ratio measures a company's current share price relative to its earnings per share (EPS). It tells you how much investors are willing to pay for each dollar of earnings. A high P/E may indicate a growth stock where investors expect rapid earnings expansion; a low P/E may signal a value stock or a company facing headwinds. The average P/E for the S&P 500 has historically ranged from 15 to 20.",
    category: "valuation",
    relatedTerms: ["eps", "peg-ratio", "forward-pe"],
    examples: "If a stock trades at $100 and has EPS of $5, its P/E ratio is 20. This means investors pay $20 for every $1 of earnings.",
  },
  {
    slug: "eps",
    term: "EPS (Earnings Per Share)",
    definition:
      "Earnings Per Share (EPS) is a company's net profit divided by the number of outstanding shares. It is one of the most widely used indicators of corporate profitability. Higher EPS means more profit attributable to each share. EPS is the foundation for calculating the P/E ratio and is reported quarterly in earnings releases.",
    category: "fundamental-analysis",
    relatedTerms: ["pe-ratio", "diluted-eps", "revenue"],
    examples: "A company with $10 billion in net income and 2 billion shares outstanding has an EPS of $5.00.",
  },
  {
    slug: "market-cap",
    term: "Market Capitalization (Market Cap)",
    definition:
      "Market capitalization is the total dollar value of a company's outstanding shares, calculated by multiplying share price by total shares outstanding. Companies are categorized as large-cap ($10B+), mid-cap ($2B-$10B), small-cap ($250M-$2B), or micro-cap (under $250M). Market cap reflects what the market believes a company is worth, not necessarily its intrinsic value.",
    category: "valuation",
    relatedTerms: ["enterprise-value", "pe-ratio", "book-value"],
    examples: "Apple (AAPL) at $200/share × 15 billion shares = $3 trillion market cap, making it a mega-cap stock.",
  },
  {
    slug: "dividend-yield",
    term: "Dividend Yield",
    definition:
      "Dividend yield is the annual dividend per share divided by the share price, expressed as a percentage. It represents the annual cash return you earn from dividends alone, excluding any price appreciation. Mature, financially stable companies in sectors like utilities, consumer staples, and REITs tend to offer higher yields. A very high yield can sometimes signal that the stock price has fallen sharply and the dividend may be at risk.",
    category: "fundamental-analysis",
    relatedTerms: ["eps", "pe-ratio", "free-cash-flow"],
    examples: "A stock priced at $50 paying $2 in annual dividends has a dividend yield of 4%.",
  },
  {
    slug: "peg-ratio",
    term: "PEG Ratio (Price/Earnings-to-Growth)",
    definition:
      "The PEG ratio is the P/E ratio divided by the expected earnings growth rate. It adds a growth dimension to valuation — while P/E tells you how expensive a stock is relative to past earnings, PEG tells you whether that price is justified by expected future growth. A PEG below 1.0 is often considered undervalued, suggesting the stock's growth is outpacing its valuation multiple.",
    category: "valuation",
    relatedTerms: ["pe-ratio", "eps", "revenue-growth"],
    examples: "Stock with P/E of 30 and 30% expected earnings growth = PEG of 1.0. Stock with P/E of 15 and 5% growth = PEG of 3.0 (potentially overvalued).",
  },
  {
    slug: "book-value",
    term: "Book Value",
    definition:
      "Book value is the net asset value of a company: total assets minus total liabilities. It represents what shareholders would theoretically receive if the company were liquidated. The price-to-book (P/B) ratio compares market value to book value — a P/B under 1.0 may indicate the stock is undervalued. Book value is more meaningful for asset-heavy businesses like banks and manufacturers than for tech companies.",
    category: "valuation",
    relatedTerms: ["market-cap", "enterprise-value", "pe-ratio"],
    examples: "If a company has $500B in assets and $400B in liabilities, its book value is $100B.",
  },
  {
    slug: "free-cash-flow",
    term: "Free Cash Flow (FCF)",
    definition:
      "Free cash flow is the cash a company generates from operations after subtracting capital expenditures (CapEx). It represents the cash available to pay dividends, buy back shares, reduce debt, or invest in growth. FCF is harder to manipulate than earnings, making it a favorite metric for value investors like Warren Buffett. A consistently growing FCF is a strong sign of a healthy business.",
    category: "fundamental-analysis",
    relatedTerms: ["eps", "revenue", "dividend-yield"],
    examples: "Company generates $50B in operating cash flow and spends $15B on CapEx. FCF = $35B.",
  },
  {
    slug: "revenue",
    term: "Revenue (Top Line)",
    definition:
      "Revenue is the total income a company generates from its core business operations before any expenses are deducted. It's called the 'top line' because it appears first on the income statement. Revenue growth is one of the most closely watched metrics — consistent double-digit revenue growth signals strong demand for a company's products or services.",
    category: "fundamental-analysis",
    relatedTerms: ["eps", "free-cash-flow", "profit-margin"],
    examples: "If Tesla sells 1.8 million vehicles at an average price of $45,000, its automotive revenue would be $81 billion.",
  },
  {
    slug: "profit-margin",
    term: "Profit Margin",
    definition:
      "Profit margin measures how much profit a company keeps from each dollar of revenue. There are three types: gross margin (revenue minus cost of goods sold), operating margin (after operating expenses), and net margin (the final bottom line after all costs and taxes). Higher margins generally indicate a strong competitive position (a 'moat'). Compare margins within the same industry, as they vary widely by sector.",
    category: "fundamental-analysis",
    relatedTerms: ["eps", "revenue", "roe"],
    examples: "A software company with $1B in revenue and $300M in net income has a net profit margin of 30% — high for most industries.",
  },
  {
    slug: "roe",
    term: "ROE (Return on Equity)",
    definition:
      "Return on Equity (ROE) measures how efficiently a company uses shareholder equity to generate profits. It is calculated as net income divided by shareholders' equity. A high ROE (15-20%+) indicates a company is effective at reinvesting its earnings. A declining ROE may signal that new investments are not generating adequate returns.",
    category: "fundamental-analysis",
    relatedTerms: ["eps", "profit-margin", "book-value"],
    examples: "Company earns $10B on $50B of shareholder equity = ROE of 20%.",
  },
  {
    slug: "debt-to-equity",
    term: "Debt-to-Equity Ratio",
    definition:
      "The debt-to-equity (D/E) ratio compares a company's total debt to its shareholders' equity, measuring financial leverage. A high D/E ratio means the company relies heavily on borrowed money, which can amplify returns but also increases risk. Conservative investors prefer D/E under 1.0, though capital-intensive industries like utilities and telecoms naturally carry higher ratios.",
    category: "fundamental-analysis",
    relatedTerms: ["book-value", "free-cash-flow", "roe"],
    examples: "Company with $40B in debt and $20B in equity has a D/E of 2.0 — considered high for most sectors.",
  },
  {
    slug: "enterprise-value",
    term: "Enterprise Value (EV)",
    definition:
      "Enterprise Value is a comprehensive measure of a company's total value: market cap plus total debt minus cash and cash equivalents. EV represents the theoretical takeover price — what an acquirer would actually pay to buy the entire company. EV/EBITDA is a popular valuation multiple that accounts for different capital structures, making it better than P/E for comparing companies across industries.",
    category: "valuation",
    relatedTerms: ["market-cap", "pe-ratio", "book-value"],
    examples: "Company with $200B market cap, $50B debt, $10B cash → EV = $240B.",
  },
  {
    slug: "ebitda",
    term: "EBITDA",
    definition:
      "EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization. It measures a company's operating profitability by stripping out non-operating expenses and non-cash charges. EBITDA is popular because it allows cleaner comparison between companies with different tax rates, debt levels, and capital investment cycles. Critics argue it can paint an overly rosy picture by ignoring real costs.",
    category: "fundamental-analysis",
    relatedTerms: ["eps", "free-cash-flow", "enterprise-value", "revenue"],
  },

  // ── Technical Analysis ──
  {
    slug: "rsi",
    term: "RSI (Relative Strength Index)",
    definition:
      "The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and magnitude of recent price changes on a 0 to 100 scale. RSI above 70 indicates overbought conditions (potential pullback), while RSI below 30 indicates oversold conditions (potential bounce). RSI is most effective when combined with trend analysis — an overbought signal in a strong uptrend may be less reliable.",
    category: "technical-analysis",
    relatedTerms: ["macd", "moving-average", "bollinger-bands", "support-resistance"],
    examples: "If a stock's RSI hits 85 after a rapid rally, it may be due for a correction. If RSI drops to 22 during panic selling, the stock may be oversold.",
  },
  {
    slug: "macd",
    term: "MACD (Moving Average Convergence Divergence)",
    definition:
      "MACD is a trend-following momentum indicator that shows the relationship between two moving averages (typically the 12-period and 26-period EMAs). The MACD line crossing above the signal line is a bullish signal; crossing below is bearish. Divergence — when price makes a new high but MACD doesn't — can warn of a weakening trend. MACD is best used in trending markets rather than choppy sideways action.",
    category: "technical-analysis",
    relatedTerms: ["rsi", "moving-average", "bollinger-bands"],
    examples: "If a stock keeps making higher highs but MACD makes lower highs, this bearish divergence may precede a reversal.",
  },
  {
    slug: "moving-average",
    term: "Moving Average (MA)",
    definition:
      "A moving average smooths out price data by creating a constantly updated average over a set period. The 50-day and 200-day simple moving averages (SMA) are the most widely followed. When a shorter MA crosses above a longer MA, it is called a 'golden cross' (bullish); the opposite is a 'death cross' (bearish). Moving averages act as dynamic support and resistance levels in trending markets.",
    category: "technical-analysis",
    relatedTerms: ["macd", "bollinger-bands", "support-resistance"],
    examples: "If AAPL trades at $180 and its 50-day SMA is $175 while the 200-day SMA is $165, the stock is above both key averages — a short-term bullish signal.",
  },
  {
    slug: "bollinger-bands",
    term: "Bollinger Bands",
    definition:
      "Bollinger Bands consist of a middle band (20-day SMA) and two outer bands set 2 standard deviations above and below. The bands expand during high volatility and contract during calm markets. A 'squeeze' (narrow bands) often precedes a breakout. Prices touching the upper band may be extended to the upside; touching the lower band may be oversold. Bollinger Bands work best when combined with other indicators like RSI.",
    category: "technical-analysis",
    relatedTerms: ["rsi", "moving-average", "volatility"],
    examples: "During a low-volatility period, Bollinger Bands narrow to a tight range. A sharp breakout above the upper band with high volume may signal the start of a new uptrend.",
  },
  {
    slug: "support-resistance",
    term: "Support and Resistance",
    definition:
      "Support is a price level where a downtrend tends to pause because buying interest overcomes selling pressure. Resistance is where an uptrend tends to stall because sellers step in. These levels form because of market psychology — traders remember past turning points. Once a resistance level is broken, it often becomes new support (and vice versa). Support and resistance are the foundation of technical analysis.",
    category: "technical-analysis",
    relatedTerms: ["moving-average", "rsi", "volume"],
    examples: "If a stock bounces off $150 three times, $150 is considered strong support. If it later breaks below $150, that level may become resistance.",
  },
  {
    slug: "volume",
    term: "Trading Volume",
    definition:
      "Volume is the number of shares traded in a given period. It confirms the strength of price moves: a breakout on high volume is more reliable than one on low volume. Unusual volume spikes can signal institutional buying or selling. The average daily volume provides a baseline — stocks with higher average volume tend to be more liquid with tighter bid-ask spreads.",
    category: "technical-analysis",
    relatedTerms: ["support-resistance", "moving-average", "rsi"],
    examples: "A stock breaking above resistance on 3× its normal volume is a much stronger bullish signal than the same breakout on average or low volume.",
  },

  // ── Market Concepts ──
  {
    slug: "market-cap",
    term: "Market Capitalization",
    definition:
      "Market capitalization (market cap) is the total market value of a company's outstanding shares, calculated as share price multiplied by shares outstanding. Companies are classified as large-cap ($10B+), mid-cap ($2B–$10B), small-cap ($250M–$2B), or micro-cap (under $250M). Market cap is a core dimension for portfolio diversification and factor-based investing strategies.",
    category: "market-concepts",
    relatedTerms: ["pe-ratio", "enterprise-value", "diversification"],
    examples: "Visa (V) at $300/share with 2 billion shares = $600B market cap (large-cap).",
  },
  {
    slug: "volatility",
    term: "Volatility",
    definition:
      "Volatility measures how much a stock's price fluctuates over time. High volatility means wider price swings (more risk but also more opportunity), while low volatility means steadier, more predictable returns. The VIX index — often called the 'fear gauge' — measures implied volatility for S&P 500 options. Beta quantifies a stock's volatility relative to the market: a beta of 1.5 means the stock typically moves 50% more than the index.",
    category: "market-concepts",
    relatedTerms: ["beta", "bollinger-bands", "support-resistance"],
    examples: "During the 2020 COVID crash, the VIX spiked above 80. Normal VIX readings are 12-20. A VIX above 30 signals elevated market fear.",
  },
  {
    slug: "beta",
    term: "Beta",
    definition:
      "Beta measures a stock's volatility relative to the overall market. The market itself has a beta of 1.0. A stock with a beta of 1.2 is theoretically 20% more volatile than the market; a beta of 0.8 means 20% less volatile. High-beta stocks tend to outperform in bull markets and underperform in bear markets. Low-beta stocks are often defensive holdings like utilities and consumer staples.",
    category: "market-concepts",
    relatedTerms: ["volatility", "alpha", "diversification"],
    examples: "TSLA typically has a beta of ~2.0 — if the S&P 500 rises 1%, TSLA might rise 2%. A utility stock like DUK may have a beta of 0.6.",
  },
  {
    slug: "alpha",
    term: "Alpha",
    definition:
      "Alpha is the excess return of an investment relative to a benchmark index, after adjusting for risk (beta). A positive alpha means the investment outperformed on a risk-adjusted basis; negative alpha means it underperformed. Alpha is the holy grail of active investing — it represents the value that a strategy or manager adds beyond what passive exposure would deliver.",
    category: "market-concepts",
    relatedTerms: ["beta", "volatility", "sharpe-ratio"],
    examples: "If the S&P 500 returns 10% and a fund returns 13% with the same beta, the alpha is 3%.",
  },
  {
    slug: "sharpe-ratio",
    term: "Sharpe Ratio",
    definition:
      "The Sharpe ratio measures risk-adjusted return — how much excess return you earn per unit of risk taken. It is calculated as (portfolio return − risk-free rate) ÷ portfolio standard deviation. A Sharpe ratio above 1.0 is considered good, above 2.0 is excellent. The Sharpe ratio helps compare investments with different levels of volatility on a level playing field.",
    category: "market-concepts",
    relatedTerms: ["alpha", "beta", "volatility"],
    examples: "Portfolio A returns 12% with 8% volatility; Portfolio B returns 12% with 15% volatility. Portfolio A has a higher Sharpe ratio — same return with less risk.",
  },
  {
    slug: "bull-market",
    term: "Bull Market",
    definition:
      "A bull market is a sustained period of rising stock prices, typically defined as a 20% or greater increase from recent lows. Bull markets are fueled by economic growth, strong corporate earnings, low unemployment, and investor optimism. The average bull market since 1942 has lasted about 5 years with an average cumulative gain of ~180%. Investors should remain disciplined during bulls — valuations can become stretched.",
    category: "market-concepts",
    relatedTerms: ["bear-market", "correction", "volatility"],
    examples: "The bull market from 2009 to 2020 was the longest in history, lasting over 11 years with the S&P 500 rising ~400%.",
  },
  {
    slug: "bear-market",
    term: "Bear Market",
    definition:
      "A bear market is a sustained decline of 20% or more from recent highs. Bear markets are typically shorter than bulls (averaging 9-15 months) but can be psychologically devastating. They are triggered by recessions, high inflation, geopolitical crises, or burst asset bubbles. Historically, every bear market has eventually given way to a new bull market and new highs — patient investors are rewarded.",
    category: "market-concepts",
    relatedTerms: ["bull-market", "correction", "volatility"],
    examples: "The 2022 bear market saw the S&P 500 fall ~25% and the Nasdaq drop ~33% as the Fed raised rates aggressively. By mid-2023, both had recovered significantly.",
  },
  {
    slug: "correction",
    term: "Market Correction",
    definition:
      "A correction is a decline of 10% to 20% from a recent peak. Corrections are normal, healthy parts of market cycles — they reset overextended valuations and provide buying opportunities. Historically, the S&P 500 experiences a correction roughly every 1-2 years on average. Corrections are distinct from bear markets (20%+ declines) which are rarer and more severe.",
    category: "market-concepts",
    relatedTerms: ["bear-market", "bull-market", "volatility"],
    examples: "In October 2023, the S&P 500 corrected ~10% over 3 months before resuming its uptrend — a textbook correction within an ongoing bull market.",
  },
  {
    slug: "diversification",
    term: "Diversification",
    definition:
      "Diversification means spreading investments across different assets, sectors, geographies, and styles to reduce risk. Because different assets don't move perfectly in sync (low correlation), losses in one area can be offset by gains in another. Diversification is often called the only 'free lunch' in investing — it can reduce volatility without reducing expected returns. Over-diversification, however, can dilute returns without further reducing risk.",
    category: "strategies",
    relatedTerms: ["correlation", "etf", "asset-allocation"],
    examples: "A diversified portfolio might hold: 50% US stocks (VTI), 30% international stocks (VXUS), 20% bonds (BND).",
  },
  {
    slug: "dollar-cost-averaging",
    term: "Dollar-Cost Averaging (DCA)",
    definition:
      "Dollar-cost averaging is investing a fixed amount at regular intervals regardless of price. DCA reduces the risk of market timing — you buy more shares when prices are low and fewer when prices are high. Over time, the average cost per share tends to be lower than the average price per share. DCA is especially effective in volatile and bear markets, and is the default approach for 401(k) contributions.",
    category: "strategies",
    relatedTerms: ["lump-sum", "bear-market", "volatility"],
    examples: "Investing $500 monthly into an S&P 500 ETF, regardless of whether the market is up or down, is dollar-cost averaging.",
  },
  {
    slug: "etf",
    term: "ETF (Exchange-Traded Fund)",
    definition:
      "An Exchange-Traded Fund is a basket of securities (stocks, bonds, or other assets) that trades on an exchange like a stock. ETFs offer instant diversification, typically have lower fees than mutual funds, and are more tax-efficient. Popular examples include SPY (S&P 500), QQQ (Nasdaq-100), and VTI (Total US Market). ETFs have democratized investing — you can own a slice of thousands of companies with a single purchase.",
    category: "market-concepts",
    relatedTerms: ["diversification", "expense-ratio", "index-fund"],
    examples: "Buying one share of VTI gives you exposure to over 3,700 US companies across all sectors and market caps.",
  },
  {
    slug: "expense-ratio",
    term: "Expense Ratio",
    definition:
      "The expense ratio is the annual fee that a fund charges investors, expressed as a percentage of assets. A 0.03% expense ratio means you pay $3 per year for every $10,000 invested. Over decades, expense ratios have an outsized compounding effect — a 1% fee can consume over 25% of your returns over 30 years. Index ETFs tend to have the lowest expense ratios (0.03-0.10%).",
    category: "market-concepts",
    relatedTerms: ["etf", "index-fund", "diversification"],
    examples: "VTI has a 0.03% expense ratio. An actively managed mutual fund might charge 1.00%. On a $100K investment over 30 years at 7% return, the difference would be roughly $120K.",
  },
  {
    slug: "index-fund",
    term: "Index Fund",
    definition:
      "An index fund is a mutual fund or ETF designed to track a specific market index like the S&P 500 or the total US stock market. Index funds offer broad market exposure with minimal costs — there is no expensive research team picking stocks. John Bogle, founder of Vanguard, popularized index investing, and studies consistently show that most actively managed funds underperform their benchmark over long periods.",
    category: "market-concepts",
    relatedTerms: ["etf", "expense-ratio", "diversification"],
    examples: "An S&P 500 index fund holds all 500 stocks in the index, weighted by market cap, with an expense ratio as low as 0.03%.",
  },
  {
    slug: "ipo",
    term: "IPO (Initial Public Offering)",
    definition:
      "An IPO is the process by which a private company sells shares to the public for the first time, listing on a stock exchange. Companies use IPOs to raise capital for expansion or to let early investors cash out. IPOs often generate hype and volatile first-day trading, but long-term IPO returns have historically been mixed. A 'direct listing' is an alternative where no new shares are issued — existing shareholders sell directly.",
    category: "market-concepts",
    relatedTerms: ["market-cap", "volume", "volatility"],
    examples: "Reddit (RDDT) IPO in March 2024 was one of the most anticipated tech IPOs, with shares surging over 48% on their first day.",
  },
  {
    slug: "stock-split",
    term: "Stock Split",
    definition:
      "A stock split increases the number of shares while proportionally decreasing the price per share, leaving the total value unchanged. A 2-for-1 split doubles the share count and halves the price. Companies split their stock to make shares more accessible to retail investors. Splits don't change the company's fundamentals, but they often generate positive sentiment and can increase liquidity.",
    category: "market-concepts",
    relatedTerms: ["market-cap", "eps"],
    examples: "Nvidia's 10-for-1 stock split in June 2024 took the share price from ~$1,200 to ~$120 while multiplying outstanding shares by 10.",
  },
  {
    slug: "dividend",
    term: "Dividend",
    definition:
      "A dividend is a portion of a company's earnings paid out to shareholders, usually quarterly. Mature, profitable companies with stable cash flows are the most reliable dividend payers. The dividend payout ratio (dividends ÷ net income) indicates sustainability — a ratio above 80% may be unsustainable. Dividend reinvestment (DRIP) is a powerful wealth-building tool due to compounding.",
    category: "market-concepts",
    relatedTerms: ["dividend-yield", "free-cash-flow", "eps"],
    examples: "Coca-Cola (KO) has paid and increased its dividend for over 60 consecutive years, making it a 'Dividend King.'",
  },
  {
    slug: "bid-ask-spread",
    term: "Bid-Ask Spread",
    definition:
      "The bid price is the highest price a buyer is willing to pay; the ask price is the lowest price a seller will accept. The difference between them is the spread — a cost of trading. Highly liquid stocks like AAPL may have a 1-cent spread; thinly traded stocks can have spreads of several cents or more. The spread matters most for active traders making many transactions.",
    category: "market-concepts",
    relatedTerms: ["volume", "market-cap", "liquidity"],
    examples: "AAPL bid: $175.00, ask: $175.01 → spread of $0.01 (0.006%). A micro-cap stock might have a bid of $5.20 and ask of $5.50 → spread of $0.30 (5.8%).",
  },
  {
    slug: "limit-order",
    term: "Limit Order",
    definition:
      "A limit order specifies the maximum price you'll pay to buy (or the minimum you'll accept to sell). Unlike a market order that executes immediately at the current price, a limit order may not fill if the market never reaches your price. Limit orders protect you from bad fills in volatile conditions or low-liquidity stocks. They are the safer default choice for most retail investors.",
    category: "market-concepts",
    relatedTerms: ["bid-ask-spread", "volume", "stop-loss"],
    examples: "You place a limit buy order for AAPL at $170. The order only executes if AAPL trades at or below $170.",
  },
  {
    slug: "stop-loss",
    term: "Stop-Loss Order",
    definition:
      "A stop-loss order automatically sells a stock when it falls to a predetermined price, limiting potential losses. A stop-loss at 10% below your purchase price caps your downside. Trailing stops move the trigger price up as the stock appreciates, locking in gains. Stop-loss orders don't guarantee execution at the exact trigger price — in a flash crash, you may get filled much lower.",
    category: "strategies",
    relatedTerms: ["limit-order", "volatility", "support-resistance"],
    examples: "Buying NVDA at $120 with a stop-loss at $108 limits your maximum loss to 10%. If NVDA drops to $108, the stop triggers and sells automatically.",
  },

  // ── Valuation ──
  {
    slug: "intrinsic-value",
    term: "Intrinsic Value",
    definition:
      "Intrinsic value is what a stock is truly worth based on fundamentals — future cash flows, growth rate, and risk — as opposed to its current market price. Value investors aim to buy stocks trading well below intrinsic value (a 'margin of safety'). Intrinsic value is inherently an estimate, not a precise number, and different models (DCF, dividend discount, comparable multiples) produce different results.",
    category: "valuation",
    relatedTerms: ["dcf", "margin-of-safety", "book-value"],
    examples: "If your DCF model says a stock is worth $150 but the market price is $100, the stock may be undervalued with a 33% margin of safety.",
  },
  {
    slug: "dcf",
    term: "DCF (Discounted Cash Flow)",
    definition:
      "Discounted Cash Flow (DCF) is a valuation method that estimates a company's intrinsic value by projecting its future free cash flows and discounting them back to today's dollars using a required rate of return. The core idea: a dollar tomorrow is worth less than a dollar today. DCF is sensitive to assumptions about growth rate and discount rate — small changes produce large swings in value.",
    category: "valuation",
    relatedTerms: ["intrinsic-value", "free-cash-flow", "enterprise-value"],
    examples: "A DCF model projects $10B in annual FCF growing at 8% for 10 years, then discounts at 10%. The present value of those cash flows is the estimated intrinsic value.",
  },
  {
    slug: "margin-of-safety",
    term: "Margin of Safety",
    definition:
      "Margin of safety is the difference between a stock's intrinsic value and its market price, expressed as a percentage. Benjamin Graham, the father of value investing, popularized the concept: buy at a large enough discount that you can be wrong about your valuation and still not lose money. A 30-50% margin of safety is a common target. The margin of safety is your buffer against valuation errors and unforeseen events.",
    category: "valuation",
    relatedTerms: ["intrinsic-value", "dcf", "pe-ratio"],
    examples: "If you estimate a stock's intrinsic value at $200 and the market price is $130, you have a 35% margin of safety.",
  },
  {
    slug: "forward-pe",
    term: "Forward P/E",
    definition:
      "Forward P/E uses estimated future earnings (typically next 12 months) instead of trailing 12-month earnings. Analysts use forward P/E to assess whether a stock is cheap relative to expected growth. Companies with rapidly growing earnings may have a high trailing P/E but a reasonable forward P/E. The key risk: forward P/E is only as reliable as the earnings estimates, which can prove optimistic.",
    category: "valuation",
    relatedTerms: ["pe-ratio", "peg-ratio", "eps"],
    examples: "A company earned $2/share last year (trailing P/E = 50 at $100) but is expected to earn $5/share next year (forward P/E = 20).",
  },
  {
    slug: "price-to-book",
    term: "Price-to-Book (P/B) Ratio",
    definition:
      "The price-to-book ratio compares a company's market value to its book value (net assets). A P/B below 1.0 may indicate undervaluation — the market values the company at less than its accounting net worth. P/B works best for banks, insurers, and other asset-heavy industries. It is less meaningful for tech or service companies where intellectual property and brand value dominate.",
    category: "valuation",
    relatedTerms: ["book-value", "pe-ratio", "enterprise-value"],
    examples: "A bank trading at 0.8× book value means the market values its loan portfolio and assets at an 80% discount. This could be a bargain — or a sign the market expects loan losses.",
  },

  // ── Strategies ──
  {
    slug: "value-investing",
    term: "Value Investing",
    definition:
      "Value investing is the strategy of buying stocks that trade below their intrinsic value — buying dollar bills for 50 cents. Pioneered by Benjamin Graham and popularized by Warren Buffett, it focuses on fundamentals: low P/E and P/B ratios, strong free cash flow, and durable competitive advantages (moats). Value investing requires patience; undervalued stocks can stay cheap for years before the market recognizes their worth.",
    category: "strategies",
    relatedTerms: ["intrinsic-value", "margin-of-safety", "pe-ratio", "growth-investing"],
  },
  {
    slug: "growth-investing",
    term: "Growth Investing",
    definition:
      "Growth investing targets companies expected to grow revenues and earnings significantly faster than the market average. Growth investors accept higher valuations (high P/E, high P/B) in exchange for rapid compounding. Sectors like technology and biotech are classic growth domains. The risk: if growth slows, high-multiple stocks can suffer severe drawdowns. The best growth companies have wide moats that sustain their growth trajectory.",
    category: "strategies",
    relatedTerms: ["peg-ratio", "revenue-growth", "value-investing", "pe-ratio"],
  },
  {
    slug: "dividend-investing",
    term: "Dividend Investing",
    definition:
      "Dividend investing focuses on companies that regularly distribute cash to shareholders. Key metrics include dividend yield, payout ratio, and dividend growth rate. Dividend Aristocrats (25+ years of consecutive increases) and Dividend Kings (50+ years) are the gold standards. Dividend investing is popular with retirees seeking income, but reinvesting dividends during accumulation years turbocharges compound returns.",
    category: "strategies",
    relatedTerms: ["dividend", "dividend-yield", "free-cash-flow"],
  },
  {
    slug: "momentum-investing",
    term: "Momentum Investing",
    definition:
      "Momentum investing is based on the observation that stocks that have performed well recently tend to continue outperforming in the near term, and vice versa for losers. Momentum strategies buy recent winners and sell recent losers, typically holding for 3-12 months. Momentum is one of the most well-documented market anomalies, but it can suffer severe drawdowns during market regime changes (reversals).",
    category: "strategies",
    relatedTerms: ["rsi", "moving-average", "growth-investing", "volatility"],
  },
  {
    slug: "asset-allocation",
    term: "Asset Allocation",
    definition:
      "Asset allocation is how you divide your portfolio across different asset classes: stocks, bonds, cash, real estate, and alternatives. Studies show asset allocation explains roughly 90% of the variability in portfolio returns over time — stock selection and market timing matter less. The classic allocation rule: 110 minus your age = percentage in stocks. Rebalance periodically to maintain your target allocation.",
    category: "strategies",
    relatedTerms: ["diversification", "etf", "index-fund"],
    examples: "A 35-year-old using the 110-minus-age rule: 75% stocks / 25% bonds. A 60-year-old near retirement: 50% stocks / 50% bonds.",
  },
  {
    slug: "sector-rotation",
    term: "Sector Rotation",
    definition:
      "Sector rotation is the strategy of shifting investments between stock market sectors to capitalize on the economic cycle. Early-cycle sectors (consumer discretionary, industrials, financials) tend to lead during recoveries. Late-cycle sectors (energy, materials) tend to lead near peaks. Defensive sectors (utilities, healthcare, consumer staples) hold up better during recessions. Sector rotation is easier with sector ETFs than individual stock picking.",
    category: "strategies",
    relatedTerms: ["bull-market", "bear-market", "etf", "diversification"],
  },

  // ── Additional Terms ──
  {
    slug: "compound-interest",
    term: "Compound Interest",
    definition:
      "Compound interest is interest earned on interest — returns generate their own returns, creating exponential growth over time. The compound interest formula: A = P(1 + r/n)^(nt). Time (t) is in the exponent, which is why starting early is so powerful. The Rule of 72 is a quick mental shortcut: divide 72 by your annual return to estimate how many years it takes to double your money.",
    category: "market-concepts",
    relatedTerms: ["dollar-cost-averaging", "dividend", "index-fund"],
    examples: "Investing $10,000 at 8% annual return: after 10 years ≈ $21,589. After 30 years ≈ $100,627. The majority of the gains happen in the later years.",
  },
  {
    slug: "correlation",
    term: "Correlation",
    definition:
      "Correlation measures how two assets move relative to each other, on a scale from -1 (perfectly opposite) to +1 (perfectly in sync). Low correlation between assets is the foundation of diversification. US and international stocks have ~0.7 correlation. Stocks and bonds historically had ~0.2 correlation, though this can spike during crises. Adding assets with low or negative correlation to a portfolio can reduce overall volatility.",
    category: "market-concepts",
    relatedTerms: ["diversification", "volatility", "beta"],
    examples: "During the 2008 crisis, most asset classes became highly correlated (the 'correlation to one' phenomenon), reducing diversification benefits when they were needed most.",
  },
  {
    slug: "liquidity",
    term: "Liquidity",
    definition:
      "Liquidity is how easily an asset can be bought or sold without moving its price significantly. Cash is perfectly liquid. Large-cap stocks like AAPL are highly liquid (millions of shares trade daily with tight spreads). Small-cap stocks, corporate bonds, and real estate have lower liquidity. Illiquid assets often trade at a discount (liquidity premium) — you get paid for accepting the inconvenience of harder entry and exit.",
    category: "market-concepts",
    relatedTerms: ["bid-ask-spread", "volume", "market-cap"],
    examples: "Selling $10,000 of AAPL barely moves the price. Selling $10,000 of a micro-cap stock might push the price down several percent due to low liquidity.",
  },
  {
    slug: "rebalancing",
    term: "Portfolio Rebalancing",
    definition:
      "Rebalancing is the process of returning a portfolio to its target asset allocation by selling overweight assets and buying underweight ones. It enforces sell-high-buy-low discipline automatically. Most advisors recommend rebalancing quarterly or annually — tax-advantaged accounts (IRAs, 401(k)s) are ideal for rebalancing since there are no tax consequences. Some brokerages offer automatic rebalancing.",
    category: "strategies",
    relatedTerms: ["asset-allocation", "diversification", "dollar-cost-averaging"],
    examples: "Target allocation: 70% stocks / 30% bonds. After a strong stock rally, it drifts to 78% / 22%. Rebalancing means selling stocks and buying bonds to restore 70/30.",
  },
  {
    slug: "yield-curve",
    term: "Yield Curve",
    definition:
      "The yield curve plots the interest rates of government bonds across different maturities (from 3 months to 30 years). Normally, longer maturities have higher yields (upward-sloping curve). An inverted yield curve — when short-term rates exceed long-term rates — has preceded every US recession since 1955. Investors watch the 2-year vs. 10-year Treasury spread as an early warning signal.",
    category: "market-concepts",
    relatedTerms: ["bear-market", "bull-market", "correction"],
    examples: "When the 2-year Treasury yields 5.0% and the 10-year yields 4.5%, the curve is inverted — a classic recession warning signal.",
  },
  {
    slug: "fomc",
    term: "FOMC (Federal Open Market Committee)",
    definition:
      "The FOMC is the Federal Reserve committee that sets US monetary policy, most notably the federal funds interest rate. The FOMC meets 8 times per year and its decisions are among the most market-moving events on the calendar. Rate hikes cool the economy and tend to pressure stocks; rate cuts stimulate growth and tend to boost stocks. The 'Fed put' refers to the market belief that the Fed will step in during severe downturns.",
    category: "market-concepts",
    relatedTerms: ["yield-curve", "bull-market", "bear-market"],
    examples: "In 2022-2023, the FOMC raised rates from near 0% to over 5% — the fastest tightening cycle in 40 years — causing a bear market in stocks and bonds.",
  },
];
