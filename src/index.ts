/**
 * Main Application Entry Point
 *
 * Features:
 * - OpenAPI/Swagger documentation
 * - Rate limiting and metrics tracking
 * - Graceful shutdown handling
 * - CORS and error handling
 *
 * Middleware order (critical):
 * 1. errorHandler - catches all errors
 * 2. requestId - unique request tracking
 * 3. metricsMiddleware - request metrics
 * 4. cors - CORS headers
 * 5. rateLimiter - rate limiting
 * 6. requestLogger - request logging
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
import { registerSchemaRoutes } from './routes/schema/schema.route.js';
import { MockeleonService } from './services/mockeleon.service.js';

export function createApp(): OpenAPIHono {
  const app = new OpenAPIHono();

  const rateLimiter = new RateLimiter(60000, 100);

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

  const mockeleonService = new MockeleonService();

  registerHealthRoutes(app);
  registerMockRoutes(app, mockeleonService);
  registerMetricsRoutes(app);
  registerSchemaRoutes(app);

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

const app = createApp();

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
