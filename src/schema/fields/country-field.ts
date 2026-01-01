import { z } from '@hono/zod-openapi';

import { continents } from '../../services/generators/data/location/continents.js';
import { BaseFieldConfigSchema } from '../base-field-config.js';

export const CountryFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('country').openapi({
    description: 'Field type identifier for country names',
    example: 'country',
  }),
  continents: z
    .array(z.enum(continents))
    .optional()
    .openapi({
      description: 'Filter countries by continent codes',
      example: ['europe', 'asia'],
    }),
  basedOn: z.string().optional().openapi({
    description: 'Reference to another field to derive country from',
    example: 'location',
  }),
});

export type CountryFieldConfig = z.infer<typeof CountryFieldConfigSchema>;
