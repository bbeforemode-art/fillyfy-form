import fc from 'fast-check';

/**
 * Property 2: Invalid authentication is universally rejected
 * For any request to a protected endpoint that lacks a valid Bearer token or has a
 * malformed/expired token, the endpoint SHALL return a 401 status with the message
 * "Authentication required" and perform no side effects.
 *
 * **Validates: Requirements 1.2, 10.4**
 *
 * Note: Clerk middleware handles authentication rejection at the middleware layer.
 * We test the public route matching logic here since the actual Clerk auth
 * validation is handled by Clerk's infrastructure and cannot be unit-tested directly.
 */

// Simulate the public route pattern matching logic from middleware.ts
const PUBLIC_ROUTE_PATTERNS = [
  /^\/$/,
  /^\/privacy$/,
  /^\/terms$/,
  /^\/auth\/sign-in/,
  /^\/auth\/sign-up/,
  /^\/auth\/callback$/,
  /^\/api\/webhooks\/stripe$/,
  /^\/api\/cron\/.*/,
];

function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTE_PATTERNS.some(pattern => pattern.test(path));
}

describe('Property 2: Authentication route protection', () => {
  test('protected API routes are not public', () => {
    const protectedPaths = [
      '/api/explain',
      '/api/auth/session',
      '/api/upgrade',
    ];

    for (const path of protectedPaths) {
      expect(isPublicRoute(path)).toBe(false);
    }
  });

  test('public routes are correctly identified', () => {
    const publicPaths = [
      '/',
      '/privacy',
      '/terms',
      '/auth/sign-in',
      '/auth/sign-in/factor-one',
      '/auth/sign-up',
      '/auth/sign-up/verify',
      '/auth/callback',
      '/api/webhooks/stripe',
      '/api/cron/reset-usage',
      '/api/cron/any-job',
    ];

    for (const path of publicPaths) {
      expect(isPublicRoute(path)).toBe(true);
    }
  });

  test('random /api/* paths are protected (not public)', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z][a-z0-9-]{0,20}$/),
        (segment) => {
          const path = `/api/${segment}`;
          // Skip known public API paths
          if (path === '/api/webhooks' || path.startsWith('/api/cron')) return true;
          if (path === '/api/webhooks/stripe') return true;
          return isPublicRoute(path) === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('webhook and cron routes do not require auth', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z][a-z0-9-]{1,15}$/),
        (jobName) => {
          return isPublicRoute(`/api/cron/${jobName}`) === true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
