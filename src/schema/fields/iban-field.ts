import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const IbanFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('iban').openapi({
    description: 'Field type identifier for IBAN numbers',
    example: 'iban',
  }),
});

export type IbanFieldConfig = z.infer<typeof IbanFieldConfigSchema>;
