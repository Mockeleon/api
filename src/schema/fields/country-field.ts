import { z } from 'zod';

import { continents } from '../../services/generators/data/location/continents.js';

export const CountryFieldSchema = z.object({
  dataType: z.literal('country'),
  name: z.string().optional(),
  continents: z.array(z.enum(continents)).optional(),
  basedOn: z.string().optional(),
});

export type CountryField = z.infer<typeof CountryFieldSchema>;
