import type { FieldConfig, IntFieldConfig } from '../../schema/index.js';

import { INT_DEFAULT_MAX, INT_DEFAULT_MIN } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';
import { shouldReturnNull } from './utils/nullable-helper.js';
import { randomInt } from './utils/random-helper.js';


/** Generates integer values within specified range */
export class IntGenerator implements IDataGenerator<IntFieldConfig> {
  canHandle(config: FieldConfig): config is IntFieldConfig {
    return config.dataType === 'int';
  }

  generate(config: IntFieldConfig, _context?: GeneratorContext): number | null {
    if (shouldReturnNull(config)) return null;

    const min = config.min ?? INT_DEFAULT_MIN;
    const max = config.max ?? INT_DEFAULT_MAX;

    return randomInt(min, max);
  }
}
