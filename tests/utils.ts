import { OpenAPIHono } from '@hono/zod-openapi';

import { registerMockRoutes } from '../src/routes/mock/mock.route';
import { registerHealthRoutes } from '../src/routes/health/health.route';
import { MockeleonService } from '../src/services/mockeleon.service';

/**
 * Setup test app with all routes registered
 * Use this in all tests to ensure consistent app setup
 */
export function setupTestApp(): OpenAPIHono {
  const app = new OpenAPIHono();

  // Initialize services
  const mockeleonService = new MockeleonService();

  // Register all routes
  registerHealthRoutes(app);
  registerMockRoutes(app, mockeleonService);

  return app;
}
