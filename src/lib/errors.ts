// Error codes
export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  RATE_LIMITED: 'RATE_LIMITED',
  UPSTREAM_ERROR: 'UPSTREAM_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  WEBHOOK_INVALID: 'WEBHOOK_INVALID',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Creates a consistent JSON error response.
 * Format: { "error": { "message": string, "code": string } }
 */
export function errorResponse(message: string, code: ErrorCode, status: number): Response {
  return Response.json(
    { error: { message, code } },
    { status }
  );
}
