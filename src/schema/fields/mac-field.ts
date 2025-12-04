import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const MacFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('mac').openapi({
    description: 'Field type identifier for MAC addresses',
    example: 'mac',
  }),
});

export type MacFieldConfig = z.infer<typeof MacFieldConfigSchema>;
