import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const ZipCodeFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('zipCode').openapi({
    description: 'Field type identifier for zip codes',
    example: 'zipCode',
  }),
});

export type ZipCodeFieldConfig = z.infer<typeof ZipCodeFieldConfigSchema>;
