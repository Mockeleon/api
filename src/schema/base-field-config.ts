import { z } from '@hono/zod-openapi';

import { DataTypeSchema } from './data-types.js';

export const BaseFieldConfigSchema = z.object({
  dataType: DataTypeSchema.openapi({
    description: 'Type of data field to generate',
    example: 'string',
  }),
  nullable: z.boolean().optional().openapi({
    description: 'Whether this field can generate null values',
    example: true,
  }),
  nullableRate: z.number().min(0).max(1).optional().openapi({
    description:
      'Probability (0-1) of generating null values when nullable is true',
    example: 0.2,
  }),
});

export type BaseFieldConfig = z.infer<typeof BaseFieldConfigSchema>;
