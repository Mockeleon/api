import type { CountryField } from '../../schema/fields/country-field.js';

import { cities } from './data/location/cities.js';
import { countries, countryByCode } from './data/location/countries.js';
import type { GeneratorContext, IDataGenerator } from './generator.interface.js';

/** Generates country names with continent filtering and city-based lookup */
export class CountryGenerator implements IDataGenerator<CountryField> {
  canHandle(field: unknown): field is CountryField {
    return (
      typeof field === 'object' &&
      field !== null &&
      'dataType' in field &&
      field.dataType === 'country'
    );
  }

  generate(field: CountryField, context?: GeneratorContext): string {
    // If basedOn is specified, find country from city
    if (
      field.basedOn &&
      context &&
      typeof context[field.basedOn] === 'string'
    ) {
      const cityName = context[field.basedOn] as string;

      // Find the city in our database (exact match or normalized match)
      const city = cities.find((c) => {
        // Try exact match first
        if (c.name === cityName) return true;

        // Try case-insensitive exact match
        if (c.name.toLowerCase() === cityName.toLowerCase()) return true;

        return false;
      });

      if (city) {
        const country = countryByCode.get(city.countryCode.toLowerCase());
        if (country) {
          return country.name;
        }
      }
    }

    let filteredCountries = countries;

    if (field.continents && field.continents.length > 0) {
      filteredCountries = countries.filter((country) =>
        field.continents!.includes(country.continent)
      );
    }

    const randomCountry =
      filteredCountries[Math.floor(Math.random() * filteredCountries.length)];

    if (!randomCountry) {
      throw new Error('No countries found matching the provided filters');
    }

    return randomCountry.name;
  }
}
