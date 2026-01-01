import { z } from '@hono/zod-openapi';

export const METRICS_TAG = 'Metrics';
export const METRICS_SUMMARY = 'Get application metrics';

export const MetricsResponseSchema = z
  .object({
    recordsGenerated: z.number().openapi({
      description: 'Total number of mock data records generated',
      example: 1250,
    }),
    totalRequests: z.number().openapi({
      description: 'Total number of HTTP requests processed',
      example: 342,
    }),
    rateLimitHits: z.number().openapi({
      description: 'Number of requests blocked by rate limiter',
      example: 5,
    }),
    activeRequests: z.number().openapi({
      description: 'Currently processing requests',
      example: 2,
    }),
    successfulRequests: z.number().openapi({
      description: 'Number of successful requests (2xx status)',
      example: 320,
    }),
    failedRequests: z.number().openapi({
      description: 'Number of failed requests (4xx-5xx status)',
      example: 22,
    }),
    avgResponseTime: z.union([z.number(), z.string()]).openapi({
      description: 'Average response time in milliseconds',
      example: 45,
    }),
    successRate: z.union([z.number(), z.string()]).openapi({
      description: 'Success rate percentage',
      example: 93,
    }),
    rateLimitRate: z.union([z.number(), z.string()]).openapi({
      description: 'Rate limit hit percentage',
      example: 1,
    }),
    uptime: z
      .object({
        hours: z.number(),
        minutes: z.number(),
        seconds: z.number(),
      })
      .openapi({
        description: 'Server uptime',
        example: { hours: 2, minutes: 34, seconds: 15 },
      }),
    system: z
      .object({
        nodeVersion: z.string(),
        platform: z.string(),
        memoryUsageMB: z.number(),
        environment: z.string(),
      })
      .openapi({
        description: 'System information',
        example: {
          nodeVersion: 'v20.10.0',
          platform: 'linux',
          memoryUsageMB: 45,
          environment: 'production',
        },
      }),
    endpointStats: z
      .array(
        z.object({
          method: z.string(),
          route: z.string(),
          count: z.number(),
          statusCode: z.string(),
        })
      )
      .openapi({
        description: 'Statistics per endpoint',
        example: [
          { method: 'POST', route: '/mock', count: 150, statusCode: '200' },
          { method: 'GET', route: '/health', count: 100, statusCode: '200' },
        ],
      }),
    errorStats: z
      .array(
        z.object({
          statusCode: z.string(),
          count: z.number(),
          percentage: z.number(),
        })
      )
      .openapi({
        description: 'Error distribution by status code',
        example: [
          { statusCode: '400', count: 15, percentage: 68 },
          { statusCode: '500', count: 7, percentage: 32 },
        ],
      }),
  })
  .strict()
  .openapi({
    description: 'Application metrics and statistics',
  })
  .openapi('MetricsResponse');
