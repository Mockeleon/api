import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';

import {
  HealthResponseSchema,
  HEALTH_SUMMARY,
  HEALTH_TAG,
} from './health.schema.js';
import type { HealthResponse } from './health.types.js';

const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: [HEALTH_TAG],
  summary: HEALTH_SUMMARY,
  description: 'Returns the health status of the API',
  responses: {
    200: {
      description: 'API is healthy',
      content: {
        'application/json': {
          schema: HealthResponseSchema,
        },
      },
    },
  },
});

export function registerHealthRoutes(app: OpenAPIHono) {
  app.openapi(healthRoute, (c) => {
    const body: HealthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    return c.json(body);
  });
}
