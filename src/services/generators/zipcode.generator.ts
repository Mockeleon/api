import type { ZipCodeFieldConfig } from '../../schema/fields/zipcode-field.js';
import type { FieldConfig } from '../../schema/index.js';

import type { IDataGenerator } from './generator.interface.js';

/** Generates 5-digit postal codes */
export class ZipCodeGenerator implements IDataGenerator<ZipCodeFieldConfig> {
  canHandle(config: FieldConfig): config is ZipCodeFieldConfig {
    return config.dataType === 'zipCode';
  }

  generate(_field: ZipCodeFieldConfig): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }
}
