import type { FieldConfig, IbanFieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import { IBAN_COUNTRY_CODES } from './data/iban/countries.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates International Bank Account Numbers */
export class IbanGenerator implements IDataGenerator<IbanFieldConfig> {
  canHandle(config: FieldConfig): config is IbanFieldConfig {
    return config.dataType === 'iban';
  }

  generate(
    config: IbanFieldConfig,
    _context?: GeneratorContext
  ): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    const country =
      IBAN_COUNTRY_CODES[
        Math.floor(Math.random() * IBAN_COUNTRY_CODES.length)
      ]!;
    const checkDigits = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, '0');
    const accountNumber = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');

    return `${country}${checkDigits}${accountNumber}`;
  }
}
