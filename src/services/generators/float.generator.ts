import type { FieldConfig, FloatFieldConfig } from '../../schema/index.js';

import { DEFAULT_FLOAT_PRECISION } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';
import { shouldReturnNull } from './utils/nullable-helper.js';


const FLOAT_DEFAULT_MIN = 0;
const FLOAT_DEFAULT_MAX = 1000;

/** Generates floating point numbers with configurable precision */
export class FloatGenerator implements IDataGenerator<FloatFieldConfig> {
  canHandle(config: FieldConfig): config is FloatFieldConfig {
    return config.dataType === 'float';
  }

  generate(
    config: FloatFieldConfig,
    _context?: GeneratorContext
  ): number | null {
    if (shouldReturnNull(config)) return null;

    const min = config.min ?? FLOAT_DEFAULT_MIN;
    const max = config.max ?? FLOAT_DEFAULT_MAX;
    const precision = config.precision ?? DEFAULT_FLOAT_PRECISION;

    const random = Math.random() * (max - min) + min;

    const factor = Math.pow(10, precision);
    return Math.round(random * factor) / factor;
  }
}
