import fc from 'fast-check';

// Mock external dependencies before imports
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('@/lib/usage', () => ({
  getOrCreateUsage: jest.fn(),
  PLAN_LIMITS: { free: 1, starter: 15, pro: 50, business: 300 },
}));

import { GET } from '@/app/api/auth/session/route';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getOrCreateUsage, PLAN_LIMITS } from '@/lib/usage';

const mockAuth = auth as unknown as jest.Mock;
const mockCurrentUser = currentUser as unknown as jest.Mock;
const mockFrom = supabase.from as jest.Mock;
const mockGetOrCreateUsage = getOrCreateUsage as jest.Mock;

/**
 * Property 14: Session endpoint returns correct user data
 * For any authenticated user, the response contains correct userId, email, plan, usageCount matching DB
 * Validates: Requirements 10.2, 10.3
 */
describe('Property 14: Session endpoint returns correct user data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('for any authenticated user, session returns matching DB data', async () => {
    const userIdArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `user_${s.replace(/[^a-zA-Z0-9]/g, 'x')}`);
    const emailArb = fc.emailAddress();
    const planArb = fc.constantFrom('free' as const, 'starter' as const, 'pro' as const, 'business' as const);
    const usageCountArb = fc.nat({ max: 500 });

    await fc.assert(
      fc.asyncProperty(
        userIdArb,
        emailArb,
        planArb,
        usageCountArb,
        async (userId, email, plan, usageCount) => {
          jest.clearAllMocks();

          // Mock auth to return the generated userId
          mockAuth.mockResolvedValue({ userId });
          mockCurrentUser.mockResolvedValue({
            emailAddresses: [{ emailAddress: email }],
          });

          // Mock Supabase user query
          const mockSingle = jest.fn().mockResolvedValue({
            data: {
              clerk_user_id: userId,
              email,
              plan_status: plan,
              stripe_customer_id: null,
              stripe_subscription_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            error: null,
          });
          const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
          const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

          mockFrom.mockImplementation((table: string) => {
            if (table === 'users') {
              return { select: mockSelect };
            }
            return {};
          });

          // Mock usage
          mockGetOrCreateUsage.mockResolvedValue({
            id: 'usage-id',
            clerk_user_id: userId,
            count: usageCount,
            period_month: new Date().getMonth() + 1,
            period_year: new Date().getFullYear(),
            updated_at: new Date().toISOString(),
          });

          const response = await GET();
          const data = await response.json();

          expect(response.status).toBe(200);
          expect(data.userId).toBe(userId);
          expect(data.email).toBe(email);
          expect(data.plan).toBe(plan);
          expect(data.usageCount).toBe(usageCount);

          // usageLimit should match the plan limit
          const expectedLimit = (PLAN_LIMITS as Record<string, number>)[plan] || 1;
          expect(data.usageLimit).toBe(expectedLimit);
        }
      ),
      { numRuns: 100 }
    );
  });
});
