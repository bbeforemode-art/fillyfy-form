/**
 * In-memory sliding window rate limiter.
 * Threshold: 5 requests per 10-second window per user.
 * State resets on serverless cold starts (acceptable for abuse prevention).
 */

const WINDOW_MS = 10_000; // 10 seconds
const MAX_REQUESTS = 5;

const userRequests = new Map<string, number[]>();

export function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const timestamps = userRequests.get(userId) || [];

  // Remove timestamps outside the window
  const validTimestamps = timestamps.filter(t => now - t < WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS) {
    const oldestInWindow = validTimestamps[0];
    const retryAfter = Math.ceil((oldestInWindow + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  validTimestamps.push(now);
  userRequests.set(userId, validTimestamps);

  return { allowed: true };
}

// For testing — reset all state
export function resetRateLimiter(): void {
  userRequests.clear();
}
