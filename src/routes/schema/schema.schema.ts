import { z } from '@hono/zod-openapi';

export const SCHEMA_TAG = 'Schema';
export const SCHEMA_SUMMARY = 'Get API field types schema';

// Response schema for the API schema endpoint
export const APISchemaResponseSchema = z
  .object({
    version: z.string().openapi({
      description: 'Schema version',
      example: '1.0.0',
    }),
    generatedAt: z.string().openapi({
      description: 'Timestamp when the schema was generated',
      example: '2025-01-01T12:00:00.000Z',
    }),
    baseParameters: z.record(z.string(), z.unknown()).openapi({
      description: 'Base parameters applicable to all field types',
    }),
    fields: z.record(z.string(), z.unknown()).openapi({
      description: 'Available field types and their configurations',
    }),
  })
  .strict()
  .openapi({
    description:
      'Complete API schema with all available field types and their parameters',
  })
  .openapi('APISchemaResponse');
