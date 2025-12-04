import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const PriceFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('price').openapi({
    description: 'Field type identifier for prices',
    example: 'price',
  }),
  min: z.number().optional().default(0).openapi({
    description: 'Minimum price value',
    example: 0,
  }),
  max: z.number().optional().default(10000).openapi({
    description: 'Maximum price value',
    example: 10000,
  }),
  currency: z.string().optional().default('$').openapi({
    description: 'Currency symbol or code to append',
    example: '$',
  }),
});

export type PriceFieldConfig = z.infer<typeof PriceFieldConfigSchema>;
