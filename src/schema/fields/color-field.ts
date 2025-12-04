import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const ColorFieldSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('color').openapi({
    description: 'Field type identifier for color values',
    example: 'color',
  }),
  format: z.enum(['hex', 'rgb', 'hsl']).optional().default('hex').openapi({
    description: 'Color format (hex, rgb, or hsl)',
    example: 'hex',
  }),
});

export type ColorField = z.infer<typeof ColorFieldSchema>;
