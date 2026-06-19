import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Newsletter Settings" };

export default function NewsletterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Newsletter</h1>
        <p className="text-muted-foreground">Configure your email briefing preferences.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Choose when and what you receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Daily Digest", desc: "AI summary of your watchlist stocks every morning." },
            { label: "Weekly Summary", desc: "Weekly recap of your stocks' performance." },
            { label: "Price Alerts", desc: "Get notified when stocks hit your target price." },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
