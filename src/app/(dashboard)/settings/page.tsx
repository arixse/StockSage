import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

async function getSubscription(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", userId)
    .single();

  const tier = profile?.tier || "free";

  let expiresAt: string | null = null;
  if (tier === "pro") {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("current_period_end")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    expiresAt = sub?.current_period_end || null;
  }

  return { tier, expiresAt };
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { tier, expiresAt } = await getSubscription(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {tier === "pro" && <Crown className="h-5 w-5 text-amber-500" />}
            Plan
          </CardTitle>
          <CardDescription>
            {tier === "pro"
              ? "You are on the Pro plan."
              : "You are on the Free plan."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tier === "pro" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  <Crown className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
                {expiresAt && (
                  <span className="text-sm text-muted-foreground">
                    Renews {new Date(expiresAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <ul className="space-y-1.5">
                {[
                  "Unlimited AI stock analysis",
                  "Daily portfolio briefs",
                  "Real-time price alerts",
                  "Priority email support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground">
                  Get unlimited watchlist stocks and all premium features.
                </p>
              </div>
              <a href="/pricing">
                <Badge className="cursor-pointer bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20">
                  View Plans
                </Badge>
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
