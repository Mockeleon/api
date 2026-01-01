import type { LocationFieldConfig } from '../../schema/fields/location-field.js';
import type { FieldConfig } from '../../schema/index.js';

import {
  cities,
  getCitiesByContinents,
  getCitiesByCountryCodes,
} from './data/location/cities.js';
import { countryByCode } from './data/location/countries.js';
import type { IDataGenerator } from './generator.interface.js';

/** Generates formatted location strings (City, Country) with filtering */
export class LocationGenerator implements IDataGenerator<LocationFieldConfig> {
  canHandle(config: FieldConfig): config is LocationFieldConfig {
    return config.dataType === 'location';
  }

  generate(field: LocationFieldConfig): string {
    let filteredCities = cities;

    if (field.continents && field.continents.length > 0) {
      filteredCities = getCitiesByContinents(field.continents);
    } else if (field.countries && field.countries.length > 0) {
      filteredCities = getCitiesByCountryCodes(field.countries);
    }

    if (filteredCities.length === 0) {
      throw new Error('No cities found matching the provided filters');
    }

    // Select random city from filtered list
    const randomCity =
      filteredCities[Math.floor(Math.random() * filteredCities.length)];
    if (!randomCity) {
      throw new Error('No city could be selected');
    }

    const country = countryByCode.get(randomCity.countryCode.toLowerCase());

    return `${randomCity.name}, ${country?.name || randomCity.countryCode}`;
  }
}
