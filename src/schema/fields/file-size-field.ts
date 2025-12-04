import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

export const FileSizeFieldSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('fileSize').openapi({
    description: 'Field type identifier for file size values',
    example: 'fileSize',
  }),
  min: z.number().positive().optional().default(1).openapi({
    description: 'Minimum file size in bytes',
    example: 1024,
  }),
  max: z.number().positive().optional().default(10485760).openapi({
    description: 'Maximum file size in bytes (default: 10MB)',
    example: 5242880,
  }),
  unit: z
    .enum(['B', 'KB', 'MB', 'GB'])
    .optional()
    .default('MB')
    .openapi({
      description: 'Display unit for file size',
      example: 'MB',
    }),
}).refine(
  (data) => {
    return data.min <= data.max;
  },
  {
    message: 'min must be less than or equal to max',
  }
);

export type FileSizeField = z.infer<typeof FileSizeFieldSchema>;
