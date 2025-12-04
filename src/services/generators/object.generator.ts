import type { FieldConfig, ObjectFieldConfig } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';


/** Generates nested objects by recursively processing field configurations */
export class ObjectGenerator implements IDataGenerator<ObjectFieldConfig> {
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

  canHandle(config: FieldConfig): config is ObjectFieldConfig {
    return config.dataType === 'object';
  }

  generate(
    config: ObjectFieldConfig,
    context?: GeneratorContext
  ): Record<string, unknown> | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) {
        return null;
      }
    }

    const result: Record<string, unknown> = {};

    // Merge parent context with current result so nested fields can access parent fields
    for (const [key, fieldConfig] of Object.entries(config.fields)) {
      const mergedContext = { ...context, ...result };
      result[key] = this.generateField(
        fieldConfig as FieldConfig,
        mergedContext
      );
    }

    return result;
  }
}
