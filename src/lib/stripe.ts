import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }
    _stripe = new Stripe(key);
  }
  return _stripe;
}

// Backward-compatible export via Proxy
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as Record<string, unknown>)[prop as string];
  },
});

/**
 * Maps plan names to their Stripe price environment variable names.
 */
const PLAN_PRICE_ENV_MAP: Record<string, string> = {
  starter: 'STRIPE_PRICE_ID_STARTER',
  pro: 'STRIPE_PRICE_ID_PRO',
  business: 'STRIPE_PRICE_ID_BUSINESS',
};

/**
 * Returns the Stripe price ID for a given plan.
 */
export function getPriceIdForPlan(plan: string): string {
  const envVar = PLAN_PRICE_ENV_MAP[plan];
  if (!envVar) {
    throw new Error(`Invalid plan: ${plan}`);
  }
  const priceId = process.env[envVar];
  if (!priceId) {
    throw new Error(`Missing env var ${envVar} for plan "${plan}"`);
  }
  return priceId;
}

/**
 * Determines the plan name from a Stripe price ID by checking against env vars.
 * Returns the plan name ('starter' | 'pro' | 'business') or null if not found.
 */
export function getPlanFromPriceId(priceId: string): string | null {
  for (const [plan, envVar] of Object.entries(PLAN_PRICE_ENV_MAP)) {
    if (process.env[envVar] === priceId) {
      return plan;
    }
  }
  return null;
}

/**
 * Creates a Stripe Checkout session for the specified plan.
 */
export async function createCheckoutSession(userId: string, email: string, plan: string): Promise<string> {
  const priceId = getPriceIdForPlan(plan);
  const client = getStripe();
  const session = await client.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: { clerk_user_id: userId, plan },
    success_url: 'https://fillyfy.com/auth/callback?upgrade=success',
    cancel_url: 'https://fillyfy.com/auth/callback?upgrade=cancelled',
  });

  return session.url!;
}

/**
 * Verifies and constructs a Stripe webhook event from the raw body and signature.
 */
export function verifyWebhookSignature(body: string, signature: string): Stripe.Event {
  const client = getStripe();
  return client.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
