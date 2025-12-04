import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';
import { LanguageCodeSchema } from '../data-types.js';

export const UsernameFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('username').openapi({
    description: 'Field type identifier for usernames',
    example: 'username',
  }),
  lang: LanguageCodeSchema.optional().openapi({
    description:
      'Language code for username word generation (tr or en). Used for random username generation when basedOn is not specified.',
    example: 'en',
  }),
  basedOn: z.string().optional().openapi({
    description:
      'Optional field name to base the username on. If specified, will use the value from that field to generate the username (e.g., if basedOn="name" and name is "John Smith", username could be "jsmith" or "john_smith")',
    example: 'name',
  }),
});

export type UsernameFieldConfig = z.infer<typeof UsernameFieldConfigSchema>;
