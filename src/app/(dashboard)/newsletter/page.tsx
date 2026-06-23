"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Clock, Bell, Calendar } from "lucide-react";

const PREFERENCES = [
  {
    key: "daily_digest",
    label: "Daily Digest",
    icon: Mail,
    desc: "AI summary of your watchlist stocks every morning (weekdays).",
  },
  {
    key: "weekly_summary",
    label: "Weekly Summary",
    icon: Calendar,
    desc: "Weekly recap of your stocks' performance every Monday.",
  },
  {
    key: "price_alerts",
    label: "Price Alerts",
    icon: Bell,
    desc: "Get notified when AI detects significant changes in your tracked stocks.",
  },
] as const;

export default function NewsletterPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  const [deliveryHour, setDeliveryHour] = useState(8);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadPrefs();
  }, []);

  async function loadPrefs() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("email_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setPrefs({
        daily_digest: data.daily_digest,
        weekly_summary: data.weekly_summary,
        price_alerts: data.price_alerts,
      });
      setDeliveryHour(data.delivery_hour_utc);
    }
    setLoading(false);
  }

  async function togglePref(key: string, value: boolean) {
    setSaving(key);
    setPrefs((prev) => ({ ...prev, [key]: value }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("email_preferences")
      .upsert({ user_id: user.id, [key]: value }, { onConflict: "user_id" });

    setSaving(null);
  }

  async function saveDeliveryHour(hour: number) {
    setDeliveryHour(hour);
    setSaving("delivery_hour");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("email_preferences")
      .upsert({ user_id: user.id, delivery_hour_utc: hour }, { onConflict: "user_id" });

    setSaving(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Newsletter</h1>
        <p className="text-muted-foreground">Configure your email briefing preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Delivery Time
          </CardTitle>
          <CardDescription>
            Choose when your daily digest arrives (UTC). Default is 8 AM EST = 13:00 UTC.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {[5, 8, 13, 17, 21].map((hour) => (
              <button
                key={hour}
                onClick={() => saveDeliveryHour(hour)}
                disabled={saving === "delivery_hour"}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                  deliveryHour === hour
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border"
                }`}
              >
                {saving === "delivery_hour" && deliveryHour === hour ? (
                  <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                ) : null}
                {hour}:00 UTC
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Choose what you want to receive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {PREFERENCES.map(({ key, label, desc, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor={key} className="text-sm font-medium cursor-pointer">
                    {label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {saving === key && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                <Button
                  variant={prefs[key] ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePref(key, !prefs[key])}
                >
                  {prefs[key] ? "On" : "Off"}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
