import { z } from '@hono/zod-openapi';

import { continents } from '../../services/generators/data/location/continents.js';
import { countries } from '../../services/generators/data/location/countries.js';
import { BaseFieldConfigSchema } from '../base-field-config.js';

// Extract country codes for validation
const countryCodes = countries.map((c) => c.code) as [string, ...string[]];

export const LocationFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('location').openapi({
    description: 'Field type identifier for geographic locations',
    example: 'location',
  }),
  continents: z
    .array(z.enum(continents))
    .optional()
    .openapi({
      description: 'Filter locations by continent codes',
      example: ['europe', 'asia'],
    }),
  countries: z
    .array(z.enum(countryCodes))
    .optional()
    .openapi({
      description: 'Filter locations by country codes',
      example: ['TR', 'US'],
    }),
}).refine(
  (data) => {
    // Cannot have both continents and countries
    return !(data.continents && data.countries);
  },
  {
    message: 'Cannot filter by both continents and countries. Choose one.',
  }
);

export type LocationFieldConfig = z.infer<typeof LocationFieldConfigSchema>;
