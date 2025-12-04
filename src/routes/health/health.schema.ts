import { z } from '@hono/zod-openapi';

export const HEALTH_TAG = 'Health';
export const HEALTH_SUMMARY = 'Health check endpoint';

export const HealthResponseSchema = z
  .object({
    status: z.literal('ok').openapi({
      example: 'ok',
      description: 'Overall health status of the API',
    }),
    timestamp: z.string().datetime().openapi({
      example: '2025-11-18T12:00:00.000Z',
      description: 'ISO 8601 timestamp when the check was performed',
    }),
    uptime: z.number().openapi({
      example: 123.456,
      description: 'Process uptime in seconds',
    }),
  })
  .strict()
  .openapi('HealthResponse');
