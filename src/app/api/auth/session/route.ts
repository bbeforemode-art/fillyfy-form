import { auth, currentUser } from '@clerk/nextjs/server';
import { errorResponse, ErrorCodes } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { getOrCreateUsage, PLAN_LIMITS } from '@/lib/usage';
import type { SessionResponse } from '@/lib/types';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return errorResponse('Authentication required', ErrorCodes.UNAUTHORIZED, 401);
    }

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress || '';

    // Get or create user in database
    let { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (!dbUser) {
      // Create user on first session request
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          clerk_user_id: userId,
          email,
          plan_status: 'free',
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create user:', error);
        return errorResponse('Service temporarily unavailable', ErrorCodes.SERVICE_UNAVAILABLE, 503);
      }
      dbUser = newUser;
    }

    // Get usage for current month
    const usage = await getOrCreateUsage(userId);

    const response: SessionResponse = {
      userId,
      email,
      plan: dbUser.plan_status,
      usageCount: usage.count,
      usageLimit: PLAN_LIMITS[dbUser.plan_status] || PLAN_LIMITS.free,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error('Session endpoint error:', error);
    return errorResponse('Service temporarily unavailable', ErrorCodes.SERVICE_UNAVAILABLE, 503);
  }
}
