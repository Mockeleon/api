/**
 * @fileoverview Schema Generator Configuration
 *
 * This file contains all static mappings and descriptions for the schema generator.
 * When adding new fields or updating existing ones, update this config file.
 *
 * What to update:
 * - CATEGORY_PATTERNS: Add pattern for new field categories
 * - PARAMETER_DESCRIPTIONS: Add descriptions for new parameters
 * - Field-specific metadata if needed
 *
 * @module scripts/generate-schema-config
 */

/**
 * Category patterns for automatic field categorization
 * Order matters - first match wins
 */
export const CATEGORY_PATTERNS = [
  {
    category: 'Primitives',
    patterns: ['int', 'float', 'boolean', 'string', 'date', 'uuid', 'hash'],
    description: 'Basic primitive data types',
  },
  {
    category: 'Personal Data',
    patterns: [/name/, /email/, /phone/, /username/],
    description: 'Personal and identity information',
  },
  {
    category: 'Location',
    patterns: [/city/, /country/, /street/, /zip/, /location/, /address/],
    description: 'Geographic and location data',
  },
  {
    category: 'Financial',
    patterns: [/price/, /currency/, /iban/, /payment/, /money/],
    description: 'Financial and payment data',
  },
  {
    category: 'Internet',
    patterns: [/url/, /ip/, /mac/, /color/, /domain/],
    description: 'Internet and network related data',
  },
  {
    category: 'Files',
    patterns: [/file/, /filename/, /filesize/],
    description: 'File system related data',
  },
  {
    category: 'Crypto',
    patterns: [/crypto/],
    description: 'Cryptocurrency related data',
  },
  {
    category: 'Product',
    patterns: [/product/],
    description: 'E-commerce product data',
  },
  {
    category: 'Complex',
    patterns: ['array', 'object'],
    description: 'Complex nested data structures',
  },
] as const;

/**
 * Default category for fields that don't match any pattern
 */
export const DEFAULT_CATEGORY = 'Other';

/**
 * Parameter descriptions for common field parameters
 * Auto-generated descriptions use these mappings
 */
export const PARAMETER_DESCRIPTIONS: Record<string, string> = {
  // Base field parameters
  nullable: 'Whether this field can generate null values',
  nullableRate: 'Probability (0-1) of generating null when nullable is true',

  // Numeric constraints
  min: 'Minimum value (inclusive)',
  max: 'Maximum value (inclusive)',
  minValue: 'Minimum numeric value',
  maxValue: 'Maximum numeric value',
  precision: 'Number of decimal places',

  // String constraints
  minLength: 'Minimum string length',
  maxLength: 'Maximum string length',
  length: 'Exact string length',

  // Format and type options
  format: 'Output format',
  kind: 'Type or style of generated data',
  type: 'Data type variant',
  version: 'Version or variant of the format',

  // Language and localization
  lang: 'Language code for generated data (e.g., "en", "tr")',
  locale: 'Locale for formatting',

  // Relations and dependencies
  basedOn: 'Reference to another field to derive value from',

  // Array and collection parameters
  count: 'Number of items to generate',
  item: 'Schema definition for array items',
  data: 'Predefined data array to pick from',
  pickCount: 'Number of items to randomly select from data array',

  // Object parameters
  fields: 'Object field definitions',

  // Name-specific
  gender: 'Gender for name generation ("male", "female", or "any")',
  tripleNameRate: 'Probability (0-1) of generating triple names',

  // Email-specific
  domains: 'Custom email domains (e.g., ["example.com", "test.io"])',

  // String generation
  paragraphCount: 'Number of paragraphs to generate',

  // URL-specific
  includePort: 'Whether to include port number in URL',
  protocol: 'URL protocol ("http", "https", or "any")',

  // IP-specific
  // (version already defined above)

  // Location-specific
  continents: 'Filter by continent codes',
  countries: 'Filter by country codes',
  name: 'Specific name or identifier to use',

  // Crypto-specific
  chain: 'Blockchain network',
  algorithm: 'Hash algorithm',
};

/**
 * Field description templates
 * Used to generate human-readable descriptions for field types
 */
export const FIELD_DESCRIPTION_TEMPLATES: Record<string, string> = {
  // If a field needs a custom description, add it here
  // Otherwise, auto-generated description will be used
  array: 'Generates arrays of items with configurable count and type',
  object: 'Generates nested objects with custom field definitions',
  string: 'Generates text strings (words, sentences, or paragraphs)',
  int: 'Generates random integer numbers within specified range',
  float: 'Generates random floating-point numbers with precision',
  boolean: 'Generates random true/false boolean values',
  uuid: 'Generates RFC4122 compliant UUID strings',
  date: 'Generates random date values within specified range',
  name: 'Generates realistic person names with language support',
  email: 'Generates realistic email addresses based on names',
  phone: 'Generates phone numbers with country code support',
  url: 'Generates valid URLs with customizable protocols',
  location: 'Generates geographic coordinates (latitude/longitude)',
  price: 'Generates monetary values with currency formatting',
  product: 'Generates product names from various categories',
};

/**
 * Schema version
 */
export const SCHEMA_VERSION = '1.0.0';
