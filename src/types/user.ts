export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  tier: "free" | "pro";
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: string;
  tier: string;
  currentPeriodEnd?: string;
}
