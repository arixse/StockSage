import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/creem";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = process.env.CREEM_PRODUCT_ID;
    if (!productId) {
      return NextResponse.json({ error: "Creem not configured" }, { status: 500 });
    }

    // Use env var, fallback to Vercel auto-injected preview URL, then localhost
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined) ||
      "http://localhost:3000";

    const checkout = await createCheckout({
      productId,
      customerEmail: user.email,
      successUrl: `${appUrl}/dashboard?success=true`,
      metadata: { userId: user.id },
    });

    return NextResponse.json({ url: checkout.checkout_url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Creem checkout error:", msg);
    return NextResponse.json(
      {
        error: "Checkout failed",
        detail: msg,
        hint: process.env.CREEM_API_KEY
          ? "API key is set. Check CREEM_PRODUCT_ID."
          : "CREEM_API_KEY is not set.",
      },
      { status: 500 }
    );
  }
}
