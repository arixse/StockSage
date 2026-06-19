import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const relevantEvents = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || webhookSecret === "whsec_...") {
    return NextResponse.json({ received: true }); // Not configured yet
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.userId;

      if (!userId) {
        console.error("No userId in subscription metadata");
        return NextResponse.json({ error: "No userId" }, { status: 400 });
      }

      const supabase = createAdminClient();

      const priceId = subscription.items.data[0].price.id;
      let tier = "free";
      if (priceId === process.env.STRIPE_PRICE_PRO) tier = "pro";
      else if (priceId === process.env.STRIPE_PRICE_BASIC) tier = "basic";

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        status: subscription.status,
        tier,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      });

      // Update profile tier
      await supabase.from("profiles").update({ tier }).eq("id", userId);

      console.log(`Subscription ${event.type} for user ${userId} → tier ${tier}`);
    } catch (err) {
      console.error("Webhook handler error:", err);
      return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
