import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const UrlFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('url').openapi({
    description: 'Field type identifier for URLs',
    example: 'url',
  }),
  platform: z
    .enum([
      'x',
      'twitter',
      'discord',
      'telegram',
      'github',
      'linkedin',
      'instagram',
      'facebook',
      'youtube',
      'twitch',
      'tiktok',
      'snapchat',
      'reddit',
      'pinterest',
      'medium',
      'stackoverflow',
      'behance',
      'dribbble',
      'devto',
      'hashnode',
      'codepen',
      'steam',
      'xbox',
      'playstation',
      'epicgames',
      'spotify',
      'soundcloud',
      'vimeo',
      'patreon',
    ])
    .optional()
    .openapi({
      description:
        'Optional social media or service platform. If specified, generates platform-specific URL',
      example: 'github',
    }),
  basedOn: z.string().optional().openapi({
    description: 'Optional field name to base the URL path/username on',
    example: 'name',
  }),
});

export type UrlFieldConfig = z.infer<typeof UrlFieldConfigSchema>;
