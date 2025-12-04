import type {
  FieldConfig,
  LanguageCode,
  ProductCategory,
} from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import { ALL_CATEGORIES, getRandomProduct } from './data/products/index.js';
import type { IDataGenerator } from './generator.interface.js';

export type ProductFieldConfig = FieldConfig & {
  dataType: 'product';
  categories?: ProductCategory[];
  lang?: LanguageCode;
  nullable?: boolean;
  nullableRate?: number;
};

/** Generates product names from various categories in English and Turkish */
export class ProductGenerator implements IDataGenerator<ProductFieldConfig> {
  canHandle(config: FieldConfig): config is ProductFieldConfig {
    return config.dataType === 'product';
  }

  generate(config: ProductFieldConfig): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) {
        return null;
      }
    }

    // Use provided categories or all categories
    const categories = config.categories ?? ALL_CATEGORIES;

    // Convert 'any' to undefined for random selection
    const lang = config.lang === 'any' ? undefined : config.lang;

    return getRandomProduct(categories, lang);
  }
}
