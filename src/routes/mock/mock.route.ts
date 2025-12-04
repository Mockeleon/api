import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';

import { SchemaSchema } from '../../schema/index.js';
import type { MockeleonService } from '../../services/mockeleon.service.js';
import { ErrorResponseSchema } from '../../types/api-responses.js';

import {
  MockResponseSchema,
  MOCK_SUMMARY,
  MOCK_TAG,
  RequestBodySchema,
} from './mock.schema.js';
import type { MockRequest, MockResponse } from './mock.types.js';

const mockRoute = createRoute({
  method: 'post',
  path: '/mock',
  tags: [MOCK_TAG],
  summary: MOCK_SUMMARY,
  description: 'Generate mock data based on provided schema',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Mock data generated successfully',
      content: {
        'application/json': {
          schema: MockResponseSchema,
        },
      },
      headers: {
        'X-Request-ID': {
          schema: { type: 'string', format: 'uuid' },
          description: 'Unique request identifier for tracking',
        },
        'X-RateLimit-Limit': {
          schema: { type: 'integer' },
          description: 'Maximum requests allowed per window',
        },
        'X-RateLimit-Remaining': {
          schema: { type: 'integer' },
          description: 'Remaining requests in current window',
        },
        'X-RateLimit-Reset': {
          schema: { type: 'integer' },
          description: 'Unix timestamp when the rate limit window resets',
        },
      },
    },
    400: {
      description:
        'Bad Request - Invalid schema format, field limit exceeded, or item count limit exceeded',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
          examples: {
            invalidSchema: {
              summary: 'Invalid schema format',
              value: {
                status: 'error',
                message: 'Invalid schema format',
                errors: [
                  {
                    code: 'invalid_type',
                    expected: 'object',
                    received: 'string',
                    path: ['schema', 'field1'],
                    message: 'Expected object, received string',
                  },
                ],
              },
            },
            fieldLimitExceeded: {
              summary: 'Schema field limit exceeded',
              value: {
                status: 'error',
                message:
                  'Schema has 201 fields, which exceeds the maximum allowed limit of 200 fields',
              },
            },
            itemLimitExceeded: {
              summary: 'Total items limit exceeded',
              value: {
                status: 'error',
                message:
                  'Schema would generate 15000 total items (15000 items per request × 1 requests), which exceeds the maximum allowed limit of 10000 items',
              },
            },
          },
        },
      },
      headers: {
        'X-Request-ID': {
          schema: { type: 'string', format: 'uuid' },
          description: 'Unique request identifier for tracking',
        },
      },
    },
    429: {
      description:
        'Too Many Requests - Rate limit exceeded (100 requests per minute)',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
          example: {
            status: 'error',
            message: 'Too many requests, please try again later',
          },
        },
      },
      headers: {
        'X-Request-ID': {
          schema: { type: 'string', format: 'uuid' },
          description: 'Unique request identifier for tracking',
        },
        'Retry-After': {
          schema: { type: 'integer' },
          description: 'Number of seconds to wait before retrying',
        },
        'X-RateLimit-Limit': {
          schema: { type: 'integer' },
          description: 'Maximum requests allowed per window',
        },
        'X-RateLimit-Remaining': {
          schema: { type: 'integer' },
          description: 'Remaining requests (will be 0)',
        },
        'X-RateLimit-Reset': {
          schema: { type: 'integer' },
          description: 'Unix timestamp when the rate limit window resets',
        },
      },
    },
    500: {
      description: 'Internal Server Error - An unexpected error occurred',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
          example: {
            status: 'error',
            message: 'Internal server error',
            errorId: '550e8400-e29b-41d4-a716-446655440000',
          },
        },
      },
      headers: {
        'X-Request-ID': {
          schema: { type: 'string', format: 'uuid' },
          description: 'Unique request identifier for tracking',
        },
      },
    },
  },
});

export function registerMockRoutes(
  app: OpenAPIHono,
  mockeleonService: MockeleonService
) {
  app.openapi(mockRoute, (c) => {
    const body: MockRequest = c.req.valid('json');

    // Runtime validation with proper recursive schema
    const parseResult = SchemaSchema.safeParse(body.schema);
    if (!parseResult.success) {
      return c.json(
        {
          status: 'error' as const,
          message: 'Invalid schema format',
          errors: parseResult.error.issues,
        },
        400
      );
    }

    try {
      const data: MockResponse = mockeleonService.generate(
        parseResult.data,
        body.count ?? 1
      );
      return c.json(data, 200);
    } catch (error) {
      // Handle validation limit errors
      if (error instanceof Error) {
        return c.json(
          {
            status: 'error' as const,
            message: error.message,
          },
          400
        );
      }
      throw error;
    }
  });
}
