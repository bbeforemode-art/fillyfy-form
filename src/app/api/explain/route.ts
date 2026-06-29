import { auth } from '@clerk/nextjs/server';
import { errorResponse, ErrorCodes } from '@/lib/errors';
import { checkRateLimit } from '@/lib/rate-limit';
import { canUseExplanation, incrementUsage } from '@/lib/usage';
import { getExplanation } from '@/lib/claude';
import { supabase } from '@/lib/supabase';
import type { FieldContext } from '@/lib/types';

const MAX_BODY_SIZE = 10 * 1024; // 10KB

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const { userId } = await auth();
    const currentUserId = userId || 'anonymous_test_user';
    // TODO: Re-enable auth check after extension auth flow is implemented
    // if (!userId) {
    //   return errorResponse('Authentication required', ErrorCodes.UNAUTHORIZED, 401);
    // }

    // 2. Content-Type check
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return errorResponse('Content-Type must be application/json', ErrorCodes.VALIDATION_ERROR, 400);
    }

    // 3. Body size check
    const body = await request.text();
    if (body.length > MAX_BODY_SIZE) {
      return errorResponse('Request body too large', ErrorCodes.PAYLOAD_TOO_LARGE, 413);
    }

    // 4. Parse and validate body
    let fieldContext: FieldContext;
    try {
      fieldContext = JSON.parse(body);
    } catch {
      return errorResponse('Invalid JSON body', ErrorCodes.VALIDATION_ERROR, 400);
    }

    if (!fieldContext.fieldLabel || fieldContext.fieldLabel.trim().length === 0) {
      return errorResponse('fieldLabel is required and must not be empty', ErrorCodes.VALIDATION_ERROR, 400);
    }

    // 5. Rate limit check
    const rateCheck = checkRateLimit(currentUserId);
    if (!rateCheck.allowed) {
      return errorResponse('Too many requests. Please slow down.', ErrorCodes.RATE_LIMITED, 429);
    }

    // 6. Usage limit check
    let plan = 'free';
    if (userId) {
      const { data: user } = await supabase
        .from('users')
        .select('plan_status')
        .eq('clerk_user_id', userId)
        .single();
      plan = user?.plan_status || 'free';
    }

    const allowed = await canUseExplanation(currentUserId, plan);
    if (!allowed) {
      return errorResponse(
        'Monthly form limit reached. Upgrade your plan for more forms.',
        ErrorCodes.RATE_LIMITED,
        429
      );
    }

    // 7. Call Claude API
    const explanation = await getExplanation(fieldContext);

    // 8. Increment usage on success
    if (userId) {
      await incrementUsage(userId);
    }

    // 9. Return response
    return Response.json(explanation, { status: 200 });
  } catch (error) {
    console.error('Explain endpoint error:', error);

    if (error instanceof Error && error.name === 'AbortError') {
      return errorResponse('AI service unavailable', ErrorCodes.UPSTREAM_ERROR, 502);
    }

    return errorResponse('AI service unavailable', ErrorCodes.UPSTREAM_ERROR, 502);
  }
}
