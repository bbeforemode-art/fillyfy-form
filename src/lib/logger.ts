export interface RequestLog {
  timestamp: string;
  path: string;
  method: string;
  userId: string | null;
  statusCode: number;
  responseTimeMs: number;
}

export function logRequest(log: RequestLog): void {
  console.log(JSON.stringify(log));
}

export function logError(path: string, userId: string | null, error: unknown): void {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    path,
    userId,
    error: error instanceof Error ? error.message : 'Unknown error',
    // Stack trace in logs only, never in responses
    stack: error instanceof Error ? error.stack : undefined,
  }));
}
