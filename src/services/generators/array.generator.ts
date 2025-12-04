import type { ArrayFieldConfig, FieldConfig } from '../../schema/index.js';

import { DEFAULT_ARRAY_COUNT, DEFAULT_NULLABLE_RATE } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';
import { validateArrayData } from './utils/sanitization.js';


/** Generates arrays by repeating item generation or picking from predefined data */
export class ArrayGenerator implements IDataGenerator<ArrayFieldConfig> {
  private generateField: (
    config: FieldConfig,
    context?: GeneratorContext
  ) => unknown;

  constructor(
    generateFieldFn: (
      config: FieldConfig,
      context?: GeneratorContext
    ) => unknown
  ) {
    this.generateField = generateFieldFn;
  }

  canHandle(config: FieldConfig): config is ArrayFieldConfig {
    return config.dataType === 'array';
  }

  generate(
    config: ArrayFieldConfig,
    _context?: GeneratorContext
  ): unknown[] | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) {
        return null;
      }
    }

    if (config.data && config.pickCount) {
      validateArrayData(config.data);
      return this.pickRandomItems(config.data, config.pickCount);
    }

    const count = config.count ?? DEFAULT_ARRAY_COUNT;
    const result: unknown[] = [];

    for (let i = 0; i < count; i++) {
      result.push(this.generateField(config.item as FieldConfig));
    }

    return result;
  }

  private pickRandomItems(data: unknown[], pickCount: number): unknown[] {
    const actualPickCount = Math.min(pickCount, data.length);
    const availableItems = [...data];
    const result: unknown[] = [];

    for (let i = 0; i < actualPickCount; i++) {
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      result.push(availableItems[randomIndex]);
      availableItems.splice(randomIndex, 1);
    }

    return result;
  }
}
