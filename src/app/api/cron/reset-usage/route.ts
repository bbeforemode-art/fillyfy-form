import { errorResponse, ErrorCodes } from '@/lib/errors';
import { resetFreeUsers } from '@/lib/usage';

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedToken) {
      return errorResponse('Unauthorized', ErrorCodes.UNAUTHORIZED, 401);
    }

    const result = await resetFreeUsers();

    console.log(`Monthly reset completed: ${result.processed} processed, ${result.failed} failed`);

    return Response.json({
      success: true,
      processed: result.processed,
      failed: result.failed,
    }, { status: 200 });
  } catch (error) {
    console.error('Cron reset error:', error);
    return errorResponse('Internal server error', ErrorCodes.INTERNAL_ERROR, 500);
  }
}
