import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const DateFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('date').openapi({
    description: 'Field type identifier for dates',
    example: 'date',
  }),
  format: z.enum(['timestamp', 'iso']).optional().default('iso').openapi({
    description:
      'Date format: timestamp (Unix timestamp in ms) or iso (ISO 8601 string)',
    example: 'iso',
  }),
});

export type DateFieldConfig = z.infer<typeof DateFieldConfigSchema>;
