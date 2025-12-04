import { z } from '@hono/zod-openapi';

import { BaseFieldConfigSchema } from '../base-field-config.js';
import { LanguageCodeSchema } from '../data-types.js';

/**
 * Product Category Enum
 */
export const ProductCategorySchema = z.enum([
  'electronics',
  'clothing',
  'books',
  'home',
  'sports',
  'toys',
  'food',
  'beauty',
  'automotive',
  'garden',
]);

export type ProductCategory = z.infer<typeof ProductCategorySchema>;

/**
 * Product Field Configuration Schema
 *
 * Generates realistic product names from various categories.
 * Each category contains at least 25 products in both English and Turkish.
 *
 * Categories:
 * - electronics: Tech gadgets, accessories, smart devices
 * - clothing: Apparel, footwear, accessories
 * - books: Various book genres and types
 * - home: Kitchen appliances, furniture, decor
 * - sports: Fitness equipment, sports gear
 * - toys: Children's toys, games, educational items
 * - food: Groceries, snacks, beverages
 * - beauty: Skincare, cosmetics, personal care
 * - automotive: Car accessories, maintenance items
 * - garden: Gardening tools, outdoor items
 *
 * @example All categories
 * ```json
 * {
 *   "dataType": "product",
 *   "lang": "en"
 * }
 * // Output: "Wireless Headphones" (random from all categories)
 * ```
 *
 * @example Specific category
 * ```json
 * {
 *   "dataType": "product",
 *   "categories": ["electronics"],
 *   "lang": "en"
 * }
 * // Output: "Smart Watch"
 * ```
 *
 * @example Multiple categories
 * ```json
 * {
 *   "dataType": "product",
 *   "categories": ["electronics", "clothing"],
 *   "lang": "en"
 * }
 * // Output: "Wireless Headphones" or "T-Shirt"
 * ```
 */
export const ProductFieldSchema = BaseFieldConfigSchema.extend({
  dataType: z.literal('product').openapi({
    description: 'Product name generator',
    example: 'product',
  }),
  categories: z
    .array(ProductCategorySchema)
    .optional()
    .openapi({
      description:
        'Product categories to select from. If not specified, products from all categories are available.',
      example: ['electronics', 'clothing'],
    }),
  lang: LanguageCodeSchema.optional().openapi({
    description:
      'Language for product names (en, tr, or any for random). Defaults to en.',
    example: 'en',
  }),
}).openapi('ProductField');

export type ProductField = z.infer<typeof ProductFieldSchema>;
