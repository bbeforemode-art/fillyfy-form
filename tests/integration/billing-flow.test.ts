/**
 * Integration tests for the billing flow.
 * Tests webhook processing and Razorpay integration.
 * Mocks: Razorpay verifyWebhookSignature, Supabase
 */

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

function makeWebhookRequest(body: string, signature: string | null = 'valid_signature'): Request {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (signature !== null) {
    headers['x-razorpay-signature'] = signature;
  }

  return new Request('http://localhost/api/webhooks/razorpay', {
    method: 'POST',
    headers,
    body,
  });
}

describe('Integration: Billing Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Valid subscription.activated webhook → plan updated to "pro"', () => {
    test('upgrades user plan to pro and stores subscription ID', async () => {
      const event = {
        event: 'subscription.activated',
        payload: {
          subscription: {
            entity: {
              id: 'sub_razorpay_123',
              notes: {
                clerk_user_id: 'user_abc123',
                email: 'user@example.com',
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

      // Verify DB update was called with correct fields
      expect(mockFrom).toHaveBeenCalledWith('users');
      expect(mockUpdate).toHaveBeenCalledWith({
        plan_status: 'pro',
        stripe_customer_id: 'sub_razorpay_123',
        stripe_subscription_id: 'sub_razorpay_123',
      });
      expect(mockEq).toHaveBeenCalledWith('clerk_user_id', 'user_abc123');
    });

    test('handles subscription event without clerk_user_id gracefully', async () => {
      const event = {
        event: 'subscription.activated',
        payload: {
          subscription: {
            entity: {
              id: 'sub_no_clerk',
              notes: {},
            },
          },
        },
      };

      mockVerifyWebhookSignature.mockReturnValue(true);

      const request = makeWebhookRequest(JSON.stringify(event));
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toBe(true);
      // No DB update should happen since clerk_user_id is missing
      expect(mockFrom).not.toHaveBeenCalled();
    });
  });

  describe('2. Valid subscription.cancelled webhook → plan downgraded to "free"', () => {
    test('downgrades user plan to free on subscription cancellation', async () => {
      const event = {
        event: 'subscription.cancelled',
        payload: {
          subscription: {
            entity: {
              id: 'sub_cancel_test',
              notes: {
                clerk_user_id: 'user_downgrade',
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

      expect(mockFrom).toHaveBeenCalledWith('users');
      expect(mockUpdate).toHaveBeenCalledWith({ plan_status: 'free' });
      expect(mockEq).toHaveBeenCalledWith('clerk_user_id', 'user_downgrade');
    });

    test('downgrades user plan to free on payment failure', async () => {
      const event = {
        event: 'payment.failed',
        payload: {
          subscription: {
            entity: {
              id: 'sub_payment_failed',
              notes: {
                clerk_user_id: 'user_payment_failed',
                plan: 'business',
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
      expect(mockEq).toHaveBeenCalledWith('clerk_user_id', 'user_payment_failed');
    });
  });

  describe('3. Invalid signature → 400, no DB changes', () => {
    test('returns 400 and makes no DB changes when signature is invalid', async () => {
      mockVerifyWebhookSignature.mockReturnValue(false);

      const body = JSON.stringify({ event: 'subscription.activated', payload: {} });
      const request = makeWebhookRequest(body, 'invalid_signature');
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
    test('returns 400 when x-razorpay-signature header is missing', async () => {
      const body = JSON.stringify({ event: 'subscription.activated', payload: {} });
      const request = makeWebhookRequest(body, null);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('WEBHOOK_INVALID');
      expect(data.error.message).toBe('Missing x-razorpay-signature header');

      // Neither verification nor DB should be touched
      expect(mockVerifyWebhookSignature).not.toHaveBeenCalled();
      expect(mockFrom).not.toHaveBeenCalled();
    });
  });
});
