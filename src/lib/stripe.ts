import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-16.acacia" as any,
});

export const PRICE_BASIC = process.env.STRIPE_PRICE_BASIC!;
export const PRICE_PRO = process.env.STRIPE_PRICE_PRO!;
