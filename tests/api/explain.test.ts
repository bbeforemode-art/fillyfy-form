import fc from 'fast-check';

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
  checkRateLimit: jest.fn().mockReturnValue({ allowed: true }),
}));

jest.mock('@/lib/usage', () => ({
  canUseExplanation: jest.fn().mockResolvedValue(true),
  incrementUsage: jest.fn().mockResolvedValue(undefined),
  getOrCreateUsage: jest.fn().mockResolvedValue({ count: 0 }),
}));

import { POST } from '@/app/api/explain/route';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getExplanation } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import { canUseExplanation } from '@/lib/usage';

const mockAuth = auth as unknown as jest.Mock;
const mockFrom = (supabase.from as jest.Mock);
const mockGetExplanation = getExplanation as jest.Mock;
const mockCheckRateLimit = checkRateLimit as jest.Mock;
const mockCanUseExplanation = canUseExplanation as jest.Mock;

function makeRequest(body: string, contentType = 'application/json'): Request {
  return new Request('http://localhost/api/explain', {
    method: 'POST',
    headers: { 'content-type': contentType },
    body,
  });
}

/**
 * Property 1: Valid field context produces structured explanation
 * Validates: Requirements 1.1
 */
describe('Property 1: Valid field context produces structured explanation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: 'user_123' });
    mockCheckRateLimit.mockReturnValue({ allowed: true });
    mockCanUseExplanation.mockResolvedValue(true);
    mockFrom.mockImplementation(() => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { plan_status: 'free' }, error: null }),
        }),
      }),
    }));
  });

  test('valid FieldContext with auth returns all 6 explanation fields', async () => {
    const fieldLabelArb = fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);
    const optionalStringArb = fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined });

    await fc.assert(
      fc.asyncProperty(
        fieldLabelArb,
        optionalStringArb,
        optionalStringArb,
        async (fieldLabel, placeholder, formTitle) => {
          jest.clearAllMocks();
          mockAuth.mockResolvedValue({ userId: 'user_123' });
          mockCheckRateLimit.mockReturnValue({ allowed: true });
          mockCanUseExplanation.mockResolvedValue(true);
          mockFrom.mockImplementation(() => ({
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { plan_status: 'free' }, error: null }),
              }),
            }),
          }));

          const mockExplanation = {
            plain_explanation: 'Test explanation',
            what_to_write: 'Test value',
            why_asked: 'Test reason',
            common_mistakes: ['mistake1'],
            documents_needed: ['doc1'],
            tips: 'A helpful tip',
          };
          mockGetExplanation.mockResolvedValue(mockExplanation);

          const fieldContext: Record<string, unknown> = { fieldLabel };
          if (placeholder !== undefined) fieldContext.fieldPlaceholder = placeholder;
          if (formTitle !== undefined) fieldContext.formTitle = formTitle;

          const request = makeRequest(JSON.stringify(fieldContext));
          const response = await POST(request);
          const data = await response.json();

          expect(response.status).toBe(200);
          expect(data).toHaveProperty('plain_explanation');
          expect(data).toHaveProperty('what_to_write');
          expect(data).toHaveProperty('why_asked');
          expect(data).toHaveProperty('common_mistakes');
          expect(data).toHaveProperty('documents_needed');
          expect(data).toHaveProperty('tips');
          expect(typeof data.plain_explanation).toBe('string');
          expect(typeof data.what_to_write).toBe('string');
          expect(typeof data.why_asked).toBe('string');
          expect(Array.isArray(data.common_mistakes)).toBe(true);
          expect(Array.isArray(data.documents_needed)).toBe(true);
          expect(typeof data.tips).toBe('string');
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 3: Missing required fields produce validation errors
 * Validates: Requirements 1.3
 */
describe('Property 3: Missing required fields produce validation errors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: 'user_123' });
    mockCheckRateLimit.mockReturnValue({ allowed: true });
  });

  test('missing, empty, or whitespace-only fieldLabel returns 400', async () => {
    const emptyFieldLabelArb = fc.oneof(
      fc.constant(''),
      fc.constant('   '),
      fc.constant('\t\n'),
      fc.constant('  \t  \n  ')
    );

    await fc.assert(
      fc.asyncProperty(emptyFieldLabelArb, async (fieldLabel) => {
        jest.clearAllMocks();
        mockAuth.mockResolvedValue({ userId: 'user_123' });
        mockCheckRateLimit.mockReturnValue({ allowed: true });

        const request = makeRequest(JSON.stringify({ fieldLabel }));
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBeDefined();
        expect(data.error.code).toBe('VALIDATION_ERROR');
      }),
      { numRuns: 100 }
    );
  });

  test('body with no fieldLabel property returns 400', async () => {
    const bodyWithoutFieldLabel = fc.record({
      fieldPlaceholder: fc.option(fc.string(), { nil: undefined }),
      formTitle: fc.option(fc.string(), { nil: undefined }),
    });

    await fc.assert(
      fc.asyncProperty(bodyWithoutFieldLabel, async (body) => {
        jest.clearAllMocks();
        mockAuth.mockResolvedValue({ userId: 'user_123' });
        mockCheckRateLimit.mockReturnValue({ allowed: true });

        const request = makeRequest(JSON.stringify(body));
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBeDefined();
        expect(data.error.code).toBe('VALIDATION_ERROR');
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 15: Non-JSON content types are rejected
 * Validates: Requirements 11.1
 */
describe('Property 15: Non-JSON content types are rejected', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: 'user_123' });
  });

  test('non-JSON content types return error without processing body', async () => {
    const nonJsonContentTypeArb = fc.oneof(
      fc.constant('text/plain'),
      fc.constant('text/html'),
      fc.constant('multipart/form-data'),
      fc.constant('application/xml'),
      fc.constant('application/x-www-form-urlencoded'),
      fc.constant('image/png'),
      fc.string({ minLength: 3, maxLength: 30 }).filter(s =>
        !s.includes('application/json') && s.includes('/')
      )
    );

    await fc.assert(
      fc.asyncProperty(nonJsonContentTypeArb, async (contentType) => {
        jest.clearAllMocks();
        mockAuth.mockResolvedValue({ userId: 'user_123' });

        const request = makeRequest(JSON.stringify({ fieldLabel: 'test' }), contentType);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBeDefined();
        expect(data.error.code).toBe('VALIDATION_ERROR');

        // Claude should never be called for invalid content types
        expect(mockGetExplanation).not.toHaveBeenCalled();
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 16: Oversized payloads are rejected at 10KB boundary
 * Validates: Requirements 11.2
 */
describe('Property 16: Oversized payloads are rejected at 10KB boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({ userId: 'user_123' });
    mockCheckRateLimit.mockReturnValue({ allowed: true });
  });

  test('bodies > 10KB return 413', async () => {
    // Generate sizes that will produce bodies > 10240 bytes
    const oversizeArb = fc.integer({ min: 1, max: 5000 });

    await fc.assert(
      fc.asyncProperty(oversizeArb, async (extra) => {
        jest.clearAllMocks();
        mockAuth.mockResolvedValue({ userId: 'user_123' });
        mockCheckRateLimit.mockReturnValue({ allowed: true });

        // Create a body that exceeds 10KB (10240 bytes)
        // JSON.stringify({ fieldLabel: "xxx..." }) has overhead of ~16 chars
        const padding = 'x'.repeat(10240 + extra);
        const body = JSON.stringify({ fieldLabel: padding });
        // body is guaranteed to be > 10240

        const request = makeRequest(body);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(413);
        expect(data.error.code).toBe('PAYLOAD_TOO_LARGE');
      }),
      { numRuns: 50 }
    );
  });

  test('bodies <= 10KB are not rejected for size', async () => {
    const validSizeArb = fc.integer({ min: 10, max: 500 });

    await fc.assert(
      fc.asyncProperty(validSizeArb, async (labelLength) => {
        jest.clearAllMocks();
        mockAuth.mockResolvedValue({ userId: 'user_123' });
        mockCheckRateLimit.mockReturnValue({ allowed: true });
        mockCanUseExplanation.mockResolvedValue(true);
        mockFrom.mockImplementation(() => ({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { plan_status: 'free' }, error: null }),
            }),
          }),
        }));
        mockGetExplanation.mockResolvedValue({
          plain_explanation: 'Test',
          what_to_write: 'Test',
          why_asked: 'Test',
          common_mistakes: [],
          documents_needed: [],
          tips: 'Test',
        });

        const label = 'a'.repeat(labelLength);
        const body = JSON.stringify({ fieldLabel: label });
        // Ensure body is <= 10KB
        if (body.length > 10240) return; // skip if accidentally too large

        const request = makeRequest(body);
        const response = await POST(request);

        // Should NOT be 413
        expect(response.status).not.toBe(413);
      }),
      { numRuns: 100 }
    );
  });
});
