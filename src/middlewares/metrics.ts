import { type Context, type Next } from 'hono';

import { metricsService } from '../services/metrics.service.js';

/**
 * Metrics middleware
 * Tracks request duration, active requests, and HTTP request counts
 */
export async function metricsMiddleware(c: Context, next: Next) {
  const start = Date.now();
  const path = c.req.path;
  const method = c.req.method;

  // Increment active requests
  metricsService.activeRequests.inc();

  try {
    await next();
  } finally {
    // Decrement active requests
    metricsService.activeRequests.dec();

    // Record request duration
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    const statusCode = c.res.status.toString();

    metricsService.requestDuration.observe(
      { method, route: path, status_code: statusCode },
      duration
    );

    // Increment HTTP requests counter
    metricsService.httpRequests.inc({
      method,
      route: path,
      status_code: statusCode,
    });
  }
}
