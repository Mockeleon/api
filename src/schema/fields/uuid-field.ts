import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const UuidFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('uuid').openapi({
    description: 'Field type identifier for UUID (v4)',
    example: 'uuid',
  }),
});

export type UuidFieldConfig = z.infer<typeof UuidFieldConfigSchema>;
