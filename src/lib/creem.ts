/**
 * Creem payment integration — Merchant of Record for SaaS subscriptions.
 * Creem handles tax, payment processing, and checkout UI.
 */

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.creem.io"
    : "https://test-api.creem.io";

function getHeaders(): Record<string, string> {
  return {
    "x-api-key": process.env.CREEM_API_KEY || "",
    "Content-Type": "application/json",
  };
}

export interface CreateCheckoutParams {
  productId: string;
  customerEmail?: string;
  successUrl?: string;
  metadata?: Record<string, string>;
}

export async function createCheckout(params: CreateCheckoutParams) {
  const res = await fetch(`${BASE_URL}/v1/checkouts`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      product_id: params.productId,
      success_url: params.successUrl,
      customer: params.customerEmail
        ? { email: params.customerEmail }
        : undefined,
      metadata: params.metadata,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Creem checkout failed: ${res.status} ${err}`);
  }

  return res.json() as Promise<{ checkout_url: string; id: string }>;
}

export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const secret = process.env.CREEM_WEBHOOK_SECRET || "";
  const crypto = require("crypto");
  const computed = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return computed === signature;
}

export async function getCustomerPortalUrl(customerId: string) {
  const res = await fetch(`${BASE_URL}/v1/customers/billing`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ customer_id: customerId }),
  });

  if (!res.ok) throw new Error(`Creem portal failed: ${res.status}`);
  const data = await res.json();
  return data.customer_portal_link as string;
}
