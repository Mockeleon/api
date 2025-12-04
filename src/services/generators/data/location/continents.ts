export const continents = [
  'africa',
  'asia',
  'europe',
  'north-america',
  'south-america',
  'oceania',
] as const;

export type Continent = (typeof continents)[number];
