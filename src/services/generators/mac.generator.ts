import type { FieldConfig, MacFieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates MAC addresses in standard format */
export class MacGenerator implements IDataGenerator<MacFieldConfig> {
  canHandle(config: FieldConfig): config is MacFieldConfig {
    return config.dataType === 'mac';
  }

  generate(config: MacFieldConfig, _context?: GeneratorContext): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) return null;
    }

    return Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
    ).join(':');
  }
}
