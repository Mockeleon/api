import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const EmailFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('email').openapi({
    description: 'Field type identifier for email addresses',
    example: 'email',
  }),
  domains: z
    .array(z.string())
    .optional()
    .openapi({
      description:
        'Optional list of domain names to use for email generation (e.g., ["example.com", "test.org"])',
      example: ['example.com', 'company.org'],
    }),
  basedOn: z.string().optional().openapi({
    description:
      'Optional field name to base the email username on. If specified, will use the value from that field to generate the email username (e.g., if basedOn="name" and name is "John Smith", email could be "john.smith@domain.com")',
    example: 'name',
  }),
});

export type EmailFieldConfig = z.infer<typeof EmailFieldConfigSchema>;
