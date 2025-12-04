import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const IpFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('ip').openapi({
    description: 'Field type identifier for IP addresses',
    example: 'ip',
  }),
  version: z.enum(['v4', 'v6']).optional().default('v4').openapi({
    description: 'IP version: v4 or v6',
    example: 'v4',
  }),
});

export type IpFieldConfig = z.infer<typeof IpFieldConfigSchema>;
