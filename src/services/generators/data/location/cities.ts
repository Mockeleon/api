import type { Continent } from './continents.js';
import { countryByCode } from './countries.js';

export interface City {
  name: string;
  countryCode: string;
  population: number;
}

export const cities: City[] = [
  // Germany (DE)
  { name: 'Berlin', countryCode: 'DE', population: 3_600_000 },
  { name: 'Munich', countryCode: 'DE', population: 1_500_000 },
  { name: 'Hamburg', countryCode: 'DE', population: 1_800_000 },
  { name: 'Frankfurt', countryCode: 'DE', population: 750_000 },
  { name: 'Cologne', countryCode: 'DE', population: 1_000_000 },

  // France (FR)
  { name: 'Paris', countryCode: 'FR', population: 2_200_000 },
  { name: 'Lyon', countryCode: 'FR', population: 500_000 },
  { name: 'Marseille', countryCode: 'FR', population: 870_000 },
  { name: 'Toulouse', countryCode: 'FR', population: 480_000 },
  { name: 'Nice', countryCode: 'FR', population: 340_000 },

  // Italy (IT)
  { name: 'Rome', countryCode: 'IT', population: 2_800_000 },
  { name: 'Milan', countryCode: 'IT', population: 1_400_000 },
  { name: 'Naples', countryCode: 'IT', population: 960_000 },
  { name: 'Turin', countryCode: 'IT', population: 870_000 },
  { name: 'Florence', countryCode: 'IT', population: 380_000 },

  // Spain (ES)
  { name: 'Madrid', countryCode: 'ES', population: 3_200_000 },
  { name: 'Barcelona', countryCode: 'ES', population: 1_600_000 },
  { name: 'Valencia', countryCode: 'ES', population: 800_000 },
  { name: 'Seville', countryCode: 'ES', population: 690_000 },
  { name: 'Bilbao', countryCode: 'ES', population: 350_000 },

  // UK (GB)
  { name: 'London', countryCode: 'GB', population: 9_000_000 },
  { name: 'Manchester', countryCode: 'GB', population: 550_000 },
  { name: 'Birmingham', countryCode: 'GB', population: 1_100_000 },
  { name: 'Edinburgh', countryCode: 'GB', population: 530_000 },
  { name: 'Glasgow', countryCode: 'GB', population: 630_000 },

  // Turkey (TR)
  { name: 'Istanbul', countryCode: 'TR', population: 15_000_000 },
  { name: 'Ankara', countryCode: 'TR', population: 5_600_000 },
  { name: 'Izmir', countryCode: 'TR', population: 4_300_000 },
  { name: 'Antalya', countryCode: 'TR', population: 2_500_000 },
  { name: 'Bursa', countryCode: 'TR', population: 3_000_000 },

  // USA (US)
  { name: 'New York', countryCode: 'US', population: 8_300_000 },
  { name: 'Los Angeles', countryCode: 'US', population: 4_000_000 },
  { name: 'Chicago', countryCode: 'US', population: 2_700_000 },
  { name: 'Houston', countryCode: 'US', population: 2_300_000 },
  { name: 'Phoenix', countryCode: 'US', population: 1_700_000 },
  { name: 'San Francisco', countryCode: 'US', population: 880_000 },
  { name: 'Seattle', countryCode: 'US', population: 750_000 },
  { name: 'Miami', countryCode: 'US', population: 470_000 },

  // Canada (CA)
  { name: 'Toronto', countryCode: 'CA', population: 2_900_000 },
  { name: 'Montreal', countryCode: 'CA', population: 1_700_000 },
  { name: 'Vancouver', countryCode: 'CA', population: 675_000 },
  { name: 'Calgary', countryCode: 'CA', population: 1_300_000 },
  { name: 'Ottawa', countryCode: 'CA', population: 1_000_000 },

  // China (CN)
  { name: 'Shanghai', countryCode: 'CN', population: 24_000_000 },
  { name: 'Beijing', countryCode: 'CN', population: 21_000_000 },
  { name: 'Shenzhen', countryCode: 'CN', population: 12_000_000 },
  { name: 'Guangzhou', countryCode: 'CN', population: 14_000_000 },
  { name: 'Chengdu', countryCode: 'CN', population: 16_000_000 },

  // Japan (JP)
  { name: 'Tokyo', countryCode: 'JP', population: 14_000_000 },
  { name: 'Osaka', countryCode: 'JP', population: 2_700_000 },
  { name: 'Kyoto', countryCode: 'JP', population: 1_500_000 },
  { name: 'Yokohama', countryCode: 'JP', population: 3_700_000 },
  { name: 'Nagoya', countryCode: 'JP', population: 2_300_000 },

  // India (IN)
  { name: 'Mumbai', countryCode: 'IN', population: 20_000_000 },
  { name: 'Delhi', countryCode: 'IN', population: 19_000_000 },
  { name: 'Bangalore', countryCode: 'IN', population: 12_000_000 },
  { name: 'Hyderabad', countryCode: 'IN', population: 10_000_000 },
  { name: 'Chennai', countryCode: 'IN', population: 10_000_000 },

  // Brazil (BR)
  { name: 'São Paulo', countryCode: 'BR', population: 12_000_000 },
  { name: 'Rio de Janeiro', countryCode: 'BR', population: 6_700_000 },
  { name: 'Brasília', countryCode: 'BR', population: 3_000_000 },
  { name: 'Salvador', countryCode: 'BR', population: 2_900_000 },
  { name: 'Fortaleza', countryCode: 'BR', population: 2_600_000 },

  // Australia (AU)
  { name: 'Sydney', countryCode: 'AU', population: 5_300_000 },
  { name: 'Melbourne', countryCode: 'AU', population: 5_000_000 },
  { name: 'Brisbane', countryCode: 'AU', population: 2_500_000 },
  { name: 'Perth', countryCode: 'AU', population: 2_100_000 },
  { name: 'Adelaide', countryCode: 'AU', population: 1_300_000 },

  // Malaysia (MY)
  { name: 'Kuala Lumpur', countryCode: 'MY', population: 1_800_000 },
  { name: 'George Town', countryCode: 'MY', population: 700_000 },
  { name: 'Johor Bahru', countryCode: 'MY', population: 500_000 },
  { name: 'Ipoh', countryCode: 'MY', population: 700_000 },
  { name: 'Shah Alam', countryCode: 'MY', population: 600_000 },

  // Singapore (SG)
  { name: 'Singapore', countryCode: 'SG', population: 5_700_000 },

  // Thailand (TH)
  { name: 'Bangkok', countryCode: 'TH', population: 10_500_000 },
  { name: 'Chiang Mai', countryCode: 'TH', population: 130_000 },
  { name: 'Phuket', countryCode: 'TH', population: 400_000 },
  { name: 'Pattaya', countryCode: 'TH', population: 120_000 },
  { name: 'Krabi', countryCode: 'TH', population: 50_000 },

  // Vietnam (VN)
  { name: 'Ho Chi Minh City', countryCode: 'VN', population: 9_000_000 },
  { name: 'Hanoi', countryCode: 'VN', population: 8_000_000 },
  { name: 'Da Nang', countryCode: 'VN', population: 1_200_000 },
  { name: 'Nha Trang', countryCode: 'VN', population: 500_000 },
  { name: 'Hue', countryCode: 'VN', population: 350_000 },

  // South Korea (KR)
  { name: 'Seoul', countryCode: 'KR', population: 9_700_000 },
  { name: 'Busan', countryCode: 'KR', population: 3_400_000 },
  { name: 'Incheon', countryCode: 'KR', population: 3_000_000 },
  { name: 'Daegu', countryCode: 'KR', population: 2_400_000 },
  { name: 'Daejeon', countryCode: 'KR', population: 1_500_000 },

  // Indonesia (ID)
  { name: 'Jakarta', countryCode: 'ID', population: 10_500_000 },
  { name: 'Surabaya', countryCode: 'ID', population: 2_900_000 },
  { name: 'Bandung', countryCode: 'ID', population: 2_500_000 },
  { name: 'Medan', countryCode: 'ID', population: 2_400_000 },
  { name: 'Bali', countryCode: 'ID', population: 4_300_000 },

  // UAE (AE)
  { name: 'Dubai', countryCode: 'AE', population: 3_400_000 },
  { name: 'Abu Dhabi', countryCode: 'AE', population: 1_500_000 },
  { name: 'Sharjah', countryCode: 'AE', population: 1_400_000 },
  { name: 'Ajman', countryCode: 'AE', population: 500_000 },
  { name: 'Ras Al Khaimah', countryCode: 'AE', population: 400_000 },

  // Mexico (MX)
  { name: 'Mexico City', countryCode: 'MX', population: 9_200_000 },
  { name: 'Guadalajara', countryCode: 'MX', population: 1_500_000 },
  { name: 'Monterrey', countryCode: 'MX', population: 1_100_000 },
  { name: 'Puebla', countryCode: 'MX', population: 1_700_000 },
  { name: 'Cancún', countryCode: 'MX', population: 900_000 },

  // Argentina (AR)
  { name: 'Buenos Aires', countryCode: 'AR', population: 3_000_000 },
  { name: 'Córdoba', countryCode: 'AR', population: 1_400_000 },
  { name: 'Rosario', countryCode: 'AR', population: 1_000_000 },
  { name: 'Mendoza', countryCode: 'AR', population: 115_000 },
  { name: 'La Plata', countryCode: 'AR', population: 650_000 },

  // Chile (CL)
  { name: 'Santiago', countryCode: 'CL', population: 6_300_000 },
  { name: 'Valparaíso', countryCode: 'CL', population: 300_000 },
  { name: 'Concepción', countryCode: 'CL', population: 220_000 },
  { name: 'La Serena', countryCode: 'CL', population: 200_000 },
  { name: 'Antofagasta', countryCode: 'CL', population: 400_000 },

  // Colombia (CO)
  { name: 'Bogotá', countryCode: 'CO', population: 7_400_000 },
  { name: 'Medellín', countryCode: 'CO', population: 2_500_000 },
  { name: 'Cali', countryCode: 'CO', population: 2_200_000 },
  { name: 'Cartagena', countryCode: 'CO', population: 1_000_000 },
  { name: 'Barranquilla', countryCode: 'CO', population: 1_200_000 },

  // Peru (PE)
  { name: 'Lima', countryCode: 'PE', population: 9_700_000 },
  { name: 'Arequipa', countryCode: 'PE', population: 1_000_000 },
  { name: 'Trujillo', countryCode: 'PE', population: 900_000 },
  { name: 'Cusco', countryCode: 'PE', population: 430_000 },
  { name: 'Chiclayo', countryCode: 'PE', population: 600_000 },

  // South Africa (ZA)
  { name: 'Johannesburg', countryCode: 'ZA', population: 5_600_000 },
  { name: 'Cape Town', countryCode: 'ZA', population: 4_600_000 },
  { name: 'Durban', countryCode: 'ZA', population: 3_700_000 },
  { name: 'Pretoria', countryCode: 'ZA', population: 2_500_000 },
  { name: 'Port Elizabeth', countryCode: 'ZA', population: 1_300_000 },

  // Egypt (EG)
  { name: 'Cairo', countryCode: 'EG', population: 20_000_000 },
  { name: 'Alexandria', countryCode: 'EG', population: 5_200_000 },
  { name: 'Giza', countryCode: 'EG', population: 8_800_000 },
  { name: 'Sharm El Sheikh', countryCode: 'EG', population: 73_000 },
  { name: 'Luxor', countryCode: 'EG', population: 500_000 },

  // Nigeria (NG)
  { name: 'Lagos', countryCode: 'NG', population: 14_000_000 },
  { name: 'Kano', countryCode: 'NG', population: 3_900_000 },
  { name: 'Ibadan', countryCode: 'NG', population: 3_500_000 },
  { name: 'Abuja', countryCode: 'NG', population: 3_000_000 },
  { name: 'Port Harcourt', countryCode: 'NG', population: 1_900_000 },

  // Kenya (KE)
  { name: 'Nairobi', countryCode: 'KE', population: 4_400_000 },
  { name: 'Mombasa', countryCode: 'KE', population: 1_200_000 },
  { name: 'Kisumu', countryCode: 'KE', population: 600_000 },
  { name: 'Nakuru', countryCode: 'KE', population: 570_000 },
  { name: 'Eldoret', countryCode: 'KE', population: 475_000 },

  // Morocco (MA)
  { name: 'Casablanca', countryCode: 'MA', population: 3_700_000 },
  { name: 'Rabat', countryCode: 'MA', population: 580_000 },
  { name: 'Marrakech', countryCode: 'MA', population: 930_000 },
  { name: 'Fez', countryCode: 'MA', population: 1_200_000 },
  { name: 'Tangier', countryCode: 'MA', population: 950_000 },

  // New Zealand (NZ)
  { name: 'Auckland', countryCode: 'NZ', population: 1_700_000 },
  { name: 'Wellington', countryCode: 'NZ', population: 215_000 },
  { name: 'Christchurch', countryCode: 'NZ', population: 380_000 },
  { name: 'Hamilton', countryCode: 'NZ', population: 180_000 },
  { name: 'Tauranga', countryCode: 'NZ', population: 155_000 },

  // Netherlands (NL)
  { name: 'Amsterdam', countryCode: 'NL', population: 870_000 },
  { name: 'Rotterdam', countryCode: 'NL', population: 650_000 },
  { name: 'The Hague', countryCode: 'NL', population: 545_000 },
  { name: 'Utrecht', countryCode: 'NL', population: 360_000 },
  { name: 'Eindhoven', countryCode: 'NL', population: 235_000 },

  // Belgium (BE)
  { name: 'Brussels', countryCode: 'BE', population: 1_200_000 },
  { name: 'Antwerp', countryCode: 'BE', population: 530_000 },
  { name: 'Ghent', countryCode: 'BE', population: 265_000 },
  { name: 'Bruges', countryCode: 'BE', population: 118_000 },
  { name: 'Liège', countryCode: 'BE', population: 198_000 },

  // Switzerland (CH)
  { name: 'Zurich', countryCode: 'CH', population: 420_000 },
  { name: 'Geneva', countryCode: 'CH', population: 200_000 },
  { name: 'Basel', countryCode: 'CH', population: 177_000 },
  { name: 'Bern', countryCode: 'CH', population: 133_000 },
  { name: 'Lausanne', countryCode: 'CH', population: 140_000 },

  // Austria (AT)
  { name: 'Vienna', countryCode: 'AT', population: 1_900_000 },
  { name: 'Graz', countryCode: 'AT', population: 290_000 },
  { name: 'Linz', countryCode: 'AT', population: 206_000 },
  { name: 'Salzburg', countryCode: 'AT', population: 156_000 },
  { name: 'Innsbruck', countryCode: 'AT', population: 132_000 },

  // Poland (PL)
  { name: 'Warsaw', countryCode: 'PL', population: 1_800_000 },
  { name: 'Kraków', countryCode: 'PL', population: 780_000 },
  { name: 'Wrocław', countryCode: 'PL', population: 640_000 },
  { name: 'Gdańsk', countryCode: 'PL', population: 470_000 },
  { name: 'Poznań', countryCode: 'PL', population: 535_000 },
];

// Helper function to get cities by country code
export function getCitiesByCountryCode(countryCode: string): City[] {
  return cities.filter(
    (city) => city.countryCode === countryCode.toUpperCase()
  );
}

// Helper function to get cities by multiple country codes
export function getCitiesByCountryCodes(countryCodes: string[]): City[] {
  const upperCodes = countryCodes.map((c) => c.toUpperCase());
  return cities.filter((city) => upperCodes.includes(city.countryCode));
}

// Helper function to get cities by continent
export function getCitiesByContinent(continent: Continent): City[] {
  return cities.filter((city) => {
    const country = countryByCode.get(city.countryCode.toLowerCase());
    return country && country.continent === continent;
  });
}

// Helper function to get cities by multiple continents
export function getCitiesByContinents(continents: Continent[]): City[] {
  return cities.filter((city) => {
    const country = countryByCode.get(city.countryCode.toLowerCase());
    return country && continents.includes(country.continent);
  });
}
