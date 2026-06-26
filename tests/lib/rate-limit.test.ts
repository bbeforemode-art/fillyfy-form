import fc from 'fast-check';
import { checkRateLimit, resetRateLimiter } from '@/lib/rate-limit';

/**
 * Property 18: Rate limiting triggers after threshold
 * Validates: Requirements 11.4
 */
describe('Property 18: Rate limiting triggers after threshold', () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  test('first 5 requests within 10s window are allowed', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (userId) => {
          resetRateLimiter();
          for (let i = 0; i < 5; i++) {
            const result = checkRateLimit(userId);
            if (!result.allowed) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('6th request within same window is rejected', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (userId) => {
          resetRateLimiter();
          // Make 5 requests
          for (let i = 0; i < 5; i++) {
            checkRateLimit(userId);
          }
          // 6th should be rejected
          const result = checkRateLimit(userId);
          return result.allowed === false && result.retryAfter !== undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('different users have independent rate limits', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (userA, userB) => {
          if (userA === userB) return true; // skip same user
          resetRateLimiter();
          // Fill user A's quota
          for (let i = 0; i < 5; i++) {
            checkRateLimit(userA);
          }
          // User B should still be allowed
          const result = checkRateLimit(userB);
          return result.allowed === true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
