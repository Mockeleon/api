import { randomUUID } from 'node:crypto';

import { type Context, type Next } from 'hono';

/**
 * Request ID middleware
 * Generates unique ID for each request for log correlation
 */
export async function requestId(c: Context, next: Next) {
  const existingId = c.req.header('x-request-id');
  const id = existingId ?? randomUUID();

  c.set('requestId', id);

  c.header('X-Request-ID', id);

  await next();
}

export function getRequestId(c: Context): string {
  return (c.get('requestId') as string) ?? 'unknown';
}
