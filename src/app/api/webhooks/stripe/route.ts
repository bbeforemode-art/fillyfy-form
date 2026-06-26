import { errorResponse, ErrorCodes } from '@/lib/errors';
import { verifyWebhookSignature, getPlanFromPriceId } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return errorResponse('Missing stripe-signature header', ErrorCodes.WEBHOOK_INVALID, 400);
    }

    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature);
    } catch {
      return errorResponse('Invalid webhook signature', ErrorCodes.WEBHOOK_INVALID, 400);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerk_user_id;

        // Determine plan from metadata or from the price ID
        let plan = session.metadata?.plan;
        if (!plan && session.subscription) {
          // Fallback: try to determine plan from line items if available
          plan = 'pro'; // default fallback
        }

        if (clerkUserId && plan) {
          await supabase
            .from('users')
            .update({
              plan_status: plan,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
            })
            .eq('clerk_user_id', clerkUserId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer;

        // Determine plan from the subscription's price ID
        const items = subscription.items?.data;
        if (items && items.length > 0) {
          const priceId = items[0].price?.id;
          if (priceId) {
            const plan = getPlanFromPriceId(priceId);
            if (plan) {
              await supabase
                .from('users')
                .update({ plan_status: plan })
                .eq('stripe_customer_id', customerId);
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer;

        await supabase
          .from('users')
          .update({ plan_status: 'free' })
          .eq('stripe_customer_id', customerId);
        break;
      }
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return errorResponse('Internal server error', ErrorCodes.INTERNAL_ERROR, 500);
  }
}
