import fc from 'fast-check';

// Mock Supabase before importing usage module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { canUseExplanation, incrementUsage, getOrCreateUsage, resetFreeUsers, PLAN_LIMITS } from '@/lib/usage';
import { supabase } from '@/lib/supabase';

const mockFrom = supabase.from as jest.Mock;

describe('Property 4: Usage count increments by exactly one on success', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 4: Usage count increments by exactly one on success
   * For any starting count N (0-1000), after incrementUsage the count becomes N+1
   * Validates: Requirements 1.5
   */
  test('for any starting count N, incrementUsage updates count to N+1', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.nat({ max: 1000 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        async (startCount, userId) => {
          jest.clearAllMocks();

          const mockRecord = {
            id: 'test-id',
            clerk_user_id: userId,
            count: startCount,
            period_month: new Date().getMonth() + 1,
            period_year: new Date().getFullYear(),
            updated_at: new Date().toISOString(),
          };

          // Mock getOrCreateUsage: supabase.from('usage').select(...).eq(...).eq(...).eq(...).single()
          const mockSingle = jest.fn().mockResolvedValue({ data: mockRecord, error: null });
          const mockEq3 = jest.fn().mockReturnValue({ single: mockSingle });
          const mockEq2 = jest.fn().mockReturnValue({ eq: mockEq3 });
          const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
          const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

          // Mock update: supabase.from('usage').update(...).eq(...)
          const mockUpdateEq = jest.fn().mockResolvedValue({ error: null });
          const mockUpdate = jest.fn().mockReturnValue({ eq: mockUpdateEq });

          mockFrom.mockImplementation((table: string) => {
            if (table === 'usage') {
              return { select: mockSelect, update: mockUpdate };
            }
            return {};
          });

          await incrementUsage(userId);

          // Verify update was called with count + 1
          expect(mockUpdate).toHaveBeenCalledWith({ count: startCount + 1 });
          expect(mockUpdateEq).toHaveBeenCalledWith('id', mockRecord.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 5: Plan limit enforcement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 5: Plan limit enforcement
   * For any count >= plan limit, canUseExplanation returns false
   * For any count < plan limit, canUseExplanation returns true
   * Validates: Requirements 2.1
   */
  test('users with count >= their plan limit are blocked', async () => {
    const planArb = fc.constantFrom('free', 'starter', 'pro', 'business');

    await fc.assert(
      fc.asyncProperty(
        planArb,
        fc.integer({ min: 0, max: 500 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        async (plan, extra, userId) => {
          jest.clearAllMocks();

          const limit = PLAN_LIMITS[plan];
          const count = limit + extra; // at or above limit

          const mockRecord = {
            id: 'test-id',
            clerk_user_id: userId,
            count,
            period_month: new Date().getMonth() + 1,
            period_year: new Date().getFullYear(),
            updated_at: new Date().toISOString(),
          };

          const mockSingle = jest.fn().mockResolvedValue({ data: mockRecord, error: null });
          const mockEq3 = jest.fn().mockReturnValue({ single: mockSingle });
          const mockEq2 = jest.fn().mockReturnValue({ eq: mockEq3 });
          const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
          const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

          mockFrom.mockImplementation((table: string) => {
            if (table === 'usage') {
              return { select: mockSelect };
            }
            return {};
          });

          const result = await canUseExplanation(userId, plan);
          expect(result).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('users with count < their plan limit are allowed', async () => {
    const planArb = fc.constantFrom('free', 'starter', 'pro', 'business');

    await fc.assert(
      fc.asyncProperty(
        planArb,
        fc.string({ minLength: 1, maxLength: 50 }),
        async (plan, userId) => {
          jest.clearAllMocks();

          const limit = PLAN_LIMITS[plan];
          // Generate a count below the limit
          const count = limit > 0 ? Math.floor(Math.random() * limit) : 0;

          const mockRecord = {
            id: 'test-id',
            clerk_user_id: userId,
            count,
            period_month: new Date().getMonth() + 1,
            period_year: new Date().getFullYear(),
            updated_at: new Date().toISOString(),
          };

          const mockSingle = jest.fn().mockResolvedValue({ data: mockRecord, error: null });
          const mockEq3 = jest.fn().mockReturnValue({ single: mockSingle });
          const mockEq2 = jest.fn().mockReturnValue({ eq: mockEq3 });
          const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
          const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

          mockFrom.mockImplementation((table: string) => {
            if (table === 'usage') {
              return { select: mockSelect };
            }
            return {};
          });

          const result = await canUseExplanation(userId, plan);
          expect(result).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 6: All plans have finite limits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 6: All plans have finite limits that increase with tier
   * Validates: Requirements 2.2
   */
  test('plan limits are monotonically increasing: free < starter < pro < business', () => {
    expect(PLAN_LIMITS.free).toBeLessThan(PLAN_LIMITS.starter);
    expect(PLAN_LIMITS.starter).toBeLessThan(PLAN_LIMITS.pro);
    expect(PLAN_LIMITS.pro).toBeLessThan(PLAN_LIMITS.business);
  });

  test('all plan limits are positive integers', () => {
    for (const [plan, limit] of Object.entries(PLAN_LIMITS)) {
      expect(limit).toBeGreaterThan(0);
      expect(Number.isInteger(limit)).toBe(true);
    }
  });

  test('unknown plan returns false from canUseExplanation', async () => {
    const mockRecord = {
      id: 'test-id',
      clerk_user_id: 'user1',
      count: 0,
      period_month: new Date().getMonth() + 1,
      period_year: new Date().getFullYear(),
      updated_at: new Date().toISOString(),
    };

    const mockSingle = jest.fn().mockResolvedValue({ data: mockRecord, error: null });
    const mockEq3 = jest.fn().mockReturnValue({ single: mockSingle });
    const mockEq2 = jest.fn().mockReturnValue({ eq: mockEq3 });
    const mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
    const mockSelect = jest.fn().mockReturnValue({ eq: mockEq1 });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'usage') {
        return { select: mockSelect };
      }
      return {};
    });

    const result = await canUseExplanation('user1', 'unknown_plan');
    expect(result).toBe(false);
  });
});

describe('Property 7: Monthly reset affects only free-tier users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 7: Monthly reset affects only free-tier users
   * Mock supabase to return a set of free users and verify reset is called with only their IDs
   * Validates: Requirements 3.1, 3.2
   */
  test('resetFreeUsers only resets usage for free-tier user IDs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 1, maxLength: 10 }),
        async (freeUserIds) => {
          jest.clearAllMocks();

          const freeUsers = freeUserIds.map(id => ({ clerk_user_id: id }));

          // Mock: supabase.from('users').select('clerk_user_id').eq('plan_status', 'free')
          const mockUsersEq = jest.fn().mockResolvedValue({ data: freeUsers, error: null });
          const mockUsersSelect = jest.fn().mockReturnValue({ eq: mockUsersEq });

          // Mock: supabase.from('usage').update({ count: 0 }).in(...).eq(...).eq(...)
          const mockUpdateEq2 = jest.fn().mockResolvedValue({ error: null, count: freeUserIds.length });
          const mockUpdateEq1 = jest.fn().mockReturnValue({ eq: mockUpdateEq2 });
          const mockUpdateIn = jest.fn().mockReturnValue({ eq: mockUpdateEq1 });
          const mockUpdate = jest.fn().mockReturnValue({ in: mockUpdateIn });

          mockFrom.mockImplementation((table: string) => {
            if (table === 'users') {
              return { select: mockUsersSelect };
            }
            if (table === 'usage') {
              return { update: mockUpdate };
            }
            return {};
          });

          const result = await resetFreeUsers();

          // Verify we queried only free users
          expect(mockUsersSelect).toHaveBeenCalledWith('clerk_user_id');
          expect(mockUsersEq).toHaveBeenCalledWith('plan_status', 'free');

          // Verify update was called with count: 0
          expect(mockUpdate).toHaveBeenCalledWith({ count: 0 });

          // Verify .in() was called with the free user IDs
          expect(mockUpdateIn).toHaveBeenCalledWith('clerk_user_id', freeUserIds);

          // Verify result reports processed count
          expect(result.processed).toBe(freeUserIds.length);
          expect(result.failed).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
