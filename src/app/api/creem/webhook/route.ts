import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/creem";
import { createAdminClient } from "@/lib/supabase/admin";

/** Derive period-end from billing_period string + a start date */
function computePeriodEnd(billingPeriod: string | undefined, fromDate: string): string | null {
  if (!billingPeriod) return null;
  const d = new Date(fromDate);
  if (isNaN(d.getTime())) return null;
  if (billingPeriod === "every-month") d.setMonth(d.getMonth() + 1);
  else if (billingPeriod === "every-year") d.setFullYear(d.getFullYear() + 1);
  else if (billingPeriod === "every-week") d.setDate(d.getDate() + 7);
  else return null;
  return d.toISOString();
}

// ── Creem webhook object shapes (actual API, not flat) ──

interface CreemCustomer { id: string; email?: string; }
interface CreemProduct  { id: string; billing_period?: string; }
interface CreemSubscription {
  id: string;
  status?: string;
  created_at?: string;
  canceled_at?: string | null;
}

/** checkout.completed: object is the checkout session */
interface CheckoutCompletedObject {
  id: string;
  status: string;
  customer: CreemCustomer;
  product: CreemProduct;
  subscription: CreemSubscription;
  metadata?: Record<string, string>;
}

/** subscription.active: object IS the subscription */
interface SubscriptionActiveObject extends CreemSubscription {
  customer: CreemCustomer;
  product: CreemProduct;
}

// ── Helpers ──

/** Look up user_id by Creem customer_id. Returns null if never stored. */
async function getUserIdByCustomer(supabase: ReturnType<typeof createAdminClient>, customerId: string): Promise<string | null> {
  const { data } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return data?.user_id ?? null;
}

/** Upsert subscription row + update profile tier. */
async function upsertSubscription(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  customerId: string,
  subscriptionId: string | null,
  productId: string,
  periodEnd: string | null,
) {
  await supabase.from("subscriptions").upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_price_id: productId,
    status: "active",
    tier: "pro",
    current_period_end: periodEnd,
  });

  await supabase.from("profiles").update({ tier: "pro" }).eq("id", userId);
}

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

  try {
    switch (event.eventType) {
      case "checkout.completed": {
        const obj = event.object as unknown as CheckoutCompletedObject;
        const userId = obj.metadata?.userId;
        const customerId = obj.customer?.id;
        if (!userId || !customerId) break;

        const subscriptionId = obj.subscription?.id ?? null;
        const productId = obj.product?.id ?? "";
        const periodEnd = computePeriodEnd(
          obj.product?.billing_period,
          obj.subscription?.created_at ?? new Date().toISOString(),
        );

        await upsertSubscription(supabase, userId, customerId, subscriptionId, productId, periodEnd);
        console.log(`Creem: user ${userId} upgraded to pro (checkout)`);
        break;
      }

      case "subscription.active": {
        const obj = event.object as unknown as SubscriptionActiveObject;
        const customerId = obj.customer?.id;
        if (!customerId) break;

        // subscription.active has no metadata — look up userId via customer_id
        const userId = await getUserIdByCustomer(supabase, customerId);
        if (!userId) break;

        const subscriptionId = obj.id ?? null;
        const productId = obj.product?.id ?? "";
        const periodEnd = computePeriodEnd(
          obj.product?.billing_period,
          obj.created_at ?? new Date().toISOString(),
        );

        await upsertSubscription(supabase, userId, customerId, subscriptionId, productId, periodEnd);
        console.log(`Creem: user ${userId} subscription activated`);
        break;
      }

      case "subscription.paid": {
        // subscription.paid object IS the subscription, same shape as subscription.active
        const obj = event.object as unknown as SubscriptionActiveObject;
        const customerId = obj.customer?.id;
        if (!customerId) break;

        const userId = await getUserIdByCustomer(supabase, customerId);
        if (!userId) break;

        const periodEnd = computePeriodEnd(
          obj.product?.billing_period,
          obj.created_at ?? new Date().toISOString(),
        );

        await supabase
          .from("subscriptions")
          .update({ status: "active", current_period_end: periodEnd })
          .eq("user_id", userId);

        console.log(`Creem: subscription.paid for user ${userId}, periodEnd=${periodEnd}`);
        break;
      }

      case "subscription.canceled":
      case "subscription.expired": {
        const obj = event.object as unknown as { customer?: { id?: string } };
        const customerId = obj.customer?.id;
        if (!customerId) break;

        const userId = await getUserIdByCustomer(supabase, customerId);
        if (!userId) break;

        await supabase
          .from("subscriptions")
          .update({ status: "canceled", tier: "free" })
          .eq("user_id", userId);

        await supabase.from("profiles").update({ tier: "free" }).eq("id", userId);
        console.log(`Creem: user ${userId} downgraded to free`);
        break;
      }
    }
  } catch (err) {
    console.error("Creem webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
