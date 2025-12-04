import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';
import { LanguageCodeSchema } from '../data-types.js';

export const FileNameFieldSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('fileName').openapi({
    description: 'Field type identifier for file names',
    example: 'fileName',
  }),
  lang: LanguageCodeSchema.optional().openapi({
    description:
      'Language code for filename word generation (tr or en). Turkish filenames will have normalized characters (ç→c, ş→s, etc.)',
    example: 'en',
  }),
  extension: z.string().optional().openapi({
    description:
      'File extension (without dot). If not provided, random extension will be used',
    example: 'pdf',
  }),
  extensions: z
    .array(z.string())
    .optional()
    .openapi({
      description:
        'Array of file extensions to randomly choose from. Overrides extension field if provided',
      example: ['mp4', 'doc', 'ppt'],
    }),
  basedOn: z.string().optional().openapi({
    description: 'Field name to base the filename on (uses string field value)',
    example: 'title',
  }),
});

export type FileNameField = z.infer<typeof FileNameFieldSchema>;
