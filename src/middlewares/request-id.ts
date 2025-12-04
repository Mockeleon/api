import { randomUUID } from 'node:crypto';

import { type Context, type Next } from 'hono';

/**
 * Request ID middleware
 * Generates unique ID for each request for log correlation
 */
export async function requestId(c: Context, next: Next) {
  // Check if request already has an ID (from load balancer/proxy)
  const existingId = c.req.header('x-request-id');
  const id = existingId ?? randomUUID();

  // Set ID in context for use in handlers
  c.set('requestId', id);

  // Add to response headers
  c.header('X-Request-ID', id);

  await next();
}

/**
 * Get request ID from context
 */
export function getRequestId(c: Context): string {
  return (c.get('requestId') as string) ?? 'unknown';
}
