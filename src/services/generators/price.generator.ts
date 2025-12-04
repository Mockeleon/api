import type { FieldConfig, PriceFieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE, DEFAULT_PRICE_PRECISION } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates price values with currency symbols */
export class PriceGenerator implements IDataGenerator<PriceFieldConfig> {
  canHandle(config: FieldConfig): config is PriceFieldConfig {
    return config.dataType === 'price';
  }

  generate(
    config: PriceFieldConfig,
    _context?: GeneratorContext
  ): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    const min = config.min ?? 0;
    const max = config.max ?? 10000;
    const currency = config.currency ?? '$';

    const price = (Math.random() * (max - min) + min).toFixed(
      DEFAULT_PRICE_PRECISION
    );
    return `${price}${currency}`;
  }
}
