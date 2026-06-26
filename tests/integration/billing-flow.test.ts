/**
 * Integration tests for the billing flow.
 * Tests webhook processing and Stripe integration.
 * Mocks: Stripe verifyWebhookSignature, Supabase
 */

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

function makeWebhookRequest(body: string, signature: string | null = 'whsec_valid_signature'): Request {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (signature !== null) {
    headers['stripe-signature'] = signature;
  }

  return new Request('http://localhost/api/webhooks/stripe', {
    method: 'POST',
    headers,
    body,
  });
}

describe('Integration: Billing Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Valid checkout.session.completed webhook → plan updated to "pro"', () => {
    test('upgrades user plan to pro and stores Stripe IDs', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: { clerk_user_id: 'user_abc123' },
            customer: 'cus_stripe_customer_1',
            subscription: 'sub_stripe_subscription_1',
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

      // Verify DB update was called with correct fields
      expect(mockFrom).toHaveBeenCalledWith('users');
      expect(mockUpdate).toHaveBeenCalledWith({
        plan_status: 'pro',
        stripe_customer_id: 'cus_stripe_customer_1',
        stripe_subscription_id: 'sub_stripe_subscription_1',
      });
      expect(mockEq).toHaveBeenCalledWith('clerk_user_id', 'user_abc123');
    });

    test('handles checkout event without clerk_user_id gracefully', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: {},
            customer: 'cus_no_clerk',
            subscription: 'sub_no_clerk',
          },
        },
      };

      mockVerifyWebhookSignature.mockReturnValue(event);

      const request = makeWebhookRequest(JSON.stringify(event));
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      // No DB update should happen since clerk_user_id is missing
      expect(mockFrom).not.toHaveBeenCalled();
    });
  });

  describe('2. Valid customer.subscription.deleted webhook → plan downgraded to "free"', () => {
    test('downgrades user plan to free on subscription deletion', async () => {
      const event = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            customer: 'cus_downgrade_test',
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

      expect(mockFrom).toHaveBeenCalledWith('users');
      expect(mockUpdate).toHaveBeenCalledWith({ plan_status: 'free' });
      expect(mockEq).toHaveBeenCalledWith('stripe_customer_id', 'cus_downgrade_test');
    });

    test('downgrades user plan to free on invoice payment failure', async () => {
      const event = {
        type: 'invoice.payment_failed',
        data: {
          object: {
            customer: 'cus_payment_failed',
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
      expect(mockEq).toHaveBeenCalledWith('stripe_customer_id', 'cus_payment_failed');
    });
  });

  describe('3. Invalid signature → 400, no DB changes', () => {
    test('returns 400 and makes no DB changes when signature is invalid', async () => {
      mockVerifyWebhookSignature.mockImplementation(() => {
        throw new Error('No signatures found matching the expected signature for payload');
      });

      const body = JSON.stringify({ type: 'checkout.session.completed', data: {} });
      const request = makeWebhookRequest(body, 'whsec_invalid_signature');
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('WEBHOOK_INVALID');
      expect(data.error.message).toBe('Invalid webhook signature');

      // Supabase should never be called
      expect(mockFrom).not.toHaveBeenCalled();
    });
  });

  describe('4. Missing signature header → 400', () => {
    test('returns 400 when stripe-signature header is missing', async () => {
      const body = JSON.stringify({ type: 'checkout.session.completed', data: {} });
      const request = makeWebhookRequest(body, null);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('WEBHOOK_INVALID');
      expect(data.error.message).toBe('Missing stripe-signature header');

      // Neither verification nor DB should be touched
      expect(mockVerifyWebhookSignature).not.toHaveBeenCalled();
      expect(mockFrom).not.toHaveBeenCalled();
    });
  });
});
