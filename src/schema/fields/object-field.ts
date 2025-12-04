import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

// Object field: nested schema with fields
export const ObjectFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('object').openapi({
    description: 'Field type identifier for nested object structures',
    example: 'object',
  }),
  fields: z.record(z.string(), z.any()).openapi({
    description:
      'Nested field definitions for the object (key-value pairs where values are field schemas)',
  }), // Will be properly typed in field-config.ts
});

export type ObjectFieldConfig = z.infer<typeof ObjectFieldConfigSchema>;
