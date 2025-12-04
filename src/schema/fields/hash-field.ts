import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const HashFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('hash').openapi({
    description: 'Field type identifier for hash values',
    example: 'hash',
  }),
  algorithm: z
    .enum(['md5', 'sha1', 'sha256', 'sha512'])
    .optional()
    .default('sha256')
    .openapi({
      description: 'Hash algorithm to use',
      example: 'sha256',
    }),
});

export type HashFieldConfig = z.infer<typeof HashFieldConfigSchema>;
