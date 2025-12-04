import { z } from 'zod';

import { continents } from '../../services/generators/data/location/continents.js';
import { countries } from '../../services/generators/data/location/countries.js';

// Extract country codes for validation
const countryCodes = countries.map((c) => c.code) as [string, ...string[]];

export const CityFieldSchema = z
  .object({
    dataType: z.literal('city'),
    name: z.string().optional(),
    continents: z.array(z.enum(continents)).optional(),
    countries: z.array(z.enum(countryCodes)).optional(),
    basedOn: z.string().optional(),
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

export type CityField = z.infer<typeof CityFieldSchema>;
