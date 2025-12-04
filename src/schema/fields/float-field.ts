import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const FloatFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('float').openapi({
    description: 'Field type identifier for floating point numbers',
    example: 'float',
  }),
  min: z.number().optional().openapi({
    description: 'Minimum value for the float',
    example: 0.0,
  }),
  max: z.number().optional().openapi({
    description: 'Maximum value for the float',
    example: 100.0,
  }),
  precision: z.number().int().min(0).max(10).optional().openapi({
    description: 'Number of decimal places (0-10, default: 2)',
    example: 2,
  }),
}).refine((data) => !data.min || !data.max || data.min <= data.max, {
  message: 'min must be less than or equal to max',
});

export type FloatFieldConfig = z.infer<typeof FloatFieldConfigSchema>;
