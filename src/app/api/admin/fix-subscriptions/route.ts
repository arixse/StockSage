/**
 * One-off: backfill current_period_end for existing active Pro subscriptions.
 *
 * Old webhook code wrote null for current_period_end (Creem doesn't send it).
 * This approximates it as created_at + 30 days for monthly subscriptions.
 *
 * Usage: GET /api/admin/fix-subscriptions?secret=<CRON_SECRET>
 *
 * Delete this file after running once.
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Find active Pro subscriptions with missing current_period_end
  const { data: subs, error } = await admin
    .from("subscriptions")
    .select("id, user_id, created_at, current_period_end")
    .eq("status", "active")
    .eq("tier", "pro")
    .is("current_period_end", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!subs || subs.length === 0) {
    return NextResponse.json({ message: "No subscriptions need fixing", fixed: 0 });
  }

  const results: { userId: string; periodEnd: string }[] = [];

  for (const sub of subs) {
    // Default: created_at + 30 days (monthly billing approximation)
    const base = sub.created_at ? new Date(sub.created_at) : new Date();
    const periodEnd = new Date(base);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const { error: updateErr } = await admin
      .from("subscriptions")
      .update({ current_period_end: periodEnd.toISOString() })
      .eq("id", sub.id);

    if (updateErr) {
      console.error(`Failed to update sub ${sub.id}:`, updateErr);
    } else {
      results.push({ userId: sub.user_id, periodEnd: periodEnd.toISOString() });
    }
  }

  return NextResponse.json({
    message: `Fixed ${results.length} subscription(s)`,
    fixed: results.length,
    details: results,
  });
}
