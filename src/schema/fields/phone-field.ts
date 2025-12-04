import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const PhoneFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('phone').openapi({
    description: 'Field type identifier for phone numbers',
    example: 'phone',
  }),
});

export type PhoneFieldConfig = z.infer<typeof PhoneFieldConfigSchema>;
