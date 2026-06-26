import { errorResponse, ErrorCodes } from '@/lib/errors';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return errorResponse('Missing x-razorpay-signature header', ErrorCodes.WEBHOOK_INVALID, 400);
    }

    const isValid = verifyWebhookSignature(body, signature);
    if (!isValid) {
      return errorResponse('Invalid webhook signature', ErrorCodes.WEBHOOK_INVALID, 400);
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    switch (eventType) {
      case 'subscription.activated':
      case 'subscription.charged': {
        const subscription = event.payload.subscription.entity;
        const notes = subscription.notes || {};
        const clerkUserId = notes.clerk_user_id;
        const plan = notes.plan || 'starter';

        if (clerkUserId) {
          await supabase
            .from('users')
            .update({
              plan_status: plan,
              stripe_customer_id: subscription.id,
              stripe_subscription_id: subscription.id,
            })
            .eq('clerk_user_id', clerkUserId);
        }
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.halted':
      case 'payment.failed': {
        const subscription = event.payload.subscription?.entity;
        const notes = subscription?.notes || {};
        const clerkUserId = notes.clerk_user_id;

        if (clerkUserId) {
          await supabase
            .from('users')
            .update({ plan_status: 'free' })
            .eq('clerk_user_id', clerkUserId);
        }
        break;
      }
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return errorResponse('Internal server error', ErrorCodes.INTERNAL_ERROR, 500);
  }
}
