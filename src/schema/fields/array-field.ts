import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';

// Array field: single item schema + count OR predefined data + pickCount
export const ArrayFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('array').openapi({
    description: 'Field type identifier for array/list values',
    example: 'array',
  }),
  item: z.any().optional().openapi({
    description:
      'Schema definition for each item in the array (can be any field type including nested objects). Required if data is not provided.',
  }), // Will be properly typed in field-config.ts
  count: z.number().int().positive().optional().openapi({
    description:
      'Number of items to generate in the array (when using item schema)',
    example: 5,
  }), // How many items in array
  data: z
    .array(z.any())
    .optional()
    .openapi({
      description:
        'Predefined array of values to randomly pick from. If provided, pickCount is required.',
      example: ['red', 'blue', 'green', 'yellow'],
    }),
  pickCount: z.number().int().positive().optional().openapi({
    description:
      'Number of items to randomly pick from the data array. Required when data is provided.',
    example: 2,
  }),
}).refine(
  (data) => {
    // Either item/count OR data/pickCount must be provided
    const hasItemSchema = data.item !== undefined;
    const hasDataArray = data.data !== undefined;

    // Must have one of the two approaches
    if (!hasItemSchema && !hasDataArray) return false;

    // Cannot have both
    if (hasItemSchema && hasDataArray) return false;

    // If data is provided, pickCount is required
    if (hasDataArray && !data.pickCount) return false;

    return true;
  },
  {
    message:
      'Array field must have either (item + optional count) OR (data + pickCount)',
  }
);

export type ArrayFieldConfig = z.infer<typeof ArrayFieldConfigSchema>;
