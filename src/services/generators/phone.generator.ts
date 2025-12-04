import type { FieldConfig, PhoneFieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates phone numbers in standard international format */
export class PhoneGenerator implements IDataGenerator<PhoneFieldConfig> {
  canHandle(config: FieldConfig): config is PhoneFieldConfig {
    return config.dataType === 'phone';
  }

  generate(
    config: PhoneFieldConfig,
    _context?: GeneratorContext
  ): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) {
        return null;
      }
    }

    const countryCode = this.randomDigits(1, 3);
    const areaCode = this.randomDigits(3);
    const prefix = this.randomDigits(3);
    const lineNumber = this.randomDigits(4);

    return `+${countryCode}-${areaCode}-${prefix}-${lineNumber}`;
  }

  private randomDigits(length: number, max?: number): string {
    if (max) {
      // Generate a number between 1 and max
      const num = Math.floor(Math.random() * max) + 1;
      return num.toString();
    }

    // Generate random digits of specified length
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }
}
