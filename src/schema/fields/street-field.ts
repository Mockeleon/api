import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';
import { LanguageCodeSchema } from '../data-types.js';

/**
 * Street Field Configuration Schema
 *
 * Generates realistic street addresses with street names and numbers.
 * Supports English and Turkish street names.
 *
 * @example
 * ```json
 * {
 *   "dataType": "street",
 *   "lang": "en"
 * }
 * // Output: "123 Main Street"
 * ```
 */
export const StreetFieldSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('street').openapi({
    description: 'Street address generator',
    example: 'street',
  }),
  lang: LanguageCodeSchema.optional().openapi({
    description:
      'Language for street names (en, tr, or any for random). Defaults to random.',
    example: 'en',
  }),
}).openapi('StreetField');

export type StreetField = z.infer<typeof StreetFieldSchema>;
