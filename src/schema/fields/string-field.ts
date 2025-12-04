import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';
import { LanguageCodeSchema, StringKindSchema } from '../data-types.js';

export const StringFieldConfigSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('string').openapi({
    description: 'Field type identifier for string/text values',
    example: 'string',
  }),
  kind: StringKindSchema.openapi({
    description:
      'Type of string to generate: word (single word), sentence (multiple words), or paragraph (multiple sentences)',
    example: 'sentence',
  }),
  lang: LanguageCodeSchema.optional().openapi({
    description: 'Language code for generated text (tr or en)',
    example: 'en',
  }),
  min: z.number().int().positive().optional().openapi({
    description:
      'Minimum length - for word: word count, for sentence: word count, for paragraph: word count per paragraph',
    example: 5,
  }),
  max: z.number().int().positive().optional().openapi({
    description:
      'Maximum length - for word: word count, for sentence: word count, for paragraph: word count per paragraph',
    example: 10,
  }),
  paragraphs: z.number().int().positive().optional().openapi({
    description:
      'Number of paragraphs to generate (only applicable when kind is "paragraph")',
    example: 3,
  }),
})
  .refine(
    (data) =>
      data.min === undefined || data.max === undefined || data.min <= data.max,
    {
      message: 'min must be less than or equal to max',
      path: ['min'],
    }
  )
  .refine((data) => data.kind !== 'word' || data.paragraphs === undefined, {
    message: 'paragraphs field is not applicable when kind is "word"',
    path: ['paragraphs'],
  })
  .refine((data) => data.kind !== 'sentence' || data.paragraphs === undefined, {
    message: 'paragraphs field is not applicable when kind is "sentence"',
    path: ['paragraphs'],
  });

export type StringFieldConfig = z.infer<typeof StringFieldConfigSchema>;
