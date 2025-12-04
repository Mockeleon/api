import { type Context, type Next } from 'hono';

import log from '../config/logger.js';

import { getRequestId } from './request-id.js';

/**
 * Request logging middleware
 * Logs all incoming requests with method, path, status code, duration, and request ID
 */
export async function requestLogger(c: Context, next: Next) {
  const start = Date.now();

  await next();

  const duration = Date.now() - start;
  const requestId = getRequestId(c);

  log.info(
    `[${requestId}] ${c.req.method} ${c.req.path} - ${c.res.status} (${duration}ms)`
  );
}
