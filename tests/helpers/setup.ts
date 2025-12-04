import type { OpenAPIHono } from '@hono/zod-openapi';

import { createApp } from '../../src/index';

/**
 * Create a test app instance
 * Provides a fresh Hono app with all routes and middlewares configured
 */
export function createTestApp(): OpenAPIHono {
  return createApp();
}

/**
 * Helper to make POST request to /mock endpoint
 * Simplifies test code by handling common request setup
 */
export async function testMockeleonRequest(
  app: OpenAPIHono,
  schema: Record<string, unknown>,
  count?: number
) {
  return await app.request('/mock', {
    method: 'POST',
    body: JSON.stringify({ schema, count }),
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Helper to parse JSON response
 */
export async function parseJsonResponse<T = unknown>(
  response: Response
): Promise<T> {
  return (await response.json()) as T;
}

/**
 * Assert response is successful (2xx status code)
 */
export function assertSuccess(response: Response): void {
  if (!response.ok) {
    throw new Error(
      `Expected successful response, got ${response.status}: ${response.statusText}`
    );
  }
}

/**
 * Assert response has specific status code
 */
export function assertStatus(response: Response, expectedStatus: number): void {
  if (response.status !== expectedStatus) {
    throw new Error(
      `Expected status ${expectedStatus}, got ${response.status}`
    );
  }
}
