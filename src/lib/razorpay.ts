import Razorpay from 'razorpay';
import crypto from 'crypto';

let _instance: InstanceType<typeof Razorpay> | null = null;

function getRazorpay(): InstanceType<typeof Razorpay> {
  if (!_instance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error('Missing Razorpay environment variables');
    }
    _instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return _instance;
}

// Plan IDs configured via environment variables
const PLAN_IDS: Record<string, string> = {
  starter: process.env.RAZORPAY_PLAN_ID_STARTER || '',
  pro: process.env.RAZORPAY_PLAN_ID_PRO || '',
  business: process.env.RAZORPAY_PLAN_ID_BUSINESS || '',
};

/**
 * Creates a Razorpay subscription for the given plan.
 * Returns the subscription's short_url for hosted checkout page.
 */
export async function createSubscription(userId: string, email: string, plan: string): Promise<string> {
  const razorpay = getRazorpay();
  const planId = PLAN_IDS[plan];

  if (!planId) {
    throw new Error(`Invalid plan: ${plan}`);
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: 12, // 12 billing cycles max
    quantity: 1,
    notes: {
      clerk_user_id: userId,
      email: email,
      plan: plan,
    },
  });

  return subscription.short_url as string;
}

/**
 * Verifies Razorpay webhook signature using HMAC SHA256.
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}
