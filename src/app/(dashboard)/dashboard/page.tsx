import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Star, BarChart3 } from "lucide-react";
import Link from "next/link";

const WATCHLIST_ITEMS = [
  { ticker: "AAPL", name: "Apple Inc.", price: "224.50", change: "+1.2", score: 78 },
  { ticker: "NVDA", name: "NVIDIA Corp.", price: "135.80", change: "+3.2", score: 85 },
  { ticker: "MSFT", name: "Microsoft Corp.", price: "458.30", change: "+0.8", score: 72 },
  { ticker: "TSLA", name: "Tesla Inc.", price: "248.50", change: "-1.5", score: 55 },
  { ticker: "META", name: "Meta Platforms", price: "512.40", change: "+0.3", score: 68 },
];

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your stock market overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Watchlist</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Stocks</div>
            <p className="text-xs text-muted-foreground">Avg Score: 71.6</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Gainers</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">3 of 5</div>
            <p className="text-xs text-muted-foreground">NVDA leading +3.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Status</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Open</div>
            <p className="text-xs text-muted-foreground">NYSE / NASDAQ</p>
          </CardContent>
        </Card>
      </div>

      {/* Watchlist Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Ticker</th>
                  <th className="pb-3 font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Price</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Change</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {WATCHLIST_ITEMS.map((stock) => (
                  <tr key={stock.ticker} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3">
                      <Link href={`/stock/${stock.ticker}`} className="font-medium hover:text-primary">
                        {stock.ticker}
                      </Link>
                    </td>
                    <td className="py-3 text-muted-foreground">{stock.name}</td>
                    <td className="py-3 text-right font-mono">{stock.price}</td>
                    <td className={`py-3 text-right font-mono ${stock.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                      {stock.change}%
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant={stock.score >= 70 ? "default" : stock.score >= 50 ? "secondary" : "destructive"}>
                        {stock.score}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
