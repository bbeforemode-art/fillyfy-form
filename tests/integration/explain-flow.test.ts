/**
 * Integration tests for the explain flow.
 * Tests the complete request flow: auth → validation → usage check → Claude call → usage increment → response
 * Mocks external services: Clerk, Supabase, Claude, rate limiter
 */

// Mock external dependencies before imports
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('@/lib/claude', () => ({
  getExplanation: jest.fn(),
}));

jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn(),
}));

jest.mock('@/lib/usage', () => ({
  canUseExplanation: jest.fn(),
  incrementUsage: jest.fn(),
  getOrCreateUsage: jest.fn(),
}));

import { POST } from '@/app/api/explain/route';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getExplanation } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import { canUseExplanation, incrementUsage } from '@/lib/usage';

const mockAuth = auth as unknown as jest.Mock;
const mockFrom = supabase.from as jest.Mock;
const mockGetExplanation = getExplanation as jest.Mock;
const mockCheckRateLimit = checkRateLimit as jest.Mock;
const mockCanUseExplanation = canUseExplanation as jest.Mock;
const mockIncrementUsage = incrementUsage as jest.Mock;

function makeRequest(body: string, options: { contentType?: string; method?: string } = {}): Request {
  const { contentType = 'application/json', method = 'POST' } = options;
  return new Request('http://localhost/api/explain', {
    method,
    headers: { 'content-type': contentType },
    body,
  });
}

function setupAuthenticatedUser(plan: string = 'free') {
  mockAuth.mockResolvedValue({ userId: 'user_test123' });
  mockCheckRateLimit.mockReturnValue({ allowed: true });
  mockCanUseExplanation.mockResolvedValue(true);
  mockIncrementUsage.mockResolvedValue(undefined);
  mockFrom.mockImplementation(() => ({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: { plan_status: plan }, error: null }),
      }),
    }),
  }));
}

const validExplanation = {
  plain_explanation: 'This field asks for your full legal name.',
  what_to_write: 'Enter your first and last name as it appears on your ID.',
  why_asked: 'Required for identity verification.',
  common_mistakes: ['Using a nickname instead of legal name'],
  documents_needed: ['Government-issued ID'],
  tips: 'Make sure it matches your official documents.',
};

describe('Integration: Explain Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Auth present + valid request → 200 + explanation', () => {
    test('returns structured explanation for authenticated user with valid request', async () => {
      setupAuthenticatedUser();
      mockGetExplanation.mockResolvedValue(validExplanation);

      const body = JSON.stringify({
        fieldLabel: 'Full Name',
        fieldType: 'text',
        formTitle: 'Registration Form',
        pageTitle: 'Sign Up',
      });

      const request = makeRequest(body);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.plain_explanation).toBe(validExplanation.plain_explanation);
      expect(data.what_to_write).toBe(validExplanation.what_to_write);
      expect(data.why_asked).toBe(validExplanation.why_asked);
      expect(data.common_mistakes).toEqual(validExplanation.common_mistakes);
      expect(data.documents_needed).toEqual(validExplanation.documents_needed);
      expect(data.tips).toBe(validExplanation.tips);

      // Verify usage was incremented
      expect(mockIncrementUsage).toHaveBeenCalledWith('user_test123');
    });

    test('calls Claude with the field context', async () => {
      setupAuthenticatedUser();
      mockGetExplanation.mockResolvedValue(validExplanation);

      const fieldContext = {
        fieldLabel: 'Email Address',
        fieldPlaceholder: 'you@example.com',
        fieldType: 'email',
        fieldRequired: true,
      };

      const request = makeRequest(JSON.stringify(fieldContext));
      await POST(request);

      expect(mockGetExplanation).toHaveBeenCalledWith(
        expect.objectContaining({ fieldLabel: 'Email Address' })
      );
    });
  });

  describe('2. No auth → 401', () => {
    test('returns 401 when no user is authenticated', async () => {
      mockAuth.mockResolvedValue({ userId: null });

      const body = JSON.stringify({ fieldLabel: 'Name' });
      const request = makeRequest(body);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error.code).toBe('UNAUTHORIZED');
      expect(data.error.message).toBe('Authentication required');

      // No downstream calls should happen
      expect(mockGetExplanation).not.toHaveBeenCalled();
      expect(mockIncrementUsage).not.toHaveBeenCalled();
    });
  });

  describe('3. Missing fieldLabel → 400', () => {
    test('returns 400 when fieldLabel is missing', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_test123' });
      mockCheckRateLimit.mockReturnValue({ allowed: true });

      const body = JSON.stringify({ fieldType: 'text', formTitle: 'Test' });
      const request = makeRequest(body);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_ERROR');
      expect(mockGetExplanation).not.toHaveBeenCalled();
    });

    test('returns 400 when fieldLabel is empty string', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_test123' });
      mockCheckRateLimit.mockReturnValue({ allowed: true });

      const body = JSON.stringify({ fieldLabel: '' });
      const request = makeRequest(body);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });

    test('returns 400 when fieldLabel is whitespace only', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_test123' });
      mockCheckRateLimit.mockReturnValue({ allowed: true });

      const body = JSON.stringify({ fieldLabel: '   ' });
      const request = makeRequest(body);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('4. Body > 10KB → 413', () => {
    test('returns 413 when request body exceeds 10KB', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_test123' });
      mockCheckRateLimit.mockReturnValue({ allowed: true });

      // Create a body that exceeds 10KB
      const largeLabel = 'x'.repeat(11000);
      const body = JSON.stringify({ fieldLabel: largeLabel });

      const request = makeRequest(body);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(413);
      expect(data.error.code).toBe('PAYLOAD_TOO_LARGE');
      expect(mockGetExplanation).not.toHaveBeenCalled();
    });
  });

  describe('5. Rate limited → 429', () => {
    test('returns 429 when user exceeds rate limit', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_test123' });
      mockCheckRateLimit.mockReturnValue({ allowed: false, retryAfter: 5 });

      const body = JSON.stringify({ fieldLabel: 'Name' });
      const request = makeRequest(body);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error.code).toBe('RATE_LIMITED');
      expect(mockGetExplanation).not.toHaveBeenCalled();
      expect(mockIncrementUsage).not.toHaveBeenCalled();
    });
  });

  describe('6. Free limit reached → 429', () => {
    test('returns 429 when free tier user has reached monthly limit', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_test123' });
      mockCheckRateLimit.mockReturnValue({ allowed: true });
      mockCanUseExplanation.mockResolvedValue(false);
      mockFrom.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { plan_status: 'free' }, error: null }),
          }),
        }),
      }));

      const body = JSON.stringify({ fieldLabel: 'Name' });
      const request = makeRequest(body);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error.code).toBe('RATE_LIMITED');
      expect(data.error.message).toContain('Monthly form limit reached');
      expect(mockGetExplanation).not.toHaveBeenCalled();
    });
  });

  describe('7. Claude timeout → 502', () => {
    test('returns 502 when Claude API times out', async () => {
      setupAuthenticatedUser();

      const abortError = new Error('Request timed out');
      abortError.name = 'AbortError';
      mockGetExplanation.mockRejectedValue(abortError);

      const body = JSON.stringify({ fieldLabel: 'Name' });
      const request = makeRequest(body);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.error.code).toBe('UPSTREAM_ERROR');
      expect(data.error.message).toBe('AI service unavailable');
    });

    test('returns 502 when Claude API throws generic error', async () => {
      setupAuthenticatedUser();
      mockGetExplanation.mockRejectedValue(new Error('API connection failed'));

      const body = JSON.stringify({ fieldLabel: 'Name' });
      const request = makeRequest(body);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.error.code).toBe('UPSTREAM_ERROR');
    });
  });
});
