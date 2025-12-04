import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const BooleanFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('boolean').openapi({
    description: 'Field type identifier for boolean values',
    example: 'boolean',
  }),
});

export type BooleanFieldConfig = z.infer<typeof BooleanFieldConfigSchema>;
