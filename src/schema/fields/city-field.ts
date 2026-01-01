import { z } from '@hono/zod-openapi';

import { continents } from '../../services/generators/data/location/continents.js';
import { countries } from '../../services/generators/data/location/countries.js';
import { BaseFieldConfigSchema } from '../base-field-config.js';

// Extract country codes for validation
const countryCodes = countries.map((c) => c.code) as [string, ...string[]];

export const CityFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('city').openapi({
    description: 'Field type identifier for city names',
    example: 'city',
  }),
  continents: z
    .array(z.enum(continents))
    .optional()
    .openapi({
      description: 'Filter cities by continent codes',
      example: ['europe', 'asia'],
    }),
  countries: z
    .array(z.enum(countryCodes))
    .optional()
    .openapi({
      description: 'Filter cities by country codes',
      example: ['TR', 'US'],
    }),
  basedOn: z.string().optional().openapi({
    description: 'Reference to a country field to base city selection on',
    example: 'country',
  }),
})
  .refine(
    (data) => {
      // Cannot have both continents and countries
      return !(data.continents && data.countries);
    },
    {
      message: 'Cannot filter by both continents and countries. Choose one.',
    }
  )
  .refine(
    (data) => {
      // If basedOn is used, cannot have continents or countries filter
      if (data.basedOn) {
        return !data.continents && !data.countries;
      }
      return true;
    },
    {
      message:
        'When using basedOn for country relationship, cannot also specify continents or countries filters.',
    }
  );

export type CityFieldConfig = z.infer<typeof CityFieldConfigSchema>;
