import { z } from 'zod';

import { continents } from '../../services/generators/data/location/continents.js';
import { countries } from '../../services/generators/data/location/countries.js';

// Extract country codes for validation
const countryCodes = countries.map((c) => c.code) as [string, ...string[]];

export const LocationFieldSchema = z
  .object({
    dataType: z.literal('location'),
    name: z.string(),
    continents: z.array(z.enum(continents)).optional(),
    countries: z.array(z.enum(countryCodes)).optional(),
  })
  .refine(
    (data) => {
      // Cannot have both continents and countries
      return !(data.continents && data.countries);
    },
    {
      message: 'Cannot filter by both continents and countries. Choose one.',
    }
  );

export type LocationField = z.infer<typeof LocationFieldSchema>;
