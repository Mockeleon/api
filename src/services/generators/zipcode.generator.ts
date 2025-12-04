import type { ZipCodeField } from '../../schema/fields/zipcode-field.js';

import type { IDataGenerator } from './generator.interface.js';

/** Generates 5-digit postal codes */
export class ZipCodeGenerator implements IDataGenerator<ZipCodeField> {
  canHandle(field: unknown): field is ZipCodeField {
    return (
      typeof field === 'object' &&
      field !== null &&
      'dataType' in field &&
      field.dataType === 'zipCode'
    );
  }

  generate(_field: ZipCodeField): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }
}
