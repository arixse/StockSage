import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/creem";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("creem-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const rawBody = await request.text();

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { eventType: string; object: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.eventType) {
    case "checkout.completed":
    case "subscription.active": {
      const obj = event.object as {
        customer_id: string;
        subscription_id?: string;
        product_id: string;
        current_period_end?: string;
        metadata?: { userId?: string };
      };
      const userId = obj.metadata?.userId;
      if (!userId) break;

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: obj.customer_id,
        stripe_subscription_id: obj.subscription_id || null,
        stripe_price_id: obj.product_id,
        status: "active",
        tier: "pro",
        current_period_end: obj.current_period_end || null,
      });

      await supabase.from("profiles").update({ tier: "pro" }).eq("id", userId);
      console.log(`Creem: user ${userId} upgraded to pro`);
      break;
    }

    case "subscription.canceled":
    case "subscription.expired": {
      const obj = event.object as {
        customer_id: string;
        subscription_id?: string;
        metadata?: { userId?: string };
      };
      // Find user by customer_id
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", obj.customer_id)
        .single();

      const userId = sub?.user_id;
      if (!userId) break;

      await supabase
        .from("subscriptions")
        .update({ status: "canceled", tier: "free" })
        .eq("user_id", userId);

      await supabase.from("profiles").update({ tier: "free" }).eq("id", userId);
      console.log(`Creem: user ${userId} downgraded to free`);
      break;
    }

    case "subscription.paid": {
      const obj = event.object as {
        customer_id: string;
        subscription_id?: string;
      };
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", obj.customer_id)
        .single();

      if (sub?.user_id) {
        await supabase
          .from("subscriptions")
          .update({ status: "active" })
          .eq("user_id", sub.user_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
