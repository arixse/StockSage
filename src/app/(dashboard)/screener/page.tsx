import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search } from "lucide-react";

export const metadata = { title: "Stock Screener" };

export default function ScreenerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stock Screener</h1>
        <p className="text-muted-foreground">Filter stocks by criteria to find your next opportunity.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>The advanced stock screener is under development.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              Filter by sector, market cap, technical indicators, AI scores, and more.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
