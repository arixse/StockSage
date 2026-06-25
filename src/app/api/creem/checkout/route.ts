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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkout = await createCheckout({
      productId,
      customerEmail: user.email,
      successUrl: `${appUrl}/dashboard?success=true`,
      metadata: { userId: user.id },
    });

    return NextResponse.json({ url: checkout.checkout_url });
  } catch (error) {
    console.error("Creem checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}
