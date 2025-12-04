import type { CityField } from '../../schema/fields/city-field.js';

import {
  cities,
  getCitiesByContinents,
  getCitiesByCountryCodes,
} from './data/location/cities.js';
import { countryByCode } from './data/location/countries.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';

/** Generates city names with country and continent filtering */
export class CityGenerator implements IDataGenerator<CityField> {
  canHandle(field: unknown): field is CityField {
    return (
      typeof field === 'object' &&
      field !== null &&
      'dataType' in field &&
      field.dataType === 'city'
    );
  }

  generate(field: CityField, context?: GeneratorContext): string {
    let filteredCities = cities;

    // Check if basedOn country field exists in context
    if (
      field.basedOn &&
      context &&
      typeof context[field.basedOn] === 'string'
    ) {
      const countryName = context[field.basedOn] as string;

      // Find country code from country name (fuzzy match for better compatibility)
      const country = Array.from(countryByCode.values()).find((c) => {
        const cNameLower = c.name.toLowerCase();
        const searchLower = countryName.toLowerCase();
        // Exact match or partial match
        return (
          cNameLower === searchLower ||
          cNameLower.includes(searchLower) ||
          searchLower.includes(cNameLower)
        );
      });

      if (country) {
        filteredCities = getCitiesByCountryCodes([country.code]);
      }
    } else if (field.continents && field.continents.length > 0) {
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
      throw new Error('No cities found matching the provided filters');
    }

    return randomCity.name;
  }
}
