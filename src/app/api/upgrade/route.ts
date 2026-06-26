import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createSubscription } from '@/lib/razorpay';

const VALID_PLANS = ['starter', 'pro', 'business'];

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/sign-in');
  }

  const url = new URL(request.url);
  const plan = url.searchParams.get('plan') || 'pro';

  if (!VALID_PLANS.includes(plan)) {
    return Response.json(
      { error: { message: 'Invalid plan. Must be one of: starter, pro, business', code: 'VALIDATION_ERROR' } },
      { status: 400 }
    );
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress || '';

  const checkoutUrl = await createSubscription(userId, email, plan);
  redirect(checkoutUrl);
}
