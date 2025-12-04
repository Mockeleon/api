import type { DateFieldConfig, FieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates dates in ISO or timestamp format */
export class DateGenerator implements IDataGenerator<DateFieldConfig> {
  canHandle(config: FieldConfig): config is DateFieldConfig {
    return config.dataType === 'date';
  }

  generate(
    config: DateFieldConfig,
    _context?: GeneratorContext
  ): string | number | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    const now = Date.now();
    const fiveYearsAgo = now - 5 * 365 * 24 * 60 * 60 * 1000;
    const randomTime =
      Math.floor(Math.random() * (now - fiveYearsAgo)) + fiveYearsAgo;

    const format = config.format ?? 'iso';
    return format === 'timestamp'
      ? randomTime
      : new Date(randomTime).toISOString();
  }
}
