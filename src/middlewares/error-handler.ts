/**
 * Global error handler middleware
 *
 * Catches all errors, logs them with unique IDs, and returns consistent JSON responses.
 * Must be registered FIRST in middleware chain.
 *
 * Features:
 * - Unique error ID for tracking (UUID)
 * - Environment-aware responses (stack traces only in dev)
 * - Consistent error format across all endpoints
 */

import { randomUUID } from 'node:crypto';

import { type Context, type Next } from 'hono';

import { config } from '../config/index.js';
import log from '../config/logger.js';

export async function errorHandler(c: Context, next: Next) {
  try {
    return await next();
  } catch (err) {
    const errorId = randomUUID();
    const error = err as Error;

    log.error(`[${errorId}] Unhandled error:`, {
      errorId,
      message: error.message,
      stack: error.stack,
      error: err,
    });

    return c.json(
      {
        status: 'error',
        message: error.message || 'Internal server error',
        errorId,
        ...(config.server.env === 'development' && {
          stack: error.stack,
        }),
      },
      500
    );
  }
}
