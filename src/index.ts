/**
 * @fileoverview Main Application Entry Point
 *
 * This file orchestrates the entire application lifecycle:
 * 1. Creates and configures the Hono application with OpenAPI support
 * 2. Registers middlewares in a specific order (critical for proper error handling)
 * 3. Sets up routes with dependency injection
 * 4. Starts the HTTP server on configured port
 * 5. Handles graceful shutdown on SIGTERM/SIGINT signals
 *
 * Middleware Order (CRITICAL - DO NOT CHANGE):
 * ┌─────────────────────────────────────────┐
 * │ 1. errorHandler (wraps all middlewares)│ ← Must be first to catch all errors
 * │ 2. requestId (generates unique ID)      │ ← For request tracking and logging
 * │ 3. metricsMiddleware (tracks metrics)   │ ← Record request metrics
 * │ 4. cors (handles CORS headers)          │ ← Before rate limiting for preflight
 * │ 5. rateLimiter (enforces rate limits)   │ ← Reject excessive requests early
 * │ 6. requestLogger (logs requests)        │ ← Log after rate limit decisions
 * │ 7. Routes (handle business logic)       │ ← Application endpoints
 * └─────────────────────────────────────────┘
 *
 * Why this order matters:
 * - errorHandler must wrap everything to catch all errors
 * - requestId must run early for correlation across logs
 * - rateLimiter runs before logger to avoid logging rejected requests
 * - CORS runs before rate limiter to handle preflight requests
 *
 * Graceful Shutdown:
 * - Listens for SIGTERM (Docker/Kubernetes stop signal)
 * - Listens for SIGINT (Ctrl+C during development)
 * - Closes server gracefully (waits for active connections)
 * - Prevents abrupt connection drops during deployments
 *
 * @module
 */

import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';

import { config } from './config/index.js';
import log from './config/logger.js';
import { errorHandler } from './middlewares/error-handler.js';
import { metricsMiddleware } from './middlewares/metrics.js';
import { RateLimiter } from './middlewares/rate-limiter.js';
import { requestId } from './middlewares/request-id.js';
import { requestLogger } from './middlewares/request-logger.js';
import { registerHealthRoutes } from './routes/health/health.route.js';
import { registerMetricsRoutes } from './routes/metrics/metrics.route.js';
import { registerMockRoutes } from './routes/mock/mock.route.js';
import { schemaRouter } from './routes/schema/index.js';
import { MockeleonService } from './services/mockeleon.service.js';

/**
 * Create and configure the Hono application
 *
 * This function is separated from server startup for testability.
 * Tests can create an app instance without starting the HTTP server.
 *
 * @returns Configured OpenAPIHono application instance
 */
export function createApp(): OpenAPIHono {
  // Create Hono app with OpenAPI support
  const app = new OpenAPIHono();

  // Initialize rate limiter (100 requests per minute per IP)
  const rateLimiter = new RateLimiter(60000, 100);

  // Apply middlewares (order matters: errorHandler wraps everything)
  app.use('*', errorHandler);
  app.use('*', requestId);
  app.use('*', metricsMiddleware);
  app.use(
    '*',
    cors({
      origin: '*',
      allowMethods: ['GET', 'POST'],
      allowHeaders: ['Content-Type'],
      exposeHeaders: [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
      ],
      maxAge: 86400,
    })
  );
  app.use('*', rateLimiter.middleware());
  app.use('*', requestLogger);

  // OpenAPI documentation configuration
  // Note: In production, Nginx already adds /api prefix before forwarding
  // So the server URL should just be the domain without /api
  app.doc('/openapi.json', {
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'Mockeleon API',
      description:
        'Production-grade REST API for generating realistic mock data with customizable schemas',
    },
    servers: [
      {
        url: config.api.domain,
        description:
          config.server.env === 'production'
            ? 'Production server'
            : 'Development server',
      },
    ],
  });

  // Initialize services
  const mockeleonService = new MockeleonService();

  // Register routes with dependency injection
  registerHealthRoutes(app);
  registerMockRoutes(app, mockeleonService);
  registerMetricsRoutes(app);
  app.route('/', schemaRouter);

  // Swagger UI for documentation
  app.get(
    '/docs',
    swaggerUI({
      url:
        config.server.env === 'production'
          ? '/api/openapi.json'
          : '/openapi.json',
    })
  );

  return app;
}

// Create app instance
const app = createApp();

// Start server
const server = serve(
  {
    fetch: app.fetch,
    port: config.server.port,
    hostname: config.server.host,
  },
  (info) => {
    log.info(
      `🚀 Server running at http://${info.address}:${info.port} in ${config.server.env} mode`
    );
    log.debug(`📚 API Documentation: http://${info.address}:${info.port}/docs`);
    log.debug(`🔗 Health Check: http://${info.address}:${info.port}/health`);
    log.debug(`📊 Metrics: http://${info.address}:${info.port}/metrics`);
  }
);

// Graceful shutdown handlers
async function gracefulShutdown(signal: string): Promise<void> {
  log.info(`${signal} signal received: starting graceful shutdown`);

  // Force shutdown after 30 seconds
  const forceShutdownTimer = setTimeout(() => {
    log.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);

  try {
    // Close HTTP server
    await new Promise<void>((resolve) => {
      server.close(() => {
        log.info('HTTP server closed');
        resolve();
      });
    });

    clearTimeout(forceShutdownTimer);
    process.exit(0);
  } catch (error) {
    log.error('Error during shutdown:', error);
    clearTimeout(forceShutdownTimer);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  void gracefulShutdown('SIGTERM');
});
process.on('SIGINT', () => {
  void gracefulShutdown('SIGINT');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  log.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  log.error('Unhandled Rejection:', reason);
  process.exit(1);
});
