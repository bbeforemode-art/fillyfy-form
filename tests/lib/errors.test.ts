import fc from 'fast-check';
import { errorResponse, ErrorCodes } from '@/lib/errors';

/**
 * Property 19: Error responses have consistent format
 * Validates: Requirements 14.1, 14.4
 */
describe('Property 19: Error responses have consistent format', () => {
  const errorCodeArb = fc.constantFrom(...Object.values(ErrorCodes));
  const messageArb = fc.string({ minLength: 1 }).filter(s => s.trim().length > 0);
  const statusArb = fc.integer({ min: 400, max: 599 });

  test('errorResponse always produces { error: { message, code } } format', async () => {
    await fc.assert(
      fc.asyncProperty(messageArb, errorCodeArb, statusArb, async (message, code, status) => {
        const response = errorResponse(message, code, status);
        const body = await response.json();

        // Must have error.message and error.code
        expect(body).toHaveProperty('error');
        expect(body.error).toHaveProperty('message', message);
        expect(body.error).toHaveProperty('code', code);

        // Must not contain stack traces
        const bodyStr = JSON.stringify(body);
        expect(bodyStr).not.toContain('Error:');
        expect(bodyStr).not.toContain('at ');
        expect(bodyStr).not.toContain('node_modules');

        // Status code matches
        expect(response.status).toBe(status);

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
