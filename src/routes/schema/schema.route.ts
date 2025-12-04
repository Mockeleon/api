import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';

export const schemaRoute = createRoute({
  method: 'get',
  path: '/schema',
  tags: ['Schema'],
  summary: 'Get schema metadata',
  description:
    'Returns comprehensive metadata about all available field types, their parameters, and usage examples. This endpoint is designed for building dynamic UIs and playgrounds.',
  responses: {
    200: {
      description: 'Schema metadata for all field types',
      content: {
        'application/json': {
          schema: z.object({
            fields: z.record(
              z.string(),
              z.object({
                dataType: z.string(),
                description: z.string(),
                parameters: z.record(z.string(), z.any()),
                validation: z
                  .object({
                    rules: z.array(z.string()),
                  })
                  .optional(),
              })
            ),
          }),
        },
      },
    },
  },
});
