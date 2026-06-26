import fc from 'fast-check';

// Mock external dependencies before imports
jest.mock('@/lib/stripe', () => ({
  verifyWebhookSignature: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { POST } from '@/app/api/webhooks/stripe/route';
import { verifyWebhookSignature } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

const mockVerifyWebhookSignature = verifyWebhookSignature as jest.Mock;
const mockFrom = supabase.from as jest.Mock;

function makeWebhookRequest(body: string, signature: string | null = 'sig_valid'): Request {
  const headers: Record<string, string> = {};
  if (signature !== null) {
    headers['stripe-signature'] = signature;
  }

  return new Request('http://localhost/api/webhooks/stripe', {
    method: 'POST',
    headers,
    body,
  });
}

/**
 * Property 9: Checkout webhook upgrades plan to pro
 * For any valid checkout.session.completed event, user plan updates to "pro"
 * Validates: Requirements 5.2
 */
describe('Property 9: Checkout webhook upgrades plan to pro', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('checkout.session.completed event updates plan to pro', async () => {
    const userIdArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `user_${s.replace(/[^a-zA-Z0-9]/g, 'x')}`);
    const customerIdArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `cus_${s.replace(/[^a-zA-Z0-9]/g, 'x')}`);
    const subscriptionIdArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `sub_${s.replace(/[^a-zA-Z0-9]/g, 'x')}`);

    await fc.assert(
      fc.asyncProperty(
        userIdArb,
        customerIdArb,
        subscriptionIdArb,
        async (clerkUserId, customerId, subscriptionId) => {
          jest.clearAllMocks();

          const event = {
            type: 'checkout.session.completed',
            data: {
              object: {
                metadata: { clerk_user_id: clerkUserId },
                customer: customerId,
                subscription: subscriptionId,
              },
            },
          };

          mockVerifyWebhookSignature.mockReturnValue(event);

          // Mock supabase update
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

          // Verify update was called with plan_status: 'pro'
          expect(mockUpdate).toHaveBeenCalledWith({
            plan_status: 'pro',
            stripe_customer_id: customerId,
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
 * For any subscription.deleted or payment_failed event, user plan updates to "free"
 * Validates: Requirements 5.3
 */
describe('Property 10: Cancellation webhook downgrades plan to free', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('customer.subscription.deleted downgrades to free', async () => {
    const customerIdArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `cus_${s.replace(/[^a-zA-Z0-9]/g, 'x')}`);

    await fc.assert(
      fc.asyncProperty(customerIdArb, async (customerId) => {
        jest.clearAllMocks();

        const event = {
          type: 'customer.subscription.deleted',
          data: {
            object: {
              customer: customerId,
            },
          },
        };

        mockVerifyWebhookSignature.mockReturnValue(event);

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
        expect(mockEq).toHaveBeenCalledWith('stripe_customer_id', customerId);
      }),
      { numRuns: 100 }
    );
  });

  test('invoice.payment_failed downgrades to free', async () => {
    const customerIdArb = fc.string({ minLength: 5, maxLength: 30 }).map(s => `cus_${s.replace(/[^a-zA-Z0-9]/g, 'x')}`);

    await fc.assert(
      fc.asyncProperty(customerIdArb, async (customerId) => {
        jest.clearAllMocks();

        const event = {
          type: 'invoice.payment_failed',
          data: {
            object: {
              customer: customerId,
            },
          },
        };

        mockVerifyWebhookSignature.mockReturnValue(event);

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
        expect(mockEq).toHaveBeenCalledWith('stripe_customer_id', customerId);
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
    const bodyArb = fc.string({ minLength: 1, maxLength: 500 });

    await fc.assert(
      fc.asyncProperty(invalidSignatureArb, bodyArb, async (signature, body) => {
        jest.clearAllMocks();

        // Mock verifyWebhookSignature to throw (invalid signature)
        mockVerifyWebhookSignature.mockImplementation(() => {
          throw new Error('Invalid signature');
        });

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
