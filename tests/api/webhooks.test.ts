import fc from 'fast-check';

// Mock external dependencies before imports
jest.mock('@/lib/razorpay', () => ({
  verifyWebhookSignature: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { POST } from '@/app/api/webhooks/razorpay/route';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';

const mockVerifyWebhookSignature = verifyWebhookSignature as jest.Mock;
const mockFrom = supabase.from as jest.Mock;

function makeWebhookRequest(body: string, signature: string | null = 'sig_valid'): Request {
  const headers: Record<string, string> = {};
  if (signature !== null) {
    headers['x-razorpay-signature'] = signature;
  }

  return new Request('http://localhost/api/webhooks/razorpay', {
    method: 'POST',
    headers,
    body,
  });
}

/**
 * Property 9: Subscription activated webhook upgrades plan
 * For any valid subscription.activated event, user plan updates accordingly
 * Validates: Requirements 5.2
 */
describe('Property 9: Subscription activated webhook upgrades plan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('subscription.activated event updates plan correctly', async () => {
    const userIdArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `user_${s.replace(/[^a-zA-Z0-9]/g, 'x')}`);
    const subscriptionIdArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `sub_${s.replace(/[^a-zA-Z0-9]/g, 'x')}`);
    const planArb = fc.constantFrom('starter', 'pro', 'business');

    await fc.assert(
      fc.asyncProperty(
        userIdArb,
        subscriptionIdArb,
        planArb,
        async (clerkUserId, subscriptionId, plan) => {
          jest.clearAllMocks();

          const event = {
            event: 'subscription.activated',
            payload: {
              subscription: {
                entity: {
                  id: subscriptionId,
                  notes: {
                    clerk_user_id: clerkUserId,
                    email: 'test@example.com',
                    plan: plan,
                  },
                },
              },
            },
          };

          mockVerifyWebhookSignature.mockReturnValue(true);

          const mockEq = jest.fn().mockResolvedValue({ error: null });
          const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });

          mockFrom.mockImplementation((table: string) => {
            if (table === 'users') {
              return { update: mockUpdate };
            }
            return {};
          });

          const request = makeWebhookRequest(JSON.stringify(event));
          const response = await POST(request);
          const data = await response.json();

          expect(response.status).toBe(200);
          expect(data.received).toBe(true);

          expect(mockUpdate).toHaveBeenCalledWith({
            plan_status: plan,
            stripe_customer_id: subscriptionId,
            stripe_subscription_id: subscriptionId,
          });
          expect(mockEq).toHaveBeenCalledWith('clerk_user_id', clerkUserId);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 10: Cancellation webhook downgrades plan to free
 * For any subscription.cancelled or payment.failed event, user plan updates to "free"
 * Validates: Requirements 5.3
 */
describe('Property 10: Cancellation webhook downgrades plan to free', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('subscription.cancelled downgrades to free', async () => {
    const userIdArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `user_${s.replace(/[^a-zA-Z0-9]/g, 'x')}`);

    await fc.assert(
      fc.asyncProperty(userIdArb, async (clerkUserId) => {
        jest.clearAllMocks();

        const event = {
          event: 'subscription.cancelled',
          payload: {
            subscription: {
              entity: {
                id: 'sub_cancelled',
                notes: {
                  clerk_user_id: clerkUserId,
                  plan: 'pro',
                },
              },
            },
          },
        };

        mockVerifyWebhookSignature.mockReturnValue(true);

        const mockEq = jest.fn().mockResolvedValue({ error: null });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });

        mockFrom.mockImplementation((table: string) => {
          if (table === 'users') {
            return { update: mockUpdate };
          }
          return {};
        });

        const request = makeWebhookRequest(JSON.stringify(event));
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.received).toBe(true);
        expect(mockUpdate).toHaveBeenCalledWith({ plan_status: 'free' });
        expect(mockEq).toHaveBeenCalledWith('clerk_user_id', clerkUserId);
      }),
      { numRuns: 100 }
    );
  });

  test('payment.failed downgrades to free', async () => {
    const userIdArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `user_${s.replace(/[^a-zA-Z0-9]/g, 'x')}`);

    await fc.assert(
      fc.asyncProperty(userIdArb, async (clerkUserId) => {
        jest.clearAllMocks();

        const event = {
          event: 'payment.failed',
          payload: {
            subscription: {
              entity: {
                id: 'sub_failed',
                notes: {
                  clerk_user_id: clerkUserId,
                  plan: 'pro',
                },
              },
            },
          },
        };

        mockVerifyWebhookSignature.mockReturnValue(true);

        const mockEq = jest.fn().mockResolvedValue({ error: null });
        const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });

        mockFrom.mockImplementation((table: string) => {
          if (table === 'users') {
            return { update: mockUpdate };
          }
          return {};
        });

        const request = makeWebhookRequest(JSON.stringify(event));
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.received).toBe(true);
        expect(mockUpdate).toHaveBeenCalledWith({ plan_status: 'free' });
        expect(mockEq).toHaveBeenCalledWith('clerk_user_id', clerkUserId);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 11: Invalid webhook signatures produce no side effects
 * For any request with an invalid signature, returns 400 and makes no DB modifications
 * Validates: Requirements 5.5
 */
describe('Property 11: Invalid webhook signatures produce no side effects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('invalid signatures return 400 and do not modify DB', async () => {
    const invalidSignatureArb = fc.string({ minLength: 1, maxLength: 100 });
    const bodyArb = fc.json();

    await fc.assert(
      fc.asyncProperty(invalidSignatureArb, bodyArb, async (signature, body) => {
        jest.clearAllMocks();

        mockVerifyWebhookSignature.mockReturnValue(false);

        const request = makeWebhookRequest(body, signature);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error.code).toBe('WEBHOOK_INVALID');

        // Supabase should never be called for invalid signatures
        expect(mockFrom).not.toHaveBeenCalled();
      }),
      { numRuns: 100 }
    );
  });

  test('missing signature header returns 400', async () => {
    const bodyArb = fc.string({ minLength: 1, maxLength: 500 });

    await fc.assert(
      fc.asyncProperty(bodyArb, async (body) => {
        jest.clearAllMocks();

        const request = makeWebhookRequest(body, null);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error.code).toBe('WEBHOOK_INVALID');

        // No DB modifications should happen
        expect(mockFrom).not.toHaveBeenCalled();
        expect(mockVerifyWebhookSignature).not.toHaveBeenCalled();
      }),
      { numRuns: 50 }
    );
  });
});
