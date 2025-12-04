import type { BooleanFieldConfig, FieldConfig } from '../../schema/index.js';

import { BOOLEAN_RANDOM_THRESHOLD } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';
import { shouldReturnNull } from './utils/nullable-helper.js';


/** Generates random boolean values */
export class BooleanGenerator implements IDataGenerator<BooleanFieldConfig> {
  canHandle(config: FieldConfig): config is BooleanFieldConfig {
    return config.dataType === 'boolean';
  }

  generate(
    config: BooleanFieldConfig,
    _context?: GeneratorContext
  ): boolean | null {
    if (shouldReturnNull(config)) return null;

    return Math.random() < BOOLEAN_RANDOM_THRESHOLD;
  }
}
