import fc from 'fast-check';

// Mock Clerk and Next.js server to avoid importing their ESM-only dependencies in Jest
jest.mock('@clerk/nextjs/server', () => ({
  clerkMiddleware: jest.fn(),
  createRouteMatcher: jest.fn(() => jest.fn()),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({ headers: new Map() })),
  },
}));

// Now import the function under test
import { isAllowedOrigin } from '@/middleware';

/**
 * Property 17: CORS allows only authorized origins
 * For any request origin, CORS headers SHALL include the origin in Access-Control-Allow-Origin
 * only if it matches chrome-extension://* or https://fillyfy.com. All other origins SHALL be denied.
 *
 * **Validates: Requirements 11.3**
 */
describe('Property 17: CORS allows only authorized origins', () => {
  test('chrome-extension:// origins are always allowed', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (extensionId) => {
          const origin = `chrome-extension://${extensionId}`;
          return isAllowedOrigin(origin) === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('https://fillyfy.com is allowed', () => {
    expect(isAllowedOrigin('https://fillyfy.com')).toBe(true);
  });

  test('random origins are rejected', () => {
    fc.assert(
      fc.property(
        fc.webUrl().filter(url => !url.startsWith('chrome-extension://') && url !== 'https://fillyfy.com'),
        (origin) => {
          return isAllowedOrigin(origin) === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('null origin is rejected', () => {
    expect(isAllowedOrigin(null)).toBe(false);
  });

  test('empty string origin is rejected', () => {
    expect(isAllowedOrigin('')).toBe(false);
  });

  test('undefined origin is rejected', () => {
    expect(isAllowedOrigin(undefined as unknown as string | null)).toBe(false);
  });
});
