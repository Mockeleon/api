import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';
import { GenderSchema, LanguageCodeSchema } from '../data-types.js';

export const NameFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('name').openapi({
    description: 'Field type identifier for person names',
    example: 'name',
  }),
  lang: LanguageCodeSchema.optional().openapi({
    description: 'Language code for name generation (tr or en)',
    example: 'en',
  }),
  format: z.enum(['first', 'last', 'full']).optional().openapi({
    description:
      'Name format: first (given name only), last (surname only), or full (complete name)',
    example: 'full',
  }),
  gender: GenderSchema.optional().openapi({
    description: 'Gender for name selection (male, female, or random)',
    example: 'male',
  }),
  tripleNameRate: z.number().min(0).max(1).optional().openapi({
    description:
      'Probability (0-1) of generating three-part names instead of two-part names (only applicable when format is "full")',
    example: 0.3,
  }),
}).refine(
  (data) =>
    data.tripleNameRate === undefined ||
    data.format === undefined ||
    data.format === 'full',
  {
    message:
      'tripleNameRate can only be used when format is "full" or undefined',
    path: ['tripleNameRate'],
  }
);

export type NameFieldConfig = z.infer<typeof NameFieldConfigSchema>;
