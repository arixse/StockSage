import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Debug endpoint to switch the current user's tier for testing.
 * Only works in development (NODE_ENV !== "production").
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let tier: string;
  try {
    const body = await request.json();
    tier = body.tier;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!["free", "basic", "pro"].includes(tier)) {
    return NextResponse.json({ error: 'tier must be "free", "basic", or "pro"' }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ tier })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, tier, userId: user.id });
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier, email")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    userId: user.id,
    email: profile?.email,
    currentTier: profile?.tier || "free",
    availableTiers: ["free", "basic", "pro"],
    usage: {
      switchTier: "POST /api/debug/switch-tier  { \"tier\": \"basic\" }",
      check: "GET /api/debug/switch-tier",
    },
  });
}
