import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { KLineChart } from "@/components/charts/KLineChart";
import { MACDChart, RSIChart, VolumeChart } from "@/components/charts/TechnicalCharts";
import { Star, TrendingUp, TrendingDown, BarChart3, Newspaper, Sparkles, Activity } from "lucide-react";
import { latestTechnicals, type OHLCVBar } from "@/lib/technicals";
import Link from "next/link";
import { fetchStockQuote, fetchStockChart, fetchCompanyOverview } from "@/lib/stock-api";

interface Props {
  params: Promise<{ ticker: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { ticker } = await params;
  return {
    title: `${ticker.toUpperCase()} Stock Analysis`,
    description: `AI-powered analysis for ${ticker.toUpperCase()} - technical charts, fundamentals, news summary and AI score.`,
  };
}

export default async function StockPage({ params }: Props) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  let quote = null;
  let company = null;
  let chartData = null;
  let error = null;

  try {
    [quote, company, chartData] = await Promise.all([
      fetchStockQuote(upperTicker),
      fetchCompanyOverview(upperTicker),
      fetchStockChart(upperTicker),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load stock data";
  }

  if (error && !quote && !company) {
    return (
      <div className="flex flex-col min-h-full">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load {upperTicker}</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" render={<Link href="/" />}>
              Go Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const changePositive = quote ? quote.change >= 0 : false;

  // Data in two formats: lightweight-charts format and technical analysis format
  const ohlcvData = (chartData || [])
    .map((d: any) => ({
      time: d.date as any,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
    }))
    .reverse();

  // OHLCV format for technical indicators (chronological, oldest first)
  const ohlcvForTech: OHLCVBar[] = (chartData || []).map((d: any) => ({
    date: d.date,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
    volume: d.volume,
  }));

  const techValues = ohlcvForTech.length > 0 ? latestTechnicals(ohlcvForTech) : null;

  return (
    <div className="flex flex-col min-h-full">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{upperTicker}</h1>
                {quote && (
                  <Badge variant={changePositive ? "default" : "destructive"} className="text-sm">
                    {changePositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {quote.changePercent.toFixed(2)}%
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-lg mt-1">
                {company?.companyName || upperTicker}
                {company?.exchange && ` • ${company.exchange}`}
                {company?.sector && ` • ${company.sector}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {quote && (
                <span className="text-3xl font-bold font-mono">${quote.price.toFixed(2)}</span>
              )}
              <Button variant="outline" size="icon">
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="charts" className="w-full">
            <TabsList>
              <TabsTrigger value="charts">
                <BarChart3 className="h-4 w-4 mr-2" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="news">
                <Newspaper className="h-4 w-4 mr-2" />
                News & AI
              </TabsTrigger>
              <TabsTrigger value="fundamentals">
                <Sparkles className="h-4 w-4 mr-2" />
                Fundamentals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>K-Line Chart</CardTitle>
                  <CardDescription>{upperTicker} daily price chart with indicators.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px]">
                    <KLineChart data={ohlcvData} ticker={upperTicker} />
                  </div>
                </CardContent>
              </Card>

              {/* MACD Chart */}
              {ohlcvForTech.length > 20 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">MACD (12, 26, 9)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <MACDChart data={ohlcvForTech} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* RSI Chart */}
              {ohlcvForTech.length > 20 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">RSI (14)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <RSIChart data={ohlcvForTech} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Volume Chart */}
              {ohlcvForTech.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[150px]">
                      <VolumeChart data={ohlcvForTech} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Technical Indicator Values */}
              {techValues && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      <Activity className="h-4 w-4 inline mr-2" />
                      Technical Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "MA5", value: techValues.ma5?.toFixed(2) },
                        { label: "MA10", value: techValues.ma10?.toFixed(2) },
                        { label: "MA20", value: techValues.ma20?.toFixed(2) },
                        { label: "MA60", value: techValues.ma60?.toFixed(2) },
                        { label: "MA200", value: techValues.ma200?.toFixed(2) },
                        { label: "MACD", value: techValues.macd?.toFixed(4) },
                        { label: "Signal", value: techValues.macdSignal?.toFixed(4) },
                        { label: "RSI (14)", value: techValues.rsi14?.toFixed(1), extra: techValues.rsi14 != null ? (techValues.rsi14 > 70 ? "Overbought" : techValues.rsi14 < 30 ? "Oversold" : "Neutral") : undefined },
                        { label: "BB Upper", value: techValues.bollingerUpper?.toFixed(2) },
                        { label: "BB Mid", value: techValues.bollingerMiddle?.toFixed(2) },
                        { label: "BB Lower", value: techValues.bollingerLower?.toFixed(2) },
                      ].map((item) => (
                        <Card key={item.label}>
                          <CardContent className="p-3">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="text-base font-bold font-mono">{item.value || "N/A"}</p>
                            {item.extra && <p className="text-xs text-muted-foreground mt-0.5">{item.extra}</p>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              {quote && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Open", value: `$${quote.open.toFixed(2)}` },
                    { label: "High", value: `$${quote.high.toFixed(2)}` },
                    { label: "Low", value: `$${quote.low.toFixed(2)}` },
                    { label: "Prev Close", value: `$${quote.prevClose.toFixed(2)}` },
                    { label: "Volume", value: quote.volume.toLocaleString() },
                    { label: "Change", value: `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)}`, color: changePositive ? "text-green-500" : "text-red-500" },
                  ].map((stat) => (
                    <Card key={stat.label}>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className={`text-lg font-bold font-mono ${(stat as any).color || ""}`}>{stat.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="news" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI News Summary</CardTitle>
                  <CardDescription>AI-generated summaries of the latest news for {upperTicker}.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Newspaper className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground mb-2">AI News Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Configure API keys to enable AI-powered news summarization.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fundamentals" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fundamental Data</CardTitle>
                  <CardDescription>Key financial metrics for {upperTicker}.</CardDescription>
                </CardHeader>
                <CardContent>
                  {company ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Market Cap", value: company.marketCap ? `$${(company.marketCap / 1e9).toFixed(2)}B` : "N/A" },
                        { label: "P/E Ratio", value: company.peRatio?.toFixed(2) || "N/A" },
                        { label: "Forward P/E", value: company.forwardPE?.toFixed(2) || "N/A" },
                        { label: "EPS (TTM)", value: company.epsTTM?.toFixed(2) || "N/A" },
                        { label: "P/B Ratio", value: company.pbRatio?.toFixed(2) || "N/A" },
                        { label: "Dividend Yield", value: company.dividendYield ? `${(company.dividendYield * 100).toFixed(2)}%` : "N/A" },
                        { label: "Beta", value: company.beta?.toFixed(2) || "N/A" },
                        { label: "ROE", value: company.roe ? `${(company.roe * 100).toFixed(2)}%` : "N/A" },
                        { label: "Gross Margin", value: company.grossMargin ? `${(company.grossMargin * 100).toFixed(2)}%` : "N/A" },
                        { label: "Net Margin", value: company.netMargin ? `${(company.netMargin * 100).toFixed(2)}%` : "N/A" },
                      ].map((item) => (
                        <Card key={item.label}>
                          <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="text-lg font-bold font-mono">{item.value}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No fundamental data available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
