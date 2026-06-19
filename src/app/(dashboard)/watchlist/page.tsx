import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Watchlist" };

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Watchlist</h1>
          <p className="text-muted-foreground">Manage your tracked stocks.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Watchlist</CardTitle>
          <CardDescription>Click a stock to view detailed analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-2">Your watchlist is empty.</p>
            <p className="text-sm text-muted-foreground mb-4">
              Search for stocks and add them to your watchlist to track them here.
            </p>
            <Button variant="outline" render={<Link href="/stock/AAPL" />}>
              Browse Stocks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
