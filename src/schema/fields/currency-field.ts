import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const CurrencyFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('currency').openapi({
    description: 'Field type identifier for currency codes',
    example: 'currency',
  }),
});

export type CurrencyFieldConfig = z.infer<typeof CurrencyFieldConfigSchema>;
