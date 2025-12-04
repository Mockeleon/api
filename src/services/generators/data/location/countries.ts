import type { Continent } from './continents.js';

export interface Country {
  name: string;
  code: string;
  continent: Continent;
}

export const countries: Country[] = [
  // Europe
  { name: 'Germany', code: 'DE', continent: 'europe' },
  { name: 'France', code: 'FR', continent: 'europe' },
  { name: 'Italy', code: 'IT', continent: 'europe' },
  { name: 'Spain', code: 'ES', continent: 'europe' },
  { name: 'United Kingdom', code: 'GB', continent: 'europe' },
  { name: 'Netherlands', code: 'NL', continent: 'europe' },
  { name: 'Belgium', code: 'BE', continent: 'europe' },
  { name: 'Switzerland', code: 'CH', continent: 'europe' },
  { name: 'Austria', code: 'AT', continent: 'europe' },
  { name: 'Poland', code: 'PL', continent: 'europe' },
  { name: 'Turkey', code: 'TR', continent: 'europe' },

  // Asia
  { name: 'China', code: 'CN', continent: 'asia' },
  { name: 'Japan', code: 'JP', continent: 'asia' },
  { name: 'India', code: 'IN', continent: 'asia' },
  { name: 'South Korea', code: 'KR', continent: 'asia' },
  { name: 'Thailand', code: 'TH', continent: 'asia' },
  { name: 'Vietnam', code: 'VN', continent: 'asia' },
  { name: 'Singapore', code: 'SG', continent: 'asia' },
  { name: 'Malaysia', code: 'MY', continent: 'asia' },
  { name: 'Indonesia', code: 'ID', continent: 'asia' },
  { name: 'United Arab Emirates', code: 'AE', continent: 'asia' },

  // North America
  { name: 'United States', code: 'US', continent: 'north-america' },
  { name: 'Canada', code: 'CA', continent: 'north-america' },
  { name: 'Mexico', code: 'MX', continent: 'north-america' },

  // South America
  { name: 'Brazil', code: 'BR', continent: 'south-america' },
  { name: 'Argentina', code: 'AR', continent: 'south-america' },
  { name: 'Chile', code: 'CL', continent: 'south-america' },
  { name: 'Colombia', code: 'CO', continent: 'south-america' },
  { name: 'Peru', code: 'PE', continent: 'south-america' },

  // Africa
  { name: 'Egypt', code: 'EG', continent: 'africa' },
  { name: 'Nigeria', code: 'NG', continent: 'africa' },
  { name: 'South Africa', code: 'ZA', continent: 'africa' },
  { name: 'Kenya', code: 'KE', continent: 'africa' },
  { name: 'Morocco', code: 'MA', continent: 'africa' },

  // Oceania
  { name: 'Australia', code: 'AU', continent: 'oceania' },
  { name: 'New Zealand', code: 'NZ', continent: 'oceania' },
];

// Helper map for quick country lookup by code
export const countryByCode = new Map(
  countries.map((c) => [c.code.toLowerCase(), c])
);

// Helper function to get countries by continent
export function getCountriesByContinent(continent: Continent): Country[] {
  return countries.filter((c) => c.continent === continent);
}

// Helper function to get countries by multiple continents
export function getCountriesByContinents(continents: Continent[]): Country[] {
  return countries.filter((c) => continents.includes(c.continent));
}
