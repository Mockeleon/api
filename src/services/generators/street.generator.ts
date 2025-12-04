import type { FieldConfig, LanguageCode } from '../../schema/index.js';

import { DEFAULT_NULLABLE_RATE } from './constants.js';
import { getStreetNames } from './data/location/streets/index.js';
import type { IDataGenerator } from './generator.interface.js';

export type StreetFieldConfig = FieldConfig & {
  dataType: 'street';
  lang?: LanguageCode;
  nullable?: boolean;
  nullableRate?: number;
};

/** Generates realistic street names in English and Turkish */
export class StreetGenerator implements IDataGenerator<StreetFieldConfig> {
  canHandle(config: FieldConfig): config is StreetFieldConfig {
    return config.dataType === 'street';
  }

  generate(config: StreetFieldConfig): string | null {
    if (config.nullable) {
      const rate = config.nullableRate ?? DEFAULT_NULLABLE_RATE;
      if (Math.random() < rate) {
        return null;
      }
    }

    // Convert 'any' to undefined for random selection
    const lang = config.lang === 'any' ? undefined : config.lang;
    const streetNames = getStreetNames(lang);
    const randomStreet =
      streetNames[Math.floor(Math.random() * streetNames.length)];

    if (!randomStreet) {
      throw new Error('No street names available');
    }

    // Add a random number between 1-999 to make it more realistic
    const streetNumber = Math.floor(Math.random() * 999) + 1;

    return `${streetNumber} ${randomStreet}`;
  }
}
