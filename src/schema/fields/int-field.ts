import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const IntFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('int').openapi({
    description: 'Field type identifier for integer values',
    example: 'int',
  }),
  min: z.number().int().optional().openapi({
    description: 'Minimum value for the generated integer (inclusive)',
    example: 1,
  }),
  max: z.number().int().optional().openapi({
    description: 'Maximum value for the generated integer (inclusive)',
    example: 100,
  }),
}).refine(
  (data) =>
    data.min === undefined || data.max === undefined || data.min <= data.max,
  {
    message: 'min must be less than or equal to max',
    path: ['min'],
  }
);

export type IntFieldConfig = z.infer<typeof IntFieldConfigSchema>;
