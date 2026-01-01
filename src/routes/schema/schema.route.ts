import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';

import { ErrorResponseSchema } from '../../types/api-responses.js';

import {
  APISchemaResponseSchema,
  SCHEMA_TAG,
  SCHEMA_SUMMARY,
} from './schema.schema.js';
import type { APISchemaResponse } from './schema.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemaRoute = createRoute({
  method: 'get',
  path: '/schema',
  tags: [SCHEMA_TAG],
  summary: SCHEMA_SUMMARY,
  description:
    'Returns the complete API schema including all field types, parameters, constraints, and examples. Used by frontend playground for auto-discovery.',
  responses: {
    200: {
      description: 'API schema retrieved successfully',
      content: {
        'application/json': {
          schema: APISchemaResponseSchema,
        },
      },
    },
    404: {
      description: 'Schema file not found - run npm run generate:schema',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
          example: {
            status: 'error',
            message:
              'API schema not found. Please run: npm run generate:schema',
          },
        },
      },
    },
    500: {
      description: 'Error reading schema file',
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
          example: {
            status: 'error',
            message: 'Error reading API schema file',
          },
        },
      },
    },
  },
});

export function registerSchemaRoutes(app: OpenAPIHono) {
  app.openapi(schemaRoute, (c) => {
    try {
      const schemaPath = join(__dirname, '../../../../public/schema.json');
      const schemaContent = readFileSync(schemaPath, 'utf-8');
      const schema: APISchemaResponse = JSON.parse(
        schemaContent
      ) as APISchemaResponse;

      return c.json(schema, 200);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return c.json(
          {
            status: 'error' as const,
            message:
              'API schema not found. Please run: npm run generate:schema',
          },
          404
        );
      }

      return c.json(
        {
          status: 'error' as const,
          message: 'Error reading API schema file',
        },
        500
      );
    }
  });
}
