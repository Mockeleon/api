import type { CurrencyFieldConfig, FieldConfig } from '../../schema/index.js';

import { CURRENCIES } from './data/currency/codes.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';
import { shouldReturnNull } from './utils/nullable-helper.js';
import { randomArrayItem } from './utils/random-helper.js';


/** Generates ISO currency codes */
export class CurrencyGenerator implements IDataGenerator<CurrencyFieldConfig> {
  canHandle(config: FieldConfig): config is CurrencyFieldConfig {
    return config.dataType === 'currency';
  }

  generate(
    config: CurrencyFieldConfig,
    _context?: GeneratorContext
  ): string | null {
    if (shouldReturnNull(config)) return null;

    return randomArrayItem(CURRENCIES);
  }
}
